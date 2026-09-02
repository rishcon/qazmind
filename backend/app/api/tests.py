from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Set
from datetime import datetime
import random

from app.db.database import get_db
from app.db.models import Question, TestAttempt, WrongAnswer
from app.schemas.schemas import TestCreate, TestAttemptResponse, TestSubmit, TestResult, QuestionForTest
from app.core.deps import get_current_user_optional

router = APIRouter()


def _get_attempt_question_ids(test_attempt: TestAttempt) -> Set[int]:
    """Extract question IDs bound to attempt from options mapping."""
    question_ids: Set[int] = set()
    options_mapping = test_attempt.options_mapping or {}

    for raw_id in options_mapping.keys():
        try:
            question_ids.add(int(raw_id))
        except (TypeError, ValueError):
            continue

    return question_ids


def _ensure_attempt_access(test_attempt: TestAttempt, current_user) -> None:
    """Ensure only attempt owner can submit or read results for authenticated attempts."""
    if test_attempt.user_id is None:
        return

    if not current_user or current_user.id != test_attempt.user_id:
        raise HTTPException(status_code=403, detail="Access denied to this test attempt")


def _build_test_result_payload(
    test_attempt: TestAttempt,
    answers: Dict[int, int],
    db: Session,
    current_user=None,
    track_wrong_answers: bool = False
):
    options_mapping = test_attempt.options_mapping or {}
    allowed_question_ids = _get_attempt_question_ids(test_attempt)

    if not allowed_question_ids:
        raise HTTPException(status_code=400, detail="Test attempt data is invalid")

    normalized_answers: Dict[int, int] = {}
    for raw_question_id, raw_answer_index in (answers or {}).items():
        try:
            question_id = int(raw_question_id)
            user_answer_index = int(raw_answer_index)
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="Invalid answer payload")

        if question_id not in allowed_question_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Question {question_id} does not belong to this test attempt"
            )

        mapping = options_mapping.get(str(question_id))
        if not isinstance(mapping, list) or len(mapping) == 0:
            raise HTTPException(status_code=400, detail=f"Attempt mapping is invalid for question {question_id}")

        if user_answer_index < 0 or user_answer_index >= len(mapping):
            raise HTTPException(status_code=400, detail=f"Answer index out of range for question {question_id}")

        normalized_answers[question_id] = user_answer_index

    question_ids = list(normalized_answers.keys())
    questions = (
        db.query(Question)
        .filter(
            Question.id.in_(question_ids),
            Question.subject_id == test_attempt.subject_id
        )
        .all()
        if question_ids
        else []
    )
    questions_by_id = {question.id: question for question in questions}

    if len(questions_by_id) != len(question_ids):
        raise HTTPException(status_code=400, detail="Some submitted questions are invalid for this attempt")

    score = 0
    wrong_questions = []

    for question_id, user_answer_index in normalized_answers.items():
        question = questions_by_id[question_id]
        text = question.text_kz if test_attempt.language == "kz" else question.text_ru
        options = question.options_kz if test_attempt.language == "kz" else question.options_ru

        mapping = options_mapping.get(str(question_id))
        if not isinstance(mapping, list) or len(mapping) != len(options):
            raise HTTPException(status_code=400, detail=f"Attempt mapping is inconsistent for question {question_id}")

        try:
            shuffled_options = [options[int(index)] for index in mapping]
            original_user_answer_index = int(mapping[user_answer_index])
        except (TypeError, ValueError, IndexError):
            raise HTTPException(status_code=400, detail=f"Attempt mapping is corrupted for question {question_id}")

        if original_user_answer_index < 0 or original_user_answer_index >= len(options):
            raise HTTPException(status_code=400, detail=f"Mapped answer index is invalid for question {question_id}")

        if question.correct_answer_index == original_user_answer_index:
            score += 1
            continue

        if track_wrong_answers and current_user and test_attempt.user_id == current_user.id:
            wrong_answer = db.query(WrongAnswer).filter(
                WrongAnswer.user_id == current_user.id,
                WrongAnswer.question_id == question.id
            ).first()

            if wrong_answer:
                wrong_answer.wrong_count += 1
                wrong_answer.last_wrong_at = datetime.utcnow()
            else:
                db.add(WrongAnswer(
                    user_id=current_user.id,
                    question_id=question.id,
                    wrong_count=1
                ))

        wrong_questions.append({
            "question_id": question.id,
            "question_text": text,
            "user_answer": shuffled_options[user_answer_index],
            "correct_answer": options[question.correct_answer_index],
            "user_answer_index": user_answer_index
        })

    return {
        "score": score,
        "wrong_questions": wrong_questions,
        "answers": normalized_answers
    }


@router.post("/new", response_model=TestAttemptResponse)
async def create_test(
    test_data: TestCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Create new test attempt and return questions."""

    if test_data.mode == "wrong_only":
        if not current_user:
            raise HTTPException(status_code=401, detail="Authentication required for wrong_only mode")

        wrong_answers = db.query(WrongAnswer).filter(
            WrongAnswer.user_id == current_user.id,
            WrongAnswer.is_active == True
        ).all()

        question_ids = [wa.question_id for wa in wrong_answers]
        questions = db.query(Question).filter(
            Question.id.in_(question_ids),
            Question.subject_id == test_data.subject_id,
            Question.status == "active"
        ).limit(test_data.count).all()
    else:
        questions = db.query(Question).filter(
            Question.subject_id == test_data.subject_id,
            Question.status == "active"
        ).all()
        questions = random.sample(questions, min(test_data.count, len(questions)))

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")

    test_attempt = TestAttempt(
        user_id=current_user.id if current_user else None,
        subject_id=test_data.subject_id,
        language=test_data.language,
        mode=test_data.mode,
        score=0,
        total=len(questions),
        answers={}
    )

    db.add(test_attempt)
    db.commit()
    db.refresh(test_attempt)

    questions_for_test = []
    options_mapping = {}

    for question in questions:
        options = question.options_kz if test_data.language == "kz" else question.options_ru
        indices = list(range(len(options)))
        random.shuffle(indices)
        shuffled_options = [options[i] for i in indices]
        options_mapping[str(question.id)] = indices

        questions_for_test.append(QuestionForTest(
            id=question.id,
            text=question.text_kz if test_data.language == "kz" else question.text_ru,
            options=shuffled_options
        ))

    test_attempt.options_mapping = options_mapping
    db.commit()

    return TestAttemptResponse(
        attempt_id=test_attempt.id,
        questions=questions_for_test
    )


@router.post("/{attempt_id}/submit", response_model=TestResult)
async def submit_test(
    attempt_id: int,
    submission: TestSubmit,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Submit test answers and calculate validated results."""

    test_attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not test_attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    _ensure_attempt_access(test_attempt, current_user)

    result_payload = _build_test_result_payload(
        test_attempt=test_attempt,
        answers=submission.answers,
        db=db,
        current_user=current_user,
        track_wrong_answers=True
    )

    test_attempt.score = result_payload["score"]
    test_attempt.answers = {str(question_id): answer for question_id, answer in result_payload["answers"].items()}
    db.commit()

    return TestResult(
        attempt_id=attempt_id,
        score=result_payload["score"],
        total=test_attempt.total,
        wrong_questions=result_payload["wrong_questions"],
        subject_id=test_attempt.subject_id
    )


@router.post("/{attempt_id}/abandon", response_model=TestResult)
async def abandon_test(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Finish an abandoned attempt with a zero score and no retained answers."""
    test_attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not test_attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    _ensure_attempt_access(test_attempt, current_user)
    test_attempt.answers = {}
    test_attempt.score = 0
    db.commit()

    return TestResult(
        attempt_id=attempt_id,
        score=0,
        total=test_attempt.total,
        wrong_questions=[],
        subject_id=test_attempt.subject_id,
    )


@router.get("/{attempt_id}/result", response_model=TestResult)
async def get_test_result(
    attempt_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Get server-side validated test result by attempt ID."""

    test_attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id).first()
    if not test_attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    _ensure_attempt_access(test_attempt, current_user)

    result_payload = _build_test_result_payload(
        test_attempt=test_attempt,
        answers=test_attempt.answers or {},
        db=db,
        current_user=current_user,
        track_wrong_answers=False
    )

    return TestResult(
        attempt_id=attempt_id,
        score=result_payload["score"],
        total=test_attempt.total,
        wrong_questions=result_payload["wrong_questions"],
        subject_id=test_attempt.subject_id
    )

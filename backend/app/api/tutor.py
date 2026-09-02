from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.database import get_db
from app.db.models import AiExplanation, AiTutorMessage, AiTutorSession, Question, Subject
from app.schemas.schemas import (
    TutorReviewRequest,
    TutorReviewResponse,
    TutorSessionResponse,
    TutorStartRequest,
    TutorMessageResponse,
)
from app.services.ai_service import generate_tutor_lesson, review_student_answer

router = APIRouter(prefix="/api/tutor", tags=["tutor"])


def _collect_topic_facts(db: Session, subject_id: int, topic: str, language: str) -> str:
    query = db.query(Question).filter(Question.subject_id == subject_id)
    if topic:
        # SQLite lower() is ASCII-only and breaks matching for Kazakh/Cyrillic
        # topics. The topic list is returned from this same column, so an exact
        # trimmed comparison is both reliable and sufficient.
        query = query.filter(func.trim(Question.topic) == topic.strip())

    rows = query.limit(12).all()
    if not rows:
        return ""

    chunks = []
    for question in rows:
        question_text = question.text_kz if language == "kz" else question.text_ru
        fact = question.fact_snippet_kz if language == "kz" else question.fact_snippet_ru
        # Imported content can contain a source snippet in only one language.
        # It is still a valid source for the lesson, so use the available one.
        if not fact:
            fact = question.fact_snippet_ru if language == "kz" else question.fact_snippet_kz
        if not fact:
            continue
        chunks.append(f"- {question_text}\n  {fact}")

    return "\n".join(chunks[:10])


def _rate_limit_check(db: Session, user_id: int) -> None:
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    recent_requests = db.query(AiExplanation).filter(
        AiExplanation.user_id == user_id,
        AiExplanation.created_at >= one_hour_ago
    ).count()
    recent_tutor_messages = db.query(AiTutorMessage).join(AiTutorSession).filter(
        AiTutorSession.user_id == user_id,
        AiTutorMessage.created_at >= one_hour_ago
    ).count()

    if recent_requests + recent_tutor_messages >= settings.AI_TUTOR_REQUESTS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {settings.AI_TUTOR_REQUESTS_PER_HOUR} AI tutor requests per hour"
        )


def _serialize_session(session: AiTutorSession) -> TutorSessionResponse:
    lesson_payload = next(
        (message.content for message in session.messages if message.kind == "lesson"),
        None
    )
    similar_questions = []
    comparison_text = ""

    if lesson_payload:
        import json
        try:
            lesson_meta = json.loads(lesson_payload)
            similar_questions = lesson_meta.get("similar_questions", [])
            comparison_text = lesson_meta.get("comparison_text", "")
        except Exception:
            similar_questions = []
            comparison_text = ""

    visible_messages = [
        TutorMessageResponse(
            role=message.role,
            kind=message.kind,
            content=message.content,
            score=message.score,
            created_at=message.created_at,
        )
        for message in session.messages
        if message.kind != "lesson"
    ]

    return TutorSessionResponse(
        session_id=session.id,
        subject_id=session.subject_id,
        topic=session.topic,
        language=session.language,
        lesson_text=session.lesson_text,
        assignment_prompt=session.assignment_prompt,
        similar_questions=similar_questions,
        comparison_text=comparison_text,
        messages=visible_messages,
    )


@router.get("/subjects/{subject_id}/topics")
async def get_subject_topics(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Do not offer topics that cannot start a grounded AI lesson.  A topic is
    # available when at least one of its questions has a source snippet.
    topics = [
        row[0]
        for row in db.query(Question.topic)
        .filter(
            Question.subject_id == subject_id,
            Question.topic.isnot(None),
            func.trim(Question.topic) != "",
            (Question.fact_snippet_kz.isnot(None) & (func.trim(Question.fact_snippet_kz) != ""))
            | (Question.fact_snippet_ru.isnot(None) & (func.trim(Question.fact_snippet_ru) != "")),
        )
        .distinct()
        .order_by(Question.topic.asc())
        .all()
    ]

    return {
        "subject_id": subject.id,
        "subject_name_kz": subject.name_kz,
        "subject_name_ru": subject.name_ru,
        "topics": topics,
    }


@router.post("/session", response_model=TutorSessionResponse)
async def start_tutor_session(
    request: TutorStartRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if request.language not in {"kz", "ru"}:
        raise HTTPException(status_code=400, detail="Invalid language")

    subject = db.query(Subject).filter(Subject.id == request.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    _rate_limit_check(db, current_user.id)

    facts = _collect_topic_facts(db, request.subject_id, request.topic, request.language)
    if not facts:
        raise HTTPException(status_code=404, detail="No source material found for this topic")

    subject_name = subject.name_kz if request.language == "kz" else subject.name_ru
    lesson_data = await generate_tutor_lesson(
        subject_name=subject_name,
        topic=request.topic,
        facts=facts,
        language=request.language,
    )

    session = AiTutorSession(
        user_id=current_user.id,
        subject_id=request.subject_id,
        topic=request.topic,
        language=request.language,
        lesson_text=lesson_data["lesson_text"],
        assignment_prompt=lesson_data["assignment_prompt"],
        reference_answer=lesson_data["reference_answer"],
    )
    db.add(session)
    db.flush()

    import json

    db.add(
        AiTutorMessage(
            session_id=session.id,
            role="assistant",
            kind="lesson",
            content=json.dumps(
                {
                    "comparison_text": lesson_data["comparison_text"],
                    "similar_questions": lesson_data["similar_questions"],
                },
                ensure_ascii=False,
            ),
        )
    )
    db.commit()
    db.refresh(session)

    return _serialize_session(session)


@router.get("/session/{session_id}", response_model=TutorSessionResponse)
async def get_tutor_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    session = db.query(AiTutorSession).filter(AiTutorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Tutor session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _serialize_session(session)


@router.post("/session/{session_id}/review", response_model=TutorReviewResponse)
async def review_tutor_answer(
    session_id: int,
    request: TutorReviewRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if request.language not in {"kz", "ru"}:
        raise HTTPException(status_code=400, detail="Invalid language")

    session = db.query(AiTutorSession).filter(AiTutorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Tutor session not found")
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    answer_text = request.answer_text.strip()
    if len(answer_text) < 20:
        raise HTTPException(status_code=400, detail="Answer is too short")

    _rate_limit_check(db, current_user.id)

    subject = db.query(Subject).filter(Subject.id == session.subject_id).first()
    subject_name = subject.name_kz if request.language == "kz" else subject.name_ru

    review_data = await review_student_answer(
        subject_name=subject_name,
        topic=session.topic,
        assignment_prompt=session.assignment_prompt,
        reference_answer=session.reference_answer,
        student_answer=answer_text,
        language=request.language,
    )

    db.add(
        AiTutorMessage(
            session_id=session.id,
            role="student",
            kind="submission",
            content=answer_text,
        )
    )
    db.add(
        AiTutorMessage(
            session_id=session.id,
            role="assistant",
            kind="feedback",
            content=review_data["feedback_text"],
            score=review_data["score"],
        )
    )
    session.updated_at = datetime.utcnow()
    db.commit()

    return TutorReviewResponse(
        feedback_text=review_data["feedback_text"],
        score=review_data["score"],
        strengths=review_data["strengths"],
        improvements=review_data["improvements"],
        model_answer=review_data["model_answer"],
    )

from datetime import datetime, timedelta
import hashlib

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.db.database import get_db
from app.db.models import AiExplanation, Question, TestAttempt
from app.schemas.schemas import ExplainRequest, ExplainResponse
from app.services.ai_service import generate_explanation

router = APIRouter()


def _extract_attempt_question_ids(test_attempt: TestAttempt) -> set[int]:
    question_ids: set[int] = set()

    for raw_id in (test_attempt.options_mapping or {}).keys():
        try:
            question_ids.add(int(raw_id))
        except (TypeError, ValueError):
            continue

    if not question_ids:
        for raw_id in (test_attempt.answers or {}).keys():
            try:
                question_ids.add(int(raw_id))
            except (TypeError, ValueError):
                continue

    return question_ids


@router.post("/{question_id}/explain", response_model=ExplainResponse)
async def explain_error(
    question_id: int,
    request: ExplainRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Get AI explanation for wrong answer."""
    if request.language not in {"kz", "ru"}:
        raise HTTPException(status_code=400, detail="Invalid language")

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    test_attempt = db.query(TestAttempt).filter(TestAttempt.id == request.attempt_id).first()
    if not test_attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if test_attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied to this test attempt")

    if test_attempt.language != request.language:
        raise HTTPException(status_code=400, detail="Language does not match test attempt")

    attempt_question_ids = _extract_attempt_question_ids(test_attempt)
    if question_id not in attempt_question_ids:
        raise HTTPException(status_code=400, detail="Question does not belong to this test attempt")

    text = question.text_kz if request.language == "kz" else question.text_ru
    options = question.options_kz if request.language == "kz" else question.options_ru
    fact_snippet = question.fact_snippet_kz if request.language == "kz" else question.fact_snippet_ru

    if request.user_answer_index < 0 or request.user_answer_index >= len(options):
        raise HTTPException(status_code=400, detail="user_answer_index out of range")

    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    recent_explanations = db.query(AiExplanation).filter(
        AiExplanation.user_id == current_user.id,
        AiExplanation.created_at >= one_hour_ago
    ).count()
    if recent_explanations >= settings.AI_EXPLANATIONS_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {settings.AI_EXPLANATIONS_PER_HOUR} explanations per hour"
        )

    cache_key = f"{current_user.id}_{question_id}_{request.user_answer_index}_{request.language}"
    cache_hash = hashlib.md5(cache_key.encode()).hexdigest()

    cached = db.query(AiExplanation).filter(
        AiExplanation.question_id == question_id,
        AiExplanation.user_answer_index == request.user_answer_index,
        AiExplanation.language == request.language,
        AiExplanation.prompt_hash == cache_hash
    ).first()
    if cached:
        return ExplainResponse(explanation_text=cached.response_text)

    user_answer = options[request.user_answer_index]
    correct_answer = options[question.correct_answer_index]

    try:
        explanation_text = await generate_explanation(
            question_text=text,
            options=options,
            facts=fact_snippet or "Insufficient source data.",
            user_answer=user_answer,
            correct_answer=correct_answer,
            language=request.language
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(exc)}")

    db.add(AiExplanation(
        user_id=current_user.id,
        question_id=question_id,
        user_answer_index=request.user_answer_index,
        language=request.language,
        model=settings.OPENAI_MODEL,
        prompt_hash=cache_hash,
        response_text=explanation_text
    ))
    db.commit()

    return ExplainResponse(explanation_text=explanation_text)

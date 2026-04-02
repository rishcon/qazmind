from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import QuestionFeedback
from app.schemas.schemas import FeedbackCreate
from app.core.deps import get_current_user_optional

router = APIRouter()


@router.post("/question")
async def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """Submit feedback for a question"""
    
    new_feedback = QuestionFeedback(
        user_id=current_user.id if current_user else None,
        question_id=feedback.question_id,
        type=feedback.type,
        comment=feedback.comment
    )
    
    db.add(new_feedback)
    db.commit()
    
    return {"message": "Feedback submitted successfully"}

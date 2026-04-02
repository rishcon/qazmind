from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.bootstrap import ensure_default_subjects
from app.db.database import get_db
from app.db.models import Question, Subject

router = APIRouter(prefix="/api/subjects", tags=["subjects"])


@router.get("/")
async def get_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    if not subjects:
        ensure_default_subjects(db)
        subjects = db.query(Subject).all()

    question_counts = dict(
        db.query(Question.subject_id, func.count(Question.id))
        .group_by(Question.subject_id)
        .all()
    )

    return [
        {
            "id": subject.id,
            "name_kz": subject.name_kz,
            "name_ru": subject.name_ru,
            "icon": subject.icon,
            "questions_count": question_counts.get(subject.id, 0)
        }
        for subject in subjects
    ]


@router.get("/{subject_id}")
async def get_subject(subject_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    questions_count = (
        db.query(func.count(Question.id))
        .filter(Question.subject_id == subject_id)
        .scalar()
    ) or 0

    return {
        "id": subject.id,
        "name_kz": subject.name_kz,
        "name_ru": subject.name_ru,
        "icon": subject.icon,
        "questions_count": questions_count
    }

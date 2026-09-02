from datetime import date, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import get_password_hash, verify_password
from app.db.database import get_db
from app.db.models import AiExplanation, AiTutorMessage, AiTutorSession, FlashcardReview, QuestionFeedback, Subject, TestAttempt, User, WrongAnswer

router = APIRouter(prefix="/api/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    selected_subjects: Optional[List[int]] = None
    ent_date: Optional[str] = None
    daily_goal_minutes: Optional[int] = None
    first_name: Optional[str] = Field(default=None, max_length=80)
    last_name: Optional[str] = Field(default=None, max_length=80)
    middle_name: Optional[str] = Field(default=None, max_length=80)
    birth_date: Optional[date] = None


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1, max_length=256)
    new_password: str = Field(min_length=6, max_length=256)


class AccountDeletion(BaseModel):
    current_password: str = Field(min_length=1, max_length=256)
    email_confirmation: str = Field(min_length=3, max_length=320)


class SubjectStats(BaseModel):
    subject_id: int
    subject_name_kz: str
    subject_name_ru: str
    icon: str
    tests_completed: int
    total_questions: int
    correct_answers: int
    accuracy: float
    last_test_date: Optional[str] = None


@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "selected_subjects": current_user.selected_subjects or [],
        "ent_date": current_user.ent_date.isoformat() if current_user.ent_date else None,
        "daily_goal_minutes": current_user.daily_goal_minutes,
        "profile_completed": current_user.profile_completed,
        "created_at": current_user.created_at.isoformat()
        ,"first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "middle_name": current_user.middle_name,
        "birth_date": current_user.birth_date.date().isoformat() if current_user.birth_date else None,
    }


@router.put("/me")
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.selected_subjects is not None:
        current_user.selected_subjects = profile_data.selected_subjects
        current_user.profile_completed = True

    if profile_data.ent_date:
        current_user.ent_date = datetime.fromisoformat(profile_data.ent_date.replace("Z", "+00:00"))

    if profile_data.daily_goal_minutes is not None:
        current_user.daily_goal_minutes = profile_data.daily_goal_minutes

    for field in ("first_name", "last_name", "middle_name"):
        value = getattr(profile_data, field)
        if value is not None:
            setattr(current_user, field, value.strip() or None)

    if profile_data.birth_date is not None:
        current_user.birth_date = datetime.combine(profile_data.birth_date, datetime.min.time())

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "profile": {
            "selected_subjects": current_user.selected_subjects,
            "ent_date": current_user.ent_date.isoformat() if current_user.ent_date else None,
            "daily_goal_minutes": current_user.daily_goal_minutes,
            "profile_completed": current_user.profile_completed
            ,"first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "middle_name": current_user.middle_name,
            "birth_date": current_user.birth_date.date().isoformat() if current_user.birth_date else None,
        }
    }


@router.put("/password")
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    current_user.password_hash = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.delete("/me")
def delete_account(
    payload: AccountDeletion,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator account cannot be deleted here")
    if payload.email_confirmation.strip().lower() != current_user.email.lower():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email confirmation does not match")
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    # Explicitly remove user-owned records so account deletion is reliable for
    # existing SQLite databases that were created without cascade constraints.
    db.query(AiExplanation).filter(AiExplanation.user_id == current_user.id).delete(synchronize_session=False)
    db.query(WrongAnswer).filter(WrongAnswer.user_id == current_user.id).delete(synchronize_session=False)
    db.query(FlashcardReview).filter(FlashcardReview.user_id == current_user.id).delete(synchronize_session=False)
    db.query(QuestionFeedback).filter(QuestionFeedback.user_id == current_user.id).delete(synchronize_session=False)
    tutor_session_ids = db.query(AiTutorSession.id).filter(AiTutorSession.user_id == current_user.id)
    db.query(AiTutorMessage).filter(AiTutorMessage.session_id.in_(tutor_session_ids)).delete(synchronize_session=False)
    db.query(AiTutorSession).filter(AiTutorSession.user_id == current_user.id).delete(synchronize_session=False)
    db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).delete(synchronize_session=False)
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}


@router.get("/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    all_attempts = db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).all()
    if not all_attempts:
        return {
            "total_tests": 0,
            "total_questions": 0,
            "total_correct": 0,
            "average_score": 0,
            "study_time_minutes": 0,
            "subjects_stats": [],
            "recent_tests": []
        }

    total_tests = len(all_attempts)
    total_questions = sum(attempt.total for attempt in all_attempts)
    total_correct = sum(attempt.score for attempt in all_attempts)
    average_score = (total_correct / total_questions * 100) if total_questions > 0 else 0
    study_time_minutes = total_tests * 5

    selected_subjects = current_user.selected_subjects or []
    subjects_stats = []

    if selected_subjects:
        subjects = db.query(Subject).filter(Subject.id.in_(selected_subjects)).all()
        for subject in subjects:
            subject_attempts = db.query(TestAttempt).filter(
                TestAttempt.user_id == current_user.id,
                TestAttempt.subject_id == subject.id
            ).all()

            if not subject_attempts:
                subjects_stats.append({
                    "subject_id": subject.id,
                    "subject_name_kz": subject.name_kz,
                    "subject_name_ru": subject.name_ru,
                    "icon": subject.icon,
                    "tests_completed": 0,
                    "total_questions": 0,
                    "total_correct": 0,
                    "accuracy": 0,
                    "last_test_date": None
                })
                continue

            subject_tests_count = len(subject_attempts)
            subject_total_questions = sum(attempt.total for attempt in subject_attempts)
            subject_total_correct = sum(attempt.score for attempt in subject_attempts)
            subject_accuracy = (
                subject_total_correct / subject_total_questions * 100
                if subject_total_questions > 0 else 0
            )
            last_test = max(subject_attempts, key=lambda attempt: attempt.created_at)

            subjects_stats.append({
                "subject_id": subject.id,
                "subject_name_kz": subject.name_kz,
                "subject_name_ru": subject.name_ru,
                "icon": subject.icon,
                "tests_completed": subject_tests_count,
                "total_questions": subject_total_questions,
                "total_correct": subject_total_correct,
                "accuracy": round(subject_accuracy, 1),
                "last_test_date": last_test.created_at.isoformat() if last_test else None
            })

    recent_tests = db.query(TestAttempt).filter(
        TestAttempt.user_id == current_user.id
    ).order_by(TestAttempt.created_at.desc()).limit(5).all()

    recent_tests_data = []
    for test in recent_tests:
        subject = db.query(Subject).filter(Subject.id == test.subject_id).first()
        score_percent = round((test.score / test.total * 100), 1) if test.total > 0 else 0
        recent_tests_data.append({
            "id": test.id,
            "subject_name_kz": subject.name_kz if subject else "",
            "subject_name_ru": subject.name_ru if subject else "",
            "subject_icon": subject.icon if subject else "book",
            "score": score_percent,
            "total_correct": test.score,
            "total_questions": test.total,
            "completed_at": test.created_at.isoformat()
        })

    return {
        "total_tests": total_tests,
        "total_questions": total_questions,
        "total_correct": total_correct,
        "average_score": round(average_score, 1),
        "study_time_minutes": study_time_minutes,
        "subjects_stats": subjects_stats,
        "recent_tests": recent_tests_data
    }


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    recommendations = []

    if not current_user.selected_subjects:
        recommendations.append({
            "type": "setup",
            "priority": "high",
            "title_kz": "Пәндерді таңдаңыз",
            "title_ru": "Выберите предметы",
            "description_kz": "ҰБТ дайындығына пәндеріңізді белгілеңіз",
            "description_ru": "Выберите предметы для подготовки",
            "action": "select_subjects",
            "icon": "target"
        })
        return {"recommendations": recommendations}

    total_tests = db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).count()
    if total_tests == 0:
        recommendations.append({
            "type": "start",
            "priority": "high",
            "title_kz": "Алғашқы тестті бастаңыз",
            "title_ru": "Пройдите первый тест",
            "description_kz": "Білім деңгейін бағалау үшін тест өтіңіз",
            "description_ru": "Пройдите тест для оценки уровня знаний",
            "action": "start_test",
            "icon": "rocket"
        })

    for subject_id in current_user.selected_subjects:
        subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if not subject:
            continue

        attempts = db.query(TestAttempt).filter(
            TestAttempt.user_id == current_user.id,
            TestAttempt.subject_id == subject_id
        ).all()
        if not attempts:
            continue

        total_subject_questions = sum(attempt.total for attempt in attempts)
        total_subject_correct = sum(attempt.score for attempt in attempts)
        avg_score_percent = (
            total_subject_correct / total_subject_questions * 100
            if total_subject_questions > 0 else 0
        )

        if avg_score_percent < 60:
            recommendations.append({
                "type": "practice",
                "priority": "medium",
                "title_kz": f"{subject.name_kz} - көбірек жаттығу керек",
                "title_ru": f"{subject.name_ru} - требуется больше практики",
                "description_kz": f"Орташа балл: {avg_score_percent:.0f}%",
                "description_ru": f"Средний балл: {avg_score_percent:.0f}%",
                "action": "practice_subject",
                "subject_id": subject_id,
                "icon": subject.icon
            })

    recommendations.append({
        "type": "podcast",
        "priority": "low",
        "title_kz": "Подкаст тыңдаңыз",
        "title_ru": "Послушайте подкаст",
        "description_kz": "Жаңа AI подкастар қолжетімді",
        "description_ru": "Доступны новые AI подкасты",
        "action": "listen_podcast",
        "icon": "headphones"
    })

    return {"recommendations": recommendations}

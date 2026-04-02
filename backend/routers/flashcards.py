from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.db.database import get_db
from app.db.models import User, Flashcard, FlashcardReview, Subject
from app.core.deps import get_current_user, check_admin
from pydantic import BaseModel

router = APIRouter()


class FlashcardResponse(BaseModel):
    id: int
    subject_id: int
    front: str
    back: str
    hint: str | None
    status: str  # 'new', 'learning', 'review', 'mastered'
    interval: int  # дни до следующего повтора
    easiness_factor: float  # SuperMemo-2 фактор
    
    class Config:
        from_attributes = True


class ReviewRequest(BaseModel):
    card_id: int
    quality: int  # 0-5 (SuperMemo-2)


class StatsResponse(BaseModel):
    today: int
    total: int
    mastered: int


def calculate_next_review(quality: int, ef: float, interval: int, repetitions: int):
    """
    SuperMemo-2 алгоритм
    quality: 0-5 (0=полный провал, 5=идеально)
    ef: easiness factor (от 1.3)
    interval: текущий интервал в днях
    repetitions: количество успешных повторений
    """
    # Обновляем EF
    new_ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    new_ef = max(1.3, new_ef)  # Минимум 1.3
    
    # Если качество < 3, начинаем заново
    if quality < 3:
        new_repetitions = 0
        new_interval = 0
        minutes = 10  # Через 10 минут
        next_review = datetime.utcnow() + timedelta(minutes=minutes)
    else:
        new_repetitions = repetitions + 1
        
        if new_repetitions == 1:
            new_interval = 1  # 1 день
        elif new_repetitions == 2:
            new_interval = 6  # 6 дней
        else:
            new_interval = int(interval * new_ef)
        
        next_review = datetime.utcnow() + timedelta(days=new_interval)
    
    return new_ef, new_interval, new_repetitions, next_review


@router.get("/due/{subject_id}", response_model=List[FlashcardResponse])
async def get_due_cards(
    subject_id: int,
    language: str = "ru",
    filter_type: str = "all",  # all, new, learning, review, mastered
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить карточки, которые нужно повторить сегодня с фильтром"""
    # Получаем все карточки предмета
    cards = db.query(Flashcard).filter(Flashcard.subject_id == subject_id).all()
    
    due_cards = []
    now = datetime.utcnow()
    
    for card in cards:
        # Проверяем, есть ли у пользователя review для этой карточки
        review = db.query(FlashcardReview).filter(
            FlashcardReview.user_id == current_user.id,
            FlashcardReview.flashcard_id == card.id
        ).first()
        
        status = "new"
        interval = 0
        ef = 2.5
        
        if review is None:
            # Новая карточка
            status = "new"
            due_cards.append((card, review, status, interval, ef))
        elif review.is_mastered:
            status = "mastered"
            interval = review.interval
            ef = review.easiness_factor
            # Не добавляем освоенные в список для повторения
        elif review.repetitions < 3:
            status = "learning"
            interval = review.interval
            ef = review.easiness_factor
            if review.next_review <= now:
                due_cards.append((card, review, status, interval, ef))
        else:
            status = "review"
            interval = review.interval
            ef = review.easiness_factor
            if review.next_review <= now:
                due_cards.append((card, review, status, interval, ef))
    
    # Фильтруем по типу
    if filter_type != "all":
        due_cards = [(card, review, status, interval, ef) for card, review, status, interval, ef in due_cards if status == filter_type]
    
    language = language.lower()
    response_cards = []
    for card, review, status, interval, ef in due_cards[:20]:
        if language == "kz":
            front = card.front_kz or card.front
            back = card.back_kz or card.back
            hint = card.hint_kz or card.hint
        else:
            front = card.front
            back = card.back
            hint = card.hint

        response_cards.append({
            "id": card.id,
            "subject_id": card.subject_id,
            "front": front,
            "back": back,
            "hint": hint,
            "status": status,
            "interval": interval,
            "easiness_factor": ef
        })

    return response_cards  # Максимум 20 карточек за раз


@router.post("/review")
async def review_card(
    review_data: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отметить карточку как просмотренную"""
    # Находим или создаем review
    review = db.query(FlashcardReview).filter(
        FlashcardReview.user_id == current_user.id,
        FlashcardReview.flashcard_id == review_data.card_id
    ).first()
    
    # Получаем текущие значения или используем начальные
    current_ef = 2.5
    current_interval = 0
    current_repetitions = 0
    
    if review is not None:
        current_ef = review.easiness_factor
        current_interval = review.interval
        current_repetitions = review.repetitions
    else:
        review = FlashcardReview(
            user_id=current_user.id,
            flashcard_id=review_data.card_id,
            easiness_factor=2.5,
            interval=0,
            repetitions=0
        )
        db.add(review)
    
    # Применяем SuperMemo-2
    new_ef, new_interval, new_repetitions, next_review = calculate_next_review(
        quality=review_data.quality,
        ef=current_ef,
        interval=current_interval,
        repetitions=current_repetitions
    )
    
    review.easiness_factor = new_ef
    review.interval = new_interval
    review.repetitions = new_repetitions
    review.last_review = datetime.utcnow()
    review.next_review = next_review
    
    # Проверяем, освоена ли карточка
    if new_ef > 3.0 and new_interval > 30:
        review.is_mastered = True
    
    db.commit()
    
    return {
        "success": True,
        "next_review": next_review.isoformat(),
        "interval_days": new_interval
    }


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить статистику по карточкам"""
    # Всего карточек
    total = db.query(FlashcardReview).filter(
        FlashcardReview.user_id == current_user.id
    ).count()
    
    # Освоенные карточки
    mastered = db.query(FlashcardReview).filter(
        FlashcardReview.user_id == current_user.id,
        FlashcardReview.is_mastered == True
    ).count()
    
    # Карточки на сегодня
    now = datetime.utcnow()
    today = db.query(FlashcardReview).filter(
        FlashcardReview.user_id == current_user.id,
        FlashcardReview.next_review <= now
    ).count()
    
    return StatsResponse(
        today=today,
        total=total,
        mastered=mastered
    )


@router.get("/subjects")
async def get_subjects_with_cards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список предметов, у которых есть карточки"""
    # Получаем предметы, у которых есть хотя бы одна карточка
    required_names = [
        "Математическая грамотность",
        "Грамотность чтения",
        "История Казахстана"
    ]
    required_subject_ids = [
        subject.id
        for subject in db.query(Subject.id).filter(Subject.name_ru.in_(required_names)).all()
    ]
    allowed_ids = set(current_user.selected_subjects or []) | set(required_subject_ids)

    subjects = (
        db.query(Subject)
        .join(Flashcard)
        .filter(Subject.id.in_(allowed_ids))
        .distinct()
        .all()
    )
    
    # Добавляем количество карточек для каждого предмета
    result = []
    for subject in subjects:
        card_count = db.query(Flashcard).filter(Flashcard.subject_id == subject.id).count()
        result.append({
            "id": subject.id,
            "name_kz": subject.name_kz,
            "name_ru": subject.name_ru,
            "icon": subject.icon,
            "flashcards_count": card_count
        })
    
    return result


@router.get("/history/{subject_id}")
async def get_review_history(
    subject_id: int,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить историю просмотров карточек"""
    reviews = (
        db.query(FlashcardReview)
        .join(Flashcard)
        .filter(
            FlashcardReview.user_id == current_user.id,
            Flashcard.subject_id == subject_id
        )
        .order_by(FlashcardReview.last_review.desc())
        .limit(limit)
        .all()
    )
    
    result = []
    for review in reviews:
        card = review.flashcard
        result.append({
            "card_id": card.id,
            "front": card.front,
            "back": card.back,
            "last_review": review.last_review.isoformat() if review.last_review else None,
            "next_review": review.next_review.isoformat(),
            "status": "mastered" if review.is_mastered else "learning",
            "easiness_factor": review.easiness_factor,
            "interval": review.interval,
            "repetitions": review.repetitions
        })
    
    return result


@router.post("/admin/create")
async def create_flashcard(
    subject_id: int,
    front: str,
    back: str,
    hint: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin)
):
    """Создать новую карточку (только админ)"""
    card = Flashcard(
        subject_id=subject_id,
        front=front,
        back=back,
        hint=hint
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    
    return {"success": True, "card_id": card.id}

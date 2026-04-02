from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    front = Column(Text, nullable=False)  # Вопрос/дата
    front_kz = Column(Text, nullable=True)
    back = Column(Text, nullable=False)   # Ответ
    back_kz = Column(Text, nullable=True)
    hint = Column(Text, nullable=True)     # Подсказка
    hint_kz = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    subject = relationship("Subject", back_populates="flashcards")
    reviews = relationship("FlashcardReview", back_populates="flashcard")


class FlashcardReview(Base):
    __tablename__ = "flashcard_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"))
    
    # SuperMemo-2 алгоритм параметры
    easiness_factor = Column(Float, default=2.5)  # EF (от 1.3)
    interval = Column(Integer, default=0)          # Интервал в днях
    repetitions = Column(Integer, default=0)       # Количество повторений
    
    # Даты
    last_review = Column(DateTime, nullable=True)
    next_review = Column(DateTime, default=datetime.utcnow)
    
    # Статус
    is_mastered = Column(Boolean, default=False)   # Освоено (EF > 3.0, interval > 30)
    
    user = relationship("User", back_populates="flashcard_reviews")
    flashcard = relationship("Flashcard", back_populates="reviews")

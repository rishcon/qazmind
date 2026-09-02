from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # user/admin
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # User Profile & Settings
    selected_subjects = Column(JSON, default=list)  # Array of subject IDs
    ent_date = Column(DateTime)  # Planned ENT exam date
    daily_goal_minutes = Column(Integer, default=30)  # Daily study goal in minutes
    profile_completed = Column(Boolean, default=False)  # Has user completed initial setup
    first_name = Column(String(80), nullable=True)
    last_name = Column(String(80), nullable=True)
    middle_name = Column(String(80), nullable=True)
    birth_date = Column(DateTime, nullable=True)
    
    # Relationships
    test_attempts = relationship("TestAttempt", back_populates="user")
    wrong_answers = relationship("WrongAnswer", back_populates="user")
    ai_explanations = relationship("AiExplanation", back_populates="user")
    flashcard_reviews = relationship("FlashcardReview", back_populates="user")
    tutor_sessions = relationship("AiTutorSession", back_populates="user")


class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name_kz = Column(String, nullable=False)
    name_ru = Column(String, nullable=False)
    icon = Column(String, default="📚")  # Emoji icon for the subject
    
    # Relationships
    questions = relationship("Question", back_populates="subject")
    test_attempts = relationship("TestAttempt", back_populates="subject")
    flashcards = relationship("Flashcard", back_populates="subject")
    tutor_sessions = relationship("AiTutorSession", back_populates="subject")


class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    
    text_kz = Column(Text, nullable=False)
    text_ru = Column(Text, nullable=False)
    
    options_kz = Column(JSON, nullable=False)  # Array of strings
    options_ru = Column(JSON, nullable=False)  # Array of strings
    
    correct_answer_index = Column(Integer, nullable=False)
    
    fact_snippet_kz = Column(Text)  # Source of truth for AI
    fact_snippet_ru = Column(Text)  # Source of truth for AI
    
    difficulty = Column(String, default="medium")  # easy/medium/hard
    topic = Column(String)  # Topic/category for the question
    
    source = Column(String)  # e.g., "Учебник 2023"
    status = Column(String, default="active")  # draft/active/retired
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subject = relationship("Subject", back_populates="questions")
    wrong_answers = relationship("WrongAnswer", back_populates="question")
    ai_explanations = relationship("AiExplanation", back_populates="question")
    feedbacks = relationship("QuestionFeedback", back_populates="question")


class TestAttempt(Base):
    __tablename__ = "test_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for demo
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    
    language = Column(String, nullable=False)  # kz/ru
    mode = Column(String, nullable=False)  # new/wrong_only
    
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    
    answers = Column(JSON, nullable=False)  # {question_id: selected_index}
    options_mapping = Column(JSON, nullable=True)  # {question_id: [original_indices]} for shuffled options
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="test_attempts")
    subject = relationship("Subject", back_populates="test_attempts")


class WrongAnswer(Base):
    __tablename__ = "wrong_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    
    wrong_count = Column(Integer, default=1)
    last_wrong_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="wrong_answers")
    question = relationship("Question", back_populates="wrong_answers")


class AiExplanation(Base):
    __tablename__ = "ai_explanations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for demo
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    
    user_answer_index = Column(Integer, nullable=False)
    language = Column(String, nullable=False)  # kz/ru
    
    model = Column(String, nullable=False)
    prompt_hash = Column(String)  # To track which prompt was used
    response_text = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ai_explanations")
    question = relationship("Question", back_populates="ai_explanations")


class QuestionFeedback(Base):
    __tablename__ = "question_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    
    type = Column(String, nullable=False)  # wrong/unclear/typo/other
    comment = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    question = relationship("Question", back_populates="feedbacks")


class Podcast(Base):
    __tablename__ = "podcasts"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    
    title_kz = Column(String, nullable=False)
    title_ru = Column(String, nullable=False)
    
    description_kz = Column(Text)
    description_ru = Column(Text)
    
    topic = Column(String)  # e.g., "Абылай хан", "Золотая Орда"
    
    # Аудио файл
    audio_filename = Column(String, nullable=False)  # e.g., "ablai_khan_5min.mp3"
    duration_seconds = Column(Integer)  # Длительность в секундах
    
    # Метаданные
    difficulty = Column(String, default="medium")  # easy/medium/hard
    order_index = Column(Integer, default=0)  # Для сортировки
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subject = relationship("Subject")


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


class AiTutorSession(Base):
    __tablename__ = "ai_tutor_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    topic = Column(String, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String, default="active")
    lesson_text = Column(Text, nullable=False)
    assignment_prompt = Column(Text, nullable=False)
    reference_answer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="tutor_sessions")
    subject = relationship("Subject", back_populates="tutor_sessions")
    messages = relationship(
        "AiTutorMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="AiTutorMessage.created_at"
    )


class AiTutorMessage(Base):
    __tablename__ = "ai_tutor_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("ai_tutor_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # assistant/student
    kind = Column(String, nullable=False)  # lesson/submission/feedback
    content = Column(Text, nullable=False)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("AiTutorSession", back_populates="messages")

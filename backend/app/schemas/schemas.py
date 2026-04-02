from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    id: int
    email: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Subject Schemas
class Subject(BaseModel):
    id: int
    name_kz: str
    name_ru: str
    
    class Config:
        from_attributes = True


# Question Schemas
class QuestionBase(BaseModel):
    text_kz: str
    text_ru: str
    options_kz: List[str]
    options_ru: List[str]
    correct_answer_index: int
    fact_snippet_kz: Optional[str] = None
    fact_snippet_ru: Optional[str] = None


class QuestionCreate(QuestionBase):
    subject_id: int
    difficulty: Optional[str] = "medium"
    topic: Optional[str] = None
    source: Optional[str] = None


class Question(QuestionBase):
    id: int
    subject_id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestionForTest(BaseModel):
    """Question without correct answer - for test display"""
    id: int
    text: str
    options: List[str]


# Test Schemas
class TestCreate(BaseModel):
    subject_id: int
    language: str  # kz/ru
    count: int = 20
    mode: str = "new"  # new/wrong_only


class TestAttemptResponse(BaseModel):
    attempt_id: int
    questions: List[QuestionForTest]


class TestSubmit(BaseModel):
    answers: Dict[int, int]  # {question_id: selected_index}


class TestResult(BaseModel):
    attempt_id: int
    score: int
    total: int
    wrong_questions: List[Dict]
    subject_id: Optional[int] = None


# AI Explanation Schemas
class ExplainRequest(BaseModel):
    attempt_id: int
    user_answer_index: int
    language: str  # kz/ru


class ExplainResponse(BaseModel):
    explanation_text: str


class TutorStartRequest(BaseModel):
    subject_id: int
    topic: str
    language: str


class TutorMessageResponse(BaseModel):
    role: str
    kind: str
    content: str
    score: Optional[int] = None
    created_at: datetime


class TutorSessionResponse(BaseModel):
    session_id: int
    subject_id: int
    topic: str
    language: str
    lesson_text: str
    assignment_prompt: str
    similar_questions: List[str]
    comparison_text: str
    messages: List[TutorMessageResponse]


class TutorReviewRequest(BaseModel):
    answer_text: str
    language: str


class TutorReviewResponse(BaseModel):
    feedback_text: str
    score: int
    strengths: List[str]
    improvements: List[str]
    model_answer: str


# Feedback Schemas
class FeedbackCreate(BaseModel):
    question_id: int
    type: str  # wrong/unclear/typo/other
    comment: Optional[str] = None


# Podcast Schemas
class PodcastResponse(BaseModel):
    id: int
    subject_id: int
    title_kz: str
    title_ru: str
    description_kz: Optional[str] = None
    description_ru: Optional[str] = None
    topic: Optional[str] = None
    audio_filename: str
    duration_seconds: Optional[int] = None
    difficulty: str
    order_index: int
    created_at: datetime
    
    class Config:
        from_attributes = True

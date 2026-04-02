from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.api import admin, auth, feedback, podcasts, profile, questions, subjects, tests, tutor
from app.core.config import settings
from app.db.bootstrap import ensure_default_subjects, ensure_schema_compatibility
from app.db.database import SessionLocal, engine
from app.db.models import Base
from routers import flashcards


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize schema for local/dev environment
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            ensure_schema_compatibility(db)
            ensure_default_subjects(db)
        finally:
            db.close()
    except UnicodeDecodeError as exc:
        raise RuntimeError(
            "Database connection failed due to invalid DATABASE_URL or invalid DB credentials encoding. "
            "For local dev use DATABASE_URL=sqlite:///./qazmind.db"
        ) from exc
    except SQLAlchemyError as exc:
        raise RuntimeError(
            "Database initialization failed. Check DATABASE_URL and database availability."
        ) from exc

    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="QazMind API",
    description="API для платформы подготовки к ҰБТ с AI-ментором",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tests.router, prefix="/api/tests", tags=["tests"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(tutor.router)
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(podcasts.router)
app.include_router(profile.router)
app.include_router(subjects.router)
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(flashcards.router, prefix="/api/flashcards", tags=["flashcards"])


@app.get("/")
async def root():
    return {"message": "QazMind API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel

from app.db.database import get_db
from app.db.models import User
from app.schemas.schemas import UserCreate, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.services.email_service import email_service

router = APIRouter()


def ensure_password_reset_available():
    if not settings.MAILGUN_API_KEY or not settings.MAILGUN_DOMAIN or not settings.MAILGUN_FROM_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset is temporarily unavailable"
        )


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        role="user"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# Schemas для восстановления пароля
class SendPasswordResetRequest(BaseModel):
    email: str


class VerifyResetCodeRequest(BaseModel):
    email: str
    code: str


class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str


@router.post("/password-reset/send-code")
async def send_password_reset_code(request: SendPasswordResetRequest, db: Session = Depends(get_db)):
    """Отправляет код восстановления пароля на email"""
    ensure_password_reset_available()
    
    # Проверяем, существует ли пользователь
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Отправляем код через Mailgun
    result = email_service.send_password_reset_email(request.email)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result['message']
        )
    
    return {
        "success": True,
        "message": "Password reset code sent to your email",
        "expires_in_minutes": 15
    }


@router.post("/password-reset/verify-code")
async def verify_reset_code(request: VerifyResetCodeRequest, db: Session = Depends(get_db)):
    """Проверяет корректность кода восстановления"""
    ensure_password_reset_available()
    
    result = email_service.verify_reset_code(request.email, request.code)
    
    if not result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result['message']
        )
    
    return {
        "success": True,
        "message": "Code verified successfully"
    }


@router.post("/password-reset/reset")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Сбрасывает пароль пользователя"""
    ensure_password_reset_available()
    
    # Проверяем пользователя
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Проверяем код
    verify_result = email_service.verify_reset_code(request.email, request.code)
    if not verify_result['success']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=verify_result['message']
        )
    
    # Обновляем пароль
    try:
        user.password_hash = get_password_hash(request.new_password)
        db.commit()
        
        # Очищаем код после успешного использования
        email_service.clear_reset_code(request.email)
        
        return {
            "success": True,
            "message": "Password reset successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting password: {str(e)}"
        )

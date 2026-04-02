import os
import requests
import random
import string
from datetime import datetime, timedelta
from typing import Optional
from app.core.config import settings

class EmailService:
    """Сервис для отправки писем через Mailgun"""
    
    def __init__(self):
        self.mailgun_domain = settings.MAILGUN_DOMAIN
        self.mailgun_api_key = settings.MAILGUN_API_KEY
        self.mailgun_url = f'https://api.mailgun.net/v3/{self.mailgun_domain}/messages'
        self.from_email = settings.MAILGUN_FROM_EMAIL
        
        # Хранилище кодов восстановления (в реальном приложении использовать БД)
        self.reset_codes = {}
    
    def generate_reset_code(self, length: int = 6) -> str:
        """Генерирует 6-значный код для восстановления пароля"""
        return ''.join(random.choices(string.digits, k=length))
    
    def send_password_reset_email(self, email: str) -> dict:
        """
        Отправляет код восстановления пароля на почту
        
        Args:
            email: Email адрес пользователя
            
        Returns:
            dict с кодом и статусом
        """
        if not self.mailgun_api_key:
            raise Exception("MAILGUN_API_KEY не установлен в переменных окружения")
        
        # Генерируем новый код
        reset_code = self.generate_reset_code()
        
        # Сохраняем код с истечением через 15 минут
        expiry_time = datetime.now() + timedelta(minutes=15)
        self.reset_codes[email] = {
            'code': reset_code,
            'expires_at': expiry_time.timestamp()
        }
        
        # Подготавливаем письмо (на казахском и русском)
        subject = "QazMind: Восстановление пароля / Құпия сөзді қалпына келтіру"
        
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 8px; color: white; text-align: center;">
                    <h1 style="margin: 0;">QazMind</h1>
                    <p>ENT Exam Preparation Platform</p>
                </div>
                
                <div style="padding: 30px; background: #f5f5f5; border-radius: 8px; margin-top: 20px;">
                    <h2 style="color: #333;">Восстановление пароля / Құпия сөзді қалпына келтіру</h2>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #666; font-size: 14px;">
                            <strong>English:</strong><br>
                            Your password reset code is:
                        </p>
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0;">
                            <code style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">{reset_code}</code>
                        </div>
                        <p style="color: #999; font-size: 12px;">This code expires in 15 minutes</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #666; font-size: 14px;">
                            <strong>Қазақша:</strong><br>
                            Құпия сөзді қалпына келтіру кодыңыз:
                        </p>
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0;">
                            <code style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">{reset_code}</code>
                        </div>
                        <p style="color: #999; font-size: 12px;">Код 15 минут ішінде жарамды</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="color: #666; font-size: 14px;">
                            <strong>Русский:</strong><br>
                            Ваш код восстановления пароля:
                        </p>
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0;">
                            <code style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">{reset_code}</code>
                        </div>
                        <p style="color: #999; font-size: 12px;">Код действителен в течение 15 минут</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #856404; font-size: 13px; margin: 0;">
                            <strong>⚠️ Important / Маңызды / Важно:</strong><br>
                            If you don't see this email, please check your Spam or Promotions folder.<br>
                            Егер сіз бұл хатты көрмесеңіз, өзіңіздің Спам немесе Құндылықтар бумасын тексеріңіз.<br>
                            Если вы не видите это письмо, проверьте папку Спам или Промоции.
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        If you didn't request this code, please ignore this email.<br>
                        Егер сіз бұл кодты сұрамаған болсаңыз, бұл хатты елемеңіз.<br>
                        Если вы не запрашивали этот код, пожалуйста, проигнорируйте это письмо.
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_body = f"""
        QazMind - Password Reset / Құпия сөзді қалпына келтіру
        
        Your password reset code: {reset_code}
        Ваш код восстановления пароля: {reset_code}
        Құпия сөзді қалпына келтіру кодыңыз: {reset_code}
        
        Code expires in 15 minutes / Код действителен в течение 15 минут / Код 15 минут ішінде жарамды
        """
        
        try:
            # Отправляем письмо через Mailgun
            response = requests.post(
                self.mailgun_url,
                auth=("api", self.mailgun_api_key),
                data={
                    "from": f"QazMind <{self.from_email}>",
                    "to": email,
                    "subject": subject,
                    "text": text_body,
                    "html": html_body
                }
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "message": "Reset code sent successfully",
                    "email": email,
                    "expires_in_minutes": 15
                }
            else:
                return {
                    "success": False,
                    "message": f"Failed to send email: {response.text}",
                    "status_code": response.status_code
                }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error sending email: {str(e)}"
            }
    
    def verify_reset_code(self, email: str, code: str) -> dict:
        """
        Проверяет корректность кода восстановления
        
        Args:
            email: Email адрес пользователя
            code: Введенный код
            
        Returns:
            dict с результатом проверки
        """
        if email not in self.reset_codes:
            return {
                "success": False,
                "message": "No reset code found for this email"
            }
        
        code_data = self.reset_codes[email]
        
        # Проверяем истечение кода
        if datetime.now().timestamp() > code_data['expires_at']:
            del self.reset_codes[email]
            return {
                "success": False,
                "message": "Reset code has expired"
            }
        
        # Проверяем правильность кода
        if code != code_data['code']:
            return {
                "success": False,
                "message": "Invalid reset code"
            }
        
        return {
            "success": True,
            "message": "Code verified successfully"
        }
    
    def clear_reset_code(self, email: str):
        """Удаляет код восстановления после использования"""
        if email in self.reset_codes:
            del self.reset_codes[email]


# Глобальный экземпляр сервиса
email_service = EmailService()

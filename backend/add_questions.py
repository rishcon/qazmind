"""
Скрипт для добавления вопросов в базу данных
"""
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.models import Subject, Question

def add_questions():
    db = SessionLocal()
    
    try:
        # Получаем предмет "История Казахстана"
        subject = db.query(Subject).filter(Subject.name_ru == "История Казахстана").first()
        
        if not subject:
            print("❌ Предмет 'История Казахстана' не найден")
            return
        
        # ДОБАВЬТЕ СВОИ ВОПРОСЫ ЗДЕСЬ
        questions = [
            {
                "text_kz": "Ваш вопрос на казахском",
                "text_ru": "Ваш вопрос на русском",
                "options_kz": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
                "options_ru": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
                "correct_answer_index": 0,  # Индекс правильного ответа (0-3)
                "fact_snippet_kz": "Объяснение на казахском",
                "fact_snippet_ru": "Объяснение на русском",
                "difficulty": "medium",  # easy, medium, hard
                "topic": "Древняя история"
            },
            # Добавьте больше вопросов...
        ]
        
        added = 0
        for q_data in questions:
            question = Question(
                subject_id=subject.id,
                text_kz=q_data["text_kz"],
                text_ru=q_data["text_ru"],
                options_kz=q_data["options_kz"],
                options_ru=q_data["options_ru"],
                correct_answer_index=q_data["correct_answer_index"],
                fact_snippet_kz=q_data.get("fact_snippet_kz"),
                fact_snippet_ru=q_data.get("fact_snippet_ru"),
                difficulty=q_data.get("difficulty", "medium"),
                topic=q_data.get("topic")
            )
            db.add(question)
            added += 1
        
        db.commit()
        print(f"✅ Добавлено {added} вопросов")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_questions()

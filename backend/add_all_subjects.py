"""
Скрипт для добавления всех предметов ҰБТ в базу данных
"""
from app.db.database import SessionLocal
from app.db.models import Subject

def add_all_subjects():
    db = SessionLocal()
    
    try:
        subjects_data = [
            # Обязательные предметы
            {
                "name_kz": "Қазақстан тарихы",
                "name_ru": "История Казахстана",
                "icon": "📖",
                "is_required": True,
                "questions_count": 20
            },
            {
                "name_kz": "Математикалық сауаттылық",
                "name_ru": "Математическая грамотность",
                "icon": "🔢",
                "is_required": True,
                "questions_count": 10
            },
            {
                "name_kz": "Оқу сауаттылығы",
                "name_ru": "Грамотность чтения",
                "icon": "📚",
                "is_required": True,
                "questions_count": 10
            },
            
            # Профильные предметы
            {
                "name_kz": "Математика",
                "name_ru": "Математика",
                "icon": "📐",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Физика",
                "name_ru": "Физика",
                "icon": "⚛️",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Биология",
                "name_ru": "Биология",
                "icon": "🧬",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Химия",
                "name_ru": "Химия",
                "icon": "🧪",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Шетел тілі (Ағылшын)",
                "name_ru": "Иностранный язык (Английский)",
                "icon": "🇬🇧",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Дүниежүзі тарихы",
                "name_ru": "Всемирная история",
                "icon": "🌍",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "География",
                "name_ru": "География",
                "icon": "🗺️",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Қазақ тілі",
                "name_ru": "Казахский язык",
                "icon": "🇰🇿",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Орыс тілі",
                "name_ru": "Русский язык",
                "icon": "🇷🇺",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Әдебиет",
                "name_ru": "Литература",
                "icon": "📕",
                "is_required": False,
                "questions_count": 40
            },
            {
                "name_kz": "Информатика",
                "name_ru": "Информатика",
                "icon": "💻",
                "is_required": False,
                "questions_count": 40
            },
        ]
        
        # Проверяем, какие предметы уже есть
        existing_subjects = db.query(Subject).all()
        existing_names_ru = {s.name_ru for s in existing_subjects}
        
        added_count = 0
        for subject_data in subjects_data:
            if subject_data["name_ru"] not in existing_names_ru:
                subject = Subject(
                    name_kz=subject_data["name_kz"],
                    name_ru=subject_data["name_ru"],
                    icon=subject_data.get("icon", "📚")
                )
                db.add(subject)
                added_count += 1
                print(f"✅ Добавлен: {subject_data['name_ru']}")
            else:
                print(f"⏭️  Пропущен (уже есть): {subject_data['name_ru']}")
        
        db.commit()
        print(f"\n🎉 Готово! Добавлено {added_count} новых предметов.")
        print(f"📊 Всего предметов в базе: {db.query(Subject).count()}")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Добавление всех предметов ҰБТ в базу данных...\n")
    add_all_subjects()

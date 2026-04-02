from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.db.models import Subject


DEFAULT_SUBJECTS = [
    # Required
    {"name_kz": "Қазақстан тарихы", "name_ru": "История Казахстана", "icon": "📖"},
    {"name_kz": "Математикалық сауаттылық", "name_ru": "Математическая грамотность", "icon": "🔢"},
    {"name_kz": "Оқу сауаттылығы", "name_ru": "Грамотность чтения", "icon": "📚"},
    # Profile
    {"name_kz": "Математика", "name_ru": "Математика", "icon": "📐"},
    {"name_kz": "Физика", "name_ru": "Физика", "icon": "⚛️"},
    {"name_kz": "Биология", "name_ru": "Биология", "icon": "🧬"},
    {"name_kz": "Химия", "name_ru": "Химия", "icon": "🧪"},
    {"name_kz": "Шетел тілі (Ағылшын)", "name_ru": "Иностранный язык (Английский)", "icon": "🇬🇧"},
    {"name_kz": "Дүниежүзі тарихы", "name_ru": "Всемирная история", "icon": "🌍"},
    {"name_kz": "География", "name_ru": "География", "icon": "🗺️"},
    {"name_kz": "Қазақ тілі", "name_ru": "Казахский язык", "icon": "🇰🇿"},
    {"name_kz": "Орыс тілі", "name_ru": "Русский язык", "icon": "🇷🇺"},
    {"name_kz": "Әдебиет", "name_ru": "Литература", "icon": "📕"},
    {"name_kz": "Информатика", "name_ru": "Информатика", "icon": "💻"},
]


def ensure_schema_compatibility(db: Session) -> None:
    inspector = inspect(db.bind)

    # Legacy SQLite databases may miss newer columns.
    if "questions" in inspector.get_table_names():
        question_columns = {column["name"] for column in inspector.get_columns("questions")}
        question_migrations = [
            ("difficulty", "ALTER TABLE questions ADD COLUMN difficulty VARCHAR DEFAULT 'medium'"),
            ("topic", "ALTER TABLE questions ADD COLUMN topic VARCHAR"),
            ("source", "ALTER TABLE questions ADD COLUMN source VARCHAR"),
            ("status", "ALTER TABLE questions ADD COLUMN status VARCHAR DEFAULT 'active'"),
        ]

        for column_name, ddl in question_migrations:
            if column_name not in question_columns:
                db.execute(text(ddl))
                db.commit()


def ensure_default_subjects(db: Session) -> None:
    inspector = inspect(db.bind)
    subject_columns = {column["name"] for column in inspector.get_columns("subjects")}

    if "icon" not in subject_columns:
        db.execute(text("ALTER TABLE subjects ADD COLUMN icon VARCHAR DEFAULT '📚'"))
        db.commit()

    existing_names_ru = {
        name for (name,) in db.query(Subject.name_ru).all() if name
    }

    to_insert = [
        Subject(name_kz=item["name_kz"], name_ru=item["name_ru"], icon=item["icon"])
        for item in DEFAULT_SUBJECTS
        if item["name_ru"] not in existing_names_ru
    ]

    if not to_insert:
        return

    db.add_all(to_insert)
    db.commit()

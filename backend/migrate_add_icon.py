"""
Миграция: добавление поля icon в таблицу subjects
"""
from sqlalchemy import text
from app.db.database import engine

def add_icon_column():
    with engine.connect() as conn:
        try:
            # Добавляем колонку icon
            conn.execute(text("ALTER TABLE subjects ADD COLUMN icon VARCHAR DEFAULT '📚'"))
            conn.commit()
            print("✅ Колонка 'icon' успешно добавлена в таблицу 'subjects'")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("⏭️  Колонка 'icon' уже существует")
            else:
                print(f"❌ Ошибка: {e}")
                conn.rollback()

if __name__ == "__main__":
    print("🔄 Миграция базы данных...\n")
    add_icon_column()

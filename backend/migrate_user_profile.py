"""
Миграция: Добавление полей профиля пользователя
"""
from sqlalchemy import create_engine, text, inspect
from app.core.config import settings

def run_migration():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]
        
        # Добавляем selected_subjects если его нет
        if 'selected_subjects' not in columns:
            print("📝 Добавляем колонку 'selected_subjects'...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN selected_subjects JSON DEFAULT '[]'::json
            """))
            conn.commit()
            print("✅ Колонка 'selected_subjects' добавлена")
        else:
            print("ℹ️  Колонка 'selected_subjects' уже существует")
        
        # Добавляем ent_date если его нет
        if 'ent_date' not in columns:
            print("📝 Добавляем колонку 'ent_date'...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN ent_date TIMESTAMP
            """))
            conn.commit()
            print("✅ Колонка 'ent_date' добавлена")
        else:
            print("ℹ️  Колонка 'ent_date' уже существует")
        
        # Добавляем daily_goal_minutes если его нет
        if 'daily_goal_minutes' not in columns:
            print("📝 Добавляем колонку 'daily_goal_minutes'...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN daily_goal_minutes INTEGER DEFAULT 30
            """))
            conn.commit()
            print("✅ Колонка 'daily_goal_minutes' добавлена")
        else:
            print("ℹ️  Колонка 'daily_goal_minutes' уже существует")
        
        # Добавляем profile_completed если его нет
        if 'profile_completed' not in columns:
            print("📝 Добавляем колонку 'profile_completed'...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE
            """))
            conn.commit()
            print("✅ Колонка 'profile_completed' добавлена")
        else:
            print("ℹ️  Колонка 'profile_completed' уже существует")
    
    print("\n🎉 Миграция завершена успешно!")

if __name__ == "__main__":
    run_migration()

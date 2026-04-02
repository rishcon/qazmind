"""
Script to initialize database with initial data
"""
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal
from app.db.models import Base, Subject, Question, User
from app.core.security import get_password_hash


def init_db():
    """Initialize database with tables and initial data"""
    
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    db = SessionLocal()
    
    try:
        # Check if subjects exist
        existing_subjects = db.query(Subject).count()
        if existing_subjects == 0:
            print("\nAdding initial subjects...")
            
            # Add History of Kazakhstan subject
            history_subject = Subject(
                name_kz="Қазақстан тарихы",
                name_ru="История Казахстана"
            )
            db.add(history_subject)
            db.commit()
            print("✓ Subject 'История Казахстана' added")
        
        # Check if admin user exists
        admin_user = db.query(User).filter(User.email == "admin@qazmind.kz").first()
        if not admin_user:
            print("\nCreating admin user...")
            # Use shorter password to avoid bcrypt 72 byte limit
            admin = User(
                email="admin@qazmind.kz",
                password_hash=get_password_hash("admin"),
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("✓ Admin user created")
            print("  Email: admin@qazmind.kz")
            print("  Password: admin")
            print("  ⚠️  CHANGE PASSWORD IN PRODUCTION!")
        
        # Add sample questions
        existing_questions = db.query(Question).count()
        if existing_questions == 0:
            print("\nAdding sample questions...")
            
            subject_id = db.query(Subject).first().id
            
            sample_questions = [
                {
                    "subject_id": subject_id,
                    "text_kz": "Қазақстанда алғашқы мемлекет қай кезеңде пайда болды?",
                    "text_ru": "В какой период на территории Казахстана появилось первое государство?",
                    "options_kz": [
                        "VI ғасырда",
                        "VIII ғасырда",
                        "X ғасырда",
                        "XII ғасырда"
                    ],
                    "options_ru": [
                        "В VI веке",
                        "В VIII веке",
                        "В X веке",
                        "В XII веке"
                    ],
                    "correct_answer_index": 0,
                    "fact_snippet_kz": "Түрік қағанаты - Қазақстан жерінде құрылған алғашқы мемлекет (552-603 жж.). Бұл түркі тайпаларының біріккен күшті мемлекеті болды.",
                    "fact_snippet_ru": "Тюркский каганат - первое государство на территории Казахстана (552-603 гг.). Это было мощное объединенное государство тюркских племен.",
                    "source": "Учебник История Казахстана 2023",
                    "status": "active"
                },
                {
                    "subject_id": subject_id,
                    "text_kz": "Қазақ хандығы қай жылы құрылды?",
                    "text_ru": "В каком году было образовано Казахское ханство?",
                    "options_kz": [
                        "1456 жылы",
                        "1465 жылы",
                        "1475 жылы",
                        "1485 жылы"
                    ],
                    "options_ru": [
                        "В 1456 году",
                        "В 1465 году",
                        "В 1475 году",
                        "В 1485 году"
                    ],
                    "correct_answer_index": 1,
                    "fact_snippet_kz": "Қазақ хандығы 1465 жылы Керей мен Жәнібек сұлтандар негізін қалаған. Олар Моғолстан жеріне қоныс аударып, өз халқын құрды.",
                    "fact_snippet_ru": "Казахское ханство было образовано в 1465 году султанами Кереем и Жанибеком. Они откочевали на территорию Моголистана и создали свой народ.",
                    "source": "Учебник История Казахстана 2023",
                    "status": "active"
                },
                {
                    "subject_id": subject_id,
                    "text_kz": "Қазақстан қай жылы тәуелсіздік алды?",
                    "text_ru": "В каком году Казахстан получил независимость?",
                    "options_kz": [
                        "1990 жылы",
                        "1991 жылы",
                        "1992 жылы",
                        "1993 жылы"
                    ],
                    "options_ru": [
                        "В 1990 году",
                        "В 1991 году",
                        "В 1992 году",
                        "В 1993 году"
                    ],
                    "correct_answer_index": 1,
                    "fact_snippet_kz": "Қазақстан Республикасы 1991 жылдың 16 желтоқсанында тәуелсіздігін жариялады. Бұл КСРО ыдырағаннан кейін болды.",
                    "fact_snippet_ru": "Республика Казахстан провозгласила независимость 16 декабря 1991 года. Это произошло после распада СССР.",
                    "source": "Учебник История Казахстана 2023",
                    "status": "active"
                },
                {
                    "subject_id": subject_id,
                    "text_kz": "Алаш автономиясы қай жылдары өмір сүрді?",
                    "text_ru": "В какие годы существовала Алаш автономия?",
                    "options_kz": [
                        "1917-1920 жж.",
                        "1918-1920 жж.",
                        "1919-1921 жж.",
                        "1920-1922 жж."
                    ],
                    "options_ru": [
                        "1917-1920 гг.",
                        "1918-1920 гг.",
                        "1919-1921 гг.",
                        "1920-1922 гг."
                    ],
                    "correct_answer_index": 0,
                    "fact_snippet_kz": "Алаш автономиясы 1917 жылдың желтоқсанында құрылды және 1920 жылы таратылды. Бұл қазақ зиялыларының ұлттық мемлекет құру әрекеті болды.",
                    "fact_snippet_ru": "Автономия Алаш была создана в декабре 1917 года и ликвидирована в 1920 году. Это была попытка казахской интеллигенции создать национальное государство.",
                    "source": "Учебник История Казахстана 2023",
                    "status": "active"
                },
                {
                    "subject_id": subject_id,
                    "text_kz": "Астана қай жылы Қазақстанның астанасы болды?",
                    "text_ru": "В каком году Астана стала столицей Казахстана?",
                    "options_kz": [
                        "1995 жылы",
                        "1997 жылы",
                        "1998 жылы",
                        "2000 жылы"
                    ],
                    "options_ru": [
                        "В 1995 году",
                        "В 1997 году",
                        "В 1998 году",
                        "В 2000 году"
                    ],
                    "correct_answer_index": 1,
                    "fact_snippet_kz": "1997 жылдың 10 желтоқсанында астана Алматыдан Ақмолаға (кейін Астана) көшірілді. Бұл стратегиялық маңызды шешім болды.",
                    "fact_snippet_ru": "10 декабря 1997 года столица была перенесена из Алматы в Акмолу (позже Астана). Это было стратегически важное решение.",
                    "source": "Учебник История Казахстана 2023",
                    "status": "active"
                }
            ]
            
            for q_data in sample_questions:
                question = Question(**q_data)
                db.add(question)
            
            db.commit()
            print(f"✓ Added {len(sample_questions)} sample questions")
        
        print("\n✅ Database initialization completed successfully!")
        print("\nNext steps:")
        print("1. Update .env file with your settings")
        print("2. Run: uvicorn main:app --reload")
        print("3. Visit: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

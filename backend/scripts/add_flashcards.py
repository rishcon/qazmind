import sys
import os

# Добавляем путь к родительской директории для импорта модулей
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.models import Base, Flashcard, Subject

# Данные карточек
flashcards_data = [
    {
        "subject_name": "История Казахстана",
        "cards": [
            {"front": "1465 год", "back": "Образование Казахского ханства", "hint": "Керей и Жанибек"},
            {"front": "1718-1730 гг", "back": "Годы Великого бедствия (Актабан шұбырынды)", "hint": "Джунгарское нашествие"},
            {"front": "1771 год", "back": "Присоединение Младшего жуза к России", "hint": "Хан Абулхаир"},
            {"front": "1837-1847 гг", "back": "Восстание Кенесары Касымова", "hint": "Последний казахский хан"},
            {"front": "1916 год", "back": "Национально-освободительное восстание", "hint": "Против мобилизации на тыловые работы"},
            {"front": "1920 год", "back": "Образование Киргизской (Казахской) АССР", "hint": "26 августа"},
            {"front": "1925 год", "back": "Переименование в Казахскую АССР", "hint": "От Киргизской"},
            {"front": "1991 год", "back": "Обретение независимости Казахстана", "hint": "16 декабря"},
            {"front": "1997 год", "back": "Перенос столицы в Астану", "hint": "Из Алматы"},
            {"front": "Тауке хан", "back": "Последний великий хан объединенного Казахстана (1680-1718)", "hint": "Жеті Жарғы"},
            {"front": "Абылай хан", "back": "Хан трех жузов (1771-1781)", "hint": "Дипломат между Россией и Китаем"},
            {"front": "Абай Кунанбаев", "back": "Великий казахский поэт и философ (1845-1904)", "hint": "Слова назидания"},
            {"front": "Чокан Валиханов", "back": "Первый казахский ученый-этнограф", "hint": "Исследовал Кашгарию"},
            {"front": "Ибрай Алтынсарин", "back": "Казахский просветитель, педагог", "hint": "Открыл первые школы"},
            {"front": "Ахмет Байтурсынов", "back": "Лидер партии Алаш", "hint": "Реформатор казахской письменности"},
        ]
    },
    {
        "subject_name": "Математика",
        "cards": [
            {"front": "a² - b²", "back": "(a - b)(a + b)", "hint": "Разность квадратов"},
            {"front": "(a + b)²", "back": "a² + 2ab + b²", "hint": "Квадрат суммы"},
            {"front": "(a - b)²", "back": "a² - 2ab + b²", "hint": "Квадрат разности"},
            {"front": "a³ + b³", "back": "(a + b)(a² - ab + b²)", "hint": "Сумма кубов"},
            {"front": "a³ - b³", "back": "(a - b)(a² + ab + b²)", "hint": "Разность кубов"},
            {"front": "sin²α + cos²α", "back": "1", "hint": "Основное тригонометрическое тождество"},
            {"front": "Теорема Пифагора", "back": "a² + b² = c²", "hint": "Для прямоугольного треугольника"},
            {"front": "Площадь круга", "back": "S = πr²", "hint": "Пи эр квадрат"},
            {"front": "Объем шара", "back": "V = (4/3)πr³", "hint": "4/3 пи эр куб"},
            {"front": "Логарифм произведения", "back": "log(ab) = log(a) + log(b)", "hint": "Сумма логарифмов"},
            {"front": "Производная степени", "back": "(xⁿ)' = n·xⁿ⁻¹", "hint": "Степенная функция"},
            {"front": "Производная синуса", "back": "(sin x)' = cos x", "hint": "Тригонометрия"},
            {"front": "Производная косинуса", "back": "(cos x)' = -sin x", "hint": "Тригонометрия"},
            {"front": "Производная экспоненты", "back": "(eˣ)' = eˣ", "hint": "e в степени x"},
            {"front": "Интеграл xⁿ", "back": "∫xⁿ dx = xⁿ⁺¹/(n+1) + C", "hint": "n ≠ -1"},
        ]
    },
    {
        "subject_name": "Физика",
        "cards": [
            {"front": "Второй закон Ньютона", "back": "F = ma", "hint": "Сила равна масса на ускорение"},
            {"front": "Закон всемирного тяготения", "back": "F = G(m₁m₂)/r²", "hint": "Ньютон"},
            {"front": "Кинетическая энергия", "back": "E = mv²/2", "hint": "Половина эм ве квадрат"},
            {"front": "Потенциальная энергия", "back": "E = mgh", "hint": "Эм же аш"},
            {"front": "Закон Ома", "back": "I = U/R", "hint": "Сила тока"},
            {"front": "Мощность", "back": "P = UI", "hint": "Напряжение на ток"},
            {"front": "Скорость света", "back": "c ≈ 3×10⁸ м/с", "hint": "300 тысяч км/с"},
            {"front": "Период колебаний маятника", "back": "T = 2π√(L/g)", "hint": "Формула маятника"},
            {"front": "Закон сохранения энергии", "back": "E₁ + E₂ = const", "hint": "Энергия не исчезает"},
            {"front": "Импульс", "back": "p = mv", "hint": "Масса на скорость"},
        ]
    },
    {
        "subject_name": "Химия",
        "cards": [
            {"front": "H₂O", "back": "Вода", "hint": "Самое распространенное вещество"},
            {"front": "CO₂", "back": "Углекислый газ", "hint": "Выдыхаем"},
            {"front": "NaCl", "back": "Поваренная соль (хлорид натрия)", "hint": "Соль"},
            {"front": "H₂SO₄", "back": "Серная кислота", "hint": "Сильная кислота"},
            {"front": "pH = 7", "back": "Нейтральная среда", "hint": "Вода"},
            {"front": "pH < 7", "back": "Кислотная среда", "hint": "Лимон"},
            {"front": "pH > 7", "back": "Щелочная среда", "hint": "Мыло"},
            {"front": "Число Авогадро", "back": "6.02 × 10²³", "hint": "Количество частиц в моле"},
            {"front": "O₂", "back": "Кислород", "hint": "Дышим"},
            {"front": "CH₄", "back": "Метан", "hint": "Природный газ"},
        ]
    },
    {
        "subject_name": "Биология",
        "cards": [
            {"front": "Сколько хромосом у человека?", "back": "46 хромосом (23 пары)", "hint": "Четное число"},
            {"front": "Митоз", "back": "Деление соматических клеток", "hint": "Обычные клетки"},
            {"front": "Мейоз", "back": "Деление половых клеток", "hint": "Гаметы"},
            {"front": "Фотосинтез", "back": "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "hint": "Растения на свету"},
            {"front": "ДНК расшифровка", "back": "Дезоксирибонуклеиновая кислота", "hint": "Генетический код"},
            {"front": "РНК расшифровка", "back": "Рибонуклеиновая кислота", "hint": "Транскрипция"},
            {"front": "ATP расшифровка", "back": "Аденозинтрифосфат", "hint": "Энергия клетки"},
            {"front": "Гемоглобин функция", "back": "Переносит кислород в крови", "hint": "Красные кровяные тельца"},
        ]
    }
]


def init_flashcards():
    """Инициализация базы данных с флеш-карточками"""
    # Создаем таблицы
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        print("🚀 Начинаем добавление флеш-карточек...")
        
        for subject_data in flashcards_data:
            subject_name = subject_data["subject_name"]
            
            # Найти предмет по имени
            subject = db.query(Subject).filter(
                (Subject.name_ru == subject_name) | (Subject.name_kz == subject_name)
            ).first()
            
            if not subject:
                print(f"⚠️  Предмет '{subject_name}' не найден, пропускаем...")
                continue
            
            print(f"\n📚 Добавляем карточки для предмета: {subject_name}")
            
            # Проверяем, есть ли уже карточки для этого предмета
            existing_count = db.query(Flashcard).filter(
                Flashcard.subject_id == subject.id
            ).count()
            
            if existing_count > 0:
                print(f"   ⚠️  Уже есть {existing_count} карточек, пропускаем...")
                continue
            
            # Добавляем карточки
            added = 0
            for card_data in subject_data["cards"]:
                flashcard = Flashcard(
                    subject_id=subject.id,
                    front=card_data["front"],
                    back=card_data["back"],
                    hint=card_data.get("hint")
                )
                db.add(flashcard)
                added += 1
            
            db.commit()
            print(f"   ✅ Добавлено {added} карточек")
        
        print("\n✨ Готово! Флеш-карточки успешно добавлены в базу данных.")
        
        # Статистика
        total_cards = db.query(Flashcard).count()
        print(f"\n📊 Всего карточек в базе: {total_cards}")
        
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_flashcards()

# QazMind - Полная документация проекта

**Версия:** 1.0.0
**Дата:** Декабрь 2024
**Статус:** Production Ready (MVP)

---

## 📋 Оглавление

1. [Введение](#введение)
2. [Обзор системы](#обзор-системы)
3. [Архитектура](#архитектура)
4. [Функциональные возможности](#функциональные-возможности)
5. [Технологический стек](#технологический-стек)
6. [База данных](#база-данных)
7. [API Reference](#api-reference)
8. [UI/UX Design System](#uiux-design-system)
9. [Безопасность](#безопасность)
10. [Развертывание](#развертывание)
11. [Приложения](#приложения)

---

## 1. Введение

### 1.1 Назначение документа

Данный документ содержит полное описание образовательной платформы **QazMind** - веб-приложения для подготовки к Единому Национальному Тестированию (ҰБТ) в Республике Казахстан с использованием искусственного интеллекта.

### 1.2 Целевая аудитория

- **Разработчики** - для понимания архитектуры и расширения функционала
- **DevOps инженеры** - для развертывания и поддержки
- **Преподаватели/Контент-менеджеры** - для управления вопросами
- **Инвесторы/Стейкхолдеры** - для оценки технической реализации

### 1.3 Бизнес-контекст

**Проблема:**
Ежегодно ~130,000 выпускников в Казахстане сдают ҰБТ. Традиционные способы подготовки:
- Репетиторы (дорого: 5,000-15,000₸/час)
- Книги (не интерактивно, нет обратной связи)
- Существующие платформы (устаревший UI, нет персонализации)

**Решение:**
QazMind предоставляет:
- 730+ качественных вопросов по Истории Казахстана
- AI-ментор для персонализированных объяснений ошибок
- Флэшкарты с научно доказанным алгоритмом запоминания (SuperMemo-2)
- Современный UI/UX уровня международных EdTech платформ
- **Бесплатный доступ** к базовому функционалу

---

## 2. Обзор системы

### 2.1 Что такое QazMind?

**QazMind** - это SPA (Single Page Application) веб-платформа, состоящая из:

1. **Frontend** - React-приложение с современным UI
2. **Backend** - FastAPI REST API сервер
3. **Database** - PostgreSQL для хранения данных
4. **AI Service** - Интеграция с OpenAI GPT-4o-mini

### 2.2 Основные модули

```
┌─────────────────────────────────────────┐
│          QazMind Platform               │
├─────────────────────────────────────────┤
│  1. Тестирование                        │
│     - Создание тестов                   │
│     - Прохождение                       │
│     - Результаты с аналитикой           │
│                                         │
│  2. AI-Объяснения                       │
│     - Персонализированные ответы        │
│     - Кэширование                       │
│     - Rate limiting                     │
│                                         │
│  3. Флэшкарты (Spaced Repetition)       │
│     - SuperMemo-2 алгоритм              │
│     - Swipe интерфейс                   │
│     - Трекинг прогресса                 │
│                                         │
│  4. Статистика и Аналитика              │
│     - Dashboard с метриками             │
│     - Activity календарь                │
│     - Рекомендации на основе ошибок     │
│                                         │
│  5. Подкасты (в разработке)             │
│     - Аудио-лекции                      │
│     - Интеграция с предметами           │
└─────────────────────────────────────────┘
```

### 2.3 Ключевые метрики

- **Вопросов в БД:** 730 (История Казахстана)
- **Предметов:** 1 активный, 13 запланировано
- **Модель AI:** GPT-4o-mini
- **Поддерживаемые языки:** Казахский (kz), Русский (ru)
- **Мобильная адаптация:** ✅ Responsive design

---

## 3. Архитектура

### 3.1 Общая архитектура системы

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│  ┌────────────────────────────────────────────────┐      │
│  │  React SPA (Vite)                              │      │
│  │  - Zustand (State Management)                  │      │
│  │  - React Router (Navigation)                   │      │
│  │  - Tailwind CSS (Styling)                      │      │
│  │  - Framer Motion (Animations)                  │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌──────────────────────────────────────────────────────────┐
│                     API LAYER                            │
│  ┌────────────────────────────────────────────────┐      │
│  │  FastAPI Server                                │      │
│  │  ┌──────────────────────────────────────┐      │      │
│  │  │  Routers:                            │      │      │
│  │  │  - /api/auth      (Authentication)   │      │      │
│  │  │  - /api/tests     (Test Management)  │      │      │
│  │  │  - /api/questions (AI Explanations)  │      │      │
│  │  │  - /api/flashcards (Spaced Rep.)     │      │      │
│  │  │  - /api/profile   (User Stats)       │      │      │
│  │  │  - /api/admin     (Admin Panel)      │      │      │
│  │  └──────────────────────────────────────┘      │      │
│  │                                                 │      │
│  │  Middleware:                                    │      │
│  │  - CORS                                         │      │
│  │  - JWT Authentication                           │      │
│  │  - Rate Limiting (AI)                           │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
                          ↕ SQL
┌──────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  PostgreSQL                                    │      │
│  │  - Users (auth, profiles)                      │      │
│  │  - Subjects (предметы)                         │      │
│  │  - Questions (730+ вопросов)                   │      │
│  │  - TestAttempts (результаты)                   │      │
│  │  - WrongAnswers (ошибки)                       │      │
│  │  - AiExplanations (кэш AI)                     │      │
│  │  - Flashcards (карточки)                       │      │
│  │  - FlashcardReviews (SM-2 data)                │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
                          ↕ API
┌──────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                       │
│  ┌────────────────────────────────────────────────┐      │
│  │  OpenAI API                                    │      │
│  │  - Model: gpt-4o-mini                          │      │
│  │  - Max tokens: 300                             │      │
│  │  - Temperature: 0.7                            │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### 3.2 Frontend архитектура

```
frontend/
├── src/
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── Layout.jsx       # Основной layout
│   │   ├── Navbar.jsx       # Навигация
│   │   ├── Timer.jsx        # Таймер теста
│   │   ├── QuestionCard.jsx # Карточка вопроса
│   │   ├── ExplanationModal.jsx # AI объяснение
│   │   ├── StatCards.jsx    # Статистика
│   │   └── ...
│   │
│   ├── pages/               # Страницы
│   │   ├── Landing.jsx      # Главная (маркетинг)
│   │   ├── Login.jsx        # Вход
│   │   ├── Register.jsx     # Регистрация
│   │   ├── Dashboard.jsx    # Личный кабинет
│   │   ├── Test.jsx         # Прохождение теста
│   │   ├── Results.jsx      # Результаты
│   │   ├── Flashcards.jsx   # Флэшкарты
│   │   ├── Podcasts.jsx     # Подкасты
│   │   └── Admin.jsx        # Админ-панель
│   │
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.js     # Аутентификация
│   │   ├── languageStore.js # Язык интерфейса
│   │   └── testStore.js     # Состояние теста
│   │
│   ├── services/            # API интеграция
│   │   └── api.js           # Axios client
│   │
│   ├── utils/               # Утилиты
│   │   └── api.js           # Axios setup
│   │
│   ├── App.jsx              # Роутинг
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (Tailwind)
```

### 3.3 Backend архитектура

```
backend/
├── app/
│   ├── api/                 # API endpoints
│   │   ├── auth.py          # POST /register, /login
│   │   ├── tests.py         # Создание и сдача тестов
│   │   ├── questions.py     # AI объяснения
│   │   ├── profile.py       # Профиль, статистика
│   │   ├── feedback.py      # Обратная связь
│   │   ├── podcasts.py      # Подкасты
│   │   └── admin.py         # Админ-функции
│   │
│   ├── core/                # Конфигурация
│   │   ├── config.py        # Settings (env vars)
│   │   ├── security.py      # JWT, password hashing
│   │   └── deps.py          # Dependencies (DB, auth)
│   │
│   ├── db/                  # Database
│   │   ├── database.py      # SQLAlchemy setup
│   │   └── models.py        # ORM models (8 таблиц)
│   │
│   ├── schemas/             # Pydantic schemas
│   │   └── schemas.py       # Request/Response models
│   │
│   └── services/            # Business logic
│       └── ai_service.py    # OpenAI integration
│
├── routers/                 # Дополнительные роутеры
│   └── flashcards.py        # SuperMemo-2 логика
│
├── main.py                  # FastAPI app (entry point)
└── init_db.py               # DB initialization
```

### 3.4 Паттерны проектирования

**1. Repository Pattern (ORM)**
```python
# app/db/models.py - определение моделей
class Question(Base):
    __tablename__ = "questions"
    # ...

# app/api/questions.py - использование
question = db.query(Question).filter(Question.id == id).first()
```

**2. Dependency Injection**
```python
# app/core/deps.py
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Валидация JWT
    return user

# app/api/tests.py
@router.post("/new")
def create_test(current_user: User = Depends(get_current_user)):
    # current_user уже валидирован
```

**3. Service Layer Pattern**
```python
# app/services/ai_service.py
class AIService:
    async def get_explanation(self, question, user_answer, language):
        # Бизнес-логика

# app/api/questions.py - использование
explanation = await ai_service.get_explanation(...)
```

**4. State Management (Frontend - Zustand)**
```javascript
// store/authStore.js
const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => set({ token }),
}))

// pages/Login.jsx - использование
const { setToken } = useAuthStore()
```

---

## 4. Функциональные возможности

### 4.1 Модуль тестирования

#### 4.1.1 Создание теста

**Endpoint:** `POST /api/tests/new`

**Параметры:**
```json
{
  "subject_id": 1,           // ID предмета (1 = История Казахстана)
  "language": "ru",          // kz или ru
  "question_count": 20,      // Количество вопросов (по умолчанию 20)
  "mode": "new"              // new | wrong_only
}
```

**Логика:**
1. Проверка количества доступных вопросов по предмету
2. Случайная выборка вопросов (если `mode=new`)
3. Выборка из ошибок пользователя (если `mode=wrong_only`)
4. Создание записи `TestAttempt` в БД
5. Возврат вопросов без правильных ответов

**Response:**
```json
{
  "attempt_id": 123,
  "questions": [
    {
      "id": 45,
      "text": "Вопрос на выбранном языке",
      "options": ["A", "B", "C", "D"]
    }
  ]
}
```

#### 4.1.2 Прохождение теста

**UI Components:**
- `Test.jsx` - главная страница теста
- `QuestionCard.jsx` - отображение вопроса
- `QuestionNavigation.jsx` - навигация между вопросами
- `Timer.jsx` - обратный отсчет (20 минут)

**Функции:**
- Сохранение ответов в Zustand store
- Навигация вперед/назад
- Отметка вопроса для проверки
- Progress bar с анимацией

#### 4.1.3 Сдача теста

**Endpoint:** `POST /api/tests/{test_id}/submit`

**Параметры:**
```json
{
  "answers": {
    "45": 1,  // question_id: selected_option_index
    "46": 3,
    "47": 0
  }
}
```

**Логика:**
1. Валидация attempt_id
2. Подсчет правильных ответов
3. Сохранение результата в БД
4. Создание записей в `WrongAnswers` для ошибок
5. Возврат детализированных результатов

**Response:**
```json
{
  "score": 15,
  "total": 20,
  "percentage": 75,
  "wrong_questions": [
    {
      "question_id": 45,
      "question_text": "Текст вопроса",
      "user_answer": "Ваш ответ",
      "user_answer_index": 1,
      "correct_answer": "Правильный ответ",
      "correct_answer_index": 2
    }
  ]
}
```

### 4.2 AI-Объяснения

#### 4.2.1 Архитектура AI-сервиса

```python
# app/services/ai_service.py
class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL  # gpt-4o-mini

    async def get_explanation(
        self,
        question_text: str,
        options: list,
        user_answer_index: int,
        correct_answer_index: int,
        fact_snippet: str,
        language: str
    ) -> str:
        # Генерация персонализированного объяснения
```

#### 4.2.2 Промпт-инжиниринг

**Система:**
```
Ты - дружелюбный AI-наставник для школьников Казахстана,
готовящихся к ҰБТ. Отвечай на {language}.

ВАЖНО: Используй fact_snippet как ИСТОЧНИК ИСТИНЫ.
```

**Промпт:**
```
Вопрос: {question_text}

Варианты:
{formatted_options}

Ученик выбрал: {user_answer} (НЕВЕРНО)
Правильный ответ: {correct_answer}

Факт (источник истины): {fact_snippet}

Объясни ошибку по структуре:
1. Почему выбранный ответ неверен
2. Почему правильный ответ верен
3. Как запомнить (мнемоника/ассоциация)
```

#### 4.2.3 Кэширование

**Таблица:** `ai_explanations`

**Ключ кэша:** `(question_id, user_answer_index, language)`

**Логика:**
```python
# Проверяем кэш
cached = db.query(AiExplanation).filter(
    AiExplanation.question_id == question_id,
    AiExplanation.user_answer_index == user_answer_index,
    AiExplanation.language == language
).first()

if cached:
    return cached.response_text  # Возвращаем из кэша

# Генерируем новое объяснение
explanation = await ai_service.get_explanation(...)

# Сохраняем в кэш
db.add(AiExplanation(...))
```

**Преимущества:**
- Экономия на API calls (~$0.001/запрос)
- Мгновенный ответ для повторных запросов
- Постоянство ответов

#### 4.2.4 Rate Limiting

**Ограничение:** 10 объяснений в час на пользователя

```python
# Подсчет запросов за последний час
one_hour_ago = datetime.utcnow() - timedelta(hours=1)
recent_count = db.query(AiExplanation).filter(
    AiExplanation.user_id == user_id,
    AiExplanation.created_at >= one_hour_ago
).count()

if recent_count >= 10:
    raise HTTPException(status_code=429, detail="Rate limit exceeded")
```

### 4.3 Флэшкарты (Spaced Repetition)

#### 4.3.1 SuperMemo-2 Алгоритм

**Принцип:** Научно доказанный метод запоминания с оптимальными интервалами повторений.

**Параметры:**
- `quality` (0-5): Качество ответа пользователя
  - 0: Полный провал
  - 1-2: Сложно
  - 3: С усилием
  - 4: Легко
  - 5: Идеально

- `easiness_factor` (EF): Сложность карточки (от 1.3)
- `interval`: Интервал до следующего повторения (в днях)
- `repetitions`: Количество успешных повторений

**Формула:**
```python
# Обновление EF
new_ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
new_ef = max(1.3, new_ef)

# Расчет интервала
if quality < 3:
    # Провал - начинаем заново
    new_repetitions = 0
    new_interval = 0
    next_review = now + 10 минут
else:
    new_repetitions = repetitions + 1
    if new_repetitions == 1:
        new_interval = 1 день
    elif new_repetitions == 2:
        new_interval = 6 дней
    else:
        new_interval = int(interval * new_ef)
    next_review = now + new_interval дней
```

#### 4.3.2 UI/UX Флэшкарт

**Технологии:** Framer Motion для анимаций

**Swipe механика:**
```javascript
const x = useMotionValue(0)  // Позиция по X
const rotate = useTransform(x, [-200, 200], [-25, 25])  // Поворот
const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

// Swipe влево = "Не знаю"
// Swipe вправо = "Знаю"
```

**Анимации:**
- Flip карточки (клик)
- Swipe с rotation
- Success/Fail индикаторы
- Progress bar

### 4.4 Статистика и Аналитика

#### 4.4.1 Dashboard Metrics

**Endpoint:** `GET /api/profile/stats`

**Response:**
```json
{
  "total_tests": 25,
  "total_questions": 500,
  "total_correct": 425,
  "average_score": 85.0,
  "study_time_minutes": 420,

  "subjects_stats": [
    {
      "subject_id": 1,
      "subject_name_ru": "История Казахстана",
      "tests_completed": 15,
      "total_questions": 300,
      "total_correct": 270,
      "accuracy": 90.0,
      "last_test_date": "2024-12-28"
    }
  ],

  "recent_tests": [
    {
      "id": 123,
      "subject_name_ru": "История",
      "score": 18,
      "total": 20,
      "completed_at": "2024-12-28T10:30:00"
    }
  ]
}
```

#### 4.4.2 Activity Calendar

**UI Component:** GitHub-style heatmap

```javascript
// Генерация данных (последние 30 дней)
const activityData = [
  { date: "2024-12-01", count: 3, level: 3 },
  { date: "2024-12-02", count: 0, level: 0 },
  { date: "2024-12-03", count: 5, level: 4 }
]

// level: 0 (нет активности) до 4 (очень активен)
```

**Визуализация:**
```
🟩🟩🟩⬜️🟩🟦🟦  // Последние 7 дней
```

#### 4.4.3 Рекомендации

**Endpoint:** `GET /api/profile/recommendations`

**Логика:**
```python
# Анализ ошибок пользователя
weak_topics = db.query(WrongAnswer, Question).filter(
    WrongAnswer.user_id == user_id,
    WrongAnswer.wrong_count >= 3
).group_by(Question.topic).all()

recommendations = []
for topic, count in weak_topics:
    recommendations.append({
        "priority": "high" if count >= 5 else "medium",
        "title_ru": f"Повторите тему '{topic}'",
        "description_ru": f"У вас {count} ошибок в этой теме",
        "icon": "⚠️"
    })
```

### 4.5 Админ-панель

#### 4.5.1 Управление вопросами

**Endpoints:**
- `GET /api/admin/subjects` - Список предметов
- `POST /api/admin/questions/import` - Импорт из CSV/JSON
- `PUT /api/admin/questions/{id}` - Редактирование
- `DELETE /api/admin/questions/{id}` - Удаление

#### 4.5.2 Импорт вопросов (JSON)

**Формат:**
```json
[
  {
    "subject_id": 1,
    "text_kz": "Вопрос на казахском",
    "text_ru": "Вопрос на русском",
    "options_kz": ["A", "B", "C", "D"],
    "options_ru": ["A", "B", "C", "D"],
    "correct_answer_index": 2,
    "fact_snippet_kz": "Краткая справка (казахский)",
    "fact_snippet_ru": "Краткая справка (русский)",
    "difficulty": "medium",
    "topic": "Золотая Орда"
  }
]
```

**Endpoint:** `POST /api/admin/questions/import`

---

## 5. Технологический стек

### 5.1 Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **React** | 18.2.0 | UI библиотека |
| **Vite** | 5.0.11 | Build tool (быстрая сборка) |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Zustand** | 4.4.7 | State management (легковесная альтернатива Redux) |
| **React Router** | 6.21.1 | Client-side routing |
| **Axios** | 1.6.5 | HTTP client |
| **Framer Motion** | 12.23.26 | Анимации (для флэшкарт) |

### 5.2 Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| **Python** | 3.10+ | Язык программирования |
| **FastAPI** | 0.109.0 | Async web framework |
| **Uvicorn** | 0.27.0 | ASGI server |
| **SQLAlchemy** | 2.0.25 | ORM (Object-Relational Mapping) |
| **PostgreSQL** | 14+ | Реляционная база данных |
| **Pydantic** | 2.5.3 | Валидация данных |
| **python-jose** | 3.3.0 | JWT токены |
| **passlib** | 1.7.4 | Хеширование паролей (bcrypt) |
| **OpenAI SDK** | 1.10.0 | AI-интеграция |

### 5.3 DevOps

| Инструмент | Назначение |
|-----------|------------|
| **Git** | Version control |
| **npm** | Frontend package manager |
| **pip** | Python package manager |
| **venv** | Python virtual environment |

---

## 6. База данных

### 6.1 ER-Диаграмма

```
┌──────────────┐
│    Users     │
├──────────────┤
│ id (PK)      │
│ email        │◄───┐
│ password_hash│    │
│ role         │    │
│ selected_    │    │
│  subjects    │    │
│ ent_date     │    │
│ daily_goal   │    │
└──────────────┘    │
                    │
┌──────────────┐    │
│  Subjects    │    │
├──────────────┤    │
│ id (PK)      │◄───┼────┐
│ name_kz      │    │    │
│ name_ru      │    │    │
│ icon         │    │    │
└──────────────┘    │    │
       ▲            │    │
       │            │    │
┌──────────────┐    │    │
│  Questions   │    │    │
├──────────────┤    │    │
│ id (PK)      │    │    │
│ subject_id   │────┘    │
│ text_kz      │         │
│ text_ru      │         │
│ options_kz   │         │
│ options_ru   │         │
│ correct_ans  │         │
│ fact_snippet │         │
│ difficulty   │         │
│ topic        │         │
└──────────────┘         │
       │                 │
       │                 │
┌──────────────┐         │
│TestAttempts  │         │
├──────────────┤         │
│ id (PK)      │         │
│ user_id (FK) │─────────┘
│ subject_id   │─────────┐
│ score        │         │
│ total        │         │
│ answers      │         │
│ created_at   │         │
└──────────────┘         │
                         │
┌──────────────┐         │
│WrongAnswers  │         │
├──────────────┤         │
│ id (PK)      │         │
│ user_id (FK) │─────────┘
│ question_id  │
│ wrong_count  │
│ last_wrong_at│
└──────────────┘

┌──────────────┐
│AiExplanations│
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ question_id  │
│ user_answer  │
│ language     │
│ response_text│
│ model        │
└──────────────┘

┌──────────────┐         ┌──────────────┐
│  Flashcards  │         │FlashcardReview│
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ id (PK)      │
│ subject_id   │         │ user_id (FK) │
│ front        │         │ flashcard_id │
│ back         │         │ easiness_    │
│ hint         │         │  factor      │
└──────────────┘         │ interval     │
                         │ repetitions  │
                         │ next_review  │
                         └──────────────┘
```

### 6.2 Описание таблиц

#### 6.2.1 users

**Назначение:** Хранение информации о пользователях

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| email | String (unique) | Email (логин) |
| password_hash | String | Bcrypt хеш пароля |
| role | String | user / admin |
| selected_subjects | JSON | Массив ID выбранных предметов |
| ent_date | DateTime | Дата планируемого ҰБТ |
| daily_goal_minutes | Integer | Цель обучения (минуты/день) |
| profile_completed | Boolean | Завершен ли онбординг |
| created_at | DateTime | Дата регистрации |

#### 6.2.2 subjects

**Назначение:** Предметы ҰБТ

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| name_kz | String | Название (казахский) |
| name_ru | String | Название (русский) |
| icon | String | Emoji иконка (📚) |

**Данные:**
```sql
INSERT INTO subjects (id, name_kz, name_ru, icon) VALUES
(1, 'Қазақстан тарихы', 'История Казахстана', '📜'),
(2, 'Математикалық сауаттылық', 'Математическая грамотность', '🔢'),
(3, 'Оқу сауаттылығы', 'Грамотность чтения', '📖'),
-- ... 14 предметов всего
```

#### 6.2.3 questions

**Назначение:** Банк вопросов (730 в БД)

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| subject_id | Integer (FK) | Ссылка на предмет |
| text_kz | Text | Текст вопроса (казахский) |
| text_ru | Text | Текст вопроса (русский) |
| options_kz | JSON | Массив вариантов (казахский) |
| options_ru | JSON | Массив вариантов (русский) |
| correct_answer_index | Integer | Индекс правильного ответа (0-3) |
| fact_snippet_kz | Text | Справка для AI (казахский) |
| fact_snippet_ru | Text | Справка для AI (русский) |
| difficulty | String | easy / medium / hard |
| topic | String | Тема вопроса |

**Индексы:**
```sql
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_topic ON questions(topic);
```

#### 6.2.4 test_attempts

**Назначение:** История прохождения тестов

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| user_id | Integer (FK) | Ссылка на пользователя |
| subject_id | Integer (FK) | Предмет |
| language | String | kz / ru |
| mode | String | new / wrong_only |
| score | Integer | Количество правильных ответов |
| total | Integer | Всего вопросов |
| answers | JSON | {question_id: selected_index} |
| created_at | DateTime | Время завершения |

#### 6.2.5 wrong_answers

**Назначение:** Отслеживание ошибок для адаптивного обучения

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| user_id | Integer (FK) | Пользователь |
| question_id | Integer (FK) | Вопрос |
| wrong_count | Integer | Сколько раз ошибся |
| last_wrong_at | DateTime | Последняя ошибка |
| is_active | Boolean | Активна ли ошибка |

**Использование:**
```python
# Режим "Только ошибки"
wrong_questions = db.query(WrongAnswer).filter(
    WrongAnswer.user_id == user_id,
    WrongAnswer.is_active == True
).all()

question_ids = [w.question_id for w in wrong_questions]
questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
```

#### 6.2.6 ai_explanations

**Назначение:** Кэш AI-объяснений

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| user_id | Integer (FK) | Пользователь (nullable) |
| question_id | Integer (FK) | Вопрос |
| user_answer_index | Integer | Индекс выбранного ответа |
| language | String | kz / ru |
| model | String | gpt-4o-mini |
| prompt_hash | String | MD5 промпта (для версионирования) |
| response_text | Text | Ответ AI |
| created_at | DateTime | Время генерации |

**Уникальный индекс:**
```sql
CREATE UNIQUE INDEX idx_ai_cache
ON ai_explanations(question_id, user_answer_index, language);
```

#### 6.2.7 flashcards

**Назначение:** Флэшкарты для запоминания

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| subject_id | Integer (FK) | Предмет |
| front | Text | Вопрос/Дата |
| back | Text | Ответ/Событие |
| hint | Text | Подсказка (optional) |
| created_at | DateTime | Дата создания |

**Пример данных:**
```json
{
  "front": "16 декабря 1991",
  "back": "Независимость Казахстана",
  "hint": "Зимний месяц"
}
```

#### 6.2.8 flashcard_reviews

**Назначение:** SuperMemo-2 данные для пользователя

| Поле | Тип | Описание |
|------|-----|----------|
| id | Integer (PK) | Уникальный ID |
| user_id | Integer (FK) | Пользователь |
| flashcard_id | Integer (FK) | Карточка |
| easiness_factor | Float | EF (от 1.3, default 2.5) |
| interval | Integer | Интервал (дни) |
| repetitions | Integer | Количество повторений |
| last_review | DateTime | Последнее повторение |
| next_review | DateTime | Следующее повторение |
| is_mastered | Boolean | Освоена ли карточка |

**Уникальный индекс:**
```sql
CREATE UNIQUE INDEX idx_user_flashcard
ON flashcard_reviews(user_id, flashcard_id);
```

---

## 7. API Reference

### 7.1 Authentication

#### 7.1.1 Регистрация

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Errors:**
- 400: Email already exists
- 422: Validation error

#### 7.1.2 Вход

```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=password123
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### 7.2 Tests

#### 7.2.1 Создать тест

```http
POST /api/tests/new
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject_id": 1,
  "language": "ru",
  "question_count": 20,
  "mode": "new"
}
```

**Response (200):**
```json
{
  "attempt_id": 123,
  "questions": [...]
}
```

#### 7.2.2 Сдать тест

```http
POST /api/tests/{attempt_id}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "1": 2,
    "2": 0,
    "3": 1
  }
}
```

### 7.3 AI Explanations

```http
POST /api/questions/{question_id}/explain
Authorization: Bearer {token}
Content-Type: application/json

{
  "attempt_id": 123,
  "user_answer_index": 1,
  "language": "ru"
}
```

**Response (200):**
```json
{
  "explanation_text": "Твой ответ неверен, потому что..."
}
```

**Errors:**
- 429: Rate limit exceeded (10/hour)

### 7.4 Flashcards

#### 7.4.1 Получить карточки на сегодня

```http
GET /api/flashcards/due/{subject_id}
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "front": "16 декабря 1991",
    "back": "Независимость Казахстана",
    "hint": "Зимний месяц"
  }
]
```

#### 7.4.2 Отметить карточку

```http
POST /api/flashcards/review
Authorization: Bearer {token}
Content-Type: application/json

{
  "card_id": 1,
  "quality": 4
}
```

**Response (200):**
```json
{
  "success": true,
  "next_review": "2024-12-30T10:00:00",
  "interval_days": 6
}
```

### 7.5 Profile & Stats

```http
GET /api/profile/stats
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "total_tests": 25,
  "average_score": 85.0,
  "subjects_stats": [...]
}
```

### 7.6 Admin

#### 7.6.1 Импорт вопросов

```http
POST /api/admin/questions/import
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "questions": [...]
}
```

---

## 8. UI/UX Design System

### 8.1 Цветовая палитра

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;  /* Indigo */
--primary-600: #2563eb;
--primary-900: #1e3a8a;

/* Gradient */
--gradient-primary: linear-gradient(135deg, #0ea5e9, #7c3aed);
--gradient-success: linear-gradient(135deg, #10b981, #34d399);
--gradient-error: linear-gradient(135deg, #ef4444, #f97316);

/* Semantic Colors */
--success: #10b981;  /* Green */
--error: #ef4444;    /* Red */
--warning: #f59e0b;  /* Orange */
--info: #3b82f6;     /* Blue */
```

### 8.2 Typography

```css
/* Fonts */
font-family: 'Inter', 'Poppins', -apple-system, sans-serif;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

### 8.3 Компоненты

#### Button Variants

```jsx
/* Primary Button */
<button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
  Начать тест
</button>

/* Success Button */
<button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold">
  Завершить тест
</button>

/* Secondary Button */
<button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold border-2 border-gray-200">
  Отмена
</button>
```

#### Cards

```jsx
/* Glass Effect Card */
<div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 p-8">
  {/* Content */}
</div>

/* Stat Card */
<div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
  {/* Stats */}
</div>
```

### 8.4 Анимации

```css
/* Tailwind animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

**Использование:**
```jsx
<div className="animate-fade-in">
<div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
<div className="animate-scale-in">
<div className="animate-pulse-scale">
```

### 8.5 Responsive Design

```jsx
/* Mobile-first подход */
<div className="
  text-2xl           /* Mobile: 24px */
  md:text-4xl        /* Tablet: 36px */
  lg:text-5xl        /* Desktop: 48px */
">

/* Breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 9. Безопасность

### 9.1 Аутентификация

**JWT (JSON Web Token):**
```python
# Генерация токена
from jose import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
```

**Хранение:**
- Backend: Генерирует токен при логине
- Frontend: Сохраняет в `localStorage`
- Каждый запрос: `Authorization: Bearer {token}`

**Время жизни:** 30 минут

### 9.2 Хеширование паролей

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Хеширование при регистрации
hashed_password = pwd_context.hash(plain_password)

# Проверка при логине
is_correct = pwd_context.verify(plain_password, hashed_password)
```

**Алгоритм:** bcrypt (стойкий к brute-force)

### 9.3 CORS

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production:**
```python
allow_origins=["https://qazmind.kz"]
```

### 9.4 SQL Injection Protection

**Используется SQLAlchemy ORM:**
```python
# ✅ Безопасно (параметризованный запрос)
user = db.query(User).filter(User.email == email).first()

# ❌ Небезопасно (никогда не делать)
db.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

### 9.5 Rate Limiting

**AI Explanations:** 10 запросов в час

```python
@router.post("/questions/{id}/explain")
async def explain_error(...):
    # Проверка лимита
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    count = db.query(AiExplanation).filter(
        AiExplanation.user_id == user_id,
        AiExplanation.created_at >= one_hour_ago
    ).count()

    if count >= 10:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
```

### 9.6 Чувствительные данные

**⚠️ КРИТИЧНО: Не хранить в git:**
```gitignore
# .gitignore
.env
*.db
__pycache__/
node_modules/
```

**Пример .env:**
```env
DATABASE_URL=postgresql://user:password@localhost/db
SECRET_KEY=your-secret-key-32-characters-minimum
OPENAI_API_KEY=sk-proj-...
```

---

## 10. Развертывание

### 10.1 Локальный запуск

#### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Отредактировать DATABASE_URL, OPENAI_API_KEY

# Инициализировать БД
python init_db.py

# Запустить сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install

# Настроить .env
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Запустить dev server
npm run dev
```

### 10.2 Production

#### Рекомендуемый стек

**Backend:**
- **Хостинг:** Railway / Render / DigitalOcean
- **БД:** Railway PostgreSQL / Supabase / Neon
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot)

**Frontend:**
- **Хостинг:** Vercel / Netlify
- **CDN:** Cloudflare

#### Railway (рекомендуется)

**Backend:**
```bash
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

**Environment Variables:**
```
DATABASE_URL={railway-postgres-url}
SECRET_KEY={generate-strong-key}
OPENAI_API_KEY={your-key}
CORS_ORIGINS=["https://qazmind.vercel.app"]
```

**Frontend на Vercel:**
```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://qazmind-api.railway.app/api"
  }
}
```

### 10.3 Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Security
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# Limits
AI_EXPLANATIONS_PER_HOUR=10
AI_MAX_TOKENS=300
```

#### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### 10.4 Мониторинг

**Рекомендуемые инструменты:**
- **Sentry** - отслеживание ошибок
- **PostHog** - аналитика пользователей
- **Railway Logs** - логи приложения
- **Uptime Robot** - мониторинг доступности

---

## 11. Приложения

### Приложение A: Структура файлов проекта

```
QazMind/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── tests.py
│   │   │   ├── questions.py
│   │   │   ├── profile.py
│   │   │   ├── feedback.py
│   │   │   ├── podcasts.py
│   │   │   └── admin.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── deps.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   └── services/
│   │       ├── __init__.py
│   │       └── ai_service.py
│   ├── routers/
│   │   └── flashcards.py
│   ├── main.py
│   ├── init_db.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Timer.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── QuestionNavigation.jsx
│   │   │   ├── ExplanationModal.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── SubjectSelector.jsx
│   │   │   ├── StatCards.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── KazakhPattern.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Test.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── Podcasts.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── languageStore.js
│   │   │   └── testStore.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── Вопросы/
│   └── История/
│       ├── history_1.json
│       ├── history_2.json
│       └── ... (29 файлов)
│
├── README.md
├── DOCUMENTATION.md (этот файл)
├── PROJECT_STRUCTURE.md
├── PROJECT_SUMMARY.md
├── PROJECT_REPORT.md
├── QUICKSTART.md
├── DEPLOYMENT.md
└── ADMIN_GUIDE.md
```

### Приложение B: Команды для быстрого старта

**Полный запуск (Windows):**
```bash
# Терминал 1 - Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

# Терминал 2 - Frontend
cd frontend
npm run dev
```

**Полный запуск (Linux/Mac):**
```bash
# Терминал 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Терминал 2 - Frontend
cd frontend
npm run dev
```

### Приложение C: Полезные ссылки

**Документация технологий:**
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Framer Motion](https://www.framer.com/motion/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [OpenAI API](https://platform.openai.com/docs/)

**Deployment:**
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/)

---

## Контакты и поддержка

**Проект:** QazMind
**Версия документации:** 1.0.0
**Дата последнего обновления:** Декабрь 2024

**Для вопросов и предложений:**
- GitHub: [ваш-репозиторий]
- Email: support@qazmind.kz (если есть)

---

**Конец документации**

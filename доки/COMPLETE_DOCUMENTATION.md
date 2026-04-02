# 📚 QazMind - Полная документация проекта

**Версия**: 1.1.0  
**Дата обновления**: Январь 2026  
**Статус**: Production Ready (MVP+)

---

## 📖 Оглавление

1. [Описание проекта](#описание-проекта)
2. [Реализованный функционал](#реализованный-функционал)
3. [Технический стек](#технический-стек)
4. [Архитектура системы](#архитектура-системы)
5. [Структура базы данных](#структура-базы-данных)
6. [API Документация](#api-документация)
7. [Frontend Компоненты](#frontend-компоненты)
8. [Как начать работу](#как-начать-работу)
9. [Развертывание](#развертывание)
10. [Известные проблемы и решения](#известные-проблемы-и-решения)

---

## 1️⃣ Описание проекта

### Что такое QazMind?

**QazMind** - это веб-платформа для подготовки к Единому Национальному Тестированию (ҰБТ) в Республике Казахстан, интегрирующая искусственный интеллект для персонализированного обучения.

### 🎯 Основная цель

Предоставить доступную, эффективную и инновационную платформу для:
- ✅ Самостоятельной подготовки к ҰБТ
- ✅ Понимания пройденного материала через AI-объяснения
- ✅ Запоминания информации через метод Spaced Repetition
- ✅ Отслеживания личного прогресса

### 💡 Уникальные особенности

| Особенность | Описание |
|-----------|-----------|
| 🤖 AI-ментор | Персонализированные объяснения ошибок через OpenAI GPT-4o-mini |
| 🧠 Spaced Repetition | Алгоритм SuperMemo-2 для оптимального запоминания |
| 🌐 Двуязычность | Полная поддержка Казахского и Русского языков |
| 📊 Аналитика | Детальное отслеживание прогресса по предметам |
| 🎵 Интерактивность | Звуковые эффекты и вибрация для лучшего UX |
| 📱 Responsive | Оптимально работает на десктопе, планшете и мобильном |

---

## 2️⃣ Реализованный функционал

### 👥 Для учеников

#### 📝 Тестирование
- ✅ Создание тестов по выбранным предметам
- ✅ 20 вопросов с выбором одного правильного ответа
- ✅ Таймер 20 минут для каждого теста
- ✅ Выбор языка вопросов (Казахский/Русский)
- ✅ Сохранение результатов в базу данных

#### 🤖 AI-Объяснения
- ✅ Персонализированные объяснения за каждую ошибку
- ✅ Объяснения на выбранном языке (КЗ/РУ)
- ✅ Кэширование объяснений для экономии API
- ✅ Rate limiting (макс 10 объяснений в час)
- ✅ Модель: GPT-4o-mini от OpenAI

#### 🧠 Флэш-карточки (NEW!)
- ✅ Система повторения с алгоритмом SuperMemo-2
- ✅ Фильтрация по статусам: новые, обучение, повтор, освоенные
- ✅ Прогресс-бар сессии и таймер
- ✅ История просмотров карточек
- ✅ Звуковые эффекты и вибрация
- ✅ Оптимизация для мобильных устройств

#### 📊 Аналитика
- ✅ Просмотр общей статистики
- ✅ Процент правильных ответов по предметам
- ✅ История попыток тестирования
- ✅ Динамика улучшений
- ✅ Рекомендации на основе ошибок

#### 🎙️ Подкасты
- ✅ Аудиоконтент по предметам
- ✅ Возможность слушать mientras учится
- ✅ Интеграция в основное приложение

#### 👤 Профиль
- ✅ Регистрация и вход
- ✅ Выбор предметов (3 обязательных + 2 профильных)
- ✅ Установка даты ҰБТ экзамена
- ✅ Ежедневная цель (по умолчанию 30 минут)
- ✅ Хранение настроек пользователя

### ⚙️ Для администраторов

- ✅ Управление вопросами (добавление, редактирование, удаление)
- ✅ Импорт вопросов из CSV файлов
- ✅ Управление предметами
- ✅ Администраторская панель (SQlAdmin)
- ✅ Скрипты инициализации БД с тестовыми данными
- ✅ Просмотр аналитики платформы

---

## 3️⃣ Технический стек

### 🔙 Backend

```
FastAPI 0.109.0          - Веб-фреймворк
Python 3.10+             - Язык программирования
PostgreSQL               - База данных
SQLAlchemy 2.0.25        - ORM
Pydantic 2.5.3           - Валидация данных
OpenAI 1.10.0            - AI интеграция
SQLAdmin 0.16.0          - Админ-панель
JWT (python-jose)        - Аутентификация
```

### 🎨 Frontend

```
React 18.2.0             - UI библиотека
Vite                     - Сборщик
Tailwind CSS 3           - Стили
Zustand 4.4.7            - State management
React Router 6           - Маршрутизация
Axios                    - HTTP клиент
Framer Motion 12         - Анимации
```

### 🛠️ DevOps & Tools

```
PostgreSQL 13+           - Основная БД
Git                      - Версионирование
Windows Batch            - Скрипты запуска
Uvicorn                  - ASGI сервер для FastAPI
```

---

## 4️⃣ Архитектура системы

### 🏗️ Общая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    QazMind Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            React Frontend (Vite)                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │
│  │  │ Landing  │  │ Dashboard│  │ Flashcards       │ │  │
│  │  │ Login    │  │ Tests    │  │ (NEW!)           │ │  │
│  │  │ Register │  │ Results  │  │ Podcasts         │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ▲                                    │
│                        │ Axios                             │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          FastAPI Backend                            │  │
│  │  ┌───────────────┐  ┌─────────────┐  ┌───────────┐ │  │
│  │  │ /api/tests    │  │ /api/profile│  │ /api/     │ │  │
│  │  │ /api/questions│  │ /api/admin  │  │ flashcards│ │  │
│  │  │ /api/feedback │  │ /api/auth   │  │ /api/pods │ │  │
│  │  └───────────────┘  └─────────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                        ▲                                    │
│                        │ SQLAlchemy                         │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          PostgreSQL Database                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────────────┐ │  │
│  │  │ Users    │ │Questions │ │FlashcardReviews   │ │  │
│  │  │Subjects  │ │TestAttempt│ │Podcasts           │ │  │
│  │  │          │ │WrongAnswers│ │                   │ │  │
│  │  └──────────┘ └──────────┘ └─────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          External APIs                              │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │  OpenAI API (GPT-4o-mini)                   │   │  │
│  │  │  - AI объяснения ошибок                     │   │  │
│  │  │  - Персонализированный контент              │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 🔐 Безопасность

- ✅ JWT токены для аутентификации
- ✅ Хеширование паролей (bcrypt)
- ✅ Rate limiting на AI запросы
- ✅ CORS настройки для фронтенда
- ✅ SQL injection защита (SQLAlchemy)
- ✅ Валидация данных через Pydantic

---

## 5️⃣ Структура базы данных

### 📋 Таблицы и связи

```sql
-- 1. Пользователи
users (
  id INT PRIMARY KEY
  email VARCHAR UNIQUE
  password_hash VARCHAR
  role VARCHAR (user/admin)
  selected_subjects JSON (массив ID предметов)
  ent_date DATETIME
  daily_goal_minutes INT
  profile_completed BOOLEAN
  created_at DATETIME
)

-- 2. Предметы
subjects (
  id INT PRIMARY KEY
  name_kz VARCHAR
  name_ru VARCHAR
  icon VARCHAR (emoji)
)

-- 3. Вопросы
questions (
  id INT PRIMARY KEY
  subject_id INT FK
  text_kz TEXT
  text_ru TEXT
  options_kz JSON (массив)
  options_ru JSON (массив)
  correct_answer_index INT
  fact_snippet_kz TEXT
  fact_snippet_ru TEXT
  created_at DATETIME
)

-- 4. Попытки тестов
test_attempts (
  id INT PRIMARY KEY
  user_id INT FK
  subject_id INT FK
  language VARCHAR (kz/ru)
  total_questions INT
  correct_answers INT
  accuracy FLOAT
  time_spent_seconds INT
  mode VARCHAR (new/adaptive)
  created_at DATETIME
)

-- 5. Неправильные ответы
wrong_answers (
  id INT PRIMARY KEY
  user_id INT FK
  question_id INT FK
  test_attempt_id INT FK
  user_answer_index INT
  is_from_previous_error BOOLEAN
  created_at DATETIME
)

-- 6. AI Объяснения
ai_explanations (
  id INT PRIMARY KEY
  user_id INT FK
  question_id INT FK
  explanation TEXT
  language VARCHAR (kz/ru)
  created_at DATETIME
)

-- 7. Флэш-карточки
flashcards (
  id INT PRIMARY KEY
  subject_id INT FK
  front VARCHAR
  back VARCHAR
  front_kz VARCHAR
  back_kz VARCHAR
  hint VARCHAR
  hint_kz VARCHAR
  created_at DATETIME
)

-- 8. История повторений карточек
flashcard_reviews (
  id INT PRIMARY KEY
  user_id INT FK
  flashcard_id INT FK
  easiness_factor FLOAT (SuperMemo-2)
  interval INT (дни)
  repetitions INT
  is_mastered BOOLEAN
  last_review DATETIME
  next_review DATETIME
  created_at DATETIME
)

-- 9. Подкасты
podcasts (
  id INT PRIMARY KEY
  subject_id INT FK
  title_kz VARCHAR
  title_ru VARCHAR
  description_kz TEXT
  description_ru TEXT
  audio_url VARCHAR
  duration_seconds INT
  created_at DATETIME
)

-- 10. Обратная связь
feedback (
  id INT PRIMARY KEY
  user_id INT FK
  question_id INT FK
  type VARCHAR (error/unclear/helpful)
  comment TEXT
  created_at DATETIME
)
```

### 🔗 Связи между таблицами

```
users (1) ──────── (many) test_attempts
users (1) ──────── (many) wrong_answers
users (1) ──────── (many) ai_explanations
users (1) ──────── (many) flashcard_reviews
users (1) ──────── (many) feedback

subjects (1) ────── (many) questions
subjects (1) ────── (many) flashcards
subjects (1) ────── (many) test_attempts
subjects (1) ────── (many) podcasts

questions (1) ──── (many) wrong_answers
questions (1) ──── (many) ai_explanations
questions (1) ──── (many) feedback

test_attempts (1) ─ (many) wrong_answers

flashcards (1) ─── (many) flashcard_reviews
```

---

## 6️⃣ API Документация

### 🔐 Аутентификация

#### POST `/api/auth/register`
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "User created successfully",
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### POST `/api/auth/login`
Вход в систему

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

### 👤 Профиль

#### GET `/api/profile/me`
Получить информацию о текущем пользователе

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "selected_subjects": [1, 2, 3, 4, 5],
  "ent_date": "2026-06-15T00:00:00",
  "daily_goal_minutes": 30,
  "profile_completed": true,
  "created_at": "2025-12-20T10:30:00"
}
```

#### PUT `/api/profile/me`
Обновить профиль пользователя

**Request:**
```json
{
  "selected_subjects": [1, 2, 3, 4, 5],
  "ent_date": "2026-06-15",
  "daily_goal_minutes": 45
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "selected_subjects": [1, 2, 3, 4, 5],
    "profile_completed": true
  }
}
```

#### GET `/api/profile/stats`
Получить детальную статистику пользователя

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "total_tests": 15,
  "total_questions": 300,
  "total_correct": 225,
  "average_score": 75.0,
  "study_time_minutes": 450,
  "subjects_stats": [
    {
      "subject_id": 1,
      "subject_name_kz": "История Казахстана",
      "subject_name_ru": "История Казахстана",
      "tests_completed": 5,
      "accuracy": 78.5,
      "last_test_date": "2026-01-01T15:30:00"
    }
  ]
}
```

#### GET `/api/profile/recommendations`
Получить рекомендации на основе ошибок

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "type": "weak_topic",
    "subject": "История Казахстана",
    "topic": "Даты и события",
    "accuracy": 45.0,
    "recommendation": "Повторите вопросы по датам и событиям"
  }
]
```

---

### 📝 Тесты

#### POST `/api/tests/new`
Создать новый тест

**Request:**
```json
{
  "subject_id": 1,
  "language": "ru",
  "count": 20,
  "mode": "new"
}
```

**Response (200):**
```json
{
  "attempt_id": 42,
  "subject_id": 1,
  "questions": [
    {
      "id": 1,
      "text": "В каком году...",
      "options": [
        "1991",
        "1992",
        "1993",
        "1994"
      ]
    }
  ],
  "total_questions": 20,
  "time_limit_seconds": 1200
}
```

#### POST `/api/tests/{attemptId}/submit`
Отправить ответы теста

**Request:**
```json
{
  "answers": [
    {
      "question_id": 1,
      "answer_index": 0,
      "time_spent_seconds": 45
    }
  ]
}
```

**Response (200):**
```json
{
  "attempt_id": 42,
  "total_questions": 20,
  "correct_answers": 15,
  "accuracy": 75.0,
  "results": [
    {
      "question_id": 1,
      "is_correct": true
    }
  ]
}
```

---

### 🧠 Флэш-карточки (NEW!)

#### GET `/api/flashcards/subjects`
Получить список предметов с карточками

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "name_kz": "История Казахстана",
    "name_ru": "История Казахстана",
    "icon": "📚",
    "flashcards_count": 150
  }
]
```

#### GET `/api/flashcards/due/{subjectId}?filter_type=all&language=ru`
Получить карточки для повторения

**Parameters:**
- `filter_type`: `all`, `new`, `learning`, `review`, `mastered`
- `language`: `ru`, `kz`

**Response (200):**
```json
[
  {
    "id": 1,
    "subject_id": 1,
    "front": "Столица Казахстана?",
    "back": "Нур-Султан (ранее Астана)",
    "hint": "Новая столица с 2019 года",
    "status": "new",
    "interval": 0,
    "easiness_factor": 2.5
  }
]
```

#### POST `/api/flashcards/review`
Отметить карточку как просмотренную

**Request:**
```json
{
  "card_id": 1,
  "quality": 4
}
```

**Parameters (quality):**
- `0` - полный провал
- `1` - неправильно
- `2` - едва вспомнил
- `3` - нормально
- `4` - хорошо
- `5` - идеально

**Response (200):**
```json
{
  "success": true,
  "next_review": "2026-01-04T10:30:00",
  "interval_days": 3
}
```

#### GET `/api/flashcards/history/{subjectId}?limit=20`
История просмотров карточек

**Response (200):**
```json
[
  {
    "card_id": 1,
    "front": "Столица Казахстана?",
    "back": "Нур-Султан",
    "last_review": "2025-12-25T15:30:00",
    "next_review": "2026-01-04T10:30:00",
    "status": "learning",
    "easiness_factor": 2.8,
    "interval": 3,
    "repetitions": 2
  }
]
```

#### GET `/api/flashcards/stats`
Статистика по флэш-карточкам

**Response (200):**
```json
{
  "today": 12,
  "total": 450,
  "mastered": 120
}
```

---

### 🎙️ Подкасты

#### GET `/api/podcasts/`
Получить список всех подкастов

**Response (200):**
```json
[
  {
    "id": 1,
    "subject_id": 1,
    "title_ru": "История Казахстана: Древний период",
    "title_kz": "Қазақ Тарихы: Ежелгі кезең",
    "description_ru": "Подробный рассказ о...",
    "audio_url": "https://...",
    "duration_seconds": 1200,
    "created_at": "2025-12-01T10:00:00"
  }
]
```

---

### ❓ Вопросы

#### POST `/api/questions/{questionId}/explain`
Получить AI объяснение ошибки

**Request:**
```json
{
  "attempt_id": 42,
  "user_answer_index": 1,
  "language": "ru"
}
```

**Response (200):**
```json
{
  "explanation": "Вы выбрали неправильный ответ. Правильный ответ...",
  "correct_answer": "1992",
  "source": "Официальные исторические данные"
}
```

---

### ⚙️ Администраторские API

#### GET `/api/admin/subjects`
Получить все предметы (публичный)

**Response (200):**
```json
[
  {
    "id": 1,
    "name_kz": "История Казахстана",
    "name_ru": "История Казахстана",
    "icon": "📚"
  }
]
```

---

## 7️⃣ Frontend Компоненты

### 📄 Страницы (Pages)

| Страница | Path | Описание |
|----------|------|---------|
| Landing | `/` | Главная страница, описание сервиса |
| Login | `/login` | Форма входа |
| Register | `/register` | Регистрация |
| Dashboard | `/dashboard` | Главная панель пользователя |
| Test | `/test/:subjectId` | Прохождение теста |
| Results | `/results/:attemptId` | Результаты теста |
| Flashcards | `/flashcards` | Система флэш-карточек |
| Podcasts | `/podcasts` | Библиотека подкастов |
| Admin | `/admin` | Админ-панель |

### 🧩 Компоненты (Components)

| Компонент | Файл | Описание |
|-----------|------|---------|
| Layout | `Layout.jsx` | Основной лейаут с навигацией |
| Navbar | `Navbar.jsx` | Навигационная панель |
| Modal | `Modal.jsx` | Модальное окно |
| QuestionCard | `QuestionCard.jsx` | Карточка вопроса |
| Timer | `Timer.jsx` | Таймер теста |
| StatCards | `StatCards.jsx` | Карточки статистики |
| SubjectSelector | `SubjectSelector.jsx` | Выбор предметов |
| ExplanationModal | `ExplanationModal.jsx` | Модаль с объяснением AI |
| AudioPlayer | `AudioPlayer.jsx` | Плеер для подкастов |
| QuestionNavigation | `QuestionNavigation.jsx` | Навигация по вопросам |

### 🗂️ Структура компонентов

```
src/
├── components/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   ├── Modal.jsx
│   ├── QuestionCard.jsx
│   ├── Timer.jsx
│   ├── StatCards.jsx
│   ├── SubjectSelector.jsx
│   ├── ExplanationModal.jsx
│   ├── AudioPlayer.jsx
│   ├── KazakhPattern.jsx
│   └── QuestionNavigation.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Test.jsx
│   ├── Results.jsx
│   ├── Flashcards.jsx
│   ├── Podcasts.jsx
│   └── Admin.jsx
├── services/
│   └── api.js
├── store/
│   ├── authStore.js
│   ├── languageStore.js
│   ├── testStore.js
│   └── themeStore.js
├── utils/
│   ├── api.js (Axios instance)
│   └── sounds.js (Звуковые эффекты)
└── App.jsx
```

### 🎨 State Management (Zustand)

```javascript
// Auth Store
useAuthStore: {
  token,
  user,
  isAuthenticated,
  login(token, user),
  logout(),
  updateUser(user)
}

// Language Store
useLanguageStore: {
  language (ru/kz),
  setLanguage(lang)
}

// Test Store
useTestStore: {
  currentTest,
  answers,
  addAnswer(questionId, answer),
  setCurrentTest(test)
}

// Theme Store
useThemeStore: {
  theme (light/dark),
  toggleTheme()
}
```

---

## 8️⃣ Как начать работу

### 📦 Требования

- **Python** 3.10 или выше
- **Node.js** 16 или выше
- **PostgreSQL** 13 или выше
- **Git**

### 🚀 Установка и запуск

#### 1. Клонирование репозитория

```bash
git clone https://github.com/your-repo/qazmind.git
cd qazmind
```

#### 2. Backend настройка

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Создать файл .env
# DATABASE_URL=postgresql://user:password@localhost:5432/qazmind
# OPENAI_API_KEY=sk-...
# SECRET_KEY=your-secret-key

# Инициализировать базу данных
python init_db.py

# Запустить сервер
uvicorn main:app --reload
# Сервер запущен на http://localhost:8000
# API документация: http://localhost:8000/docs
```

#### 3. Frontend настройка

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
# Приложение доступно на http://localhost:5173
```

### ✅ Проверка работоспособности

```bash
# Backend health check
curl http://localhost:8000/health

# Frontend доступен
open http://localhost:5173

# API документация
open http://localhost:8000/docs
```

### 🧪 Тестовые данные

После запуска `init_db.py` доступны тестовые учетные данные:

```
Email: admin@qazmind.kz
Password: admin123

Email: student@qazmind.kz
Password: student123
```

---

## 9️⃣ Развертывание

### 🐳 Docker развертывание (рекомендуется)

```dockerfile
# Dockerfile для backend
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### ☁️ Cloud развертывание

#### На Heroku:
```bash
heroku create qazmind
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### На AWS:
- EC2 инстанс для backend (FastAPI + Uvicorn)
- RDS для PostgreSQL
- CloudFront для статических файлов фронтенда
- S3 для аудио подкастов

#### На Azure:
- App Service для backend
- Azure Database for PostgreSQL
- Static Web Apps для фронтенда

### 🔐 Production конфигурация

```python
# .env.production
DEBUG=False
ALLOWED_HOSTS=["qazmind.kz", "www.qazmind.kz"]
CORS_ORIGINS=["https://qazmind.kz"]
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://prod_user:...@prod-host:5432/qazmind_prod
SECRET_KEY=very-long-random-string-for-production
```

---

## 🔟 Известные проблемы и решения

### ⚠️ Проблема: 401 Unauthorized при сохранении предметов

**Решение**: 
- Убедитесь что используется правильный API инстанс (с axios перехватчиками)
- Проверьте что токен сохраняется в localStorage
- Обновите страницу браузера

**Файлы для проверки:**
- `frontend/src/utils/api.js` - должен содержать перехватчик авторизации
- `frontend/src/store/authStore.js` - должен сохранять токен

### ⚠️ Проблема: OpenAI API ошибки

**Решение**:
- Проверьте корректность OPENAI_API_KEY в .env
- Убедитесь в наличии баланса в OpenAI аккаунте
- Проверьте rate limiting (макс 10 объяснений в час)

### ⚠️ Проблема: База данных не инициализируется

**Решение**:
```bash
# Удалите старую БД
dropdb qazmind

# Создайте новую
createdb qazmind

# Повторно инициализируйте
python init_db.py
```

### ⚠️ Проблема: Звуки не работают на мобильных

**Решение**:
- Браузер может блокировать автоматическое воспроизведение звуков
- Пользователь должен взаимодействовать с страницей первым
- На iOS требуется полный объем

### 🎯 Performance оптимизация

```javascript
// Lazy loading компонентов
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Код разделение по маршрутам
const routes = [
  {
    path: '/dashboard',
    element: <Suspense><Dashboard /></Suspense>
  }
]

// Кэширование API запросов
axios.defaults.headers.common['Cache-Control'] = 'max-age=300'
```

---

## 📚 Дополнительные ресурсы

### 📖 Документация

- [FastAPI документация](https://fastapi.tiangolo.com/)
- [React документация](https://react.dev/)
- [Tailwind CSS документация](https://tailwindcss.com/)
- [PostgreSQL документация](https://www.postgresql.org/docs/)

### 🔗 Полезные ссылки

- **Swagger API документация**: http://localhost:8000/docs
- **ReDoc API документация**: http://localhost:8000/redoc
- **Админ-панель**: http://localhost:8000/admin

### 🤝 Контрибьютинг

Если вы хотите внести вклад:

1. Fork репозиторий
2. Создайте ветку для вашей функции (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

---

## 📝 Лицензия

MIT License - см. файл LICENSE для деталей

---

## 👥 Поддержка

**Email**: support@qazmind.kz  
**Телеграм**: @qazmind_support  
**GitHub Issues**: github.com/qazmind/issues

---

**Последнее обновление**: Январь 2026  
**Версия**: 1.1.0  
**Статус**: Production Ready ✅

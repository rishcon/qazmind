# QazMind - Платформа для подготовки к ҰБТ с AI-ментором

**Веб-приложение для подготовки к Единому Национальному Тестированию (ҰБТ) с интеграцией искусственного интеллекта.**

## 🎯 Описание проекта

QazMind - это SPA-приложение, где ученики могут проходить тесты по Истории Казахстана. Главная особенность - AI-ментор, который объясняет каждую ошибку персонализированно на казахском или русском языке.

### Ключевые возможности:

- ✅ Тесты по Истории Казахстана (20 вопросов, 20 минут)
- 🤖 AI-объяснения ошибок через OpenAI API
- 🌐 Двуязычный интерфейс (Казахский/Русский)
- 📊 Отслеживание прогресса
- 🎯 Адаптивные тесты на основе ошибок
- 📱 Адаптивный дизайн (мобильные + десктоп)

## 🛠 Технологический стек

### Backend
- Python 3.10+ / FastAPI
- PostgreSQL
- SQLAlchemy ORM
- OpenAI API (GPT-4o-mini)
- JWT Authentication

### Frontend
- React 18 + Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Axios

## 📁 Структура проекта

```
QazMind/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config & security
│   │   ├── db/           # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic (AI)
│   ├── main.py           # FastAPI app
│   ├── init_db.py        # DB initialization script
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/   # UI components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # State management
    │   └── utils/        # Utilities
    ├── package.json
    └── .env.example
```

## 🚀 Быстрый старт

### Требования

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- OpenAI API Key

### 1. Backend Setup

```bash
cd backend

# Создать виртуальное окружение
python -m venv venv
venv\Scripts\activate  # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
cp .env.example .env
# Отредактируйте .env с вашими настройками

# Создать БД PostgreSQL
createdb qazmind

# Инициализировать БД с тестовыми данными
python init_db.py

# Запустить сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend будет доступен на: http://localhost:8000
API документация (Swagger): http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Установить зависимости
npm install

# Настроить .env
cp .env.example .env

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на: http://localhost:5173

## 🔑 Конфигурация

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/qazmind
SECRET_KEY=your-secret-key-min-32-chars
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
AI_EXPLANATIONS_PER_HOUR=10
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

## 📊 База данных

### Основные таблицы:

- **users** - Пользователи
- **subjects** - Предметы (История Казахстана и др.)
- **questions** - Вопросы с вариантами ответов
- **test_attempts** - Попытки прохождения тестов
- **wrong_answers** - Ошибки пользователей
- **ai_explanations** - Кэш AI-объяснений
- **question_feedbacks** - Обратная связь по вопросам

### Тестовый доступ

После запуска `init_db.py`:

- **Админ**: admin@qazmind.kz / admin123
- **5 тестовых вопросов** по Истории Казахстана

## 🎓 Использование

1. **Регистрация/Вход** - Создайте аккаунт или войдите
2. **Выбор языка** - Переключите язык (РУС/ҚАЗ)
3. **Начать тест** - 20 вопросов, 20 минут
4. **Пройти тест** - Ответьте на вопросы
5. **Просмотр результатов** - Увидьте свой балл
6. **AI-объяснения** - Нажмите "Объясни ошибку" для любой ошибки

## 📝 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Тесты
- `POST /api/tests/new` - Создать тест
- `POST /api/tests/{id}/submit` - Отправить ответы

### AI
- `POST /api/questions/{id}/explain` - Получить объяснение

### Админ
- `GET /api/admin/subjects` - Список предметов
- `POST /api/admin/questions/import` - Импорт вопросов (CSV)

## 🔒 Безопасность

- JWT токены для аутентификации
- Rate limiting для AI запросов (10/час)
- Кэширование AI ответов
- Bcrypt хэширование паролей

## 📈 Roadmap

### MVP (Текущая версия)
- ✅ История Казахстана
- ✅ AI объяснения
- ✅ Базовая аутентификация

### Post-MVP
- ⏳ Другие предметы (Математика, Физика)
- ⏳ Google OAuth
- ⏳ Детальная статистика
- ⏳ Мобильное приложение

## 📦 Деплой

### Backend
Рекомендуется: Railway, Render, DigitalOcean

### Frontend
Рекомендуется: Vercel, Netlify

### База данных
PostgreSQL на Railway, Supabase, или Neon

## 🤝 Вклад

Проект находится в активной разработке. Предложения и pull requests приветствуются!

## 📄 Лицензия

MIT License

## 👨‍💻 Автор

QazMind Team

---

**🎯 Цель проекта**: Помочь школьникам Казахстана эффективно подготовиться к ҰБТ с помощью AI-технологий!

# Структура проекта QazMind

```
QazMind/
├── 📁 backend/                      # Python FastAPI Backend
│   ├── 📁 app/
│   │   ├── 📁 api/                  # API Endpoints
│   │   │   ├── __init__.py
│   │   │   ├── auth.py              # Регистрация/Вход
│   │   │   ├── tests.py             # Создание и отправка тестов
│   │   │   ├── questions.py         # AI объяснения
│   │   │   ├── feedback.py          # Обратная связь
│   │   │   └── admin.py             # Админ функции
│   │   │
│   │   ├── 📁 core/                 # Конфигурация и безопасность
│   │   │   ├── __init__.py
│   │   │   ├── config.py            # Настройки приложения
│   │   │   ├── security.py          # JWT, password hashing
│   │   │   └── deps.py              # Dependencies (get_current_user)
│   │   │
│   │   ├── 📁 db/                   # База данных
│   │   │   ├── __init__.py
│   │   │   ├── database.py          # SQLAlchemy setup
│   │   │   └── models.py            # Database models
│   │   │
│   │   ├── 📁 schemas/              # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   └── schemas.py           # Request/Response schemas
│   │   │
│   │   ├── 📁 services/             # Business logic
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py        # OpenAI integration
│   │   │
│   │   └── __init__.py
│   │
│   ├── main.py                      # FastAPI app (точка входа)
│   ├── init_db.py                   # DB initialization script
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Example environment variables
│   ├── .gitignore
│   ├── README.md
│   ├── setup.bat                    # Windows setup script
│   ├── start-backend.bat            # Windows start script
│   └── sample_questions.csv         # Пример CSV для импорта
│
├── 📁 frontend/                     # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/           # React компоненты
│   │   │   ├── Layout.jsx           # Основной layout
│   │   │   ├── Navbar.jsx           # Навигация
│   │   │   ├── Timer.jsx            # Таймер теста
│   │   │   ├── QuestionCard.jsx     # Карточка вопроса
│   │   │   ├── QuestionNavigation.jsx  # Навигация по вопросам
│   │   │   └── ExplanationModal.jsx # Модалка AI объяснения
│   │   │
│   │   ├── 📁 pages/                # Страницы
│   │   │   ├── Landing.jsx          # Главная страница
│   │   │   ├── Login.jsx            # Страница входа
│   │   │   ├── Register.jsx         # Страница регистрации
│   │   │   ├── Test.jsx             # Страница теста
│   │   │   ├── Results.jsx          # Страница результатов
│   │   │   └── Dashboard.jsx        # Личный кабинет
│   │   │
│   │   ├── 📁 services/             # API сервисы
│   │   │   └── api.js               # API functions
│   │   │
│   │   ├── 📁 store/                # Zustand state management
│   │   │   ├── authStore.js         # Аутентификация state
│   │   │   ├── languageStore.js     # Язык state
│   │   │   └── testStore.js         # Тест state
│   │   │
│   │   ├── 📁 utils/                # Утилиты
│   │   │   └── api.js               # Axios setup
│   │   │
│   │   ├── App.jsx                  # Главный компонент
│   │   ├── main.jsx                 # Точка входа
│   │   └── index.css                # Tailwind CSS
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # NPM dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .env.example                 # Example environment variables
│   ├── .gitignore
│   ├── README.md
│   ├── setup.bat                    # Windows setup script
│   └── start-frontend.bat           # Windows start script
│
├── README.md                        # Главная документация
├── QUICKSTART.md                    # Быстрый старт
└── DEPLOYMENT.md                    # Инструкция по деплою
```

## 📝 Описание ключевых файлов

### Backend

**main.py** - Точка входа FastAPI приложения
- Настройка CORS
- Подключение роутеров
- Lifecycle management

**app/db/models.py** - SQLAlchemy модели
- User (пользователи)
- Subject (предметы)
- Question (вопросы)
- TestAttempt (попытки тестов)
- WrongAnswer (отслеживание ошибок)
- AiExplanation (кэш AI объяснений)
- QuestionFeedback (обратная связь)

**app/api/** - API endpoints
- `auth.py` - POST /register, /login
- `tests.py` - POST /tests/new, /tests/{id}/submit
- `questions.py` - POST /questions/{id}/explain
- `admin.py` - POST /admin/questions/import

**app/services/ai_service.py** - OpenAI integration
- Генерация AI объяснений
- Защита от галлюцинаций (fact_snippet)
- Формирование промптов

### Frontend

**App.jsx** - Главный компонент с роутингом
- Настройка React Router
- Основные маршруты

**store/** - State management (Zustand)
- `authStore` - токен, пользователь
- `languageStore` - язык интерфейса (kz/ru)
- `testStore` - состояние теста

**pages/** - Страницы приложения
- `Landing` - лендинг с описанием
- `Test` - прохождение теста
- `Results` - результаты с AI объяснениями
- `Dashboard` - личный кабинет

**components/** - Переиспользуемые компоненты
- `QuestionCard` - отображение вопроса
- `Timer` - обратный отсчет
- `ExplanationModal` - модалка с AI объяснением

## 🔑 Ключевые особенности архитектуры

### Backend

1. **Чистая архитектура**
   - Разделение на слои (API, Services, DB)
   - Pydantic schemas для валидации
   - Dependency injection

2. **Безопасность**
   - JWT токены
   - Bcrypt хэширование паролей
   - Rate limiting для AI запросов

3. **Оптимизация**
   - Кэширование AI ответов
   - Индексы в БД
   - Efficient queries

### Frontend

1. **Современный стек**
   - Vite (быстрая сборка)
   - Tailwind CSS (utility-first)
   - Zustand (легковесный state)

2. **UX/UI**
   - Двуязычный интерфейс (kz/ru)
   - Адаптивный дизайн
   - Интуитивная навигация

3. **Производительность**
   - Lazy loading страниц
   - Оптимизированные запросы
   - LocalStorage для кэширования

## 🚀 Расширение проекта

### Добавление нового предмета

1. Добавить в БД через admin или SQL:
```sql
INSERT INTO subjects (name_kz, name_ru) VALUES ('Математика', 'Математика');
```

2. Импортировать вопросы через CSV или админку

3. Frontend автоматически подхватит новый предмет

### Добавление новой страницы

1. Создать компонент в `frontend/src/pages/`
2. Добавить роут в `App.jsx`
3. Добавить ссылку в `Navbar.jsx`

### Добавление нового API endpoint

1. Создать функцию в соответствующем файле в `backend/app/api/`
2. Добавить Pydantic schema в `schemas.py`
3. Добавить функцию в `frontend/src/services/api.js`

## 📚 Дополнительные ресурсы

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

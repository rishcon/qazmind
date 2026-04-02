# 🚀 QazMind - Справочник для разработчиков

---

## ⚡ Быстрый старт (5 минут)

### 1️⃣ Клонирование
```bash
git clone https://github.com/qazmind/qazmind.git
cd qazmind
```

### 2️⃣ Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# или source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### 3️⃣ Настройка БД
```bash
# Создайте PostgreSQL базу
createdb qazmind

# .env файл (скопируйте из .env.example)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/qazmind
# OPENAI_API_KEY=sk-...
# SECRET_KEY=your-secret-key

# Инициализация
python init_db.py
```

### 4️⃣ Запуск Backend
```bash
uvicorn main:app --reload
# http://localhost:8000
```

### 5️⃣ Frontend
```bash
cd ../frontend
npm install
npm run dev
# http://localhost:5173
```

---

## 📁 Структура проекта

```
QazMind/
├── backend/
│   ├── app/
│   │   ├── api/              # REST API эндпоинты
│   │   │   ├── auth.py       # Регистрация/вход
│   │   │   ├── tests.py      # Тесты
│   │   │   ├── questions.py  # Вопросы и объяснения
│   │   │   ├── profile.py    # Профиль пользователя
│   │   │   ├── feedback.py   # Обратная связь
│   │   │   ├── admin.py      # Администрирование
│   │   │   └── podcasts.py   # Подкасты
│   │   ├── core/             # Конфигурация
│   │   │   ├── config.py     # Параметры
│   │   │   ├── deps.py       # Зависимости (JWT)
│   │   │   └── security.py   # Шифрование
│   │   ├── db/               # БД и модели
│   │   │   ├── database.py   # Подключение
│   │   │   └── models.py     # SQLAlchemy модели
│   │   ├── schemas/          # Pydantic схемы
│   │   │   └── schemas.py    # Валидация
│   │   └── services/         # Бизнес-логика
│   │       └── ai_service.py # OpenAI интеграция
│   ├── routers/
│   │   └── flashcards.py     # Flashcards эндпоинты
│   ├── main.py               # FastAPI приложение
│   ├── init_db.py            # Инициализация БД
│   ├── requirements.txt       # Python пакеты
│   └── .env                  # Переменные окружения
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React компоненты
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── SubjectSelector.jsx
│   │   │   └── ... (11 всего)
│   │   ├── pages/           # Страницы (маршруты)
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Test.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── Flashcards.jsx
│   │   │   ├── Podcasts.jsx
│   │   │   └── Admin.jsx
│   │   ├── services/
│   │   │   └── api.js       # API вызовы
│   │   ├── store/           # Zustand хранилище
│   │   │   ├── authStore.js
│   │   │   ├── languageStore.js
│   │   │   ├── testStore.js
│   │   │   └── themeStore.js
│   │   ├── utils/
│   │   │   ├── api.js       # Axios конфиг
│   │   │   └── sounds.js    # Звуковые эффекты
│   │   ├── App.jsx          # Главный компонент
│   │   ├── main.jsx         # Точка входа
│   │   └── index.css        # Глобальные стили
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Вопросы/                  # Данные для импорта
│   ├── История/
│   │   ├── history_1.json
│   │   └── ... (28 файлов)
│   └── Физика/
│       └── физика.json
│
├── COMPLETE_DOCUMENTATION.md # Полная документация
├── VERSION_1_1_CHANGELOG.md  # Что нового в v1.1
├── FLASHCARDS_IMPROVEMENTS.md # Улучшения flashcards
├── README.md
├── QUICKSTART.md
└── ... (другие файлы)
```

---

## 🔑 Ключевые файлы для редактирования

### Backend

| Файл | Для чего | Пример |
|------|---------|--------|
| `app/api/*.py` | Добавить новый API эндпоинт | Новая функция в `questions.py` |
| `app/db/models.py` | Добавить новую таблицу | Класс `MyModel(Base)` |
| `routers/flashcards.py` | Flashcards логика | Новый фильтр |
| `app/services/ai_service.py` | AI интеграция | Новый промпт |
| `.env` | Переменные окружения | `API_KEY=...` |

### Frontend

| Файл | Для чего | Пример |
|------|---------|--------|
| `pages/*.jsx` | Добавить страницу | Новый маршрут |
| `components/*.jsx` | Переиспользуемый компонент | Новая кнопка/карточка |
| `store/*.js` | Глобальное состояние | `const useMyStore = create(...)` |
| `utils/api.js` | HTTP конфигурация | Добавить перехватчик |
| `tailwind.config.js` | Стили и палитра | Новые цвета |

---

## 🔗 API быстрый справочник

### Аутентификация
```bash
# Регистрация
POST /api/auth/register
{ "email": "...", "password": "..." }

# Вход
POST /api/auth/login
{ "email": "...", "password": "..." }
```

### Профиль
```bash
# Получить профиль
GET /api/profile/me
Authorization: Bearer {token}

# Обновить профиль
PUT /api/profile/me
{ "selected_subjects": [...] }

# Статистика
GET /api/profile/stats
```

### Тесты
```bash
# Создать тест
POST /api/tests/new
{ "subject_id": 1, "language": "ru" }

# Отправить ответы
POST /api/tests/{attemptId}/submit
{ "answers": [...] }
```

### Flashcards
```bash
# Карточки на повтор
GET /api/flashcards/due/{subjectId}?filter_type=new

# Отметить просмотренную
POST /api/flashcards/review
{ "card_id": 1, "quality": 4 }

# История
GET /api/flashcards/history/{subjectId}

# Статистика
GET /api/flashcards/stats
```

---

## 🎨 Цветовая палитра

### Основные цвета
```css
/* Primary */
--primary-500: #A855F7    /* Purple */
--primary-600: #9333EA
--primary-700: #7E22CE

/* Secondary */
--secondary-500: #EC4899  /* Pink */
--secondary-600: #DB2777
--secondary-700: #BE185D

/* Accent */
--accent-500: #06B6D4    /* Cyan */
--accent-600: #0891B2
```

### Использование
```jsx
// Tailwind
<div className="bg-purple-500 text-pink-600">
  Gradient
</div>

// Gradient
<div className="bg-gradient-to-r from-purple-500 to-pink-500">
  ...
</div>
```

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind версии:
sm: 640px   // Мобильные планшеты
md: 768px   // Планшеты
lg: 1024px  // Ноутбуки
xl: 1280px  // Десктоп
2xl: 1536px // Широкие экраны
```

### Примеры
```jsx
// Адаптивный текст
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Заголовок
</h1>

// Адаптивный лейаут
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* На мобильных: 1 колона, на планшетах: 2, на ноутбуках: 3 */}
</div>
```

---

## 🔐 Аутентификация

### Frontend
```javascript
import { useAuthStore } from '../store/authStore'

export default function MyComponent() {
  const { token, login, logout } = useAuthStore()
  
  if (!token) return <Navigate to="/login" />
  
  return <div>Приватная страница</div>
}
```

### Backend
```python
from app.core.deps import get_current_user
from app.db.models import User

@app.get("/api/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"user_id": current_user.id}
```

---

## 💾 Работа с базой данных

### Добавить новую таблицу

1. **Создать модель** в `app/db/models.py`:
```python
class MyModel(Base):
    __tablename__ = "my_models"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
```

2. **Миграция** (автоматическая):
```python
# В main.py lifespan это делается автоматически
Base.metadata.create_all(bind=engine)
```

3. **Схема Pydantic** в `app/schemas/schemas.py`:
```python
class MyModelCreate(BaseModel):
    name: str

class MyModelResponse(MyModelCreate):
    id: int
    class Config:
        from_attributes = True
```

4. **API эндпоинт**:
```python
@app.post("/api/mymodels", response_model=MyModelResponse)
def create_mymodel(
    data: MyModelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = MyModel(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
```

---

## 🧪 Тестирование

### Тестовые учетные данные
```
Admin:
  Email: admin@qazmind.kz
  Pass: admin123

Student:
  Email: student@qazmind.kz
  Pass: student123
```

### Тестирование API в Swagger
```
http://localhost:8000/docs
```

### Тестирование Frontend
```bash
# Используйте DevTools
F12 -> Console -> Network

# Или:
npm run test
```

---

## 🐛 Отладка

### Backend отладка
```python
# Добавить print
print(f"Debug: {variable}")

# Или использовать debugger
import pdb; pdb.set_trace()
```

### Frontend отладка
```javascript
// Console.log
console.log('Debug:', variable)

// Debugger
debugger;

// React DevTools
# Установите расширение в браузер
```

### Network отладка
```bash
# Смотрите Network tab в DevTools
# Проверьте статус кода, заголовки, тело

# Или logируйте в axios:
api.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  }
)
```

---

## 📦 Добавление новых пакетов

### Backend
```bash
cd backend
pip install package_name
pip freeze > requirements.txt
```

### Frontend
```bash
cd frontend
npm install package_name
# Автоматически обновляется package.json
```

---

## 🚀 Deploy команды

### Docker
```bash
# Backend
docker build -t qazmind-backend ./backend
docker run -p 8000:8000 qazmind-backend

# Frontend
docker build -t qazmind-frontend ./frontend
docker run -p 5173:5173 qazmind-frontend
```

### Production переменные
```bash
# .env.production
DEBUG=False
ALLOWED_HOSTS=["qazmind.kz"]
CORS_ORIGINS=["https://qazmind.kz"]
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-...
```

---

## 📚 Полезные команды

```bash
# Backend
cd backend
python init_db.py          # Инициализировать БД
uvicorn main:app --reload  # Запустить сервер
python -m pytest            # Запустить тесты

# Frontend
cd frontend
npm install                # Установить зависимости
npm run dev               # Dev сервер
npm run build             # Production build
npm run preview           # Preview prod build

# Database
psql -U postgres -d qazmind  # Подключиться к БД
\dt                          # Показать таблицы
\l                           # Показать базы
```

---

## 🔗 Важные ссылки

- **Swagger API**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Админ-панель**: http://localhost:8000/admin
- **Frontend**: http://localhost:5173
- **GitHub**: https://github.com/qazmind/qazmind

---

## 🆘 Часто задаваемые вопросы

### Как добавить новый язык?
1. Добавьте поле `name_xx` в модели
2. Обновите schema
3. Обновите frontend компоненты

### Как изменить API ключ OpenAI?
1. Обновите `.env` файл
2. Перезапустите backend

### Как добавить новый предмет?
1. Через админ-панель: http://localhost:8000/admin
2. Или через скрипт: `add_all_subjects.py`

### Как импортировать вопросы?
```bash
python add_questions.py
# Скрипт будет искать CSV файлы в текущей папке
```

---

## 💬 Получить помощь

- **Issues**: GitHub Issues
- **Email**: dev@qazmind.kz
- **Docs**: Смотрите COMPLETE_DOCUMENTATION.md
- **Discord**: [Присоединитесь к серверу]

---

**Happy Coding! 🚀**

Версия: 1.1.0  
Последнее обновление: Январь 2026

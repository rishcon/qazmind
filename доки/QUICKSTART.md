# QazMind - Быстрый старт

## 🚀 Запуск проекта за 5 минут

### Шаг 1: Backend

```powershell
# Перейти в папку backend
cd backend

# Создать виртуальное окружение
python -m venv venv

# Активировать (Windows)
.\venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
Copy-Item .env.example .env

# Отредактируйте .env:
# - DATABASE_URL (если нужна PostgreSQL, иначе можно использовать SQLite)
# - OPENAI_API_KEY (ваш OpenAI ключ)
# - SECRET_KEY (сгенерируйте случайную строку)

# Для быстрого старта можно использовать SQLite:
# DATABASE_URL=sqlite:///./qazmind.db

# Инициализировать БД с тестовыми данными
python init_db.py

# Запустить сервер
uvicorn main:app --reload
```

Backend запущен на: http://localhost:8000
API Docs: http://localhost:8000/docs

### Шаг 2: Frontend

Откройте новый терминал:

```powershell
# Перейти в папку frontend
cd frontend

# Установить зависимости
npm install

# Создать .env файл
Copy-Item .env.example .env

# Запустить dev сервер
npm run dev
```

Frontend запущен на: http://localhost:5173

### Шаг 3: Откройте браузер

Перейдите на http://localhost:5173 и начните использовать приложение!

## 🎯 Тестовый доступ

После запуска `init_db.py` будет создан тестовый админ:
- Email: admin@qazmind.kz
- Password: admin123

## 📝 Примечания

### SQLite vs PostgreSQL

Для быстрого старта можно использовать SQLite:
```env
DATABASE_URL=sqlite:///./qazmind.db
```

Для продакшена рекомендуется PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/qazmind
```

### OpenAI API Key

Получите ключ на: https://platform.openai.com/api-keys

Для тестирования можно использовать модель `gpt-4o-mini` (дешево):
```env
OPENAI_MODEL=gpt-4o-mini
```

## ⚠️ Возможные проблемы

### Backend не запускается

1. Проверьте, что виртуальное окружение активировано
2. Убедитесь, что все зависимости установлены
3. Проверьте правильность DATABASE_URL в .env

### Frontend не запускается

1. Убедитесь, что Node.js версии 18+
2. Попробуйте удалить node_modules и запустить `npm install` снова
3. Проверьте, что backend запущен на порту 8000

### CORS ошибки

Убедитесь, что в backend/.env указан правильный CORS_ORIGINS:
```env
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

## 🎓 Следующие шаги

1. Зарегистрируйте аккаунт
2. Выберите язык (РУС/ҚАЗ)
3. Начните тест
4. Попробуйте AI-объяснения для ошибок

Удачи! 🚀

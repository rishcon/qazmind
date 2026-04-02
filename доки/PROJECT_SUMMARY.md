# 🎓 QazMind - Платформа для подготовки к ҰБТ с AI-ментором

## ✅ Что создано

### Backend (Python FastAPI)
✅ Полная структура FastAPI приложения
✅ База данных PostgreSQL с 7 таблицами
✅ JWT аутентификация
✅ API endpoints для всех функций
✅ OpenAI интеграция для AI объяснений
✅ Rate limiting и кэширование
✅ Админ панель
✅ Скрипт инициализации БД с тестовыми данными

### Frontend (React + Vite)
✅ Современный React SPA
✅ Двуязычный интерфейс (Казахский/Русский)
✅ Все основные страницы (Landing, Login, Register, Test, Results, Dashboard)
✅ Tailwind CSS для стилей
✅ Zustand для state management
✅ React Router для навигации
✅ Адаптивный дизайн

### Документация
✅ README.md - основная документация
✅ QUICKSTART.md - быстрый старт за 5 минут
✅ DEPLOYMENT.md - инструкция по деплою
✅ PROJECT_STRUCTURE.md - структура проекта

### Скрипты для запуска
✅ setup.bat и start-backend.bat для Windows
✅ setup.bat и start-frontend.bat для frontend
✅ .env.example файлы с примерами конфигурации

## 🎯 Основные функции

### Для учеников:
- 📝 Прохождение тестов (20 вопросов, 20 минут)
- 🤖 AI-объяснения ошибок (через OpenAI GPT-4o-mini)
- 🌐 Выбор языка (Казахский/Русский)
- 📊 Просмотр результатов
- 🎯 Тесты на основе ошибок (adaptive learning)
- 📱 Мобильная версия

### Для админов:
- ➕ Добавление вопросов
- 📥 Импорт из CSV
- 📊 Статистика
- 🔧 Управление предметами

## 📂 Структура файлов

```
QazMind/
├── backend/           # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── api/      # Endpoints
│   │   ├── core/     # Config & Security
│   │   ├── db/       # Models
│   │   ├── schemas/  # Validation
│   │   └── services/ # AI Service
│   ├── main.py
│   └── init_db.py
│
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
│
└── docs/             # Документация
```

## 🚀 Как запустить

### Быстрый старт (5 минут)

**Backend:**
```powershell
cd backend
.\setup.bat           # Установка зависимостей
# Отредактируйте .env файл
.\start-backend.bat   # Запуск сервера
```

**Frontend:**
```powershell
cd frontend
.\setup.bat           # Установка зависимостей
.\start-frontend.bat  # Запуск dev сервера
```

Откройте браузер: http://localhost:5173

### Тестовый доступ
- Email: admin@qazmind.kz
- Password: admin123

## 💡 Технологии

**Backend:**
- Python 3.10+
- FastAPI
- PostgreSQL
- SQLAlchemy
- OpenAI API (GPT-4o-mini)
- JWT Authentication

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Zustand
- React Router
- Axios

## 🎨 Особенности архитектуры

### AI Integration
- ✅ Промпт разработан для минимизации галлюцинаций
- ✅ fact_snippet в каждом вопросе = "источник истины"
- ✅ Кэширование ответов AI
- ✅ Rate limiting (10 запросов/час)
- ✅ Защита от злоупотреблений

### Security
- ✅ JWT токены
- ✅ Bcrypt password hashing
- ✅ CORS настроен
- ✅ SQL injection защита (ORM)
- ✅ Rate limiting

### Performance
- ✅ Кэширование AI ответов
- ✅ Database indexes
- ✅ Vite для быстрой сборки
- ✅ Lazy loading компонентов

### UX/UI
- ✅ Адаптивный дизайн (мобилки + десктоп)
- ✅ Двуязычный интерфейс
- ✅ Интуитивная навигация
- ✅ Таймер теста
- ✅ Навигация по вопросам
- ✅ Прогресс бар

## 📊 База данных

7 основных таблиц:
1. **users** - Пользователи
2. **subjects** - Предметы
3. **questions** - Вопросы с fact_snippet
4. **test_attempts** - Попытки тестов
5. **wrong_answers** - Отслеживание ошибок
6. **ai_explanations** - Кэш AI ответов
7. **question_feedbacks** - Обратная связь

## 🔑 Ключевые файлы

### Backend
- `main.py` - FastAPI app
- `app/api/questions.py` - AI объяснения
- `app/services/ai_service.py` - OpenAI integration
- `init_db.py` - DB initialization

### Frontend
- `src/App.jsx` - Routing
- `src/pages/Test.jsx` - Прохождение теста
- `src/pages/Results.jsx` - Результаты с AI
- `src/components/ExplanationModal.jsx` - AI объяснение

## 🌐 Деплой

### Railway + Vercel (рекомендуется)
- Backend → Railway (PostgreSQL included)
- Frontend → Vercel
- Стоимость: ~$5-10/месяц

### VPS (для production)
- DigitalOcean, Linode
- Nginx + SSL
- Полный контроль

Подробнее: [DEPLOYMENT.md](DEPLOYMENT.md)

## 📝 Следующие шаги

### Для запуска:
1. ✅ Установить PostgreSQL
2. ✅ Получить OpenAI API ключ
3. ✅ Запустить setup.bat в backend
4. ✅ Отредактировать .env
5. ✅ Запустить init_db.py
6. ✅ Запустить backend
7. ✅ Запустить frontend
8. ✅ Открыть http://localhost:5173

### Для расширения:
1. Добавить больше вопросов (CSV импорт)
2. Добавить другие предметы
3. Настроить деплой
4. Добавить Google OAuth
5. Добавить статистику

## 📚 Документация

- 📖 [README.md](README.md) - Главная документация
- ⚡ [QUICKSTART.md](QUICKSTART.md) - Быстрый старт
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Деплой
- 🏗️ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Структура

## 💰 Стоимость эксплуатации

### MVP (для тестирования)
- Railway Free Tier: $5 кредит/месяц
- Vercel: Бесплатно
- OpenAI (GPT-4o-mini): ~$5-10/месяц (с кэшированием)

**Итого: ~$10-15/месяц**

### Production (1000 пользователей/месяц)
- Railway/VPS: ~$20/месяц
- OpenAI API: ~$50/месяц
- Домен: ~$10/год

**Итого: ~$70/месяц**

## 🎯 Целевая аудитория

- 🎓 Школьники 11 класса (Казахстан)
- 📚 Готовятся к ҰБТ
- 🌐 Говорят на казахском или русском
- 📱 Используют мобильные телефоны

## ✨ Killer Features

1. **AI-ментор** - персонализированные объяснения ошибок
2. **Двуязычность** - полная поддержка казахского и русского
3. **Адаптивное обучение** - тесты на основе ошибок
4. **Простота** - интуитивный интерфейс
5. **Быстрый старт** - регистрация за 30 секунд

## 🤝 Контрибьюция

Проект готов к расширению:
- Добавление новых предметов
- Улучшение AI промптов
- Новые фичи (статистика, рекомендации)
- Мобильное приложение

## 📄 Лицензия

MIT License - используйте как хотите!

---

## 🎉 Готово к использованию!

Проект полностью настроен и готов к запуску. Следуйте инструкциям в [QUICKSTART.md](QUICKSTART.md) для быстрого старта.

**Удачи с подготовкой к ҰБТ! 🚀📚**

---

*Создано с ❤️ для школьников Казахстана*

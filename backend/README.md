# QazMind Backend API

Backend для платформы подготовки к ҰБТ с AI-ментором.

## Стек технологий

- **FastAPI** - современный веб-фреймворк
- **PostgreSQL** - база данных
- **SQLAlchemy** - ORM
- **OpenAI API** - AI объяснения
- **JWT** - аутентификация

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Настройте `.env` файл:
```bash
cp .env.example .env
# Отредактируйте .env с вашими настройками
```

4. Создайте базу данных PostgreSQL:
```bash
createdb qazmind
```

5. Запустите сервер:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступно по адресу: http://localhost:8000

Документация Swagger: http://localhost:8000/docs

## Структура проекта

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Config, security, dependencies
│   ├── db/            # Database models
│   ├── schemas/       # Pydantic schemas
│   └── services/      # Business logic (AI service)
├── main.py            # FastAPI app
└── requirements.txt   # Dependencies
```

## Основные endpoints

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/tests/new` - Создать тест
- `POST /api/tests/{id}/submit` - Отправить ответы
- `POST /api/questions/{id}/explain` - AI объяснение
- `POST /api/feedback/question` - Обратная связь

## Импорт вопросов

CSV файл должен содержать колонки:
- subject_id
- text_kz
- text_ru
- options_kz (разделены |)
- options_ru (разделены |)
- correct_answer_index
- fact_snippet_kz
- fact_snippet_ru
- source

Пример:
```csv
subject_id,text_kz,text_ru,options_kz,options_ru,correct_answer_index,fact_snippet_kz,fact_snippet_ru,source
1,"Сұрақ қазақша","Вопрос на русском","А|Б|В|Г","A|Б|В|Г",0,"Факт қазақша","Факт на русском","Учебник 2023"
```

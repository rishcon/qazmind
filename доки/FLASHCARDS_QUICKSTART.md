# 🚀 Быстрый запуск QazMind с Flashcards

## Шаг 1: Backend

```bash
# Переходим в backend директорию
cd backend

# Запускаем сервер (БД и таблицы создаются автоматически)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Сервер будет доступен на: http://localhost:8000

**API Docs:** http://localhost:8000/docs

## Шаг 2: Frontend

```bash
# В новом терминале
cd frontend

# Запускаем dev сервер
npm run dev
```

Приложение будет доступно на: http://localhost:5173

## 🎴 Использование Flashcards

1. Авторизуйтесь в системе
2. Перейдите в раздел "Карточки" в навбаре
3. Выберите предмет для изучения
4. Используйте:
   - **Свайп вправо** или кнопка "Знаю" ✅
   - **Свайп влево** или кнопка "Учу" 📚
   - **Клик на карточку** для переворота

## 📊 Доступные карточки

После запуска в системе уже будет 58 карточек:
- 📚 История Казахстана: 15 карточек
- 🧮 Математика: 15 карточек
- ⚡ Физика: 10 карточек
- 🧪 Химия: 10 карточек
- 🧬 Биология: 8 карточек

## 🐛 Проблемы?

### Backend не запускается:
```bash
# Установите зависимости
pip install -r requirements.txt
```

### Frontend не запускается:
```bash
# Установите зависимости
npm install
npm install framer-motion
```

### Нет карточек:
```bash
cd backend
python scripts/add_flashcards.py
```

## 🔧 Дополнительные команды

### Очистить и пересоздать карточки:
```bash
# Удалить БД (если нужно начать с нуля)
rm backend/qazmind.db

# Запустить backend (создаст таблицы)
cd backend
uvicorn main:app --reload

# В другом терминале добавить карточки
python scripts/add_flashcards.py
```

### Добавить новые карточки (Admin):
```bash
curl -X POST http://localhost:8000/api/flashcards/admin/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "subject_id": 1,
    "front": "Новый вопрос",
    "back": "Новый ответ",
    "hint": "Подсказка"
  }'
```

## 📱 Навигация

- **Landing**: http://localhost:5173/
- **Dashboard**: http://localhost:5173/dashboard
- **Test**: http://localhost:5173/test
- **Flashcards**: http://localhost:5173/flashcards
- **Podcasts**: http://localhost:5173/podcasts

## 🎯 Следующие шаги

1. ✅ Система работает
2. ✅ Карточки добавлены
3. ✅ Алгоритм SuperMemo-2 активен
4. 🎓 Начинайте учиться!

---

**Создано с ❤️ для QazMind**

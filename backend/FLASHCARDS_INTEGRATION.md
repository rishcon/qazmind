# Добавить в backend/main.py после импортов
from routers import flashcards

# Добавить в список роутеров
app.include_router(flashcards.router)

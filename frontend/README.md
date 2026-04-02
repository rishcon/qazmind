# QazMind Frontend

React приложение для платформы подготовки к ҰБТ.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env` файл:
```bash
cp .env.example .env
```

3. Запустите dev сервер:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

## Сборка для продакшена

```bash
npm run build
```

## Структура проекта

```
frontend/
├── src/
│   ├── components/    # Переиспользуемые компоненты
│   ├── pages/         # Страницы приложения
│   ├── services/      # API сервисы
│   ├── store/         # Zustand stores (state management)
│   ├── utils/         # Утилиты
│   ├── App.jsx        # Главный компонент
│   └── main.jsx       # Точка входа
├── index.html
└── package.json
```

## Основные страницы

- `/` - Landing page
- `/login` - Вход
- `/register` - Регистрация
- `/test` - Прохождение теста
- `/results/:attemptId` - Результаты теста
- `/dashboard` - Личный кабинет

## Технологии

- React 18
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Axios

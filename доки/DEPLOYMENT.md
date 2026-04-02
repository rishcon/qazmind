# Деплой QazMind

Инструкция по развертыванию приложения в production.

## 📦 Варианты деплоя

### Вариант 1: Railway (Рекомендуется для начала)

**Преимущества:**
- Бесплатный tier ($5 кредит/месяц)
- Автоматический деплой из GitHub
- PostgreSQL включена
- Простая настройка

#### Backend на Railway

1. Зарегистрируйтесь на https://railway.app
2. Создайте новый проект
3. Добавьте PostgreSQL из Marketplace
4. Создайте новый сервис из GitHub репозитория
5. Установите environment variables:
   ```
   DATABASE_URL=(автоматически из PostgreSQL)
   SECRET_KEY=your-secret-key-min-32-chars
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_MODEL=gpt-4o-mini
   ```
6. Настройте Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Railway автоматически деплоит после каждого коммита

#### Frontend на Vercel

1. Зарегистрируйтесь на https://vercel.com
2. Импортируйте репозиторий
3. Настройте Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app/api
   ```
7. Deploy!

---

### Вариант 2: Render

**Преимущества:**
- Бесплатный tier
- PostgreSQL включена
- Европейские сервера

#### Backend на Render

1. Зарегистрируйтесь на https://render.com
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3.10+
5. Создайте PostgreSQL database
6. Установите Environment Variables (аналогично Railway)

---

### Вариант 3: VPS (DigitalOcean, Linode)

Для больше контроля и production-ready решения.

#### Шаг 1: Настройка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить зависимости
sudo apt install python3.10 python3-pip python3-venv nginx postgresql -y
sudo apt install nodejs npm -y

# Создать пользователя
sudo adduser qazmind
sudo usermod -aG sudo qazmind
```

#### Шаг 2: PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE qazmind;
CREATE USER qazminduser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE qazmind TO qazminduser;
\q
```

#### Шаг 3: Backend

```bash
# Клонировать репозиторий
cd /home/qazmind
git clone https://github.com/your-repo/qazmind.git
cd qazmind/backend

# Создать виртуальное окружение
python3 -m venv venv
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Настроить .env
nano .env
# Вставить настройки

# Инициализировать БД
python init_db.py

# Настроить systemd service
sudo nano /etc/systemd/system/qazmind.service
```

**qazmind.service:**
```ini
[Unit]
Description=QazMind FastAPI
After=network.target

[Service]
User=qazmind
WorkingDirectory=/home/qazmind/qazmind/backend
Environment="PATH=/home/qazmind/qazmind/backend/venv/bin"
ExecStart=/home/qazmind/qazmind/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable qazmind
sudo systemctl start qazmind
```

#### Шаг 4: Frontend

```bash
cd /home/qazmind/qazmind/frontend

# Установить зависимости
npm install

# Собрать для продакшена
npm run build
```

#### Шаг 5: Nginx

```bash
sudo nano /etc/nginx/sites-available/qazmind
```

**qazmind nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/qazmind/qazmind/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/qazmind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Шаг 6: SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🔒 Security Checklist

- [ ] Изменить SECRET_KEY на случайную строку (32+ символов)
- [ ] Изменить пароль админа admin@qazmind.kz
- [ ] Настроить CORS_ORIGINS только для вашего домена
- [ ] Использовать HTTPS (SSL сертификат)
- [ ] Настроить rate limiting на уровне сервера
- [ ] Бэкапы базы данных
- [ ] Мониторинг логов

---

## 📊 Мониторинг

### Railway
- Встроенный мониторинг в дашборде
- Логи в реальном времени

### VPS
Установить мониторинг:

```bash
# PM2 для Node.js процессов
npm install -g pm2

# Supervisor для Python
sudo apt install supervisor
```

---

## 💰 Стоимость

### Railway (Free Tier)
- $5 кредит/месяц
- Достаточно для 500+ пользователей/месяц

### Render (Free Tier)
- Бесплатно (с ограничениями)
- Web service засыпает после 15 мин неактивности

### VPS (DigitalOcean)
- $6/месяц (1GB RAM)
- $12/месяц (2GB RAM) - рекомендуется для production

### OpenAI API
- GPT-4o-mini: ~$0.15 / 1000 запросов
- Кэширование снижает стоимость на 80%

---

## 🚀 CI/CD

### GitHub Actions (автоматический деплой)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📝 Post-Deploy Checklist

После деплоя проверьте:

1. Backend API доступен: https://your-backend.com/health
2. API docs работают: https://your-backend.com/docs
3. Frontend загружается: https://your-domain.com
4. Регистрация работает
5. Тесты загружаются
6. AI-объяснения работают
7. Мобильная версия корректно отображается

---

## 🆘 Troubleshooting

### Backend не запускается
- Проверьте логи: `railway logs` или `sudo journalctl -u qazmind`
- Проверьте DATABASE_URL
- Убедитесь, что все environment variables установлены

### Frontend показывает ошибки API
- Проверьте VITE_API_URL в настройках Vercel
- Убедитесь, что CORS настроен правильно в backend

### AI не работает
- Проверьте OPENAI_API_KEY
- Проверьте баланс OpenAI аккаунта
- Проверьте логи на rate limiting

---

Удачи с деплоем! 🚀

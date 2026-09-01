# QazMind

## Local Docker launch

1. Create a local configuration file: `Copy-Item .env.example .env`.
2. Replace `SECRET_KEY` in `.env` with a long random value.
3. Start the app: `docker compose up --build -d`.
4. Open http://localhost:8081. API documentation is at http://localhost:8081/docs.

The initial SQLite database is copied into the `qazmind-data` Docker volume on first start. It remains persistent across container rebuilds and restarts.

Useful commands:

```powershell
docker compose ps
docker compose logs -f
docker compose down
```

To reset all local application data, stop the stack and remove the `qazmind-data` volume intentionally:

```powershell
docker compose down -v
```

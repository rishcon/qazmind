@echo off
echo ================================
echo QazMind Backend Setup
echo ================================
echo.

:: Create virtual environment
echo [1/5] Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)

:: Activate virtual environment
echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

:: Install dependencies
echo [3/5] Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

:: Create .env file
echo [4/5] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your settings.
) else (
    echo .env file already exists.
)

:: Initialize database
echo [5/5] Initializing database...
python init_db.py
if %errorlevel% neq 0 (
    echo Error: Failed to initialize database
    pause
    exit /b 1
)

echo.
echo ================================
echo Setup completed successfully!
echo ================================
echo.
echo Next steps:
echo 1. Edit .env file with your settings (DATABASE_URL, OPENAI_API_KEY, etc.)
echo 2. Run: start-backend.bat
echo.
pause

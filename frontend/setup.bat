@echo off
echo ================================
echo QazMind Frontend Setup
echo ================================
echo.

:: Check if node_modules exists
if exist node_modules (
    echo node_modules already exists, skipping installation...
) else (
    echo [1/2] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

:: Create .env file
echo [2/2] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file.
) else (
    echo .env file already exists.
)

echo.
echo ================================
echo Setup completed successfully!
echo ================================
echo.
echo Next steps:
echo 1. Make sure backend is running on http://localhost:8000
echo 2. Run: start-frontend.bat
echo.
pause

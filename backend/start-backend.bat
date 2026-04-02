@echo off
echo Starting QazMind Backend...
cd /d %~dp0
call venv\Scripts\activate.bat
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

@echo off
echo Starting DeepSeek Tokenizer Dashboard...

:: Start Backend
echo Starting Backend Server...
start "DeepSeek Backend" cmd /k "python -m uvicorn server.main:app --reload --port 8000"

:: Start Frontend
echo Starting Frontend...
cd web-ui
start "DeepSeek Frontend" cmd /k "npm run dev"

echo ========================================================
echo  Services started!
echo  Backend: http://localhost:8000
echo  Frontend: http://localhost:5173
echo ========================================================
pause

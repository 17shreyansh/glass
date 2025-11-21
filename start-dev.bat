@echo off
echo Starting Delicorn E-commerce Development Environment...

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd be && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
pause
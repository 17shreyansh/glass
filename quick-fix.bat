@echo off
echo Fixing Delicorn E-commerce Platform...

echo.
echo Stopping any running processes...
taskkill /f /im node.exe 2>nul

echo.
echo Cleaning frontend cache...
cd frontend
rmdir /s /q node_modules\.vite 2>nul
rmdir /s /q dist 2>nul

echo.
echo Starting Backend...
cd ..\be
start "Backend" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo Admin: http://localhost:5173/admin
echo.
echo If you see errors, wait a moment for servers to fully start.
pause
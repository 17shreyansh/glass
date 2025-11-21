@echo off
echo Verifying Delicorn E-commerce Setup...

echo.
echo Checking Backend Dependencies...
cd be
if not exist node_modules (
    echo ERROR: Backend dependencies not installed
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Checking Backend Environment...
if not exist .env (
    echo WARNING: Backend .env file not found
    echo Please copy .env.example to .env and configure
)

echo.
echo Checking Frontend Dependencies...
cd ..\frontend
if not exist node_modules (
    echo ERROR: Frontend dependencies not installed
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Checking Frontend Environment...
if not exist .env (
    echo WARNING: Frontend .env file not found
    echo Please copy .env.example to .env
)

cd ..

echo.
echo ✅ Setup Verification Complete!
echo.
echo Next Steps:
echo 1. Configure .env files if not done
echo 2. Start MongoDB service
echo 3. Run seed-data.bat to populate database
echo 4. Run start-dev.bat to start servers
echo.
echo URLs after starting:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001
echo - Admin Panel: http://localhost:5173/admin
echo.
pause
@echo off
echo Setting up Delicorn E-commerce Platform...

echo.
echo Installing Backend Dependencies...
cd be
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Copy be\.env.example to be\.env and configure your database
echo 2. Copy frontend\.env.example to frontend\.env
echo 3. Run start-dev.bat to start the development servers
echo 4. Run seed-data.bat to populate the database with sample data
echo.
pause
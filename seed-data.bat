@echo off
echo Seeding Delicorn Database...

cd be

echo.
echo Seeding Admin User...
call npm run seed:admin
if errorlevel 1 (
    echo Failed to seed admin user
    pause
    exit /b 1
)

echo.
echo Seeding Sample Products...
call npm run seed:products
if errorlevel 1 (
    echo Failed to seed products
    pause
    exit /b 1
)

cd ..

echo.
echo Database seeding completed successfully!
echo.
echo Default Admin Credentials:
echo Email: admin@delicorn.com
echo Password: admin123
echo.
echo You can now start the development servers with start-dev.bat
echo.
pause
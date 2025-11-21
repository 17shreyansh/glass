@echo off
echo Testing Delicorn E-commerce Connections...

echo.
echo Testing Backend API...
curl -s http://localhost:3001/api/health > nul
if %errorlevel% == 0 (
    echo ✅ Backend API is running
) else (
    echo ❌ Backend API is not responding
    echo Please start the backend server first
)

echo.
echo Testing Frontend...
curl -s http://localhost:5173 > nul
if %errorlevel% == 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend is not responding
    echo Please start the frontend server first
)

echo.
echo Testing API Endpoints...
curl -s http://localhost:3001/api/products > nul
if %errorlevel% == 0 (
    echo ✅ Products API is working
) else (
    echo ❌ Products API is not working
)

echo.
echo Connection Test Complete!
echo.
echo If all tests pass, your application is ready to use:
echo - Website: http://localhost:5173
echo - Admin Panel: http://localhost:5173/admin
echo - API: http://localhost:3001/api
echo.
pause
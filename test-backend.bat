@echo off
echo Testing backend connection...
curl -X GET http://localhost:3001/api/health
echo.
echo Testing login endpoint...
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@delicorn.com\",\"password\":\"admin123\"}"
echo.
pause
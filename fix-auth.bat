@echo off
echo Clearing invalid cookies...
curl -X POST http://localhost:3001/api/auth/clear-cookies
echo.
echo Cookies cleared. Please refresh your browser.
pause
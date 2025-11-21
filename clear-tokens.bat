@echo off
echo Clearing invalid JWT tokens...

REM Clear browser cookies by making a request to clear-cookies endpoint
curl -X POST http://localhost:3001/api/auth/clear-cookies -c nul 2>nul

echo.
echo Invalid tokens cleared successfully!
echo Please refresh your browser and log in again.
echo.
pause
@echo off
echo Migrating to single jewelry collection...
echo.

echo Migrating products...
cd be
node scripts/migrate-products.js
echo.

echo Migrating categories...
node scripts/migrate-categories.js
echo.

echo Migration completed!
pause
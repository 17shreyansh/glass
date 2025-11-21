@echo off
echo Seeding users...
cd be
npm run seed:users
cd ..
echo Users seeded successfully!
pause
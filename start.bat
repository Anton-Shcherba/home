@echo off
echo ========================================
echo 🐳 Запуск FullStack приложения в Docker
echo ========================================

echo 1. Собираем Docker образы...
docker-compose build

echo.
echo 2. Запускаем все сервисы...
docker-compose up

echo.
echo Приложение будет доступно по адресам:
echo 🌐 Frontend: http://localhost:5173
echo ⚡ Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 🗄️ Database: localhost:5432 (user: user, pass: password)

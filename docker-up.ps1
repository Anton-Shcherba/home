Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🐳 Запуск FullStack приложения в Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n1. Проверка Docker..." -ForegroundColor Yellow
docker --version
docker-compose --version

Write-Host "`n2. Собираем Docker образы..." -ForegroundColor Yellow
docker-compose build

Write-Host "`n3. Запускаем все сервисы..." -ForegroundColor Green
Write-Host "`nПриложение будет доступно по адресам:" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "⚡ Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🏥 Health check: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "🗄️ Database: localhost:5432 (user: user, pass: password)" -ForegroundColor Cyan
Write-Host "`nДля остановки нажмите Ctrl+C" -ForegroundColor Yellow

docker-compose up
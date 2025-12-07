#!/bin/bash

# Ожидаем готовности базы данных
echo "⌛ Waiting for database..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "✅ Database is ready!"

# Создаем таблицы в базе данных
echo "🔄 Creating database tables..."
python -c "
from app.database import engine, Base
from app.models import Item
Base.metadata.create_all(bind=engine)
print('✅ Tables created!')
"

# Запускаем приложение
echo "🚀 Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
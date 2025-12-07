import time
import os
import sys
import subprocess
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from app.database import engine, Base
from app.models import Item


def wait_for_db():
    """Wait for database to be ready"""
    max_retries = 30
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Database is ready!")
            return True
        except OperationalError as e:
            print(f"⚠️  Database not ready, retrying... ({attempt + 1}/{max_retries})")
            time.sleep(retry_delay)

    print("❌ Could not connect to database after multiple attempts")
    return False


def create_tables():
    """Create database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Starting FullStack Backend...")

    # Ждем базу данных
    if not wait_for_db():
        sys.exit(1)

    # Создаем таблицы
    if not create_tables():
        sys.exit(1)

    # Запускаем FastAPI
    print("🔥 Starting FastAPI server...")
    print("📡 API: http://0.0.0.0:8000")
    print("📚 Docs: http://0.0.0.0:8000/docs")
    print("🏥 Health: http://0.0.0.0:8000/health")

    # Запускаем uvicorn
    os.execlp(
        "uvicorn",
        "uvicorn",
        "app.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload",
    )

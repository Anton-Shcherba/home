from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import items

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FullStack Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роуты
app.include_router(items.router, prefix="/api/items", tags=["items"])


@app.get("/")
async def root():
    return {"message": "FullStack Backend API"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}

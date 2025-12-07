from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items


@router.post("/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/{item_id}", response_model=schemas.Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, item_update: schemas.ItemUpdate, db: Session = Depends(get_db)):
    # Ищем элемент в базе данных
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    # Обновляем поля
    for field, value in item_update.dict(exclude_unset=True).items():
        setattr(db_item, field, value)

    db.commit()
    db.refresh(db_item)
    return db_item


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    # Ищем элемент в базе данных
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()

    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    # Удаляем элемент
    db.delete(db_item)
    db.commit()

    return {"message": f"Item {item_id} deleted successfully"}

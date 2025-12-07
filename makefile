.PHONY: help up down build logs clean restart

help:
	@echo "Доступные команды:"
	@echo "  make up      - Запустить все сервисы"
	@echo "  make down    - Остановить все сервисы"
	@echo "  make build   - Пересобрать контейнеры"
	@echo "  make logs    - Показать логи"
	@echo "  make clean   - Остановить и удалить всё"
	@echo "  make restart - Перезапустить сервисы"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

clean:
	docker-compose down -v --remove-orphans

restart:
	docker-compose restart
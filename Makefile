up:
	docker-compose up -d

stop:
	docker-compose stop

exec-master:
	docker-compose exec master bash

build:
	docker-compose build --no-cache

up-build:
	docker-compose up --build -d

start:
	docker-compose start

restart:
	docker-compose restart

rm:
	docker-compose stop && docker-compose rm

ps:
	docker-compose ps

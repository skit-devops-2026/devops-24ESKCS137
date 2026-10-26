
.PHONY: install test build run docker-build docker-up seed

install:
	npm --prefix backend ci
	npm --prefix frontend ci

test:
	npm --prefix backend test
	node test/test.js

build:
	npm --prefix frontend run build

run:
	npm --prefix backend run dev

seed:
	npm --prefix backend run seed

docker-build:
	docker compose build

docker-up:
	docker compose up --build -d


.PHONY: install test build run docker-build docker-up

install:
	@echo "No dependencies required"

test:
	bash test/test.sh

build:
	@echo "Build successful"

run:
	@echo "Open http://localhost:8081 in your browser"

docker-build:
	docker compose build

docker-up:
	docker compose up --build -d

.PHONY: install test build run docker-build docker-up

install:
	@echo "No dependencies required"

test:
	bash test/test.sh

build:
	@echo "Build successful"

run:
	@echo "Open index.html in browser"

docker-build:
	@echo "Docker build placeholder"

docker-up:
	docker compose up --build
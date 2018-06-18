SHELL := /bin/bash

all: build run

run: build
	docker-compose run --service-ports web

build: .built .noded

.built: Dockerfile
	docker-compose build
	touch .built

.noded: package.json package-lock.json
	docker-compose run web npm install
	touch .noded

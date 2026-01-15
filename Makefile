IMAGE_NAME := bun-test
CONTAINER_NAME := bun-server

.PHONY: init start build run stop clean prune

init:
	bun install
	cd client && bun install && bun run build && cd ..
	rm -f dist && ln -s client/dist dist

start: init
	bun run index.ts

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run --rm --name $(CONTAINER_NAME) -p 8080:8080 $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) || true

clean:
	docker rmi $(IMAGE_NAME) || true

prune: stop clean
	rm -rf node_modules client/node_modules


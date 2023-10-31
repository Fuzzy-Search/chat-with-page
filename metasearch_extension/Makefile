V ?= 0.0.1

all: build zip

build: pnpm build; pnpm package

zip: build
	@echo "Zipping..."
	zip -r ../dists/dist$(V).zip dist/
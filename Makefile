.PHONY: all arm_architecture server

all: dependency_install chrome_extension_build server arm_architecture

dependency_install:
	@echo "Installing dependencies"
	@bash dependency_install.sh


arm_architecture:
	@echo "Starting arm_architecture.sh"
	@local-deployment/arm_architecture.sh

server:
	@echo "Starting Node.js server"
	@node api-endpoint/server.js &

chrome_extension_build:
	@echo "Starting Chrome extension build"
	@cd chatwithpage-extension && pnpm install; pnpm run build
	@cd ..

# delete all services
# kill $(lsof -t -i:3000)
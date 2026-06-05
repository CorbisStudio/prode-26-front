# =============================================================================
# World Cup Prode - DevOps Makefile
# =============================================================================
# Usage:
#   make setup     → Prepare environment and install dependencies
#   make start     → Start production containers
#   make dev       → Start development environment with hot reload
#   make stop      → Stop all containers
#   make restart   → Restart containers
#   make logs      → View container logs
#   make build     → Build Docker image
#   make test      → Run tests
#   make lint      → Run linter
#   make clean     → Remove containers, images and volumes
#   make deploy    → Full deployment workflow
# =============================================================================

# ─── Configuration ───────────────────────────────────────────────────────────
PROJECT_NAME    := world-cup-prode
IMAGE_NAME      := world-cup-prode-frontend
CONTAINER_NAME  := prode-frontend
DEV_CONTAINER   := prode-frontend-dev
FRONTEND_PORT   ?= 4200
DEV_PORT        ?= 4200
IMAGE_TAG       ?= latest
DOCKERFILE      := Dockerfile
COMPOSE_FILE    := docker-compose.yml
COMPOSE_DEV     := docker-compose.dev.yml

# ─── Colors for output ───────────────────────────────────────────────────────
BLUE   := \033[34m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m
RESET  := \033[0m

# ─── Helper Functions ────────────────────────────────────────────────────────
define print_step
	@echo "$(BLUE)▶ $(1)$(RESET)"
endef

define print_success
	@echo "$(GREEN)✓ $(1)$(RESET)"
endef

define print_warning
	@echo "$(YELLOW)⚠ $(1)$(RESET)"
endef

# ─── Default Target ──────────────────────────────────────────────────────────
.DEFAULT_GOAL := help

# ─── Help ────────────────────────────────────────────────────────────────────
.PHONY: help
help: ## Show this help message
	@echo ""
	@echo "$(GREEN)╔══════════════════════════════════════════════════════════════╗$(RESET)"
	@echo "$(GREEN)║        World Cup Prode - DevOps Command Center               ║$(RESET)"
	@echo "$(GREEN)╚══════════════════════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo "$(YELLOW)Setup & Development:$(RESET)"
	@echo "  $(GREEN)make setup$(RESET)        Install dependencies and prepare environment"
	@echo "  $(GREEN)make dev$(RESET)          Start development server with hot reload (port $(DEV_PORT))"
	@echo "  $(GREEN)make start$(RESET)        Start production containers (port $(FRONTEND_PORT))"
	@echo ""
	@echo "$(YELLOW)Lifecycle:$(RESET)"
	@echo "  $(GREEN)make stop$(RESET)         Stop all running containers"
	@echo "  $(GREEN)make restart$(RESET)      Restart containers"
	@echo "  $(GREEN)make logs$(RESET)         Show container logs (follow mode)"
	@echo "  $(GREEN)make status$(RESET)       Show container status"
	@echo ""
	@echo "$(YELLOW)Build & Quality:$(RESET)"
	@echo "  $(GREEN)make build$(RESET)        Build production Docker image"
	@echo "  $(GREEN)make build-dev$(RESET)    Build development Docker image"
	@echo "  $(GREEN)make rebuild$(RESET)      Force rebuild without cache"
	@echo "  $(GREEN)make test$(RESET)         Run unit tests"
	@echo "  $(GREEN)make lint$(RESET)         Run ESLint"
	@echo "  $(GREEN)make format$(RESET)       Format code with Prettier"
	@echo ""
	@echo "$(YELLOW)Docker Utilities:$(RESET)"
	@echo "  $(GREEN)make shell$(RESET)        Open a shell inside the container"
	@echo "  $(GREEN)make exec$(RESET)         Execute a command inside the container"
	@echo "  $(GREEN)make clean$(RESET)        Remove containers, images, volumes and caches"
	@echo "  $(GREEN)make prune$(RESET)        Deep clean: remove ALL unused Docker resources"
	@echo ""
	@echo "$(YELLOW)Deployment:$(RESET)"
	@echo "  $(GREEN)make deploy$(RESET)       Full CI/CD build → test → deploy workflow"
	@echo "  $(GREEN)make push$(RESET)         Push image to registry"
	@echo ""

# ─── Setup ───────────────────────────────────────────────────────────────────
.PHONY: setup
setup: ## Install dependencies and prepare environment
	$(call print_step,"Setting up project environment...")
	@if ! command -v pnpm >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing pnpm...$(RESET)"; \
		npm install -g pnpm@latest; \
	fi
	$(call print_step,"Installing dependencies with pnpm...")
	pnpm install
	$(call print_step,"Creating environment file...")
	@if [ ! -f .env ]; then \
		echo "FRONTEND_PORT=$(FRONTEND_PORT)" > .env; \
		echo "IMAGE_TAG=$(IMAGE_TAG)" >> .env; \
		$(call print_success,".env created with defaults"); \
	else \
		$(call print_warning,".env already exists, skipping"); \
	fi
	$(call print_success,"Setup complete! Run 'make dev' or 'make start' to begin.")

# ─── Development ─────────────────────────────────────────────────────────────
.PHONY: dev
dev: ## Start development environment with hot reload
	$(call print_step,"Starting development server on port $(DEV_PORT)...")
	FRONTEND_PORT=$(DEV_PORT) docker compose -f $(COMPOSE_DEV) up --build -d
	$(call print_success,"Development server running at http://localhost:$(DEV_PORT)")
	@echo "$(YELLOW)Hot reload enabled. Edit files and changes will reflect instantly.$(RESET)"

.PHONY: dev-logs
dev-logs: ## View development container logs
	docker compose -f $(COMPOSE_DEV) logs -f

# ─── Production ──────────────────────────────────────────────────────────────
.PHONY: start
start: ## Start production containers
	$(call print_step,"Starting production containers on port $(FRONTEND_PORT)...")
	docker compose -f $(COMPOSE_FILE) up -d
	$(call print_success,"Production app running at http://localhost:$(FRONTEND_PORT)")

.PHONY: stop
stop: ## Stop all running containers
	$(call print_step,"Stopping all containers...")
	@docker compose -f $(COMPOSE_FILE) down --remove-orphans 2>/dev/null || true
	@docker compose -f $(COMPOSE_DEV) down --remove-orphans 2>/dev/null || true
	$(call print_success,"All containers stopped.")

.PHONY: restart
restart: stop start ## Restart production containers

.PHONY: logs
logs: ## Show production container logs (follow mode)
	@docker compose -f $(COMPOSE_FILE) logs -f

.PHONY: status
status: ## Show container status
	@echo "$(BLUE)════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Running Containers$(RESET)"
	@echo "$(BLUE)════════════════════════════════════════════════════$(RESET)"
	@docker ps --filter "name=prode" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No containers running"
	@echo ""
	@echo "$(BLUE)════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Docker Images$(RESET)"
	@echo "$(BLUE)════════════════════════════════════════════════════$(RESET)"
	@docker images $(IMAGE_NAME) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" 2>/dev/null || true

# ─── Build ───────────────────────────────────────────────────────────────────
.PHONY: build
build: ## Build production Docker image
	$(call print_step,"Building production image $(IMAGE_NAME):$(IMAGE_TAG)...")
	docker build --target production -t $(IMAGE_NAME):$(IMAGE_TAG) .
	$(call print_success,"Image built: $(IMAGE_NAME):$(IMAGE_TAG)")

.PHONY: build-dev
build-dev: ## Build development Docker image
	$(call print_step,"Building development image $(IMAGE_NAME):dev...")
	docker build --target development -t $(IMAGE_NAME):dev .
	$(call print_success,"Development image built: $(IMAGE_NAME):dev")

.PHONY: rebuild
rebuild: ## Force rebuild without cache
	$(call print_step,"Force rebuilding production image (no cache)...")
	docker build --no-cache --target production -t $(IMAGE_NAME):$(IMAGE_TAG) .
	$(call print_success,"Image rebuilt successfully.")

# ─── Quality Assurance ───────────────────────────────────────────────────────
.PHONY: test
test: ## Run unit tests
	$(call print_step,"Running unit tests...")
	@docker run --rm -v "$(PWD):/app" -w /app node:22-slim \
		sh -c "npm install -g pnpm && pnpm install && pnpm run test"
	$(call print_success,"Tests completed.")

.PHONY: lint
lint: ## Run ESLint
	$(call print_step,"Running linter...")
	pnpm run lint
	$(call print_success,"Linting completed.")

.PHONY: format
format: ## Format code with Prettier
	$(call print_step,"Formatting code...")
	pnpm run format
	$(call print_success,"Formatting completed.")

# ─── Docker Utilities ────────────────────────────────────────────────────────
.PHONY: shell
shell: ## Open a shell inside the production container
	$(call print_step,"Opening shell in $(CONTAINER_NAME)...")
	@docker exec -it $(CONTAINER_NAME) /bin/sh || \
		(echo "$(RED)Container not running. Start it first with 'make start'$(RESET)" && exit 1)

.PHONY: exec
exec: ## Execute a command inside the container (usage: make exec CMD="ls -la")
	@docker exec -it $(CONTAINER_NAME) $(CMD)

.PHONY: clean
clean: ## Remove containers, images, volumes and caches for this project
	$(call print_step,"Cleaning up project resources...")
	@docker compose -f $(COMPOSE_FILE) down -v --remove-orphans 2>/dev/null || true
	@docker compose -f $(COMPOSE_DEV) down -v --remove-orphans 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):dev 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	$(call print_success,"Cleanup complete.")

.PHONY: prune
prune: ## Deep clean: remove ALL unused Docker resources (⚠️ DANGER)
	$(call print_warning,"This will remove ALL unused Docker resources system-wide!")
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 0
	docker system prune -a --volumes -f
	$(call print_success,"Deep clean completed.")

# ─── Deployment ──────────────────────────────────────────────────────────────
.PHONY: deploy
deploy: lint test build start ## Full CI/CD workflow: lint → test → build → deploy
	$(call print_success,"Deployment pipeline completed successfully!")
	@echo "$(GREEN)Application is live at http://localhost:$(FRONTEND_PORT)$(RESET)"

.PHONY: push
push: build ## Push image to Docker Hub (set DOCKER_USER env var)
	$(call print_step,"Pushing image to registry...")
	@if [ -z "$(DOCKER_USER)" ]; then \
		echo "$(RED)Error: DOCKER_USER is not set$(RESET)"; \
		echo "$(YELLOW)Usage: make push DOCKER_USER=yourusername$(RESET)"; \
		exit 1; \
	fi
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(DOCKER_USER)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(DOCKER_USER)/$(IMAGE_NAME):$(IMAGE_TAG)
	$(call print_success,"Image pushed to $(DOCKER_USER)/$(IMAGE_NAME):$(IMAGE_TAG)")

# ─── AWS Utilities (Optional) ────────────────────────────────────────────────
.PHONY: aws-login
aws-login: ## Login to AWS ECR (set AWS_REGION and AWS_ACCOUNT_ID)
	$(call print_step,"Logging into AWS ECR...")
	@if [ -z "$(AWS_ACCOUNT_ID)" ] || [ -z "$(AWS_REGION)" ]; then \
		echo "$(RED)Error: AWS_ACCOUNT_ID and AWS_REGION are required$(RESET)"; \
		echo "$(YELLOW)Usage: make aws-login AWS_ACCOUNT_ID=xxx AWS_REGION=us-east-1$(RESET)"; \
		exit 1; \
	fi
	aws ecr get-login-password --region $(AWS_REGION) | \
		docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
	$(call print_success,"Logged into AWS ECR.")

.PHONY: aws-push
aws-push: build aws-login ## Build and push to AWS ECR
	$(call print_step,"Tagging and pushing to AWS ECR...")
	@docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(IMAGE_NAME):$(IMAGE_TAG)
	@docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(IMAGE_NAME):$(IMAGE_TAG)
	$(call print_success,"Image pushed to AWS ECR.")

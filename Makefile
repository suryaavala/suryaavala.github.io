# suryaavala.com — development Makefile
#
# Single source of truth for every developer-facing action. CI and pre-commit
# hooks shell out to the same npm scripts these targets invoke, so `make
# verify` locally runs the exact gate set GitHub Actions enforces.
#
# Naming convention: kebab-case, verbs only, `##` comment becomes help text.

.DEFAULT_GOAL := help
SHELL := /bin/bash

.PHONY: help install dev build preview test test-unit test-unit-watch test-e2e \
        test-e2e-install lint format check lighthouse size verify evidence \
        clean check-deps check-staleness validate-data generate-og

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "; printf "Targets:\n"} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install pinned dependencies (npm ci)
	npm ci

dev: ## Run the Astro dev server on :4321
	npm run dev

build: ## Build the production site into dist/
	npm run build

preview: ## Preview the production build on :4321
	npm run preview

test: test-unit test-e2e ## Run all tests (unit + e2e)

test-unit: ## Run Vitest once
	npm run test:unit:run

test-unit-watch: ## Run Vitest in watch mode
	npm run test:unit

test-e2e-install: ## Install Playwright browsers + OS deps
	npm run test:e2e:install

test-e2e: ## Run Playwright e2e + a11y + visual suites
	npm run test:e2e

lint: ## Prettier + ESLint + astro check
	npm run lint
	npm run check

format: ## Prettier write
	npm run format

check: validate-data check-staleness ## Zod data validation + lastVerified staleness audit
	npm run check

validate-data: ## Zod-gate all /src/data/*.ts
	npm run validate-data

check-staleness: ## Warn on lastVerified dates older than 90 days
	npm run check-staleness

check-deps: ## Reject any unpinned dep (^ / ~ / ranges) in package.json
	npm run check-dep-pinning

lighthouse: ## Run Lighthouse CI with budget assertions
	npm run lhci

size: ## Enforce size-limit budget on dist/_astro/*.js
	npm run size

verify: lint check test-unit build ## Full local mirror of CI gate set
	@echo "✅ verify complete"

generate-og: ## Rebuild the default OG image (satori + resvg)
	npm run generate-og

evidence: build ## Rebuild evidence.html after a fresh build
	@echo "Regenerate screenshots and Lighthouse reports manually; evidence.html is static."
	@open evidence.html 2>/dev/null || xdg-open evidence.html 2>/dev/null || true

clean: ## Remove build artefacts and node_modules
	rm -rf dist .astro playwright-report test-results node_modules/.cache

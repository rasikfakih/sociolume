.PHONY: help install dev build test test:e2e lint typecheck clean check

help:
	@echo "Sociolume Makefile Commands"
	@echo "==========================="
	@echo "install    - Install dependencies"
	@echo "dev       - Run all apps in dev mode"
	@echo "build     - Build all apps"
	@echo "test      - Run unit tests"
	@echo "test:e2e  - Run E2E tests"
	@echo "lint      - Lint all packages"
	@echo "typecheck - Typecheck all packages"
	@echo "clean     - Clean build artifacts"
	@echo "check     - Run lint, typecheck, and tests"

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

test:e2e:
	pnpm test:e2e

lint:
	ppm lint

typecheck:
	pnpm typecheck

clean:
	pnpm clean

format:
	pnpm format

check:
	pnpm check

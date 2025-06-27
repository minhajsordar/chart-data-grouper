build:
	npm run build

watch:
	npm run watch

.PHONY: build watch

# Add a rebuild target for testing
rebuild:
	npm run clean
	npm run build

.PHONY: rebuild
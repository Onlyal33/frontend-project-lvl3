install: install-deps

develop:
	npx webpack-dev-server

install-deps:
	npm install

deploy: build
	npm run surge

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test

lint:
	npx eslint .

publish:
	npm publish --dry-run

test-coverage:
	npm test -- --coverage

.PHONY: test

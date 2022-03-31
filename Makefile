install: install-deps

develop:
	npm run start

install-deps:
	npm install

build:
	npm run prebuild
	npm run build

lint:
	npx eslint .

publish:
	npm publish --dry-run

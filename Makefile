dev:
	node ./gen-manifest.mjs
	pnpm run serve
build:
	node ./gen-manifest.mjs
	pnpm run build
test:
	pnpm test
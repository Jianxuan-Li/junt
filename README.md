# 🚀 Junt

![release](https://github.com/jianxuan-li/junt/actions/workflows/release.yml/badge.svg)
[![test](https://github.com/Jianxuan-Li/junt/actions/workflows/playwright.yml/badge.svg)](https://github.com/Jianxuan-Li/junt/actions)

Junt (Job-hUNing-Tracker) is a Chrome extension that helps you to track your job applications. It's totally free and open source.

[Features](docs/features.md) | [Privacy](docs/privacy.md) | [Terms of Use](docs/terms.md)

## Demo video

[!<img src="https://img.youtube.com/vi/HG1Om96V4xc/hqdefault.jpg" width="300" />](https://youtu.be/HG1Om96V4xc)

## Installtion

### Install from Chrome Web Store (Recommended)

[go to Chrome Store](https://chrome.google.com/webstore/detail/junt/ofgimnfoihdgacaommcakoeldinmjdma) (Maybe not the latest version)

- Click `Add to Chrome`
- Pin `Junt`

### Download from Github

[Download latest release](https://github.com/Jianxuan-Li/junt/releases)

Then load the extension in Chrome:

- Open `chrome://extensions/`
- Turn `Developer mode` on
- `Load unpacked`
- Select `dist` dir
- Pin `Junt`

## Development

Step 1: create a new `.env` file

create your own `.env` file in the project root. You can use `.env.example` as a template.

Replace `GAPI_CLIENT_ID` by your client id: [https://developer.chrome.com/docs/extensions/mv3/tut_oauth/#oauth_client](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/#oauth_client)

Or if you want to use the default client id, you can skip this step. _But_ you may be want to contact me to add your email to test users. (email me: `liujin834@gmail.com`)

Step 2: install dependencies

```bash
pnpm i
```

Step 3: Start development server

```bash
make dev
```

Step 4: Load extension

- Open `chrome://extensions/`
- Turn `Developer mode` on
- `Load unpacked`
- Select `dist` dir in the project root
- Pin `Junt`

## Test

Caveat: before running tests, you need to install dependencies first. and run `make build` to build the project.

```bash
pnpm exec playwright test
  Runs the end-to-end tests.

pnpm exec playwright test --ui
  Starts the interactive UI mode.

pnpm exec playwright test --project=chromium
  Runs the tests only on Desktop Chrome.

pnpm exec playwright test example
  Runs the tests in a specific file.

pnpm exec playwright test --debug
  Runs the tests in debug mode.

pnpm exec playwright codegen
  Auto generate tests with Codegen.
```

## Publish

Version number is managed by `package.json`. You can use `npm version` to bump version.

```bash
make build
```

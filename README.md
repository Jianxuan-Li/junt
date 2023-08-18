# 🚀 Junt

## Description

Junt (Javascript-job-hUNTer) is a Chrome extension that helps you to track your job applications. It's totally free and open source.

## Development

Step 1: create a new `.env` file

create your own `.env` file in the project root. You can use `.env.example` as a template. 

Replace `GAPI_CLIENT_ID` by your client id: [https://developer.chrome.com/docs/extensions/mv3/tut_oauth/#oauth_client](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/#oauth_client)

Or if you want to use the default client id, you can skip this step. *But* you may be want to contact me to add your email to test users. (email me: `liujin834@gmail.com`)

Step 2: install dependencies

```bash
pnpm i
```

Step 3: Start development server

```bash
make dev
```

Step 4: Load extension

* Open `chrome://extensions/`
* Turn `Developer mode` on
* `Load unpacked`
* Select `dist` dir in the project root
* Pin `Junt`

## Publish

Version number is managed by `package.json`. You can use `npm version` to bump version.

```bash
make build
```
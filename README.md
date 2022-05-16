# A very minimal addon to track GitHub usage with wakatime

This addon will only track time used on GitHub. It can use any wakatime compatible server.

Activity is added as one project called `github.com` and each repository as a branch to this project. As an example `brorbw/wakatime-firefox-addon` would be a branch under `github.com` in your dashboard. This is a little bit hacky but adding each repository as it's own project cluttered the interface IMO.

## How to build it

### Prerequisites

- `node`
- `npm`
- `web-ext`

```sh
# install dependencies
npm install
# build addon
npm run build
# this will create a extension in ./addon
cd addon
# package as an addon
web-ext build
# sing
web-ext sign --api-key=$API_KEY --api-secret=$API_SECRET
```

## For development and temporary addons

```sh
npm run watch
# or
npm run build
```

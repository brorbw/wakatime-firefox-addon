# A very minimal addon to track GitHub usage with wakatime

This addon will only track time used on GitHub. It can use any wakatime compatible server.

Activity is added to projects based on the repository name. The language will be `github`.

Firefox addon store link https://addons.mozilla.org/en-US/firefox/addon/wakatime-client

## How to build it

### Prerequisites

- `node`
- `npm`
- `web-ext`

### Build

```sh
# install dependencies
npm install
# build addon
npm run build
# this will create a extension in ./addon
cd addon
# package as an addon
npm run package
# sign
export API_KEY=yourapikey
export API_SECRET=yourapisecret
npm run sign
```

## For development and temporary addons

```sh
npm run watch
# or
npm run build
```

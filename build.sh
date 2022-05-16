#! /bin/bash

npm install
npm run build
web-ext build --source-dir=./addon

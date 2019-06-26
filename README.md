# Helmet UI

[![Build Status](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master)](https://travis-ci.org/HSLdevcom/helmet-ui)

This is the UI for [Helmet 4.0 Model System](https://github.com/HSLdevcom/helmet-model-system).
It is an [Electron.js](https://electrojs.org) app written in JavaScript, HTML and CSS.

## Requirements

- Node.js + NPM
- On Linux & Mac
    - Wine
    - Mono

## Development env

### Setup

```
$ git clone <this repository>`
$ npm install
```

On Linux and Mac, Wine and Mono are required to make the Windows build of the app.

### Running and Making the App

- run: `$ npm start`
- make: `$ npm run make` (builds the app for current platform)

## CI & Deployment

The application is built automatically by [Travis CI](https://travis-ci.org/HSLdevcom/helmet-ui.svg?branch=master) when changes are pushed in master branch or pull requests are opened.

Releases are deployed to Github when changes are pushed in the `release` branch. The Electron Forge's Github publisher is used to upload files and draft releases automatically, thus avoiding the need to tag releases manually. However, bear in mind that every commit in the `release` branch will result in new release draft with current version number defined in package.json.

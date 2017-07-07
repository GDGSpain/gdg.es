# [gdg.es](https://gdg.es) [![Build Status](https://travis-ci.org/GDGSpain/gdg.es.svg?branch=master)](https://travis-ci.org/GDGSpain/gdg.es)

> The GDG Spain official website.
>
> Deployed in Firebase with Travis CI.

## Prerequisites

First, install [Polymer CLI](https://github.com/Polymer/polymer-cli) using
[npm](https://www.npmjs.com) (we assume you have pre-installed [node.js](https://nodejs.org)).

    npm install -g polymer-cli

And install the dependencies:

    npm install && bower install

## Start the development server

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    polymer serve --open

## Build

The included `gulpfile.js` relies on [the `polymer-build` library](https://github.com/Polymer/polymer-build),
the same library that powers Polymer CLI. Out of the box it will clean the
`build` directory, and provide image minification. Follow the comments in the
`gulpfile.js` to add additional steps like JS transpilers or CSS preprocessors.

Also, generates a service-worker.js file with code to pre-cache the dependencies
based on the entrypoint and fragments specified in `polymer.json`.

    npm run build

## Preview the build

This command serves the minified version of the app at `http://localhost:8080`:

    polymer serve build/


## Run lint

This command will run [ESLint](https://github.com/eslint/eslint) with the
[IBM Research ESLint shareable config](https://github.com/IBMResearch/eslint-config-ibmresearch):

```
npm run lint
```

## Run tests

This command will run [Web Component Tester](https://github.com/Polymer/web-component-tester)
against the browsers currently installed on your machine:

    polymer test

### Adding a new view

You can extend the app by adding more views that will be demand-loaded
e.g. based on the route, or to progressively render non-critical sections of the
application. Each new demand-loaded fragment should be added to the list of
`fragments` in the included `polymer.json` file. This will ensure those
components and their dependencies are added to the list of pre-cached components
and will be included in the `bundled` build.


### How to contribute

Here are the steps to contribute to the project:

1. Choose an unassigned issue or create new one.
2. Fork the repo
3. Create a branch in your repo with the id of the issue (we recomend call the brach like fix/123-issue-name)
4. Make a pull request to branch master

**And Remember** Make sure your fork is up to date [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)
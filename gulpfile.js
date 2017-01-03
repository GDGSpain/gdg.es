/**
 * @license
 * Copyright (c) 2016 The GDG Spain Authors. All rights reserved.
 * This code may only be used under the MIT style license found at http://gdg.es/LICENSE.txt
 */

'use strict';

const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');

// Keep the global.config above any of the gulp-tasks that depend on it
global.config = {
  polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
  build: {
    rootDirectory: 'build',
    bundledDirectory: 'bundled',
    unbundledDirectory: 'unbundled',
    // Accepts either 'bundled', 'unbundled', or 'both'
    bundleType: 'bundled'
  },
  serviceWorkerPath: 'service-worker.js',
  swPrecacheConfig: {
    staticFileGlobs: [
      '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
      '/images/**/*',
      '/index.html',
      '/manifest.json'
    ],
    navigateFallback: '/index.html',
    navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
    runtimeCaching: [
      {
        urlPattern: /\/data\/images\/.*/,
        handler: 'cacheFirst',
        options: {
          cache: {
            maxEntries: 50,
            name: 'items-cache'
          }
        }
      }
    ]
  }
};

const clean = require('./gulp-tasks/clean.js');
// const html = require('./gulp-tasks/html.js');
const images = require('./gulp-tasks/images.js');
// const javascript = require('./gulp-tasks/javascript.js');
const lint = require('./gulp-tasks/lint.js');
const project = require('./gulp-tasks/project.js');

function source() {
  return project.splitSource()
    .pipe(gulpif('**/*.{png,gif,jpg,svg}', images.minify()))
    // Temporarily disabled: https://github.com/Polymer/polymer-build/issues/22
    // .pipe(gulpif('**/*.js', javascript.minify()))
    // .pipe(gulpif('**/*.html', html.minify()))
    .pipe(project.rejoin());
}

function dependencies() {
  return project.splitDependencies()
    .pipe(project.rejoin());
}

// Clean the build directory, split all source and dependency files into streams
// and process them, and output bundled and/or unbundled versions of the project
// with their own service workers
gulp.task('build', gulp.series([
  clean([global.config.build.rootDirectory]),
  project.merge(source, dependencies),
  project.serviceWorker
]));

// Lint JavaScript code
gulp.task('lint', lint([
  'gulp-tasks/**/*.js',
  'src/**/*.{js,html}',
  'test/**/*.{js,html}',
  'gulpfile.js',
  'index.html',
  'service-worker.js'
]));

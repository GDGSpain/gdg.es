/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var gulp = require('gulp-task-doc');
var size = require('gulp-size');
var vulcanize = require('gulp-vulcanize');

var dist = require('./dist');

// Vulcanize granular configuration
gulp.task('vulcanize', function() {
  return gulp.src('app/elements/gdgspain-app/gdgspain-app.html')
    .pipe(vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(dist('elements/gdgspain-app')))
    .pipe(size({title: 'vulcanize'}));
});

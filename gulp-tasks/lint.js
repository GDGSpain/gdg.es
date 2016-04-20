/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var eslint = require('gulp-eslint');
var gulp = require('gulp-task-doc');

// Lint JavaScript
gulp.task('lint', function() {
  var filesToLint = [
    'gulpfile.js',
    'gulp-tasks/**/*.js',
    'app/index.html',
    'app/elements/**/*.html'
  ];

  return gulp.src(filesToLint)
             .pipe(eslint())
             .pipe(eslint.format())
             .pipe(eslint.failAfterError());
});

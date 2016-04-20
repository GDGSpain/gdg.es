/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var gulp = require('gulp-task-doc');
var size = require('gulp-size');
var useref = require('gulp-useref');

var dist = require('./dist');

// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  return gulp.src(['app/index.html'])
    .pipe(useref())
    // Output files
    .pipe(gulp.dest(dist()))
    .pipe(size({
      title: 'html'
    }));
});

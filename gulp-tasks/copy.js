/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var gulp = require('gulp-task-doc');
var merge = require('merge-stream');
var size = require('gulp-size');

var dist = require('./dist');

// Copy all files at the root level (app)
gulp.task('copy', function() {
  var app = gulp.src([
    'app/*'
  ], {
    dot: true
  }).pipe(gulp.dest(dist()));

  var data = gulp.src([
    'app/data/**/*'
  ]).pipe(gulp.dest(dist('data')));

  var images = gulp.src([
    'app/images/**/*'
  ]).pipe(gulp.dest(dist('images')));

  // Copy over only the bower_components we need
  // These are things which cannot be vulcanized
  var bower = gulp.src([
    'app/bower_components/{webcomponentsjs,promise-polyfill}/**/*'
  ]).pipe(gulp.dest(dist('bower_components')));

  return merge(app, data, images, bower)
    .pipe(size({
      title: 'copy'
    }));
});

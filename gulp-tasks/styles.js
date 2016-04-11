/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp-task-doc');
var cleanCSS = require('gulp-clean-css');
var path = require('path');
var size = require('gulp-size');

var dist = require('./dist');

// Compile styles
gulp.task('styles', function() {
  var stylesPath = 'styles';

  return gulp.src(['**/*.css'].map(function(src) {
      return path.join('app', stylesPath, src);
    }))
    .pipe(changed(stylesPath, {extension: '.css'}))
    .pipe(gulp.dest('.tmp/' + stylesPath))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist(stylesPath)))
    .pipe(size({title: stylesPath}));
});

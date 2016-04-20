/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var del = require('del');
var gulp = require('gulp-task-doc');

var dist = require('./dist');

// Clean output directory
gulp.task('clean', function() {
  return del([dist()]);
});

/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

// Load custom tasks from the `gulp-tasks` directory
require('require-dir')('gulp-tasks');


var gulp = require('gulp-task-doc');
var runSequence = require('run-sequence');

// Show help about all tasks
gulp.task('help', gulp.help());

// Build production files, the default task
gulp.task('default', ['clean'], function(cb) {
  runSequence(
    'copy',
    'html',
    'vulcanize',
    cb);
});

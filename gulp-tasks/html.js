/*
@license
Copyright (c) 2016 GDG Spain
This code may only be used under the MIT style license found at LICENSE.txt
*/

'use strict';

var gulp = require('gulp-task-doc');
var gulpIf = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var minifyHtml = require('gulp-minify-html');
var size = require('gulp-size');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var dist = require('./dist');

// Scan your HTML for assets & optimize them
gulp.task('html', function() {
  return gulp.src(['app/**/*.html', '!app/{elements,bower_components}/**/*.html'])
    .pipe(useref({searchPath: ['.tmp', 'app']}))
    // Concatenate and minify JavaScript
    .pipe(gulpIf('*.js', uglify({
      preserveComments: 'some'
    })))
    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe(gulpIf('*.css', cleanCSS()))
    // Minify any HTML
    .pipe(gulpIf('*.html', minifyHtml({
      quotes: true,
      empty: true,
      spare: true
    })))
    // Output files
    .pipe(gulp.dest(dist()))
    .pipe(size({
      title: 'html'
    }));
});

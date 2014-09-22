'use strict';
/* global require */

var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  jshint = require('gulp-jshint');

gulp.task('jshint', function () {
  return gulp.src(['index.js', 'gulpfile.js', 'examples/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', function (callback) {
  runSequence('jshint', callback);
});

gulp.task('test', function (callback) {
  runSequence('default', callback);
});

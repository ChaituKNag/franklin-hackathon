'use strict';

var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');

var reload = browserSync.reload;

gulp.task('mainBowerFiles', function moveBowerDeps() {
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('src'));
});

gulp.task('bootstrap:prepareLess', ['mainBowerFiles'], function bootstrapPrepareLess() {
  return gulp.src('src/less/bootstrap/variables.less')
      .pipe(gulp.dest('src/bootstrap/less'));
});

gulp.task('bootstrap:compileLess', ['bootstrap:prepareLess'], function bootstrapCompileLess() {
  return gulp.src(['src/bootstrap/less/bootstrap.less', 'less/main.less'])
      .pipe(less())
      .pipe(gulp.dest('public/css'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch("public/*.html").on("change", reload);
});

gulp.task('css', function() {
    return gulp.src('public/css/*.css')
        .pipe(cssnano())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('compress', function() {
  return gulp.src(['src/jquery/dist/*.js', 'src/bootstrap/dist/js/*.js', 'src/js/main.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', ['bootstrap:compileLess'], function watch() {
  gulp.watch(['src/less/bootstrap/variables.less'], ['bootstrap:compileLess', reload]);
});

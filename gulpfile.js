'use strict';

var gulp = require('gulp');
var service = require('gulp-service');
var mainBowerFiles = require('main-bower-files');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

var reload = browserSync.reload;

gulp.task('build', ['css', 'js', 'img'], function buildComplete() {
  return console.log("Build complete\ntype gulp serve to start your hackathon application");
});

gulp.task('mainBowerFiles', function moveBowerDeps() {
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
      .pipe(gulp.dest('src'));
});

gulp.task('less:prepare', ['mainBowerFiles'], function bootstrapPrepareLess() {
  return gulp.src('src/less/bootstrap/variables.less')
      .pipe(gulp.dest('src/bootstrap/less'));
});

gulp.task('less:compile', ['less:prepare'], function bootstrapCompileLess() {
  return gulp.src(['src/bootstrap/less/bootstrap.less', 'src/less/main.less'])
      .pipe(less())
      .pipe(gulp.dest('public/css'));
});


var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('icons', function(done) {
  return realFavicon.generateFavicon({
    masterPicture: 'src/images/hackathon-logo.png',
    dest: 'public',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#005598',
        margin: '0%',
        appName: 'Hackathon'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#005598',
        onConflict: 'override',
        appName: 'Hackathon'
      },
      androidChrome: {
        pictureAspect: 'backgroundAndMargin',
        margin: '0%',
        backgroundColor: '#005598',
        themeColor: '#005598',
        manifest: {
          name: 'Hackathon',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 50,
        themeColor: '#005598'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    return done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
  return gulp.src(['public/*.html'])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest('public/*.html'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

  gulp.watch(['public/**/*.html'], reload);
  gulp.watch(['src/less/**/*.less'], ['css', reload]);
  //gulp.watch(['src/less/**/*.less'], ['css', reload]);
});

gulp.task('css', ['less:compile'], function() {
    return gulp.src(['public/css/*.css', "!public/css/*.min.css"])
        .pipe(cssnano({
          discardUnused: {
            fontFace: false
          }
        }))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', function() {
  return gulp.src(['src/jquery/dist/*.js', 'src/bootstrap/dist/js/*.js', 'src/js/*.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('img', function() {
  return gulp.src(['src/images/questions/*.png'])
    .pipe(gulp.dest('public/images/questions'));
});

gulp.task('watch', ['less:compile'], function watch() {
  gulp.watch(['src/less/bootstrap/variables.less'], ['less:compile', reload]);
});


gulp.task('app', function() {
	livereload.listen();
	nodemon({
		script: 'app/index.js',
		ext: 'js'
	}).on('restart', function(){
		gulp.src('app/index.js')
			.pipe(livereload())
			.pipe(notify('API restart'));
	});
});

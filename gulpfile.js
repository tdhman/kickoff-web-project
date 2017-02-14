/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint'),
    sass   = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    del = require('del'),
    async = require('async'),
    moment = require('moment'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util');

var Config = {
    app: 'app',
    build: 'src'
};

// create a default task and just log a message
gulp.task('default', ['connect', 'watch'], function() {
  return gutil.log('Gulp is running!')
});

// load to localhost
gulp.task('connect', function () {
    connect.server({
        livereload: true,
        port: 8888
    });
});

gulp.task('livereload', function () {
    gulp.src([
        Config.build + '/**/*.html'
    ]).pipe(connect.reload());
});

// configure the jshint task
// jshint will check errors for any change in javascript files
// set up this task to watch each time we save a javascript file
gulp.task('jshint', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
  return gulp.src(['src/scss/**/*.scss'])
    .pipe(sourcemaps.init())  // Process the original sources
    .pipe(sass())
    .pipe(sourcemaps.write()) // Add the map to modified source.
    .pipe(gulp.dest('app/css'));
});

gulp.task('build-js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    //only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/js'));
});

// copy vendor dependencies
gulp.task('build-jquery', function() {
  return gulp.src(['bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'bower_components/tether/dist/js/tether.min.js'])
    .pipe(gulp.dest('app/js'));
});

gulp.task('build-bootstrap', function() {
  return gulp.src(['bower_components/bootstrap/dist/css/*.css', 'bower_components/font-awesome/css/*.css', 'bower_components/tether/dist/css/*.css'])
    .pipe(gulp.dest('app/css'));
});

gulp.task('build-html', function() {
  // copy any html files in src/ to app/
  gulp.src('src/*.html').pipe(gulp.dest('app'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['clean', 'build'], function() {
  gulp.watch('src/js/**/*.js', ['jshint']);
  gulp.watch([
        Config.build + '/**/*.scss',
        Config.build + '/**/*.js',
        Config.build + '/**/*.html'
    ], ['build', 'livereload']);
});

gulp.task('build', ['clean', 'build-js', 'build-css', 'build-jquery', 'build-bootstrap', 'build-html'], function (callback) {
    buildAll(callback);
});

gulp.task('clean', function () {
    cleanAll();
});

function buildAll(callback) {
    console.log('[' + getNow() + '] Build done!');
    if (callback) {
        callback();
    }
}

function cleanAll(callback) {
    console.log('[' + getNow() + '] Cleaning directories...');
    del.sync([
        Config.app + '/css/**'
    ]);
    console.log('[' + getNow() + '] Cleaning directories...OK');
    if (callback) {
        callback();
    }
}

function getNow() {
    return moment().format('HH:mm:ss');
}
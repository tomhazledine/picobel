// Include gulp
var gulp         = require('gulp');

// Include Our Plugins
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var minifycss    = require('gulp-clean-css');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

// This will handle our errors
var onError = function (err) {
    gutil.log(gutil.colors.red(err));
};

// Tests
gulp.task('test', function () {
    return gulp.src('test/runner.html')
    .pipe(mochaPhantomJS());
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('uncompressed/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('uncompressed/js/*.js')
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(concat('picobel.js'))
    .pipe(gulp.dest(''))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(''));
});

// Lets lint our JS
gulp.task('jslint', function() {
    return gulp.src('uncompressed/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', function() {

    gulp.watch('uncompressed/js/*.js', ['scripts']);
    gulp.watch('uncompressed/scss/*.scss', ['sass']);
    gutil.log('Watching source files for changes... Press ' + gutil.colors.cyan('CTRL + C') + ' to stop.');

});

// Default Task
gulp.task('default', ['watch']);

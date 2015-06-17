// Include gulp
var gulp         = require('gulp');

// Include Our Plugins
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var cache        = require('gulp-cache');
var jshint       = require('gulp-jshint');
var size         = require('gulp-size');
var gutil        = require('gulp-util');
var plumber      = require('gulp-plumber');

// This will handle our errors
var onError = function (err) {
    gutil.log(gutil.colors.red(err));
};

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('styleFreeAudio.js')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(size({title: 'js'}))
        .pipe(rename('styleFreeAudio.min.js'))
        .pipe(uglify())
        .pipe(size({title: 'js.min'}))
        .pipe(gulp.dest(''));
});

gulp.task('jslint', function() {
    return gulp.src('styleFreeAudio.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('styleFreeAudio.js', ['scripts']);
});

// Default Task
gulp.task('default', ['scripts', 'watch']);
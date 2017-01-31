// Include gulp
var gulp         = require('gulp');

// Include Our Plugins
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var livereload   = require('gulp-livereload');
var minifycss    = require('gulp-minify-css');
var plumber      = require('gulp-plumber');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var size         = require('gulp-size');
var svgSprite    = require('gulp-svg-sprite');
var uglify       = require('gulp-uglify');
var gutil        = require('gulp-util');
var lr           = require('tiny-lr');
var server       = lr();

// This will handle our errors
var onError = function (err) {
    gutil.log(gutil.colors.red(err));
};

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('uncompressed/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(size({title: 'css'}))
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(size({title: 'css.min'}))
    .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('uncompressed/js/*.js')
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(concat('picobel.js'))
    .pipe(size({title: 'js'}))
    .pipe(gulp.dest(''))
    .pipe(rename('picobel.min.js'))
    .pipe(uglify())
    .pipe(size({title: 'js.min'}))
    .pipe(gulp.dest(''));
});

// SVG Sprite
var svgConfig = {
    shape : {
        dest : 'intermediate' // Keep the intermediate files
    },
    mode : {
        bust : true,
        sprite : "sprite.<mode>.svg",
        symbol : true
    }
};
gulp.task('svg',function() {
    gulp.src('uncompressed/icons/**/*.svg')
    .pipe(svgSprite(svgConfig))
    .pipe(gulp.dest('icons'));
});

// Lets lint our JS
gulp.task('jslint', function() {
    return gulp.src('uncompressed/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Livereload
gulp.task('listen', function(next) {
    server.listen(35728, function(err) {
        if (err) return console.log;
        next();
    });
});

// Watch Files For Changes
gulp.task('watch', function() {

    gulp.watch('uncompressed/js/*.js', ['scripts']);
    gulp.watch('uncompressed/scss/*.scss', ['sass']);
    gulp.watch('uncompressed/icons/**/*.svg', ['svg']);
    gutil.log('Watching source files for changes... Press ' + gutil.colors.cyan('CTRL + C') + ' to stop.');

    gulp.watch(['*.html','*.php','css/*.css','*.js']).on('change', function(file) {
        livereload(server).changed(file.path);
    });
});

// Default Task
gulp.task('default', ['watch']);

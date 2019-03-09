'use strict';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    uglify = require('gulp-uglify'),
    lineec = require('gulp-line-ending-corrector'),
    htmlmin = require('gulp-html-minifier2'),
    babel = require('gulp-babel');


sass.compiler = require('node-sass');

function css() {
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(concat('all.scss'))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(lineec())
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
}

function html() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
}

function js() {
    return gulp.src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
}

function svg() {
    return gulp.src('src/img/svg/*.svg')
        .pipe(gulp.dest('dist/img/svg'));
}

function libs() {
    return gulp.src('src/lib/*.*')
        .pipe(gulp.dest('dist/lib'));
}

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

function watch() {
    browserSync.init({
        server: "dist",
        open: 'external',
        watchOptions: {
            ignoreInitial: false
        },
        files: ['dist/**'],
    });
    browserSync.reload("*.html");
    browserSync.reload("*.css");
    browserSync.reload("*.js");
    browserSync.reload("*.md");
    browserSync.reload("*.scss");
    browserSync.reload("*.svg");
    browserSync.reload("*.*");
    browserSync.reload("*");

    gulp.watch('src/scss/*.scss', css);
    gulp.watch("src/*.html", html);
    gulp.watch("src/js/*.js", js);
    gulp.watch("src/img/svg/*.svg", svg);
    gulp.watch("src/lib/*.*", libs);
}

exports.watch = watch;

var build = gulp.parallel(watch);
gulp.task('default', build);
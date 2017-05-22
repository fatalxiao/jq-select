var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gulpSequence = require('gulp-sequence');

gulp.task('dev', function () {
    browserSync({
        files: ['./docs/**', './src/**'],
        server: {
            baseDir: './',
            index: 'docs/dev.html'
        }
    });
});

gulp.task('example', function () {
    browserSync({
        files: ['./docs/**', './src/**'],
        server: {
            baseDir: './',
            index: 'docs/example.html'
        }
    });
});

gulp.task('images', function () {
    return gulp.src(['./src/images/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('css', function () {
    return gulp.src(['./src/JQSelect.css'])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['ie >= 9', 'Firefox >= 20', 'last 2 Chrome versions']
            // cascade: true,
            // remove: true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('cssmin', function () {
    return gulp.src(['./dist/JQSelect.css'])
        .pipe(plumber())
        .pipe(cssmin())
        .pipe(rename('JQSelect.min.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function () {
    return gulp.src(['./src/JQSelect.js'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('jsmin', function () {
    return gulp.src(['./dist/JQSelect.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('JQSelect.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpSequence('images', 'css', 'cssmin', 'js', 'jsmin'));
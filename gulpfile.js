var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gulpSequence = require('gulp-sequence'),
    browserify = require('gulp-browserify');


/** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- server -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
gulp.task('dev', function () {
    browserSync({
        server: {
            baseDir: './',
            index: 'dev.html'
        }
    });
});

gulp.task('example', function () {
    browserSync({
        server: './'
    });
});


/** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- compile -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
gulp.task('compile:sass', function () {
    return gulp.src(['./src/JQSelect.scss'])
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src'));
});


/** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- watch -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
gulp.task('watch:sass', function () {
    gulp.watch('./src/JQSelect.scss', ['compile:sass']);
});


/** -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- build -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */
gulp.task('build:images', function () {
    return gulp.src(['./src/images/**'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('build:css', function () {
    return gulp.src(['./src/JQSelect.css'])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['ie >= 9', 'Firefox >= 20', 'last 2 Chrome versions']
            // cascade: true,
            // remove: true
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build:cssmin', function () {
    return gulp.src(['./dist/JQSelect.css'])
        .pipe(plumber())
        .pipe(cssmin())
        .pipe(rename('JQSelect.min.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build:js', function () {
    return gulp.src('./src/JQSelect.es.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015'],
            plugins: ['transform-runtime']
        }))
        .pipe(browserify({
            'standalone': true
        }))
        .on('error', function (e) {
            console.error(e.toString());
        })
        .pipe(rename('JQSelect.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build:jsmin', function () {
    return gulp.src(['./dist/JQSelect.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('JQSelect.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpSequence('build:images', 'build:css', 'build:cssmin', 'build:js', 'build:jsmin'));
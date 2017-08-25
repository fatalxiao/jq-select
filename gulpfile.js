process.env.NODE_ENV = '"release"';

var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    miniPackageJson = require('./scripts/gulp-mini-package-json');

/**
 * copy extra files to dist
 */
gulp.task('copyAssets', function () {
    return gulp.src('./assets/**')
        .pipe(gulp.dest('./dist/assets'));
});
gulp.task('copyNpmFiles', function () {
    return gulp.src(['README.md', './LICENSE'])
        .pipe(gulp.dest('./dist'));
});
gulp.task('copyPackageJson', function () {
    return gulp.src('./package.json')
        .pipe(miniPackageJson())
        .pipe(gulp.dest('./dist'));
});
gulp.task('copyFiles', gulpSequence('copyAssets', 'copyNpmFiles', 'copyPackageJson'));
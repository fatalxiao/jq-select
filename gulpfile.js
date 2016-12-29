var gulp = require('gulp'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	gulpSequence = require('gulp-sequence');

gulp.task('dev', function () {
	browserSync({
		files: ['./src/**'],
		server: {
			baseDir: './src'
		}
	});
});

gulp.task('clean', function () {
	return gulp.src('./dist/**', {read: false})
		.pipe(clean());
});

gulp.task('images', function () {
	return gulp.src(['./src/images/**'])
		.pipe(plumber())
		.pipe(gulp.dest('./dist/images/'));
});

gulp.task('cssmin', function () {
	return gulp.src(['./src/JQSelect.css'])
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['ie >= 9', 'Firefox >= 20', 'last 2 Chrome versions'],
			// cascade: true,
			// remove: true
		}))
		.pipe(cssmin())
		.pipe(rename('JQSelect.min.css'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('jsmin', function () {
	return gulp.src(['./src/JQSelect.js'])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename('JQSelect.min.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('build', gulpSequence('clean', 'images', 'cssmin', 'jsmin'));
'use strict';

const del = require('del');
const gulp = require('gulp');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const fontface = require('gulp-fontface');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

gulp.task('assets', function() {
	return gulp.src(['assets/**/*.*', 'assets/.htaccess'])
		.pipe(newer('public'))
		.pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
	return del('public');
});

gulp.task('fontface', function() {
	return gulp.src('assets/fonts/**/*.ttf')
		.pipe(newer('public/fonts'))
		.pipe(fontface('public/css', 'public/fonts'))
		.pipe(concat('fonts.css'))
		.pipe(gulp.dest('public/css'));
});

gulp.task('sass', function() {
	let options = {
		indentType: 'tab',
		indentWidth: 1,
		outputStyle: 'expanded'
	};

	return gulp.src(['sass/style.scss', 'sass/admin.scss'])
		.pipe(sass(options)).on('error', notify.onError())
		.pipe(gulp.dest('public/css'));
});

gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: "bonbon.loc"
	});
});

gulp.task('watch', function() {
	gulp.watch(['assets/**/*.*', 'assets/.htaccess'], gulp.series('assets'));
	gulp.watch('sass/**/*.scss', gulp.series('sass'));
	gulp.watch('assets/fonts/**/*.ttf', gulp.series('fontface'));

	browserSync.watch('public').on('change', browserSync.reload);
});

gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('assets', 'sass', 'fontface'),
	gulp.parallel('browser-sync', 'watch')
));
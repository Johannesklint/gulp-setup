const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const del = require('del');
const runSequence = require('run-sequence');
const changed = require('gulp-changed');
const ngAnnotate = require('gulp-ng-annotate');
const babel = require('gulp-babel');

// Writes your sass to css folder.
// Inlude sass files in style.css
// But also if you write new sass file it's compiles to a new css
gulp.task('sass', function () {
    return gulp.src('app/styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

// Watch the sass files and reload the browser window accordingly
gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Hot reload 
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

// To minify script, add surronding comment to minify multiple script files
gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
});

// Only update the file that have been changed, included in default
gulp.task('change', function () {
    return gulp.src(SRC)
        .pipe(changed('dist'))
        // `ngAnnotate` will only get the files that 
        // changed since the last time it was run 
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist'));
});

// Cleans up the dist folder from files that are unused.
// Use by run 'gulp clean'
gulp.task('clean:dist', function () {
    return del.sync('dist');
});
// For babel
gulp.task('babel', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});
// Runs all tasks at one, as you can see they are included in the array
// By running build but the task below makes you run it with just 'gulp'
gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    );
});

// Runs all tasks at one, as you can see they are included in the array
// 'default' makes you run all the gulp task by just typeing 'gulp'
// in the command-line
gulp.task('default', function (callback) {
    runSequence('clean:dist',
        ['sass', 'browserSync', 'watch', 'change', 'babel'],
        callback
    );
});
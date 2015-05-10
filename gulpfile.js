// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var stylish = require('jshint-stylish');
var nodemon = require('gulp-nodemon');
var install = require('gulp-install');

// Installation task
gulp.task('install', function() {
    gulp.src(
        [
            './package.json',
            './bower.json'
        ])
        .pipe(install());
});

// JS Hint task
gulp.task('jshint', function() {
    gulp.src(
        [
            '*.js',
            '*.ejs',
            'config/*.js',
            'routes/*.js',
            'models/*.js',
            'public/js/*.js'
        ],
        { base: '/' })
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

// CSS Lint task
gulp.task('csslint', function() {
    gulp.src('public/css/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter(stylish));
});

gulp.task('develop', function() {
    nodemon(
        {
            script: 'app.js',
            ext: 'html js css json ejs',
            ignore: ['gulpfile.js'],
            tasks: ['jshint'],
            env: { 'NODE_ENV' : 'development'}
        })
        .on('restart', function() {
            console.log('Node Restarted!');
        });

});

gulp.task('default', ['install', 'jshint', 'develop'], function() {
    console.log('Gulp Running!');
});
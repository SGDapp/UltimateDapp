// JavaScript Document

'use strict';

 var gulp = require('gulp'); 

// Include Our Plugins

var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Connect Task
gulp.task('connect', function(){
    connect.server({
        root: './etherumDapp',
        port: 3333,
        livereload: true,
        middleware: function (connect, opt) {
         return [ 
                proxy('/etherumDapp', {
                    target: 'http://localhost:3344/',
                    ws: true      // <-- set it to 'true' to proxy WebSockets
                })
            ]
    }
    });
});

gulp.task('browserify', function() {
	// Grabs the app.js file
    return browserify('./etherumDapp/src/home/app.js')
    	// bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./etherumDapp/dest/'))
	.pipe(connect.reload());
})


gulp.task('html', function () {
  return gulp.src('./etherumDapp/**/*.html')
    .pipe(connect.reload());
});




// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./etherumDapp/src/**/*.js')
        .pipe(connect.reload());
});
gulp.task('css', function() {
    return gulp.src('./etherumDapp/src/**/*.css')
        .pipe(connect.reload());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./etherumDapp/**/*.html',['html']);
    gulp.watch('./etherumDapp/**/*.css',['css']);
    gulp.watch('./etherumDapp/src/**/*.js', [ 'scripts','browserify']);
});

gulp.task('serve', ['connect', 'watch','browserify']);


// Default Task
gulp.task('default', ['scripts', 'watch']);

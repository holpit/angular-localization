var gulp = require('gulp'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps')
    ts = require('gulp-typescript'),
    webserver = require('gulp-webserver'),
    
    paths = {
        www: "./www/",
        jsOutput: "./www/app/",
        tsSource: './src/**/*.ts'
    };

gulp.task('clean', function () {
    del([
        paths.www + 'app/**/*.js'
    ]);
});
 
gulp.task('build', ['clean'], function () {
    var tsResult = ts.createProject('tsconfig.json')
                     .src(paths.tsSource)
                       .pipe(sourcemaps.init())
					   .pipe(ts({
						   sortOutput: true,
                           target: 'ES5'
					   }));
	
	return tsResult.js
				.pipe(concat('app.js')) 
				.pipe(sourcemaps.write('maps')) 
				.pipe(gulp.dest(paths.jsOutput));
});

gulp.task('default', [ 'build' ], function () {
    gulp.src('www')
        .pipe(webserver({
            livereload: false,
            port: 9999,
            open: true
        }));
    return gulp.watch(paths.tsSource, ['build']);
});
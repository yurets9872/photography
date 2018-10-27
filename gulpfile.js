var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    clean        = require('gulp-clean'),
    runSequence  = require('run-sequence'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    connect      = require('gulp-connect'),
    livereload   = require('gulp-livereload'),
    gcmq         = require('gulp-group-css-media-queries'),
    sourcemaps   = require('gulp-sourcemaps');


gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('sass', function(){
    return gulp.src('src/styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload());
});

gulp.task('sass-watch', function() {
    return gulp.src('dist/css/style.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('html', function () {
    gulp.src('src/html/**/*.html')
        .pipe(gulp.dest('dist/html'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('src/scripts/**/*.js')
  .pipe(gulp.dest('dist/scripts'))
  .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/html/**/*.html', ['html']);
    gulp.watch('src/scripts/**/*.js', ['js']);
});

gulp.task('static', function () {
    gulp.src('src/image/**/*')
        .pipe(gulp.dest('dist/image/'));
    gulp.src('src/scripts/**/*')
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('clean', function() {
    return gulp.src('/dist')
        .pipe(clean());
});

gulp.task('deploy', ['clean'], function (done) {
    runSequence(['static', 'sass', 'html', 'js'], done)
});

gulp.task('default', ['clean'], function (done) {
    runSequence(['static', 'watch', 'sass-watch', 'connect', 'sass', 'html', 'js'], done)
});



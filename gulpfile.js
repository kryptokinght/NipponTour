//required dependencies
const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

//creating tasks
//script task
gulp.task('scripts', function() {
    gulp.src(["public/js/**/*.js", "!public/js/**/*.min.js"])
        .pipe(plumber())
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

//css task
gulp.task('css', function() {
    gulp.src("public/stylesheets/**/*.css")
    .pipe(reload({stream:true}));
});

//ejs(html) task
gulp.task('ejs', function() {
    gulp.src("views/**/*.ejs");
})

//browser-sync task
gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

//watch task
gulp.task('watch', function() {
    gulp.watch("public/js/**/*.js", ['scripts']);
    gulp.watch("public/stylesheets/**/*.css", ['css']);
    gulp.watch("views/**/*.ejs", ['ejs']);
});

gulp.task("default", ['scripts', 'css', 'ejs', 'browser-sync', 'watch']);

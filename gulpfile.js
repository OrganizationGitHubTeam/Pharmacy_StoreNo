var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('html', function () {
    gulp.src(['**/*.html'])
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(['**/*.html'], ['html']);
});

gulp.task('webserver', function () {
    connect.server({
        root: '.',
        livereload: true,
        port: 3030
    });
});

gulp.task('default', ['html', 'webserver', 'watch']);
// Подключаем Gulp и все необходимые библиотеки
var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon');
// Обновление страниц сайта на локальном сервере
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "state",
		notify: false
	});
}); 

// Компиляция stylesheet.css
gulp.task('sass', function() {
	return gulp.src('css/main.scss')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.reload({stream: true}))
});
// Наблюдение за файлами
gulp.task('watch', ['sass', 'browser-sync'], function() {
	gulp.watch('css/main.scss', ['sass']);
	gulp.watch('**/*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});
gulp.task('default', ['watch']);

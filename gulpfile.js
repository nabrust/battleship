var
	gulp = require('gulp'),
	rename = require("gulp-rename"), 								// переименовывает файлы
	notify = require("gulp-notify"), 								// выводит сообщения на экран
	autoprefixer = require('gulp-autoprefixer'), 		// добавляет префиксы в стилях
	jade = require('gulp-jade'),										// компилятор JADE
	sass = require('gulp-ruby-sass'), 							// компилятор SASS
	useref = require('gulp-useref'),  							// собирает проект для продакшена
  gulpif = require('gulp-if'), 										// фильтрует все подключенные файлы к HTML
  uglify = require('gulp-uglify'), 								// минифицирует JS
  minifyCss = require('gulp-minify-css'), 				// минифицирует CSS
  browserSync = require("browser-sync"), 					// Browser-sync
  clean = require('gulp-clean'),									// удаляет файлы
	imagemin = require('gulp-imagemin'),						// оптимизация картинок
	size = require('gulp-size'),										// определяет размер
	plumber = require('gulp-plumber');



//___________________Собираем папку DIST (только после компиляции Jade)___________________//
gulp.task('build', ['clean'], function () {
  gulp.start('dist');
});



//____________________Сборка и вывод размера содержимого папки dist_______________________//
gulp.task('dist', ['useref', 'images', 'extras'], function () {
  return gulp.src('dist/**/*')
	.pipe(plumber())
	.pipe(size({title: 'build'}));
});



//__________________________________Перенос шрифтов______________________________________//
gulp.task('fonts', function() {
  gulp.src('app/fonts/*')
		.pipe(plumber())
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest('dist/fonts/'));
});



//__________________________Остальные файлы, такие как favicon.ico и пр.________________//
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ]).pipe(gulp.dest('dist'));
});



//______________________________________Оптимизация изображений_________________________//
gulp.task('images', function () {
  return gulp.src('app/img/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img'));
});




//_______________________________Переносим HTML, CSS, JS в папку dist___________________//
gulp.task('useref', function () {
    var assets = useref.assets();

    return gulp.src('./app/*.html')
				.pipe(plumber())
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});



//_____________________________________clean____________________________________________//
gulp.task('clean', function () {
  return gulp.src('dist')
    .pipe(clean());
});



//____________________________________autoprefixer______________________________________//
gulp.task('prefixer', function () {
    return gulp.src('./app/css/main.css')
				.pipe(plumber())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./app/css/main.css'));
});



//____________________________________HTML______________________________________________//
gulp.task('compileJade', function() {
	var YOUR_LOCALS = {};
  gulp.src(['./app/dev/jade/page/*.jade', '!./app/dev/jade/page/_*.jade'])
		.pipe(plumber())
  	.pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    })).on('error', console.log)
	.pipe(gulp.dest('./app/'))
	.pipe(notify("HTML готов!"));
});



//___________________________________CSS________________________________________________//
gulp.task('compileSass', function () {
  return sass('./app/dev/style/sass/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('./app/css'))
		.pipe(notify("CSS готов!"));
});



//__________________________________BROUSER-SYNC________________________________________//
gulp.task("server", function () {
	browserSync({
		port: 9000,
		server: {
			baseDir: "./app/"
		}
	});
});



//___________________________________WATCH______________________________________________//
gulp.task('watch', function() {
	gulp.watch('./app/dev/jade/**/*.jade', ['compileJade']);
  gulp.watch('./app/dev/style/sass/*.scss', ['compileSass']);
  gulp.watch([
		"./app/*.html",
		"./app/js/**/*.js",
		"./app/css/**/*.css",
	]).on("change", browserSync.reload);
});



gulp.task("default", ["server", "watch"]);

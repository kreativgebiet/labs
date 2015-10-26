import gulp from 'gulp';

import csso from 'gulp-csso';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import postcss from 'gulp-postcss';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import minifyHtml from 'gulp-minify-html';
import connect from 'gulp-connect';
import plumber from 'gulp-plumber';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rimraf from 'rimraf';
import autoprefixer from 'autoprefixer';
import stylePaths from 'style-paths';
import browserify from 'browserify';
import babelify from 'babelify';
import debowerify from 'debowerify';

const LR_PORT = 35729;
const SERVER_PORT = 8888;
const DEST_PATH = 'dist/';

let entryConfig = {
  cache: {},
  packageCache: {},
  fullPaths: true,

  entries: './source/scripts/main.js',
  extensions: [ '.jsx', '.js' ],
  debug: true,
  transform: [
    babelify,
    debowerify
  ]
};


gulp.task('scripts', () => {
  var b = browserify(entryConfig);
  b.bundle()
    .pipe(plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(eslint())
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST_PATH))
    .pipe(connect.reload())
});

gulp.task('markup', () => {
  gulp.src('./source/html/**/*.html')
    .pipe(plumber())
    .pipe(minifyHtml())
    .pipe(gulp.dest(DEST_PATH))
    .pipe(connect.reload());
});

gulp.task('styles', () => {
  gulp.src('./source/styles/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: stylePaths(['scss', 'sass'])
    }))
    .pipe(postcss([ autoprefixer({ browsers: [ 'last 2 versions' ] }) ]))
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(DEST_PATH + 'styles'))
    .pipe(connect.reload());
});

gulp.task('images', () => {
  gulp.src('./source/images/*.{png,jpg,svg}')
    .pipe(gulp.dest(DEST_PATH + '/images'));
  gulp.src('./source/images/icn/*.{png,ico,svg}')
    .pipe(gulp.dest(DEST_PATH + '/images/icn'));
});


gulp.task('server', next => {
  connect.server({
    port: SERVER_PORT,
    root: DEST_PATH,
    livereload: true
  });
});

gulp.task('default', () => {
  gulp.start('server');

  var initTask = (files, task) => {
    if ( typeof task === 'string' ) {
      gulp.start(task); gulp.watch(files, [ task ]);
    } else {
      task.map(t => { gulp.start(t); }); gulp.watch(files, task);
    }
  };

  initTask('source/scripts/**/*.{js,jsx}', 'scripts');
  initTask('source/html/**/*.html', 'markup');
  initTask('source/styles/**/*.scss', 'styles');
});

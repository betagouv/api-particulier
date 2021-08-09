const gulp = require('gulp');
const postcss = require('gulp-postcss');
const gulpEsbuild = require('gulp-esbuild');

const css = () => {
  return gulp
    .src('./src/presentation/frontend/index.css')
    .pipe(postcss())
    .pipe(gulp.dest('./public'));
};

const js = () => {
  return gulp.src('./src/presentation/frontend/index.ts').pipe(
    gulpEsbuild({
      outfile: 'main.js',
      bundle: true,
      minify: true,
      sourcemap: true,
    }).pipe(gulp.dest('./public'))
  );
};

exports.dev = () => {
  gulp.watch(
    'src/presentation/frontend/index.css',
    {ignoreInitial: false},
    css
  );
  gulp.watch('src/presentation/frontend/index.ts', {ignoreInitial: false}, js);
};

exports.build = gulp.parallel(js, css);

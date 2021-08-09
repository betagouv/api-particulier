const gulp = require('gulp');
const gulpPostcss = require('gulp-postcss');
const gulpEsbuild = require('gulp-esbuild');

const postcss = () => {
  return gulp
    .src('./src/presentation/frontend/index.css')
    .pipe(gulpPostcss())
    .pipe(gulp.dest('./public'));
};

const fonts = () => {
  return gulp
    .src('node_modules/@gouvfr/dsfr/dist/fonts/*')
    .pipe(gulp.dest('./public/fonts'));
};

const css = gulp.parallel(postcss, fonts);

const js = () => {
  return gulp
    .src('./src/presentation/frontend/index.ts')
    .pipe(
      gulpEsbuild({
        outfile: 'index.js',
        bundle: true,
        minify: true,
        sourcemap: true,
      })
    )
    .pipe(gulp.dest('./public'));
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

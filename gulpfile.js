const gulp = require('gulp');
const postcss = require('gulp-postcss');

const css = () => {
  return gulp
    .src('./src/presentation/frontend/index.css')
    .pipe(postcss())
    .pipe(gulp.dest('./public'));
};

exports.css = css;

exports.cssDev = () => {
  gulp.watch(
    'src/presentation/frontend/index.css',
    {ignoreInitial: false},
    css
  );
};

const tailwincss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const plugins = [
  tailwincss({
    mode: 'jit',
    content: [
      './src/presentation/frontend/views/**/*.njk',
      './src/presentation/frontend/**/*.controller.ts',
    ],
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(autoprefixer());
  plugins.push(require('cssnano'));
}

module.exports = {
  plugins,
};

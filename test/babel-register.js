// eslint-disable-next-line node/no-unpublished-require
const register = require('@babel/register').default;

register({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  presets: ['@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['..'],
        alias: {
          src: './src/',
        },
      },
    ],
  ],
});

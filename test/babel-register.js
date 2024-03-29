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
          test: './test/',
        },
      },
    ],
  ],
});

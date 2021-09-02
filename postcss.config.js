const tailwincss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const purgeConfig = {
  // Specify the paths to all of the template files in your project
  content: [
    './src/presentation/frontend/views/**/*.njk',
    './src/presentation/frontend/**/*.controller.ts',
  ],
  // This is the function used to extract class names from your templates
  defaultExtractor: content => {
    // Capture as liberally as possible, including things like `h-(screen-1.5)`
    const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

    // Capture classes within other delimiters like .block(class="w-1/2") in Pug
    const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

    return broadMatches.concat(innerMatches);
  },
};
const purgecss = require('@fullhuman/postcss-purgecss')(purgeConfig);

const plugins = [
  tailwincss({
    mode: 'jit',
    darkMode: false,
    purge: purgeConfig,
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(purgecss);
  plugins.push(autoprefixer());
  plugins.push(require('cssnano'));
}

module.exports = {
  plugins,
};

const tailwincss = require('tailwindcss');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const path = require('path');

const purgeConfig = {
  // Specify the paths to all of the template files in your project
  content: ['./src/presentation/frontend/views/**/*.njk'],
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

module.exports = {
  plugins: [
    postcssImport(),
    tailwincss({
      darkMode: false,
      purge: false,
    }),
    purgecss,
    autoprefixer(),
    postcssUrl({
      assetsPath: path.join(__dirname, 'node_modules/@gouvfr/dsfr/dist'),
    }),
    require('cssnano'),
  ],
};

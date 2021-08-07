module.exports = {
  files: {
    javascripts: {
      entryPoints: {
        'src/presentation/frontend/index.ts': 'dist.js',
      },
    },
  },
  paths: {
    watched: ['src/presentation/frontend'],
  },
  modules: {
    autoRequire: {
      'dist.js': ['src/presentation/frontend/index.ts'],
    },
  },
};

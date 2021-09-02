const legacy = require('@vitejs/plugin-legacy');

module.exports = {
  build: {
    outDir: 'public',
    manifest: true,
    rollupOptions: {
      input: 'src/presentation/frontend/production.ts',
    },
  },
  server: {
    port: 3001,
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
};

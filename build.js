// Build script — bundles js/app.js → www/js/bundle.js using esbuild
// Also bundles @ffmpeg/ffmpeg's worker → www/js/worker.js
// (worker.js is requested at runtime relative to bundle.js, so it must live in www/js/)
const esbuild = require('esbuild');

const shared = {
  bundle: true,
  format: 'esm',
  target: ['ios14'],
  minify: false,
  sourcemap: true,
};

Promise.all([
  esbuild.build({
    ...shared,
    entryPoints: ['js/app.js'],
    outfile: 'www/js/bundle.js',
  }),
  esbuild.build({
    ...shared,
    entryPoints: ['node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js'],
    outfile: 'www/js/worker.js',
  }),
]).then(() => {
  console.log('Build complete → www/js/bundle.js + www/js/worker.js');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

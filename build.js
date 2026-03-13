// Build script — bundles js/app.js → www/js/bundle.js using esbuild
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['js/app.js'],
  bundle: true,
  outfile: 'www/js/bundle.js',
  format: 'iife',          // single self-contained file, no import/export in output
  target: ['ios14'],       // iOS 14+ (Capacitor v8 minimum)
  minify: false,           // keep readable during development
  sourcemap: true,
}).then(() => {
  console.log('Build complete → www/js/bundle.js');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

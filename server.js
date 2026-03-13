// Local dev server — serves www/ with COOP/COEP headers (same as Vercel)
// Usage: node server.js
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT    = 8080;
const WWW_DIR = path.join(__dirname, 'www');

const MIME = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer((req, res) => {
  // COOP/COEP — required for FFmpeg.wasm cross-origin isolation
  res.setHeader('Cross-Origin-Opener-Policy',  'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

  let filePath = path.join(WWW_DIR, req.url === '/' ? '/index.html' : req.url);

  // Strip query strings
  filePath = filePath.split('?')[0];

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback → index.html
      fs.readFile(path.join(WWW_DIR, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(d2);
      });
      return;
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Dev server → http://localhost:${PORT}`);
  console.log('COOP/COEP headers: ON (matches Vercel)');
});

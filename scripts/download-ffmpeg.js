// Download FFmpeg.wasm files from CDN to www/ffmpeg/
// Run: node scripts/download-ffmpeg.js
// Called automatically by Vercel build (see vercel.json)

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FILES = [
  {
    url: 'https://unpkg.com/@ffmpeg/core@0.12.9/dist/esm/ffmpeg-core.js',
    dest: path.join(__dirname, '../www/ffmpeg/ffmpeg-core.js'),
  },
  {
    url: 'https://unpkg.com/@ffmpeg/core@0.12.9/dist/esm/ffmpeg-core.wasm',
    dest: path.join(__dirname, '../www/ffmpeg/ffmpeg-core.wasm'),
  },
];

const dir = path.join(__dirname, '../www/ffmpeg');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download(url, dest) {
  if (fs.existsSync(dest)) {
    console.log(`  skip (exists): ${path.basename(dest)}`);
    return;
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = (u) => https.get(u, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        req(res.headers.location);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        return;
      }
      const total = parseInt(res.headers['content-length'] || '0', 10);
      let received = 0;
      res.on('data', chunk => {
        received += chunk.length;
        if (total) process.stdout.write(`\r  ${path.basename(dest)}: ${(received/1024/1024).toFixed(1)}/${(total/1024/1024).toFixed(1)} MB`);
      });
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(''); resolve(); });
    });
    req(url);
    file.on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
}

(async () => {
  console.log('Downloading FFmpeg.wasm files…');
  for (const f of FILES) {
    console.log(`→ ${f.url}`);
    await download(f.url, f.dest);
  }
  console.log('Done.');
})();

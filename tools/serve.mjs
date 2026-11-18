// The dev server: serves the repo root to the browser with caching off, so a plain reload always runs the files on
// disk. (Python's http.server sends no cache headers: the browser then keeps modules it thinks are fresh, and a cached
// old module next to a new one, after a merge or a rename, breaks the level validator.)
//
//   node tools/serve.mjs [port]      default 8642, on 127.0.0.1 only
//
// No dependencies, like the rest of the repo.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.argv[2] ?? 8642);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.woff2': 'font/woff2',
};

const NO_CACHE = { 'Cache-Control': 'no-store, must-revalidate', Expires: '0' };

createServer(async (req, res) => {
  const send = (status, body, type = 'text/plain; charset=utf-8') => {
    res.writeHead(status, { 'Content-Type': type, ...NO_CACHE });
    res.end(req.method === 'HEAD' ? undefined : body);
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, 'GET only\n');
  let path;
  try {
    path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  } catch {
    return send(400, 'bad path\n');
  }
  if (path !== ROOT && !path.startsWith(ROOT + sep)) return send(403, 'outside the repo\n');
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    send(200, await readFile(path), TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream');
  } catch {
    send(404, 'not found\n');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`busywork: serving ${ROOT}, caching off`);
  console.log(`  playtest build (config.js PLAYTEST_LEVEL): http://127.0.0.1:${PORT}/`);
  console.log(`  dev, level menu and every level:           http://127.0.0.1:${PORT}/?dev`);
});

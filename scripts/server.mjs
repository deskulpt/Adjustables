import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';

const root = new URL('..', import.meta.url).pathname;
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const safePath = normalize(pathname).replace(/^\.\.(?:\/|\\|$)/, '');
  const candidates = pathname.startsWith('/assets/')
    ? [join(root, 'public', safePath)]
    : [join(root, safePath), join(root, safePath, 'index.html'), join(root, safePath.replace(/\/$/, '') + '.html')];
  let file;
  for (const candidate of candidates) {
    try { if ((await stat(candidate)).isFile()) { file = candidate; break; } } catch {}
  }
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`SleepSoul prototype running at http://localhost:${port}`));

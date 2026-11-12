import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';

const root = new URL('..', import.meta.url).pathname;
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const safe = normalize(pathname).replace(/^\.\.(?:\/|\\|$)/, '');
  const candidates = pathname.startsWith('/assets/')
    ? [join(root, 'public', safe)]
    : [join(root, safe), join(root, safe, 'index.html'), join(root, safe.replace(/\/$/, '') + '.html')];
  let file;
  for (const candidate of candidates) {
    try { if ((await stat(candidate)).isFile()) { file = candidate; break; } } catch {}
  }
  if (!file) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'content-type': contentTypes[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const allJobs = [
  ['home', '/', 1440, 900], ['home-mobile', '/', 390, 844],
  ['find', '/find-your-bed/', 1440, 900], ['find-mobile', '/find-your-bed/', 390, 844],
  ['product', '/products/postureplus-4-5/', 1440, 900], ['product-mobile', '/products/postureplus-4-5/', 390, 844],
  ['independence', '/sleep-better/independence/', 1440, 900],
  ['sleep-better', '/sleep-better/', 390, 844],
];
const jobs = process.env.QA_ONLY ? allJobs.filter(([name]) => name.includes(process.env.QA_ONLY)) : allJobs;

for (const [name, path, width, height] of jobs) {
  const output = `/tmp/sleepsoul-${name}.png`;
  await new Promise((resolve, reject) => {
    const process = spawn(chrome, [
      '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-sync', '--disable-extensions',
      '--disable-component-update', '--disable-default-apps', '--no-first-run', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=6000',
      `--user-data-dir=/tmp/sleepsoul-qa-${name}`, `--window-size=${width},${height}`,
      `--screenshot=${output}`, `http://127.0.0.1:${port}${path}`,
    ], { stdio: ['ignore', 'ignore', 'ignore'] });
    const timeout = setTimeout(() => process.kill('SIGKILL'), 15000);
    process.once('error', reject);
    process.once('close', (code) => {
      clearTimeout(timeout);
      if (code === 0 || existsSync(output)) resolve();
      else reject(new Error(`Chrome exited ${code} for ${name}`));
    });
  });
  console.log(output);
}

server.close();

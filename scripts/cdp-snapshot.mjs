import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const outputRoot = join(root, 'docs', 'research', 'eightsleep');
const referenceRoot = join(root, 'docs', 'design-references');
const urls = process.argv.slice(2);

if (!urls.length) {
  throw new Error('Usage: node scripts/cdp-snapshot.mjs <url> [url...]');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function jsonRequest(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:9222${path}`, options);
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.json();
}

async function openPage(url) {
  try {
    return await jsonRequest(`/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  } catch {
    const targets = await jsonRequest('/json/list');
    const target = targets.find((item) => item.type === 'page');
    if (!target) throw new Error('No Chrome page target available');
    return target;
  }
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let id = 0;

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', () => resolve());
    socket.addEventListener('error', reject);
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  return {
    async send(method, params = {}) {
      await ready;
      const requestId = ++id;
      const result = new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
      socket.send(JSON.stringify({ id: requestId, method, params }));
      return result;
    },
    close() {
      socket.close();
    },
  };
}

const expression = `(() => {
  const props = [
    'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color',
    'backgroundColor', 'backgroundImage', 'padding', 'margin', 'width', 'height',
    'maxWidth', 'minHeight', 'display', 'flexDirection', 'justifyContent', 'alignItems',
    'gap', 'gridTemplateColumns', 'borderRadius', 'border', 'boxShadow', 'position',
    'top', 'right', 'bottom', 'left', 'zIndex', 'opacity', 'transform', 'transition',
    'overflow', 'objectFit', 'objectPosition', 'filter', 'backdropFilter'
  ];
  const styles = (element) => {
    const computed = getComputedStyle(element);
    return Object.fromEntries(props.map((prop) => [prop, computed[prop]]));
  };
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
  };
  const visible = (element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  };
  const text = (element) => (element.innerText || element.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 1000);
  const topLevel = Array.from(document.querySelectorAll('main > *')).filter(visible).map((element, index) => ({
    index,
    tag: element.tagName.toLowerCase(),
    id: element.id,
    className: typeof element.className === 'string' ? element.className : '',
    text: text(element),
    rect: rect(element),
    styles: styles(element),
    headings: Array.from(element.querySelectorAll('h1,h2,h3,h4')).map((heading) => text(heading)).slice(0, 8),
    images: Array.from(element.querySelectorAll('img')).map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      width: image.naturalWidth,
      height: image.naturalHeight,
      rect: rect(image),
      styles: styles(image),
    })),
  }));
  const sample = (selector) => {
    const element = document.querySelector(selector);
    return element ? { selector, text: text(element), rect: rect(element), styles: styles(element) } : null;
  };
  return {
    url: location.href,
    title: document.title,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    scroll: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    body: { className: document.body.className, styles: styles(document.body) },
    htmlClass: document.documentElement.className,
    fonts: Array.from(document.fonts).map((font) => ({ family: font.family, weight: font.weight, style: font.style, status: font.status })),
    links: Array.from(document.querySelectorAll('link')).map((link) => ({ rel: link.rel, href: link.href, as: link.as, type: link.type })).filter((link) => link.href),
    stylesheets: Array.from(document.styleSheets).map((sheet) => sheet.href).filter(Boolean),
    images: Array.from(document.images).map((image) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      width: image.naturalWidth,
      height: image.naturalHeight,
      loading: image.loading,
      decoding: image.decoding,
      rect: rect(image),
      className: image.className,
      parentClassName: image.parentElement?.className || '',
      styles: styles(image),
    })),
    videos: Array.from(document.querySelectorAll('video')).map((video) => ({
      src: video.currentSrc || video.src || video.querySelector('source')?.src,
      poster: video.poster,
      autoplay: video.autoplay,
      loop: video.loop,
      muted: video.muted,
      rect: rect(video),
    })),
    backgrounds: Array.from(document.querySelectorAll('*')).map((element) => ({
      tag: element.tagName.toLowerCase(),
      className: typeof element.className === 'string' ? element.className : '',
      backgroundImage: getComputedStyle(element).backgroundImage,
      rect: rect(element),
    })).filter((item) => item.backgroundImage && item.backgroundImage !== 'none' && item.rect.width > 0 && item.rect.height > 0).slice(0, 500),
    interactive: Array.from(document.querySelectorAll('a,button,[role="button"],input,select,textarea')).map((element) => ({
      tag: element.tagName.toLowerCase(),
      text: text(element),
      href: element.href || null,
      ariaLabel: element.getAttribute('aria-label'),
      className: typeof element.className === 'string' ? element.className : '',
      rect: rect(element),
    })).filter((item) => item.rect.width > 0 && item.rect.height > 0),
    samples: [
      sample('header'), sample('nav'), sample('main'), sample('h1'), sample('h2'), sample('button'),
      sample('footer'), sample('[role="dialog"]'), sample('[aria-label*="menu" i]')
    ].filter(Boolean),
    topLevel,
    html: document.documentElement.outerHTML,
  };
})()`;

async function snapshot(url) {
  const target = await openPage(url);
  const cdp = connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url });
  await sleep(9000);
  await cdp.send('Runtime.evaluate', { expression: 'scrollTo(0, 0)' });
  await sleep(200);
  const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (!result?.result?.value) throw new Error(`No rendered data returned for ${url}`);
  const data = result.result.value;
  const slug = new URL(url).pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
  const base = `eightsleep-${slug}`;
  const desktopShot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await cdp.send('Runtime.evaluate', { expression: 'scrollTo(0, 0)' });
  await sleep(400);
  const mobileShot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await mkdir(outputRoot, { recursive: true });
  await mkdir(referenceRoot, { recursive: true });
  await writeFile(join(outputRoot, `${base}.json`), JSON.stringify({ ...data, html: undefined }, null, 2));
  await writeFile(join(outputRoot, `${base}.html`), data.html);
  await writeFile(join(referenceRoot, `${base}-desktop-top.png`), Buffer.from(desktopShot.data, 'base64'));
  await writeFile(join(referenceRoot, `${base}-mobile-top.png`), Buffer.from(mobileShot.data, 'base64'));
  cdp.close();
  console.log(JSON.stringify({ url, base, scrollHeight: data.scroll.height, images: data.images.length, videos: data.videos.length, sections: data.topLevel.length }));
}

for (const url of urls) await snapshot(url);

/**
 * Copy an Ultramatic tree into this repo with SleepSoul branding.
 * Keeps SleepSoul-only work (SVG articulation meter, CRO route, dossier, etc.).
 *
 *   IMPORT_SOURCE=/path/to/ultramatic node scripts/sync-from-source.mjs
 */
import { cp, mkdir, readdir, readFile, stat, writeFile, access } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const source = process.env.IMPORT_SOURCE;

const SKIP_DIRS = new Set(['.git', 'node_modules']);
const KEEP_IN_TARGET = new Set([
  'docs/dossier',
  'docs/screenshots',
  'docs/design-references/adjustable-bed-side-view-reference.svg',
  'docs/PROJECT_DOSSIER.md',
  'docs/ULTRAMATIC_SYNC.md',
  'products/postureplus-4-5-cro',
  'scripts/capture-dossier.mjs',
  'scripts/record-articulation-gif.mjs',
  'scripts/sync-from-source.mjs',
  'scripts/import-ultramatic.mjs',
  'README.md',
]);

const PRESERVE_FUNCTIONS = [
  'meterMarkup',
  'initMeters',
  'renderPdpCro',
  'renderReviewBento',
  'initTrustStrip',
  'syncCartCount',
  'initFinderContext',
];

const replacements = [
  [/Ultramatic Sleep/g, 'SleepSoul Sleep'],
  [/Ultramatic Canada/g, 'SleepSoul Canada'],
  [/Ultramatic/g, 'SleepSoul'],
  [/ultramaticsleep\.com/g, 'sleepsoulsleep.com'],
  [/why-ultramatic/g, 'why-sleepsoul'],
  [/ultramatic-system-4k/g, 'sleepsoul-system-4k'],
  [/ultramatic-hero\.gif/g, 'sleepsoul-hero.gif'],
  [/ultramatic-hero\.mp4/g, 'sleepsoul-hero.mp4'],
  [/ultramatic-logo\.png/g, 'sleepsoul-logo.svg'],
  [/ultramatic-mark/g, 'sleepsoul-mark'],
  [/assets\/ultramatic-/g, 'assets/sleepsoul-'],
];

function brand(text) {
  let out = text;
  for (const [pattern, value] of replacements) {
    out = out.replace(pattern, value);
  }
  return out;
}

function extractFunction(sourceText, name) {
  const needle = `function ${name}(`;
  const start = sourceText.indexOf(needle);
  if (start < 0) return null;
  const braceStart = sourceText.indexOf('{', start);
  if (braceStart < 0) return null;
  let depth = 0;
  for (let i = braceStart; i < sourceText.length; i++) {
    const ch = sourceText[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return sourceText.slice(start, i + 1);
    }
  }
  return null;
}

function replaceOrInsertFunction(targetText, name, fnBody, insertBefore = '  function routeRenderer()') {
  const existing = extractFunction(targetText, name);
  if (existing) {
    return targetText.replace(existing, fnBody);
  }
  const idx = targetText.indexOf(insertBefore);
  if (idx < 0) return targetText + '\n\n' + fnBody + '\n';
  return targetText.slice(0, idx) + fnBody + '\n\n' + targetText.slice(idx);
}

function isLegacyMeter(js) {
  return js.includes('bed-part bed-head') || js.includes('--head-angle');
}

function patchRouteRenderer(js, backupJs) {
  if (js.includes("page === 'product-cro'")) return js;
  const backup = backupJs.match(/if \(page === 'product-cro'\)[^\n]+\n/);
  if (!backup) return js;
  const anchor = "if (page === 'product') return () => renderPdp(false);";
  if (!js.includes(anchor)) return js;
  return js.replace(anchor, anchor + '\n    ' + backup[0].trim());
}

function patchRenderRouteHome(js, backupJs) {
  if (js.includes('articulation-section') && js.includes('renderReviewBento')) return js;
  const start = backupJs.indexOf("if (page === 'home') {");
  if (start < 0) return js;
  let depth = 0;
  let i = backupJs.indexOf('{', start);
  for (; i < backupJs.length; i++) {
    const ch = backupJs[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const homeBlock = backupJs.slice(start, i + 1);
        const targetStart = js.indexOf('function renderRoute()');
        if (targetStart < 0) return js;
        const targetHome = js.indexOf("if (page === 'home')", targetStart);
        if (targetHome < 0) return js;
        let d = 0;
        let j = js.indexOf('{', targetHome);
        for (; j < js.length; j++) {
          if (js[j] === '{') d++;
          else if (js[j] === '}') {
            d--;
            if (d === 0) {
              return js.slice(0, targetHome) + homeBlock.trimStart().replace(/^ {4}/, '    ') + js.slice(j + 1);
            }
          }
        }
        break;
      }
    }
  }
  return js;
}

function mergeConstBlock(js, backupJs) {
  if (js.includes('FOUNDING_YEAR')) return js;
  const block = backupJs.match(/const FOUNDING_YEAR[\s\S]*?yearsInBusiness\(\)[^;]+;/);
  if (!block) return js;
  return js.replace(
    /const states = \{/,
    block[0] + '\n\n  const states = {',
  );
}

function mergeArticulationCss(targetCss, backupCss) {
  if (targetCss.includes('.bed-diagram-svg')) return targetCss;
  const start = backupCss.indexOf('.bed-diagram-svg');
  if (start < 0) return targetCss;
  const end = backupCss.indexOf('.meter-readout', start);
  const slice = end > start ? backupCss.slice(start, end) : backupCss.slice(start);
  return targetCss.replace(
    /\.bed-diagram \{[^}]+\}/,
    (m) => m + '\n' + slice.trim(),
  );
}

async function walk(dir, base = source) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(abs, base)));
    } else {
      files.push(relative(base, abs));
    }
  }
  return files;
}

async function main() {
  if (!source) {
    console.error('Set IMPORT_SOURCE to your Ultramatic repo root (e.g. local clone path on the agent VM).');
    process.exit(1);
  }
  await access(source);

  const backupJs = await readFile(join(root, 'clone.js'), 'utf8');
  const backupCss = await readFile(join(root, 'clone.css'), 'utf8');

  const relFiles = await walk(source);
  for (const rel of relFiles) {
    const posix = rel.split('\\').join('/');
    if (KEEP_IN_TARGET.has(posix)) continue;

    const from = join(source, rel);
    const to = join(root, rel);
    const info = await stat(from);
    if (!info.isFile()) continue;

    await mkdir(join(to, '..'), { recursive: true });
    const isText = /\.(html?|css|js|mjs|json|md|svg|txt)$/i.test(rel);
    if (isText) {
      const text = brand(await readFile(from, 'utf8'));
      await writeFile(to, text, 'utf8');
    } else {
      await cp(from, to);
    }
    console.log('sync', posix);
  }

  let js = brand(await readFile(join(root, 'clone.js'), 'utf8'));
  let css = brand(await readFile(join(root, 'clone.css'), 'utf8'));

  js = mergeConstBlock(js, backupJs);
  if (isLegacyMeter(js)) {
    console.log('Preserving SVG articulation meter from current SleepSoul tree');
    for (const name of PRESERVE_FUNCTIONS) {
      const fn = extractFunction(backupJs, name);
      if (fn) js = replaceOrInsertFunction(js, name, fn);
    }
    js = patchRouteRenderer(js, backupJs);
    js = patchRenderRouteHome(js, backupJs);
  } else {
    for (const name of PRESERVE_FUNCTIONS) {
      const fn = extractFunction(backupJs, name);
      if (fn && !extractFunction(js, name)) {
        js = replaceOrInsertFunction(js, name, fn);
      }
    }
    if (!js.includes("page === 'product-cro'")) js = patchRouteRenderer(js, backupJs);
  }

  css = mergeArticulationCss(css, backupCss);

  await writeFile(join(root, 'clone.js'), js, 'utf8');
  await writeFile(join(root, 'clone.css'), css, 'utf8');

  console.log('\nSync complete. Next: npm run build && npm test');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

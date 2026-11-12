import { cp, readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const source = process.env.IMPORT_SOURCE;

if (!source) {
  console.error('Set IMPORT_SOURCE to the root of an Ultramatic tree (e.g. your local clone).');
  process.exit(1);
}

const files = ['clone.js', 'clone.css', 'site-template.html', 'scripts/build-clone.mjs'];

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
  [/sleepsoul-cart-count/g, 'sleepsoul-cart-count'],
];

async function brandedCopy(rel) {
  const from = join(source, rel);
  const to = join(root, rel);
  await access(from);
  let text = await readFile(from, 'utf8');
  for (const [pattern, value] of replacements) {
    text = text.replace(pattern, value);
  }
  await writeFile(to, text, 'utf8');
  console.log('Wrote', rel);
}

for (const rel of files) {
  await brandedCopy(rel);
}

console.log('Import complete. Run: npm run build && npm test');

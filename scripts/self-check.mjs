import { readFile } from 'node:fs/promises';

const [html, css, js] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../clone.css', import.meta.url), 'utf8'),
  readFile(new URL('../clone.js', import.meta.url), 'utf8'),
]);

for (const value of [html, css, js]) if (!value.length) throw new Error('Generated clone artifact is empty');
for (const marker of ['Made to rise.', 'Find Your Bed', 'articulation-meter', 'SleepSoul']) {
  if (!html.includes(marker)) throw new Error(`Missing prototype marker: ${marker}`);
}
if (!css.includes('--nightfall')) throw new Error('SleepSoul design tokens missing');
for (const marker of ['renderRoute', 'sleepsoul-hero.mp4', 'sleepsoul-system-4k', 'renderReviewBento', 'home-choice-grid', 'needs-disclosure', 'delivery-empty', 'renderPdpCro', 'meterMarkup', 'data-bed-head']) {
  if (!js.includes(marker)) throw new Error(`Missing interaction marker: ${marker}`);
}
if (!css.includes('Poppins') || !css.includes('home-choice-grid') || !css.includes('icon-cart')) throw new Error('Homepage readability system missing');
console.log('self-check: SleepSoul shell, focused homepage choices, progressive disclosure, empty states, video hero, and review bento are present');

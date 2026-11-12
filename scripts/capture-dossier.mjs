import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = process.env.PROJECT_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs', 'dossier');
const base = process.env.SITE_URL || 'http://127.0.0.1:3000';

async function shot(page, name, options = {}) {
  const path = join(outDir, name);
  await page.screenshot({ path, ...options });
  return path;
}

async function scrollReveal(page, selector, waitMs = 1100) {
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(waitMs);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });

  await shot(page, '01-home-hero-header.png', { clip: { x: 0, y: 0, width: 1440, height: 720 } });
  await shot(page, '02-home-full-page.png', { fullPage: true });

  await scrollReveal(page, '#why-sleepsoul');
  await shot(page, '03-gsap-reveal-need-cards.png', {
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });

  await scrollReveal(page, '.solutions');
  await shot(page, '04-gsap-reveal-solution-grid.png');

  await scrollReveal(page, '[data-motion-scene]', 1400);
  await page.locator('[data-motion-scene]').screenshot({ path: join(outDir, '05-gsap-motion-scene.png') });

  await scrollReveal(page, '.engineering-visual');
  await page.locator('[data-hotspot="pivot"]').click();
  await shot(page, '06-engineering-hotspots.png');

  await scrollReveal(page, '[data-system-stage]');
  await page.locator('[data-hero-hotspot="base"]').click();
  await page.waitForTimeout(500);
  await page.locator('[data-hero-panel]').screenshot({ path: join(outDir, '07-gsap-hero-detail-panel.png') });
  await page.getByRole('tab', { name: 'Zero-G' }).click();
  await page.waitForTimeout(350);
  await page.locator('[data-articulation]').screenshot({ path: join(outDir, '08-articulation-meter-zero-g.png') });
  await page.locator('[data-hero-close]').click();
  await page.waitForTimeout(350);

  await scrollReveal(page, '.review-bento');
  await shot(page, '09-review-bento.png');

  await page.goto(`${base}/find-your-bed/`, { waitUntil: 'networkidle' });
  await shot(page, '10-find-your-bed-full.png', { fullPage: true });

  await page.goto(`${base}/shop/adjustable-beds/`, { waitUntil: 'networkidle' });
  await shot(page, '11-shop-adjustable-beds-full.png', { fullPage: true });

  await browser.close();
  console.log(`Dossier captures written to ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

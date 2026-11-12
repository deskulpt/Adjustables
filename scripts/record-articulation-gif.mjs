import { mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

const root = process.env.PROJECT_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const framesDir = join(root, 'docs', 'screenshots', '_articulation-frames');
const outGif = join(root, 'docs', 'screenshots', 'articulation-meter.gif');
const base = process.env.SITE_URL || 'http://127.0.0.1:3000';

async function main() {
  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 420 } });
  await page.goto(`${base}/#articulation-demo`, { waitUntil: 'networkidle' });
  await page.locator('#articulation-demo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const tabs = ['Flat', 'TV', 'Zero-G', 'Anti-Snore'];
  let frame = 0;

  for (let cycle = 0; cycle < 2; cycle += 1) {
    for (const tab of tabs) {
      await page.getByRole('tab', { name: tab }).click();
      await page.waitForTimeout(950);
      const shot = join(framesDir, `frame-${String(frame).padStart(3, '0')}.png`);
      await page.locator('#articulation-demo .articulation-meter').screenshot({ path: shot });
      frame += 1;
    }
  }

  await browser.close();

  execSync(
    `ffmpeg -y -framerate 1 -i "${framesDir}/frame-%03d.png" -vf "fps=6,scale=680:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outGif}"`,
    { stdio: 'inherit' },
  );

  console.log(`Wrote ${outGif}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

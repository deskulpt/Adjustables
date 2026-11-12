# Ultramatic → SleepSoul sync

## What we compared (Nov 2026)

| Source | Path / note |
|--------|-------------|
| **SleepSoul (this repo, `main`)** | `deskulpt/Adjustables` — current production prototype |
| **Archived Ultramatic (Aug 2026)** | `ultramatic-main.zip` on branch `deskulpt-patch-1` |
| **Your local Ultramatic** | `/Users/aloke/Repositories/Ultramatic/ultramatic` — **not visible to Cloud Agents** unless pushed or uploaded |

## Verdict

**`main` already supersedes the archived zip** with the same product goals as [HamzaIkhurram/ultramatic PR #2](https://github.com/HamzaIkhurram/ultramatic/pull/2), plus post-PR fixes:

| Area | Archived Ultramatic zip | SleepSoul `main` |
|------|-------------------------|------------------|
| Articulation | CSS `bed-part` divs + `--head-angle` | **SVG split base**, 4 joints, GSAP rotation |
| Brand | Ultramatic assets/copy | **SleepSoul** (no `ultramatic` in app sources) |
| Cart nav | Text “Cart” | **Icon cart** + `aria-label` sync |
| Trust strip | Static “82” marks | Maple + **dynamic years since 1982** + line icons |
| Sleep Better | Text-only editorial cards | **Image editorial cards** |
| CRO PDP | Not present | `/products/postureplus-4-5-cro/` |
| GIF / dossier | Not present | `articulation-meter.gif`, `docs/dossier/` |

**Do not replace `clone.js` / `clone.css` from the old zip** — that would regress the articulation meter.

## Import your local Ultramatic (when newer than archive)

1. From your Mac, push or upload the tree (e.g. zip to `deskulpt-patch-1`, fork `deskulpt/ultramatic`, or attach in chat).
2. On this repo:

```bash
export IMPORT_SOURCE=/path/to/ultramatic   # your extracted tree
node scripts/import-ultramatic.mjs
npm run build && npm test
```

The script copies **core sources only** (`clone.js`, `clone.css`, `site-template.html`, `scripts/build-clone.mjs`) and applies **SleepSoul branding** (names, assets, URLs). Review the diff before commit.

3. Regenerate marketing assets:

```bash
npm start   # separate terminal
PROJECT_ROOT=$PWD node scripts/record-articulation-gif.mjs
```

## Branding rules (only change when importing)

| Ultramatic | SleepSoul |
|------------|-----------|
| `Ultramatic` | `SleepSoul` |
| `ultramatic` | `sleepsoul` |
| `ultramaticsleep.com` | `sleepsoulsleep.com` |
| `why-ultramatic` | `why-sleepsoul` |
| `/assets/ultramatic-*` | `/assets/sleepsoul-*` (files must exist under `public/assets/`) |

Research paths under `docs/research/eightsleep/` are intentionally **not** imported.

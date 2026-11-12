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

1. **Push your local latest** (the folder Cloud Agents cannot read on your Mac):

```bash
cd /Users/aloke/Repositories/Ultramatic/ultramatic
git init   # if needed
git remote add adjustables git@github.com:deskulpt/Adjustables.git
git checkout -b cursor/ultramatic-source-26d5
# copy or rsync your site files into the Adjustables layout, or push ultramatic as a subfolder commit
git push adjustables HEAD:cursor/ultramatic-source-26d5
```

Or upload a fresh **`ultramatic-local.zip`** on branch `deskulpt-patch-1` (replace the Aug 2026 archive).

2. On the agent VM (or locally in this repo):

```bash
export IMPORT_SOURCE=/path/to/your/latest/ultramatic
npm run sync:ultramatic
npm run build && npm test
```

`sync-from-source.mjs` copies **all pages and assets**, applies **SleepSoul branding**, and **keeps** SleepSoul-only work (SVG articulation meter, CRO PDP, dossier, GIF tooling). The older `import-ultramatic.mjs` still updates only the four core source files.

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

# SleepSoul

**SleepSoul** is a premium static web prototype for adjustable sleep systems—a full-funnel marketing and discovery experience with shop flows, education content, consultation booking, and mobile-first layouts inspired by modern sleep-commerce patterns.

This repository is **proprietary**. The concept, visual theme, page architecture, and front-end implementation are **available for purchase** (licensing and transfer inquiries: contact the repository owner).

## Highlights

- Multi-page static site (home, shop categories, product detail, sleep education, showroom, cart, and support pages)
- Shared shell template, design tokens, and interactive homepage sections (articulation meter, fit check, hotspots)
- Asset pipeline and local static server for development and QA
- Research and design-reference docs under `docs/`
- **Project dossier** (objectives, GSAP modules, full-page captures): [docs/PROJECT_DOSSIER.md](docs/PROJECT_DOSSIER.md)

## License

**Private / all rights reserved.** No permission is granted to copy, redistribute, or use this codebase or creative assets without a separate written agreement. Purchasing a license grants usage rights as defined in that agreement.

## Local development

```bash
npm install   # no dependencies required; scripts use Node built-ins
npm start     # http://localhost:3000
npm test      # structural self-check
npm run build # regenerate pages from templates
```

## Preview (local smoke test)

Quick captures (1440×900): [docs/screenshots/](docs/screenshots/).

**Full-length + GSAP interaction dossier** (updated after `main` merge): [docs/dossier/](docs/dossier/) — see [PROJECT_DOSSIER.md](docs/PROJECT_DOSSIER.md) for objectives, design process, and motion module map.

## Project structure

| Path | Purpose |
|------|---------|
| `index.html`, `*/index.html` | Published pages |
| `site-template.html`, `clone.js`, `clone.css` | Shared layout and homepage modules |
| `public/assets/` | Brand imagery and media |
| `scripts/` | Dev server, build, and QA scripts |
| `docs/research/` | Page specs and behavior notes |

## Commercial use

The SleepSoul **concept and theme** (copy structure, visual language, interaction patterns, and page set) may be licensed for your brand or product line. This repo is intended as a demonstrable, runnable package for evaluation—not an open-source drop.

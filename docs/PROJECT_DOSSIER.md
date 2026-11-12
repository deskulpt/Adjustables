# SleepSoul — project dossier

Documentation for the **adjustable beds & home sleep furniture** theme: objectives, design process, technical framework, and motion modules (GSAP + progressive enhancement).

**Status:** Verified on `main` after merge (local `npm start`, HTTP 200, `npm test` pass).  
**Captures:** [docs/dossier/](dossier/) (1440×900 desktop, full-page and interaction states).

---

## 1. Project objectives

SleepSoul targets a **high-consideration purchase** (adjustable base, mattress, lift chair, Hi-Low) where customers need:

1. **Need-first navigation** — start from life situations (comfort, mobility, caregiving), not SKUs.
2. **Education without jargon** — articulation, zero-gravity, flex rating, and delivery explained in plain language.
3. **Trust & service** — Canadian heritage, phone/showroom, fitting flows, and reviews by motivation.
4. **Premium but warm aesthetic** — calm linen/nightfall palette, serif headings, engineering credibility without clinical coldness.
5. **Runnable demo** — static hosting, no framework lock-in, clear build path for a acquirer or license buyer.

The theme is suitable for **any adjustable-bed or sleep-system retailer** that wants a modern commerce story without rebuilding UX from scratch.

---

## 2. Design process

| Phase | Output | Location |
|--------|--------|----------|
| **Research** | Page topology, behavior notes, reference captures | `docs/research/`, `docs/design-references/` |
| **Spec** | Home, accessories, pod-cover component specs | `docs/research/components/*.spec.md` |
| **Design tokens** | Color, type, spacing, motion easing | `clone.css` (`:root`, `--nightfall`, `--lamplight`, `--ease-engineering`) |
| **Shell** | Global header/footer, mega menu, search, JSON-LD | `site-template.html` |
| **Route system** | 27+ pages from one template | `scripts/build-clone.mjs` |
| **Brand** | SleepSoul SVG wordmark + favicon | `public/assets/sleepsoul-logo*.svg`, `sleepsoul-mark.svg` |
| **QA** | Structural self-check | `scripts/self-check.mjs` |

**Visual language**

- **Typography:** Poppins (UI), large editorial headings, eyebrow labels for section rhythm.
- **Imagery:** Hero video loop, 4K system shots, lifestyle/therapy/independence story cards.
- **Layout:** 1320px container, bento review grid, overlapping hero follow-up, dark engineering band.

---

## 3. Technical framework

```
site-template.html  ──build──►  */index.html  (static routes)
        │                              │
        ├── clone.css  (tokens + layout + motion baseline styles)
        └── clone.js   (route render + init* modules)

public/assets/  ◄── served at /assets/*  via scripts/server.mjs
```

| Layer | Role |
|--------|------|
| **Static HTML** | Deploy anywhere (CDN, object storage, Render static site). |
| **`clone.js` IIFE** | Client router by `data-page`; injects homepage/shop/PDP/finder markup. |
| **Node tooling** | `server.mjs` (dev), `build-clone.mjs` (regenerate), `self-check.mjs` (smoke). |
| **GSAP 3.12** | Loaded deferred from jsDelivr; used when `prefers-reduced-motion` is off. |
| **IntersectionObserver** | Triggers reveals and motion scene; CSS fallbacks if GSAP absent. |

No bundler required for production; optional Playwright script for marketing captures (`scripts/capture-dossier.mjs`).

---

## 4. GSAP & motion modules

GSAP is **additive** — core UX works with CSS transitions and `.is-visible` classes.

### Module: `initReveals()` (`clone.js`)

- **Selectors:** `[data-reveal]`, optional `data-reveal="delay-1|2"`.
- **Trigger:** `IntersectionObserver` (threshold `0.14`).
- **GSAP:** `gsap.to(el, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' })`.
- **Capture:** [03-gsap-reveal-need-cards.png](dossier/03-gsap-reveal-need-cards.png), [04-gsap-reveal-solution-grid.png](dossier/04-gsap-reveal-solution-grid.png).

### Module: motion scene (`[data-motion-scene]`)

- **Purpose:** “Precision in motion” — staggered cards + vertical axis markers (bed-as-animation metaphor).
- **GSAP:** Staggered `opacity`/`y` on `.motion-card`; `scaleY` on `.motion-marker` (`power3.out`).
- **Capture:** [05-gsap-motion-scene.png](dossier/05-gsap-motion-scene.png).

### Module: `initHeroPanels()` (system explorer)

- **Trigger:** `[data-hero-hotspot]` on homepage system stage.
- **GSAP:** Panel open `fromTo` opacity `0.42s power2.out`; close `power2.in` 0.2s.
- **Capture:** [07-gsap-hero-detail-panel.png](dossier/07-gsap-hero-detail-panel.png).

### Module: articulation meter (`initMeters()`)

- **CSS hinge model** — head/foot planks pivot from a center waist line on a flat baseline; four presets (Flat, TV, Zero-G, Anti-Snore).
- **GSAP** — tweened `--head-angle` / `--foot-angle` with `power2.inOut` when presets change (reduced-motion uses instant CSS).
- **Teaching interaction** for adjustable-bed value prop.
- **Capture:** [08-articulation-meter-zero-g.png](dossier/08-articulation-meter-zero-g.png).

### Other interaction modules (no GSAP)

| Init | Behavior |
|------|-----------|
| `initHotspots()` | Engineering callouts on 4K base image |
| `initFitChecks()` | Mattress compatibility helper |
| `initFinder()` | Five-question guided path |
| `initDelivery()` | Postal empty → result state |
| `initFilters()` | Product/review need filters |

Engineering hotspots: [06-engineering-hotspots.png](dossier/06-engineering-hotspots.png).

---

## 5. Full-page captures (post–`main` merge)

| # | Description | File |
|---|-------------|------|
| 01 | Hero + SVG header | [01-home-hero-header.png](dossier/01-home-hero-header.png) |
| 02 | **Full homepage scroll** | [02-home-full-page.png](dossier/02-home-full-page.png) |
| 09 | Review bento grid | [09-review-bento.png](dossier/09-review-bento.png) |
| 10 | Find Your Bed funnel | [10-find-your-bed-full.png](dossier/10-find-your-bed-full.png) |
| 11 | Shop · adjustable beds | [11-shop-adjustable-beds-full.png](dossier/11-shop-adjustable-beds-full.png) |

---

## 6. Regenerating captures

With the dev server running (`npm start`):

```bash
# One-time: install Playwright in a throwaway dir or project devDeps
PROJECT_ROOT=$PWD node scripts/capture-dossier.mjs
```

Writes to `docs/dossier/`. Set `SITE_URL` if not using port 3000.

---

## 7. License & sale

Proprietary — see root [README.md](../README.md). The **theme, motion system, copy architecture, and asset pack** are offered as a licensable package for adjustable-bed and home medical sleep retailers.

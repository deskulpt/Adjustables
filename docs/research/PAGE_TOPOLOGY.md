# Eight Sleep Canada page topology

The implementation keeps one shared visual shell and three route snapshots. Each snapshot is generated from the rendered DOM so the original class structure, CSS hooks, media, card variants, and text remain intact.

## Shared fixed layers

1. Promo bar (`SIGN UP FOR $100 OFF THE POD →`), fixed at the top.
2. Navigation header, fixed over the hero on `/` and in normal white mode on inner pages.
3. Floating chat launcher, fixed lower-right.
4. Main page content.
5. Footer and hidden cookie-consent structures.

## `/ca/` home

1. `Pod5Hero_container`: full-bleed bedroom hero, headline, `Discover the Pod` CTA.
2. Trust strip: risk-free trial, shipping/returns, warranty.
3. `PodDoesNotReplaceBed_section`: sleep-system introduction.
4. `TempElevationSound_container`: Temperature, Elevation, Sound feature states.
5. Sleep-challenge card grid: Couples, Menopausal Women, Wellness Seekers, Hot Sleepers, Everyday Athletes, Snorers.
6. Best-sleep proof section: four outcome metrics.
7. Driven-by-ambition/science section with media cards.
8. Member stories section with portraits and quotes.
9. Customer reviews tablist and review card panels.
10. Scientific Advisory Board profiles.
11. Closing scroll-sequence CTA: `Sleep changed. Life changed.` / `Shop now`.
12. Footer.

Interaction model: scroll-triggered reveals plus click-driven feature/review tabs, with lazy-loaded media and a fixed shell.

## `/ca/pod-cover`

1. Product hero: `Pod 5`, purchase/trial strip, `Sleep the way you were meant to`, `Shop the Pod`, video panel.
2. Whole-bed Autopilot system: Hub, Cover, Base, Blanket, Pillow Cover cards.
3. Autopilot plan/add-on callouts.
4. Two-sleeper personalization section.
5. Temperature section and cooling/warming card group.
6. Immersive temperature, soundscapes, elevation, alarms, and sleep-metrics sections.
7. Health-check / biometric insights section.
8. Pod 5 user story and night-on-Pod timeline.
9. Closing CTA and footer.

Interaction model: scroll-triggered reveals/media plus click/drag card-swiper groups and video controls.

## `/ca/accessories`

1. Shared promo/navigation shell.
2. Accessories heading and mobile filter control.
3. Product grid: Pod Pillow Cover, Base, Blanket, Pillow Cover, with image, compatibility badge, description, price, and `Shop now` CTA.
4. Product detail/benefit content blocks.
5. Footer.

Interaction model: responsive grid, product links, mobile filter control, hover states, and scroll reveals.

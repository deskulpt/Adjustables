# Eight Sleep Canada behavior notes

Captured from the rendered pages at 1440px × 900px and 390px × 844px.

## Shared shell

- The page uses a fixed `header` with `z-index: 301`; its DOM height is `0px` because the visible promo/navigation bars are fixed descendants.
- Body typography is `NeueMontreal, "NeueMontreal Fallback"`, `17px / 25.5px`, white background, black text.
- The desktop promo bar is blue (`rgb(64, 95, 127)` in the screenshot), 42px tall, centered uppercase copy at `12px`, `500`, `1.5px` letter spacing.
- Desktop navigation is a translucent rounded panel over the homepage hero and a white 70px-ish row on inner pages. It contains left links, centered Eight Sleep logo, right login/region/cart/shop controls.
- Mobile navigation collapses to a hamburger, compact logo, chat icon, Canada selector, and black `Shop the Pod` button. Desktop links disappear below the mobile breakpoint.
- CTA controls use black or white rounded rectangles with `12px–17px` Neue Montreal text. Links and buttons have hover transitions supplied by the captured site CSS.
- The fixed chat launcher appears in the lower-right corner on all three routes.

## Motion and state

- Elements with the `type_animated` class are initially rendered with inline `opacity: 0` and `transform: translate(0px, 30px)`, then revealed as they enter the viewport by the original client animation layer.
- The local shell preserves the original Next client chunks and adds an `IntersectionObserver` fallback so rendered snapshots still reveal on scroll if hydration is unavailable.
- Home temperature/elevation/sound content is a stateful navigation group. The visible labels are `Temperature`, `Elevation`, and `Sound`; the underlying page includes corresponding image/video panels.
- Home customer reviews uses a tablist with `Hot sleepers`, `Couples`, `Fitness enthusiasts`, and `Troubled sleepers`; the selected tab owns a visible `tabpanel` and the other panels are hidden.
- The home outcome-metrics scene (`The best sleep you've ever had`) uses four stat containers with `--height` values `1`, `0.44`, `0.85`, and the final metric’s captured value. Cards and 40 axis ticks enter from `translateY(100%)`/`opacity: 0`; the local clone staggers them by 28ms and draws each card’s vertical sceptre from `scaleY(0)` to `scaleY(1)`.
- Product detail pages contain card-swiper groups and scroll-led sections. The original markup carries the cards and state attributes; captured client chunks remain available for the interactions.
- No scroll snapping was detected in the captured page shell. The page uses native scrolling plus viewport-triggered reveal and media lazy-loading.

## Responsive evidence

- Home desktop: hero image fills the viewport under the promo/navigation shell; headline sits at approximately `64px` left and `344px` from the top, with a white CTA below.
- Home mobile: hero becomes a tall portrait crop; headline centers near the lower half and navigation collapses to the compact shell.
- Pod Cover desktop: centered title block begins around `y=224px`, then a rounded media panel begins around `y=535px`.
- Pod Cover mobile: title becomes two lines, body copy narrows to the viewport, CTA remains centered, and the media panel becomes a 350px-wide rounded card.
- Accessories desktop: the `Accessories` heading sits at `x=64px`, `y=240px`; product cards use a three-column grid with 24px-ish gutters.
- Accessories mobile: heading and filter control sit above a two-column product grid; cards stack their copy and CTA vertically and keep large rounded white surfaces.

## Source evidence

- Rendered HTML and inventories: `docs/research/eightsleep/`.
- Desktop/mobile references: `docs/design-references/eightsleep-*-desktop-top.png` and `*-mobile-top.png`.

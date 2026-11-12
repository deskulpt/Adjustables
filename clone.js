(() => {
  const page = document.documentElement.dataset.page || 'home';
  const app = document.querySelector('#app');
  const year = document.querySelector('[data-year]');
  const asset = (name) => '/assets/' + name;
  const motionEnabled = () => Boolean(window.gsap) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FOUNDING_YEAR = 1982;
  const yearsInBusiness = () => Math.max(0, new Date().getFullYear() - FOUNDING_YEAR);

  const states = {
    flat: { label: 'FLAT', head: 0, foot: 0, headValue: '0°', footValue: '0°', copy: 'A familiar starting point for sleeping, stretching out or making the bed.' },
    tv: { label: 'TV / READ', head: 34, foot: 8, headValue: '34°', footValue: '8°', copy: 'Raise your upper body and legs for a more supported angle while reading or watching television.' },
    zero: { label: 'ZERO GRAVITY', head: 42, foot: 12, headValue: '42°', footValue: '12°', copy: 'Raise the knees and upper body to redistribute pressure and create a more supported resting position.' },
    snore: { label: 'ANTI-SNORE', head: 18, foot: 0, headValue: '18°', footValue: '0°', copy: 'A gentle upper-body lift that can make a side of the bed feel more comfortable for rest.' }
  };
  const products = {
    posture: { name: 'PosturePlus 4.5', family: 'THERAPY', image: 'postureplus-package.webp', path: '/products/postureplus-4-5/', price: '$1,098', text: 'Independent adjustment with more control over position, support and partner comfort.', tags: ['ZERO-G', 'MASSAGE', 'DUAL AVAILABLE'], needs: ['all', 'back', 'reflux', 'snoring'] },
    supreme: { name: 'Supreme', family: 'THERAPY', image: 'supreme-base.jpg', path: '/products/postureplus-4-5/', price: '$3,004', text: 'Neck-Tilt™ and Lumbar-Booster™ controls for people who want a more tailored resting position.', tags: ['NECK-TILT', 'LUMBAR', 'WALL-HUGGING'], needs: ['all', 'back', 'reflux'] },
    solace: { name: 'Solace', family: 'LIFESTYLE', image: 'solace-package.jpg', path: '/products/postureplus-system/', price: '$805', text: 'A simple way to bring adjustable comfort into everyday reading, relaxing and sleep.', tags: ['BLUETOOTH', 'USB', 'HEAD + FOOT'], needs: ['all', 'comfort', 'snoring'] },
    hilow: { name: 'Hi-Low & Indulgence', family: 'INDEPENDENCE', image: 'hi-low-bed.jpg', path: '/sleep-better/independence/', price: 'Talk to us', text: 'A complete system that changes both your resting angle and the height of the bed.', tags: ['HEIGHT ADJUSTMENT', 'TRANSFER SUPPORT', 'FITTING'], needs: ['all', 'mobility'] },
    mattress: { name: 'PurCarbon 11', family: 'MATTRESS', image: 'purcarbon-mattress.jpg', path: '/shop/mattresses/', price: 'Explore fit', text: 'A mattress option to discuss when you want an adjustable-compatible sleep surface.', tags: ['FLEX RATING', 'PLUSH / FIRM', 'COMPATIBILITY'], needs: ['all', 'comfort', 'back'] },
    chair: { name: 'Vermont Lift Chair', family: 'INDEPENDENCE', image: 'lift-chair.jpg', path: '/shop/lift-chairs/', price: 'Explore fit', text: 'A supportive lift chair for sitting, resting and making the transition to standing easier.', tags: ['ZERO-G', 'REMOTE', 'HOME COMFORT'], needs: ['all', 'mobility'] }
  };

  const join = (parts) => parts.join('');
  const tagList = (tags) => tags.map((tag) => '<span>' + tag + '</span>').join('');
  const button = (label, href, variant) => '<a class="button button-' + (variant || 'dark') + '" href="' + href + '">' + label + ' <span>→</span></a>';
  const textLink = (label, href) => '<a class="text-link" href="' + href + '">' + label + ' <span>→</span></a>';
  const reveal = (content, delay) => '<div data-reveal="' + (delay || '') + '">' + content + '</div>';

  function meterMarkup() {
    return [
      '<div class="articulation-meter" data-articulation tabindex="0" aria-label="Adjustable bed articulation meter. Use the arrow keys to change position.">',
      '<div class="meter-header"><p>ARTICULATION METER</p><strong data-meter-label>FLAT</strong></div>',
      '<div class="bed-diagram" data-bed-diagram>',
      '<svg class="bed-diagram-svg" viewBox="0 0 300 124" width="100%" height="124" aria-hidden="true" focusable="false">',
      '<line class="bed-floor" x1="12" y1="92" x2="288" y2="92"/>',
      '<text class="bed-floor-label" x="150" y="118" text-anchor="middle">Base deck (middle stays flat)</text>',
      '<rect class="bed-base-deck" x="108" y="84" width="84" height="8" rx="1"/>',
      '<rect class="bed-middle" data-bed-middle x="108" y="76" width="84" height="16" rx="2"/>',
      '<g transform="translate(108 92)">',
      '<g class="bed-head-group" data-bed-head transform="rotate(0)">',
      '<path class="bed-mattress" d="M -84 0 H 0 V -16 H -84 Z"/>',
      '<circle class="bed-joint bed-joint-head" cx="-84" cy="-8" r="4.5"/>',
      '<circle class="bed-joint bed-joint-hinge" cx="0" cy="0" r="5.5"/>',
      '</g>',
      '</g>',
      '<g transform="translate(192 92)">',
      '<g class="bed-foot-group" data-bed-foot transform="rotate(0)">',
      '<path class="bed-mattress" d="M 0 0 H 84 V -16 H 0 Z"/>',
      '<circle class="bed-joint bed-joint-foot" cx="84" cy="-8" r="4.5"/>',
      '<circle class="bed-joint bed-joint-hinge" cx="0" cy="0" r="5.5"/>',
      '</g>',
      '</g>',
      '</svg>',
      '</div>',
      '<div class="meter-readout"><span>HEAD <strong data-head-angle>0°</strong></span><span>FOOT <strong data-foot-angle>0°</strong></span></div>',
      '<div class="meter-tabs" role="tablist" aria-label="Bed positions">',
      '<button class="meter-tab" type="button" role="tab" data-meter-state="flat" aria-selected="true">Flat</button>',
      '<button class="meter-tab" type="button" role="tab" data-meter-state="tv" aria-selected="false">TV</button>',
      '<button class="meter-tab" type="button" role="tab" data-meter-state="zero" aria-selected="false">Zero-G</button>',
      '<button class="meter-tab" type="button" role="tab" data-meter-state="snore" aria-selected="false">Anti-Snore</button>',
      '</div>',
      '<p class="meter-copy" data-meter-copy>' + states.flat.copy + '</p>',
      '</div>'
    ].join('');
  }

  function productCard(product, delay) {
    return [
      '<article class="product-card" data-product data-needs="' + product.needs.join(' ') + '" data-reveal="' + (delay || '') + '">',
      '<a href="' + product.path + '" class="product-media" aria-label="Explore ' + product.name + '"><span class="product-family">' + product.family + '</span><img src="' + asset(product.image) + '" alt="' + product.name + ' adjustable sleep product"></a>',
      '<div class="product-body"><span class="eyebrow">' + product.family + '</span><h3>' + product.name + '</h3><p>' + product.text + '</p><div class="product-tags">' + tagList(product.tags) + '</div><div class="product-price">' + product.price + ' <span>starting point · verify live</span></div>' + textLink('Explore', product.path) + '</div>',
      '</article>'
    ].join('');
  }

  function renderHome() {
    return join([
      '<section class="hero"><div class="container hero-shell">',
      '<div class="hero-copy"><span class="eyebrow">Canadian sleep engineering · Since 1982</span><h1>Made to <em>rise.</em></h1><p>Adjustable beds, mattresses and lift chairs designed around the way you sleep, move and live at home.</p><p class="hero-subline">Built for better nights — and easier mornings.</p><div class="hero-actions">', button('Find Your Bed', '/find-your-bed/', 'brass'), button('Talk to a specialist', '/book-a-consultation/', 'outline'), '</div><p class="hero-next-step">Five questions · no email required · a clearer place to start.</p></div>',
      '<div class="hero-visual"><div class="hero-image-frame"><video autoplay muted loop playsinline preload="auto" poster="' + asset('sleepsoul-hero.gif') + '" aria-label="SleepSoul adjustable bed moving through a calm bedroom scene"><source src="' + asset('sleepsoul-hero.mp4') + '" type="video/mp4"><img src="' + asset('sleepsoul-hero.gif') + '" alt="A modern bedroom with an adjustable SleepSoul sleep system articulating smoothly"></video><span class="hero-image-tag">A bed that moves around you</span></div><div class="hero-meter-wrap">' + meterMarkup() + '</div></div>',
      '</div></section>',
      '<section class="trust-strip"><div class="container trust-grid">',
      '<div class="trust-item"><span class="trust-mark trust-mark-maple" aria-hidden="true"><span class="icon icon-maple"></span></span><div><strong>Since ' + FOUNDING_YEAR + '</strong><span><span data-trust-years>' + yearsInBusiness() + '</span> years · Canadian experience</span></div></div>',
      '<div class="trust-item"><span class="trust-mark"><span class="icon icon-flag-ca" aria-hidden="true"></span></span><div><strong>Canadian company</strong><span>Designed around Canadian homes</span></div></div>',
      '<div class="trust-item"><span class="trust-mark"><span class="icon icon-truck" aria-hidden="true"></span></span><div><strong>Delivery &amp; setup</strong><span>Human installation support</span></div></div>',
      '<div class="trust-item"><span class="trust-mark"><span class="icon icon-person" aria-hidden="true"></span></span><div><strong>Real people</strong><span>Phone, video or showroom guidance</span></div></div>',
      '</div></section>',
      '<section class="section" id="why-sleepsoul"><div class="container"><div class="section-heading"><div><span class="eyebrow">Start with one question</span><h2>What would you like to change?</h2></div><p>Choose the closest starting point. You can always explore the details later.</p></div>',
      '<div class="home-choice-grid">',
      '<a class="need-card home-choice-card" href="/find-your-bed/?need=comfort" data-reveal><span class="need-number">01</span><div><h3>Sleep more comfortably</h3><p>Find better positions for back comfort, reflux, snoring and everyday rest.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card home-choice-card" href="/find-your-bed/?need=mobility" data-reveal="delay-1"><span class="need-number">02</span><div><h3>Move more comfortably</h3><p>Explore leg elevation, getting in and out of bed, and easier mornings.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card home-choice-card" href="/sleep-better/independence/" data-reveal="delay-2"><span class="need-number">03</span><div><h3>Choose for someone else</h3><p>Practical guidance for a parent, partner or the home you share.</p></div><span class="need-arrow">↗</span></a>',
      '</div>',
      '<details class="needs-disclosure"><summary><span>Looking for a specific reason?</span><span class="needs-disclosure-action">See more options <strong aria-hidden="true">+</strong></span></summary><div class="solve-grid solve-grid-secondary">',
      '<a class="need-card" href="/find-your-bed/?need=back"><span class="need-number">A</span><div><h3>Back &amp; joint comfort</h3><p>Explore positions and sleep systems designed around support and pressure distribution.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card" href="/find-your-bed/?need=reflux"><span class="need-number">B</span><div><h3>Reflux &amp; nighttime comfort</h3><p>Understand how elevation changes the way you rest.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card" href="/find-your-bed/?need=snoring"><span class="need-number">C</span><div><h3>Snoring &amp; partner sleep</h3><p>Discover independent adjustment and anti-snore positioning.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card" href="/find-your-bed/?need=back"><span class="need-number">D</span><div><h3>Circulation &amp; leg elevation</h3><p>Find a more supported way to settle in at the end of the day.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card" href="/sleep-better/independence/"><span class="need-number">E</span><div><h3>Getting in &amp; out of bed</h3><p>Explore height, transfer and setup conversations without the clinical feel.</p></div><span class="need-arrow">↗</span></a>',
      '<a class="need-card" href="/sleep-better/independence/"><span class="need-number">F</span><div><h3>Caring for a parent</h3><p>Practical guidance for making everyday movement easier at home.</p></div><span class="need-arrow">↗</span></a>',
      '</div></details></div></section>',
      '<section class="section solutions"><div class="container"><div class="section-heading"><div><span class="eyebrow">Three ways forward</span><h2>One bedroom. Different needs.</h2></div><p>A clearer starting point than model names — then the right product when you’re ready.</p></div><div class="solution-grid">',
      '<article class="solution-card solution-card-image" data-reveal><img src="' + asset('solace-package.jpg') + '" alt="SleepSoul adjustable sleep system for everyday comfort"><div class="solution-card-overlay"><span class="solution-index">01 · LIFESTYLE</span><h3>Comfort that moves with you.</h3><p>For reading, relaxing, television and everyday adjustable comfort.</p><div class="solution-list"><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Reading</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Relaxing</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>TV</span></div>', textLink('Explore Lifestyle', '/shop/adjustable-beds/'), '</div></article>',
      '<article class="solution-card solution-card-image" data-reveal="delay-1"><img src="' + asset('sleepsoul-system-4k.png') + '" alt="SleepSoul adjustable bed moving into a supported position"><div class="solution-card-overlay"><span class="solution-index">02 · THERAPY</span><h3>More control over how you rest.</h3><p>For back comfort, reflux, snoring and the positions you return to.</p><div class="solution-list"><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Position</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Pressure</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Independent sides</span></div>', textLink('Explore Therapy', '/shop/adjustable-beds/'), '</div></article>',
      '<article class="solution-card solution-card-image" data-reveal="delay-2"><img src="' + asset('hi-low-bed.jpg') + '" alt="SleepSoul Hi-Low bed supporting easier movement at home"><div class="solution-card-overlay"><span class="solution-index">03 · INDEPENDENCE</span><h3>Make everyday movement easier.</h3><p>For transfers, height adjustment, caregiver support and life at home.</p><div class="solution-list"><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Transfers</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Hi-Low</span><span class="solution-chip"><span class="icon icon-line" aria-hidden="true"></span>Home support</span></div>', textLink('Explore Independence', '/sleep-better/independence/'), '</div></article>',
      '</div></div></section>',
      '<section class="section engineering"><div class="container engineering-grid"><div class="engineering-copy" data-reveal><span class="eyebrow">Under the mattress</span><h2>A bed should do more than go up and down.</h2><p>We’ve spent decades thinking about what happens underneath the mattress — the motor, pivot geometry, controls and the small details that change how a bed feels in real life.</p>', textLink('See how SleepSoul bases are built', '/shop/adjustable-beds/'), '</div><div class="engineering-visual" data-reveal="delay-1"><img src="' + asset('sleepsoul-system-4k.png') + '" alt="Close view of an SleepSoul adjustable bed in a raised position"><div class="engineering-image-scrim"></div><button class="hotspot is-active" type="button" data-hotspot="motor" aria-label="Show motor and control details">+</button><button class="hotspot" type="button" data-hotspot="pivot" aria-label="Show pivot geometry details">+</button><button class="hotspot" type="button" data-hotspot="remote" aria-label="Show remote and presets details">+</button><div class="hotspot-label" data-hotspot-label><strong>Motor + control</strong>Quiet, considered movement from a system built to be used every day.</div></div></div></section>',
      '<section class="section-tight motion-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Precision in motion</span><h2>Notice what changes underneath.</h2></div><p>Scroll into the scene. Each marker and card arrives like a measured adjustment — the bed is the animation.</p></div><div class="motion-stage" data-motion-scene><div class="motion-card"><small>POSITION 01</small><strong>Head control</strong></div><div class="motion-card"><small>POSITION 02</small><strong>Independent sides</strong></div><div class="motion-card"><small>POSITION 03</small><strong>Leg elevation</strong></div><div class="motion-card"><small>POSITION 04</small><strong>Quiet lift</strong></div><div class="motion-floor"></div><div class="motion-axis"></div><span class="motion-marker marker-1"></span><span class="motion-marker marker-2"></span><span class="motion-marker marker-3"></span><span class="motion-marker marker-4"></span></div></div></section>',
      '<section class="section fit-section"><div class="container fit-grid"><div class="fit-copy" data-reveal><span class="eyebrow">SleepSoul Flex Rating</span><h2>The mattress matters just as much as the base.</h2><p>Not every mattress articulates equally. Start with what you already own and we’ll point you toward a sensible next step.</p><div class="flex-scale"><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar"></span></div><div class="flex-labels"><span>Limited articulation</span><span>Designed for deeper articulation</span></div></div><div class="fit-card" data-fitcheck data-reveal="delay-1"><h3>What mattress do you have?</h3><label for="home-mattress-type">Mattress type</label><select id="home-mattress-type" data-fit-type><option value="memory">Memory foam</option><option value="hybrid">Hybrid</option><option value="latex">Latex</option><option value="spring">Traditional innerspring</option><option value="unknown">I’m not sure</option></select><div class="fit-result"><span class="fit-status" data-fit-status></span><div><strong data-fit-title>LIKELY COMPATIBLE</strong><p data-fit-copy>Memory foam is usually a strong starting point for an adjustable base. Check the model details before purchase.</p></div></div><div style="margin-top:22px">', textLink('Check my mattress', '/products/postureplus-4-5/#fitcheck'), '</div></div></div></section>',
      '<section class="section review-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">From SleepSoul owners</span><h2>Why people chose SleepSoul.</h2></div><p>Real public reviews, presented around the reason someone started looking.</p></div><div class="review-filter" role="group" aria-label="Filter reviews"><button class="filter-pill" type="button" aria-pressed="true" data-review-filter="all">All stories</button><button class="filter-pill" type="button" aria-pressed="false" data-review-filter="back">Back comfort</button><button class="filter-pill" type="button" aria-pressed="false" data-review-filter="mobility">Mobility</button><button class="filter-pill" type="button" aria-pressed="false" data-review-filter="caregiver">Caregiver</button></div><div class="review-grid">',
      '<article class="review-card" data-review="mobility"><span class="review-stars">★★★★★</span><blockquote>“The installation guys were great.”</blockquote><div class="review-meta"><strong>Janet W. · St Thomas, ON</strong>Verified public review · Purchased for setup confidence</div></article>',
      '<article class="review-card" data-review="back"><span class="review-stars">★★★★★</span><blockquote>“I now sleep with more comfort.”</blockquote><div class="review-meta"><strong>Leeson T. · Merritt, BC</strong>Verified public review · PosturePlus · Back comfort</div></article>',
      '<article class="review-card" data-review="caregiver"><span class="review-stars">★★★★★</span><blockquote>“These beds came to my rescue.”</blockquote><div class="review-meta"><strong>Mr &amp; Mrs Amundumson · Little Smoky, AB</strong>Verified public review · Long-term home comfort</div></article>',
      '</div></div></section>',
      '<section class="section delivery-section"><div class="container delivery-grid"><div class="delivery-copy" data-reveal><span class="eyebrow">The last mile matters</span><h2>From our door to your bedroom.</h2><p>High-consideration furniture deserves a clear arrival plan. Start with your postal code and talk through the service level that fits your home.</p><form class="delivery-form" data-delivery-form><label for="postal-code">Enter postal code<input id="postal-code" name="postal" placeholder="M5V 2T6" autocomplete="postal-code"></label><button class="button button-brass" type="submit">Check</button></form></div><div class="delivery-details" data-delivery-details data-reveal="delay-1"><h3>Your setup, understood.</h3><div class="delivery-empty-state" data-delivery-empty><span class="empty-state-mark" aria-hidden="true">—</span><strong>Start with your postal code.</strong><p>We’ll show the delivery and setup conversation here.</p></div><div class="delivery-result" data-delivery-result hidden aria-live="polite"><div class="delivery-detail"><span>Estimated delivery</span><strong data-delivery-estimate>We’ll confirm options</strong></div><div class="delivery-detail"><span>Service level</span><strong>Talk with a specialist</strong></div><div class="delivery-detail"><span>Installation</span><strong>Options explained before checkout</strong></div><div class="delivery-detail"><span>Old-bed removal</span><strong>Ask about availability</strong></div></div></div></div></section>',
      '<section class="section service-section"><div class="container service-grid"><div class="service-image" data-reveal><span>Comfort should feel human.</span></div><div class="service-copy" data-reveal="delay-1"><span class="eyebrow">Human service</span><h2>Some questions are easier with a person.</h2><p>A sleep system can be a big decision. Talk it through with someone who understands products, measurements, delivery and setup.</p><div class="service-options"><div class="service-option"><strong>Call</strong><span>Talk now · 1-800-373-8887</span></div><div class="service-option"><strong>Video</strong><span>Book a virtual fitting</span></div><div class="service-option"><strong>Showroom</strong><span>Try the difference in person</span></div></div>', button('Book a fitting', '/book-a-consultation/', 'dark'), '</div></div></section>'
    ]);
  }

  function renderCollection(kind) {
    const copy = {
      adjustable: ['Adjustable comfort, built around what you need.', 'Explore by the problem you want to solve, then compare the controls that matter.'],
      mattress: ['A mattress that knows how to move.', 'Compatibility is a conversation between the surface and the base. Start with fit, feel and the way you sleep.'],
      system: ['Everything designed to move together.', 'Base, mattress and guidance in one clearer starting point.'],
      chair: ['A better place to sit, rest and rise.', 'Lift chairs that feel at home in the room — with a specialist when the details matter.'],
      mobility: ['Support for the way home really works.', 'Practical mobility products, explained with the same care as the sleep system.'],
      bedding: ['Finish the room around the system.', 'Bedding and accessories selected for comfort, compatibility and the way you use your space.'],
      parts: ['Keep your system moving.', 'Find the right part or ask a person before you order.']
    }[kind] || ['Products built around the way you live.', 'A calmer way to choose the next part of your sleep system.'];
    const list = kind === 'mattress' ? [products.mattress, products.posture, products.solace] : kind === 'system' ? [products.posture, products.solace, products.hilow] : kind === 'chair' ? [products.chair, products.hilow, products.solace] : kind === 'mobility' ? [products.hilow, products.chair, products.posture] : kind === 'bedding' ? [products.mattress, products.solace, products.posture] : [products.posture, products.supreme, products.solace];
    return [
      '<section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Shop by need · Shop by product</span><h1>' + copy[0] + '</h1><p>' + copy[1] + '</p></div><div class="page-hero-note">Start with your life, not a model number. Each product card gives you the job, the family and the next conversation.</div></div></section>',
      '<section class="filter-bar"><div class="container filter-bar-inner"><span>What are you looking for?</span><button class="filter-pill" type="button" aria-pressed="true" data-need-filter="all">Everyday comfort</button><button class="filter-pill" type="button" aria-pressed="false" data-need-filter="back">Back &amp; joint comfort</button><button class="filter-pill" type="button" aria-pressed="false" data-need-filter="reflux">Reflux / elevated sleep</button><button class="filter-pill" type="button" aria-pressed="false" data-need-filter="mobility">Getting in &amp; out</button></div></section>',
      '<section class="section-tight"><div class="container"><div class="section-heading"><div><span class="eyebrow">' + (kind === 'adjustable' ? 'Adjustable beds' : 'A considered shortlist') + '</span><h2>Choose the job first.</h2></div><p>Three options is enough to begin. Compare the differences, then talk with us if the decision needs context.</p></div><div class="collection-grid">' + list.map((product, index) => productCard(product, index ? 'delay-' + index : '')).join('') + '</div></div></section>',
      '<section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow">Need a second opinion?</span><h2>We can make the shortlist smaller.</h2></div><p>Find Your Bed asks five practical questions and explains the recommendation before asking for your email.</p><div>', button('Find Your Bed', '/find-your-bed/', 'light'), '</div></div></div></section>'
    ].join('');
  }

  function renderPdp(system) {
    const title = system ? 'PosturePlus sleep system' : 'PosturePlus 4.5';
    const family = system ? 'SLEEP SYSTEM' : 'THERAPY SERIES';
    return [
      '<section class="pdp-top"><div class="container pdp-layout"><div class="pdp-gallery" data-reveal><div class="pdp-main-image"><img data-gallery-main src="' + asset('postureplus-package.webp') + '" alt="SleepSoul PosturePlus adjustable sleep system in a bedroom"><span class="gallery-label">Built to move together</span></div><div class="gallery-thumbs"><button class="gallery-thumb" type="button" aria-current="true" data-gallery-src="' + asset('postureplus-package.webp') + '"><img src="' + asset('postureplus-package.webp') + '" alt="PosturePlus system view"></button><button class="gallery-thumb" type="button" aria-current="false" data-gallery-src="' + asset('supreme-base.jpg') + '"><img src="' + asset('supreme-base.jpg') + '" alt="Adjustable base detail"></button><button class="gallery-thumb" type="button" aria-current="false" data-gallery-src="' + asset('hi-low-bed.jpg') + '"><img src="' + asset('hi-low-bed.jpg') + '" alt="SleepSoul bed in a room"></button><button class="gallery-thumb" type="button" aria-current="false" data-gallery-src="' + asset('sleepsoul-hero.gif') + '"><img src="' + asset('sleepsoul-hero.gif') + '" alt="Adjustable bed articulating"></button></div></div>',
      '<div class="pdp-panel" data-reveal="delay-1"><span class="eyebrow">' + family + '</span><h1>' + title + '</h1><p>' + (system ? 'A base and mattress pairing selected to move together, with the fit decision made clearer from the start.' : 'A highly adjustable base for sleepers who want more control over position, support and partner comfort.') + '</p><div class="pdp-rating"><strong>★★★★★</strong><span>Public reviews · Talk to a specialist for fit</span></div><div class="purchase-card"><div class="purchase-row"><strong class="purchase-price">' + (system ? 'Explore fit' : '$1,098') + '</strong><span class="purchase-note">' + (system ? 'Base + mattress pairing' : 'TXL starting point · verify live') + '</span></div><label class="size-label">Choose size</label><div class="size-options" role="group" aria-label="Choose size"><button class="size-option" type="button" aria-pressed="false" data-size="Twin XL" data-price="1098">Twin XL</button><button class="size-option" type="button" aria-pressed="false" data-size="Double" data-price="1598">Double</button><button class="size-option" type="button" aria-pressed="true" data-size="Queen" data-price="1898">Queen</button><button class="size-option" type="button" aria-pressed="false" data-size="Dual Queen" data-price="2998">Dual Queen</button><button class="size-option" type="button" aria-pressed="false" data-size="King" data-price="2498">King</button><button class="size-option" type="button" aria-pressed="false" data-size="Split King" data-price="3198">Split King</button></div><div class="availability">In stock status shown as a prototype · confirm with SleepSoul</div><div class="purchase-actions">', button('Add to cart', '#', 'brass'), button('Talk to a specialist', '/book-a-consultation/', 'outline'), '</div><p class="purchase-help">Not sure this is the right base? <a href="/find-your-bed/">Find Your Bed in 5 Questions →</a></p><div class="trust-lines"><span>Fit guidance</span><span>Delivery conversation</span><span>Warranty details</span></div></div></div></div></section>',
      '<section class="section outcomes"><div class="container"><div class="section-heading"><div><span class="eyebrow">Before specifications</span><h2>What will this change for me?</h2></div><p>Start with the outcome, then open the technical details when they become useful.</p></div><div class="outcomes-grid"><article class="outcome"><span>01 · LOWER BACK</span><h3>Explore a more supported resting angle.</h3><p>Raise the upper body or legs independently instead of relying on stacked pillows.</p></article><article class="outcome"><span>02 · EVERYDAY COMFORT</span><h3>Find an angle that feels like yours.</h3><p>Save the positions you use for reading, relaxing or winding down.</p></article><article class="outcome"><span>03 · TWO PEOPLE</span><h3>Move without disturbing your partner.</h3><p>On compatible dual systems, each side can adjust independently.</p></article></div></div></section>',
      '<section class="section"><div class="container fit-grid"><div class="fit-copy"><span class="eyebrow">FitCheck</span><h2>Will your current mattress work?</h2><p>Tell us the basics and get a plain-language starting point before you buy.</p><div class="flex-scale"><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar is-active"></span><span class="flex-bar"></span></div><div class="flex-labels"><span>1 · limited</span><span>5 · deeper articulation</span></div></div><div class="fit-card" data-fitcheck><h3>FitCheck</h3><label for="pdp-mattress-type">Mattress type</label><select id="pdp-mattress-type" data-fit-type><option value="memory">Memory foam</option><option value="hybrid">Hybrid</option><option value="latex">Latex</option><option value="spring">Traditional innerspring</option><option value="unknown">I’m not sure</option></select><label for="pdp-thickness">Approximate thickness</label><select id="pdp-thickness" data-fit-type><option value="medium">8–12 inches</option><option value="thin">Under 8 inches</option><option value="thick">Over 12 inches</option></select><div class="fit-result"><span class="fit-status" data-fit-status></span><div><strong data-fit-title>LIKELY COMPATIBLE</strong><p data-fit-copy>Select your mattress details to see the starting explanation.</p></div></div></div></div></section>',
      '<section class="section specs"><div class="container spec-layout"><div><span class="eyebrow">Everything, measured</span><h2>Clear details when you need them.</h2><p style="color:var(--overcast)">The values below reflect the public catalogue language available in the prototype. Connect structured product metafields before launch.</p></div><table class="spec-table"><tbody><tr><th>Adjustments</th><td>Back &amp; head · optional neck / lumbar on Supreme</td></tr><tr><th>USB ports</th><td>4 USB ports on PosturePlus</td></tr><tr><th>Massage</th><td>Head &amp; foot massage on PosturePlus</td></tr><tr><th>Wall hugging</th><td>Not wall-hugging on PosturePlus · available on Supreme</td></tr><tr><th>Technology</th><td>Bluetooth app</td></tr><tr><th>Warranty</th><td>Public catalogue lists 25 years on PosturePlus</td></tr></tbody></table></div></section>',
      '<section class="section compare-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">How does it compare?</span><h2>See the differences that matter.</h2></div><p>Maximum three models. No green-tick soup.</p></div><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Feature</th><th>PosturePlus 4.5</th><th>Supreme</th><th>Solace</th></tr></thead><tbody><tr><td>Best for</td><td>More control</td><td>Tailored positions</td><td>Everyday comfort</td></tr><tr><td>Articulation</td><td><div class="silhouette"></div></td><td><div class="silhouette" style="transform:skewX(-15deg) scaleY(1.2)"></div></td><td><div class="silhouette" style="transform:skewX(-15deg) scaleY(.8)"></div></td></tr><tr><td>Neck tilt</td><td>—</td><td>Yes</td><td>—</td></tr><tr><td>Lumbar booster</td><td>—</td><td>Yes</td><td>—</td></tr><tr><td>Independent sides</td><td>Available</td><td>Available</td><td>Ask us</td></tr><tr><td>Height adjustment</td><td>—</td><td>—</td><td>—</td></tr></tbody></table></div></div></section>',
      '<section class="section-tight"><div class="container"><div class="section-heading"><div><span class="eyebrow">Complete the system</span><h2>Only what fits.</h2></div><p>One mattress, one protector and one sheet set is enough to finish the decision.</p></div><div class="collection-grid">' + productCard(products.mattress, '') + productCard(products.solace, 'delay-1') + productCard(products.hilow, 'delay-2') + '</div></div></section>'
    ].join('');
  }

  function renderPdpCro() {
    return [
      '<div class="pdp-promo-banner" data-reveal aria-label="Prototype promotion"><strong>Dream Comfort event</strong><span>Prototype promo callouts · verify live pricing before launch</span></div>',
      '<section class="pdp-top pdp-cro"><div class="container pdp-layout"><div class="pdp-gallery" data-reveal><div class="pdp-main-image"><img data-gallery-main src="' + asset('postureplus-package.webp') + '" alt="SleepSoul PosturePlus 4.5 adjustable base"><span class="gallery-label promo-ribbon">Therapy series · featured</span></div></div>',
      '<div class="pdp-panel pdp-cro-buybox" data-reveal="delay-1"><span class="eyebrow">THERAPY SERIES</span><h1>PosturePlus 4.5</h1><p>Conversion-focused buy box prototype — same product story as the standard PDP, with clearer trust signals up front.</p>',
      '<div class="pdp-rating"><strong>★★★★★</strong><span>Public reviews · <span data-trust-years>' + yearsInBusiness() + '</span> years helping Canadians choose</span></div>',
      '<div class="purchase-card purchase-card-cro"><div class="purchase-row"><strong class="purchase-price">$1,098</strong><span class="purchase-note">TXL starting point · verify live</span></div>',
      '<div class="cro-trust-strip"><span>Free fit call</span><span>Delivery explained upfront</span><span>25-year warranty listed</span></div>',
      '<div class="purchase-actions">', button('Add to cart', '#', 'brass'), button('Call 1-800-373-8887', 'tel:+18003738887', 'outline'), '</div>',
      '<p class="purchase-help">Standard product page: <a href="/products/postureplus-4-5/">PosturePlus 4.5 full details →</a></p></div></div></div></section>',
      '<section class="section articulation-section" id="articulation-demo"><div class="container articulation-grid"><div class="articulation-copy" data-reveal><span class="eyebrow">Articulation meter</span><h2>Head and foot rise on their joints — the middle stays on the base.</h2><p>Four presets on a split base: fixed middle deck, head and foot sections each pivot at their own hinge.</p></div><div class="articulation-meter-wrap" data-reveal="delay-1">' + meterMarkup() + '</div></div></section>',
      '<section class="section-tight"><div class="container fit-grid"><div class="fit-copy"><span class="eyebrow">FitCheck</span><h2>Will your current mattress work?</h2><p>Start with mattress type before you add the base to cart.</p></div><div class="fit-card" data-fitcheck data-reveal="delay-1"><h3>FitCheck</h3><label for="cro-mattress-type">Mattress type</label><select id="cro-mattress-type" data-fit-type><option value="memory">Memory foam</option><option value="hybrid">Hybrid</option><option value="latex">Latex</option><option value="spring">Traditional innerspring</option><option value="unknown">I’m not sure</option></select><div class="fit-result"><span class="fit-status" data-fit-status></span><div><strong data-fit-title>LIKELY COMPATIBLE</strong><p data-fit-copy>Select your mattress details to see the starting explanation.</p></div></div></div></div></section>'
    ].join('');
  }

  function renderFinder() {
    return [
      '<section class="finder"><div class="container finder-shell"><div class="finder-intro"><div><span class="eyebrow">A calmer way to choose</span><h1>Find Your Bed</h1><p>Five questions. No email required. We’ll show you what we recommend — and why.</p></div><div class="finder-progress" data-finder-progress><span class="progress-step is-active"></span><span class="progress-step"></span><span class="progress-step"></span><span class="progress-step"></span><span class="progress-step"></span></div></div>',
      '<div class="finder-tools" data-reveal><p class="finder-context" data-finder-context hidden aria-live="polite"></p><div class="finder-needs" role="navigation" aria-label="Start from a need"><a href="/find-your-bed/?need=back">Back comfort</a><a href="/find-your-bed/?need=reflux">Reflux</a><a href="/find-your-bed/?need=snoring">Snoring</a><a href="/find-your-bed/?need=mobility">Transfers</a></div><div class="finder-height-teaser"><span class="eyebrow">Bed height</span><p>Transfer height is part of the same conversation. <a href="/sleep-better/independence/#assessment">Try the height guide →</a></p></div></div>',
      '<div class="finder-card" data-finder><div data-finder-screen="intro"><span class="result-tag">START HERE</span><h2>Tell us what you want to change.</h2><p style="color:var(--overcast);max-width:520px">Your answers shape a short recommendation — not twelve products and a hard sell.</p><div class="finder-footer"><span class="finder-count">About 2 minutes · No email required</span><button class="button button-brass" type="button" data-finder-start>Begin <span>→</span></button></div></div></div></div></section>'
    ].join('');
  }

  function renderIndependence() {
    return [
      '<section class="independence-hero"><div class="container independence-hero-grid"><div><span class="eyebrow">Independence at home</span><h1>Getting out of bed shouldn’t be the hardest part of the day.</h1><p>Explore beds, lift chairs and practical guidance designed to make everyday movement at home easier — whether you’re choosing for yourself or helping someone you love.</p><div class="hero-actions">', button('Start a home assessment', '#assessment', 'brass'), button('Talk to a specialist', '/book-a-consultation/', 'outline'), '</div></div><div class="independence-visual"><img src="' + asset('hi-low-bed.jpg') + '" alt="SleepSoul Hi-Low bed in a bedroom"></div></div></section>',
      '<section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">What changed?</span><h2>Start with the moment that made you look.</h2></div><p>There is no wrong door into this conversation.</p></div><div class="changed-grid"><div class="changed-card"><span class="need-number">01</span><strong>Getting out of bed</strong></div><div class="changed-card"><span class="need-number">02</span><strong>Getting up from a chair</strong></div><div class="changed-card"><span class="need-number">03</span><strong>Fall concerns</strong></div><div class="changed-card"><span class="need-number">04</span><strong>Hospital discharge</strong></div><div class="changed-card"><span class="need-number">05</span><strong>Caregiver strain</strong></div><div class="changed-card"><span class="need-number">06</span><strong>Bedroom setup</strong></div></div></div></section>',
      '<section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow">Hi-Low explained</span><h2>One bed. Two kinds of movement.</h2></div><p>A traditional adjustable base changes your sleeping position. A Hi-Low base also changes the height of the sleeping surface.</p></div><div class="hilow-grid"><article class="hilow-panel light"><span class="result-tag">STANDARD ADJUSTABLE</span><h3>Change the angle.</h3><p>Head and feet move to help you settle into a position that feels more supported.</p><img src="' + asset('postureplus-package.webp') + '" alt="Standard adjustable bed in a room"></article><article class="hilow-panel"><span class="result-tag">HI-LOW</span><h3>Change the angle and the height.</h3><p>Head and feet move, and the whole bed can raise or lower for a different transfer conversation.</p><img src="' + asset('hi-low-bed.jpg') + '" alt="Hi-Low adjustable bed raised in a room"></article></div></div></section>',
      '<section class="section" id="assessment"><div class="container height-tool"><div><span class="eyebrow">Bed height guide</span><h2>Find a starting height that feels like yours.</h2><p style="color:var(--overcast)">Use the control as a conversation starter. A specialist can help you measure your room, mattress and transfer needs together.</p><label for="height-range" class="visually-hidden">Bed height</label><input class="height-range" id="height-range" type="range" min="18" max="30" value="23" data-height-range><p><strong data-height-value>23 in</strong> <span style="color:var(--overcast)">illustrative transfer height</span></p></div><div class="height-track"><span class="height-marker" data-height="30 in · higher"></span><span class="height-marker" data-height="23 in · middle"></span><span class="height-marker" data-height="18 in · lower"></span></div></div></section>',
      '<section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow">Choose the next conversation</span><h2>Bed or lift chair?</h2></div><p>When the need is bigger than one product, we help you look at the whole room.</p></div><div class="solution-grid"><article class="solution-card"><span class="solution-index">BED</span><h3>For sleep, rest and transfers.</h3><p>Explore adjustable and Hi-Low beds when the bedroom is the centre of the decision.</p>', textLink('Explore beds', '/shop/adjustable-beds/'), '</article><article class="solution-card"><span class="solution-index">CHAIR</span><h3>For sitting, resting and rising.</h3><p>Explore lift chairs when a comfortable transition matters throughout the day.</p>', textLink('Explore lift chairs', '/shop/lift-chairs/'), '</article><article class="solution-card"><span class="solution-index">PERSON</span><h3>For questions that are still open.</h3><p>Talk with a specialist about measurements, delivery and the way your home actually works.</p>', textLink('Book a fitting', '/book-a-consultation/'), '</article></div></div></section>'
    ].join('');
  }

  function renderSleepBetter() {
    return [
      '<section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Sleep Better · Editorial library</span><h1>Sleep better. Move easier. Understand your options.</h1><p>Clear, human guides for adjustable beds, health and comfort, independence at home, and mattress compatibility.</p></div><div class="page-hero-note">No jargon first. We answer the practical question, then show the next step.</div></div></section>',
      '<section class="section-tight"><div class="container"><div class="editorial-grid"><a class="editorial-card editorial-card-image" href="/sleep-better/adjustable-beds/"><img src="' + asset('sleepsoul-system-4k.png') + '" alt=""><div class="editorial-card-body"><span class="editorial-index">01 · ADJUSTABLE BEDS</span><h3>What an adjustable bed actually changes.</h3><p>Positions, controls and the details worth testing in person.</p>', textLink('Explore the guide', '/sleep-better/adjustable-beds/'), '</div></a><a class="editorial-card editorial-card-image" href="/sleep-better/health/"><img src="' + asset('postureplus-package.webp') + '" alt=""><div class="editorial-card-body"><span class="editorial-index">02 · HEALTH &amp; COMFORT</span><h3>Resting positions, explained plainly.</h3><p>Back comfort, reflux, snoring and circulation conversations without overpromising.</p>', textLink('Explore health & comfort', '/sleep-better/health/'), '</div></a><a class="editorial-card editorial-card-image" href="/sleep-better/independence/"><img src="' + asset('hi-low-bed.jpg') + '" alt=""><div class="editorial-card-body"><span class="editorial-index">03 · INDEPENDENCE AT HOME</span><h3>Make the everyday movement easier.</h3><p>Hi-Low beds, lift chairs, bed height and caregiver questions.</p>', textLink('Explore independence', '/sleep-better/independence/'), '</div></a><a class="editorial-card editorial-card-image" href="/sleep-better/mattresses/"><img src="' + asset('purcarbon-mattress.jpg') + '" alt=""><div class="editorial-card-body"><span class="editorial-index">04 · MATTRESSES &amp; COMPATIBILITY</span><h3>Will your mattress move with the base?</h3><p>Flex, feel and fit are more useful than a wall of specifications.</p>', textLink('Explore compatibility', '/sleep-better/mattresses/'), '</div></a></div></div></section>',
      '<section class="section section-dark"><div class="container"><div class="section-heading"><div><span class="eyebrow">Start with a question</span><h2>Guides that lead somewhere useful.</h2></div><p>Each article connects to a product interaction, a comparison or a person you can call.</p></div><div class="collection-grid"><article class="product-card"><div class="product-body"><span class="eyebrow">Buying guide</span><h3>Zero Gravity Explained</h3><p>What the position is, what it feels like, and where to try it next.</p>', textLink('Read the guide', '/sleep-better/adjustable-beds/zero-gravity-explained/'), '</div></article><article class="product-card"><div class="product-body"><span class="eyebrow">Compatibility</span><h3>Mattress Flex Rating</h3><p>A simpler way to think about how a mattress articulates.</p>', textLink('Check your fit', '/products/postureplus-4-5/#fitcheck'), '</div></article><article class="product-card"><div class="product-body"><span class="eyebrow">At home</span><h3>Hi-Low Beds Explained</h3><p>When changing the height of the whole bed changes the conversation.</p>', textLink('Read the guide', '/sleep-better/independence/'), '</div></article></div></div></section>'
    ].join('');
  }

  function renderArticle() {
    return [
      '<section class="article-hero"><div class="container"><span class="eyebrow">Adjustable beds · Updated for prototype</span><h1>Zero Gravity, explained in a way that helps you choose.</h1><p class="article-meta">SleepSoul editorial team · Read time 5 min · Reviewed for clarity</p></div></section>',
      '<section class="section-tight"><div class="container article-layout"><article class="article-content"><div class="quick-answer"><strong>Quick answer</strong>Zero Gravity is a preset that raises the upper body and knees together. It can feel more supported than lying flat, but the right setting depends on your body, mattress and comfort preferences.</div><h2>What does Zero Gravity mean?</h2><p>On an adjustable base, Zero Gravity is a coordinated position rather than a single fixed angle. The upper body rises while the legs lift, creating a shape that supports the body in more than one place.</p><h2>What should it feel like?</h2><p>Think of it as a starting point, not a promise. Some people like a higher head position, while others settle into a gentler lift. The useful part is being able to adjust the position without stacking pillows or rebuilding the bed.</p><h3>Three things to try</h3><ul><li>Start flat and move slowly.</li><li>Try the same position with your legs a little lower.</li><li>Test the mattress and base together, not separately.</li></ul><h2>Where does the mattress fit?</h2><p>A base can move only as naturally as the mattress allows. Memory foam, hybrid and latex constructions often articulate differently, so use FitCheck as a starting point and ask for the product specification before purchase.</p><div style="margin-top:32px">' + button('Check your mattress', '/products/postureplus-4-5/#fitcheck', 'dark') + '</div></article><aside class="article-aside"><strong>Keep reading</strong><a href="/sleep-better/mattresses/">Mattress compatibility</a><a href="/sleep-better/independence/">Hi-Low beds explained</a><a href="/find-your-bed/">Find Your Bed</a><a href="/book-a-consultation/">Talk to a specialist</a></aside></div></section>'
    ].join('');
  }

  function renderCompare() {
    return [
      '<section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Compare without the spreadsheet</span><h1>How does it compare?</h1><p>Three products. The differences that actually change the decision.</p></div><div class="page-hero-note">Select a model on a product page to compare it against the nearest alternatives.</div></div></section>',
      '<section class="section-tight compare-section"><div class="container"><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Feature</th><th>PosturePlus 4.5</th><th>Supreme</th><th>Solace</th></tr></thead><tbody><tr><td>Best for</td><td>More control over comfort</td><td>Tailored positions</td><td>Everyday adjustment</td></tr><tr><td>Starting point</td><td>$1,098 TXL</td><td>$3,004 TXL</td><td>$805 TXL</td></tr><tr><td>Head / foot adjustment</td><td>Yes</td><td>Yes</td><td>Head &amp; back</td></tr><tr><td>Neck tilt</td><td>—</td><td>Yes</td><td>—</td></tr><tr><td>Lumbar support</td><td>—</td><td>Yes</td><td>—</td></tr><tr><td>Massage</td><td>Head + foot</td><td>Head + foot</td><td>No massage</td></tr><tr><td>Wall hugging</td><td>No</td><td>Yes</td><td>No</td></tr><tr><td>Independent sides</td><td>Available</td><td>Available</td><td>Ask us</td></tr><tr><td>Warranty</td><td>25 years listed</td><td>30 years listed</td><td>20 years listed</td></tr></tbody></table></div></div></section>',
      '<section class="section"><div class="container service-grid"><div class="service-copy"><span class="eyebrow">Still not sure?</span><h2>The best comparison may be a fitting.</h2><p>Try the positions, feel the mattress, and talk through the setup with someone who knows the products.</p>', button('Book a fitting', '/book-a-consultation/', 'dark'), '</div><div class="service-image"></div></div></section>'
    ].join('');
  }

  function renderConsultation() {
    return [
      '<section class="form-page"><div class="container form-grid"><div class="form-copy"><span class="eyebrow">No pressure, just context</span><h1>Some decisions are easier with a person.</h1><p>Book a phone, video or showroom fitting. Tell us what you are solving and we’ll help you understand the next step.</p><a class="footer-phone" href="tel:+18003738887">1-800-373-8887 <span>↗</span></a></div><form class="consultation-form" data-demo-form><div class="form-row"><label for="consult-name">Name<input id="consult-name" required placeholder="Your name"></label><label for="consult-phone">Phone<input id="consult-phone" required type="tel" placeholder="1-800-..."></label></div><label for="consult-preference">How would you like to meet?<select id="consult-preference"><option>Phone call</option><option>Video fitting</option><option>Showroom visit</option><option>Caregiver consultation</option></select></label><label for="consult-message">What are you trying to solve?<textarea id="consult-message" placeholder="Back comfort, getting in and out, a new sleep system..."></textarea></label><button class="button button-brass" type="submit">Request a fitting <span>→</span></button><p class="form-response" data-form-response aria-live="polite"></p></form></div></section>'
    ].join('');
  }

  function renderShowroom() {
    return [
      '<section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">Visit SleepSoul</span><h1>Try the difference in person.</h1><p>See the bed articulate, compare mattresses, and talk through delivery and setup before you decide.</p></div><div class="page-hero-note">Book a 30-minute sleep fitting for adjustable beds, mattresses, lift chairs or caregiver questions.</div></div></section>',
      '<section class="section-tight"><div class="container showroom-grid"><div class="showroom-image" role="img" aria-label="SleepSoul sleep system showroom image"></div><div class="showroom-info"><span class="eyebrow">Showroom fitting</span><h2>Bring your questions.</h2><p>Come in with the person who will use the system, the person who is helping choose it, or both.</p><div class="info-list"><div><span>Address</span><strong>Visit SleepSoul · confirm current showroom details</strong></div><div><span>Hours</span><strong>Appointments recommended</strong></div><div><span>Phone</span><strong><a href="tel:+18003738887">1-800-373-8887</a></strong></div><div><span>Parking</span><strong>Ask when you book</strong></div></div>', button('Book a showroom fitting', '/book-a-consultation/', 'brass'), '</div></div></section>'
    ].join('');
  }

  function renderAbout() {
    return [
      '<section class="page-hero"><div class="container"><span class="eyebrow">The company behind the system</span><h1>Helping Canadians rest easier since 1982.</h1><p>SleepSoul brings together adjustable beds, mattresses, lift chairs, mobility products and the human advice that makes a high-consideration purchase feel possible.</p></div></section>',
      '<section class="section"><div class="container engineering-grid"><div><span class="eyebrow">A Canadian point of view</span><h2>Comfort is not one-size-fits-all.</h2><p style="color:var(--overcast);max-width:500px">The bedroom, the living room, the mattress, the transfer height and the people helping make the choice all belong in the same conversation.</p></div><div class="service-image"></div></div></section>',
      '<section class="section-tight"><div class="container"><div class="section-heading"><div><span class="eyebrow">A simple timeline</span><h2>Made to rise, with a person behind it.</h2></div><p>Verified company milestones can be added from the source of truth before launch.</p></div><div class="about-timeline"><article class="timeline-card"><strong>1982</strong><p>SleepSoul founded in Canada.</p></article><article class="timeline-card"><strong>Today</strong><p>Adjustable beds, mattresses, lift chairs, mobility and home support in one place.</p></article><article class="timeline-card"><strong>Next</strong><p>Make every high-consideration decision clearer, more human and easier to live with.</p></article></div></div></section>',
      '<section class="section section-dark"><div class="container section-heading"><div><span class="eyebrow">A belief worth keeping</span><h2>We still believe a purchase this important deserves a person you can call.</h2></div><div>', button('Talk to SleepSoul', '/book-a-consultation/', 'light'), '</div></div></section>'
    ].join('');
  }

  function renderCart() {
    return [
      '<section class="page-hero"><div class="container"><span class="eyebrow">A calm cart</span><h1>Your sleep system, when you’re ready.</h1><p>Review the product, size and next service conversation without a countdown or fake urgency.</p></div></section>',
      '<section class="section-tight"><div class="container cart-layout"><div class="cart-item"><img src="' + asset('postureplus-package.webp') + '" alt="PosturePlus adjustable sleep system"><div><span class="eyebrow">Therapy series</span><h3>PosturePlus 4.5 · Queen</h3><p>Adjustable base · fit guidance available</p></div><strong>$1,898</strong></div><aside class="cart-summary"><h3>Order summary</h3><div class="summary-line"><span>Sleep system</span><strong>$1,898</strong></div><div class="summary-line"><span>Delivery destination</span><span>Enter at checkout</span></div><div class="summary-line"><span>Service level</span><span>Talk with us</span></div><div class="summary-line total"><span>Total before delivery</span><strong>$1,898</strong></div>', button('Continue to delivery', '/delivery-and-setup/', 'brass'), '<p style="margin-top:18px;color:var(--overcast);font-size:13px">Prefer to complete your order by phone? <a href="tel:+18003738887" style="color:var(--signal);font-weight:600">Call 1-800-373-8887</a>.</p></aside></div></section>'
    ].join('');
  }

  function renderInfo(type) {
    const copy = {
      financing: ['Financing should make the decision clearer, not louder.', 'Ask about available options, timing and the total cost with a person before you choose.'],
      delivery: ['From our door to your bedroom.', 'Understand delivery, installation and old-bed removal before your order arrives.'],
      warranty: ['Know what is covered.', 'Warranty information belongs beside the product details, sourced from the current product record.'],
      reviews: ['Why people chose SleepSoul.', 'Public review snippets organized by the reason someone started looking.'],
      trade: ['Ready for the next chapter?', 'Talk with SleepSoul about your current setup and what you want to change.'],
      parts: ['Keep your system moving.', 'Bring your model details to a specialist before you order a replacement part.']
    }[type] || ['A clearer next step.', 'Talk with SleepSoul and we’ll help you understand the options.'];
    return [
      '<section class="page-hero"><div class="container page-hero-grid"><div><span class="eyebrow">SleepSoul support</span><h1>' + copy[0] + '</h1><p>' + copy[1] + '</p></div><div class="page-hero-note">This prototype keeps claims and commercial values intentionally conservative until connected to the verified source of truth.</div></div></section>',
      '<section class="section"><div class="container service-grid"><div class="service-copy"><span class="eyebrow">Talk it through</span><h2>Start with the question you have.</h2><p>We can help with product fit, delivery, setup, financing questions or the details that do not belong in a generic product grid.</p>', button('Book a fitting', '/book-a-consultation/', 'dark'), '</div><div class="delivery-details"><h3>Useful next steps</h3><div class="delivery-detail"><span>Phone</span><strong><a href="tel:+18003738887">1-800-373-8887</a></strong></div><div class="delivery-detail"><span>Find a system</span><strong><a href="/find-your-bed/">Five questions, no email</a></strong></div><div class="delivery-detail"><span>Compare</span><strong><a href="/compare/">Three models, clearer differences</a></strong></div><div class="delivery-detail"><span>Showroom</span><strong><a href="/showroom/">Try it in person</a></strong></div></div></div></section>'
    ].join('');
  }

  function initHeader() {
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    const searchToggle = document.querySelector('[data-search-toggle]');
    const searchPanel = document.querySelector('[data-search-panel]');
    const searchClose = document.querySelector('[data-search-close]');
    const mobileToggle = document.querySelector('[data-mobile-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const setPanel = (panel, open) => {
      if (!panel) return;
      panel.hidden = !open;
      document.body.classList.toggle('is-menu-open', open && panel === menu);
    };
    menuToggle?.addEventListener('click', () => {
      const open = menu?.hidden;
      setPanel(menu, open);
      menuToggle.setAttribute('aria-expanded', String(open));
      if (open) {
        setPanel(searchPanel, false);
        searchToggle?.setAttribute('aria-expanded', 'false');
      }
    });
    searchToggle?.addEventListener('click', () => {
      const open = searchPanel?.hidden;
      setPanel(searchPanel, open);
      searchToggle.setAttribute('aria-expanded', String(open));
      if (open) {
        setPanel(menu, false);
        menuToggle?.setAttribute('aria-expanded', 'false');
        document.querySelector('#site-search')?.focus();
      }
    });
    searchClose?.addEventListener('click', () => {
      setPanel(searchPanel, false);
      searchToggle?.setAttribute('aria-expanded', 'false');
    });
    mobileToggle?.addEventListener('click', () => {
      const open = mobileMenu?.hidden;
      setPanel(mobileMenu, open);
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
    window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
  }

  function initSearch() {
    const input = document.querySelector('#site-search');
    const results = document.querySelector('[data-search-results]');
    if (!input || !results) return;
    const entries = [
      ['PRODUCT', 'PosturePlus 4.5', '/products/postureplus-4-5/'],
      ['GUIDE', 'Adjustable beds & reflux', '/sleep-better/health/'],
      ['POSITION', 'Zero Gravity explained', '/sleep-better/adjustable-beds/zero-gravity-explained/'],
      ['PRODUCT', 'Hi-Low & Indulgence', '/sleep-better/independence/'],
      ['GUIDE', 'Mattress compatibility', '/sleep-better/mattresses/'],
      ['PRODUCT', 'Vermont Lift Chair', '/shop/lift-chairs/']
    ];
    const draw = (query) => {
      const selected = query.trim().toLowerCase();
      const list = selected ? entries.filter((entry) => entry.join(' ').toLowerCase().includes(selected)) : entries.slice(0, 3);
      results.innerHTML = list.length ? list.map((entry) => '<a class="search-result" href="' + entry[2] + '"><small>' + entry[0] + '</small><strong>' + entry[1] + '</strong></a>').join('') : '<div class="search-empty" role="status"><strong>No exact match yet.</strong><p>Start with five questions and we’ll help narrow it down.</p><a href="/find-your-bed/">Find Your Bed <span>→</span></a></div>';
    };
    input.addEventListener('input', () => draw(input.value));
    draw('');
  }

  function initReveals() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    const motionCards = [...document.querySelectorAll('.motion-card')];
    const motionMarkers = [...document.querySelectorAll('.motion-marker')];
    const showAll = () => [...items, ...motionCards, ...motionMarkers].forEach((item) => item.classList.add('is-visible'));

    const revealDelay = (item) => (item.dataset.reveal?.startsWith('delay-') ? Number(item.dataset.reveal.replace('delay-', '')) * 0.09 : 0);

    if (motionEnabled()) {
      items.forEach((item) => {
        item.classList.add('is-gsap');
        window.gsap.set(item, { autoAlpha: 0, y: 24 });
      });
      motionCards.forEach((card) => {
        card.style.transition = 'none';
        window.gsap.set(card, { autoAlpha: 0, y: 35 });
      });
      motionMarkers.forEach((marker) => {
        marker.style.transition = 'none';
        window.gsap.set(marker, { autoAlpha: 0, scaleY: 0, transformOrigin: 'bottom center' });
      });
    }

  const reduced = !motionEnabled();
    const animate = (item, delay) => {
      if (motionEnabled()) {
        window.gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          delay: delay || 0,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => item.classList.add('is-visible'),
        });
      } else {
        item.classList.add('is-visible');
      }
    };

    if (reduced || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    const observer = new IntersectionObserver((entries, current) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target, revealDelay(entry.target));
        current.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    items.forEach((item) => observer.observe(item));

    const motion = document.querySelector('[data-motion-scene]');
    if (motion) {
      const motionObserver = new IntersectionObserver((entries, current) => {
        if (!entries[0]?.isIntersecting) return;
        if (motionEnabled()) {
          window.gsap.timeline({
            defaults: { ease: 'power3.out', overwrite: 'auto' },
            onComplete: () => {
              motionCards.forEach((card) => card.classList.add('is-visible'));
              motionMarkers.forEach((marker) => marker.classList.add('is-visible'));
            },
          })
            .to(motionCards, { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.11 })
            .to(motionMarkers, { autoAlpha: 1, scaleY: 1, duration: 0.82, stagger: 0.09, transformOrigin: 'bottom center' }, '-=0.55');
        } else {
          motionCards.forEach((card, index) => window.setTimeout(() => card.classList.add('is-visible'), index * 110));
          motionMarkers.forEach((marker, index) => window.setTimeout(() => marker.classList.add('is-visible'), index * 90 + 180));
        }
        current.disconnect();
      }, { threshold: 0.25 });
      motionObserver.observe(motion);
    }
  }

  function initMeters() {
    const meters = [...document.querySelectorAll('[data-articulation]')];
    const keys = Object.keys(states);
    meters.forEach((meter) => {
      const tabs = [...meter.querySelectorAll('[data-meter-state]')];
      const diagram = meter.querySelector('[data-bed-diagram]');
      const label = meter.querySelector('[data-meter-label]');
      const head = meter.querySelector('[data-head-angle]');
      const foot = meter.querySelector('[data-foot-angle]');
      const copy = meter.querySelector('[data-meter-copy]');
      let active = 0;
      const headGroup = meter.querySelector('[data-bed-head]');
      const footGroup = meter.querySelector('[data-bed-foot]');
      const applyAngles = (state, animate) => {
        const headLift = -state.head;
        const footLift = -state.foot;
        if (animate && motionEnabled() && headGroup && footGroup) {
          window.gsap.to(headGroup, { rotation: headLift, duration: 0.85, ease: 'power2.inOut', svgOrigin: '0 0', transformOrigin: '0px 0px', overwrite: 'auto' });
          window.gsap.to(footGroup, { rotation: footLift, duration: 0.85, ease: 'power2.inOut', svgOrigin: '0 0', transformOrigin: '0px 0px', overwrite: 'auto' });
        } else {
          headGroup?.setAttribute('transform', `rotate(${headLift})`);
          footGroup?.setAttribute('transform', `rotate(${footLift})`);
        }
      };

      const setState = (key, animate = true) => {
        const state = states[key] || states.flat;
        active = Math.max(0, keys.indexOf(key));
        applyAngles(state, animate);
        if (label) label.textContent = state.label;
        if (head) head.textContent = state.headValue;
        if (foot) foot.textContent = state.footValue;
        if (copy) copy.textContent = state.copy;
        tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.meterState === key)));
      };
      tabs.forEach((tab) => tab.addEventListener('click', () => setState(tab.dataset.meterState)));
      meter.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault();
        active = (active + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + keys.length) % keys.length;
        setState(keys[active]);
      });
      setState('flat', false);
    });
  }

  function initHotspots() {
    const messages = {
      motor: ['Motor + control', 'Quiet, considered movement from a system built to be used every day.'],
      pivot: ['Pivot geometry', 'The frame determines how smoothly the mattress can follow the position.'],
      remote: ['Remote + presets', 'The right control keeps the useful positions close at hand.']
    };
    const label = document.querySelector('[data-hotspot-label]');
    document.querySelectorAll('[data-hotspot]').forEach((button) => button.addEventListener('click', () => {
      const message = messages[button.dataset.hotspot];
      document.querySelectorAll('[data-hotspot]').forEach((item) => item.classList.toggle('is-active', item === button));
      if (label && message) label.innerHTML = '<strong>' + message[0] + '</strong>' + message[1];
    }));
  }

  function initFitChecks() {
    document.querySelectorAll('[data-fitcheck]').forEach((card) => {
      const selects = [...card.querySelectorAll('[data-fit-type]')];
      const title = card.querySelector('[data-fit-title]');
      const copy = card.querySelector('[data-fit-copy]');
      const status = card.querySelector('[data-fit-status]');
      const update = () => {
        const type = selects[0]?.value || 'unknown';
        const result = {
          memory: ['GREAT FIT', 'Memory foam is usually a strong starting point. Check the model details before purchase.', 'var(--green)'],
          hybrid: ['LIKELY FIT', 'Many hybrids can articulate well, but construction and thickness still matter.', 'var(--green)'],
          latex: ['CHECK SPECS', 'Latex can work, but ask for the exact compatibility details before choosing a base.', 'var(--lamplight)'],
          spring: ['NOT RECOMMENDED', 'Traditional innersprings may not articulate naturally. A compatible mattress is the safer path.', 'var(--alert)'],
          unknown: ['CHECK SPECS', 'Bring the mattress model or a photo to a specialist and we’ll help you check it.', 'var(--lamplight)']
        }[type];
        if (!result) return;
        if (title) title.textContent = result[0];
        if (copy) copy.textContent = result[1];
        if (status) status.style.background = result[2];
      };
      selects.forEach((select) => select.addEventListener('change', update));
      update();
    });
  }

  function initFilters() {
    const buttons = [...document.querySelectorAll('[data-need-filter]')];
    const cards = [...document.querySelectorAll('[data-product]')];
    buttons.forEach((button) => button.addEventListener('click', () => {
      const value = button.dataset.needFilter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      cards.forEach((card) => { card.hidden = value !== 'all' && !card.dataset.needs.split(' ').includes(value); });
    }));
    const reviewButtons = [...document.querySelectorAll('[data-review-filter]')];
    const reviews = [...document.querySelectorAll('[data-review]')];
    reviewButtons.forEach((button) => button.addEventListener('click', () => {
      const value = button.dataset.reviewFilter;
      reviewButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      reviews.forEach((review) => { review.hidden = value !== 'all' && review.dataset.review !== value; });
    }));
  }

  function initTrustStrip() {
    const years = yearsInBusiness();
    document.querySelectorAll('[data-trust-years]').forEach((node) => { node.textContent = String(years); });
  }

  function syncCartCount(count) {
    const total = Number(count) || 0;
    const label = 'Cart, ' + total + (total === 1 ? ' item' : ' items');
    document.querySelectorAll('.cart-count').forEach((item) => { item.textContent = String(total); });
    document.querySelectorAll('.cart-link').forEach((link) => { link.setAttribute('aria-label', label); });
  }

  function initFinderContext() {
    const need = new URLSearchParams(window.location.search).get('need');
    const context = document.querySelector('[data-finder-context]');
    if (!context || !need) return;
    const labels = {
      back: 'Back & joint comfort',
      reflux: 'Reflux & nighttime comfort',
      snoring: 'Snoring & partner sleep',
      mobility: 'Getting in & out of bed',
      comfort: 'Everyday comfort'
    };
    context.textContent = 'Starting from: ' + (labels[need] || need.replace(/-/g, ' '));
    context.hidden = false;
  }

  function initFinder() {
    initFinderContext();
    const finder = document.querySelector('[data-finder]');
    if (!finder) return;
    const questions = [
      ['What would you most like to improve?', ['Back / joint comfort', 'Reflux', 'Snoring', 'Circulation', 'Getting in or out of bed', 'Nothing specific — better comfort']],
      ['Who is sleeping in the bed?', ['Just me', 'Two of us — similar needs', 'Two of us — different needs']],
      ['Is getting into or out of bed difficult?', ['No', 'Sometimes', 'Yes', 'I’m choosing for someone who finds it difficult']],
      ['What are you doing with your mattress?', ['Keeping my current mattress', 'Buying a new one', 'Not sure']],
      ['What size are you considering?', ['Twin XL', 'Double', 'Queen', 'Dual Queen', 'King / Split King']]
    ];
    let step = 0;
    const answers = [];
    const progress = [...document.querySelectorAll('[data-finder-progress] .progress-step')];
    const showProgress = () => progress.forEach((item, index) => item.classList.toggle('is-active', index <= step));
    const result = () => {
      const mobility = (answers[0] || '').includes('out') || (answers[2] || '').toLowerCase().includes('yes') || (answers[2] || '').includes('choosing');
      const dual = (answers[1] || '').includes('different') || (answers[4] || '').includes('Dual');
      const best = mobility ? 'Hi-Low & Indulgence' : dual ? 'PosturePlus 4.5 Sleep System' : 'PosturePlus 4.5';
      const alternative = mobility ? 'Vermont Lift Chair' : 'Solace';
      finder.innerHTML = '<div class="finder-result"><div><span class="result-tag">BEST MATCH</span><h2>' + best + '</h2><p style="color:var(--overcast)">We chose a system that keeps your main priority visible without asking you to become a product expert first.</p><ul class="result-list"><li>your starting need: ' + (answers[0] || 'better comfort') + '</li><li>sleeping setup: ' + (answers[1] || 'one person') + '</li><li>mattress plan: ' + (answers[3] || 'not sure yet') + '</li></ul><div class="hero-actions">' + button('Build my sleep system', '/products/postureplus-system/', 'brass') + button('Talk this through', '/book-a-consultation/', 'outline') + '</div></div><div><div class="result-summary"><span class="result-tag">WHY WE CHOSE THIS</span><strong>' + alternative + '</strong><p>' + (mobility ? 'A height conversation belongs in the recommendation.' : dual ? 'Independent sides and a compatible mattress keep two different sleepers in the same room.' : 'Adjustable positions give you more control over how you rest.') + '</p></div><p style="color:var(--overcast);font-size:13px;margin-top:18px">Want this by email? Add that step only after you’ve seen the recommendation.</p></div></div><div class="finder-footer"><button class="button button-outline" type="button" data-finder-restart>Start again</button><span class="finder-count">Recommendation shown before contact details</span></div>';
      finder.querySelector('[data-finder-restart]')?.addEventListener('click', () => { step = 0; answers.length = 0; drawIntro(); });
    };
    const drawQuestion = () => {
      const question = questions[step];
      finder.innerHTML = '<span class="result-tag">QUESTION ' + (step + 1) + ' OF ' + questions.length + '</span><h2>' + question[0] + '</h2><div class="finder-options">' + question[1].map((option) => '<button class="finder-option" type="button" data-finder-option="' + option.replace(/"/g, '&quot;') + '">' + option + '</button>').join('') + '</div><div class="finder-footer"><span class="finder-count">Choose one to continue</span><button class="button button-outline" type="button" data-finder-back>Back</button></div>';
      finder.querySelectorAll('[data-finder-option]').forEach((option) => option.addEventListener('click', () => {
        answers[step] = option.dataset.finderOption;
        if (step === questions.length - 1) result(); else { step += 1; showProgress(); drawQuestion(); }
      }));
      finder.querySelector('[data-finder-back]')?.addEventListener('click', () => { if (step > 0) { step -= 1; showProgress(); drawQuestion(); } else drawIntro(); });
    };
    const drawIntro = () => {
      showProgress();
      finder.innerHTML = '<span class="result-tag">START HERE</span><h2>Tell us what you want to change.</h2><p style="color:var(--overcast);max-width:520px">Your answers shape a short recommendation — not twelve products and a hard sell.</p><div class="finder-footer"><span class="finder-count">About 2 minutes · No email required</span><button class="button button-brass" type="button" data-finder-start>Begin <span>→</span></button></div>';
      finder.querySelector('[data-finder-start]')?.addEventListener('click', () => { step = 0; showProgress(); drawQuestion(); });
    };
    finder.querySelector('[data-finder-start]')?.addEventListener('click', () => { step = 0; showProgress(); drawQuestion(); });
  }

  function initGallery() {
    const main = document.querySelector('[data-gallery-main]');
    if (!main) return;
    document.querySelectorAll('[data-gallery-src]').forEach((thumb) => thumb.addEventListener('click', () => {
      main.src = thumb.dataset.gallerySrc;
      document.querySelectorAll('.gallery-thumb').forEach((item) => item.setAttribute('aria-current', String(item === thumb)));
    }));
  }

  function initSizes() {
    const price = document.querySelector('.purchase-price');
    document.querySelectorAll('[data-size]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      if (price && button.dataset.price) price.textContent = '$' + Number(button.dataset.price).toLocaleString('en-CA');
    }));
  }

  function initDelivery() {
    const form = document.querySelector('[data-delivery-form]');
    const output = document.querySelector('[data-delivery-estimate]');
    const empty = document.querySelector('[data-delivery-empty]');
    const result = document.querySelector('[data-delivery-result]');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = new FormData(form).get('postal')?.toString().trim();
      if (value) {
        if (output) output.textContent = 'We’ll confirm options for ' + value.toUpperCase();
        empty?.setAttribute('hidden', '');
        result?.removeAttribute('hidden');
      } else {
        if (output) output.textContent = 'We’ll confirm options';
        empty?.removeAttribute('hidden');
        result?.setAttribute('hidden', '');
      }
    });
  }

  function initHeight() {
    const range = document.querySelector('[data-height-range]');
    const value = document.querySelector('[data-height-value]');
    range?.addEventListener('input', () => { if (value) value.textContent = range.value + ' in'; });
  }

  function initForms() {
    document.querySelectorAll('[data-demo-form]').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const response = form.querySelector('[data-form-response]');
      if (response) response.textContent = 'Thanks — your request is ready for the SleepSoul team to follow up.';
    }));
  }

  function initCartActions() {
    const add = [...document.querySelectorAll('.purchase-actions .button')].find((item) => item.textContent.toLowerCase().includes('add to cart'));
    if (!add) return;
    add.addEventListener('click', (event) => {
      event.preventDefault();
      const count = Number(localStorage.getItem('sleepsoul-cart-count') || 0) + 1;
      localStorage.setItem('sleepsoul-cart-count', String(count));
      syncCartCount(count);
      add.textContent = 'Added · View cart →';
      add.href = '/cart/';
    });
    const count = localStorage.getItem('sleepsoul-cart-count');
    if (count) syncCartCount(count);
  }

  function initHeroPanels() {
    const hero = document.querySelector('.hero');
    const stage = document.querySelector('[data-system-stage]');
    const surface = stage || hero;
    const panel = document.querySelector('[data-hero-panel]');
    const content = panel?.querySelector('[data-hero-panel-content]');
    if (!surface || !panel || !content) return;
    const details = {
      base: {
        eyebrow: 'THE BASE · POSTUREPLUS 4.5',
        title: 'A position that moves with you.',
        copy: 'Adjustable control for reading, resting, elevation and partner comfort — with a clear explanation of what changes underneath the mattress.',
        image: 'sleepsoul-system-4k.png',
        chips: ['Head + foot', 'Massage', 'Bluetooth app'],
        extra: meterMarkup()
      },
      mattress: {
        eyebrow: 'THE MATTRESS · FLEX RATING',
        title: 'The surface matters too.',
        copy: 'Not every mattress articulates equally. Start with the material, thickness and feel you already know, then check the fit before you commit.',
        image: 'postureplus-package.webp',
        chips: ['Memory foam', 'Hybrid', 'Latex'],
        extra: '<a class="button button-dark" href="/shop/mattresses/">Explore compatible mattresses <span>→</span></a>'
      },
      independence: {
        eyebrow: 'HI-LOW · INDEPENDENCE',
        title: 'Change the angle and the height.',
        copy: 'A Hi-Low system adds another kind of movement to the bedroom: the whole sleep surface can raise or lower for a different transfer conversation.',
        image: 'hi-low-bed.jpg',
        chips: ['Height adjustment', 'Transfer support', 'Home fitting'],
        extra: '<a class="button button-dark" href="/sleep-better/independence/">Explore independence at home <span>→</span></a>'
      },
      service: {
        eyebrow: 'HUMAN SERVICE · CANADA',
        title: 'The details arrive with a person.',
        copy: 'Talk through measurements, mattress fit, delivery, setup and the questions that do not belong in a generic product grid.',
        image: 'solace-package.jpg',
        chips: ['Phone', 'Video', 'Showroom'],
        extra: '<a class="button button-dark" href="/book-a-consultation/">Book a fitting <span>→</span></a>'
      }
    };
    const canAnimate = () => motionEnabled();
    const close = () => {
      surface.classList.remove('is-panel-open');
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      if (canAnimate()) {
        window.gsap.to(panel, { autoAlpha: 0, duration: 0.2, ease: 'power2.in', onComplete: () => { panel.hidden = true; window.gsap.set(panel, { clearProps: 'opacity,visibility' }); } });
      } else {
        window.setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 360);
      }
    };
    document.querySelectorAll('[data-hero-hotspot]').forEach((button) => button.addEventListener('click', () => {
      const detail = details[button.dataset.heroHotspot] || details.base;
      content.innerHTML = '<div class="hero-panel-media"><img src="' + asset(detail.image) + '" alt="' + detail.title + '"></div><div class="hero-panel-copy"><span class="eyebrow">' + detail.eyebrow + '</span><h2>' + detail.title + '</h2><p>' + detail.copy + '</p><div class="panel-chips">' + detail.chips.map((chip) => '<span>' + chip + '</span>').join('') + '</div>' + detail.extra + '</div>';
      panel.hidden = false;
      panel.setAttribute('aria-hidden', 'false');
      surface.classList.add('is-panel-open');
      requestAnimationFrame(() => {
        panel.classList.add('is-open');
        if (canAnimate()) window.gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: 'power2.out' });
      });
      window.setTimeout(() => {
        initMeters();
        panel.querySelector('.meter-tab')?.focus();
      }, 80);
    }));
    panel.querySelector('[data-hero-close]')?.addEventListener('click', close);
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) close(); });
  }

  function renderReviewBento() {
    return [
      '<section class="section review-bento-section" id="reviews"><div class="container">',
      '<div class="review-bento-heading"><div><span class="eyebrow">From SleepSoul owners</span><h2>Trusted reviews<br><span>from people like you.</span></h2></div><a class="button button-dark" href="/reviews/">View more reviews <span>↗</span></a></div>',
      '<div class="review-bento">',
      '<article class="review-bento-card review-bento-visual review-bento-tall"><img src="' + asset('sleepsoul-system-4k.png') + '" alt="SleepSoul adjustable sleep system in a calm modern room"><div class="review-bento-scrim"></div><div class="review-bento-caption"><strong>Comfort that feels like home.</strong><span>Sleep systems designed around real rooms and real routines.</span></div></article>',
      '<article class="review-bento-card review-bento-social"><div class="social-top"><span class="review-avatar">JW</span><span class="social-mark">SLEEPSOUL</span></div><blockquote>“The installation guys were great.”</blockquote><small>Janet W. · St. Thomas, ON<br>Verified public review</small></article>',
      '<article class="review-bento-card review-bento-social review-bento-social-muted"><div class="social-top"><span class="review-avatar">LT</span><span class="social-mark">OWNER NOTE</span></div><blockquote>“I now sleep with more comfort.”</blockquote><small>Leeson T. · Merritt, BC<br>Verified public review</small></article>',
      '<article class="review-bento-card review-bento-visual review-bento-tall"><img src="' + asset('hi-low-bed.jpg') + '" alt="SleepSoul Hi-Low bed supporting easier movement at home"><div class="review-bento-scrim"></div><div class="review-bento-caption"><strong>Support for easier days.</strong><span>Hi-Low beds and lift chairs for the way home works.</span></div></article>',
      '<article class="review-bento-card review-bento-visual review-bento-medium"><img src="' + asset('solace-package.jpg') + '" alt="SleepSoul Solace sleep system"><div class="review-bento-scrim"></div><button class="review-play" type="button" aria-label="Play SleepSoul owner story">▶</button><div class="review-bento-caption"><strong>“These beds came to my rescue.”</strong><span>Mr &amp; Mrs Amundumson · Little Smoky, AB</span></div></article>',
      '<article class="review-bento-card review-bento-note"><span class="eyebrow">What people ask us about</span><strong>Getting in &amp; out of bed</strong><p>Human guidance for comfort, mobility and the confidence to choose.</p><a class="text-link" href="/book-a-consultation/">Talk to a specialist <span>→</span></a></article>',
      '</div></div></section>'
    ].join('');
  }

  function routeRenderer() {
    const collections = {
      'adjustable-beds': 'adjustable',
      mattresses: 'mattress',
      'sleep-systems': 'system',
      'lift-chairs': 'chair',
      mobility: 'mobility',
      bedding: 'bedding',
      parts: 'parts'
    };
    if (page === 'home') return renderHome;
    if (page === 'find') return renderFinder;
    if (page === 'compare') return renderCompare;
    if (page === 'product') return () => renderPdp(false);
    if (page === 'product-cro') return renderPdpCro;
    if (page === 'sleep-system') return () => renderPdp(true);
    if (page === 'independence') return renderIndependence;
    if (page === 'sleep-better' || ['sleep-adjustable', 'sleep-health', 'sleep-mattresses'].includes(page)) return renderSleepBetter;
    if (page === 'article') return renderArticle;
    if (page === 'consultation') return renderConsultation;
    if (page === 'showroom') return renderShowroom;
    if (page === 'about') return renderAbout;
    if (page === 'cart') return renderCart;
    if (collections[page]) return () => renderCollection(collections[page]);
    if (['financing', 'delivery', 'warranty', 'reviews', 'trade', 'parts'].includes(page)) return () => renderInfo(page);
    return renderHome;
  }

  function renderRoute() {
    const renderer = routeRenderer();
    let markup = renderer();
    if (page === 'product-cro') {
      document.querySelector('.site-notice')?.classList.add('site-notice-promo');
    }
    if (page === 'home') {
      const controls = [
        '<div class="hero-hotspots" aria-label="Explore the SleepSoul sleep system">',
        '<button class="hero-hotspot" type="button" data-hero-hotspot="base" style="--x:40%;--y:69%" aria-label="Explore the adjustable base"><span>+</span></button>',
        '<button class="hero-hotspot" type="button" data-hero-hotspot="mattress" style="--x:63%;--y:43%" aria-label="Explore the mattress"><span>+</span></button>',
        '<button class="hero-hotspot" type="button" data-hero-hotspot="independence" style="--x:77%;--y:68%" aria-label="Explore easier movement"><span>+</span></button>',
        '</div>',
        '<aside class="hero-detail-panel" data-hero-panel hidden aria-hidden="true"><button class="hero-panel-close" type="button" data-hero-close aria-label="Back to the sleep system image"><span aria-hidden="true">×</span><span>Back to image</span></button><div data-hero-panel-content></div></aside>'
      ].join('');
      markup = markup.replace('<div class="hero-meter-wrap">' + meterMarkup() + '</div>', '');
      const overlap = '<section class="hero-overlap"><div class="container"><div class="overlap-intro"><span class="eyebrow">One system · more ways to rest</span><h2>Designed around the way you sleep, move and live at home.</h2><p>From a calmer bedtime position to an easier morning, SleepSoul helps you understand the whole sleep system.</p><a class="button button-dark" href="/find-your-bed/">Find your best fit <span>→</span></a></div><div class="overlap-bento"><article><div class="overlap-card-media"><img src="' + asset('sleepsoul-system-4k.png') + '" alt="SleepSoul adjustable bed in a raised position"></div><div class="overlap-card-copy"><span>01</span><strong>Adjust the angle</strong><p>Find a position that feels right for reading, resting or winding down.</p></div></article><article><div class="overlap-card-media"><img src="' + asset('postureplus-package.webp') + '" alt="SleepSoul PosturePlus sleep system"></div><div class="overlap-card-copy"><span>02</span><strong>Check the fit</strong><p>Choose the mattress and base as one considered system.</p></div></article><article><div class="overlap-card-media"><img src="' + asset('hi-low-bed.jpg') + '" alt="SleepSoul Hi-Low bed"></div><div class="overlap-card-copy"><span>03</span><strong>Talk it through</strong><p>Get delivery, setup and human guidance before you decide.</p></div></article></div></div></section>';
      const interactive = '<section class="section system-interactive" aria-labelledby="system-interactive-title"><div class="container"><div class="system-heading"><div><span class="eyebrow">Explore one part at a time</span><h2 id="system-interactive-title">See what moves.</h2></div><p>Choose one point to learn what changes. Close the panel when you’re ready to return to the image.</p></div><div class="system-stage" data-system-stage><img src="' + asset('sleepsoul-system-4k.png') + '" alt="A clean SleepSoul adjustable bed moving into a supported position"><span class="system-stage-label">Tap one point to learn more</span>' + controls + '</div></div></section>';
      const articulationDemo = '<section class="section articulation-section" id="articulation-demo"><div class="container articulation-grid"><div class="articulation-copy" data-reveal><span class="eyebrow">Articulation meter</span><h2>Head and foot rise on their joints — the middle stays on the base.</h2><p>Four presets show a real split base: head section, fixed mid deck, foot section, each with an outer end and a hinge (four joint points).</p></div><div class="articulation-meter-wrap" data-reveal="delay-1">' + meterMarkup() + '</div></div></section>';
      markup = markup.replace('<section class="trust-strip"', overlap + interactive + articulationDemo + '<section class="trust-strip"');
      const reviewStart = markup.indexOf('<section class="section review-section">');
      if (reviewStart >= 0) {
        const reviewEnd = markup.indexOf('</section>', reviewStart) + '</section>'.length;
        markup = markup.slice(0, reviewStart) + renderReviewBento() + markup.slice(reviewEnd);
      }
    }
    app.innerHTML = markup;
    initHeroPanels();
    initReveals();
    initMeters();
    initFitChecks();
    initHotspots();
    initFilters();
    initFinder();
    initGallery();
    initSizes();
    initDelivery();
    initHeight();
    initForms();
    initCartActions();
    initTrustStrip();
  }

  initHeader();
  initTrustStrip();
  syncCartCount(localStorage.getItem('sleepsoul-cart-count') || 0);
  initSearch();
  if (year) year.textContent = String(new Date().getFullYear());
  renderRoute();
})();

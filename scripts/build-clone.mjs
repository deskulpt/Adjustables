import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const template = await readFile(join(root, 'site-template.html'), 'utf8');

const pages = [
  ['home', '', 'SleepSoul Sleep | Made to rise.', 'Canadian adjustable beds, mattresses, sleep systems and lift chairs designed around the way you sleep, move and live at home.'],
  ['find', 'find-your-bed', 'Find Your Bed | SleepSoul Sleep', 'Answer five practical questions and understand which SleepSoul sleep system fits your life.'],
  ['compare', 'compare', 'Compare Adjustable Beds | SleepSoul Sleep', 'Compare SleepSoul adjustable bases by comfort, control, independence and fit.'],
  ['adjustable-beds', 'shop/adjustable-beds', 'Adjustable Beds | SleepSoul Sleep', 'Adjustable comfort, built around what you need. Explore SleepSoul bases and sleep systems.'],
  ['mattresses', 'shop/mattresses', 'Mattresses | SleepSoul Sleep', 'Mattresses designed to move with the base and support the way you rest.'],
  ['sleep-systems', 'shop/sleep-systems', 'Sleep Systems | SleepSoul Sleep', 'Complete base and mattress pairings designed to move together.'],
  ['lift-chairs', 'shop/lift-chairs', 'Lift Chairs | SleepSoul Sleep', 'Beautiful lift chairs that help everyday movement feel more natural at home.'],
  ['mobility', 'shop/mobility', 'Mobility | SleepSoul Sleep', 'Practical mobility solutions with thoughtful Canadian service.'],
  ['bedding', 'shop/bedding', 'Bedding & Accessories | SleepSoul Sleep', 'Finish your sleep system with compatible bedding and accessories.'],
  ['parts', 'shop/parts', 'Parts & Support | SleepSoul Sleep', 'Find the right parts and support for your SleepSoul system.'],
  ['sleep-better', 'sleep-better', 'Sleep Better | SleepSoul Sleep', 'Sleep better, move easier, and understand your options with SleepSoul guides.'],
  ['sleep-adjustable', 'sleep-better/adjustable-beds', 'Adjustable Bed Guides | SleepSoul Sleep', 'Clear guides to adjustable beds, positions and fit.'],
  ['sleep-health', 'sleep-better/health', 'Health & Comfort Guides | SleepSoul Sleep', 'Understand positions, comfort and mattress compatibility without the jargon.'],
  ['independence', 'sleep-better/independence', 'Independence at Home | SleepSoul Sleep', 'Explore beds, lift chairs and guidance designed to make everyday movement easier.'],
  ['sleep-mattresses', 'sleep-better/mattresses', 'Mattress Compatibility | SleepSoul Sleep', 'Learn what makes a mattress move well with an adjustable base.'],
  ['article', 'sleep-better/adjustable-beds/zero-gravity-explained', 'Zero Gravity Explained | SleepSoul Sleep', 'A practical guide to the zero-gravity position and adjustable sleep.'],
  ['consultation', 'book-a-consultation', 'Book a Fitting | SleepSoul Sleep', 'Talk through your sleep system with a real SleepSoul specialist.'],
  ['showroom', 'showroom', 'Visit the Showroom | SleepSoul Sleep', 'Try the difference in person at SleepSoul.'],
  ['financing', 'financing', 'Financing | SleepSoul Sleep', 'Explore financing questions with a specialist before you choose a system.'],
  ['delivery', 'delivery-and-setup', 'Delivery & Setup | SleepSoul Sleep', 'Understand delivery, installation and old-bed removal before your order arrives.'],
  ['warranty', 'warranty', 'Warranty | SleepSoul Sleep', 'Find warranty information for your SleepSoul products.'],
  ['about', 'about', 'About SleepSoul | SleepSoul Sleep', 'Helping Canadians rest easier since 1982.'],
  ['reviews', 'reviews', 'Reviews | SleepSoul Sleep', 'Read why customers chose SleepSoul for comfort, mobility and everyday life.'],
  ['trade', 'trade', 'Trade In | SleepSoul Sleep', 'Talk to SleepSoul about your next sleep system.'],
  ['product', 'products/postureplus-4-5', 'PosturePlus 4.5 | SleepSoul Sleep', 'A highly adjustable base for more control over position, support and partner comfort.'],
  ['sleep-system', 'products/postureplus-system', 'PosturePlus Sleep System | SleepSoul Sleep', 'A complete sleep system designed to move together.'],
  ['cart', 'cart', 'Your Cart | SleepSoul Sleep', 'Review your SleepSoul sleep system and choose how you want to complete your order.']
];

function render(page, path, title, description) {
  return template
    .replaceAll('__PAGE__', page)
    .replaceAll('__PATH__', `/${path}${path ? '/' : ''}`)
    .replaceAll('__TITLE__', title)
    .replaceAll('__DESCRIPTION__', description);
}

for (const [page, path, title, description] of pages) {
  const outputDir = join(root, path);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'index.html'), render(page, path, title, description));
}

await access(join(root, 'clone.css'));
await access(join(root, 'clone.js'));
await access(join(root, 'public', 'assets', 'sleepsoul-hero.gif'));
console.log(`Built ${pages.length} SleepSoul routes.`);

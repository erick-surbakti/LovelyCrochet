/**
 * Regenerates /IMAGE_MAP.md from src/data/images.json so the map and the
 * metadata the site actually uses can never drift apart.
 *
 *   node scripts/build-image-map.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/images.json', import.meta.url), 'utf8'));
const esc = (s) => String(s).replaceAll('|', '\\|');

/** Original file in src/assets/raw/ → SEO file name. */
const RAW = {
  'gantungan-kunci-anjing-amigurumi-rajut': 'dog shaped keychain.jpg',
  'boneka-donald-duck-rajut-amigurumi': 'donald duck.jpg',
  'boneka-hello-kitty-rajut-overall-merah': 'hello kitty.jpg',
  'boneka-hello-kitty-rajut-overall-pink-kotak-kado': 'hello kittyy.jpg',
  'boneka-husky-rajut-amigurumi-kotak-kado': 'husky.jpg',
  'boneka-penguin-rajut-kupluk-biru-kotak-kado': 'penguin.jpg',
  'boneka-penguin-rajut-pink-topi-syal': 'pink penguin.jpg',
  'boneka-kelinci-rajut-krem-syal-biru': 'rabit.jpg',
};

/** Where each image appears on the site. */
const USED = {
  'gantungan-kunci-anjing-amigurumi-rajut':
    'Product: Gantungan Kunci Anjing · Accessories category · hero collage · gallery · corporate gift guide · About',
  'boneka-donald-duck-rajut-amigurumi':
    'Product: Donald Duck · gallery · birthday gift guide · journal (hours per doll)',
  'boneka-hello-kitty-rajut-overall-merah':
    'Product: Hello Kitty (photo 1) · **home hero (eager, fetchpriority high)** · Valentine gift guide',
  'boneka-hello-kitty-rajut-overall-pink-kotak-kado': 'Product: Hello Kitty (photo 2, hover swap) · gallery',
  'boneka-husky-rajut-amigurumi-kotak-kado':
    'Product: Husky · hero collage · gallery · graduation gift guide · journal (handmade vs machine)',
  'boneka-penguin-rajut-kupluk-biru-kotak-kado': 'Product: Penguin (photo 1) · gallery · Eid gift guide · Bekasi page',
  'boneka-penguin-rajut-pink-topi-syal':
    'Product: Penguin (photo 2, hover swap) · hero collage · anniversary gift guide',
  'boneka-kelinci-rajut-krem-syal-biru':
    "Product: Kelinci · Dolls category · gallery · Mother's Day & baby shower guides · About · journal (yarn, care)",
  'ilustrasi-buket-tulip-rajut': 'Bouquets category · tulip pattern · journal (graduation ideas)',
  'ilustrasi-tas-tote-rajut': 'Bags category',
  'ilustrasi-renda-rajut': 'Crochet lace category',
  'ilustrasi-gantungan-kunci-hati-rajut': 'Heart keychain pattern · journal (crochet for beginners)',
};

const rows = Object.entries(data).map(
  ([name, m], i) =>
    `| ${i + 1} | ${RAW[name] ? `\`${RAW[name]}\`` : '_illustration_'} | \`${name}.jpg\` | ${m.role} | ${esc(m.subject)} | ${esc(m.colors.join(', '))} | ${esc(m.alt.id)} | ${esc(m.alt.en)} | ${esc(m.caption.id)} / ${esc(m.caption.en)} | ${esc(m.pinterest.id)} / ${esc(m.pinterest.en)} |`,
);
const usage = Object.keys(data).map((name) => `| \`${name}.jpg\` | ${USED[name] ?? '—'} |`);

const md = `# IMAGE_MAP

> **Status:** 8 product photos supplied by Simpul Mungil (real pieces; lighting and background
> enhanced with AI by the owner) plus 4 clearly labelled **illustrations** used only for the
> Bouquets, Bags and Crochet Lace categories and the heart pattern, until real photos of those exist.
> This file is generated from \`src/data/images.json\` with \`npm run images:map\`.

## How to add or replace a photo

1. Put the original in \`src/assets/raw/\` (kept as a backup; not served).
2. Copy it to \`src/assets/images/\` with a descriptive kebab-case name, e.g. \`tas-rajut-rumbai-krem.jpg\`.
   JPG, ideally at least 1600 px on the long side, 3:4 or 4:5 portrait.
3. Add an entry in \`src/data/images.json\` (subject, alt text and captions in both languages, Pinterest copy),
   then run \`npm run images:map\`.
4. Reference it from a product's \`images:\` list (first image = main photo, second = hover / gallery).

The current photos are 896 × 1195 px. The site never upscales them, but sharper originals
(1600 px or more) would look better on large screens.

Every image is served through \`astro:assets\` \`<Picture>\` as AVIF + WebP with a JPG fallback,
responsive widths, explicit width/height and lazy loading (except the one hero image per page).

## Map

| # | Original (raw) | SEO file name | Use | Subject | Colours | Alt (ID) | Alt (EN) | Caption (ID / EN) | Pinterest description (ID / EN) |
|---|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Where each image is used

| File | Used on |
|---|---|
${usage.join('\n')}
`;

writeFileSync(new URL('../IMAGE_MAP.md', import.meta.url), md);
console.log('IMAGE_MAP.md written with', rows.length, 'images');

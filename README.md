# LovelyCrochet

Bilingual (Indonesian / English) website for **LovelyCrochet**, a handmade crochet studio in Bekasi.
Built with Astro 7 as a fully static site: zero JavaScript by default, small Preact islands for the
interactive parts, and Lighthouse 100/100/100/100 on mobile and desktop.

- Indonesian (default): `https://lovelycrochet.shop/`
- English: `https://lovelycrochet.shop/en/`

> **Before launch:** the products, photos and several business facts are placeholders.
> Work through [`CONTENT_TODO.md`](./CONTENT_TODO.md) first.

## Quick start

Requires **Node.js 22.12+**.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site → dist/
npm run preview    # serve dist/ locally
```

## Project structure

```
src/
  config/site.ts         ← ALL business facts (name, WhatsApp, address, hours, policies…)
  content/               ← content collections
    products/*.md        ← one file per product (both languages inside)
    categories.yaml      ← 5 categories with intro copy + FAQ
    occasions.yaml       ← 8 gift guides
    journal/{id,en}/     ← blog posts (MDX)
    patterns/{id,en}/    ← free patterns
    pages/{id,en}/       ← care, size, shipping, privacy, terms
    glossary.yaml, faq.yaml, testimonials.yaml
  content.config.ts      ← Zod schemas for every collection
  assets/images/         ← product photos (served via astro:assets)
  data/images.json       ← alt text, captions, Pinterest copy per photo
  i18n/                  ← route table (ID ↔ EN slugs), UI strings, page titles
  lib/                   ← schema builders, WhatsApp links, formatting, content queries
  components/            ← ui/, sections/, islands/ (Preact), seo/
  views/                 ← one view per page template, shared by ID and EN routes
  pages/                 ← thin route files + endpoints (OG images, RSS, llms.txt, robots, search index)
  styles/global.css      ← design tokens (Tailwind v4 @theme) and components
integrations/security-headers.mjs  ← writes dist/_headers with a hash-based CSP
scripts/                 ← QA, Lighthouse report, JSON-LD validator, image tools
tests/unit, tests/e2e    ← Vitest and Playwright
```

## Editing business facts

Open `src/config/site.ts`. Everything is in one place: WhatsApp number, email, address, hours, banks,
couriers, lead times, deposit, shipping and return rules, social and marketplace links, analytics.
The footer, contact page, WhatsApp buttons, FAQ answers that quote policies, and all JSON-LD schema
read from this file. Setting a social or marketplace link from `null` to a URL makes the link appear automatically.

## Adding a product

1. Put the photos in `src/assets/images/` with a descriptive kebab-case name, e.g.
   `boneka-rubah-amigurumi-oranye.jpg`, plus an optional second angle `boneka-rubah-amigurumi-oranye-detail.jpg`.
   Use JPG, at least 1600 px on the long side, ideally 4:5 portrait.
2. Add an entry for the photo in `src/data/images.json` (alt text and captions in both languages,
   Pinterest description), then run `npm run images:map` to refresh `IMAGE_MAP.md`.
3. Copy any file in `src/content/products/` to a new file, e.g. `boneka-rubah-rajut.md`, and edit it:
   - `slugs.id` / `slugs.en`: URLs in each language
   - `name`, `summary` (≤155 chars, used as the meta description), `description`
   - `category`: one of the ids in `categories.yaml`
   - `occasions`: exactly 3 of `wisuda, ulang-tahun, anniversary, valentine, hari-ibu, lebaran, baby-shower, korporat`
   - `price` in Rupiah (number, no dots), `availability: ready | preorder`, `leadTimeDays` for pre-orders
   - `images`: the file names from step 1, without `.jpg`
   - `colors`, optional `variants` (each with its own price), dimensions, yarn, care
   - `relatedJournal`: 2 journal post keys (the Indonesian slugs)
4. `npm run dev` and check the product page. The build fails with a clear message if a field is
   missing or a photo name is wrong.

The product automatically appears in the shop, its category, its gift guides, search, the sitemap,
`llms.txt`, gets an OG image, and gets `Product` + `Offer` schema.

## Adding reviews

Only real reviews, used with the customer's permission. Add them to `src/content/testimonials.yaml` with
`permission: true` and `sample: false`. They then show in the testimonial carousel, on the product page
(if `product` is set), and in `Review` / `AggregateRating` schema. Delete the 3 sample entries once you have real ones.

## Adding a journal post or pattern

Create `src/content/journal/id/<slug>.mdx` and its translation `src/content/journal/en/<slug>.mdx`
with the same `translationKey`. Copy the frontmatter of an existing post. Patterns work the same way in
`src/content/patterns/`.

## Quality checks

```bash
npm run check           # astro check (TypeScript strict)
npm run lint            # ESLint
npm run format:check    # Prettier
npm test                # Vitest: schema builders, WhatsApp links, formatting, routes
npm run build
npm run validate:jsonld # validates every JSON-LD block in dist/
npm run test:e2e        # Playwright smoke tests (desktop + mobile)
npm run qa:sweep        # every page × 2 viewports: console errors, overflow, alt text, h1, duplicate ids
npm run lhci            # Lighthouse CI with the performance budgets (needs Chrome)
npm run ci              # all of the above except lhci, in order
```

GitHub Actions (`.github/workflows/ci.yml`) runs everything on every push and pull request and fails
on any Lighthouse budget regression (`lighthouserc.json`): LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 200 ms,
JS ≤ 30 KB per page, accessibility / best practices / SEO = 100.

## Deploying

### Netlify (recommended: also handles the newsletter form)

1. Push the repo to GitHub and import it in Netlify. `netlify.toml` already sets the build command, the
   `dist` folder and Node 22.
2. Add `lovelycrochet.shop` as the primary domain and `www.lovelycrochet.shop` as an alias.
   `public/_redirects` 301-redirects www to the main domain. DNS for the domain is managed at AnymHost.
3. `dist/_headers` (generated at build) sets CSP, HSTS, Referrer-Policy, Permissions-Policy and
   long cache headers for hashed assets and fonts.
4. Netlify → Forms: enable notifications for the `newsletter` form.

### Cloudflare Pages

Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
`_headers` and `_redirects` are supported. Domain redirects for the alternate domains should be set
as Cloudflare Bulk Redirects instead (Pages ignores absolute-URL rules in `_redirects`). The newsletter
form needs Formspree on Cloudflare: change the form `action` in `src/components/sections/Newsletter.astro`.

### After the first deploy

1. **Google Search Console:** add the domain property, verify with a DNS TXT record, then
   Sitemaps → submit `https://lovelycrochet.shop/sitemap-index.xml`.
2. **Bing Webmaster Tools:** sign in, choose *Import from Google Search Console* (or add the site and
   submit the same sitemap URL).
3. Request indexing for `/`, `/bekasi/` and a few products via URL Inspection.
4. Follow [`LOCAL_SEO_CHECKLIST.md`](./LOCAL_SEO_CHECKLIST.md).

## Notes

- **Fonts:** `public/fonts/` holds self-hosted, subset variable fonts. Fraunces is instanced to
  `opsz 72, SOFT 100` and keeps `wght 500–650` + `WONK`. Plus Jakarta Sans keeps `wght 400–800`. Latin only.
  If you need other characters, regenerate them with Python `fontTools` (`pip install fonttools brotli`):

  ```bash
  U="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2190,U+2192,U+2713,U+00D7"
  python -m fontTools.varLib.instancer node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2 opsz=72 SOFT=100 wght=500:650 -o fr.ttf
  python -m fontTools.subset fr.ttf --unicodes="$U" --layout-features=kern,liga,calt --flavor=woff2 --output-file=public/fonts/fraunces-var-v3.woff2
  python -m fontTools.varLib.instancer node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2 wght=400:800 -o jk.ttf
  python -m fontTools.subset jk.ttf --unicodes="$U" --layout-features=kern,liga,calt --flavor=woff2 --output-file=public/fonts/plus-jakarta-sans-var-v3.woff2
  ```

  Bump the `-vN` suffix and update the paths in `src/styles/global.css` and the preload links in
  `src/layouts/BaseLayout.astro`. The files are cached as immutable, so a new name is required.
- **Stand-in images** can be regenerated with `npm run images:standins`. Real photos overwrite them by
  using the same file names.
- **Stitch Counter** numbers are hidden in production until `site.stats.confirmed` is `true`.

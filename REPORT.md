# Simpul Mungil: Final Report

Build date: 3 November 2026 · Astro 7.4.4 · Tailwind 4.3.3 · Preact 11.1.1 · Node 24

## Status at a glance

| Check | Result |
|---|---|
| `npm run build` | ✅ 130 HTML pages + 124 OG images + endpoints, **0 errors, 0 warnings** |
| `astro check` (TypeScript strict) | ✅ 0 errors, 0 warnings, 0 hints (141 files) |
| ESLint / Prettier | ✅ clean |
| Vitest unit tests | ✅ 22 / 22 |
| Playwright e2e (desktop + mobile) | ✅ 16 / 16 |
| QA sweep (all pages × 2 viewports) | ✅ 129 pages, 0 issues (no console errors, no overflow, alt on every image, one h1, no duplicate ids) |
| JSON-LD validation | ✅ 306 nodes on 130 pages, 0 problems |
| Lighthouse CI budgets (9 URLs × 3 runs, median) | ✅ all assertions pass |

**Important:** products, photos and several business facts are placeholders. See `CONTENT_TODO.md`.

## Lighthouse scores

Measured locally with Lighthouse 13.6.0 (default mobile simulation: Moto G Power, slow 4G, 4× CPU;
desktop preset) against `astro preview`. Real-network results on Netlify/Cloudflare will differ slightly.

| Template | Device | Perf | A11y | BP | SEO | LCP | CLS | TBT | Page weight | JS |
|---|---|---|---|---|---|---|---|---|---|---|
| Home | mobile | 100 | 100 | 100 | 100 | 1.0 s | 0 | 0 ms | 171 KB | 7 KB |
| Home | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 214 KB | 7 KB |
| Shop | mobile | 100 | 100 | 100 | 100 | 1.0 s | 0 | 0 ms | 312 KB | 7 KB |
| Shop | desktop | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms | 199 KB | 7 KB |
| Category | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | 131 KB | 7 KB |
| Category | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 107 KB | 7 KB |
| Product | mobile | 100 | 100 | 100 | 100 | 1.9 s | 0 | 0 ms | 124 KB | 20 KB |
| Product | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 155 KB | 20 KB |
| Custom order | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | 98 KB | 23 KB |
| Custom order | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 98 KB | 23 KB |
| Gift guide | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | 148 KB | 7 KB |
| Gift guide | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 115 KB | 7 KB |
| Journal post | mobile | 100 | 100 | 100 | 100 | 1.8 s | 0 | 0 ms | 123 KB | 7 KB |
| Journal post | desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | 134 KB | 7 KB |
| Free pattern | mobile | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 ms | 99 KB | 7 KB |
| Free pattern | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 91 KB | 7 KB |
| Glossary | mobile | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | 81 KB | 7 KB |
| Glossary | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms | 81 KB | 7 KB |
| Bekasi | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms | 167 KB | 7 KB |
| Bekasi | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 125 KB | 7 KB |
| Home (EN) | mobile | 100 | 100 | 100 | 100 | 1.0 s | 0 | 0 ms | 216 KB | 7 KB |
| Home (EN) | desktop | 100 | 100 | 100 | 100 | 0.4 s | 0 | 0 ms | 214 KB | 7 KB |

Page weight is the full transfer for a first visit, including fonts (49 KB, cached afterwards) and images.
JS is all script transferred: 7 KB on most pages (view transitions + enhancements), 20 KB with the order
composer island and 23 KB with the custom-order builder. All under the 30 KB budget.

**Caveat on mobile LCP:** product (1.9 s) and journal (1.8 s) pages are the closest to the 2.0 s budget.
In a real browser their hero image paints at about 0.16 s. The simulated figure is driven by the bytes
that load before first paint (HTML + two fonts + the hero photo). Real product photos will be heavier
than the illustrated stand-ins, so **re-run `npm run lighthouse` after swapping in real photos**.
CI will flag it if the budget is exceeded. If it is, export photos at 1600 px and quality ~80 before adding them.

## Performance work done

- Fraunces instanced to `opsz 72 + SOFT 100`, `wght 500–650 + WONK` kept, Latin subset: 121 KB → **28 KB**.
  Plus Jakarta Sans `wght 400–800`, Latin subset: 27 KB → **16 KB**. Both preloaded.
- Fallback fonts tuned from measured metrics (`size-adjust` 86.6% / 101.9%, ascent/descent overrides): **CLS 0**.
- Every image via `astro:assets` `<Picture>` (AVIF → WebP → JPG fallback), responsive widths, explicit width/height.
  Exactly one eager + `fetchpriority="high"` image per template (the page hero); everything else lazy.
- Islands hydrate only where needed: the order composer `client:idle` (so early taps aren't lost), the custom builder `client:visible`.
  Lightbox, filters, carousel, search, counter and cursor are small vanilla custom elements.
- Paper grain overlay replaced with a 7.7 KB PNG tile (no SVG filters or blend modes to repaint on scroll).
- Hash-based CSP generated at build (no `unsafe-inline` for scripts); long-lived immutable caching for `/_astro/*` and `/fonts/*`.

## Accessibility work done

- WCAG AA contrast: brand rose-clay (#C9776B, 3.1:1) and sage are used only for decoration and large text.
  Text uses rose-ink #9A4A3F (5.7:1) and sage-ink #4F6B4B (5.5:1). Fixed three contrast failures found by Lighthouse.
- Skip link, landmarks, one `h1` per page, labelled navs, breadcrumbs with `aria-current`.
- Focus rings styled as dashed stitch outlines, visible on every interactive element.
- Lightbox on native `<dialog>`: focus trap, Esc to close, ←/→ to navigate, Z to zoom, focus returns to the trigger.
- Filters and builder fully keyboard-operable, with `aria-live` status for result counts and the order summary.
- Every animation (stitch reveal, yarn drawing, parallax, cursor, counters, view transitions) is disabled with `prefers-reduced-motion`.
  The yarn is simply shown fully drawn.
- No information by colour alone: availability badges have text, links always have an underline, and colour swatches have names.

## JSON-LD validation summary

Validated by `npm run validate:jsonld` (structure, `@context`, and the properties Google requires for each type)
plus the unit tests for each builder. Counts across the built site:

| Type | Count | Where |
|---|---|---|
| Organization | 4 | Home ×2, About ×2 |
| WebSite (+ SearchAction) | 2 | Home ID / EN |
| Store (LocalBusiness) | 6 | Home, Bekasi, Contact (×2 languages) |
| Product + Offer / AggregateOffer | 24 | 12 products × 2 languages (shipping details, return policy, IDR) |
| ImageObject (creator, creditText) | 48 | 2 per product page |
| BreadcrumbList | 124 | every inner page |
| BlogPosting | 12 | journal posts |
| HowTo | 4 | free patterns |
| DefinedTermSet / DefinedTerm | 2 / 22 | glossary hub / major-term pages |
| FAQPage | 20 | FAQ, category pages, custom order, Bekasi |
| ItemList | 38 | shop, category, gift-guide, journal and pattern pages |

`AggregateRating` and `Review` are **not emitted anywhere**, because there are no real reviews yet. The
3 sample testimonials are excluded from production by design.

Not done: the official Google Rich Results Test and the schema.org validator are web tools that need the
site to be online. Run them on a product page, a journal post and the home page after the first deploy.
Known expected warning: `Store` has no `streetAddress` because the studio is a home address that isn't
published. Google accepts this for service-area businesses.

## What was built

- 130 pages: 64 per language + 2 × 404 (ID page plus a language-aware EN 404 via `_redirects`).
- Home, Shop (URL-param filters, `noindex` on filtered states, canonical stays clean), 7 categories, 12 products,
  custom-order builder with live colour preview, gift-guide hub + 8 occasion pages, Bekasi local page, About,
  Journal (6 posts × 2), Free patterns (2 × 2, print stylesheet), Crochet glossary (25 terms, 11 term pages),
  Care guide, Size guide, FAQ (20), Shipping & Returns, Privacy, Terms, Contact, Search, Thank-you, 404.
- Endpoints: per-page 1200×630 OG images (satori + resvg), RSS ×2, `sitemap-index.xml` with hreflang alternates,
  `robots.txt`, `llms.txt`, search index ×2, security `_headers`.
- Deliverables: `IMAGE_MAP.md`, `KEYWORD_MAP.md`, `LOCAL_SEO_CHECKLIST.md`, `CONTENT_TODO.md`, `README.md`, this report.

## Assumptions made

1. **Photos:** `src/assets/raw/` was empty. 12 illustrated stand-ins (+ close-up variants) were generated in
   the brand palette and named as if they were the real photos. IMAGE_MAP describes the intended photos.
2. **Products:** the 12 products, prices, sizes, variants and stock levels are invented to match the stand-ins.
3. **Business facts** given by you: domain lovelycrochet.shop (others redirect), WhatsApp +62 812-9676-1659,
   founder "Admin Simpul Mungil", no workshops. Everything else in `site.ts` marked `PLACEHOLDER` is assumed.
4. **Policies** (DP 50%, 3-day exchange, 48-hour damage report, 20% priority fee, 14.00 WIB cut-off, lead times) are assumptions.
5. **Social and marketplace links** are left empty (`null`) rather than guessed, so those buttons are hidden.
6. **Testimonials and Stitch Counter numbers** are never fabricated: production hides them until real data exists.
7. **Workshops:** not offered, so no workshop page or Course/Event schema.
8. **No separate Jakarta/Depok/Bogor/Tangerang pages** (doorway-page risk). Their delivery times live on `/bekasi/`.
9. **Deploy target:** Netlify (Forms for the newsletter). Cloudflare Pages notes are in the README.
10. **Analytics:** Plausible, cookie-less, wired up but **disabled** until the account exists, so no cookie notice is needed.
11. **Lead magnet:** the mini tulip pattern is public. The newsletter form leads to a thank-you page that links to it.
12. **Payment and courier "logos"** are monochrome text wordmarks, not the companies' trademarked logos.
13. **Crochet terminology:** all patterns use US terms. The glossary shows US and UK equivalents.
14. **Custom-order prices** in `src/lib/custom-order.ts` are indicative "from" prices.
15. **Islands:** Preact for the order composer and the custom builder. Lightbox, filters and the rest are vanilla TS custom elements.
16. **Prices** are formatted `Rp 150.000` on both language versions (how Indonesian prices are written).
17. **Legal pages** reference UU No. 27/2022 (PDP). They are drafts, not legal advice.

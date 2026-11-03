# CONTENT_TODO

What is still an **estimate or placeholder** and needs your confirmation before launch.
Most facts live in one file: `src/config/site.ts`.

## ✅ Already real (from you)

WhatsApp +62 812-9676-1659 · email purnamaw689@gmail.com · Kota Bekasi · Monday–Saturday 09.00–18.00 WIB ·
BCA (+ QRIS and e-wallets) · founded 2026 · 50% deposit for pre-orders and custom orders · domain lovelycrochet.shop ·
founder name "Lovely Admin" · 8 product photos (AI-enhanced lighting, real pieces) · no workshops.

## 1. Prices: my estimates, please confirm

Estimated from typical handmade amigurumi prices in Jabodetabek. Check against similar Shopee shops, then edit `price:` and `variants:` in each file.

| Product | File | Size (estimate) | Price (estimate) | Lead time (estimate) |
|---|---|---|---|---|
| Gantungan Kunci Anjing | `src/content/products/gantungan-kunci-anjing-rajut.md` | ±10 cm | Rp 65.000 | 3–5 working days |
| Boneka Husky (with gift box) | `boneka-husky-rajut.md` | ±13 cm seated | Rp 145.000 | 5–7 working days |
| Boneka Penguin (blue or pink) | `boneka-penguin-rajut.md` | ±22 cm | Rp 189.000 / Rp 199.000 with box | 7–10 working days |
| Boneka Kelinci | `boneka-kelinci-rajut.md` | ±28 cm | Rp 199.000 | 7–10 working days |
| Boneka Hello Kitty (red or pink) | `boneka-hello-kitty-rajut.md` | ±25 cm | Rp 225.000 / Rp 235.000 with box | 7–10 working days |
| Boneka Donald Duck | `boneka-donald-duck-rajut.md` | ±30 cm | Rp 295.000 | 10–14 working days |

Also estimated: the custom-order "from" prices for bouquets, bags and clothing in `src/lib/custom-order.ts`,
and `site.priceRange` (Rp 65.000 – Rp 300.000).

## 2. Product details I assumed from the photos

- **Everything is Pre-Order.** If some dolls are ready stock, set `availability: ready` and `stock:` in that product file.
- **Exact sizes** (cm) and **weights** (`weightGrams`, used for shipping estimates).
- **Yarn type:** all products say `fiber: cotton-milk` and hook 2.5 mm. Change if you use something else.
- **Plastic eyes → "not for children under 3"** on every doll. If you also offer embroidered (baby-safe) eyes, tell me and I'll add it as an option.
- **Gift box:** Hello Kitty and Penguin have a "with gift box" option (+Rp 10.000); Husky always comes boxed. Adjust if different.

## 3. Categories without photos yet

Bouquets, Bags and Clothing show a labelled **illustration** and a "photos coming soon, order custom" panel.
Their intro text describes typical pieces (e.g. lined bags, fringed clothing, campus-colour bouquets). Please check it matches what you actually make,
and send photos when you have them: they become real products the same way the dolls did.
Accessories currently means keychains only. If you also sell scrunchies, headbands or clips, tell me.

## 4. Not provided yet (hidden on the site until set)

| What | Where | Status |
|---|---|---|
| Instagram / TikTok / Pinterest | `site.social` | `null` → links hidden |
| Shopee / Tokopedia / TikTok Shop | `site.marketplaces` | `null` → buttons hidden |
| Kecamatan / street / postal code | `site.address` | city only ("Kota Bekasi") |
| Map pin | `site.geo`, `site.mapsUrl` | approximate centre of Kota Bekasi. Use your Google Business Profile pin later |
| Testimonials | `src/content/testimonials.yaml` | only 3 dev-only samples. Add real reviews with permission |
| Stitch Counter numbers | `site.stats` | hidden until real numbers + `confirmed: true` |

## 5. Policies I assumed (appear in FAQ, shipping, terms and schema)

| Rule | Where | Assumed value |
|---|---|---|
| Same-day cut-off for ready stock | `site.shipping.sameDayCutoff` | 14.00 WIB |
| Shipping cost range (schema only) | `site.shipping.domesticRate*` | Rp 10.000 – 75.000 |
| Exchange window (ready stock) | `site.returns`, FAQ, shipping page | 3 days |
| Damage report window | same | 48 hours, unboxing video |
| Priority (rush) fee | FAQ, custom page, terms | 20% |
| Free alteration of made-to-measure clothing | size guide, shipping, category FAQ | once |
| Revisions | FAQ, custom page, terms | 2 free at design stage |
| Order deadlines (Valentine 7 Feb, Hari Ibu early Dec, Lebaran 3 weeks before) | `src/content/occasions.yaml` | as written |
| Same-day delivery times per area | `src/views/BekasiView.astro` (`areas`) | 1–4 hours |
| International shipping | FAQ, shipping page | on request |

## 6. Written by me, please rewrite in your own words

- **About page story** (`src/views/AboutView.astro`): how LovelyCrochet started is invented. Tell me your real story (a few sentences is enough).
- **Hours of work per piece** (journal post "Berapa jam merajut satu boneka", process section): estimates. Adjust to your experience.

## 7. Before going live

- **Analytics:** create a Plausible site, then set `site.analytics.enabled = true`.
- **Newsletter:** Netlify Forms activates on the first Netlify deploy. Turn on email notifications.
- **Domain:** connect `lovelycrochet.shop` (registered at AnymHost) to your host. www redirects to the bare domain.
- **Legal pages:** `src/content/pages/*/privacy.md` and `terms.md` are drafts referencing UU PDP No. 27/2022, not legal advice.
- **Character dolls** (Hello Kitty, Donald Duck) are trademarked characters. You chose to sell them; be aware marketplaces or rights holders may ask for removal.
- **Photos:** current photos are 896 × 1195 px. Higher-resolution originals (1600 px+) will look sharper on big screens.

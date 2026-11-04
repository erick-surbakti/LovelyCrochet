# LOCAL_SEO_CHECKLIST: Simpul Mungil, Bekasi

Work through this once at launch, then revisit the monthly items.

## 1. NAP: keep it identical everywhere

Use exactly this, character for character, on the website, Google, Bing, Apple, marketplaces and social bios:

```
Simpul Mungil
Kota Bekasi, Jawa Barat, Indonesia
+62 812-9676-1659
https://lovelycrochet.shop
```

The website footer, Contact page and `Store` schema all read from `src/config/site.ts`, so change it there
and nowhere else. If you publish a street address on Google, add the same one to `site.address.publicStreet`.

## 2. Google Business Profile (GBP)

- [ ] Create or claim the profile at business.google.com with the NAP above.
- [ ] **Business type:** "Service-area business". Hide the home address and list service areas:
      Kota Bekasi, Kabupaten Bekasi, Jakarta, Depok, Bogor, Tangerang.
- [ ] **Primary category:** *Toko Kerajinan* / *Craft store*.
      **Additional:** *Toko Hadiah* / *Gift shop*, *Toko Bunga* / *Florist* (only if you want bouquet searches), *Toko Mainan* / *Toy store*.
- [ ] **Hours:** match `site.hours` (chat response hours) and add special hours for public holidays and Lebaran.
- [ ] **Website:** `https://lovelycrochet.shop/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- [ ] **Messaging / WhatsApp:** add the WhatsApp number as the chat link.
- [ ] **Description (750 chars):** say "rajutan handmade", "buket bunga rajut", "Bekasi", "same-day Jabodetabek". No keyword stuffing.
- [ ] **Products:** add every product with photo, price in IDR and a link to its `/produk/…/` page.
- [ ] **Photos:** at least 10 at launch (products, process, packaging, logo, cover). Add 2–4 new ones every month.
- [ ] **Posts:** one post a week. Rotate new products, gift-guide seasons (wisuda Feb–Apr & Aug–Oct, Valentine, Hari Ibu, Lebaran) and free patterns.
- [ ] **Q&A:** seed 5 real questions from the FAQ (ordering, same-day, custom, payment, care) and answer them.
- [ ] Put the GBP share link in `site.mapsUrl`, and the exact pin coordinates in `site.geo`.

## 3. Review request flow (WhatsApp)

1. When the courier marks the parcel delivered, wait 2–3 days.
2. Send this template (edit the name and product):

   > Halo Kak {nama}! Semoga {produk}-nya sudah sampai dengan selamat dan disukai 🧶
   > Kalau berkenan, boleh bantu kami dengan ulasan singkat di Google? Sangat membantu usaha kecil kami:
   > {link ulasan GBP}
   > Terima kasih banyak!

3. Never offer discounts or gifts in exchange for reviews (against Google's policy).
4. Reply to **every** review within 48 hours, good or bad, in the reviewer's language.
5. With the customer's permission, add the review to `src/content/testimonials.yaml` with `permission: true`.
   It then appears on the site and in `Review` / `AggregateRating` schema. **Never add reviews that weren't written by real customers.**

## 4. Citations and listings

| Platform | Status | Notes |
|---|---|---|
| Google Business Profile | [ ] | See above |
| Google Maps (same as GBP) | [ ] | Check the pin location and service area |
| Bing Places for Business | [ ] | Import directly from GBP |
| Apple Business Connect | [ ] | Free, shows in Apple Maps / Siri |
| Waze (via GBP) | [ ] | Only if you publish a pickup address |
| Instagram business profile | [ ] | Category "Craft Store", same NAP, link to website |
| TikTok business account | [ ] | Same NAP in bio |
| Pinterest business account | [ ] | Claim `lovelycrochet.shop`; the site already adds Pinterest descriptions to images |
| Facebook Page | [ ] | Optional, still used for local search signals |

## 5. Marketplace consistency (Shopee, Tokopedia, TikTok Shop)

- [ ] Store name exactly **Simpul Mungil**.
- [ ] Location set to **Kota Bekasi**.
- [ ] Same logo, same product names and the same photos as the website.
- [ ] Store description links to `lovelycrochet.shop` where allowed.
- [ ] Prices consistent with the website (or explain the difference: marketplace fees).
- [ ] Add each store URL to `site.marketplaces` so product pages link to it, with UTM tags added automatically.

## 6. Search Console and Bing Webmaster Tools

- [ ] Verify `https://lovelycrochet.shop` in Google Search Console (DNS TXT record).
- [ ] Submit `https://lovelycrochet.shop/sitemap-index.xml`.
- [ ] Do the same in Bing Webmaster Tools (it can import from Search Console).
- [ ] Use URL Inspection on `/`, `/bekasi/` and 2 product pages and request indexing.
- [ ] After 4–6 weeks, check Performance → Queries against `KEYWORD_MAP.md` and adjust copy.

## 7. Monthly

- [ ] 4 GBP posts, 2–4 new photos.
- [ ] Answer all new reviews and Q&A.
- [ ] One new journal post or free pattern (topic ideas in KEYWORD_MAP.md).
- [ ] Check Search Console → Pages for errors, and Enhancements for Product / Breadcrumb / FAQ warnings.
- [ ] Re-check NAP on all listings after any change.

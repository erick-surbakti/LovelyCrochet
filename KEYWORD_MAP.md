# KEYWORD_MAP

One primary search intent per URL. When two pages could fight for the same query, the
**Cannibalisation guard** column says which page owns it and how the other one links to it.

Volumes are not shown: they need a paid tool (Ahrefs/Semrush/Google Keyword Planner) and must not be
guessed. After launch, check Google Search Console → Performance after 4–6 weeks and move secondary
keywords between pages if a URL ranks for something it does not own.

Legend: **T** = transactional, **C** = commercial investigation, **I** = informational, **L** = local, **N** = navigational.

## Indonesian (`/`)

| URL | Primary keyword | Secondary / long-tail | Intent | Cannibalisation guard |
|---|---|---|---|---|
| `/` | crochet bekasi | simpul mungil, rajutan handmade, toko rajut online, kado rajut handmade | N / L | Home targets the brand + broad "crochet bekasi". The local service intent lives on `/bekasi/`; Home links to it with the anchor "rajutan Bekasi". |
| `/bekasi/` | rajutan bekasi | crochet & rajutan handmade di bekasi, buket rajut bekasi same day, kado handmade bekasi, toko rajut bekasi selatan | L / T | Owns all "…bekasi" local queries except the bouquet one below. |
| `/koleksi/` | rajutan handmade | jual rajutan, produk rajut, crochet handmade indonesia | T | Filtered states (`?warna=`, `?harga=`…) are `noindex` + canonical to `/koleksi/`. |
| `/koleksi/buket-bunga-rajut/` | buket bunga rajut | buket bunga rajut bekasi, bunga rajut abadi, buket rajut murah, bunga flanel vs rajut | T | Owns "buket bunga rajut bekasi" (category + local paragraph). `/bekasi/` links here for bouquets. |
| `/koleksi/boneka-rajut/` | boneka rajut | boneka rajut custom, amigurumi custom indonesia, boneka amigurumi | T | Owns "boneka rajut custom"; custom page targets the process, not the product type. |
| `/koleksi/tas-rajut/` | tas rajut handmade | tas rajut wanita, tas rajut granny square, tote bag rajut | T | — |
| `/koleksi/aksesoris-rajut/` | gantungan kunci rajut | gantungan kunci boneka rajut, keychain rajut, suvenir rajut | T | Owns plural "gantungan kunci rajut" (browse intent); the product page owns the specific design. |
| `/koleksi/renda-rajut/` | renda rajut | renda rajut untuk baju, kerah renda rajut, renda kebaya handmade | T | — |
| `/produk/boneka-hello-kitty-rajut/` | boneka hello kitty rajut | hello kitty rajut, amigurumi hello kitty, boneka rajut karakter | T | Category owns the generic "boneka rajut" query. |
| `/produk/boneka-donald-duck-rajut/` | boneka donald duck rajut | donald duck rajut, amigurumi donald duck | T | — |
| `/produk/boneka-penguin-rajut/` | boneka penguin rajut | amigurumi penguin, boneka penguin rajut pink | T | — |
| `/produk/boneka-kelinci-rajut/` | boneka kelinci rajut | amigurumi kelinci, boneka kelinci rajut besar | T | — |
| `/produk/boneka-husky-rajut/` | boneka husky rajut | amigurumi anjing husky, boneka anjing rajut | T | — |
| `/produk/gantungan-kunci-anjing-rajut/` | gantungan kunci boneka rajut | gantungan kunci anjing rajut, keychain rajut | T | Category owns plural "gantungan kunci rajut"; the pattern owns "pola gantungan kunci". |
| `/pesanan-custom/` | rajutan custom | pesan rajutan custom, crochet custom nama, boneka rajut sesuai foto | T | Process + builder; product-type pages link here with "bisa custom". |
| `/hadiah/` | kado handmade | ide kado rajut, kado unik handmade | C | Hub only; each occasion page owns its own query. |
| `/hadiah/kado-wisuda/` | kado wisuda unik | buket wisuda rajut bekasi, hadiah wisuda handmade | C / T | Journal post #3 targets the informational "ide kado wisuda" list and links here. |
| `/hadiah/kado-ulang-tahun/` | kado ulang tahun handmade | kado ulang tahun pacar, kado ultah sahabat unik | C | — |
| `/hadiah/kado-anniversary/` | kado anniversary handmade | kado anniversary pacar, kado anniversary pernikahan | C | — |
| `/hadiah/kado-valentine/` | kado valentine handmade | bunga rajut valentine, kado valentine unik | C | — |
| `/hadiah/kado-hari-ibu/` | kado hari ibu | kado hari ibu 22 desember, kado untuk ibu handmade | C | — |
| `/hadiah/hampers-lebaran/` | hampers lebaran rajut | hampers lebaran unik, parcel lebaran handmade | C / T | — |
| `/hadiah/kado-baby-shower/` | kado baby shower | kado lahiran unik, hadiah bayi baru lahir | C | — |
| `/hadiah/kado-korporat/` | souvenir perusahaan handmade | corporate gift rajut, suvenir kantor custom logo | C / T | — |
| `/jurnal/` | blog rajut | tips merajut, artikel crochet | I | Hub. |
| `/jurnal/jenis-benang-rajut-untuk-pemula/` | jenis benang rajut | benang cotton milk, benang rajut untuk pemula, benang acrylic vs katun | I | Care guide owns washing per fiber; this post owns choosing yarn. |
| `/jurnal/cara-merawat-barang-rajutan/` | cara merawat tas rajut | cara mencuci rajutan, cara merawat boneka rajut | I | Care guide is the reference table; this post is the narrative how-to and links to it. Canonical owner of "cara merawat tas rajut". |
| `/jurnal/ide-kado-wisuda-unik/` | ide kado wisuda | 15 ide kado wisuda, kado wisuda untuk pacar | I / C | Links to `/hadiah/kado-wisuda/` as the buying page. |
| `/jurnal/cara-merajut-untuk-pemula/` | cara merajut untuk pemula | tusuk dasar rajut, belajar merajut, cara pegang hakpen | I | Glossary term pages own single-stitch definitions ("tusuk tunggal adalah…"). |
| `/jurnal/berapa-jam-merajut-boneka/` | berapa lama merajut boneka | proses membuat amigurumi, harga boneka rajut mahal kenapa | I | — |
| `/jurnal/rajutan-tangan-vs-pabrik/` | rajutan tangan vs mesin | ciri rajutan handmade, cara membedakan crochet asli | I / C | — |
| `/pola-gratis/` | pola rajut gratis | pola crochet gratis bahasa indonesia, pola rajut pemula | I | Hub. |
| `/pola-gratis/pola-tulip-mini/` | pola tulip rajut | cara membuat bunga tulip rajut, pola bunga rajut | I | Product page owns "buket tulip rajut" (buy intent). |
| `/pola-gratis/pola-gantungan-kunci-hati/` | pola gantungan kunci hati rajut | cara membuat gantungan kunci rajut | I | — |
| `/kamus-rajut/` | istilah rajut | singkatan pola rajut, istilah crochet us uk | I | Hub; term pages own each term. |
| `/kamus-rajut/{term}/` (11 pages) | e.g. "tusuk tunggal", "magic ring", "hakpen" | "{term} adalah", "{term} crochet" | I | One page per major term only; minor terms live as anchors on the hub (no thin pages). |
| `/panduan-perawatan/` | cara mencuci rajutan | merawat benang cotton milk, menjemur rajutan | I | See journal #2 guard. |
| `/panduan-ukuran/` | ukuran cardigan rajut | ukuran tas rajut, ukuran bucket hat | I | — |
| `/tentang-kami/` | simpul mungil | perajin rajut bekasi | N | — |
| `/faq/` | cara pesan rajutan | ongkir rajutan, pembayaran qris rajutan | I / N | — |
| `/pengiriman-pengembalian/` | pengiriman rajutan | same day bekasi, kebijakan retur | N | — |
| `/kontak/` | kontak simpul mungil | whatsapp simpul mungil | N | — |

Not created on purpose: separate Jakarta/Depok/Bogor/Tangerang area pages. Their only unique facts
(delivery time and courier) fit in one table on `/bekasi/` and `/pengiriman-pengembalian/`; separate pages
would be thin doorway pages. Add one only when there is genuinely local content (a pop-up stall, a partner
shop, a workshop venue).

`/kelas-merajut/` (keyword "kelas merajut bekasi") is not built because workshops are not offered. When
they start, set `workshops: true` in `src/config/site.ts`, build the page and add it here.

## English (`/en/`)

| URL | Primary keyword | Secondary | Intent |
|---|---|---|---|
| `/en/` | handmade crochet indonesia | crochet gifts bekasi, simpul mungil | N / L |
| `/en/bekasi/` | crochet bekasi | handmade crochet jakarta delivery, crochet shop bekasi | L |
| `/en/shop/` | handmade crochet shop | buy crochet indonesia | T |
| `/en/shop/crochet-flower-bouquets/` | crochet flower bouquet | everlasting crochet flowers, crochet bouquet jakarta | T |
| `/en/shop/amigurumi-dolls/` | custom amigurumi | amigurumi indonesia, crochet doll | T |
| `/en/shop/crochet-bags/` | handmade crochet bag | granny square bag, crochet tote | T |
| `/en/shop/crochet-accessories/` | crochet keychain | crochet doll keychain | T |
| `/en/shop/crochet-lace/` | crochet lace trim | crochet lace collar, handmade lace for clothes | T |
| `/en/products/{slug}/` | product name, e.g. "crochet hello kitty doll" | product + "handmade" | T |
| `/en/custom-order/` | custom crochet order | custom amigurumi from photo | T |
| `/en/gifts/` | handmade gift ideas indonesia | — | C |
| `/en/gifts/graduation-gifts/` | unique graduation gift | crochet graduation bouquet | C |
| `/en/gifts/birthday-gifts/` | handmade birthday gift | — | C |
| `/en/gifts/anniversary-gifts/` | handmade anniversary gift | — | C |
| `/en/gifts/valentines-day-gifts/` | handmade valentine gift | crochet flowers valentine | C |
| `/en/gifts/mothers-day-gifts/` | mothers day gift indonesia | hari ibu 22 december | C |
| `/en/gifts/eid-hampers/` | eid hampers indonesia | lebaran hampers handmade | C |
| `/en/gifts/baby-shower-gifts/` | handmade baby shower gift | — | C |
| `/en/gifts/corporate-gifts/` | custom corporate gifts indonesia | — | C |
| `/en/journal/yarn-types-for-beginners/` | types of crochet yarn | milk cotton yarn | I |
| `/en/journal/how-to-care-for-crochet/` | how to wash crochet | how to care for crochet bag | I |
| `/en/journal/unique-graduation-gift-ideas/` | unique graduation gift ideas | — | I |
| `/en/journal/crochet-for-beginners-basic-stitches/` | crochet for beginners | basic crochet stitches | I |
| `/en/journal/how-long-to-crochet-amigurumi/` | how long does amigurumi take | — | I |
| `/en/journal/handmade-vs-machine-crochet/` | handmade vs machine crochet | can crochet be machine made | I |
| `/en/free-patterns/` | free crochet patterns | — | I |
| `/en/free-patterns/mini-tulip-pattern/` | crochet tulip pattern | — | I |
| `/en/free-patterns/heart-keychain-pattern/` | crochet heart keychain pattern | — | I |
| `/en/crochet-glossary/` | crochet terms us uk | crochet abbreviations | I |
| `/en/crochet-glossary/{term}/` | e.g. "magic ring crochet" | "{term} indonesian" | I |
| `/en/care-guide/`, `/en/size-guide/`, `/en/about/`, `/en/faq/`, `/en/shipping-returns/`, `/en/contact/` | as the page name | — | I / N |

## Sitemap (both languages, trailing slashes)

```
/                                   /en/
/bekasi/                            /en/bekasi/
/koleksi/                           /en/shop/
/koleksi/{5 categories}/            /en/shop/{5 categories}/
/produk/{6 products}/               /en/products/{6 products}/
/pesanan-custom/                    /en/custom-order/
/hadiah/                            /en/gifts/
/hadiah/{8 occasions}/              /en/gifts/{8 occasions}/
/tentang-kami/                      /en/about/
/jurnal/                            /en/journal/
/jurnal/{6 posts}/                  /en/journal/{6 posts}/
/pola-gratis/                       /en/free-patterns/
/pola-gratis/{2 patterns}/          /en/free-patterns/{2 patterns}/
/kamus-rajut/                       /en/crochet-glossary/
/kamus-rajut/{11 terms}/            /en/crochet-glossary/{11 terms}/
/panduan-perawatan/                 /en/care-guide/
/panduan-ukuran/                    /en/size-guide/
/faq/                               /en/faq/
/pengiriman-pengembalian/           /en/shipping-returns/
/kebijakan-privasi/                 /en/privacy-policy/
/syarat-ketentuan/                  /en/terms/
/kontak/                            /en/contact/
/cari/  (noindex)                   /en/search/  (noindex)
/404.html (noindex)                 /en/404.html (noindex)
```

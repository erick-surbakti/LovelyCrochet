/**
 * Route table. Indonesian slugs live at `/`, English slugs at `/en/`.
 * Every page resolves its twin through these helpers, so the language switcher
 * and hreflang tags always point at the translated page, not the home page.
 */

export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export const htmlLang: Record<Locale, string> = { id: 'id-ID', en: 'en' };
export const ogLocale: Record<Locale, string> = { id: 'id_ID', en: 'en_US' };
export const intlLocale: Record<Locale, string> = { id: 'id-ID', en: 'en-GB' };

/** Static pages: key → slug per locale (no leading/trailing slash, '' = root). */
export const staticRoutes = {
  home: { id: '', en: '' },
  shop: { id: 'koleksi', en: 'shop' },
  custom: { id: 'pesanan-custom', en: 'custom-order' },
  gifts: { id: 'hadiah', en: 'gifts' },
  about: { id: 'tentang-kami', en: 'about' },
  journal: { id: 'jurnal', en: 'journal' },
  patterns: { id: 'pola-gratis', en: 'free-patterns' },
  glossary: { id: 'kamus-rajut', en: 'crochet-glossary' },
  care: { id: 'panduan-perawatan', en: 'care-guide' },
  size: { id: 'panduan-ukuran', en: 'size-guide' },
  faq: { id: 'faq', en: 'faq' },
  shipping: { id: 'pengiriman-pengembalian', en: 'shipping-returns' },
  privacy: { id: 'kebijakan-privasi', en: 'privacy-policy' },
  terms: { id: 'syarat-ketentuan', en: 'terms' },
  contact: { id: 'kontak', en: 'contact' },
  bekasi: { id: 'bekasi', en: 'bekasi' },
  search: { id: 'cari', en: 'search' },
  thanks: { id: 'terima-kasih', en: 'thank-you' },
} as const;

export type StaticRouteKey = keyof typeof staticRoutes;

/** Prefixes for collection detail pages. */
export const collectionBases = {
  category: { id: 'koleksi', en: 'shop' },
  product: { id: 'produk', en: 'products' },
  occasion: { id: 'hadiah', en: 'gifts' },
  journal: { id: 'jurnal', en: 'journal' },
  pattern: { id: 'pola-gratis', en: 'free-patterns' },
  term: { id: 'kamus-rajut', en: 'crochet-glossary' },
} as const;

export type CollectionBaseKey = keyof typeof collectionBases;

const localePrefix = (locale: Locale): string => (locale === defaultLocale ? '' : `/${locale}`);

const join = (...parts: string[]): string => {
  const path = parts.filter(Boolean).join('/');
  return path ? `/${path}/` : '/';
};

/** Path of a static page, e.g. path('shop', 'en') → '/en/shop/'. */
export function path(key: StaticRouteKey, locale: Locale): string {
  return `${localePrefix(locale)}${join(staticRoutes[key][locale])}`.replace(/\/{2,}/g, '/');
}

/** Path of a collection entry, e.g. entryPath('product', 'id', 'buket-tulip') → '/produk/buket-tulip/'. */
export function entryPath(base: CollectionBaseKey, locale: Locale, slug: string): string {
  return `${localePrefix(locale)}${join(collectionBases[base][locale], slug)}`;
}

export type Alternates = Record<Locale, string>;

export const staticAlternates = (key: StaticRouteKey): Alternates => ({
  id: path(key, 'id'),
  en: path(key, 'en'),
});

export const otherLocale = (locale: Locale): Locale => (locale === 'id' ? 'en' : 'id');

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

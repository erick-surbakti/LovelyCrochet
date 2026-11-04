/**
 * Simpul Mungil — single source of truth for business facts.
 *
 * Every page, the footer, the contact page, JSON-LD schema and the WhatsApp
 * links read from this file. Edit a value here and it changes everywhere.
 *
 * Values marked `// PLACEHOLDER` were not supplied yet and are listed in
 * /CONTENT_TODO.md. `null` means "not set": the related UI is hidden instead of
 * linking somewhere wrong.
 */

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OpeningHours {
  days: Weekday[];
  opens: string; // HH:mm, WIB
  closes: string; // HH:mm, WIB
}

export const site = {
  name: 'Simpul Mungil',
  legalName: 'Simpul Mungil',
  /** Canonical origin (domain registered at AnymHost). www redirects here. */
  url: 'https://lovelycrochet.shop',
  /** Other domains you own that should 301-redirect to `url` (none yet). */
  alternateDomains: [] as string[],
  founder: 'Admin Simpul Mungil',
  foundingYear: 2026,
  email: 'purnamaw689@gmail.com',

  phone: {
    /** E.164, used in schema and tel: links */
    e164: '+6281296761659',
    /** Human format, shown on the site */
    display: '+62 812-9676-1659',
    /** wa.me format: country code + number, digits only */
    whatsapp: '6281296761659',
  },

  address: {
    /** Home studio: no street address is published. Schema shows city level only. */
    publicStreet: null as string | null,
    /** Shown publicly. Only the city was given, so no kecamatan is published. */
    district: null as string | null,
    city: 'Kota Bekasi',
    region: 'Jawa Barat',
    postalCode: null as string | null,
    country: 'ID',
    countryName: 'Indonesia',
  },

  /** Approximate centre of Kota Bekasi, used for schema `geo`. Replace with your Google Business Profile pin. */
  geo: { latitude: -6.2383, longitude: 106.9756 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kota+Bekasi%2C+Jawa+Barat',

  timezone: 'Asia/Jakarta',
  timezoneLabel: 'WIB',
  currency: 'IDR',

  /** Chat response hours (WIB). */
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00' },
  ] satisfies OpeningHours[],

  /** Made-to-order lead time in working days (estimate: keychains 3–5, small dolls 5–7, large dolls 7–14). */
  leadTime: { minDays: 3, maxDays: 14 },
  /** Deposit for pre-orders and custom orders, percent of the agreed price. */
  depositPercent: 50,
  priceRange: 'Rp 65.000 – Rp 300.000',

  areaServed: ['Kota Bekasi', 'Kabupaten Bekasi', 'Jakarta', 'Depok', 'Bogor', 'Tangerang', 'Indonesia'],
  sameDayAreas: [
    'Bekasi Barat',
    'Bekasi Timur',
    'Bekasi Selatan',
    'Bekasi Utara',
    'Jatiasih',
    'Pondok Gede',
    'Harapan Indah',
    'Summarecon Bekasi',
    'Grand Galaxy',
    'Cikarang',
    'Tambun',
  ],

  payment: {
    qris: true,
    banks: ['BCA'],
    ewallets: ['GoPay', 'OVO', 'DANA', 'ShopeePay'],
  },
  couriers: ['JNE', 'J&T', 'SiCepat', 'AnterAja'],
  sameDayCouriers: ['GoSend', 'GrabExpress'],

  /** Shipping facts used on the shipping page and in Offer.shippingDetails. PLACEHOLDER ranges */
  shipping: {
    /** Order paid before this time (WIB) ships the same day (ready stock). */
    sameDayCutoff: '14:00',
    /** Typical domestic courier cost range, IDR. Real rate is quoted per order. */
    domesticRateMin: 10000,
    domesticRateMax: 75000,
    /** Courier transit time in days within Indonesia. */
    transitDays: [1, 5] as const,
    /** Handling time for ready stock, in days. */
    readyHandlingDays: [0, 1] as const,
  },

  /** Return policy (see /pengiriman-pengembalian/). PLACEHOLDER */
  returns: {
    readyStockExchangeDays: 3,
    damageReportHours: 48,
  },

  /** Social profiles. `null` hides the link and leaves it out of schema `sameAs`. */
  social: {
    instagram: null as string | null, // PLACEHOLDER
    tiktok: null as string | null, // PLACEHOLDER
    pinterest: null as string | null, // PLACEHOLDER
  },

  /** Marketplace storefronts. `null` hides the button. */
  marketplaces: {
    shopee: null as string | null, // PLACEHOLDER
    tokopedia: null as string | null, // PLACEHOLDER
    tiktokShop: null as string | null, // PLACEHOLDER
  },

  /** Workshop / kelas merajut is not offered right now. */
  workshops: false,

  /**
   * Stitch Counter numbers. They are only shown in production when
   * `confirmed` is true, so the site never publishes invented metrics.
   */
  stats: {
    confirmed: false,
    piecesMade: 1200, // PLACEHOLDER
    handworkHours: 9600, // PLACEHOLDER
    happyCustomers: 850, // PLACEHOLDER
    citiesShipped: 64, // PLACEHOLDER
  },

  /** Privacy-friendly, cookie-less analytics. Off until the Plausible site exists. */
  analytics: {
    enabled: false,
    provider: 'plausible' as const,
    domain: 'lovelycrochet.shop',
    scriptSrc: 'https://plausible.io/js/script.tagged-events.outbound-links.js',
  },

  /** Newsletter / WhatsApp-channel signup goes to Netlify Forms. */
  newsletter: {
    formName: 'newsletter',
    leadMagnetPattern: 'mini-tulip',
  },

  /** Photo credit used in ImageObject schema. */
  photoCredit: 'Simpul Mungil',
} as const;

export type Site = typeof site;

/** Public locality: "Kecamatan, Kota" when a kecamatan is set, otherwise just the city. */
export const locality: string = site.address.district
  ? `${site.address.district}, ${site.address.city}`
  : site.address.city;

export const sameAs = (): string[] =>
  [site.social.instagram, site.social.tiktok, site.social.pinterest].filter((v): v is string => Boolean(v));

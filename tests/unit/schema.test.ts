import { describe, expect, it } from 'vitest';
import {
  blogPosting,
  breadcrumbList,
  definedTerm,
  definedTermSet,
  faqPage,
  graph,
  howTo,
  imageObject,
  localBusiness,
  organization,
  product,
  serialize,
  website,
  type ProductInput,
  type SiteFacts,
} from '@/lib/schema';

const site: SiteFacts = {
  name: 'Simpul Mungil',
  url: 'https://lovelycrochet.shop',
  email: 'halo@lovelycrochet.shop',
  telephone: '+6281296761659',
  logo: '/logo.png',
  image: '/og/index.png',
  description: 'Rajutan tangan dari Bekasi.',
  founder: 'Admin Simpul Mungil',
  foundingYear: 2021,
  address: {
    streetAddress: null,
    addressLocality: 'Bekasi Selatan, Kota Bekasi',
    addressRegion: 'Jawa Barat',
    postalCode: null,
    addressCountry: 'ID',
  },
  geo: { latitude: -6.25, longitude: 107 },
  areaServed: ['Kota Bekasi', 'Jakarta', 'Indonesia'],
  hours: [{ days: ['Monday', 'Saturday'], opens: '09:00', closes: '20:00' }],
  priceRange: 'Rp 25.000 – Rp 650.000',
  sameAs: [],
  paymentAccepted: ['QRIS', 'GoPay'],
  currency: 'IDR',
};

const baseProduct: ProductInput = {
  url: 'https://lovelycrochet.shop/produk/x/',
  name: 'Buket Tulip',
  description: 'desc',
  sku: 'LC-1',
  images: ['https://lovelycrochet.shop/a.jpg'],
  brand: 'Simpul Mungil',
  category: 'Buket',
  price: 185000,
  currency: 'IDR',
  availability: 'ready',
  shipping: { country: 'ID', rateMin: 10000, rateMax: 75000, handlingDays: [0, 1], transitDays: [1, 5] },
  returns: { days: 3, permitted: true, country: 'ID' },
  reviews: [],
  sellerId: 'https://lovelycrochet.shop/#store',
};

describe('organization / website / localBusiness', () => {
  it('builds an Organization with absolute logo and no empty sameAs', () => {
    const o = organization(site);
    expect(o['@type']).toBe('Organization');
    expect((o.logo as { url: string }).url).toBe('https://lovelycrochet.shop/logo.png');
    expect(o).not.toHaveProperty('sameAs');
  });

  it('adds a SearchAction only when a search path is given', () => {
    expect(website(site, { locale: 'id-ID' })).not.toHaveProperty('potentialAction');
    const w = website(site, { locale: 'id-ID', searchPath: '/cari/' });
    const action = w.potentialAction as { target: { urlTemplate: string } };
    expect(action.target.urlTemplate).toBe('https://lovelycrochet.shop/cari/?q={search_term_string}');
  });

  it('builds a Store without a street address for a home studio', () => {
    const s = localBusiness(site);
    expect(s['@type']).toBe('Store');
    const address = s.address as Record<string, unknown>;
    expect(address).not.toHaveProperty('streetAddress');
    expect(address).not.toHaveProperty('postalCode');
    expect(address.addressCountry).toBe('ID');
    const hours = s.openingHoursSpecification as { dayOfWeek: string[] }[];
    expect(hours[0]!.dayOfWeek).toEqual(['https://schema.org/Monday', 'https://schema.org/Saturday']);
    expect((s.areaServed as { '@type': string }[]).map((a) => a['@type'])).toEqual([
      'City',
      'AdministrativeArea',
      'Country',
    ]);
  });
});

describe('product', () => {
  it('uses Offer, InStock and IDR for a single-price ready item', () => {
    const p = product(baseProduct);
    const offer = p.offers as Record<string, unknown>;
    expect(offer['@type']).toBe('Offer');
    expect(offer.price).toBe(185000);
    expect(offer.priceCurrency).toBe('IDR');
    expect(offer.availability).toBe('https://schema.org/InStock');
    expect((offer.hasMerchantReturnPolicy as Record<string, unknown>).merchantReturnDays).toBe(3);
  });

  it('uses AggregateOffer for a price range and PreOrder + lead time for pre-orders', () => {
    const p = product({
      ...baseProduct,
      availability: 'preorder',
      leadTimeDays: [7, 10],
      priceRange: [125000, 245000],
    });
    const offer = p.offers as Record<string, unknown>;
    expect(offer['@type']).toBe('AggregateOffer');
    expect(offer.lowPrice).toBe(125000);
    expect(offer.highPrice).toBe(245000);
    expect(offer.availability).toBe('https://schema.org/PreOrder');
    const handling = (
      offer.shippingDetails as { deliveryTime: { handlingTime: { minValue: number; maxValue: number } } }
    ).deliveryTime.handlingTime;
    expect([handling.minValue, handling.maxValue]).toEqual([7, 10]);
  });

  it('marks returns as not permitted when returns are disabled', () => {
    const p = product({ ...baseProduct, returns: { days: 0, permitted: false, country: 'ID' } });
    const policy = (p.offers as Record<string, Record<string, unknown>>).hasMerchantReturnPolicy!;
    expect(policy.returnPolicyCategory).toBe('https://schema.org/MerchantReturnNotPermitted');
  });

  it('never emits rating properties without real reviews', () => {
    const p = product(baseProduct);
    expect(p).not.toHaveProperty('aggregateRating');
    expect(p).not.toHaveProperty('review');
  });

  it('computes AggregateRating from the reviews it is given', () => {
    const p = product({
      ...baseProduct,
      reviews: [
        { author: 'A.', rating: 5, body: 'Bagus', date: new Date('2026-01-01') },
        { author: 'B.', rating: 4, body: 'Rapi', date: new Date('2026-02-01') },
      ],
    });
    expect(p.aggregateRating).toMatchObject({ ratingValue: 4.5, reviewCount: 2 });
    expect((p.review as unknown[]).length).toBe(2);
  });
});

describe('other builders', () => {
  it('numbers breadcrumb items from 1 with absolute URLs', () => {
    const b = breadcrumbList(site.url, [
      { name: 'Beranda', path: '/' },
      { name: 'Koleksi', path: '/koleksi/' },
    ]);
    expect(b.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://lovelycrochet.shop/' },
      { '@type': 'ListItem', position: 2, name: 'Koleksi', item: 'https://lovelycrochet.shop/koleksi/' },
    ]);
  });

  it('builds BlogPosting with ISO dates and modified fallback', () => {
    const a = blogPosting({
      url: 'https://x/a/',
      headline: 'H',
      description: 'D',
      image: 'https://x/i.jpg',
      datePublished: new Date('2026-07-08T00:00:00Z'),
      author: 'Admin Simpul Mungil',
      locale: 'id-ID',
      publisherId: 'https://x/#organization',
    });
    expect(a.datePublished).toBe('2026-07-08T00:00:00.000Z');
    expect(a.dateModified).toBe(a.datePublished);
  });

  it('builds FAQPage, HowTo, DefinedTermSet and ImageObject', () => {
    expect(faqPage([{ q: 'Q?', a: 'A.' }]).mainEntity).toEqual([
      { '@type': 'Question', name: 'Q?', acceptedAnswer: { '@type': 'Answer', text: 'A.' } },
    ]);
    const h = howTo({
      url: 'https://x/p/',
      name: 'N',
      description: 'D',
      image: 'i',
      supplies: ['s'],
      tools: ['t'],
      steps: ['a', 'b'],
      locale: 'id-ID',
    });
    expect((h.step as { position: number }[]).map((s) => s.position)).toEqual([1, 2]);
    const term = {
      url: 'https://x/t/',
      name: 'Rantai',
      description: 'd',
      alternateNames: ['Chain'],
      setUrl: 'https://x/k/',
    };
    expect(definedTerm(term).inDefinedTermSet).toEqual({ '@id': 'https://x/k/#set' });
    expect((definedTermSet('https://x/k/', 'Kamus', [term]).hasDefinedTerm as unknown[]).length).toBe(1);
    const img = imageObject({
      url: 'u',
      caption: 'c',
      width: 1,
      height: 2,
      creator: 'Simpul Mungil',
      creditText: 'Simpul Mungil',
      pageUrl: 'p',
    });
    expect(img).toMatchObject({
      creditText: 'Simpul Mungil',
      creator: { '@type': 'Organization', name: 'Simpul Mungil' },
    });
  });

  it('wraps nodes in @graph and escapes < when serialising', () => {
    const doc = graph([{ '@type': 'Thing', name: '</script><b>' }]);
    expect(doc['@context']).toBe('https://schema.org');
    expect(serialize(doc)).not.toContain('</script>');
    expect(JSON.parse(serialize(doc))['@graph'][0].name).toBe('</script><b>');
  });
});

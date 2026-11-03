/**
 * JSON-LD builders. Pure functions: plain data in, schema.org objects out.
 * No Astro imports, so they are unit-tested with Vitest (tests/schema.test.ts).
 */

export type JsonLd = Record<string, unknown>;

export interface SiteFacts {
  name: string;
  url: string;
  email: string;
  telephone: string;
  logo: string;
  image: string;
  description: string;
  founder: string;
  foundingYear?: number;
  address: {
    streetAddress?: string | null;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string | null;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  areaServed: string[];
  hours: { days: string[]; opens: string; closes: string }[];
  priceRange: string;
  sameAs: string[];
  paymentAccepted: string[];
  currency: string;
}

const abs = (base: string, path: string): string => new URL(path, base).toString();

export const orgId = (site: Pick<SiteFacts, 'url'>) => `${site.url}/#organization`;
export const storeId = (site: Pick<SiteFacts, 'url'>) => `${site.url}/#store`;
export const websiteId = (site: Pick<SiteFacts, 'url'>) => `${site.url}/#website`;

export function organization(site: SiteFacts): JsonLd {
  return {
    '@type': 'Organization',
    '@id': orgId(site),
    name: site.name,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: abs(site.url, site.logo) },
    email: site.email,
    telephone: site.telephone,
    founder: { '@type': 'Person', name: site.founder },
    ...(site.foundingYear ? { foundingDate: String(site.foundingYear) } : {}),
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function website(site: SiteFacts, opts: { locale: string; searchPath?: string; name?: string }): JsonLd {
  const node: JsonLd = {
    '@type': 'WebSite',
    '@id': websiteId(site),
    name: opts.name ?? site.name,
    url: `${site.url}/`,
    inLanguage: opts.locale,
    publisher: { '@id': orgId(site) },
  };
  if (opts.searchPath) {
    node.potentialAction = {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${abs(site.url, opts.searchPath)}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    };
  }
  return node;
}

const AREA_TYPES: Record<string, string> = {
  Indonesia: 'Country',
  Jakarta: 'AdministrativeArea',
  'Kota Bekasi': 'City',
  'Kabupaten Bekasi': 'AdministrativeArea',
  Depok: 'City',
  Bogor: 'City',
  Tangerang: 'City',
};

export function localBusiness(site: SiteFacts): JsonLd {
  const { streetAddress, postalCode, ...address } = site.address;
  return {
    '@type': 'Store',
    '@id': storeId(site),
    name: site.name,
    url: `${site.url}/`,
    image: abs(site.url, site.image),
    logo: abs(site.url, site.logo),
    description: site.description,
    telephone: site.telephone,
    email: site.email,
    priceRange: site.priceRange,
    currenciesAccepted: site.currency,
    paymentAccepted: site.paymentAccepted.join(', '),
    address: {
      '@type': 'PostalAddress',
      ...(streetAddress ? { streetAddress } : {}),
      ...(postalCode ? { postalCode } : {}),
      ...address,
    },
    ...(site.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude } }
      : {}),
    areaServed: site.areaServed.map((name) => ({ '@type': AREA_TYPES[name] ?? 'Place', name })),
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    parentOrganization: { '@id': orgId(site) },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbList(siteUrl: string, crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(siteUrl, c.path),
    })),
  };
}

export interface ReviewInput {
  author: string;
  rating: number;
  body: string;
  date: Date;
}

export interface ProductInput {
  url: string;
  name: string;
  description: string;
  sku: string;
  images: string[];
  brand: string;
  category: string;
  price: number;
  /** Lowest and highest variant price, for AggregateOffer. */
  priceRange?: [number, number];
  currency: string;
  availability: 'ready' | 'preorder';
  /** Working days for pre-order. */
  leadTimeDays?: readonly [number, number];
  color?: string[];
  material?: string;
  weightGrams?: number;
  shipping: {
    country: string;
    rateMin: number;
    rateMax: number;
    handlingDays: readonly [number, number];
    transitDays: readonly [number, number];
  };
  returns: { days: number; permitted: boolean; country: string };
  reviews: ReviewInput[];
  sellerId: string;
}

export function product(p: ProductInput): JsonLd {
  const availability = p.availability === 'ready' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder';
  const handling = p.availability === 'ready' ? p.shipping.handlingDays : (p.leadTimeDays ?? p.shipping.handlingDays);

  const shippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      minValue: p.shipping.rateMin,
      maxValue: p.shipping.rateMax,
      currency: p.currency,
    },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: p.shipping.country },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: handling[0], maxValue: handling[1], unitCode: 'DAY' },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: p.shipping.transitDays[0],
        maxValue: p.shipping.transitDays[1],
        unitCode: 'DAY',
      },
    },
  };

  const returnPolicy = p.returns.permitted
    ? {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: p.returns.country,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: p.returns.days,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      }
    : {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: p.returns.country,
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      };

  const offerBase = {
    url: p.url,
    priceCurrency: p.currency,
    availability,
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': p.sellerId },
    shippingDetails,
    hasMerchantReturnPolicy: returnPolicy,
  };

  const offers =
    p.priceRange && p.priceRange[0] !== p.priceRange[1]
      ? {
          '@type': 'AggregateOffer',
          lowPrice: p.priceRange[0],
          highPrice: p.priceRange[1],
          offerCount: 2,
          ...offerBase,
        }
      : { '@type': 'Offer', price: p.price, ...offerBase };

  const node: JsonLd = {
    '@type': 'Product',
    '@id': `${p.url}#product`,
    name: p.name,
    description: p.description,
    sku: p.sku,
    image: p.images,
    brand: { '@type': 'Brand', name: p.brand },
    category: p.category,
    url: p.url,
    offers,
  };
  if (p.color?.length) node.color = p.color.join(', ');
  if (p.material) node.material = p.material;
  if (p.weightGrams) node.weight = { '@type': 'QuantitativeValue', value: p.weightGrams, unitCode: 'GRM' };

  // Ratings only from real testimonials. No reviews → no rating properties at all.
  if (p.reviews.length) {
    const avg = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(avg * 10) / 10,
      reviewCount: p.reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    node.review = p.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date.toISOString().slice(0, 10),
      reviewBody: r.body,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    }));
  }
  return node;
}

export interface ArticleInput {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  author: string;
  locale: string;
  wordCount?: number;
  publisherId: string;
}

export function blogPosting(a: ArticleInput): JsonLd {
  return {
    '@type': 'BlogPosting',
    '@id': `${a.url}#article`,
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished.toISOString(),
    dateModified: (a.dateModified ?? a.datePublished).toISOString(),
    author: { '@type': 'Person', name: a.author },
    publisher: { '@id': a.publisherId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    inLanguage: a.locale,
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
  };
}

export interface HowToInput {
  url: string;
  name: string;
  description: string;
  image: string;
  totalTime?: string;
  supplies: string[];
  tools: string[];
  steps: string[];
  locale: string;
}

/** Free patterns are step-by-step instructions: HowTo. */
export function howTo(h: HowToInput): JsonLd {
  return {
    '@type': 'HowTo',
    '@id': `${h.url}#howto`,
    name: h.name,
    description: h.description,
    image: h.image,
    inLanguage: h.locale,
    ...(h.totalTime ? { totalTime: h.totalTime } : {}),
    supply: h.supplies.map((name) => ({ '@type': 'HowToSupply', name })),
    tool: h.tools.map((name) => ({ '@type': 'HowToTool', name })),
    step: h.steps.map((text, i) => ({ '@type': 'HowToStep', position: i + 1, text })),
  };
}

export interface TermInput {
  url: string;
  name: string;
  description: string;
  alternateNames: string[];
  setUrl: string;
}

export function definedTerm(t: TermInput): JsonLd {
  return {
    '@type': 'DefinedTerm',
    '@id': `${t.url}#term`,
    name: t.name,
    description: t.description,
    url: t.url,
    ...(t.alternateNames.length ? { alternateName: t.alternateNames } : {}),
    inDefinedTermSet: { '@id': `${t.setUrl}#set` },
  };
}

export function definedTermSet(setUrl: string, name: string, terms: TermInput[]): JsonLd {
  return {
    '@type': 'DefinedTermSet',
    '@id': `${setUrl}#set`,
    name,
    url: setUrl,
    hasDefinedTerm: terms.map((t) => definedTerm(t)),
  };
}

export function faqPage(items: { q: string; a: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export interface ImageInput {
  url: string;
  caption: string;
  width: number;
  height: number;
  creator: string;
  creditText: string;
  pageUrl: string;
  license?: string;
}

export function imageObject(i: ImageInput): JsonLd {
  return {
    '@type': 'ImageObject',
    contentUrl: i.url,
    url: i.url,
    caption: i.caption,
    width: i.width,
    height: i.height,
    creator: { '@type': 'Organization', name: i.creator },
    creditText: i.creditText,
    copyrightNotice: `© ${i.creator}`,
    acquireLicensePage: i.pageUrl,
    ...(i.license ? { license: i.license } : {}),
  };
}

export function itemList(urls: { url: string; name: string }[]): JsonLd {
  return {
    '@type': 'ItemList',
    itemListElement: urls.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: u.url, name: u.name })),
  };
}

/** Wrap nodes in a single @graph document. */
export function graph(nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Serialise for a <script type="application/ld+json"> tag, safe against `</script>` injection. */
export function serialize(doc: JsonLd): string {
  return JSON.stringify(doc).replace(/</g, '\\u003c');
}

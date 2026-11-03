import { locality, sameAs, site } from '@/config/site';
import type { Locale } from '@/i18n/routes';
import { ui } from '@/i18n/ui';
import type { SiteFacts } from './schema';

/** Adapter: config → the plain object the schema builders expect. */
export function siteFacts(locale: Locale): SiteFacts {
  return {
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone.e164,
    logo: '/logo.png',
    image: '/og/index.png',
    description: ui[locale]['site.description'],
    founder: site.founder,
    foundingYear: site.foundingYear,
    address: {
      streetAddress: site.address.publicStreet,
      addressLocality: locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: site.geo,
    areaServed: [...site.areaServed],
    hours: site.hours.map((h) => ({ days: [...h.days], opens: h.opens, closes: h.closes })),
    priceRange: site.priceRange,
    sameAs: sameAs(),
    paymentAccepted: ['QRIS', 'Bank transfer', ...site.payment.ewallets],
    currency: site.currency,
  };
}

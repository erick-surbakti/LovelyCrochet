/**
 * Registry of every public page with a short label, used by the OG image
 * endpoint, the search index and llms.txt. Page views own their <title>.
 */
import { pageMeta } from '@/i18n/pageMeta';
import { locales, path, staticRoutes, type Locale, type StaticRouteKey } from '@/i18n/routes';
import {
  categoryUrl,
  getCategories,
  getOccasions,
  getPatterns,
  getPosts,
  getProducts,
  getTerms,
  occasionUrl,
  patternUrl,
  postUrl,
  productUrl,
  termUrl,
} from './content';
import { formatIDR } from './format';

export interface PageEntry {
  path: string;
  locale: Locale;
  kind: string;
  title: string;
  description: string;
}

const KIND = {
  id: {
    page: 'Halaman',
    product: 'Produk',
    category: 'Kategori',
    occasion: 'Hadiah',
    post: 'Jurnal',
    pattern: 'Pola gratis',
    term: 'Kamus rajut',
  },
  en: {
    page: 'Page',
    product: 'Product',
    category: 'Category',
    occasion: 'Gift guide',
    post: 'Journal',
    pattern: 'Free pattern',
    term: 'Glossary',
  },
};

/**
 * @param includeUtility include noindex utility pages (search, thank-you). Only the
 *   OG image endpoint needs them; the search index and llms.txt must not list them.
 */
export async function allPages(includeUtility = false): Promise<PageEntry[]> {
  const out: PageEntry[] = [];
  const [products, categories, occasions, terms] = await Promise.all([
    getProducts(),
    getCategories(),
    getOccasions(),
    getTerms(),
  ]);
  for (const locale of locales) {
    const k = KIND[locale];
    for (const key of Object.keys(staticRoutes) as StaticRouteKey[]) {
      if (!includeUtility && (key === 'search' || key === 'thanks')) continue;
      const m = pageMeta[key][locale];
      out.push({ path: path(key, locale), locale, kind: k.page, title: m.h1, description: m.description });
    }
    for (const p of products)
      out.push({
        path: productUrl(p, locale),
        locale,
        kind: `${k.product} · ${formatIDR(p.data.price)}`,
        title: p.data.name[locale],
        description: p.data.summary[locale],
      });
    for (const c of categories)
      out.push({
        path: categoryUrl(c, locale),
        locale,
        kind: k.category,
        title: c.data.name[locale],
        description: c.data.short[locale],
      });
    for (const o of occasions)
      out.push({
        path: occasionUrl(o, locale),
        locale,
        kind: k.occasion,
        title: o.data.title[locale],
        description: o.data.lede[locale],
      });
    for (const p of await getPosts(locale))
      out.push({ path: postUrl(p), locale, kind: k.post, title: p.data.title, description: p.data.description });
    for (const p of await getPatterns(locale))
      out.push({ path: patternUrl(p), locale, kind: k.pattern, title: p.data.title, description: p.data.description });
    for (const t of terms.filter((x) => x.data.major))
      out.push({
        path: termUrl(t, locale),
        locale,
        kind: k.term,
        title: t.data.term[locale],
        description: t.data.definition[locale],
      });
  }
  return out;
}

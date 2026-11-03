import { getCollection, type CollectionEntry } from 'astro:content';
import { entryPath, type Locale } from '@/i18n/routes';

export type Product = CollectionEntry<'products'>;
export type Category = CollectionEntry<'categories'>;
export type Occasion = CollectionEntry<'occasions'>;
export type JournalPost = CollectionEntry<'journal'>;
export type Pattern = CollectionEntry<'patterns'>;
export type Term = CollectionEntry<'glossary'>;
export type Faq = CollectionEntry<'faq'>;
export type Testimonial = CollectionEntry<'testimonials'>;

export const getProducts = async (): Promise<Product[]> =>
  (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);

export const getCategories = async (): Promise<Category[]> =>
  (await getCollection('categories')).sort((a, b) => a.data.order - b.data.order);

export const getOccasions = async (): Promise<Occasion[]> =>
  (await getCollection('occasions')).sort((a, b) => a.data.order - b.data.order);

export const getPosts = async (locale: Locale): Promise<JournalPost[]> =>
  (await getCollection('journal', (p) => p.data.lang === locale)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

export const getPatterns = async (locale: Locale): Promise<Pattern[]> =>
  getCollection('patterns', (p) => p.data.lang === locale);

export const getTerms = async (): Promise<Term[]> =>
  (await getCollection('glossary')).sort((a, b) => a.data.term.id.localeCompare(b.data.term.id, 'id'));

export const getFaqs = async (): Promise<Faq[]> =>
  (await getCollection('faq')).sort((a, b) => a.data.order - b.data.order);

/**
 * Testimonials that may be published. Sample entries only appear in dev.
 * Production requires real, permitted entries.
 */
export async function getPublishableTestimonials(): Promise<Testimonial[]> {
  const all = await getCollection('testimonials');
  return all
    .filter((t) => (t.data.sample ? import.meta.env.DEV : t.data.permission))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Testimonials that may appear in Review / AggregateRating schema: never samples. */
export async function getSchemaReviews(productId?: string): Promise<Testimonial[]> {
  const all = await getCollection('testimonials');
  return all.filter((t) => t.data.permission && !t.data.sample && (!productId || t.data.product === productId));
}

/* ---------- URLs ---------- */

export const productUrl = (p: Product, locale: Locale) => entryPath('product', locale, p.data.slugs[locale]);
export const categoryUrl = (c: Category, locale: Locale) => entryPath('category', locale, c.data.slug[locale]);
export const occasionUrl = (o: Occasion, locale: Locale) => entryPath('occasion', locale, o.data.slug[locale]);
export const postUrl = (p: JournalPost) => entryPath('journal', p.data.lang, p.data.slug);
export const patternUrl = (p: Pattern) => entryPath('pattern', p.data.lang, p.data.slug);
export const termUrl = (t: Term, locale: Locale) => entryPath('term', locale, t.data.slug[locale]);

/** Find the translated twin of a journal post / pattern by translationKey. */
export async function postTwin(post: JournalPost): Promise<JournalPost | undefined> {
  const other = post.data.lang === 'id' ? 'en' : 'id';
  return (
    await getCollection('journal', (p) => p.data.lang === other && p.data.translationKey === post.data.translationKey)
  )[0];
}

export async function patternTwin(pattern: Pattern): Promise<Pattern | undefined> {
  const other = pattern.data.lang === 'id' ? 'en' : 'id';
  return (
    await getCollection(
      'patterns',
      (p) => p.data.lang === other && p.data.translationKey === pattern.data.translationKey,
    )
  )[0];
}

/** Posts by translationKey (the Indonesian slug), in the requested language. */
export async function postsByKeys(keys: string[], locale: Locale): Promise<JournalPost[]> {
  const posts = await getPosts(locale);
  return keys.map((k) => posts.find((p) => p.data.translationKey === k)).filter((p): p is JournalPost => Boolean(p));
}

export async function productsByIds(ids: string[]): Promise<Product[]> {
  const all = await getProducts();
  return ids.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

/** Related products: same category first, then shared occasions. */
export function relatedProducts(product: Product, all: Product[], limit = 4): Product[] {
  const score = (p: Product) =>
    (p.data.category === product.data.category ? 10 : 0) +
    p.data.occasions.filter((o) => product.data.occasions.includes(o)).length;
  return all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => score(b) - score(a) || a.data.order - b.data.order)
    .slice(0, limit);
}

/** Lowest price across variants, used for "Mulai Rp …" labels. */
export const fromPrice = (p: Product): number =>
  p.data.variants?.length ? Math.min(...p.data.variants.map((v) => v.price)) : p.data.price;

export const priceBand = (price: number): 'u100' | '100-250' | '250-500' | 'o500' =>
  price < 100000 ? 'u100' : price < 250000 ? '100-250' : price <= 500000 ? '250-500' : 'o500';

import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { fiberTypes, occasionIds } from './lib/taxonomy';

const bi = z.object({ id: z.string().min(1), en: z.string().min(1) });
const biOptional = z.object({ id: z.string(), en: z.string() }).partial();

/** Products: one Markdown file per product, both languages in the frontmatter. */
const products = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/products' }),
  schema: z.object({
    slugs: bi,
    name: bi,
    summary: bi,
    description: bi,
    category: z.string(),
    occasions: z.array(z.enum(occasionIds)).length(3),
    price: z.number().int().positive(),
    availability: z.enum(['ready', 'preorder']),
    leadTimeDays: z.tuple([z.number().int(), z.number().int()]).optional(),
    stock: z.number().int().nonnegative().optional(),
    images: z.array(z.string()).min(1),
    colors: z.array(z.object({ key: z.string(), name: bi, hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) })).min(1),
    variants: z.array(z.object({ key: z.string(), label: bi, price: z.number().int().positive() })).optional(),
    /** Colour families shown in the shop filter (src/lib/colors.ts). Defaults to the colour option keys. */
    colorTags: z.array(z.string()).optional(),
    dimensions: z.object({
      heightCm: z.number().optional(),
      widthCm: z.number().optional(),
      depthCm: z.number().optional(),
      note: bi.optional(),
    }),
    weightGrams: z.number().int().positive(),
    fiber: z.enum(fiberTypes),
    yarn: bi,
    hookMm: z.number().positive(),
    care: z.array(bi).min(2),
    giftWrap: z.boolean().default(true),
    personalisable: z.boolean().default(false),
    relatedJournal: z.array(z.string()).length(2),
    featured: z.boolean().default(false),
    bestseller: z.boolean().default(false),
    sku: z.string(),
    order: z.number().default(100),
  }),
});

const categories = defineCollection({
  loader: file('src/content/categories.yaml'),
  schema: z.object({
    slug: bi,
    name: bi,
    short: bi,
    seoTitle: bi,
    seoDescription: bi,
    intro: z.object({ id: z.array(z.string()).min(2), en: z.array(z.string()).min(2) }),
    image: z.string(),
    order: z.number(),
    faq: z.array(z.object({ q: bi, a: bi })).min(2),
  }),
});

const occasions = defineCollection({
  loader: file('src/content/occasions.yaml'),
  schema: z.object({
    slug: bi,
    name: bi,
    title: bi,
    seoTitle: bi,
    seoDescription: bi,
    lede: bi,
    body: z.object({ id: z.array(z.string()).min(2), en: z.array(z.string()).min(2) }),
    tips: z.object({ id: z.array(z.string()).min(3), en: z.array(z.string()).min(3) }),
    when: biOptional.optional(),
    image: z.string(),
    order: z.number(),
    relatedJournal: z.array(z.string()).default([]),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/journal' }),
  schema: z.object({
    title: z.string().max(110),
    seoTitle: z.string().max(62),
    description: z.string().max(160),
    lang: z.enum(['id', 'en']),
    translationKey: z.string(),
    slug: z.string(),
    cluster: z.enum(['belajar', 'bahan-perawatan', 'kado', 'di-balik-layar']),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string(),
    relatedProducts: z.array(z.string()).min(2),
    relatedCategory: z.string(),
  }),
});

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().max(62),
    description: z.string().max(160),
    lang: z.enum(['id', 'en']),
    translationKey: z.string(),
    slug: z.string(),
    difficulty: z.string(),
    time: z.string(),
    hook: z.string(),
    yarn: z.string(),
    gauge: z.string(),
    finishedSize: z.string(),
    materials: z.array(z.string()).min(3),
    abbreviations: z.array(z.object({ abbr: z.string(), meaning: z.string() })).min(3),
    image: z.string(),
    relatedProduct: z.string().optional(),
    /** Short step summaries for HowTo schema. */
    steps: z.array(z.string()).min(3),
    publishDate: z.coerce.date(),
  }),
});

const glossary = defineCollection({
  loader: file('src/content/glossary.yaml'),
  schema: z.object({
    slug: bi,
    term: bi,
    us: z.string(),
    uk: z.string(),
    abbrUs: z.string().optional(),
    abbrUk: z.string().optional(),
    definition: bi,
    /** Major terms get their own page; minor terms live on the A–Z hub only. */
    major: z.boolean().default(false),
    howTo: z.object({ id: z.array(z.string()), en: z.array(z.string()) }).optional(),
    tip: bi.optional(),
    related: z.array(z.string()).default([]),
  }),
});

const faq = defineCollection({
  loader: file('src/content/faq.yaml'),
  schema: z.object({
    group: z.enum(['ordering', 'payment', 'shipping', 'custom', 'returns', 'care']),
    q: bi,
    a: bi,
    preview: z.boolean().default(false),
    order: z.number(),
  }),
});

/**
 * Testimonials must be real and used with the customer's permission.
 * `sample: true` entries are only rendered in `astro dev` and never reach
 * production HTML or schema.
 */
const testimonials = defineCollection({
  loader: file('src/content/testimonials.yaml'),
  schema: z.object({
    name: z.string(),
    city: z.string(),
    rating: z.number().int().min(1).max(5),
    text: z.string(),
    lang: z.enum(['id', 'en']),
    product: z.string().optional(),
    date: z.coerce.date(),
    source: z.enum(['whatsapp', 'instagram', 'shopee', 'tokopedia', 'tiktok', 'google']),
    permission: z.boolean(),
    sample: z.boolean().default(false),
  }),
});

/** Long-form static pages (care, size, shipping, privacy, terms), one Markdown file per language. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    key: z.enum(['care', 'size', 'shipping', 'privacy', 'terms']),
    lang: z.enum(['id', 'en']),
    updated: z.coerce.date(),
    lede: z.string(),
  }),
});

export const collections = { products, categories, occasions, journal, patterns, glossary, faq, testimonials, pages };

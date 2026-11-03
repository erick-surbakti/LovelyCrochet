import type { ImageMetadata } from 'astro';
import type { Locale } from '@/i18n/routes';
import meta from '@/data/images.json';

export interface ImageMeta {
  role: string;
  subject: string;
  colors: string[];
  material: string;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  pinterest: Record<Locale, string>;
}

export interface ResolvedImage {
  name: string;
  src: ImageMetadata;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  pinterest: Record<Locale, string>;
}

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.jpg', { eager: true });
const metadata = meta as Record<string, ImageMeta>;

/**
 * Resolve an image by its SEO file name (without extension). `-detail`
 * variants inherit the base image's copy with a "close-up" prefix.
 * Throws at build time if a referenced image is missing.
 */
export function getImage(name: string): ResolvedImage {
  const file = files[`/src/assets/images/${name}.jpg`];
  if (!file) throw new Error(`[images] Missing file src/assets/images/${name}.jpg`);
  const isDetail = name.endsWith('-detail');
  const base = metadata[name.replace(/-detail$/, '')];
  if (!base) throw new Error(`[images] No metadata for "${name}" in src/data/images.json`);

  if (!isDetail) return { name, src: file.default, alt: base.alt, caption: base.caption, pinterest: base.pinterest };
  return {
    name,
    src: file.default,
    alt: {
      id: `Detail rajutan dari dekat: ${base.alt.id.charAt(0).toLowerCase()}${base.alt.id.slice(1)}`,
      en: `Close-up of the stitches: ${base.alt.en.charAt(0).toLowerCase()}${base.alt.en.slice(1)}`,
    },
    caption: base.caption,
    pinterest: base.pinterest,
  };
}

export const allImageNames = (): string[] => Object.keys(metadata);

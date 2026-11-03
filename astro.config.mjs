// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import securityHeaders from './integrations/security-headers.mjs';

const SITE = 'https://lovelycrochet.shop';
const distDir = fileURLToPath(new URL('./dist/', import.meta.url));

/** Pages that must never appear in the sitemap. */
const EXCLUDE = ['/cari/', '/en/search/', '/terima-kasih/', '/en/thank-you/', '/404', '/en/404'];

/**
 * hreflang alternates for the sitemap are read back from each built page's own
 * <link rel="alternate"> tags, so the sitemap and the HTML always agree even
 * though ID and EN slugs differ (/koleksi/ ↔ /en/shop/).
 * @param {string} url
 */
function alternatesFromBuiltPage(url) {
  const pathname = new URL(url).pathname;
  const file = `${distDir}${pathname.replace(/^\//, '')}index.html`;
  if (!existsSync(file)) return undefined;
  const html = readFileSync(file, 'utf8');
  const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({
    lang: String(m[1]),
    url: String(m[2]),
  }));
  return links.length ? links : undefined;
}

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    responsiveStyles: false,
  },
  integrations: [
    mdx(),
    preact({ include: ['**/islands/**/*.tsx'] }),
    icon({ iconDir: 'src/icons' }),
    sitemap({
      filter: (page) => !EXCLUDE.some((p) => new URL(page).pathname.startsWith(p)),
      serialize(item) {
        const links = alternatesFromBuiltPage(item.url);
        return links ? { ...item, links } : item;
      },
    }),
    securityHeaders(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

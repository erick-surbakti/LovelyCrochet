/**
 * Branded 1200×630 Open Graph image for every page, rendered at build time
 * with satori (layout → SVG) and resvg (SVG → PNG) using the brand fonts.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { allPages, type PageEntry } from '@/lib/pages';
import { ogSlugFor } from '@/lib/og';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));
const fonts = [
  {
    name: 'Fraunces',
    data: font('@fontsource/fraunces', 'fraunces-latin-600-normal.woff'),
    weight: 600 as const,
    style: 'normal' as const,
  },
  {
    name: 'Jakarta',
    data: font('@fontsource/plus-jakarta-sans', 'plus-jakarta-sans-latin-600-normal.woff'),
    weight: 600 as const,
    style: 'normal' as const,
  },
  {
    name: 'Jakarta',
    data: font('@fontsource/plus-jakarta-sans', 'plus-jakarta-sans-latin-800-normal.woff'),
    weight: 800 as const,
    style: 'normal' as const,
  },
];

export const getStaticPaths = (async () => {
  const pages = await allPages(true);
  return pages.map((page) => ({ params: { slug: ogSlugFor(page.path) }, props: { page } }));
}) satisfies GetStaticPaths;

type Node = { type: string; props: Record<string, unknown> };
const h = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra: Record<string, unknown> = {},
): Node => ({
  type,
  props: { style, children, ...extra },
});

export const GET: APIRoute = async ({ props }) => {
  const page = (props as { page: PageEntry }).page;
  const title = page.title.length > 70 ? `${page.title.slice(0, 68)}…` : page.title;
  const stitch = (y: number) =>
    h(
      'div',
      { position: 'absolute', left: 0, top: y, width: 1200, height: 16, display: 'flex' },
      Array.from({ length: 50 }, () =>
        h('div', {
          width: 16,
          height: 10,
          marginLeft: 8,
          borderBottom: '4px solid #C9776B',
          borderRadius: '0 0 12px 12px',
          opacity: 0.55,
        }),
      ),
    );

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      position: 'relative',
      background: '#FBF6EE',
      fontFamily: 'Jakarta',
      color: '#3E2C25',
    },
    [
      h('div', {
        position: 'absolute',
        right: -120,
        top: -120,
        width: 520,
        height: 520,
        borderRadius: 999,
        background: '#F2C6C2',
        display: 'flex',
      }),
      h('div', {
        position: 'absolute',
        right: 120,
        bottom: -160,
        width: 360,
        height: 360,
        borderRadius: 999,
        background: '#F3D98B',
        opacity: 0.8,
        display: 'flex',
      }),
      h(
        'div',
        {
          position: 'absolute',
          right: 70,
          top: 150,
          width: 300,
          height: 300,
          borderRadius: 999,
          background: '#C9776B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        [
          h('div', {
            width: 240,
            height: 120,
            borderTop: '6px solid #FBF6EE',
            borderRadius: '50%',
            opacity: 0.7,
            display: 'flex',
          }),
        ],
      ),
      stitch(28),
      h(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 80px 70px',
          width: 820,
        },
        [
          h(
            'div',
            {
              display: 'flex',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 4,
              color: '#9A4A3F',
              textTransform: 'uppercase',
            },
            page.kind,
          ),
          h(
            'div',
            {
              display: 'flex',
              fontFamily: 'Fraunces',
              fontSize: title.length > 40 ? 64 : 80,
              lineHeight: 1.05,
              letterSpacing: -1,
            },
            title,
          ),
          h('div', { display: 'flex', alignItems: 'center', fontSize: 30 }, [
            h('div', { display: 'flex', fontFamily: 'Fraunces', fontSize: 40 }, [
              h('span', {}, 'Simpul\u00a0'),
              h('span', { color: '#9A4A3F' }, 'Mungil'),
            ]),
            h(
              'div',
              { display: 'flex', marginLeft: 24, color: '#6B5145' },
              page.locale === 'id' ? 'Rajutan tangan · Bekasi' : 'Handmade crochet · Bekasi',
            ),
          ]),
        ],
      ),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};

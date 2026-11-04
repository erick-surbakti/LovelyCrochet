/** llms.txt: a concise, link-rich site summary for AI search engines (llmstxt.org). */
import type { APIRoute } from 'astro';
import { locality, site } from '@/config/site';
import { path } from '@/i18n/routes';
import {
  categoryUrl,
  getCategories,
  getOccasions,
  getPatterns,
  getPosts,
  occasionUrl,
  patternUrl,
  postUrl,
} from '@/lib/content';

export const GET: APIRoute = async () => {
  const u = (p: string) => new URL(p, site.url).toString();
  const [categories, occasions, posts, patterns] = await Promise.all([
    getCategories(),
    getOccasions(),
    getPosts('id'),
    getPatterns('id'),
  ]);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a handmade crochet micro-business (home studio) in ${locality}, ${site.address.region}, Indonesia. It hand-crochets amigurumi dolls, doll keychains, flower bouquets, bags and crochet lace for clothing, takes custom orders via WhatsApp (${site.phone.display}), delivers same-day in Bekasi and Jabodetabek and ships across Indonesia. Indonesian is the default language; English pages live under /en/.`,
    '',
    '## Key facts',
    `- Orders: WhatsApp ${site.phone.display} (primary). Chat hours Monday–Saturday ${site.hours[0]?.opens}–${site.hours[0]?.closes} WIB (UTC+7).`,
    `- Payment: QRIS, bank transfer, ${site.payment.ewallets.join(', ')}. Prices in IDR.`,
    `- Couriers: ${site.couriers.join(', ')}; same-day ${site.sameDayCouriers.join(' / ')}.`,
    `- Made-to-order lead time: ${site.leadTime.minDays}–${site.leadTime.maxDays} working days; custom orders need a ${site.depositPercent}% deposit.`,
    `- Price range: ${site.priceRange}.`,
    '',
    '## Main pages',
    `- [Shop / Koleksi](${u(path('shop', 'id'))}): all products, filterable`,
    `- [Custom order builder](${u(path('custom', 'id'))}): design a piece and send it on WhatsApp`,
    `- [Crochet in Bekasi](${u(path('bekasi', 'id'))}): local delivery areas and times`,
    `- [FAQ](${u(path('faq', 'id'))}), [Shipping & returns](${u(path('shipping', 'id'))}), [Care guide](${u(path('care', 'id'))}), [Size guide](${u(path('size', 'id'))})`,
    `- [About](${u(path('about', 'id'))}), [Contact](${u(path('contact', 'id'))})`,
    `- English version: ${u('/en/')}`,
    '',
    '## Product categories',
    ...categories.map(
      (c) => `- [${c.data.name.id} / ${c.data.name.en}](${u(categoryUrl(c, 'id'))}): ${c.data.short.en}`,
    ),
    '',
    '## Gift guides',
    ...occasions.map((o) => `- [${o.data.title.id}](${u(occasionUrl(o, 'id'))})`),
    '',
    '## Learn',
    ...posts.map((p) => `- [${p.data.title}](${u(postUrl(p))}): ${p.data.description}`),
    ...patterns.map((p) => `- [${p.data.title}](${u(patternUrl(p))}) (free pattern)`),
    `- [Kamus Rajut / Crochet glossary](${u(path('glossary', 'id'))}): Indonesian crochet terms with US/UK equivalents`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

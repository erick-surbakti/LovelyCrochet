import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { pageMeta } from '@/i18n/pageMeta';
import { getPosts, postUrl } from '@/lib/content';

export const GET: APIRoute = async () => {
  const posts = await getPosts('en');
  return rss({
    title: `${site.name}: ${pageMeta.journal.en.h1}`,
    description: pageMeta.journal.en.description,
    site: site.url,
    customData: '<language>en</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishDate,
      link: postUrl(p),
    })),
  });
};

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { pageMeta } from '@/i18n/pageMeta';
import { getPosts, postUrl } from '@/lib/content';

export const GET: APIRoute = async () => {
  const posts = await getPosts('id');
  return rss({
    title: `${site.name}: ${pageMeta.journal.id.h1}`,
    description: pageMeta.journal.id.description,
    site: site.url,
    customData: '<language>id-ID</language>',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.publishDate,
      link: postUrl(p),
    })),
  });
};

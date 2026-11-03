import type { APIRoute } from 'astro';
import { allPages } from '@/lib/pages';

export const GET: APIRoute = async () => {
  const items = (await allPages())
    .filter((p) => p.locale === 'id')
    .map((p) => ({ t: p.title, u: p.path, d: p.description, k: p.kind.split(' · ')[0] }));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
};

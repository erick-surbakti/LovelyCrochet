/** Map a page path to its build-time Open Graph image path. */
export function ogPathFor(pathname: string): string {
  const clean = pathname.replace(/^\/|\/$/g, '');
  return `/og/${clean || 'index'}.png`;
}

/** Inverse of ogPathFor's slug part, used by the OG endpoint. */
export function ogSlugFor(pathname: string): string {
  return pathname.replace(/^\/|\/$/g, '') || 'index';
}

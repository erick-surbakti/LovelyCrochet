/**
 * Checks every internal link (href/src) in dist/*.html points to a file that
 * exists, that every #fragment exists on the target page, and that each
 * page's og:image file was generated.
 *   node scripts/check-links.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (n.endsWith('.html')) files.push(f);
  }
})('dist');

const cache = new Map();
const htmlFor = (pathname) => {
  const clean = pathname.replace(/^\//, '');
  const candidates = [join('dist', clean), join('dist', clean, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};
const idsIn = (file) => {
  if (!cache.has(file))
    cache.set(file, new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return cache.get(file);
};

const broken = [];
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const og = html.match(/property="og:image" content="https:\/\/[^/]+(\/[^"]+)"/);
  checked++;
  if (!og || !htmlFor(og[1])) broken.push(`${file} → og:image ${og ? og[1] : '(none)'} (missing)`);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const [pathPart, hash] = raw.split('#');
    const pathname = decodeURI(pathPart.split('?')[0]);
    checked++;
    const target = htmlFor(pathname);
    if (!target) {
      broken.push(`${file} → ${raw} (missing)`);
      continue;
    }
    if (hash && target.endsWith('.html') && !idsIn(target).has(hash)) broken.push(`${file} → ${raw} (no #${hash})`);
  }
}
console.log(`${checked} internal links checked across ${files.length} pages, ${broken.length} broken.`);
[...new Set(broken)].slice(0, 40).forEach((b) => console.log(' - ' + b));
process.exit(broken.length ? 1 : 0);

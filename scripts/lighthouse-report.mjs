/**
 * Runs Lighthouse (mobile + desktop) on one page per template and prints a
 * Markdown table with scores, Core Web Vitals and transfer size.
 * Usage: CHROME_PATH=... node scripts/lighthouse-report.mjs [baseUrl]  (needs `npm run preview`)
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321';
const templates = [
  ['Home', '/'],
  ['Shop', '/koleksi/'],
  ['Category', '/koleksi/buket-bunga-rajut/'],
  ['Product', '/produk/boneka-hello-kitty-rajut/'],
  ['Custom order', '/pesanan-custom/'],
  ['Gift guide', '/hadiah/kado-wisuda/'],
  ['Journal post', '/jurnal/jenis-benang-rajut-untuk-pemula/'],
  ['Free pattern', '/pola-gratis/pola-tulip-mini/'],
  ['Glossary', '/kamus-rajut/'],
  ['Bekasi', '/bekasi/'],
  ['Home (EN)', '/en/'],
];
const dir = mkdtempSync(join(tmpdir(), 'lh-'));
const bin = join('node_modules', 'lighthouse', 'cli', 'index.js');
const rows = [];
for (const [name, path] of templates) {
  for (const preset of ['mobile', 'desktop']) {
    const out = join(dir, `${preset}-${name.replace(/\W+/g, '-')}.json`);
    const args = [
      bin,
      base + path,
      '--quiet',
      '--chrome-flags=--headless=new',
      '--output=json',
      `--output-path=${out}`,
    ];
    if (preset === 'desktop') args.push('--preset=desktop');
    execFileSync(process.execPath, args, { stdio: 'ignore' });
    const r = JSON.parse(readFileSync(out, 'utf8'));
    const s = (k) => Math.round((r.categories[k]?.score ?? 0) * 100);
    const a = r.audits;
    const kb = Math.round((a['total-byte-weight'].numericValue ?? 0) / 1024);
    const js = Math.round(
      (a['network-requests'].details.items ?? [])
        .filter((i) => i.resourceType === 'Script')
        .reduce((sum, i) => sum + (i.transferSize ?? 0), 0) / 1024,
    );
    rows.push(
      `| ${name} | ${preset} | ${s('performance')} | ${s('accessibility')} | ${s('best-practices')} | ${s('seo')} | ${a['largest-contentful-paint'].displayValue} | ${a['cumulative-layout-shift'].displayValue} | ${a['total-blocking-time'].displayValue} | ${kb} KB | ${js} KB |`,
    );
    console.error(rows.at(-1));
  }
}
console.log('| Template | Device | Perf | A11y | BP | SEO | LCP | CLS | TBT | Page weight | JS |');
console.log('|---|---|---|---|---|---|---|---|---|---|---|');
console.log(rows.join('\n'));

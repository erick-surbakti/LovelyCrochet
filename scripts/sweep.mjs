/**
 * Dev QA sweep: loads every page in dist/ in Chromium (desktop + mobile),
 * reports console errors, failed requests, horizontal overflow and images
 * without alt. Usage: node scripts/sweep.mjs [baseUrl]  (needs `npm run preview`)
 */
import { chromium } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321';
const pages = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (n === 'index.html') pages.push('/' + relative('dist', d).split(sep).join('/') + (d === 'dist' ? '' : '/'));
  }
})('dist');

const browser = await chromium.launch();
let problems = 0;
for (const [label, viewport] of [
  ['desktop', { width: 1366, height: 900 }],
  ['mobile', { width: 375, height: 800 }],
]) {
  const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  for (const p of pages) {
    const url = base + p.replace(/^\/\//, '/');
    const page = await ctx.newPage();
    const issues = [];
    page.on('console', (m) => m.type() === 'error' && issues.push('console: ' + m.text()));
    page.on('pageerror', (e) => issues.push('pageerror: ' + e.message));
    page.on('requestfailed', (r) => issues.push('failed: ' + r.url()));
    page.on(
      'response',
      (r) => r.status() >= 400 && !r.url().includes('/og/') && issues.push(`${r.status()}: ${r.url()}`),
    );
    await page.goto(url, { waitUntil: 'load' });
    const res = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      h1: document.querySelectorAll('h1').length,
      dupIds: (() => {
        const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
        return [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
      })(),
    }));
    if (res.overflow > 1) issues.push(`horizontal overflow ${res.overflow}px`);
    if (res.noAlt) issues.push(`${res.noAlt} img without alt`);
    if (res.h1 !== 1) issues.push(`${res.h1} h1 elements`);
    if (res.dupIds.length) issues.push(`duplicate ids: ${res.dupIds.join(', ')}`);
    if (issues.length) {
      problems += issues.length;
      console.log(`[${label}] ${p}\n  - ${[...new Set(issues)].join('\n  - ')}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${pages.length} pages × 2 viewports checked, ${problems} issue(s).`);
process.exit(problems ? 1 : 0);

/** Dev helper: quotes values inside `{ id: …, en: … }` flow maps so commas and colons are safe. */
import { readFileSync, writeFileSync } from 'node:fs';
for (const p of process.argv.slice(2)) {
  const s = readFileSync(p, 'utf8').replace(/\{ id: ([^{}]*?), en: ([^{}]*?) \}/g, (_m, a, b) => {
    const q = (v) => (/^['"]/.test(v) ? v : JSON.stringify(v));
    return `{ id: ${q(a)}, en: ${q(b)} }`;
  });
  writeFileSync(p, s);
}

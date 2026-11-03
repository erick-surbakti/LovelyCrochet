/**
 * Validates every JSON-LD block in dist/: valid JSON, schema.org context,
 * and the properties Google requires for each rich-result type we emit.
 * Prints a per-type summary. Exit code 1 on any problem.
 *   node scripts/validate-jsonld.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const f = join(d, n);
    if (statSync(f).isDirectory()) walk(f);
    else if (n.endsWith('.html')) files.push(f);
  }
})('dist');

const REQUIRED = {
  Organization: ['name', 'url', 'logo'],
  WebSite: ['name', 'url'],
  Store: ['name', 'address', 'telephone', 'url', 'openingHoursSpecification'],
  Product: ['name', 'image', 'offers', 'sku', 'brand', 'description'],
  Offer: ['price', 'priceCurrency', 'availability', 'shippingDetails', 'hasMerchantReturnPolicy'],
  AggregateOffer: [
    'lowPrice',
    'highPrice',
    'priceCurrency',
    'availability',
    'shippingDetails',
    'hasMerchantReturnPolicy',
  ],
  BreadcrumbList: ['itemListElement'],
  BlogPosting: ['headline', 'image', 'datePublished', 'author', 'publisher'],
  FAQPage: ['mainEntity'],
  HowTo: ['name', 'step'],
  DefinedTermSet: ['name', 'hasDefinedTerm'],
  DefinedTerm: ['name', 'description', 'inDefinedTermSet'],
  ImageObject: ['contentUrl', 'creator', 'creditText'],
  ItemList: ['itemListElement'],
};

const counts = {};
const problems = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let doc;
    try {
      doc = JSON.parse(m[1]);
    } catch (e) {
      problems.push(`${file}: invalid JSON (${e.message})`);
      continue;
    }
    if (doc['@context'] !== 'https://schema.org') problems.push(`${file}: missing @context`);
    for (const node of doc['@graph'] ?? [doc]) {
      const type = node['@type'];
      counts[type] = (counts[type] ?? 0) + 1;
      for (const key of REQUIRED[type] ?? [])
        if (node[key] === undefined) problems.push(`${file}: ${type} missing ${key}`);
      if (type === 'Product') {
        const o = node.offers;
        for (const key of REQUIRED[o['@type']] ?? [])
          if (o[key] === undefined) problems.push(`${file}: ${o['@type']} missing ${key}`);
        if (o.priceCurrency !== 'IDR') problems.push(`${file}: priceCurrency is not IDR`);
        if (node.aggregateRating && !node.review?.length) problems.push(`${file}: aggregateRating without reviews`);
      }
      if (type === 'BreadcrumbList') {
        node.itemListElement.forEach((it, i) => {
          if (it.position !== i + 1 || !/^https:\/\//.test(it.item))
            problems.push(`${file}: bad breadcrumb item ${i + 1}`);
        });
      }
    }
  }
}

console.log('| Type | Count |\n|---|---|');
for (const [t, n] of Object.entries(counts).sort()) console.log(`| ${t} | ${n} |`);
console.log(`\n${files.length} HTML files scanned, ${problems.length} problem(s).`);
problems.slice(0, 30).forEach((p) => console.log(' - ' + p));
process.exit(problems.length ? 1 : 0);

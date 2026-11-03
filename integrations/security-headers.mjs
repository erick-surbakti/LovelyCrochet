/**
 * Writes dist/_headers (Netlify + Cloudflare Pages format) after the build.
 *
 * The Content-Security-Policy allows inline scripts only by their SHA-256
 * hash: every inline <script> Astro emits (island hydration, view-transition
 * bootstrap) is hashed from the built HTML, so no 'unsafe-inline' is needed
 * for scripts and the policy updates itself on every build.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ANALYTICS_ORIGIN = 'https://plausible.io';

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

/** @returns {import('astro').AstroIntegration} */
export default function securityHeaders() {
  return {
    name: 'lovelycrochet:security-headers',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const hashes = new Set();
        for (const file of htmlFiles(out)) {
          const html = readFileSync(file, 'utf8');
          for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
            const attrs = m[1] ?? '';
            const body = m[2] ?? '';
            if (/type="application\/(ld\+)?json"/.test(attrs) || !body.trim()) continue;
            hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
          }
        }

        const csp = [
          "default-src 'self'",
          `script-src 'self' ${[...hashes].join(' ')} ${ANALYTICS_ORIGIN}`.replace(/\s+/g, ' ').trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          `connect-src 'self' ${ANALYTICS_ORIGIN}`,
          "form-action 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "object-src 'none'",
          'upgrade-insecure-requests',
        ].join('; ');

        const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/og/*
  Cache-Control: public, max-age=604800

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sitemap-*.xml
  Cache-Control: public, max-age=3600
`;
        writeFileSync(join(out, '_headers'), headers);
        logger.info(`_headers written, ${hashes.size} inline script hash(es) in CSP`);
      },
    },
  };
}

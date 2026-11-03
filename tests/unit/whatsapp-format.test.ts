import { describe, expect, it } from 'vitest';
import { addWorkingDays, PIECE_TYPES } from '@/lib/custom-order';
import { formatIDR, formatTime, readingMinutes } from '@/lib/format';
import { customOrderMessage, generalMessage, productMessage, waLink, withUtm } from '@/lib/whatsapp';
import { entryPath, path, staticAlternates } from '@/i18n/routes';

describe('waLink', () => {
  it('builds a wa.me link with digits only and an encoded message', () => {
    const link = waLink('Halo & salam #1\nBaris 2', '+62 812-9676-1659');
    expect(link).toBe('https://wa.me/6281296761659?text=Halo%20%26%20salam%20%231%0ABaris%202');
  });

  it('round-trips the message through decodeURIComponent', () => {
    const msg = productMessage({
      locale: 'id',
      name: 'Buket "Tulip"',
      url: 'https://lovelycrochet.shop/produk/x/',
      price: 185000,
      qty: 2,
      giftWrap: true,
    });
    const decoded = decodeURIComponent(new URL(waLink(msg)).searchParams.get('text') ?? '');
    expect(decoded).toBe(msg);
    expect(decoded).toContain('Rp 185.000');
    expect(decoded).toContain('Jumlah: 2');
    expect(decoded).toContain('Bungkus kado: ya');
  });

  it('writes English product, custom and general messages', () => {
    expect(productMessage({ locale: 'en', name: 'Bear', url: 'u' })).toContain("I'd like to order");
    const custom = customOrderMessage({
      locale: 'en',
      type: 'Bouquet',
      size: 'Small',
      colors: ['Sage', 'Butter'],
      budget: 'Under Rp 100.000',
    });
    expect(custom).toContain('Colours: Sage, Butter');
    expect(generalMessage('id', 'pesanan custom')).toContain('pesanan custom');
  });
});

describe('withUtm', () => {
  it('adds UTM parameters without overwriting existing ones', () => {
    const u = new URL(withUtm('https://shopee.co.id/shop?utm_source=keep', 'product', 'tulip'));
    expect(u.searchParams.get('utm_source')).toBe('keep');
    expect(u.searchParams.get('utm_campaign')).toBe('product');
    expect(u.searchParams.get('utm_content')).toBe('tulip');
  });
});

describe('format', () => {
  it('formats Rupiah the Indonesian way', () => {
    expect(formatIDR(150000)).toBe('Rp 150.000');
    expect(formatIDR(1250000)).toBe('Rp 1.250.000');
  });
  it('formats times per locale', () => {
    expect(formatTime('09:00', 'id')).toBe('09.00');
    expect(formatTime('09:00', 'en')).toBe('09:00');
  });
  it('estimates reading time at ~200 wpm with a minimum of 1', () => {
    expect(readingMinutes('kata '.repeat(1000))).toBe(5);
    expect(readingMinutes('')).toBe(1);
  });
});

describe('routes', () => {
  it('maps ID and EN slugs with trailing slashes', () => {
    expect(path('home', 'id')).toBe('/');
    expect(path('home', 'en')).toBe('/en/');
    expect(staticAlternates('shop')).toEqual({ id: '/koleksi/', en: '/en/shop/' });
    expect(entryPath('product', 'en', 'crochet-penguin-amigurumi')).toBe('/en/products/crochet-penguin-amigurumi/');
  });
});

describe('custom-order rules', () => {
  it('skips Sundays when adding working days', () => {
    // Friday 2026-11-06 + 2 working days = Monday 2026-11-09 (Sat counts, Sun skipped)
    const d = addWorkingDays(new Date('2026-11-06T12:00:00'), 2);
    expect(d.getDay()).toBe(1);
    expect(d.getDate()).toBe(9);
  });
  it('gives every piece type a valid lead time and at least one size', () => {
    for (const t of PIECE_TYPES) {
      expect(t.leadDays[0]).toBeLessThanOrEqual(t.leadDays[1]);
      expect(t.sizes.length).toBeGreaterThan(0);
    }
  });
});

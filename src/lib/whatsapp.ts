import { site } from '@/config/site';
import type { Locale } from '@/i18n/routes';
import { formatIDR } from './format';

/** Build a wa.me deep link with a URL-encoded, prefilled message. */
export function waLink(message: string, number: string = site.phone.whatsapp): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export interface ProductMessageInput {
  locale: Locale;
  name: string;
  url: string;
  price?: number;
  variant?: string;
  color?: string;
  qty?: number;
  giftWrap?: boolean;
  note?: string;
}

export function productMessage(i: ProductMessageInput): string {
  const id = i.locale === 'id';
  const lines = [
    id ? `Halo LovelyCrochet! Aku mau pesan:` : `Hi LovelyCrochet! I'd like to order:`,
    ``,
    `• ${id ? 'Produk' : 'Product'}: ${i.name}`,
  ];
  if (i.variant) lines.push(`• ${id ? 'Varian' : 'Variant'}: ${i.variant}`);
  if (i.color) lines.push(`• ${id ? 'Warna' : 'Colour'}: ${i.color}`);
  lines.push(`• ${id ? 'Jumlah' : 'Quantity'}: ${i.qty ?? 1}`);
  if (typeof i.price === 'number') lines.push(`• ${id ? 'Harga' : 'Price'}: ${formatIDR(i.price)}`);
  if (i.giftWrap) lines.push(`• ${id ? 'Bungkus kado: ya' : 'Gift wrap: yes'}`);
  if (i.note?.trim()) lines.push(`• ${id ? 'Catatan' : 'Note'}: ${i.note.trim()}`);
  lines.push(``, `${id ? 'Link' : 'Link'}: ${i.url}`);
  lines.push(id ? `Apakah masih tersedia? Terima kasih 🧶` : `Is it still available? Thank you 🧶`);
  return lines.join('\n');
}

export interface CustomOrderInput {
  locale: Locale;
  type: string;
  size: string;
  colors: string[];
  personalization?: string;
  deadline?: string;
  budget: string;
  name?: string;
}

export function customOrderMessage(i: CustomOrderInput): string {
  const id = i.locale === 'id';
  const lines = [
    id ? `Halo LovelyCrochet! Aku mau pesanan custom:` : `Hi LovelyCrochet! I'd like a custom order:`,
    ``,
    `• ${id ? 'Jenis' : 'Type'}: ${i.type}`,
    `• ${id ? 'Ukuran' : 'Size'}: ${i.size}`,
    `• ${id ? 'Warna' : 'Colours'}: ${i.colors.join(', ') || '-'}`,
  ];
  if (i.personalization?.trim())
    lines.push(`• ${id ? 'Personalisasi' : 'Personalisation'}: ${i.personalization.trim()}`);
  if (i.deadline) lines.push(`• ${id ? 'Dibutuhkan tanggal' : 'Needed by'}: ${i.deadline}`);
  lines.push(`• Budget: ${i.budget}`);
  if (i.name?.trim()) lines.push(`• ${id ? 'Nama' : 'Name'}: ${i.name.trim()}`);
  lines.push(
    ``,
    id ? `Boleh dibantu cek estimasi harga & jadwalnya? 🧶` : `Could you check the price and timing for me? 🧶`,
  );
  return lines.join('\n');
}

export function generalMessage(locale: Locale, context?: string): string {
  if (locale === 'id') {
    return context
      ? `Halo LovelyCrochet! Aku mau tanya soal ${context}.`
      : `Halo LovelyCrochet! Aku mau tanya-tanya soal rajutan 🧶`;
  }
  return context
    ? `Hi LovelyCrochet! I have a question about ${context}.`
    : `Hi LovelyCrochet! I have a question about your crochet pieces 🧶`;
}

/**
 * Add UTM parameters to an outbound marketplace link without clobbering
 * parameters the URL already carries.
 */
export function withUtm(url: string, campaign: string, content?: string): string {
  const u = new URL(url);
  if (!u.searchParams.has('utm_source')) u.searchParams.set('utm_source', 'lovelycrochet.shop');
  if (!u.searchParams.has('utm_medium')) u.searchParams.set('utm_medium', 'referral');
  if (!u.searchParams.has('utm_campaign')) u.searchParams.set('utm_campaign', campaign);
  if (content && !u.searchParams.has('utm_content')) u.searchParams.set('utm_content', content);
  return u.toString();
}

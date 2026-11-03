import { intlLocale, type Locale } from '@/i18n/routes';

/**
 * Rupiah price: "Rp 150.000" in both languages. The Indonesian format is used
 * for EN pages too, because that is how prices are written on receipts,
 * marketplaces and bank transfers in Indonesia.
 */
export function formatIDR(amount: number): string {
  const n = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(Math.round(amount));
  return `Rp ${n}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

/** ISO date (YYYY-MM-DD) in WIB, for <time datetime>. */
export function isoDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(date);
}

/** Localised weekday range, e.g. "Senin–Sabtu" / "Monday–Saturday". */
export function weekdayName(day: string, locale: Locale): string {
  const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const idx = order.indexOf(day);
  // 2024-01-01 was a Monday.
  const date = new Date(Date.UTC(2024, 0, 1 + Math.max(idx, 0), 12));
  return new Intl.DateTimeFormat(intlLocale[locale], { weekday: 'long', timeZone: 'UTC' }).format(date);
}

/** "09.00" (ID) / "09:00" (EN). */
export function formatTime(hhmm: string, locale: Locale): string {
  return locale === 'id' ? hhmm.replace(':', '.') : hhmm;
}

/** Words → minutes at ~200 wpm, minimum 1. */
export function readingMinutes(text: string): number {
  const words = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

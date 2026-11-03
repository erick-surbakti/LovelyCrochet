/** Custom-order rules shared by the builder island, the custom page and tests. */

export interface PieceType {
  key: 'buket' | 'boneka' | 'tas' | 'aksesoris' | 'pakaian';
  name: { id: string; en: string };
  /** Working days, counted from the deposit. */
  leadDays: [number, number];
  sizes: { key: string; label: { id: string; en: string }; from: number }[];
}

export const PIECE_TYPES: PieceType[] = [
  {
    key: 'boneka',
    name: { id: 'Boneka amigurumi', en: 'Amigurumi doll' },
    leadDays: [5, 14],
    sizes: [
      { key: 'kecil', label: { id: 'Kecil, ±13–15 cm', en: 'Small, ±13–15 cm' }, from: 145000 },
      { key: 'besar', label: { id: 'Besar, ±22–30 cm', en: 'Large, ±22–30 cm' }, from: 189000 },
      { key: 'karakter', label: { id: 'Karakter detail, ±30 cm', en: 'Detailed character, ±30 cm' }, from: 265000 },
    ],
  },
  {
    key: 'aksesoris',
    name: { id: 'Gantungan kunci', en: 'Keychain' },
    leadDays: [3, 5],
    sizes: [
      { key: 'boneka', label: { id: 'Boneka mini, ±10 cm', en: 'Mini doll, ±10 cm' }, from: 65000 },
      { key: 'couple', label: { id: 'Sepasang (couple)', en: 'Couple pair' }, from: 120000 },
    ],
  },
  {
    key: 'buket',
    name: { id: 'Buket bunga rajut', en: 'Crochet bouquet' },
    leadDays: [5, 10],
    sizes: [
      { key: 'kecil', label: { id: 'Kecil, 3 tangkai', en: 'Small, 3 stems' }, from: 125000 },
      { key: 'sedang', label: { id: 'Sedang, 5–7 tangkai', en: 'Medium, 5–7 stems' }, from: 185000 },
      { key: 'besar', label: { id: 'Besar, 10–12 tangkai', en: 'Large, 10–12 stems' }, from: 350000 },
    ],
  },
  {
    key: 'tas',
    name: { id: 'Tas rajut', en: 'Crochet bag' },
    leadDays: [7, 14],
    sizes: [
      { key: 'pouch', label: { id: 'Pouch / tas kecil', en: 'Pouch / mini bag' }, from: 145000 },
      { key: 'bahu', label: { id: 'Tas bahu', en: 'Shoulder bag' }, from: 295000 },
      { key: 'tote', label: { id: 'Tote besar', en: 'Large tote' }, from: 325000 },
    ],
  },
  {
    key: 'pakaian',
    name: { id: 'Pakaian rajut', en: 'Crochet clothing' },
    leadDays: [10, 14],
    sizes: [
      { key: 'atasan', label: { id: 'Atasan / crop top', en: 'Top / crop top' }, from: 325000 },
      { key: 'cardigan', label: { id: 'Cardigan / outer', en: 'Cardigan / outer' }, from: 495000 },
    ],
  },
];

export const YARN_COLORS = [
  { key: 'rose-clay', hex: '#C9776B', name: { id: 'Merah bata', en: 'Rose clay' } },
  { key: 'blush', hex: '#F2C6C2', name: { id: 'Merah muda', en: 'Blush' } },
  { key: 'butter', hex: '#F3D98B', name: { id: 'Kuning mentega', en: 'Butter' } },
  { key: 'sage', hex: '#8FA48A', name: { id: 'Hijau sage', en: 'Sage' } },
  { key: 'oat', hex: '#EFE4D2', name: { id: 'Oat', en: 'Oat' } },
  { key: 'cocoa', hex: '#6B5145', name: { id: 'Cokelat', en: 'Cocoa' } },
  { key: 'putih', hex: '#FFFDF8', name: { id: 'Putih gading', en: 'Ivory' } },
  { key: 'lilac', hex: '#C9B6D9', name: { id: 'Lilac', en: 'Lilac' } },
  { key: 'biru', hex: '#9DB8D2', name: { id: 'Biru langit', en: 'Sky blue' } },
  { key: 'terracotta', hex: '#B5563E', name: { id: 'Terakota', en: 'Terracotta' } },
] as const;

/** Add working days (Mon–Sat, matching studio hours) to a date. */
export function addWorkingDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
}

/**
 * Colour families used by the shop filter. A product's `colors[].key` should be
 * one of these keys (or a legacy alias in MAP). The filter only shows families
 * that at least one product actually uses.
 */
export const COLOR_FAMILIES = [
  { key: 'white', hex: '#FFFDF8', name: { id: 'Putih', en: 'White' } },
  { key: 'oat', hex: '#EFE4D2', name: { id: 'Krem', en: 'Cream' } },
  { key: 'cocoa', hex: '#6B5145', name: { id: 'Cokelat', en: 'Brown' } },
  { key: 'blush', hex: '#F2C6C2', name: { id: 'Merah muda', en: 'Pink' } },
  { key: 'red', hex: '#B23A48', name: { id: 'Merah', en: 'Red' } },
  { key: 'rose', hex: '#C9776B', name: { id: 'Merah bata', en: 'Rose clay' } },
  { key: 'butter', hex: '#F3D98B', name: { id: 'Kuning', en: 'Yellow' } },
  { key: 'sage', hex: '#8FA48A', name: { id: 'Hijau', en: 'Green' } },
  { key: 'blue', hex: '#9DB8D2', name: { id: 'Biru', en: 'Blue' } },
  { key: 'lilac', hex: '#C9B6D9', name: { id: 'Ungu', en: 'Lilac' } },
  { key: 'black', hex: '#2E2A28', name: { id: 'Hitam', en: 'Black' } },
] as const;

export type ColorFamily = (typeof COLOR_FAMILIES)[number]['key'];

const FAMILY_KEYS = new Set<string>(COLOR_FAMILIES.map((c) => c.key));

/** Legacy / descriptive keys → family. Family keys map to themselves. */
const MAP: Record<string, ColorFamily> = {
  pink: 'blush',
  cream: 'oat',
  beige: 'oat',
  brown: 'cocoa',
  yellow: 'butter',
  green: 'sage',
};

export function colorFamilies(keys: string[]): ColorFamily[] {
  return [
    ...new Set(
      keys.map((k) => (FAMILY_KEYS.has(k) ? (k as ColorFamily) : MAP[k])).filter((f): f is ColorFamily => Boolean(f)),
    ),
  ];
}

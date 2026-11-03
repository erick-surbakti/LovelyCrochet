/** Shared taxonomies: imported by the content schema and by components. */
export const fiberTypes = [
  'cotton-milk',
  'katun',
  'acrylic',
  'polyester',
  'wol',
  'baby-milk-cotton',
  'katun-polyester',
] as const;

export const occasionIds = [
  'wisuda',
  'ulang-tahun',
  'anniversary',
  'valentine',
  'hari-ibu',
  'lebaran',
  'baby-shower',
  'korporat',
] as const;

export type OccasionId = (typeof occasionIds)[number];
export type FiberType = (typeof fiberTypes)[number];

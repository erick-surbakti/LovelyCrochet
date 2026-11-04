/**
 * Generates the 4 category/pattern illustrations (1600×2000 JPG) used where no
 * real photo exists yet (bouquets, bags, clothing, heart pattern).
 *
 *   node scripts/generate-standins.mjs
 *
 * They are labelled as illustrations in src/data/images.json. Replace them with
 * real photos when available (see IMAGE_MAP.md).
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/assets/images/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 2000;

const C = {
  cream: '#FBF6EE',
  oat: '#EFE4D2',
  rose: '#C9776B',
  roseDark: '#A85D52',
  blush: '#F2C6C2',
  blushDark: '#DFA19B',
  sage: '#8FA48A',
  sageDark: '#6E8569',
  butter: '#F3D98B',
  butterDark: '#D9BC62',
  cocoa: '#3E2C25',
  cocoaSoft: '#6B5145',
  kraft: '#C9A57A',
  kraftDark: '#A8865C',
  white: '#FFFDF8',
  lilac: '#C9B6D9',
  lilacDark: '#A792BC',
};

/** Repeating single-crochet "V" stitch texture. */
const stitch = (id, base, line, scale = 1) => {
  const w = 26 * scale;
  const h = 22 * scale;
  return `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
    <rect width="${w}" height="${h}" fill="${base}"/>
    <path d="M${2 * scale} ${4 * scale} Q${w / 2} ${h - 2 * scale} ${w / 2} ${h - 3 * scale} Q${w / 2} ${h - 2 * scale} ${w - 2 * scale} ${4 * scale}"
      fill="none" stroke="${line}" stroke-width="${3.2 * scale}" stroke-linecap="round" opacity=".55"/>
    <path d="M${4 * scale} ${3 * scale} Q${w / 2} ${h - 6 * scale} ${w - 4 * scale} ${3 * scale}" fill="none" stroke="#fff" stroke-width="${1.6 * scale}" opacity=".25"/>
  </pattern>`;
};

/** Shared defs: grain, soft shadow, stitch fills for every palette colour. */
const defs = (extra = '') => `<defs>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.17  0 0 0 0 0.14  0 0 0 .09 0"/>
  </filter>
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="28"/>
  </filter>
  <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
    <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#6B3B2E" flood-opacity=".22"/>
  </filter>
  ${stitch('s-rose', C.rose, C.roseDark)}
  ${stitch('s-blush', C.blush, C.blushDark)}
  ${stitch('s-sage', C.sage, C.sageDark)}
  ${stitch('s-butter', C.butter, C.butterDark)}
  ${stitch('s-cocoa', C.cocoaSoft, C.cocoa)}
  ${stitch('s-oat', C.oat, C.kraft)}
  ${stitch('s-white', C.white, C.oat)}
  ${stitch('s-lilac', C.lilac, C.lilacDark)}
  ${stitch('s-kraft', C.kraft, C.kraftDark, 1.6)}
  ${stitch('s-rose-sm', C.rose, C.roseDark, 0.6)}
  ${stitch('s-sage-sm', C.sage, C.sageDark, 0.6)}
  ${stitch('s-butter-sm', C.butter, C.butterDark, 0.6)}
  ${stitch('s-blush-sm', C.blush, C.blushDark, 0.6)}
  ${extra}
</defs>`;

const backdrop = (top, bottom) => `
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
  </linearGradient>`;

const scene = ({
  top,
  bottom,
  table = C.oat,
  body,
  extraDefs = '',
}) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs(backdrop(top, bottom) + extraDefs)}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <path d="M0 1480 Q800 1420 1600 1480 V2000 H0Z" fill="${table}"/>
  <path d="M0 1480 Q800 1420 1600 1480" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6"/>
  ${body}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;

const groundShadow = (cx, cy, rx, ry, o = 0.35) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#6B3B2E" opacity="${o}" filter="url(#shadow)"/>`;

const yarnBall = (cx, cy, r, fill, line) => `<g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>
  ${[0, 1, 2, 3, 4]
    .map(
      (i) =>
        `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.95}" ry="${r * (0.25 + i * 0.13)}" transform="rotate(${-35 + i * 22} ${cx} ${cy})" fill="none" stroke="${line}" stroke-width="5" opacity=".45"/>`,
    )
    .join('')}
  <path d="M${cx + r * 0.7} ${cy + r * 0.7} q120 60 260 10" fill="none" stroke="${fill}" stroke-width="9" stroke-linecap="round"/>
</g>`;

const hook = (x, y, angle) =>
  `<g transform="rotate(${angle} ${x} ${y})"><rect x="${x}" y="${y}" width="420" height="16" rx="8" fill="#B8BCC2"/><rect x="${x + 240}" y="${y - 10}" width="200" height="36" rx="18" fill="${C.rose}"/><path d="M${x} ${y + 8} q-18 0 -16 -18" stroke="#B8BCC2" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;

const tag = (x, y, angle, text = 'Simpul Mungil') => `<g transform="rotate(${angle} ${x} ${y})">
  <path d="M${x} ${y} h230 l40 40 l-40 40 h-230z" fill="${C.white}" filter="url(#soft)"/>
  <circle cx="${x + 238}" cy="${y + 40}" r="8" fill="${C.oat}"/>
  <text x="${x + 22}" y="${y + 52}" font-family="Georgia, serif" font-size="34" font-style="italic" fill="${C.cocoa}">${text}</text>
</g>`;

/* ---------- Shapes ---------- */

const tulip = (x, y, s, fill, angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})">
  <path d="M0 -120 C-70 -110 -90 -40 -70 30 C-50 80 50 80 70 30 C90 -40 70 -110 0 -120Z" fill="url(#${fill})" stroke="#00000018" stroke-width="3"/>
  <path d="M0 -120 C-25 -60 -25 20 0 70 C25 20 25 -60 0 -120Z" fill="url(#${fill})" stroke="#00000022" stroke-width="3"/>
  <path d="M-70 -95 L-40 -40 L0 -110 L40 -40 L70 -95" fill="none" stroke="#ffffff55" stroke-width="5" stroke-linejoin="round"/>
</g>`;

const rose = (x, y, r, fill, line) => `<g>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${fill})"/>
  <path d="M${x} ${y} m-${r * 0.15} 0 a${r * 0.15} ${r * 0.15} 0 1 1 ${r * 0.3} 0 a${r * 0.3} ${r * 0.3} 0 1 1 -${r * 0.6} 0 a${r * 0.5} ${r * 0.5} 0 1 1 ${r} 0 a${r * 0.7} ${r * 0.7} 0 1 1 -${r * 1.4} 0 a${r * 0.88} ${r * 0.88} 0 1 1 ${r * 1.76} 0"
    fill="none" stroke="${line}" stroke-width="${r * 0.07}" stroke-linecap="round" opacity=".75"/>
</g>`;

const leaf = (x, y, s, angle) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${s})">
  <path d="M0 0 C40 -60 120 -60 160 0 C120 60 40 60 0 0Z" fill="url(#s-sage)"/>
  <path d="M10 0 H150" stroke="${C.sageDark}" stroke-width="5"/>
</g>`;

const stem = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="${C.sageDark}" stroke-width="18" fill="none" stroke-linecap="round"/>`;

const wrap = (cx, topY, botY, fill = 's-kraft', ribbon = C.rose) => `<g filter="url(#soft)">
  <path d="M${cx - 380} ${topY} L${cx + 380} ${topY} L${cx + 90} ${botY} L${cx - 90} ${botY}Z" fill="url(#${fill})"/>
  <path d="M${cx - 380} ${topY} L${cx - 240} ${topY + 80} L${cx - 90} ${topY} L${cx + 40} ${topY + 90} L${cx + 180} ${topY} L${cx + 300} ${topY + 70} L${cx + 380} ${topY}" fill="${C.kraftDark}" opacity=".35"/>
  <path d="M${cx - 150} ${botY - 230} Q${cx} ${botY - 200} ${cx + 150} ${botY - 230}" stroke="${ribbon}" stroke-width="34" fill="none" stroke-linecap="round"/>
  <path d="M${cx} ${botY - 215} q-150 -120 -170 10 q60 50 170 -10 q150 -120 170 10 q-60 50 -170 -10" fill="${ribbon}"/>
  <path d="M${cx - 10} ${botY - 205} l-70 190 M${cx + 10} ${botY - 205} l80 180" stroke="${ribbon}" stroke-width="22" stroke-linecap="round"/>
</g>`;

const face = (cx, cy, s = 1, blush = C.blushDark) => `<g>
  <circle cx="${cx - 60 * s}" cy="${cy}" r="${13 * s}" fill="${C.cocoa}"/>
  <circle cx="${cx + 60 * s}" cy="${cy}" r="${13 * s}" fill="${C.cocoa}"/>
  <circle cx="${cx - 56 * s}" cy="${cy - 5 * s}" r="${4 * s}" fill="#fff"/>
  <circle cx="${cx + 64 * s}" cy="${cy - 5 * s}" r="${4 * s}" fill="#fff"/>
  <ellipse cx="${cx - 100 * s}" cy="${cy + 32 * s}" rx="${24 * s}" ry="${14 * s}" fill="${blush}" opacity=".8"/>
  <ellipse cx="${cx + 100 * s}" cy="${cy + 32 * s}" rx="${24 * s}" ry="${14 * s}" fill="${blush}" opacity=".8"/>
  <path d="M${cx - 18 * s} ${cy + 34 * s} q${18 * s} ${18 * s} ${36 * s} 0" stroke="${C.cocoa}" stroke-width="${6 * s}" fill="none" stroke-linecap="round"/>
</g>`;

/* ---------- Scenes ---------- */

const scenes = {
  'buket-bunga-tulip-rajut-pastel-bekasi': scene({
    top: C.blush,
    bottom: '#F7DDD6',
    body: `
      ${groundShadow(800, 1700, 360, 50)}
      ${stem(800, 1500, 640, 800)}${stem(800, 1500, 800, 700)}${stem(800, 1500, 960, 790)}${stem(800, 1500, 540, 960)}${stem(800, 1500, 1060, 950)}
      ${leaf(690, 1050, 1.1, -140)}${leaf(900, 1080, 1, -30)}
      ${tulip(640, 760, 1.25, 's-rose', -12)}
      ${tulip(800, 640, 1.35, 's-butter', 0)}
      ${tulip(960, 760, 1.25, 's-blush', 12)}
      ${tulip(540, 930, 1.1, 's-butter', -22)}
      ${tulip(1060, 920, 1.1, 's-rose', 22)}
      ${wrap(800, 1000, 1700)}
      ${tag(1060, 1500, -8)}`,
  }),

  'buket-wisuda-mawar-rajut-toga-mini': scene({
    top: C.butter,
    bottom: '#F8E7B5',
    body: `
      ${groundShadow(800, 1710, 360, 50)}
      ${stem(800, 1500, 650, 850)}${stem(800, 1500, 800, 760)}${stem(800, 1500, 950, 850)}
      ${leaf(620, 1020, 1, -150)}${leaf(960, 1030, 1, -25)}
      ${rose(650, 850, 120, 's-rose', C.roseDark)}
      ${rose(950, 850, 120, 's-blush', C.blushDark)}
      ${rose(800, 720, 135, 's-white', C.kraft)}
      ${rose(560, 1000, 90, 's-blush', C.blushDark)}
      ${rose(1040, 1000, 90, 's-rose', C.roseDark)}
      <g transform="translate(800 470) rotate(-8)" filter="url(#soft)">
        <path d="M-210 0 L0 -90 L210 0 L0 90Z" fill="${C.cocoa}"/>
        <path d="M-120 40 V120 Q0 170 120 120 V40 L0 90Z" fill="${C.cocoaSoft}"/>
        <path d="M150 25 V140" stroke="${C.butter}" stroke-width="10"/><circle cx="150" cy="150" r="18" fill="${C.butter}"/>
      </g>
      ${wrap(800, 1020, 1710, 's-oat', C.cocoa)}
      ${tag(260, 1520, 6, 'Selamat!')}`,
  }),

  'boneka-beruang-amigurumi-rajut-cokelat': scene({
    top: C.oat,
    bottom: '#F4ECDF',
    table: C.blush,
    body: `
      ${groundShadow(800, 1650, 380, 60)}
      <g filter="url(#soft)">
        <circle cx="560" cy="560" r="110" fill="url(#s-cocoa)"/><circle cx="560" cy="560" r="55" fill="url(#s-oat)"/>
        <circle cx="1040" cy="560" r="110" fill="url(#s-cocoa)"/><circle cx="1040" cy="560" r="55" fill="url(#s-oat)"/>
        <ellipse cx="800" cy="1290" rx="330" ry="330" fill="url(#s-cocoa)"/>
        <ellipse cx="800" cy="1320" rx="190" ry="210" fill="url(#s-oat)"/>
        <ellipse cx="520" cy="1180" rx="95" ry="170" transform="rotate(25 520 1180)" fill="url(#s-cocoa)"/>
        <ellipse cx="1080" cy="1180" rx="95" ry="170" transform="rotate(-25 1080 1180)" fill="url(#s-cocoa)"/>
        <ellipse cx="610" cy="1570" rx="130" ry="95" fill="url(#s-cocoa)"/><ellipse cx="990" cy="1570" rx="130" ry="95" fill="url(#s-cocoa)"/>
        <ellipse cx="610" cy="1580" rx="70" ry="50" fill="url(#s-oat)"/><ellipse cx="990" cy="1580" rx="70" ry="50" fill="url(#s-oat)"/>
        <circle cx="800" cy="780" r="290" fill="url(#s-cocoa)"/>
        <ellipse cx="800" cy="880" rx="125" ry="95" fill="url(#s-oat)"/>
        <ellipse cx="800" cy="850" rx="34" ry="24" fill="${C.cocoa}"/>
      </g>
      ${face(800, 770, 1.15, C.rose)}
      <path d="M640 1060 Q800 1130 960 1060" stroke="${C.rose}" stroke-width="40" fill="none" stroke-linecap="round"/>
      <path d="M800 1080 q-110 -90 -130 20 q50 40 130 -20 q110 -90 130 20 q-50 40 -130 -20" fill="${C.rose}"/>
      ${yarnBall(1300, 1600, 120, C.rose, C.roseDark)}`,
  }),

  'boneka-kelinci-amigurumi-rajut-blush': scene({
    top: C.sage,
    bottom: '#B8C7B3',
    table: C.oat,
    body: `
      ${groundShadow(800, 1660, 360, 60)}
      <g filter="url(#soft)">
        <ellipse cx="660" cy="420" rx="85" ry="270" transform="rotate(-10 660 420)" fill="url(#s-white)"/>
        <ellipse cx="660" cy="440" rx="42" ry="200" transform="rotate(-10 660 440)" fill="url(#s-blush)"/>
        <ellipse cx="950" cy="440" rx="85" ry="270" transform="rotate(14 950 440)" fill="url(#s-white)"/>
        <ellipse cx="950" cy="460" rx="42" ry="200" transform="rotate(14 950 460)" fill="url(#s-blush)"/>
        <path d="M520 1150 Q520 950 800 950 Q1080 950 1080 1150 L1130 1560 Q800 1640 470 1560Z" fill="url(#s-blush)"/>
        <path d="M560 1250 Q800 1320 1040 1250" stroke="${C.white}" stroke-width="20" fill="none"/>
        <ellipse cx="560" cy="1210" rx="80" ry="150" transform="rotate(20 560 1210)" fill="url(#s-white)"/>
        <ellipse cx="1040" cy="1210" rx="80" ry="150" transform="rotate(-20 1040 1210)" fill="url(#s-white)"/>
        <circle cx="800" cy="820" r="270" fill="url(#s-white)"/>
        <ellipse cx="800" cy="900" rx="30" ry="20" fill="${C.rose}"/>
      </g>
      ${face(800, 830, 1.05)}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${560 + i * 96}" cy="${1440 - Math.abs(i - 2.5) * 10}" r="20" fill="${C.white}" opacity=".85"/>`).join('')}
      ${yarnBall(300, 1620, 110, C.blush, C.blushDark)}`,
  }),

  'tas-tote-rajut-sage-katun': scene({
    top: C.cream,
    bottom: C.oat,
    table: C.kraft,
    body: `
      ${groundShadow(800, 1690, 420, 60)}
      <g filter="url(#soft)">
        <path d="M560 760 Q560 380 800 380 Q1040 380 1040 760" stroke="url(#s-sage-sm)" stroke-width="70" fill="none"/>
        <path d="M600 760 Q600 430 800 430 Q1000 430 1000 760" stroke="${C.sageDark}" stroke-width="6" fill="none" opacity=".5"/>
        <path d="M420 740 H1180 L1230 1640 Q800 1700 370 1640Z" fill="url(#s-sage)"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${400 + i * 2} ${860 + i * 100} H${1200 + i * 4}" stroke="${C.sageDark}" stroke-width="4" opacity=".35"/>`).join('')}
        <path d="M420 740 H1180 V820 H420Z" fill="url(#s-oat)"/>
      </g>
      <g transform="translate(980 1100)">${rose(0, 0, 90, 's-blush', C.blushDark)}${leaf(60, 40, 0.6, 20)}</g>
      ${tag(250, 1500, -6)}`,
  }),

  'tas-bahu-rajut-granny-square': scene({
    top: '#F6E3C6',
    bottom: C.oat,
    table: C.sage,
    body: `
      ${groundShadow(800, 1670, 420, 60)}
      <path d="M470 900 Q520 260 800 260 Q1080 260 1130 900" stroke="url(#s-cocoa)" stroke-width="44" fill="none" filter="url(#soft)"/>
      <g filter="url(#soft)">
        ${[0, 1, 2]
          .map((r) =>
            [0, 1, 2]
              .map((c) => {
                const x = 430 + c * 250;
                const y = 880 + r * 250;
                const ring = [
                  ['s-butter', 's-rose', 's-white'],
                  ['s-sage', 's-blush', 's-oat'],
                  ['s-rose', 's-butter', 's-white'],
                ][(r + c) % 3];
                return `<rect x="${x}" y="${y}" width="240" height="240" rx="14" fill="url(#${ring[2]})"/>
                  <rect x="${x + 36}" y="${y + 36}" width="168" height="168" rx="10" fill="url(#${ring[1]})"/>
                  <circle cx="${x + 120}" cy="${y + 120}" r="46" fill="url(#${ring[0]})"/>`;
              })
              .join(''),
          )
          .join('')}
        <rect x="425" y="875" width="750" height="750" rx="20" fill="none" stroke="${C.cocoa}" stroke-width="12"/>
      </g>
      ${hook(1050, 1720, -12)}`,
  }),

  'gantungan-kunci-hati-rajut-rose': scene({
    top: '#F7DDD6',
    bottom: C.blush,
    table: C.oat,
    body: `
      ${groundShadow(800, 1640, 450, 55)}
      ${[
        [520, 980, 1, 's-rose', -10],
        [880, 860, 1.15, 's-butter', 6],
        [1180, 1080, 0.9, 's-sage', 14],
      ]
        .map(
          ([x, y, s, f, a]) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})" filter="url(#soft)">
            <circle cx="0" cy="-470" r="46" fill="none" stroke="#B8BCC2" stroke-width="16"/>
            <path d="M0 -424 V-300" stroke="#B8BCC2" stroke-width="10"/>
            <path d="M0 -300 v70" stroke="${C.cocoa}" stroke-width="8"/>
            <path d="M0 260 C-60 200 -260 80 -260 -60 C-260 -170 -170 -230 -90 -230 C-40 -230 -10 -200 0 -170 C10 -200 40 -230 90 -230 C170 -230 260 -170 260 -60 C260 80 60 200 0 260Z" fill="url(#${f})"/>
            <path d="M-170 -80 C-170 -140 -120 -170 -80 -160" stroke="#fff" stroke-width="12" fill="none" opacity=".45" stroke-linecap="round"/>
          </g>`,
        )
        .join('')}`,
  }),

  'scrunchie-bando-rajut-set-pastel': scene({
    top: C.lilac,
    bottom: '#E3D8EC',
    table: C.cream,
    body: `
      ${groundShadow(800, 1640, 480, 55)}
      <g filter="url(#soft)">
        <path d="M300 1100 Q800 360 1300 1100" stroke="url(#s-butter)" stroke-width="110" fill="none" stroke-linecap="round"/>
        <path d="M300 1100 Q800 360 1300 1100" stroke="${C.butterDark}" stroke-width="4" fill="none" stroke-dasharray="14 18" opacity=".6"/>
        <g transform="translate(800 690)">${rose(0, 0, 95, 's-rose', C.roseDark)}</g>
      </g>
      ${[
        [520, 1360, 's-blush', C.blushDark],
        [1080, 1380, 's-sage', C.sageDark],
      ]
        .map(
          ([cx, cy, f, l]) => `<g filter="url(#soft)">
            <circle cx="${cx}" cy="${cy}" r="210" fill="url(#${f})"/>
            ${Array.from({ length: 18 })
              .map((_, i) => {
                const a = (i / 18) * Math.PI * 2;
                return `<circle cx="${cx + Math.cos(a) * 190}" cy="${cy + Math.sin(a) * 190}" r="46" fill="url(#${f})" stroke="${l}" stroke-opacity=".35" stroke-width="3"/>`;
              })
              .join('')}
            <circle cx="${cx}" cy="${cy}" r="92" fill="${C.cream}"/>
            <circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="${l}" stroke-width="6" opacity=".4"/>
          </g>`,
        )
        .join('')}`,
  }),

  'bucket-hat-rajut-butter-katun': scene({
    top: C.sage,
    bottom: '#A9BBA4',
    table: C.butter,
    body: `
      ${groundShadow(800, 1500, 560, 70)}
      <g filter="url(#soft)">
        <ellipse cx="800" cy="1250" rx="600" ry="190" fill="url(#s-butter)"/>
        <ellipse cx="800" cy="1250" rx="600" ry="190" fill="none" stroke="${C.butterDark}" stroke-width="10"/>
        ${[1, 2, 3].map((i) => `<ellipse cx="800" cy="1250" rx="${600 - i * 45}" ry="${190 - i * 14}" fill="none" stroke="${C.butterDark}" stroke-width="4" opacity=".4"/>`).join('')}
        <path d="M430 1220 Q420 680 800 660 Q1180 680 1170 1220 Q800 1310 430 1220Z" fill="url(#s-butter)"/>
        <path d="M440 1120 Q800 1210 1160 1120 L1166 1190 Q800 1280 434 1190Z" fill="url(#s-rose)"/>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${470 + i * 4} ${1040 - i * 70} Q800 ${1120 - i * 80} ${1130 - i * 4} ${1040 - i * 70}" stroke="${C.butterDark}" stroke-width="4" fill="none" opacity=".35"/>`).join('')}
      </g>
      <g transform="translate(1060 1060) scale(.7)">${rose(0, 0, 80, 's-white', C.kraft)}</g>
      ${tag(240, 1620, -4)}`,
  }),

  'cardigan-rajut-granny-oat': scene({
    top: C.rose,
    bottom: '#D9958A',
    table: C.oat,
    body: `
      <path d="M800 260 q-40 -60 0 -110 q40 50 0 110" stroke="${C.cocoa}" stroke-width="10" fill="none"/>
      <path d="M560 330 Q800 220 1040 330" stroke="${C.cocoaSoft}" stroke-width="22" fill="none" stroke-linecap="round"/>
      ${groundShadow(800, 1700, 420, 50, 0.25)}
      <g filter="url(#soft)">
        <path d="M560 340 L320 520 L180 1200 L340 1240 L450 760 L470 1640 H1130 L1150 760 L1260 1240 L1420 1200 L1280 520 L1040 340 Q800 520 560 340Z" fill="url(#s-oat)"/>
        <path d="M560 340 Q800 560 800 1640" stroke="url(#s-rose-sm)" stroke-width="40" fill="none"/>
        <path d="M1040 340 Q800 560 800 1640" stroke="url(#s-rose-sm)" stroke-width="40" fill="none"/>
        ${[
          [520, 900, 's-sage-sm', 's-butter-sm'],
          [1080, 900, 's-butter-sm', 's-blush-sm'],
          [520, 1260, 's-blush-sm', 's-sage-sm'],
          [1080, 1260, 's-sage-sm', 's-rose-sm'],
        ]
          .map(
            ([x, y, a, b]) =>
              `<rect x="${x - 120}" y="${y - 120}" width="240" height="240" rx="12" fill="url(#${a})"/><circle cx="${x}" cy="${y}" r="62" fill="url(#${b})"/>`,
          )
          .join('')}
        ${[0, 1, 2, 3].map((i) => `<circle cx="${780 - i * 6}" cy="${760 + i * 210}" r="22" fill="${C.cocoa}"/>`).join('')}
        <rect x="180" y="1150" width="170" height="80" rx="20" fill="url(#s-rose-sm)" transform="rotate(12 265 1190)"/>
        <rect x="1250" y="1150" width="170" height="80" rx="20" fill="url(#s-rose-sm)" transform="rotate(-12 1335 1190)"/>
      </g>`,
  }),

  'pot-kaktus-rajut-dekorasi-meja': scene({
    top: C.butter,
    bottom: '#F6E6B2',
    table: C.sage,
    body: `
      ${groundShadow(800, 1690, 340, 55)}
      <g filter="url(#soft)">
        <path d="M720 980 Q720 560 800 540 Q880 560 880 980Z" fill="url(#s-sage)"/>
        <path d="M720 860 Q560 860 560 700 Q560 640 610 640 Q660 640 660 700 Q660 780 720 790Z" fill="url(#s-sage)"/>
        <path d="M880 800 Q1040 800 1040 610 Q1040 560 990 560 Q940 560 940 610 Q940 720 880 730Z" fill="url(#s-sage)"/>
        ${[0, 1, 2, 3].map((i) => `<path d="M${760 + i * 27} 580 V980" stroke="${C.sageDark}" stroke-width="5" opacity=".5"/>`).join('')}
        <circle cx="800" cy="540" r="44" fill="url(#s-rose)"/>
        <circle cx="610" cy="640" r="30" fill="url(#s-blush)"/><circle cx="990" cy="560" r="30" fill="url(#s-butter)"/>
        <path d="M540 960 H1060 L1000 1660 H600Z" fill="url(#s-rose)"/>
        <rect x="510" y="940" width="580" height="140" rx="26" fill="url(#s-rose)"/>
        <rect x="510" y="940" width="580" height="140" rx="26" fill="none" stroke="${C.roseDark}" stroke-width="8"/>
      </g>
      ${face(800, 1300, 0.9)}
      ${yarnBall(1260, 1620, 105, C.sage, C.sageDark)}${hook(180, 1760, -8)}`,
  }),

  'sepatu-bayi-rajut-sage-hadiah-baby-shower': scene({
    top: C.cream,
    bottom: '#F1E8DA',
    table: C.blush,
    body: `
      <g filter="url(#soft)">
        <path d="M200 520 Q800 420 1400 520 V1380 Q800 1460 200 1380Z" fill="url(#s-white)" transform="rotate(-4 800 900)"/>
        ${[0, 1, 2, 3, 4].map((i) => `<path d="M220 ${600 + i * 170} Q800 ${520 + i * 170} 1380 ${600 + i * 170}" stroke="${C.blush}" stroke-width="18" fill="none" opacity=".7" transform="rotate(-4 800 900)"/>`).join('')}
      </g>
      ${groundShadow(800, 1560, 480, 50)}
      ${[
        [520, 1240, -8],
        [1060, 1290, 10],
      ]
        .map(
          ([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})" filter="url(#soft)">
            <path d="M-220 120 Q-240 0 -120 -10 L-80 -200 H110 L120 -20 Q260 -10 250 120 Q0 190 -220 120Z" fill="url(#s-sage)"/>
            <path d="M-90 -210 H120 V-150 H-90Z" fill="url(#s-white)"/>
            <path d="M-230 120 Q0 200 260 120" stroke="${C.sageDark}" stroke-width="12" fill="none"/>
            <path d="M0 -20 q-80 -70 -100 10 q40 30 100 -10 q80 -70 100 10 q-40 30 -100 -10" fill="${C.butter}"/>
          </g>`,
        )
        .join('')}
      ${tag(1000, 520, 8, 'Hai, bayi!')}`,
  }),
};

/** Only these scenes are still used, as clearly labelled illustrations. */
const KEEP = {
  'buket-bunga-tulip-rajut-pastel-bekasi': 'ilustrasi-buket-tulip-rajut',
  'tas-tote-rajut-sage-katun': 'ilustrasi-tas-tote-rajut',
  'cardigan-rajut-granny-oat': 'ilustrasi-cardigan-rajut',
  'gantungan-kunci-hati-rajut-rose': 'ilustrasi-gantungan-kunci-hati-rajut',
};

for (const [scene, name] of Object.entries(KEEP)) {
  const svg = scenes[scene];
  const base = sharp(Buffer.from(svg), { density: 72 });
  const buf = await base.jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(`${OUT}${name}.jpg`);
  console.log('✓', name);
}

// ============================================================
// Genera i placeholder SVG per i pezzi, in attesa delle foto vere.
// Estetica: strati orizzontali come in una stampa FDM, con un
// "layer shift" e una banda oro. Deterministici per slug.
// Uso: npm run placeholders
// ============================================================
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../public/images/works');

// slug -> numero di varianti
const PIECES = {
  'dragon-bust': 3,
  'geometric-planter': 2,
  'cyber-warrior': 2,
  'loop-sculpture': 2,
  'modular-organizer': 2,
  'headphone-stand': 2,
};

// Chiaro: stampe su PLA White. Scuro: "il laboratorio di notte" — le stesse
// bande, stesse geometrie (stesso seed), palette Notturno di global.css.
const LIGHT = {
  paper: '#eff0f2',
  dim: '#e3e4e8',
  line: '#cfcdd7',
  lineDeep: '#bdb9c6',
  purple: '#5b2e91',
  purpleSoft: '#8f6fb8',
  purpleGhost: '#c9bade',
  text: '#241a30',
  gold: '#ffce00',
};

const DARK = {
  paper: '#211a2e',
  dim: '#2b2337',
  line: '#352d47',
  lineDeep: '#403756',
  purple: '#5b2e91',
  purpleSoft: '#6b4fa4',
  purpleGhost: '#4d3f68',
  text: '#cfc9da',
  gold: '#ffce00',
};

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str) {
  let h = 2166136261;
  for (const ch of str) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function placeholder(slug, variant, C) {
  const rnd = mulberry32(hash(slug) + variant * 7919);
  const W = 1200;
  const H = 900;
  const bands = [];
  const n = 8 + Math.floor(rnd() * 5);
  const shiftAt = 2 + Math.floor(rnd() * (n - 5));
  const goldAt = shiftAt + 1 + Math.floor(rnd() * 2);

  let y = 0;
  for (let i = 0; i < n && y < H; i++) {
    const gap = 4 + rnd() * 12;
    const h = 36 + rnd() * 120;
    const r = rnd();
    let fill = C.dim;
    if (r > 0.88) fill = C.purpleGhost;
    else if (r > 0.78) fill = C.purpleSoft;
    else if (r > 0.62) fill = C.line;
    else if (r > 0.5) fill = C.lineDeep;

    // il layer shift: una banda spostata orizzontalmente
    const dx = i === shiftAt ? (rnd() > 0.5 ? 52 : -52) : 0;
    bands.push(
      `<rect x="${(-80 + dx).toFixed(1)}" y="${y.toFixed(1)}" width="${W + 160}" height="${h.toFixed(1)}" fill="${fill}"/>`,
    );

    // una banda oro, sottile, dentro una banda vicina allo shift
    if (i === goldAt) {
      const gh = 8 + rnd() * 8;
      bands.push(
        `<rect x="${(-80 + dx).toFixed(1)}" y="${(y + h / 2 - gh / 2).toFixed(1)}" width="${W + 160}" height="${gh.toFixed(1)}" fill="${C.gold}"/>`,
      );
    }
    y += h + gap;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
<rect width="${W}" height="${H}" fill="${C.paper}"/>
${bands.join('\n')}
<text x="48" y="${H - 44}" font-family="'Space Mono', ui-monospace, monospace" font-size="22" letter-spacing="1" fill="${C.text}" opacity="0.5">${slug} · layer 0.2 mm</text>
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
let count = 0;
for (const [slug, variants] of Object.entries(PIECES)) {
  for (let v = 1; v <= variants; v++) {
    writeFileSync(join(OUT, `${slug}-${v}.svg`), placeholder(slug, v, LIGHT));
    writeFileSync(join(OUT, `${slug}-${v}-dark.svg`), placeholder(slug, v, DARK));
    count += 2;
  }
}
console.log(`Generati ${count} placeholder (chiaro + dark) in public/images/works/`);

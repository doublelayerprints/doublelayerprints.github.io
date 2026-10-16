# Foto remix nei lavori — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare le 70 foto remix (personaggi stampati da modelli di altri creator) in 14 nuovi pezzi del sito, con foto ottimizzate, descrizioni IT/EN, specifiche opzionali e 4 nuovi pezzi in evidenza in homepage.

**Architecture:** Le specifiche di stampa diventano opzionali nello schema (i pezzi senza dati nascondono tabella e righe tessera). 28 nuovi file md (14 pezzi × IT/EN) con `origin: remix`. Le foto vengono ridimensionate (1600px, q72) in `public/images/works/` con nomi `<slug>-<n>.jpg`; le foto di coppia sono condivise tra le pagine dei due personaggi. Layout foto: crop top 4:3 sulle tessere, foto intere in portrait nel dettaglio.

**Tech stack:** Astro 5 + Zod, `sips` (macOS) per le immagini, JS zero framework. Verifica: `npm run build` + grep su `dist/` + controllo manuale.

**Importante — niente commit:** `AGENTS.md` vieta commit/push non richiesti. Nessuno step di commit.

**Spec:** `docs/superpowers/specs/2026-10-16-remix-photos-works-design.md`

---

## Struttura file

| File | Azione |
| --- | --- |
| `website/public/images/works/*.jpg` | Create (~60 foto ottimizzate, nomi `<slug>-<n>.jpg`) |
| `website/src/content/works/<slug>.{it,en}.md` × 14 | Create (28 file) |
| `website/src/content/works/{dragon-bust,geometric-planter,loop-sculpture,headphone-stand}.{it,en}.md` | Modify (featured: false) |
| `website/src/content.config.ts` | Modify (specs opzionali) |
| `website/src/components/ProductPlate.astro` | Modify (spec condizionale, crop top) |
| `website/src/components/SpecTable.astro` | Modify (righe opzionali) |
| `website/src/components/pages/WorkDetailPage.astro` | Modify (blocco specs condizionale, foto portrait) |

---

## Mappa foto definitive

Sorgente: `/Users/tancredi/Desktop/DoubleLayeRPrints/immagini_oggetti/ImmaginiRemix/IMG_*.jpg`
Destinazione: `website/public/images/works/<slug>-<n>.jpg` (tutte ridimensionate 1600px, jpeg q72).

| Slug | Foto (origine IMG_… → destinazione) |
| --- | --- |
| mario | 153205→mario-1, 153206→mario-2, 153214→mario-3, 153219→mario-4, 152931→mario-5 (coppia), 152938→mario-6 (coppia) |
| luigi | 153128→luigi-1, 153130→luigi-2, 153139→luigi-3, 153153→luigi-4, 152931→luigi-5, 152938→luigi-6, 153455→luigi-7, 153500→luigi-8 |
| dixie-kong | 153340→dixie-kong-1, 153345→dixie-kong-2, 153350→dixie-kong-3, 153235→dixie-kong-4, 153333→dixie-kong-5 |
| diddy-kong | 153400→diddy-kong-1, 153405→diddy-kong-2, 153410→diddy-kong-3, 153235→diddy-kong-4, 153333→diddy-kong-5 |
| shy-guy | 153422→shy-guy-1, 153436→shy-guy-2, 153441→shy-guy-3 |
| daisy | 153511→daisy-1, 153516→daisy-2, 153520→daisy-3, 153455→daisy-4, 153500→daisy-5 |
| jolteon | 153701→jolteon-1, 153706→jolteon-2, 153710→jolteon-3, 153650→jolteon-4, 153655→jolteon-5 |
| umbreon | 153718→umbreon-1, 153719→umbreon-2, 153724→umbreon-3, 153729→umbreon-4, 153650→umbreon-5, 153655→umbreon-6 |
| gengar | 153749→gengar-1, 153756→gengar-2, 153800→gengar-3 |
| toad | 113706→toad-1, 113714→toad-2, 113721→toad-3, 113731→toad-4, 113702→toad-5, 113758→toad-6 |
| bullet-bill | 113750→bullet-bill-1, 113802→bullet-bill-2, 113808→bullet-bill-3, 113813→bullet-bill-4, 113816→bullet-bill-5, 113831→bullet-bill-6, 113840→bullet-bill-7, 113847→bullet-bill-8, 113702→bullet-bill-9, 113758→bullet-bill-10 |
| sorcerer-mickey | 113914→sorcerer-mickey-1, 113919→-2, 113929→-3, 113934→-4, 113940→-5, 113945→-6 |
| daffy-duck | 121144→daffy-duck-1, 121152→-2, 121202→-3, 121224→-4, 121231→-5 |
| tweety | 122458→tweety-1, 122503→-2, 122508→-3, 122515→-4, 122521→-5, 122531→-6 |

Scartate (duplicati quasi identici): 153128-derivati non elencati, 152931/152938 restano come coppia, 153650/153655 condivise, niente altro. Totale file fisici da produrre: 6+8+5+5+3+5+5+6+3+6+10+6+5+6 = 79 (le foto di coppia sono duplicate fisicamente per slug; ~150-300KB l'una dopo la compressione).

---

### Task 1: Schema — specifiche opzionali

**Files:**
- Modify: `website/src/content.config.ts`

- [ ] **Step 1: Rendi opzionali i cinque campi specs**

Sostituisci:

```ts
    materials: z.string(),
    dimensions: z.string(),
    layerHeight: z.string(),
    weight: z.string(),
    printTime: z.string(),
```

con:

```ts
    materials: z.string().optional(),
    dimensions: z.string().optional(),
    layerHeight: z.string().optional(),
    weight: z.string().optional(),
    printTime: z.string().optional(),
```

- [ ] **Step 2: Build**

Run: `npm run build` (da `website/`)
Expected: build OK (i 6 pezzi attuali hanno tutti i campi; i nuovi non esistono ancora).

---

### Task 2: Componenti — spec condizionali e foto portrait

**Files:**
- Modify: `website/src/components/ProductPlate.astro`
- Modify: `website/src/components/SpecTable.astro`
- Modify: `website/src/components/pages/WorkDetailPage.astro`

- [ ] **Step 1: ProductPlate — riga spec solo se ci sono dati**

Nel frontmatter di `ProductPlate.astro` non serve var aggiuntiva. Nel markup, sostituisci:

```astro
      <p class="plate__spec">
        <span>{entry.data.materials}</span>
        <span>{entry.data.layerHeight}</span>
      </p>
```

con:

```astro
      {
        (entry.data.materials || entry.data.layerHeight) && (
          <p class="plate__spec">
            {entry.data.materials && <span>{entry.data.materials}</span>}
            {entry.data.layerHeight && <span>{entry.data.layerHeight}</span>}
          </p>
        )
      }
```

- [ ] **Step 2: ProductPlate — crop top per foto verticali**

Nello `<style>`, sostituisci la regola `.plate__media img { ... }`:

```css
  .plate__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s var(--ease-lay);
  }
```

con:

```css
  .plate__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 0.4s var(--ease-lay);
  }
```

- [ ] **Step 3: SpecTable — righe solo con valore**

Nel frontmatter, sostituisci:

```ts
const rows: Array<[UIKey, string]> = [
  ['spec.material', entry.data.materials],
  ['spec.dimensions', entry.data.dimensions],
  ['spec.layer', entry.data.layerHeight],
  ['spec.weight', entry.data.weight],
  ['spec.time', entry.data.printTime],
];
```

con:

```ts
const rows: Array<[UIKey, string]> = (
  [
    ['spec.material', entry.data.materials],
    ['spec.dimensions', entry.data.dimensions],
    ['spec.layer', entry.data.layerHeight],
    ['spec.weight', entry.data.weight],
    ['spec.time', entry.data.printTime],
  ] as Array<[UIKey, string | undefined]>
).filter((row): row is [UIKey, string] => Boolean(row[1]));
```

e rendi condizionale il render:

```astro
---
// frontmatter come sopra
---

{rows.length > 0 && (
  <dl class="specs">
    {
      rows.map(([key, value]) => (
        <div class="specs__row">
          <dt>{t(key)}</dt>
          <dd>{value}</dd>
        </div>
      ))
    }
  </dl>
)}
```

- [ ] **Step 4: WorkDetailPage — blocco specifiche solo se esistono valori**

Nel frontmatter aggiungi:

```ts
const hasSpecs = Boolean(
  entry.data.materials ||
    entry.data.dimensions ||
    entry.data.layerHeight ||
    entry.data.weight ||
    entry.data.printTime,
);
```

e nel markup avvolgi il blocco:

```astro
          <div id="specifiche">
            <p class="detail__specs-eyebrow" aria-hidden="true">; SLICER DATA</p>
            <h2 class="detail__specs-title">{t('work.specs')}</h2>
            <SpecTable entry={entry} lang={lang} />
          </div>
```

con:

```astro
          {
            hasSpecs && (
              <div id="specifiche">
                <p class="detail__specs-eyebrow" aria-hidden="true">; SLICER DATA</p>
                <h2 class="detail__specs-title">{t('work.specs')}</h2>
                <SpecTable entry={entry} lang={lang} />
              </div>
            )
          }
```

- [ ] **Step 5: WorkDetailPage — foto vere intere, placeholder 4:3**

Nel frontmatter:

```ts
const isPlaceholder = entry.data.photos[0].endsWith('.svg');
```

esiste già. Nello `<style>`, aggiungi dopo la regola `.photo--main img { ... }`:

```css
  .photo--main img.photo--real {
    aspect-ratio: auto;
  }
```

e nel markup, per il `<figure>` principale, cambia la classe dell'img:

```astro
            <img
              class={isPlaceholder ? 'photo--light' : 'photo--real'}
              ...
```

(fusiona con la classe esistente: se `isPlaceholder` → `'photo--light'`, altrimenti `'photo--real'`.)

Per i thumb, lascia il crop (le miniature piccole stanno bene 4:3).

- [ ] **Step 6: Build**

Run: `npm run build` (da `website/`)
Expected: OK. I 6 pezzi attuali continuano a mostrare specs (hanno tutti i campi).

---

### Task 3: Foto — ridimensiona, comprimi, copia

**Files:**
- Create: `website/public/images/works/<slug>-<n>.jpg` (79 file, mappa nel prologo)

- [ ] **Step 1: Script di conversione**

Da repo root, esegui uno script zsh che per ogni coppia `(origine, destinazione)` della mappa:

```bash
SRC="/Users/tancredi/Desktop/DoubleLayeRPrints/immagini_oggetti/ImmaginiRemix"
DST="website/public/images/works"
convert() {
  sips -Z 1600 -s format jpeg -s formatOptions 72 "$SRC/IMG_$1.jpg" --out "$DST/$2" >/dev/null
}
# mario
convert 20261003_153205.jpg mario-1.jpg
convert 20261003_153206.jpg mario-2.jpg
convert 20261003_153214.jpg mario-3.jpg
convert 20261003_153219.jpg mario-4.jpg
convert 20261003_152931.jpg mario-5.jpg
convert 20261003_152938.jpg mario-6.jpg
# luigi
convert 20261003_153128.jpg luigi-1.jpg
convert 20261003_153130.jpg luigi-2.jpg
convert 20261003_153139.jpg luigi-3.jpg
convert 20261003_153153.jpg luigi-4.jpg
convert 20261003_152931.jpg luigi-5.jpg
convert 20261003_152938.jpg luigi-6.jpg
convert 20261003_153455.jpg luigi-7.jpg
convert 20261003_153500.jpg luigi-8.jpg
# dixie-kong
convert 20261003_153340.jpg dixie-kong-1.jpg
convert 20261003_153345.jpg dixie-kong-2.jpg
convert 20261003_153350.jpg dixie-kong-3.jpg
convert 20261003_153235.jpg dixie-kong-4.jpg
convert 20261003_153333.jpg dixie-kong-5.jpg
# diddy-kong
convert 20261003_153400.jpg diddy-kong-1.jpg
convert 20261003_153405.jpg diddy-kong-2.jpg
convert 20261003_153410.jpg diddy-kong-3.jpg
convert 20261003_153235.jpg diddy-kong-4.jpg
convert 20261003_153333.jpg diddy-kong-5.jpg
# shy-guy
convert 20261003_153422.jpg shy-guy-1.jpg
convert 20261003_153436.jpg shy-guy-2.jpg
convert 20261003_153441.jpg shy-guy-3.jpg
# daisy
convert 20261003_153511.jpg daisy-1.jpg
convert 20261003_153516.jpg daisy-2.jpg
convert 20261003_153520.jpg daisy-3.jpg
convert 20261003_153455.jpg daisy-4.jpg
convert 20261003_153500.jpg daisy-5.jpg
# jolteon
convert 20261003_153701.jpg jolteon-1.jpg
convert 20261003_153706.jpg jolteon-2.jpg
convert 20261003_153710.jpg jolteon-3.jpg
convert 20261003_153650.jpg jolteon-4.jpg
convert 20261003_153655.jpg jolteon-5.jpg
# umbreon
convert 20261003_153718.jpg umbreon-1.jpg
convert 20261003_153719.jpg umbreon-2.jpg
convert 20261003_153724.jpg umbreon-3.jpg
convert 20261003_153729.jpg umbreon-4.jpg
convert 20261003_153650.jpg umbreon-5.jpg
convert 20261003_153655.jpg umbreon-6.jpg
# gengar
convert 20261003_153749.jpg gengar-1.jpg
convert 20261003_153756.jpg gengar-2.jpg
convert 20261003_153800.jpg gengar-3.jpg
# toad
convert 20261010_113706.jpg toad-1.jpg
convert 20261010_113714.jpg toad-2.jpg
convert 20261010_113721.jpg toad-3.jpg
convert 20261010_113731.jpg toad-4.jpg
convert 20261010_113702.jpg toad-5.jpg
convert 20261010_113758.jpg toad-6.jpg
# bullet-bill
convert 20261010_113750.jpg bullet-bill-1.jpg
convert 20261010_113802.jpg bullet-bill-2.jpg
convert 20261010_113808.jpg bullet-bill-3.jpg
convert 20261010_113813.jpg bullet-bill-4.jpg
convert 20261010_113816.jpg bullet-bill-5.jpg
convert 20261010_113831.jpg bullet-bill-6.jpg
convert 20261010_113840.jpg bullet-bill-7.jpg
convert 20261010_113847.jpg bullet-bill-8.jpg
convert 20261010_113702.jpg bullet-bill-9.jpg
convert 20261010_113758.jpg bullet-bill-10.jpg
# sorcerer-mickey
convert 20261010_113914.jpg sorcerer-mickey-1.jpg
convert 20261010_113919.jpg sorcerer-mickey-2.jpg
convert 20261010_113929.jpg sorcerer-mickey-3.jpg
convert 20261010_113934.jpg sorcerer-mickey-4.jpg
convert 20261010_113940.jpg sorcerer-mickey-5.jpg
convert 20261010_113945.jpg sorcerer-mickey-6.jpg
# daffy-duck
convert 20261013_121144.jpg daffy-duck-1.jpg
convert 20261013_121152.jpg daffy-duck-2.jpg
convert 20261013_121202.jpg daffy-duck-3.jpg
convert 20261013_121224.jpg daffy-duck-4.jpg
convert 20261013_121231.jpg daffy-duck-5.jpg
# tweety
convert 20261013_122458.jpg tweety-1.jpg
convert 20261013_122503.jpg tweety-2.jpg
convert 20261013_122508.jpg tweety-3.jpg
convert 20261013_122515.jpg tweety-4.jpg
convert 20261013_122521.jpg tweety-5.jpg
convert 20261013_122531.jpg tweety-6.jpg
```

- [ ] **Step 2: Verifica**

Run: `ls website/public/images/works/*.jpg | wc -l` → `79`
Run: `du -sh website/public/images/works` → qualche MB, non centinaia.
Run: `sips -g pixelWidth website/public/images/works/mario-1.jpg` → width 1200 (portrait: la Z di sips limita il lato lungo a 1600, quindi 1200×1600).

---

### Task 4: Contenuti — 28 file md

**Files:**
- Create: 28 file `website/src/content/works/<slug>.{it,en}.md`

- [ ] **Step 1: Scrivi i 28 file**

Template frontmatter (valori tra parentesi angolari variano per pezzo):

```markdown
---
title: '<titolo>'
category: figures
origin: remix
photos:
  - 'images/works/<slug>-1.jpg'
  - 'images/works/<slug>-2.jpg'
  …
alt: '<alt della foto principale>'
featured: <true per mario, gengar, sorcerer-mickey, tweety; false altrove>
order: <7..20 come da spec>
---

<Paragrafo 1 IT>

<Paragrafo 2 IT>
```

Ordini e featured:
- mario: order 7, featured true
- luigi: 8; dixie-kong: 9; diddy-kong: 10; shy-guy: 11; daisy: 12;
  jolteon: 13; umbreon: 14; gengar: 15 (featured true); toad: 16;
  bullet-bill: 17; sorcerer-mickey: 18 (featured true); daffy-duck: 19;
  tweety: 20 (featured true)

Titoli IT/EN: Mario/Mario; Luigi/Luigi; Dixie Kong/Dixie Kong; Diddy Kong/Diddy Kong; Shy Guy/Shy Guy; Principessa Daisy/Princess Daisy; Jolteon/Jolteon; Umbreon/Umbreon; Gengar/Gengar; Toad/Toad; Bullet Bill/Bullet Bill; Topolino stregone/Sorcerer Mickey; Daffy Duck/Daffy Duck; Titti/Tweety.

Foto per pezzo (dal prologo, nella lista `photos` in ordine `-1, -2, …`).

Alt text (foto principale): descrivere il soggetto, materiale e contesto, es. per mario: "Statua di Mario stampata in 3D nei colori classici, in posa di combattimento al sole".

Descrizioni: 2 paragrafi per lingua, voce del sito (giocosa, plurale, "noi"), es. stile dei pezzi attuali. Menzione che è un remix? No: l'etichetta "Remix" è già visibile nell'UI; il testo racconta il pezzo (colori, dettagli, dove sta in casa). Niente nomi di creator (decisione spec 2026-10-15).

- [ ] **Step 2: Aggiorna i 4 file dei vecchi featured**

In `dragon-bust.it.md`, `dragon-bust.en.md`, `geometric-planter.{it,en}.md`,
`loop-sculpture.{it,en}.md`, `headphone-stand.{it,en}.md`: cambia
`featured: true` → `featured: false`. (8 file: drago, vaso, loop, porta cuffie.)

- [ ] **Step 3: Build**

Run: `npm run build` (da `website/`)
Expected: OK. Pagine totali: 21 + 28 = 49? No: 21 attuali includono 12 pagine pezzo (6 pezzi ×2) + 9 pagine fisse; con 20 pezzi ×2 = 40 pagine pezzo + 9 = 49.

---

### Task 5: Verifica finale

- [ ] **Step 1: Build pulita**

Run: `npm run build` (da `website/`) → OK, 49 pagine.

- [ ] **Step 2: Grep su dist**

- `ls website/dist/lavori | wc -l` → 20 slug + index (21 voci, incluse cartelle).
- `grep -o 'data-origin="remix"' website/dist/lavori/index.html | wc -l` → 14.
- `grep -rl 'Fatto da noi' website/dist/lavori/ | wc -l` → 6 (solo i vecchi) + index? No: le tessere mostrano anche i remix... verificare che "Remix" compaia: `grep -c 'Remix' website/dist/lavori/index.html` ≥ 14.
- Homepage: `grep -o 'Mario\|Gengar\|Topolino stregone\|Titti' website/dist/index.html | sort | uniq -c` → i 4 featured presenti.

- [ ] **Step 3: Controllo manuale**

Dev server su `localhost:4321`: home con 4 nuove tessere; `/lavori/` con 20 pezzi; filtro "Remix" → 14; dettaglio pezzo con foto portrait intere e senza tabella specs; tema scuro OK; EN mirror.

- [ ] **Step 4: Report all'utente**

Elenca i 14 pezzi aggiunti, le foto scartate, le scelte di crop e le descrizioni scritte (da correggere se vuole).

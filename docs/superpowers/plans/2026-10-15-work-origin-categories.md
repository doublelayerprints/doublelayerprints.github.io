# Origine pezzi "Fatto da noi / Remix" — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere ai lavori del sito la dimensione "fatto da noi / remix" (campo `origin` nello schema dei contenuti), visibile come etichetta sulle tessere, nella pagina di dettaglio e come seconda riga di filtri in pagina lavori.

**Architecture:** Nuovo campo `origin: 'original' | 'remix'` con default `'original'` nello schema Zod della collection `works`. Etichette bilingui in `i18n/ui.ts`. Le tessere (`ProductPlate`) mostrano "categoria · origine"; la pagina lavori filtra con due righe di chip combinate (AND); la pagina di dettaglio compone l'eyebrow con categoria e origine.

**Tech stack:** Astro 5 statico, Zod per lo schema contenuti, JS inline vanilla per il filtraggio. Nessun test framework: la verifica è `npm run build` dentro `website/` (comando di verifica richiesto da `AGENTS.md`) + grep su `dist/` + controllo manuale con dev server.

**Importante — niente commit:** `AGENTS.md` vieta commit e push se non richiesti esplicitamente dall'utente. Questo piano NON contiene step di commit; si aggiornano solo file in locale.

**Spec:** `docs/superpowers/specs/2026-10-15-work-origin-categories-design.md`

---

## Struttura file

| File | Azione | Responsabilità |
| --- | --- | --- |
| `website/src/content.config.ts` | Modifica | Aggiunge `origin` allo schema `works` |
| `website/src/i18n/ui.ts` | Modifica | Chiavi bilingui per etichetta origine e filtri |
| `website/src/components/ProductPlate.astro` | Modifica | Etichetta "categoria · origine" sulla tessera |
| `website/src/components/pages/WorksPage.astro` | Modifica | Due righe di chip (origine + categoria), filtro combinato |
| `website/src/components/pages/WorkDetailPage.astro` | Modifica | Origine nell'eyebrow della pagina pezzo |

Nessun file nuovo, nessuna modifica ai 12 `.md` in `website/src/content/works/` (default `original` li copre).

---

### Task 1: Campo `origin` nello schema contenuti

**Files:**
- Modify: `website/src/content.config.ts`

- [ ] **Step 1: Aggiungi il campo allo schema**

In `website/src/content.config.ts`, nello schema della collection `works`, aggiungi `origin` subito sotto la riga `category`. Il blocco deve diventare:

```ts
  schema: z.object({
    title: z.string(),
    category: z.enum(['figures', 'home', 'tools', 'art']),
    origin: z.enum(['original', 'remix']).default('original'),
    materials: z.string(),
    dimensions: z.string(),
    layerHeight: z.string(),
    weight: z.string(),
    printTime: z.string(),
    photos: z.array(z.string()).min(1),
    alt: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
```

- [ ] **Step 2: Verifica build**

Run: `npm run build` (da `website/`)
Expected: build completata senza errori. I 12 `.md` esistenti non dichiarano `origin` e devono passare grazie al default. Se la build fallisce con errore Zod su un pezzo, il campo è stato aggiunto male (typo nell'enum o nel default).

---

### Task 2: Chiavi i18n per origine e filtri

**Files:**
- Modify: `website/src/i18n/ui.ts`

- [ ] **Step 1: Aggiorna il blocco "works" italiano**

In `website/src/i18n/ui.ts`, sezione `it`, sostituisci:

```ts
    'works.filter.all': 'Tutti',
    'works.filterLabel': 'Filtra per categoria',
```

con:

```ts
    'works.filter.all': 'Tutte',
    'works.filter.allOrigins': 'Tutte le origini',
    'works.filter.originLabel': 'Filtra per origine',
    'works.filterLabel': 'Filtra per categoria',
```

(`works.filter.all` passa al femminile plurale: la riga categorie filtra "categorie".)

- [ ] **Step 2: Aggiungi le chiavi origine italiane**

Nella sezione `it`, subito dopo il blocco `// Categorie` (dopo `'cat.art': 'Arte',`), aggiungi:

```ts
    // Origine
    'origin.original': 'Fatto da noi',
    'origin.remix': 'Remix',
```

- [ ] **Step 3: Stesse modifiche nel blocco inglese**

Sezione `en`, sostituisci:

```ts
    'works.filter.all': 'All',
    'works.filterLabel': 'Filter by category',
```

con:

```ts
    'works.filter.all': 'All',
    'works.filter.allOrigins': 'All origins',
    'works.filter.originLabel': 'Filter by origin',
    'works.filterLabel': 'Filter by category',
```

- [ ] **Step 4: Aggiungi le chiavi origine inglesi**

Sezione `en`, subito dopo `'cat.art': 'Art',`, aggiungi:

```ts
    'origin.original': 'Made by us',
    'origin.remix': 'Remix',
```

- [ ] **Step 5: Verifica build**

Run: `npm run build` (da `website/`)
Expected: build OK. `UIKey` deriva dalle chiavi del blocco `it`, quindi se le chiavi EN non combaciano esattamente (typo o chiave mancante) TypeScript blocca la build: è la verifica di consistenza.

---

### Task 3: Etichetta origine sulle tessere (ProductPlate)

**Files:**
- Modify: `website/src/components/ProductPlate.astro`

- [ ] **Step 1: Calcola la chiave origine nel frontmatter**

In `website/src/components/ProductPlate.astro`, nel frontmatter, sostituisci:

```ts
const catKey = `cat.${entry.data.category}` as UIKey;
```

con:

```ts
const catKey = `cat.${entry.data.category}` as UIKey;
const originKey = `origin.${entry.data.origin}` as UIKey;
```

- [ ] **Step 2: Mostra "categoria · origine" nella tessera**

Sostituisci:

```astro
        <p class="plate__cat">{t(catKey)}</p>
```

con:

```astro
        <p class="plate__cat">{t(catKey)} · {t(originKey)}</p>
```

- [ ] **Step 3: Verifica build e output**

Run: `npm run build` (da `website/`)
Expected: build OK.

Run: `grep -rl 'Fatto da noi' website/dist/`
Expected: match su `website/dist/index.html` (homepage, tessere featured), `website/dist/lavori/index.html` e sulle pagine di dettaglio IT.

Run: `grep -rl 'Made by us' website/dist/`
Expected: match su `website/dist/en/index.html`, `website/dist/en/works/index.html` e pagine di dettaglio EN.

---

### Task 4: Pagina lavori — due righe di filtri combinate

**Files:**
- Modify: `website/src/components/pages/WorksPage.astro`

- [ ] **Step 1: Aggiungi origine ai dati nel frontmatter**

In `website/src/components/pages/WorksPage.astro`, nel frontmatter, sostituisci:

```ts
const cats = ['all', 'figures', 'home', 'tools', 'art'] as const;
const catLabel = (c: string) =>
  c === 'all' ? t('works.filter.all') : t(`cat.${c}` as UIKey);
```

con:

```ts
const cats = ['all', 'figures', 'home', 'tools', 'art'] as const;
const catLabel = (c: string) =>
  c === 'all' ? t('works.filter.all') : t(`cat.${c}` as UIKey);

const origins = ['all', 'original', 'remix'] as const;
const originLabel = (o: string) =>
  o === 'all' ? t('works.filter.allOrigins') : t(`origin.${o}` as UIKey);
```

- [ ] **Step 2: Due gruppi di chip nel markup**

Sostituisci il blocco `controls`:

```astro
      <div class="controls">
        <div class="chips" role="group" aria-label={t('works.filterLabel')}>
          {
            cats.map((c) => (
              <button class="chip" type="button" data-filter={c} aria-pressed={c === 'all' ? 'true' : 'false'}>
                {catLabel(c)}
              </button>
            ))
          }
        </div>
        <p class="count">
          <span data-count>{works.length}</span> {t('works.count')}
        </p>
      </div>
```

con:

```astro
      <div class="controls">
        <div class="controls__groups">
          <div class="chips" role="group" aria-label={t('works.filter.originLabel')}>
            {
              origins.map((o) => (
                <button class="chip" type="button" data-filter-origin={o} aria-pressed={o === 'all' ? 'true' : 'false'}>
                  {originLabel(o)}
                </button>
              ))
            }
          </div>
          <div class="chips" role="group" aria-label={t('works.filterLabel')}>
            {
              cats.map((c) => (
                <button class="chip" type="button" data-filter-cat={c} aria-pressed={c === 'all' ? 'true' : 'false'}>
                  {catLabel(c)}
                </button>
              ))
            }
          </div>
        </div>
        <p class="count">
          <span data-count>{works.length}</span> {t('works.count')}
        </p>
      </div>
```

- [ ] **Step 3: Esponi `data-origin` sulle celle della griglia**

Sostituisci:

```astro
            <div class="works-grid__cell" data-category={entry.data.category}>
```

con:

```astro
            <div class="works-grid__cell" data-category={entry.data.category} data-origin={entry.data.origin}>
```

- [ ] **Step 4: JS di filtraggio combinato**

Sostituisci l'intero blocco `<script is:inline>`:

```html
<script is:inline>
  const chips = document.querySelectorAll('[data-filter]');
  const cells = document.querySelectorAll('[data-grid] > [data-category]');
  const counter = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let visible = 0;
      cells.forEach((cell) => {
        const show = f === 'all' || cell.dataset.category === f;
        cell.hidden = !show;
        if (show) visible++;
      });
      if (counter) counter.textContent = String(visible);
      if (empty) empty.hidden = visible > 0;
    });
  });
</script>
```

con:

```html
<script is:inline>
  const originChips = document.querySelectorAll('[data-filter-origin]');
  const catChips = document.querySelectorAll('[data-filter-cat]');
  const cells = document.querySelectorAll('[data-grid] > [data-category]');
  const counter = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');

  let originFilter = 'all';
  let catFilter = 'all';

  const applyFilters = () => {
    let visible = 0;
    cells.forEach((cell) => {
      const show =
        (originFilter === 'all' || cell.dataset.origin === originFilter) &&
        (catFilter === 'all' || cell.dataset.category === catFilter);
      cell.hidden = !show;
      if (show) visible++;
    });
    if (counter) counter.textContent = String(visible);
    if (empty) empty.hidden = visible > 0;
  };

  const wireChips = (chips, datasetKey, setFilter) => {
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        setFilter(chip.dataset[datasetKey]);
        applyFilters();
      });
    });
  };

  wireChips(originChips, 'filterOrigin', (v) => {
    originFilter = v;
  });
  wireChips(catChips, 'filterCat', (v) => {
    catFilter = v;
  });
</script>
```

Nota: `data-filter-origin` → `dataset.filterOrigin`, `data-filter-cat` → `dataset.filterCat` (conversione camelCase standard).

- [ ] **Step 5: CSS per impilare le due righe**

Nello `<style>` di `WorksPage.astro`, sotto la regola `.chips { ... }`, aggiungi:

```css
  .controls__groups {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
```

- [ ] **Step 6: Verifica build e markup**

Run: `npm run build` (da `website/`)
Expected: build OK.

Run: `grep -c 'data-filter-origin' website/dist/lavori/index.html`
Expected: `3` (tre chip: tutte/original/remix).

Run: `grep -c 'data-filter-cat' website/dist/lavori/index.html`
Expected: `5` (cinque chip: tutte/figures/home/tools/art).

Run: `grep -c 'data-origin=' website/dist/lavori/index.html`
Expected: `6` (una cella per pezzo, tutti `original`).

Run: `grep -c 'data-origin=' website/dist/en/works/index.html`
Expected: `6`.

---

### Task 5: Origine nella pagina di dettaglio

**Files:**
- Modify: `website/src/components/pages/WorkDetailPage.astro`

- [ ] **Step 1: Calcola la chiave origine nel frontmatter**

In `website/src/components/pages/WorkDetailPage.astro`, sostituisci:

```ts
const catKey = `cat.${entry.data.category}` as UIKey;
```

con:

```ts
const catKey = `cat.${entry.data.category}` as UIKey;
const originKey = `origin.${entry.data.origin}` as UIKey;
```

- [ ] **Step 2: Componi l'eyebrow con categoria e origine**

Sostituisci:

```astro
          <p class="detail__cat">; {t(catKey).toUpperCase()}</p>
```

con:

```astro
          <p class="detail__cat">; {t(catKey).toUpperCase()} — {t(originKey).toUpperCase()}</p>
```

(Res: `; FIGURE — FATTO DA NOI`.)

- [ ] **Step 3: Verifica build e output**

Run: `npm run build` (da `website/`)
Expected: build OK.

Run: `grep -rl 'FATTO DA NOI' website/dist/lavori/`
Expected: match sulle 6 pagine di dettaglio IT (una per pezzo).

Run: `grep -rl 'MADE BY US' website/dist/en/works/`
Expected: match sulle 6 pagine di dettaglio EN.

---

### Task 6: Verifica finale completa

**Files:**
- Nessuno (solo verifica)

- [ ] **Step 1: Build pulita**

Run: `npm run build` (da `website/`)
Expected: build completata senza errori né warning nuovi.

- [ ] **Step 2: Controllo manuale con dev server**

Run: `npm run dev` (da `website/`, termina con Ctrl+C alla fine)

Apri e verifica (ripeti anche su `http://localhost:4321/en/works/`):
- `http://localhost:4321/lavori/`: due righe di chip; attivando "Remix" la griglia si svuota (tutti i pezzi sono original) e appare il messaggio "Nessun pezzo"; attivando "Remix" + "Figure" resta il messaggio vuoto; tornando su "Fatto da noi" + "Tutte" tornano tutti e 6; il contatore segue la combinazione.
- `http://localhost:4321/`: le tessere featured mostrano "categoria · Fatto da noi" e il layout non cambia.
- Pagina di dettaglio (es. `http://localhost:4321/lavori/dragon-bust/`): eyebrow `; ARTE — FATTO DA NOI` sopra il titolo.
- Tema scuro e tema chiaro: le tessere restano leggibili con la nuova etichetta.

- [ ] **Step 3: Segnala all'utente**

Riassumi cosa è cambiato, fai presente che nessun pezzo è ancora `remix` (per marcarne uno basta `origin: remix` nel frontmatter di `slug.it.md` e `slug.en.md`), e che i commit restano a carico dell'utente.

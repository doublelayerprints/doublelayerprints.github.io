# Rail: titoli di sezione come header in cima — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** L'indice mobile della rail si sposta: la sezione attiva è sempre l'header in cima alla rail (stile getartcraft), il passato esce sopra sfumando, i futuri restano appuntati in fondo.

**Architecture:** Stessa architettura di `PageRail.astro` (label assolute nel track, slot assegnati via JS in `render()` con `top` + `--lo`). Cambia solo la mappa degli slot: niente slot centrale, header fisso in cima, coda visibile in fondo. Le transizioni CSS esistenti su `top`/`opacity` animano il transito. Aggiunta una patch anti-scatto per il primo paint.

**Tech Stack:** Vanilla JS inline nel componente Astro, CSS scoped, nessuna dipendenza.

**Note di workspace (da `AGENTS.md`):**
- **Niente commit/push**: l'utente committa quando vuole. Ogni task si chiude con la sua verifica meccanica.
- Nessun framework di test nel repo: la verifica è `npm run build` + checklist visiva in `npm run dev`.
- Spec di riferimento: `docs/superpowers/specs/2026-10-13-rail-header-design.md`.

**Geometria di riferimento (dalla spec §2):**

```
nav sticky (top: 0 … 4rem)  ← la rail comincia qui (top: 4rem)
────────────────────────────  orlo superiore del track (y = 0)
  EXIT = 6px                ← d = -1  il passato si ferma qui e sfuma (0.45)
  slotHead = EXIT + STEP    ← d = 0   l'HEADER della pagina (op. 1)
  ...
  slotArrive = H - labelH - 12  ← d = +1  prossimo titolo (0.38)
  slotArrive + STEP         ← d = +2 (0.18), oltre nascosti
────────────────────────────  orlo inferiore del track (y = H)
  [readout % / PRINT COMPLETE] ← fuori dal track (elemento .rail__status)
```

con `STEP = labelH + 10px` (≈34px con label ~18px... `labelH` misurato via
`getBoundingClientRect()`, default 18 se il primo paint non è affidabile).

---

### Task 1: Slot-map in `render()`

**Files:**
- Modify: `website/src/components/PageRail.astro:315-352` (blocco "L'indice carosello" dentro `render()`)

- [ ] **Step 1: Sostituisci commento + variabili slot**

Trovare il blocco attuale (righe 315-326):

```js
        /* L'indice carosello: tre slot fissi lungo la rail (sopra / centro /
           sotto). I titoli restano fermi; quando cambia la sezione attiva
           l'intera colonna trasla di uno slot, come nel riferimento. */
        const prevActiveRaw = Number(rail.dataset.activeIdx || 0);
        if (prevActiveRaw !== active) {
          rail.dataset.activeIdx = String(active);
        }
        const H = trackH;
        const slotTop = -24; /* sopra l'orlo superiore */
        const slotMid = Math.round(H / 2 - labelH / 2);
        const slotBot = H + 24;
        const dir = active >= prevActiveRaw ? 1 : -1;
```

Sostituirlo con:

```js
        /* L'indice mobile: la sezione attiva è sempre l'header in cima
           alla rail, un gradino sotto la nav (il posto sopra è del
           titolo in uscita). Al cambio sezione l'intera colonna trasla
           con le transizioni CSS di top e opacity. */
        const H = trackH;
        const STEP = labelH + 10; /* gradino fra i titoli impilati */
        const EXIT = 6;           /* orlo d'uscita: il passato si ferma qui */
        const slotExit = EXIT;
        const slotHead = EXIT + STEP;
        const slotArrive = H - labelH - 12;
```

(Nota: `prevActiveRaw` e `dir` spariscono — il codice che li usava nel ciclo
viene sostituito allo Step 2; `rail.dataset.activeIdx` non è più necessario.)

- [ ] **Step 2: Sostituisci il ciclo di assegnazione slot**

Trovare il ciclo attuale (righe 327-352):

```js
        for (let i = 0; i < segs.length; i++) {
          const l = labelEls[i];
          if (!l) continue;
          const d = i - active; /* -2 -1 0 +1 +2 … */
          let top;
          let lo;
          if (d === 0) {
            top = slotMid;
            lo = 1;
          } else if (d === -1) {
            top = slotTop;
            lo = 0.42;
          } else if (d === 1) {
            top = slotBot;
            lo = 0.42;
          } else if (d < -1) {
            top = slotTop - (slotMid - slotTop); /* oltre l'orlo, nascosto */
            lo = 0;
          } else {
            top = slotBot + (slotBot - slotMid);
            lo = 0;
          }
          if (l.dataset.hot === '1') lo = 1;
          l.style.top = top + 'px';
          l.style.setProperty('--lo', String(lo));
        }
```

Sostituirlo con:

```js
        for (let i = 0; i < segs.length; i++) {
          const l = labelEls[i];
          if (!l) continue;
          const d = i - active; /* -2 -1 0 +1 +2 … */
          let top;
          let lo;
          if (d === 0) {
            top = slotHead; /* l'header della pagina */
            lo = 1;
          } else if (d === -1) {
            top = slotExit; /* il passato resta un attimo e sfuma */
            lo = 0.45;
          } else if (d < -1) {
            top = slotExit - (-1 - d) * STEP; /* coda sopra: oltre l'orlo */
            lo = 0;
          } else if (d === 1) {
            top = Math.max(slotArrive, slotHead + STEP); /* mai sopra l'header */
            lo = 0.38;
          } else {
            top = Math.max(slotArrive, slotHead + STEP) + (d - 1) * STEP;
            lo = d === 2 ? 0.18 : 0;
          }
          if (l.dataset.hot === '1') lo = 1;
          l.style.top = top + 'px';
          l.style.setProperty('--lo', String(lo));
        }
```

Geometria risultante (pagina di 5 sezioni, rail ~500px, label 18px):

- d=0 → `slotHead` ≈ 40px (header, op. 1)
- d=-1 → `slotExit` = 6px (uscita, op. 0.45)
- d≤-2 → sotto EXIT, oltre l'orlo del track (nav li copre), op. 0
- d=+1 → `slotArrive` ≈ 470px (op. 0.38)
- d=+2 → `slotArrive + STEP` ≈ 504px (op. 0.18)
- d≥+3 → oltre l'orlo inferiore, op. 0

Il `Math.max(slotArrive, slotHead + STEP)` protegge rail cortissime (pagine
con 1-2 sezioni: `slotArrive` andrebbe sopra l'header) tenendo l'arrivo
sempre sotto l'header.

- [ ] **Step 3: Verifica meccanica**

Run: `grep -n "slotMid\|slotTop\|slotBot\|activeIdx\|prevActiveRaw" website/src/components/PageRail.astro`
Expected: zero match (vecchie variabili sparite del tutto).

Run: `grep -n "slotHead\|slotExit\|slotArrive\|STEP" website/src/components/PageRail.astro`
Expected: ~8 righe, tutte dentro `render()` (dichiarazioni + rami del ciclo);
nessun match fuori dal blocco dell'indice mobile.

---

### Task 2: Anti-scatto al primo paint

**Files:**
- Modify: `website/src/components/PageRail.astro` (CSS `.rail__label` ~riga 173; JS in `init()`)

- [ ] **Step 1: Aggiungi il selettore `data-instant` al CSS**

Nel blocco `<style>`, subito dopo la regola `.rail__label { ... }` (che finisce
a riga 173 con la `transition`), aggiungere:

```css
  /* Al primo paint le label non devono scattare da top:0 (default CSS)
     alla posizione assegnata dal JS: un frame senza transizione. */
  .rail__label[data-instant] {
    transition: none;
  }
```

- [ ] **Step 2: Attiva/disattiva `data-instant` nel JS**

Nel JS di `init()`, subito dopo la guardia
`if (!sections.length || sections.length !== segs.length) return;` (riga 250),
aggiungere:

```js
      labelEls.forEach(function (l) {
        l.setAttribute('data-instant', '');
      });
```

E dopo il **primo** `refresh();` (riga 380), aggiungere:

```js
      // L'anti-scatto si toglie dopo due frame: il primo dipinge la
      // posizione senza transizione, il secondo riattiva le transizioni.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          labelEls.forEach(function (l) {
            l.removeAttribute('data-instant');
          });
        });
      });
```

Doppia rAF: serve a garantire che il browser abbia **dipinto** il primo
frame prima di riattivare le transizioni.

- [ ] **Step 3: Verifica meccanica**

Run: `grep -n "data-instant" website/src/components/PageRail.astro`
Expected: 1 match nel CSS + set e remove nel JS (3+ righe totali).

---

### Task 3: Commenti e coerenza

**Files:**
- Modify: `website/src/components/PageRail.astro` (commento `.rail__label` riga 158; JSDoc d'intestazione righe 2-9)

- [ ] **Step 1: Aggiorna il commento inline di `.rail__label`**

Sostituire (riga 158):

```
    top: 0; /* assegnata via JS: carosello, trasla solo al cambio sezione */
```

con:

```
    top: 0; /* assegnata via JS: header in cima, colonna che scorre */
```

- [ ] **Step 2: Aggiorna il JSDoc d'intestazione (righe 2-9)**

Sostituire le righe 4-9 del commento d'apertura:

```
 * Funziona senza JS (anchor + stati equidistanti); con JS misura, mappa e
 * segna lo strato attivo.
```

con:

```
 * L'indice mobile segue il riferimento getartcraft: la sezione in lettura
 * è sempre l'header in cima alla rail; i passati escono sopra sfumando,
 * i futuri restano in coda in fondo. Funziona senza JS (anchor + stati
 * equidistanti); con JS misura, mappa e segna lo strato attivo.
```

- [ ] **Step 3: Verifica meccanica**

Run: `grep -n "carosello" website/src/components/PageRail.astro`
Expected: zero match.

Run: `npm run build` (dentro `website/`)
Expected: build completata senza errori (exit 0).

---

### Task 4: Verifica finale di build e vista

**Files:** nessuno (solo verifica)

- [ ] **Step 1: Build** (se non già fatta nel Task 3)

Run: `cd website && npm run build`
Expected: build completata senza errori (exit 0).

- [ ] **Step 2: Dev server + checklist visiva**

Run: `cd website && npm run dev` → http://localhost:4321/

Checklist a viewport ≥1280px:

1. **Home, 5 sezioni**: l'header `01 / INTRO` sta in cima alla rail, un
   gradino sotto la nav; `02 / SELECTED WORKS` è appuntato in fondo
   (op. 0.38); gli altri invisibili.
2. **Scorri verso "selected"**: la colonna trasla — `02` sale dal fondo
   fino all'header, `01` sale nel gradino d'uscita e sfuma (0.45).
3. **Continua a scorrere**: `01` esce sopra (0.18 → nascosto oltre l'orlo,
   coperto dalla nav), `03` sale in fondo, `02` diventa header.
4. **Fondo pagina**: `05 / PARLIAMONE` è header; nessun titolo in arrivo;
   al 100% la percentuale lascia il posto a "; PRINT COMPLETE".
5. **Hover sui segmenti**: l'etichetta toccata diventa "hot" (opacità
   piena) senza sovrapporsi all'header.
6. **Pagina /lavori e /chi-siamo**: stesso schema con le loro sezioni.
7. **Resize della finestra**: nessuna label fuori dal track o sovrapposta.
8. **Reti lente / JS off**: le label restano nascoste, la rail segue
   funzionando come indice di anchor (degradazione invariata).

- [ ] **Step 3: Chiedi all'utente di guardare il sito in locale**

Il risultato va approvato dall'utente che decide il commit (AGENTS.md).

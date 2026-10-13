# Wordmark bicolore uniforme — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** "Double" viola, "LayeR" oro con eco viola dietro, "prints" grigino — uniformi su hero, footer, nav e fette della scena, via token semantici.

**Architecture:** Tre token nuovi in `global.css` (`--mark-layer` oro costante, `--mark-echo` viola che ruota col tema, `--on-dark-muted` costante), riusati da `Wordmark.astro` (hero + footer + fette scena) e `Nav.astro` (nuova eco). Zero JS, zero markup strutturale oltre lo span-eco in nav.

**Tech Stack:** CSS custom properties (già `:root[data-theme='dark']`), Astro scoped styles, nessuna dipendenza.

**Note di workspace:**
- Niente commit: `AGENTS.md` vieta commit/push non espressamente richiesti. Ogni task si chiude con la sua verifica, l'utente committa quando vuole.
- Nessun framework di test nel repo: la verifica è `npm run build` + checklist visiva in `npm run dev` sui due temi.
- Spec di riferimento: `docs/superpowers/specs/2026-10-13-wordmark-bicolore-uniforme-design.md`.

**Perché l'ereditarietà conta (leggi prima di toccare `Wordmark.astro`):** la
fronte "LayeR" è `.mark__b-ink`, che **non ha un colore proprio** e lo eredita
da `.mark__b` (oggi `--ink`; in `onDark` l'override `.mark--on-dark .mark__b { color: var(--on-dark-text) }` lo diventa ereditariamente quasi-bianco). La
fronte diventa oro **attraverso `--mark-layer` su `.mark__b`**; l'eco e le
copie `on-dark` hanno selettori con specificità maggiore e restano scoperte a
parte.

---

### Task 1: Token semantici in `global.css`

**Files:**
- Modify: `website/src/styles/global.css:79-85` (blocco `:root`), `:127` (blocco `:root[data-theme='dark']`)

- [ ] **Step 1: Aggiorna il commento di `--gold` e aggiungi i tre token al tema giorno**

In `:root`, sostituire la riga 79 e aggiungere dopo `--on-dark-text` (riga 85):

```css
  --gold: #ffce00;         /* Silk Gold — dal logo; come testo solo nel
                              wordmark (eccezione da-logo, 2026-10-13) */
```

```css
  --on-dark-text: #eceaf0; /* testo su fondi ink/footer — costante */
  --mark-layer: #ffce00;   /* fronte "LayeR" del wordmark — oro, costante */
  --mark-echo: #472271;    /* eco viola dietro "LayeR", su fondo del tema */
  --on-dark-muted: #a39daf; /* testo secondario ("prints" footer) su fondi
                              sempre scuri — costante */
```

- [ ] **Step 2: Aggiungi `--mark-echo` al tema Notturno**

In `:root[data-theme='dark']`, dopo la riga `--purple-display`:

```css
  --purple-display: #8b68c9; /* 4.25:1, testo display grande */
  --mark-echo: #8b68c9;      /* eco viola su Notturno — il viola di Double */
```

- [ ] **Step 3: Verifica meccanica**

Run: `grep -n "mark-layer\|mark-echo\|on-dark-muted" website/src/styles/global.css`
Expected: 4 righe (1 nel tema notte, 3 nel tema giorno) — nessun uso ancora nei componenti.

---

### Task 2: Wordmark — hero, footer e fette scena (`Wordmark.astro`)

**Files:**
- Modify: `website/src/components/Wordmark.astro` (commento header 2-7; regole `.mark__b` 83-86, `.mark--on-dark .mark__b` 92-94, `.mark__b-echo` 98-107, `.mark--on-dark .mark__sub` 129-131, `.mark__slice-b` 162-164)

- [ ] **Step 1: Aggiorna il commento d'intestazione**

Sostituire le righe 3-5 del commento JSDoc:

```
 * "Double" in Filament Purple, "LayeR" in Nozzle Ink,
 * con un'eco in Silk Gold fuori registro — il "layer shift"
 * che si mette in registro al caricamento della pagina.
```

con:

```
 * "Double" in Filament Purple, "LayeR" in Silk Gold,
 * con un'eco viola fuori registro — il "layer shift"
 * che si mette in registro al caricamento della pagina.
```

- [ ] **Step 2: Fronte gold ereditata — cambia `.mark__b` (righe 83-86)**

```css
  .mark__b {
    position: relative;
    color: var(--mark-layer);
  }
```

La fronte `.mark__b-ink` (senza colore proprio) eredita l'oro in entrambe le superfici.

- [ ] **Step 3: Sostituisci l'override `on-dark` del base (righe 92-94)**

Sostituire:

```css
  .mark--on-dark .mark__b {
    color: var(--on-dark-text);
  }
```

con:

```css
  /* Su fondi sempre scuri (footer): eco viola costante —
     la fronte resta ereditata oro. */
  .mark--on-dark .mark__b-echo {
    color: var(--purple-on-dark);
  }
```

(Rimane `--on-dark-text` in `:root` per gli altri usi esistenti fuori dal wordmark.)

- [ ] **Step 4: Eco che ruota col tema — `.mark__b-echo` (righe 98-107)**

Sostituire solo il valore del colore, `var(--gold)` → `var(--mark-echo)`; transform, inset, z-index invariati:

```css
  .mark__b-echo {
    position: absolute;
    inset: 0;
    color: var(--mark-echo);
    z-index: -1;
    transform: translate(
      calc(0.085em + var(--echo-spread, 0em)),
      calc(0.05em + var(--echo-spread, 0em) * 0.55)
    );
  }
```

(Specificità: `.mark--on-dark .mark__b-echo` 0,2,0 > `.mark__b-echo` 0,1,0 — l'override footer vince a prescindere dall'ordine.)

- [ ] **Step 5: "prints" del footer — `.mark--on-dark .mark__sub` (righe 129-131)**

```css
  .mark--on-dark .mark__sub {
    color: var(--on-dark-muted);
  }
```

(da oro → grigino; l'hero resta `--muted` ereditato dalla regola base `.mark__sub`.)

- [ ] **Step 6: Fette della scena "Deposizione" — `.mark__slice-b` (righe 162-164)**

```css
  .mark__slice-b {
    color: var(--mark-layer);
  }
```

(`.mark__slice-a` resta `--purple-display`, `.mark__slice-sub` resta `--muted`, `.mark__print-head` resta oro.)

- [ ] **Step 7: Verifica meccanica**

Run: `grep -n "var(--ink)\|var(--gold)\|var(--mark-l\|var(--mark-e\|var(--purple-on-dark)\|var(--on-dark-muted)" website/src/components/Wordmark.astro`
Expected: zero `var(--ink)`; una sola `var(--gold)` (`.mark__print-head`,
testa di stampa — invariata di proposito); presenti `--mark-layer` ×2
(`.mark__b`, `.mark__slice-b`), `--mark-echo` ×1, `--purple-on-dark` ×2
(`.mark--on-dark .mark__a` invariata + `.mark__b-echo`), `--on-dark-muted` ×1.

---

### Task 3: Nav — eco viola su "LayeR" (`Nav.astro`)

**Files:**
- Modify: `website/src/components/Nav.astro` (markup 24-28; styles 193-205)

- [ ] **Step 1: Markup — aggiungi le due copie di "LayeR"**

Sostituire le righe 24-28:

```html
    <a class="nav__brand" href={pathFor('', lang)}>
      <span class="nav__brand-a">Double</span>
      <span class="nav__brand-b">
        <span class="nav__brand-b-echo" aria-hidden="true">LayeR</span>
        <span class="nav__brand-b-front">LayeR</span>
      </span>
      <span class="nav__brand-sub">prints</span>
    </a>
```

(Ordine DOM echo → front: l'eco viene dipinta sopra perché posizionata; il front, posizionato e successivo, sta sopra. `aria-hidden` sull'eco perché doppiaggio.)

- [ ] **Step 2: Styles — sostituisci `.nav__brand-a/b/sub` (righe 193-205)**

```css
  .nav__brand-a {
    color: var(--purple-text);
  }
  /* "LayeR": fronte oro + eco viola fuori registro, come il wordmark
     grande — senza animazione (il gesto coreografico resta nell'hero) */
  .nav__brand-b {
    position: relative;
    display: inline-block;
  }
  .nav__brand-b-front {
    position: relative;
    color: var(--mark-layer);
  }
  .nav__brand-b-echo {
    position: absolute;
    inset: 0;
    transform: translate(0.085em, 0.05em);
    color: var(--mark-echo);
  }
  .nav__brand-sub {
    font-family: var(--font-mono);
    font-weight: 400;
    font-size: 0.74rem;
    color: var(--muted);
    letter-spacing: 0.02em;
  }
```

(`.nav__brand` è flex `align-items: baseline`: l'inline-block `.nav__brand-b` si allinea col suo baseline testuale, com'è ora. `.nav__brand span` già niente-underline anche per i due span nuovi.)

- [ ] **Step 3: Verifica meccanica**

Run: `grep -n "nav__brand-b" website/src/components/Nav.astro`
Expected: markup 2 span (echo, front) + 3 regole CSS (`.nav__brand-b`, `-front`, `-echo`), zero `var(--ink)` nel brand.

---

### Task 4: Documentazione (`docs/DESIGN.md`)

**Files:**
- Modify: `docs/DESIGN.md` (§3 vincoli oro ~linea 68; tabella palette ~linea 65; §3.1 tabella tema ~linea 97; §6.1 ~linea 158; §12 ~linea 409; §10 registro)

- [ ] **Step 1: Aggiorna il vincolo d'uso dell'oro (§3, rettangolo "Vincoli d'uso")**

Sostituire il bullet:

```
- **L'oro non è mai testo su chiaro** (contrasto 1.31:1): solo elemento
  grafico (eco del wordmark, layer line d'accento, bordi di focus su fondo
  scuro, sottolineature animate).
```

con:

```
- **L'oro non è mai testo su chiaro** (contrasto 1.31:1): solo elemento
  grafico (layer line d'accento, bordi di focus su fondo scuro,
  sottolineature animate). **Eccezione da-logo (2026-10-13): la fronte
  "LayeR" del wordmark è oro anche su chiaro** — è un logotipo, non testo
  di lettura; l'eco viola dietro ne rinforza il contorno e il nome accessibile
  resta nel testo `sr-only`. Spec: `superpowers/specs/2026-10-13-wordmark-bicolore-uniforme-design.md`.
```

- [ ] **Step 2: Tavola palette (§3) — aggiungi tre righe**

Dopo la riga di `Layer Line Dark`:

```
| Mark Layer | `#FFCE00` | Fronte "LayeR" del wordmark — oro costante |
| Mark Echo | `#472271` / `#8B68C9` | Eco viola dietro "LayeR" (giorno / notte) |
| On-dark Muted | `#A39DAF` | "prints" del footer — costante su inchiostro |
```

- [ ] **Step 3: Tavola Notturno (§3.1) — aggiungi la riga di rotazione, più i costanti**

Nella tabella del tema, dopo la riga `--footer-bg`:

```
| `--mark-echo` | `#472271` | `#8B68C9` | 4.25:1 su Notturno (display) |
```

Ed estendi il paragrafo "Token trasversali" con:

```
Nuovo per il wordmark bicolore (spec 2026-10-13): `--mark-layer` `#FFCE00`
(fronte "LayeR", sempre) e `--on-dark-muted` `#A39DAF` ("prints" su fondi
sempre scuri, sempre).
```

- [ ] **Step 4: §6.1 — descrizione del wordmark**

Sostituire solo l'inizio del secondo bullet di §6.1:

```
- "LayeR" in Nozzle Ink con **eco in Silk Gold** fuori registro di
```

con:

```
- "LayeR" in Silk Gold con **eco viola** fuori registro di
```

Il resto del bullet (`0.085em / 0.05em`, "layer shift") e gli altri bullet
(animazione, "prints" muted, terzo strato viola profondo `--purple-deep`)
restano validi senza modifiche.

- [ ] **Step 5: §12 — nota d'accessibilità**

Sostituire il bullet dei contrasti **(Notturno)**, aggiungendo la fronte:

```
- Contrasti misurati (chiaro): viola/carta 8.2:1, inchiostro/carta 14.6:1,
  muted/carta 5.56:1, bianco/viola 9.4:1, oro/ink 11.1:1. (Notturno): testo
  15.2:1, link 6.4:1, muted 6.9:1, oro 12.2:1, focus 12.2:1, fronte "LayeR"
  oro 12.2:1. Eccezione da-logo documentata in §3 per il wordmark su chiaro.
```

- [ ] **Step 6: §10 — riga nel registro delle decisioni**

Aggiungere in fondo alla tabella:

```
| Wordmark bicolore | Double viola, "LayeR" oro + eco viola (`--mark-*`), prints grigino | Richiesta di uniformità dell'utente (il quasi-bianco "si vedeva poco" nel Notturno); token per tema da spec 2026-10-13 |
```

- [ ] **Step 7: Verifica meccanica**

Run: `grep -n "mark" docs/DESIGN.md | wc -l && grep -n "Nozzle Ink con" docs/DESIGN.md`
Expected: conteggio `mark` ≥ 8; zero "@" da "Nozzle Ink con" (il vecchio testo è sostituito).

---

### Task 5: Verifica finale di build e vista

**Files:** nessuno (solo verifica)

- [ ] **Step 1: Build**

Run: `cd website && npm run build`
Expected: build completata senza errori (exit 0; output "Completed in ..." di Astro).

- [ ] **Step 2: Dev server + checklist visiva**

Run: `cd website && npm run dev` → http://localhost:4321/

Checklist su **entrambi** i temi (toggle in nav, o `document.documentElement.setAttribute('data-theme','dark')` in console):

1. **Home hero**: "Double" viola, "LayeR" **oro** con copia viola fuori registro in basso a destra, "prints" grigino; animazione `echo-register` parte disallineata e si mette in registro.
2. **Scena "Deposizione"** (scroll lento nell'hero): le 20 fette si depositano — "Double" viola, "LayeR" oro; la testa d'oro risale; a fine scena torna il wordmark pieno.
3. **Nav**: mini "LayeR" oro con eco viola; "Double" viola; nulla si sovrappone.
4. **Footer**: "Double" viola (#8B68C9), "LayeR" oro + eco viola, "prints" **grigino** (#A39DAF — non più oro).
5. **Sul contrasto del Giorno**: la fronte oro dell'hero è tenue — atteso e
   scelto (eccezione da-logo); l'eco viola dietro la rende percepibile.
6. **Occhio**: `sr-only` intatto (testo "Double LayeR Prints" presente).

- [ ] **Step 3: Chiedi all'utente di guardare il sito in locale**

Il risultato va approvato dall'utente che decide il commit (AGENTS.md).

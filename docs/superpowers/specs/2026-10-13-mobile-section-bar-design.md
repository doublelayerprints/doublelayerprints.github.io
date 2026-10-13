# Indice mobile + hero statico su telefono — documento di design

Data: 2026-10-13. Stato: approvato in dialogo (pagine: tutte quelle con sezioni;
hero mobile statico; barra con sola etichetta). Riferimenti: `docs/DESIGN.md`
(§6.4 rail), `docs/superpowers/specs/2026-10-13-rail-header-design.md`,
`docs/superpowers/specs/2026-10-13-hero-scroll-deposizione-design.md`.

---

## 1. Obiettivo

Due lavori gemelli sulla navigazione mobile (<1280px, dove la rail tace):

1. **Barra indice mobile** — sotto la nav sticky, mentre si scorre, un'etichetta
   fissa `NN / NOME SEZIONE` dice sempre in che sezione si è. Riferimento:
   getartcraft.com (screenshot del committente: chip sotto l'header).
2. **Hero statico <760px** — la scena "Deposizione" non parte più su telefono.
   Oggi, su mobile, produce uno spazio morto (~1 schermata di stage 240svh
   senza pin) e un flick della foto (dissolvenza senza fasce che la
   sostituiscono). Con la scena spenta, entrambi spariscono alla radice.

Non-scopi: nessuna stringa i18n nuova; nessun contenuto; niente righe di
sezione in flusso (il riferimento le ha, qui restano fuori scope: prova in un
lavoro futuro se richiesto); niente percentuale nella barra.

## 2. Decisioni (dialogo col committente)

| Decisione | Scelta |
|---|---|
| Pagine | Tutte quelle che già montano `PageRail`: home, lavori, dettaglio pezzo, chi-siamo, contatti, 404 (chi-siamo ha una rail vera: storia/stampanti/parliamone — resta dentro) |
| Aspetto barra | Solo `NN / NOME`, mono maiuscolo; niente percentuale |
| Hero <760px | **Statico** (scena spenta del tutto; l'entrata a due tempi resta) |

## 3. Barra indice — architettura

**Nuovo componente `website/src/components/SectionBar.astro`**:

- Markup: `<div class="sbar" data-sbar aria-hidden="true">` con
  `<p class="sbar__label">` → `num / name` (num viola, name in muted, slash
  hairline; mono uppercase 0.72rem). Indicatore non interattivo: le
  intestazioni di sezione già danno la struttura a chi legge con lo screen
  reader (da qui aria-hidden). Nessun `nav` landmark in più.
- Posizione: primo child di `<main>` (prima delle sezioni), `position: sticky`
  con `top: 4rem` (sotto la min-height della nav), altezza fissa 2.5rem,
  sfondo paper a 94% + backdrop blur (stesso trattamento della nav),
  hairline inferiore.
- Visibilità: `display: none` ≥1280px (specchio esatto della regola della rail,
  che nasconde <1280px): sotto, la barra; sopra, la rail — mai due indici.
- Schema: riceve la **stessa lista `sections`** di `PageRail` (stesse chiavi
  `rail.*`): zero i18n nuovo. Numeri = ordine + padStart(2,'0').
- **Sezione attiva**: stesso criterio della rail (top di sezione oltre il 45%
  della viewport). JS solo per il cambio: aggiorna testo e rigioca una
  micro-animazione di ingresso (translateY 6px, 0.28s, `--ease-lay`). Misura
  nel pattern rail (resize con rAF ticking, ricalibro a load/fonts.ready).

**Ancore**: `[id] { scroll-margin-top }` sale da 4.5rem a
`calc(4.5rem + var(--sbar-h, 0rem))`; `--sbar-h: 2.5rem` è definita su `:root`
solo presenza barra e <1280px (`:root:has([data-sbar])` dentro la media query).

## 4. Hero mobile statico

- **Commutazione a sorgente unica** (`HeroScene.astro`): il motore legge
  `matchMedia('(max-width: 759px)')`; se telefono, **non** pone
  `data-scene-live` e non aggancia gli ascoltatori — ogni regola
  `.hero-stage[data-scene-live]` (altezza 240svh, dissolvenza foto, pressione
  CTA, wordmark, letto G-code) resta inerte; al passaggio 759↔760 (rotazione /
  resize) monta o smonta.
- **Cintura in CSS** (global.css): sotto 760px, con l'attributo comunque
  presente, l'altezza stage torna `auto` e la foto resta `opacity: 1`.
  Contratto statico esplicito anche senza fiducia nel solo JS.
- **Niente JS / reduced-motion**: come già oggi, `data-motion-ok` mai
  attribuito → scena mai attiva, ovunque.

## 5. Robustezza e qualità

- La barra vive di `transform`/`opacity` e cambio testo; nessun lavoro
  aggiuntivo al percorso di scorrimento (sticky già in flusso).
- Contenuto: il primo elemento della lista è già nel HTML, quindi senza JS la
  barra mostra l'etichetta `01` (non si aggiorna, ma resta corretta in cima
  alla pagina) — lo stesso regime di degrado della rail.
- Temi: solo token dalla palette esistente (paper, hairline, mono,
  viola/muted) — nessuna costante nuova.
- i18n: il componente è uno solo per IT/EN (stessa lista `sections`).
- No dipendenze.

## 6. Verifica

1. `npm run build` dentro `website/` (obbligatorio).
2. `npm run dev` — matrice manuale:
   - 390×844: barra presente sotto la nav su home/lavori/pezzo/chi-siamo/
     contatti/404; assente ≥1280px;
   - scorrendo: `01 / INTRO` → `02 / LAVORI SELEZIONATI` → … con micro-salto
     d'ingresso al cambio; discesa e risalita coerenti con la rail (≥1280px
     intatta);
   - home mobile: nessuno spazio morto dopo l'hero; nessun flick della foto;
   - ancore dal menu mobile: atterraggi puliti sotto nav+barra;
   - tema chiaro e Notturno; reduced-motion; JS off.
3. Conferma visiva del committente.

## 7. Registro delle scelte (coerenza "Layer by layer")

- La barra è la voce mono della rail portata in tasca: stesso alfabeto
  (num / slash / nome), stessa legge del 45%, nessun decoro nuovo.
- Lo stage 240svh presuppone il pin: su telefono non c'è pin, quindi niente
  scena — l'oggetto si vede da subito, senza passaggi a vuoto.

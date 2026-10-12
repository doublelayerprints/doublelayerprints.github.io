# Double LayeR Prints — Review critica e piano di miglioramento

Compagno di [`DESIGN.md`](./DESIGN.md): qui c'è la review onesta dello stato
attuale (con evidenze) e il piano di lavoro per fasi, con priorità e checklist.
La dark mode è la fase centrale ed è **progettata**, non un'inversione meccanica.

---

## 1. Sintesi con priorità

| Prio | Intervento | Fase | Effort | Stato |
|---|---|---|---|---|
| P0 | Focus ring illeggibile su chiaro (1.31:1) | 1 (inclusa nei token tema) | S | **fatto** |
| P0 | Footer "Double" su ink debole (1.77:1) | 1 (sollevare il viola) | S | **fatto** |
| P1 | Dark mode "Notturno" | 1 | M | **fatto** |
| P1 | Armonizzare i piatti della griglia lavori | 2 | S | **fatto** |
| P1 | De-templating fine (caption, colophon, spec, CTA) | 3 | S | **fatto** |
| P1 | Rimuovere la banda "Parliamone" da Lavori | 3 | XS | **fatto** |
| P1 | `muted` da 4.6:1 a ≥5.5:1 | 3 | XS | **fatto** |
| P2 | Sitemap + robots + JSON-LD + OG image | 4 | M | **fatto** |
| P3 | Script `astro check` | 5 | XS | **fatto** |
| P1 | Armonizzazione estetica e continuità di stile | 6 | S | **fatto** |
| P1 | Foto laboratorio (Kobra 3 + Kobra X, la FLSUN è venduta) + contatti veri | 7 (vostra parte) | S | da fare |
| P2 | Placeholder Notturno (variante scura degli SVG) | 7 | S | **fatto** |
| P2 | Ritmo verticale divisori/sezioni | 7 | S | **fatto** |
| P2 | Eyebrow senza middle-dot + docs allineati | 7 | XS | **fatto** |
| P2 | `studio.jpg` servita compressa (2.1 MB → 246 KB) | 7 | XS | **fatto** |
| P3 | Nav: markup tools deduplicato (`NavTools.astro`) + chiave i18n | 7 | XS | **fatto** |
| P3 | SEO meta (`og:locale`, `twitter:image:alt`, founders JSON-LD) | 7 | XS | **fatto** |
| P1 | Rail "Piano di stampa": indice sezioni + progresso scorrimento | 8 | M | **fatto** |

---

## 2. Review critica dettagliata

### Punti di forza (da preservare)

- **Wordmark a due strati** con eco oro che si registra al load: gesto distintivo,
  non riproducibile per caso. È l'unico momento "strong": va difeso.
- **Palette**: perla fredda + nero violaceo + viola/oro del logo; nessun cluster
  di default (cream+terracotta, nero+acido, `#111`).
- **G-code nel margine** e **layer lines** come struttura: dispositivi nati dal
  soggetto, non decorazione generica.
- **Mono solo per dati tecnici veri** (spec, G-code, colophon) — giustificato.
- **Griglia asimmetrica 7/5–5/7**, plates squadrate con bordi, zero ombre.
- **Numeri 01/02/03 solo nel processo** (sequenza vera).
- **Foto delle due stampanti in hero**: il brand è anche "due macchine".
- **Zero colori hard-coded** nei componenti (tutto via token CSS) — verificato
  con grep: la dark mode è fattibile pulita.

### Criticità (con prove)

1. **Focus ring oro su chiaro = 1.31:1** — quasi invisibile; WCAG 2.4.11 vuole
   ≥3:1. Bug di accessibilità reale. *Causa*: oro su perla. *Fix*: ring per tema
   (viola su chiaro 8.2:1, oro su scuro 12.2:1).
2. **Footer "Double" viola su ink = 1.77:1** — sbiadisce anche come display.
   *Fix*: viola sollevato `#8B68C9` su scuro (4.25:1, ok per testo grande).
3. **Banda "Parliamone" ripetuta su 4 pagine** — accessorio di troppo
   (legge di Chanel): la tolgo da Lavori; resta su Home, Dettaglio, Chi siamo.
4. **Chrome da template che si insinua**: caption hero "Kobra 3 · Super Racer —
   il laboratorio" e colophon usano i pattern "A · B · C" / "PAROLA — frammento".
5. **Piatti della griglia "ballano"**: aspect-ratio 4:3 fisso su colonne 7 e 5 →
   altezze diverse, meta sbilenche nella stessa riga.
6. **`muted` 4.61:1** — appena sopra AA; obiettivo ≥5.5:1.
7. **OG image = vecchio logo raster** — non rappresenta il sito; serve 1200×630.
8. **Niente sitemap / robots / JSON-LD** — posizionamento incompleto.
9. **CTA dettaglio "Chiedi di questo pezzo"** non dice cosa fa (apre WhatsApp).
10. **G-code strip monocromatica** — nei slicer i commenti `;LAYER` sono colorati:
    un tint viola tenue è più autentico.
11. **Placeholder SVG chiari** — su eventuale tema scuro rischiano di "urlare"
    (valutati in fase 1: accettati come "stampe appese", le foto vere li
    sostituiranno).
12. **Nessuna dark mode** — da progettare per concetto.

---

## 3. Fase 1 — Dark mode "Notturno" — COMPLETATA (2026-10-10)

**Concetto**: il laboratorio di notte. Stesse due accent del brand, ruotano i
ruoli di fondo e testo; niente `filter: invert()` e niente inversione meccanica:
token dedicati con contrasti **misurati**.

**Default**: segue `prefers-color-scheme`; il visitatore può forzare col toggle
nell'header (scelta persistita in `localStorage`).

### 3.1 Token tema

In `website/src/styles/global.css`: `:root` chiaro (attuale) e
`:root[data-theme='dark']` con override dei soli token colore.

| Token | Chiaro | Scuro "Notturno" | Contrasto verificato |
|---|---|---|---|
| `--paper` (bg) | `#EFF0F2` | `#191322` Notturno | — |
| `--paper-dim` (surface) | `#E6E7EA` | `#221B30` | — |
| `--ink` (testo) | `#241A30` | `#ECEAF0` | **15.2:1** |
| `--ink-soft` | `#3A2E4A` | `#CFC9DA` | **8+:1** |
| `--muted` | `#6E6A78` | `#A39DAF` | **6.9:1** |
| `--purple` (link/testo) | `#5B2E91` | `#A98BD9` | **6.4:1** |
| `--purple-deep` (hover solid) | `#472271` | `#7B4FC4` | testo bianco 4.5:1+ |
| `--gold` | `#FFCE00` | `#FFCE00` (invariato) | **12.2:1** |
| `--line` | `#D9D7DE` | `#2C2539` | — |
| `--line-dark` | `#C3C0CB` | `#37304A` | — |
| `--focus` (nuovo) | `#5B2E91` | `#FFCE00` | 8.2:1 / 12.2:1 |
| `--footer-bg` (nuovo) | `#241A30` | `#140F1D` (più profondo del bg) | — |
| `--display-purple` (nuovo, wordmark/footer) | `#5B2E91` | `#8B68C9` | **4.25:1** (large) |

Note di implementazione:
- Il **bottone solido** resta viola pieno con testo bianco in entrambi i temi
  (9.4:1); lo hover usa `--purple-deep`.
- **Footer**: lo sfondo deve differenziarsi dal body su scuro (`--footer-bg`
  più profondo) — il footer attuale usa `--ink`, che in dark = testo: serve un
  token dedicato.
- **Focus ring**: `:focus-visible { outline-color: var(--focus) }` — risolve il
  P0 #1 per costruzione.
- **Wordmark su scuro**: "Double" usa `--display-purple` (#8B68C9) —
  anche nel footer del tema chiaro, dove il viola brand su ink era 1.77:1
  (P0 #2: su chiaro il footer usa già lo stesso meccanismo del display dark?
  No: nel tema chiaro il footer è scuro → lì serve già il viola sollevato.
  Quindi il token `--display-purple` si applica *per sfondo*, non per tema:
  su ink va `#8B68C9` sempre).

### 3.2 Meccanica

- `data-theme` sull'elemento `<html>`.
- **No-flash**: script inline in `<head>` (Base.astro) che legge
  `localStorage.getItem('dl-theme')` o `matchMedia('(prefers-color-scheme: dark)')`
  e imposta `data-theme` **prima del primo paint**.
- **Toggle nell'header**: icona a tre strati (2 vuoti + 1 pieno = notte),
  `aria-pressed`, aria-label bilingue ("Attiva tema scuro" / "Enable dark theme").
  Visibile su desktop; nel pannello mobile come riga "Tema: chiaro/scuro".
- `meta name="theme-color"` per entrambi: `#EFF0F2` / `#191322`.
- Persistenza: `localStorage('dl-theme')` = `'light' | 'dark' | null`
  (null = segui sistema).

### 3.3 Edge case da verificare

- **Placeholder SVG chiari su scuro**: restano leggibili come "stampe appese" —
  accettato e documentato; le foto vere li sostituiranno. Se nel frattempo
  risultano troppo forti, opzione: `opacity` 0.92 + bordo `--line-dark` più marcato.
- `studio.jpg` su scuro: ok (foto reale, plate con bordo).
- `::selection` oro su scuro: ok (12:1).
- Nav con `backdrop-filter` + `color-mix(paper 94%)`: usa i token, eredita.
- Icone dei contatti: `currentColor` → seguono il viola-tema.
- Duo plates T/R su scuro: sfondi ink/purple restano (sono "piatti colorati"),
  le lettere paper restano: controllare che risaltino ancora su `#191322` —
  ink plate su bg simile: aggiungere bordo `--line-dark` al plate ink.

### 3.4 Checklist fase 1

**Stato: completata il 2026-10-10.**

- [x] Token dark applicati (`:root[data-theme='dark']`), zero regressioni sul
  chiaro (screenshot comparativi)
- [x] Toggle funzionante desktop + mobile (riga "Tema" nel pannello),
      persistenza `localStorage('dl-theme')`, test end-to-end via CDP
      (click → tema → aria → meta, andata e ritorno)
- [x] No-flash: script inline in `<head>` prima del paint + `meta theme-color`
      gestito via JS
- [x] Focus ring viola su chiaro (`--focus` 8.2:1) / oro su scuro (12.2:1)
- [x] Footer differenziato su scuro (`--footer-bg #140F1D`); "Double" con
      viola sollevato (`--purple-on-dark #8B68C9`) in entrambi i temi
- [x] Screenshot desktop + mobile per entrambi i temi, review visiva
- [x] Fix collaterali: `::selection` con testo scuro costante su oro; piatti
      T/R con colori costanti + bordo sul piatto ink; tutti i viola "da testo"
      migrati a `--purple-text`; LayerLines del footer verificati

Token extra introdotti (oltre al piano): `--purple-text` (viola per testo su
fondo tema), `--purple-display` (display wordmark), `--purple-on-dark`
(display su fondi ink, costante), `--on-dark-text` (testo su fondi ink,
costante), `--focus`, `--footer-bg`. Il `--purple` di marca resta costante ed
è riservato ai riempimenti solidi (bottoni, chip attive) con testo bianco
(9.4:1) in entrambi i temi.

---

## 4. Fase 2 — Armonizzazione griglia lavori — COMPLETATA (2026-10-10)

**Problema**: piatti di larghezza diversa con aspect-ratio fisso → altezze
diverse, meta sbilenche nella stessa riga.

**Intervento**: stirare i piatti all'altezza della riga.

- `.works-grid { align-items: stretch }` (già default per grid);
- `.plate` → `height: 100%`; `.plate__link` → `display: flex; flex-direction:
  column; height: 100%`; `.plate__media { flex: 1 1 auto; min-height: 0 }` con
  `aspect-ratio` tenuto come fallback e immagine `object-fit: cover` che riempie lo spazio residuo;
- `.plate__meta` con `margin-top: auto` per ancorare le informazioni in fondo;
- risultato: fondi e meta allineati; lo stagger delle *larghezze* (7/5) resta
  editoriale, le *altezze* si armonizzano.

Checklist:
- [x] `.works-grid { align-items: stretch }` e `.works-grid__cell { height: 100% }` su Home e Lavori
- [x] `.plate { height: 100% }` e `.plate__link { display: flex; flex-direction: column; height: 100% }`
- [x] `.plate__media` flex 1 con `min-height: 0`, fallback aspect-ratio e `object-fit: cover`
- [x] `.plate__meta` con `margin-top: auto`
- [x] Build verificata (21 pagine) senza regressioni né CLS

---

## 5. Fase 3 — De-templating fine (stile + copy) — COMPLETATA (2026-10-10)

Piccoli pass per togliere il chrome da template senza perdere il carattere:

| Dove | Prima | Dopo |
|---|---|---|
| Caption hero | "Kobra 3 · Super Racer — il laboratorio" | "Il laboratorio: Kobra 3 e Super Racer" |
| Colophon footer | "; PRINT COMPLETE — © 2026 … · layer height 0.2 mm" | due elementi: `; PRINT COMPLETE` (mono) + "© 2026 Double LayeR Prints — stampato a 0,2 mm" |
| Spec nel plate | "PLA silk viola · 0.12 mm" | due righe mono: materiale / altezza layer |
| CTA dettaglio | "Chiedi di questo pezzo" | "Scrivici su WhatsApp" (dice cosa fa) |
| Banda Parliamone | su 4 pagine | tolta da Lavori; resta su Home, Dettaglio, Chi siamo |
| `--muted` | `#6E6A78` (4.61:1) | `#625D6E` (~5.6:1) |
| G-code strip | monocromatica | righe `;LAYER*`/`; PRINT` con tint viola tenue (`color-mix(purple 45%, muted)`) |
| Chiavi UI morte | `work.cta.whatsapp` inutilizzata | rimossa |

**Stato: completata il 2026-10-10.** Verificata con build (21 pagine), contrasti
misurati (muted 5.56:1; tint G-code 6.3:1, decorativo e `aria-hidden`) e
screenshot di home, footer e lavori.

Checklist:

- [x] Caption hero riscritta (IT+EN), niente "A · B — C"
- [x] Colophon su due elementi ("; PRINT COMPLETE" mono + © in corpo)
- [x] Spec dei piatti su due righe mono (materiale / altezza layer)
- [x] CTA dettaglio: "Scrivici su WhatsApp" / "Message us on WhatsApp"
- [x] Banda "Parliamone" tolta da Lavori (import e CSS morti rimossi)
- [x] `--muted` → `#625D6E` (5.56:1)
- [x] G-code: commenti `;LAYER*` con tint viola
- [x] Chiavi UI morte rimosse (`work.cta.whatsapp`, vecchio `footer.colophon`)
- [x] Build + screenshot di verifica

---

## 6. Fase 4 — Posizionamento — COMPLETATA (2026-10-10)

1. **`@astrojs/sitemap`** + `robots.txt` (allow all + sitemap URL).
2. **JSON-LD** in Base.astro: `Organization` (name, url, logo,
   sameAs Instagram) + `WebSite` (name, url, inLanguage it/en).
3. **OG image 1200×630**: script `scripts/generate-og.mjs` con template dedicato
   (wordmark, layer lines con oro, watermark G-code, spec del laboratorio)
   catturato via Chrome headless → `public/og.png`; `og:image` aggiornato in Base.astro +
   `twitter:card summary_large_image`.
4. `meta theme-color` doppio valore (chiaro/scuro) — già coperto in fase 1.
5. Già a posto: hreflang, canonical, title/desc bilingui, 404 personalizzata.

Checklist:
- [x] `@astrojs/sitemap` installato e configurato in `astro.config.mjs`
- [x] `sitemap-index.xml` e `sitemap-0.xml` generati con tutte le rotte statiche
- [x] `robots.txt` creato in `public/` con allow all e puntamento alla sitemap
- [x] Schema JSON-LD `Organization` e `WebSite` inserito in `Base.astro`
- [x] `scripts/generate-og.mjs` eseguito: `public/og.png` a 1200×630 pixel generato
- [x] Meta OpenGraph e Twitter card (`summary_large_image`) configurati in `Base.astro`
- [x] Build verificata con 21 pagine senza errori

---

## 7. Fase 5 — Manutenzione — COMPLETATA (2026-10-10)

- Script `npm run check` con `@astrojs/check` e `typescript` configurato in `package.json`.
- Diagnostica eseguita su 34 file: **0 errori, 0 warning, 0 hint**.
- Risolti tipi e sicurezza: optional chaining `entry.body?.split()` in `WorkDetailPage.astro` e pulizia variabili non usate in `Base.astro`.

Checklist:
- [x] `@astrojs/check` e `typescript` installati come devDependencies
- [x] Script `"check": "astro check"` aggiunto in `package.json`
- [x] Diagnostica `astro check` pulita al 100% (34 file)
- [x] Build finale verificata (`npm run build`) con 21 pagine statiche generate

---

## 8. Fase 6 — Armonizzazione estetica e continuità di stile — COMPLETATA (2026-10-10)

Audit e interventi per garantire coerenza totale del linguaggio "Layer by layer" tra tutte le pagine del portfolio:

- **LayerLines su tutte le pagine**: integrate anche a chiusura di `WorksPage` e `ContactPage`, garantendo la presenza del dispositivo fisico del brand ovunque.
- **Eyebrows tecnici Slicer (Space Mono)**: aggiunti marcatori coerenti sopra i titoli h1 (`works.eyebrow`, `about.eyebrow`, `contact.eyebrow`, `; CATEGORIA` e `; SLICER DATA` nel dettaglio pezzo).
- **Banda Contatti (`.band`) unificata**: centralizzata in `global.css`, armonizzato il layout con doppio bottone (WhatsApp solid + secondo canale outline) su Home, Chi siamo e Dettaglio pezzo.
- **Superficie `plate__media`**: impostato `background: var(--paper-dim)` sulle card dei pezzi per coerenza materica con le foto di studio.
- **SpecTable calibrata**: bordo superiore sostituito con `var(--purple)` per evitare il contrasto abbagliante in tema scuro.
- **Stampanti numerate**: allineate alla sequenza del processo (`01` / `02` in Space Mono viola).
- **Menu mobile**: aggiunto indicatore a strato oro (`border-left: 3px solid var(--gold)`) sul link attivo.

Checklist:
- [x] Stili e markup verificati su desktop e mobile
- [x] Type-check `npm run check`: 0 errori, 0 warning
- [x] Build `npm run build`: 21 pagine statiche generate con successo

---

## 9. Fase 7 — Audit post-fasi — COMPLETATA (2026-10-12)

Audit completo dello stato (screenshot 6 pagine × 2 temi × desktop/mobile +
review codice). Esito: le fasi 1-6 tengono; emersi sette interventi, eseguiti.

1. **Placeholder Notturno**: `gen-placeholders.mjs` genera ora anche le
   variabili `*-dark.svg` (stesse geometrie, palette Notturno:
   fondi `#211A2E`-`#403756`, oro invariato, watermark lavanda).
   `ProductPlate` e `WorkDetailPage` portano la doppia sorgente
   (`photo--light` / `photo--dark`) commutata via `[data-theme]`; su foto reali
   resta una sola `<img>`. niente più blocchi chiari che urlano su scuro.
2. **Ritmo verticale**: `--space-section` da `clamp(3.75/9vw/7rem)` a
   `clamp(2.75rem, 6.5vw, 4.5rem)`; i divisori di Lavori e Contatti escono
   dalla sezione e diventano elementi indipendenti tra sezioni (come Home e
   Dettaglio): fine del doppio vuoto da ~13rem.
3. **Eyebrow**: i middle-dot (`; ARCHIVIO STAMPE · …`) non sono sintassi da
   commento: separatori slash (`; ARCHIVIO STAMPE / 0.12-0.28 MM`,
   `; CANALI DIRETTI / RISPOSTA 24H`), coerenti con l'OG image.
   Contraddizione chiusa in `DESIGN.md` §11 (ora documenta gli eyebrow come
   commenti di forma).
4. **Foto di studio compressa**: `studio-16.jpg` 1600px q72 = 246 KB
   (da 2.1 MB); usata in hero e Chi siamo; l'originale resta per rigenerare.
5. **Nav**: il blocco tema+lingua era duplicato (desktop + pannello mobile,
   ~50 righe): estratto in `NavTools.astro`; label pannello migrata in
   `ui.ts` (`nav.themeLang`).
6. **SEO/meta**: `og:locale`, `twitter:image:alt`, founders (`Tancredi`,
   `Rachele`, niente cognomi inventati) nel JSON-LD.
7. **Docs**: `DESIGN.md` riallineato (palette Notturno §3.1, registro §10
   aggiornato, §11 eyebrow, §12 difetti P0 risolti + contrasti)

Checklist:

- [x] Varianti dark generate (`npm run placeholders` → 26 file) e commutate via CSS
- [x] Divisori fuori dalle sezioni in Lavori + Contatti; `--space-section` ridotto
- [x] Eyebrow IT/EN senza `·`; `nav.themeLang` in `ui.ts`
- [x] `NavTools.astro` estratto; Nav.astro usa il componente
- [x] `studio-16.jpg` 246 KB in hero/about; README aggiornato (doppio file)
- [x] `og:locale`, `twitter:image:alt`, founders
- [x] `DESIGN.md` allineato (§3.1, §10, §11, §12), README foto
- [x] `npm run check` 0 errori (35 file) + `npm run build` (21 pagine)
- [x] Screenshot di verifica light/dark desktop e mobile

Resta a voi (P1, dati veri): **foto laboratorio** con Kobra 3 + Kobra X
(l'attuale mostra ancora la FLSUN venduta), **contatti reali** in `consts.ts`,
verifica che **"Bologna" nell'OG image** sia corretta.

---

## 10. Fase 8 — Il "Piano di stampa" (rail laterale) — COMPLETATA (2026-10-12)

**Richiesta**: indice laterale + scorrimento sul modello di getartcraft.com/apps.
Nota di onestà dal reverse del sorgente: quel sito **non ha** una rail a destra —
l'effetto "indice che segue lo scroll" nasce da header sticky + barre HUD sticky
per sezione. La richiesta esplicita era però una rail laterale, ed è quella
realizzata, con semantica nostra.

**Concept**: la pagina è l'oggetto, la rail è il file di slicing. Ogni sezione
è uno strato (fetta proporzionale all'altezza reale), la testa di stampa (oro)
è la posizione di lettura; lo strato depositato ha hairline violacee, il
futuro è in `--line-dark`; al fondo `N%` → `; PRINT COMPLETE` (eco colophon).

Interventi:
- **`PageRail.astro`** (nuovo ~260 righe): markup + CSS (repeating-gradients
  come texture FDM) + JS vanilla (+80 righe): measure su init/rAF/`load`/
  `fonts.ready`/`resize`, scroll+rAF throttled come unica origine di verità
  per strato attivo e testa d'oro; niente IO duplicato.
- **Ancore + mount**: id sulle sezioni di `HomePage` (`#intro #selected
  #process #duo #parliamone`), `WorkDetailPage` (`#pezzo #specifiche
  #parliamone`, specs incapsulate), `AboutPage` (`#storia #stampanti
  #parliamone`); `scroll-margin-top` globale 4.5rem (atterraggi sotto la nav).
- **i18n**: chiavi `rail.*` (aria + label per sezione); "%"/`; PRINT
  COMPLETE` riusa la chiave colophon.
- **Coverage**: solo dove il contenuto lo merita (Home, Dettaglio, Chi siamo);
  Lavori/Contatti/404 senza rail; niente sotto 1280px; label attiva
  persistente solo ≥1560px (sotto: hover/focus, l'attivo resta leggibile dal
  riempimento + testa d'oro).
- **Quality floor**: nav landmark con aria-label, link veri con aria-label
  Numerato, `:focus-visible` col ring di tema, funzionante senza JS (strati
  equidistanti, percentuale nascosta), reduced-motion coperto dal media query
  globale, tutti i colori via token (Notturno incluso).

Checklist:

- [x] `PageRail.astro` con mappa proporzionale, testa oro e stato di stampa
- [x] Id sulle sezioni + componente montato su Home, Dettaglio, Chi siamo
- [x] Chiavi `rail.*` IT/EN; `scroll-margin-top` per le ancore
- [x] Breakpoint 1280px; label persistente ≥1560px; hover/focus sotto
- [x] `npm run check` 0 errori, build 21 pagine
- [x] CDP: scrollspy 0/42/85/100%, click→ancora, resize→ricalcolo, >1024px
      niente rail, dark/light coerente, tutti gli stati letti dal DOM
- [x] Screenshot mid-scroll 1440/1600px light+dark + mobile (niente rail)

**Aggiornamento 2026-10-12 e** (richiesta utente): la rail ora vive su
**tutte le pagine** — Lavori (2 strati: `#archivio`, `#pezzi`, chiavi
`rail.archive`/`rail.pieces`), Contatti (1 strato `#canali`) e 404
(1 strato `#mancante`, label riusata da `404.title`). Aggiunto un
`ResizeObserver` su `<html>`: quando i filtri della galleria nascondono le
card l'altezza della pagina cambia e la mappa si ricalibra (verificato via
CDP: scrollMax 1902 → 441 al click su un filtro, niente errori).

**Aggiornamento 2026-10-12 f** (richiesta utente): lineette del tratto
maggiorate (barra 6→**10px**, hover 10→**14px**, attivo 7→**12px**, testa
11→**16×3px**, tacchette 8→**12px** / 10→**16px** sull'attivo); il pitch
delle strisce FDM resta 3px/6.5px. **Attribuzione documentata**: la fonte
di ispirazione interattiva è **getartcraft.com/apps** — ora citata in
`DESIGN.md` §6.4 (con il reverse onesto del loro sorgente) e nel registro
§10.

Restato fuori (eventuale 8-bis): percentuale vocale per screen reader (ora
decorativa).

**Aggiornamento 2026-10-12 b** (richieste post-revisione): la barra nativa del
browser si nasconde lì dove esiste la rail (`:root:has([data-rail])`,
fallback: i browser senza `:has()` la mantengono) e la rail è stata
ingrandita (tratto 6px/10px hover, testa 11px, label e percentuale
maggiorate). Verificato: `scrollbar-width` = `none` sulle pagine con rail,
`auto` altrove (es. Contatti); build + check 0 errori.

**Aggiornamento 2026-10-12 c**: la rail è **a tutta altezza** (da sotto la
nav al fondo viewport, come il riferimento), con micro-tick hairline per
strato e percentuale che è sempre a tre cifre (`047%`, stile numero di layer
nel G-code). Stessa mappa e logica; `track.clientHeight` segna l'altezza
residua.

**Aggiornamento 2026-10-12 d** (richiesta utente): **l'indice carosello** —
dopo un primo passo con tracking 1:1 continuo (fedele ma rumoroso a ogni
pixel di scroll), le label ora restano **ferme in tre slot**: attiva al
centro (numero viola + nome ink + tick oro), precedente sopra (0.42, esce
scorrendo sotto la nav), successiva sotto (0.42, entra dal fondo); le
estreme oltre ±2 slot sono fuori orlo (op. 0). Al cambio di sezione
l'intera colonna trasla di uno slot (transition top 0.5s ease-lay);
niente movimento dentro la stessa sezione. Verificato con CDP: a 30%→62%
(nella stessa sezione) i top sono IDENTICI; a 78% (nuova sezione) tutti
traslati di uno slot; hover/focus → `data-hot` + opacità 1 immediata;
screenshot zoom light/dark di conferma.

---

## 11. Dipendenze da te (fuori dal codice)

1. **Contatti veri** in `website/src/consts.ts`: handle Instagram, email,
   numero WhatsApp (ora placeholder).
2. **Foto custom** dei pezzi → `public/images/works/` + path nei `.md`
   (vedi README); una foto vostra insieme sostituirebbe i monogrammi T/R.
3. Attivare GitHub Pages: Settings → Pages → Source = GitHub Actions.

---

## 12. Ordine di esecuzione consigliato

Tutte le fasi middleware sono completate (3 → 2 → 1 → 4 → 5 → 6 → 7 → 8).
Il prossimo blocco è fuori dal codice (§11): foto, contatti, verifica OG.

Ogni fase finisce con `npm run build` + screenshot di verifica (metodo CDP
già collaudato: Chrome headless + `Page.captureScreenshot`).

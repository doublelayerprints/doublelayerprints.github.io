# Double LayeR Prints — Documento di design

Documento descrittivo del progetto: concept, sistema visivo, struttura e registro
delle decisioni. Per la review critica e il piano di miglioramento vedi
[`IMPROVEMENTS.md`](./IMPROVEMENTS.md).

---

## 1. Il progetto

**Cosa è.** Portfolio di Double LayeR Prints, il laboratorio di stampa 3D di
Tancredi e Rachele. Mostra i pezzi usciti dalle loro due stampanti, racconta chi
sono e offre tre canali di contatto diretto (Instagram DM, email, WhatsApp).

**Per chi.** Persone che li conoscono (amici, conoscenti, community 3D printing)
e che vogliono vedere cosa fanno, chiedere un pezzo o un colore diverso, o
proporre un'idea da stampare insieme.

**Obiettivo principale.** Far vedere i pezzi e aprire una conversazione. Non è un
negozio: niente prezzi, niente carrello, niente form. La "conversione" è un
messaggio su uno dei tre canali.

**Vincolo che ha guidato il progetto.** Il cliente voleva un sito che non si
vedesse "fatto con l'AI": niente pattern da template, scelte estetiche deliberate
e specifiche della stampa 3D.

---

## 2. Il concept: "Layer by layer"

Il nome del brand è anche la sua costruzione:

- **Stampa FDM** → gli oggetti nascono strato dopo strato (layer);
- **Double Layer** → due strati, come le due persone del progetto (e le due
  stampanti nel laboratorio).

Il sito non *descrive* la stampa 3D, se ne *comporta come lei*: il logo si
costruisce come un oggetto che viene stampato, le sezioni si separano come
strati depositati, e il codice che guida le macchine diventa texture. Ogni
decisione grafica discende da questa metafora, mai dalla libreria dei pattern
generici.

L'audacia è concentrata in un solo posto (il wordmark dell'hero, vedi §6);
tutto il resto è disciplinato: palette ridotta, griglia chiara, testo pulito.

---

## 3. Palette

Dal logo esistente (viola + giallo), riusata con disciplina. I token vivono in
`website/src/styles/global.css` (sezione `:root`).

| Token | Hex | Ruolo |
|---|---|---|
| PLA White | `#EFF0F2` | Sfondo principale — perla fredda, **non** il cream `#F4F1EA` da template |
| Paper Dim | `#E6E7EA` | Sfondo secondario dei plate fotografici |
| Nozzle Ink | `#241A30` | Testo e sezioni scure — nero-violaceo cromatico, **non** `#0B0B0B`/`#111` |
| Ink Soft | `#3A2E4A` | Testo intermedio (tagline, paragrafi) |
| Filament Purple | `#5B2E91` | Accento primario (dal logo): azioni, primo strato del wordmark |
| Purple Deep | `#472271` | Hover dei bottoni solidi |
| Silk Gold | `#FFCE00` | Secondo strato, linee d'accento, focus su scuro |
| Muted Lavender | `#625D6E` | Testo secondario, didascalie (5.6:1 su carta) |
| Layer Line | `#D9D7DE` | Hairline chiare |
| Layer Line Dark | `#C3C0CB` | Hairline marcate, bordi dei plate |

**Vincoli d'uso documentati:**

- **L'oro non è mai testo su chiaro** (contrasto 1.31:1): solo elemento grafico
  (eco del wordmark, layer line d'accento, bordi di focus su fondo scuro,
  sottolineature animate).
- Il viola porta le azioni (`btn--solid`) e il primo strato del wordmark;
  su carta ha 8.2:1 di contrasto, verificato.
- La selezione testo è oro su inchiostro (`::selection`): un dettaglio
  coerente col sistema.

### 3.1 Tema scuro "Notturno"

Attivo con `data-theme='dark'` su `<html>`: default segue
`prefers-color-scheme`, override manuale via toggle (persistito in
`localStorage('dl-theme')`). I brand colori solidi (`--purple`, `--gold`)
non cambiano; ruotano fondo, testo, hairline e accenti testuali. Override
dei soli token colore in `:root[data-theme='dark']`:

| Token | Chiaro | Notturno | Contrasto su Notturno |
|---|---|---|---|
| `--paper` | `#EFF0F2` | `#191322` | — |
| `--paper-dim` | `#E6E7EA` | `#221B30` | — |
| `--ink` (testo) | `#241A30` | `#ECEAF0` | **15.2:1** |
| `--ink-soft` | `#3A2E4A` | `#CFC9DA` | **8+:1** |
| `--muted` | `#625D6E` | `#A39DAF` | **6.9:1** |
| `--purple-text` | `#5B2E91` | `#A98BD9` | **6.4:1** |
| `--purple-display` | `#5B2E91` | `#8B68C9` | **4.25:1** (large) |
| `--line` / `--line-dark` | `#D9D7DE` / `#C3C0CB` | `#2C2539` / `#37304A` | — |
| `--focus` | `#5B2E91` (8.2:1) | `#FFCE00` (12.2:1) | — |
| `--footer-bg` | `#241A30` | `#140F1D` | — |

Token trasversali (validi in entrambi i temi): `--purple-on-dark` `#8B68C9`
(display wordmark su fondi ink, sempre) e `--on-dark-text` `#ECEAF0` (testo su
fondi ink/footer, sempre). Il placeholder SVG dei pezzi esiste in due variabili
(`*-dark.svg`) selezionate dai componenti via `[data-theme]` — dopo l'audit
2026-10-12.

---

## 4. Tipografia

Tre famiglie con ruoli separati, tutte **self-hosted** in
`website/public/fonts/` (nessun CDN di terze parti, niente dipendenze npm
fragili per i font):

| Famiglia | Ruolo | Perché |
|---|---|---|
| **Clash Display** (500/600/700, Fontshare) | Display: wordmark, titoli di sezione, nomi dei pezzi | Grottesca con carattere forte a grandi dimensioni; non Inter, non Space Grotesk |
| **Satoshi** (400/500/700, Fontshare) | Corpo, UI, navigazione | Pulita ma non il default; buona leggibilità a misura media |
| **Space Mono** (400/700, Google Fonts) | **Solo dati tecnici veri**: specifiche di stampa, G-code, colophon | Nel mondo del cliente il mono è il G-code, non un'etichetta decorativa: uso giustificato dal soggetto |

**Scala** (da Elements of Typographic Style, ritmo ~1.28):

- corpo `1.0625rem`, line-height 1.55
- misura del corpo: `max-width 68ch` (sotto gli 80 caratteri)
- titoli di sezione: `clamp(2rem, 4.6vw, 2.9rem)`
- wordmark hero: `clamp(3.1rem, 10.5vw, 7.6rem)`, line-height 0.94,
  tracking -0.02em

**Trattamenti evitati di proposito** (tell da pagina generata):

- nessuna parola singola colorata dentro un titolo di testo (il bicolore del
  wordmark è un logo, non un accento);
- niente label ALL-CAPS sopra i titoli;
- niente "→" appeso ai link; i link di testo usano una sottolineatura oro che
  si stende all'hover (la layer line che risponde all'azione).

---

## 5. Layout

- **Allineamento a sinistra**, sempre. Niente testo giustificato.
- Contenitore `min(1240px, 100% - 2·gutter)`, gutter fluido
  `clamp(1.25rem, 4.5vw, 3rem)`.
- **Griglia lavori asimmetrica**: 12 colonne con pattern 7/5–5/7 per 4 elementi
  (home) e rotazione 7/5/5/7 su 6 elementi (galleria). Le card non sono tutte
  uguali per scelta: la variazione di scala è editoriale.
- **Plate squadrate** (0 radius) con bordo hairline: niente card arrotondate
  con ombra grigia. Le foto vivono in plate con bordo e padding `0.55rem`
  (hero, dettaglio, about).
- Spaziatura sezione: `clamp(3.75rem, 9vw, 7rem)` verticale.
- Responsive: colonna unica sotto i breakpoint (760/860/900/960px a seconda del
  componente), menu mobile con pannello, G-code nascosto sotto 1180px.

---

## 6. I tre dispositivi di marca

### 6.1 Wordmark a due strati (`Wordmark.astro`)

Il logo come costruzione di stampa:

- "Double" in Filament Purple;
- "LayeR" in Nozzle Ink con **eco in Silk Gold** fuori registro di
  `0.085em / 0.05em` — il "layer shift" che ogni stampatore conosce;
- al caricamento, l'eco parte più disallineata `(0.42em, -0.18em)` e **si
  mette in registro** in 750ms (`echo-register`, `var(--ease-snap)`): il
  gesto coreografico unico della pagina;
- sotto, "prints" in Space Mono minuscolo, muted.

È l'unica scena "strong" del sito: tutto il resto le fa da sfondo.

### 6.2 Layer lines (`LayerLines.astro`)

I divisori tra le sezioni sono pile di 4 hairline con spessori e gap irregolari
(1px/2px, gap 5/11/4/13px) — come gli strati di un oggetto stampato. Varianti:

- `gold`: la terza linea diventa oro 2px (lo strato marcato);
- `onDark`: per il footer;
- `hero`: le linee si "stendono" da sinistra al load (`laydown`, staggered),
  parte dello stesso momento orchestrato.

Sono struttura (segnalano il passaggio tra "strati" di contenuto), non ornamento.

### 6.3 G-code nel margine (`GCodeStrip.astro`)

Colonna di G-code autentico in stile slicer (G1, M104, `; LAYER:001`,
`; PRINT COMPLETE`), tenue, con maschera a gradiente in cima e in fondo,
posizionata nel margine sinistro dell'hero (hidden sotto 1180px). `aria-hidden`,
puramente atmosfera: è il codice con cui ogni pezzo nasce, presente ma non
leggibile — come le istruzioni macchina rispetto all'oggetto finito. I commenti
`;LAYER*` portano un tint viola tenue, come i commenti nei slicer reali.

**Dispositivo accessorio**: le due lettere T / R in home (piatti ink e purple
con eco oro) come ritratto-monogramma dei fondatori, in attesa di una foto vera.

### 6.4 Il piano di stampa (`PageRail.astro`)

**Fonte di ispirazione**: [getartcraft.com/apps](https://getartcraft.com/apps)
(ArtCraft). Da lì derivano il modello di interazione: indice laterale dei
titoli di sezione che si scambia a slot quando si attraversa una sezione,
progresso percentuale in scorrimento, marcature a tacchette lungo il bordo
destro. Tutto il resto è esecuzione nostra: la rail vive nella metafora
"Layer by layer" (strati FDM, G-code, oro di marca) e non copia né palette né
tipografia di ArtCraft (già documentato nel reverse del sorgente in
`IMPROVEMENTS.md` §10, fase 8: lì il rail non esiste come componente unico,
ma è una combinazione di header sticky + barre HUD sticky).

Rail laterale fissa a destra **a tutta altezza** (da sotto la nav fino al
fondo viewport; solo ≥1280px, su **tutte le pagine**: Home 5 strati,
Dettaglio 3, Chi siamo 3, Lavori 2 (archivio/pezzi), Contatti e 404 1):
la pagina è l'oggetto, la rail è il file di slicing.

- Ogni sezione della pagina è uno **strato**: la fetta sulla rail è
  proporzionale all'altezza reale del blocco, separata dalle altre da gap
  irregolari (il texture è un `repeating-linear-gradient` di hairline, come
  gli strati FDM).
- **L'indice carosello**: accanto al traccia la colonna dei titoli di sezione
  (`02 / LAVORI SELEZIONATI`, mono maiuscolo) sta **ferma in tre slot** — la
  sezione attiva è al centro (numero viola + nome ink, tick oro), la
  precedente sta sopra (mezza sfumata, esce scorrendo sotto la nav), la
  successiva sta sotto (mezza sfumata, entra dal fondo). Al cambio di sezione
  l'intera colonna trasla di uno slot (0.5s ease-lay); nello scroll dentro la
  stessa sezione non si muove nulla — movimento solo ai confini, come nel
  riferimento (getartcraft).
- La **testa di stampa** è una linea oro 2px alla quota di scroll (`scaleY`
  continua): gli strati depositati sopra di lei portano hairline violacee,
  quelli futuri restano in `--line-dark`.
- Click su uno strato → ancora alla sezione; lo strato attivo si riempie e la
  label mono (`02 / LAVORI SELEZIONATI`) appare al hover (persistente solo
  ≥1560px, dove il gutter la ospita).
- In fondo: `N%` → `; PRINT COMPLETE` a fine pagina, l'eco del colophon. La
  percentuale è sempre a tre cifre (`047%`), come i numeri di layer nel G-code.
- Ogni strato porta un micro-tick hairline (il "marcatore" dello slicer,
  violaceo sui depositati, oro sull'attivo).
- Dove la rail esiste la barra di scorrimento nativa del browser viene
  nascosta (`:root:has([data-rail])`): la progressione è la barra del sito.
- Un `ResizeObserver` su `<html>` ricalibra la mappa a ogni mutazione di
  altezza (filtri della galleria, font, immagini).

Progressive enhancement: senza JS restano anchor native e strati equidistanti;
con JS la misura è ricalcolata a init, `load`, `fonts.ready` e `resize`. Solo
JS vanilla, come filtri, menu e tema.

---

## 7. Struttura del sito

| Rotta IT | Rotta EN | Contenuto |
|---|---|---|
| `/` | `/en/` | Hero (wordmark, tagline, CTA, foto laboratorio, G-code), Lavori selezionati, Come lavoriamo (01–03), teaser Chi siamo, banda contatti |
| `/lavori/` | `/en/works/` | Titolo, intro, filtri per categoria (chips, vanilla JS), griglia 6 pezzi |
| `/lavori/[slug]/` | `/en/works/[slug]/` | Foto (principale + thumbs), categoria, titolo, descrizione, tabella specifiche mono, CTA WhatsApp precompilata, banda contatti |
| `/chi-siamo/` | `/en/about/` | Storia in 3 paragrafi, foto laboratorio, le due stampanti con descrizione, banda contatti |
| `/contatti/` | `/en/contact/` | Tre plate: Instagram DM / Email / WhatsApp, con icona, handle mono, descrizione, azione |
| `/404.html` | — | "Layer mancante": errore spiegato nella voce del sito, ritorno alla home |

- **i18n**: routing nativo Astro, IT alla root (senza prefisso), EN sotto `/en/`;
  rotte tradotte segmento per segmento (`lavori` ↔ `works`, `chi-siamo` ↔ `about`,
  `contatti` ↔ `contact`); switch lingua che mappa la pagina corrente;
  `hreflang` + `x-default` + canonical su ogni pagina.
- **Contenuti**: Astro Content Collections con glob loader; ogni pezzo vive in
  due file `src/content/works/<slug>.it.md` / `<slug>.en.md` con frontmatter
  validato da zod (`title, category, materials, dimensions, layerHeight,
  weight, printTime, photos, alt, featured, order`). Aggiungere un pezzo =
  aggiungere due file + foto.
- **Contatti/config**: centralizzati in `src/consts.ts` (Instagram, email,
  numero WhatsApp, stampanti) con prefill dei messaggi.
- **Foto**: la foto del laboratorio è `public/images/studio.jpg` (reale);
  le immagini dei pezzi sono placeholder SVG "a strati" generati da
  `scripts/gen-placeholders.mjs` (deterministici per slug, con layer shift e
  banda oro), da sostituire con foto vere.

---

## 8. Contenuti e voce

- Prima persona plurale ("siamo", "lavoriamo"), tono da laboratorio: concreto,
  niente marketing ("se un pezzo non ci convince, lo ristampiamo").
- Le specifiche sono parte del racconto: materiale, dimensioni in mm, altezza
  layer, peso, tempo di stampa — vere o plausibili, mai "Lorem".
- Le CTA dicono cosa succede: "Vedi i lavori", "Apri la chat", "Scrivici su
  WhatsApp".
- Gli stati vuoti danno direzione ("Nessun pezzo in questa categoria, per ora.").
- Tutto bilingue IT/EN in `src/i18n/ui.ts` (stringhe UI) + file di contenuto.

---

## 9. Stack tecnico

- **Astro 5** (`5.18`), output statico, zero framework JS nel browser; vanilla
  JS solo per filtri galleria, menu mobile, tema e piano di stampa (`PageRail`).
- `astro.config.mjs`: `site: https://tancredibosi.github.io`, `base: /doublelayer`,
  `trailingSlash: 'always'`, i18n con `prefixDefaultLocale: false`.
- Helper `pathFor()`/`asset()` per generare URL con base corretta ovunque
  (link, immagini, font, preload).
- Font preload (woff2) su Clash 600 / Satoshi 400 / Space Mono 400.
- Deploy: `.github/workflows/deploy.yml` con `withastro/action@v3`
  (build da `./website`, upload artifact, `actions/deploy-pages@v4`).
- Nessuna dipendenza oltre ad Astro stesso.

---

## 10. Registro delle decisioni

| Decisione | Scelta | Perché |
|---|---|---|
| Ricostruzione totale | Astro da zero, vecchio React/Vite eliminato (resta in git history) | Portfolio statico: niente state, niente router client; il sito è contenuto |
| Commercio | **Nessun prezzo/ordine/form** | Il sito è un portfolio, non un negozio; le richieste passano dai tre canali |
| JS | Vanilla, inline dove serve | Filtri e menu non giustificano un framework |
| FAQ | Tagliata | Fuori scope; le risposte vivono nella voce dei contenuti |
| Dark mode | **Implementata** (fase 1, tema "Notturno") | Il laboratorio di notte: stessa idea, contrasti misurati, no inversione meccanica |
| Font | Self-hosted, niente fontsource/CDN | Affidabilità (registry) + privacy + controllo |
| Placeholder | SVG "a strati" on-brand, onesti | Meglio di Unsplash a caso; la nota "Foto in arrivo" lo dichiara |
| Logo nel sito | Wordmark in **testo vivo**, non raster | Nitidezza, theming, è il gesto dell'hero; il raster resta per favicon/OG |
| Rail laterale | **"Piano di stampa"** (`PageRail`), solo ≥1280px e su pagine lunghe | Il requisito era una rail (non esiste in getartcraft: lì sticky HUD in alto); qui è l'affettatura della pagina, §6.4 |
| Fonte rail | Ispirazione interattiva: **getartcraft.com/apps** (slot titoli + progresso + tacchette) | Interazione studiata sul loro sito, esecuzione tutta "Layer by layer" (strati FDM, G-code, oro) — §6.4 |
| `generateId` custom nella collection | Mantenere `slug.it.md` con punto | Slug puliti e condivisi tra le lingue |
| `render(entry)` scartata | `set:html={entry.rendered.html}` | Il glob loader pre-renderizza il markdown; `render()` falliva su questo setup |

---

## 11. Audit anti-template

Cluster di default AI-generated, e cosa fa il sito al loro posto:

1. **Cream + serif + terracotta** → perla fredda + grottesca + viola/oro del logo.
2. **Nero + accento acido** → aubergine cromatico come nero, oro del brand.
3. **Broadsheet hairline** → le hairline ci sono ma sono *pile stratificate*
   (layer lines), non regole da giornale; layout areato, non denso.
4. **SaaS-card kit** → plate squadrate con bordi, span di griglia variati,
   zero ombre grigie, zero radius uniforme.
5. **Template chrome** → niente "→" sui link, niente numerazione decorativa
   (01/02/03 solo nel processo, che è una sequenza vera), niente "A · B · C":
   gli eyebrow mono esistono ma sono **commenti G-code veri di forma**
   (`; ARCHIVIO STAMPE / 0.12-0.28 MM` — maiuscoli come nello slicer, separatori
   slash, niente middle-dot da template).
   - Nota onesta: i pattern "A · B · C" e "PAROLA — frammento" nella caption
     hero, nel colophon e nelle spec dei piatti sono stati rimossi
     (`IMPROVEMENTS.md` fase 3 completata): caption riscritta, colophon su due
     elementi, spec dei piatti su due righe.

## 12. Accessibilità e quality floor

- Skip link, focus visibile (ring per tema: viola su chiaro, oro su scuro),
  `aria-current` in nav, `aria-pressed` sulle chip e sul toggle tema,
  aria-label su toggle menu, alt testi su ogni foto, `aria-label` sul pannello
  mobile, `landmark` main/skip; la rail è un `nav` landmark con link reali e
  aria-label numerati (percentuale e testa decorativi, `aria-hidden`).
- `prefers-reduced-motion`: niente coreografia (wordmark già in registro,
  layer lines statiche).
- Contrasti misurati (chiaro): viola/carta 8.2:1, inchiostro/carta 14.6:1,
  muted/carta 5.56:1, bianco/viola 9.4:1, oro/ink 11.1:1. (Notturno): testo
  15.2:1, link 6.4:1, muted 6.9:1, oro 12.2:1, focus 12.2:1.
- I due difetti P0 del primo round (focus ring oro su chiaro 1.31:1 e
  "Double" del footer viola su ink 1.77:1) sono **risolti** in fase 1
  (`IMPROVEMENTS.md`).
- Lazy loading immagini, width/height espliciti (no CLS), `fetchpriority` sul
  primo fotogramma, alt mirati, foto di studio servita compressa (1600px).

---

## Dove intervenire

| Cosa | Dove |
|---|---|
| Token colore/tipo/spazi | `website/src/styles/global.css` (`:root`) |
| Contatti, WhatsApp, stampanti | `website/src/consts.ts` |
| Stringhe UI IT/EN | `website/src/i18n/ui.ts` |
| Storia Chi siamo | `website/src/components/pages/AboutPage.astro` |
| Nuovo pezzo | `website/src/content/works/<slug>.{it,en}.md` + foto in `public/images/works/` |
| Placeholder | `website/scripts/gen-placeholders.mjs` (`npm run placeholders`) |
| Wordmark/layer lines/G-code | `website/src/components/{Wordmark,LayerLines,GCodeStrip}.astro` |

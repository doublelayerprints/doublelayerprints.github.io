# Design: distinzione "Fatto da noi / Remix" sui lavori

Data: 2026-10-15
Stato: approvato in discussione, in attesa di revisione scritta

## Problema

Ogni pezzo del portafoglio ha una categoria (Figure, Casa, Strumenti, Arte), ma non
dice se il modello è stato creato da zero da Tancredi e Rachele o se è la stampa di
un modello di un altro creator. Serve questa seconda distinzione, visibile in
homepage e nella pagina dei lavori.

## Decisioni prese (con l'utente)

- La distinzione **convive** con le categorie attuali: ogni pezzo ha sia una
  categoria (figures/home/tools/art) sia un'origine (original/remix).
- In homepage: solo etichetta sulle tessere, nessun blocco dedicato né filtri.
- In pagina lavori: **due righe di chip** (origine e categoria) che filtrano insieme.
- La distinzione appare anche **nella pagina di dettaglio** del pezzo.
- Niente nome del creator, niente link al modello originale: solo l'etichetta.
  Si potrà aggiungere un campo opzionale in futuro.
- I 6 pezzi esistenti vengono considerati "fatto da noi" per default.
- Etichette: IT "Fatto da noi" / "Remix"; EN "Made by us" / "Remix".

## Scelta dell'approccio

**Approccio 1 (scelto): campo `origin` nello schema dei contenuti.**

- Pro: un solo campo, tipizzato (la build valida i valori), i file md esistenti non
  vanno toccati grazie al default, un campo serve sia al filtro sia alle etichette.
- Contro: nessuno rilevante.

Approcci scartati:

- *Collection separata per i remix*: duplica componenti e pagine e rompe il pattern
  "un pezzo = slug.it.md + slug.en.md".
- *Testo libero*: niente validazione, errori silenziosi.

## Architettura

### Dati — `website/src/content.config.ts`

Nuovo campo nello schema `works`:

```ts
origin: z.enum(['original', 'remix']).default('original'),
```

Nessuna modifica ai 12 file `.md` esistenti. Per un futuro remix: `origin: remix`
nel frontmatter di entrambi i file (`slug.it.md`, `slug.en.md`).

### Etichette — `website/src/i18n/ui.ts`

Nuove chiavi in entrambe le lingue:

| Chiave                  | IT            | EN          |
| ----------------------- | ------------- | ----------- |
| `origin.original`       | Fatto da noi  | Made by us  |
| `origin.remix`          | Remix         | Remix       |
| `works.filter.allOrigins` | Tutte le origini | All origins |

La chiave `works.filter.all` resta per la riga categorie, con etichetta al
femminile plurale perché le categorie sono "categorie": IT "Tutte", EN "All".
La nuova `works.filter.allOrigins` serve per la riga origine.

### Tessera pezzo — `website/src/components/ProductPlate.astro`

La riga categoria diventa "categoria · origine", es. `Figure · Fatto da noi`:

```
<p class="plate__cat">{t(catKey)} · {t(originKey)}</p>
```

Così la distinzione è visibile in homepage (sezione "Lavori selezionati") e in
pagina lavori senza modifiche di layout.

### Pagina lavori — `website/src/components/pages/WorksPage.astro`

Due righe di chip sopra la griglia:

1. Origine: `Tutte le origini` / `Fatto da noi` / `Remix` → `data-filter-origin`
2. Categoria: `Tutte` / `Figure` / `Casa` / `Strumenti` / `Arte` → `data-filter-cat`

Comportamento:

- Ogni riga funziona come oggi: una sola voce attiva per riga (`aria-pressed`),
  default "tutti" per entrambe.
- Il filtro è **la combinazione**: un pezzo è visibile se la sua origine combacia
  con il chip origine attivo E la sua categoria combacia con il chip categoria
  attivo.
- Ogni cella della griglia espone già `data-category`; si aggiunge `data-origin`.
- Il contatore pezzi e il messaggio "nessun pezzo" reagiscono alla combinazione
  dei due filtri.
- Il JS inline attuale (`WorksPage.astro`, blocco `<script is:inline>`) viene
  esteso: invece di un filtro `f`, tiene due variabili `originFilter` e
  `catFilter` e le combina.

### Pagina di dettaglio — `website/src/components/pages/WorkDetailPage.astro`

L'origine appare nella riga mono sopra il titolo (eyebrow), oggi
`; {CATEGORIA}`, divisa in due parti in linea con lo stile esistente, es.:

```
; FIGURE — FATTO DA NOI
```

Nessun nuovo blocco: solo la stringa dell'eyebrow si compone con categoria e
origine.

### Homepage — `website/src/components/pages/HomePage.astro`

Nessuna modifica al markup: le "Lavori selezionati" usano `ProductPlate`, quindi
l'etichetta arriva gratis. Resta la scelta dei featured per `featured` + `order`.

## Errori e casi limite

- Frontmatter con `origin` invalido → errore in build (schema Zod), comportamento
  voluto.
- Un filtro (origine o categoria) senza pezzi corrispondenti → messaggio
  "Nessun pezzo" già esistente, mostrato quando la combinazione dà 0 risultati.
- `origin` assente in un vecchio file → default `original` (nessuna migrazione).

## Testing / verifica

- `npm run build` dentro `website/`: verifica schema, entrambe le lingue, pagina
  lavori e dettaglio.
- Controllo manuale (o `npm run dev`): combinazione di chip origine+categoria,
  contatore, messaggio vuoto, tema scuro/chiaro sulle tessere, pagina pezzo IT/EN.

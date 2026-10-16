# Design: foto remix nei lavori (14 nuovi pezzi)

Data: 2026-10-16
Stato: approvato in discussione

## Problema

L'utente ha caricato 70 foto di pezzi remix (personaggi di altri creator) in
`/Users/tancredi/Desktop/DoubleLayeRPrints/immagini_oggetti/ImmaginiRemix/`
(3 sessioni di scatto: 3, 10 e 13 ottobre 2026, portrait 3072×4096, ~232MB).
Vanno trasformate in pezzi del sito con la distinzione origin=remix appena
introdotto (spec 2026-10-15).

## Decisioni prese (con l'utente)

- **1 pezzo per personaggio** (14 pezzi); le foto di coppia finiscono come foto
  extra nelle pagine di entrambi i personaggi.
- **Specifiche di stampa opzionali:** i 14 nuovi pezzi non hanno ancora dati;
  il campo specs diventa opzionale e la tabella/tessera nasconde ciò che manca.
  I 6 pezzi attuali restano completi.
- **Featured in homepage:** Mario, Topolino stregone, Gengar, Titti (i 4 pezzi
  con le foto migliori, uno per "serie").
- **Bullet Bill è una figura** (non contenitore, anche se ha la testa removibile):
  category `figures` per tutti i 14.

## Inventario foto → pezzi

Slug, titolo IT/EN, foto scelte (dalla cartella ImmaginiRemix; le altre sono
duplicati da scartare):

| Slug | IT / EN | Foto principali (nuovo nome) | Foto di coppia condivise |
| --- | --- | --- | --- |
| mario | Mario / Mario | 153205, 153206, 153214, 153219 | 152931, 152938 (con Luigi) |
| luigi | Luigi / Luigi | 153128, 153130, 153139, 153153 | 152931, 152938 (con Mario); 153455, 153500 (con Daisy) |
| dixie-kong | Dixie Kong / Dixie Kong | 153340, 153345, 153350 | 153235, 153333 (con Diddy) |
| diddy-kong | Diddy Kong / Diddy Kong | 153400, 153405, 153410 | 153235, 153333 (con Dixie) |
| shy-guy | Shy Guy / Shy Guy | 153422, 153436, 153441 | — |
| daisy | Principessa Daisy / Princess Daisy | 153511, 153516, 153520 | 153455, 153500 (con Luigi) |
| jolteon | Jolteon / Jolteon | 153701, 153706, 153710 | 153650, 153655 (con Umbreon) |
| umbreon | Umbreon / Umbreon | 153718, 153719, 153724, 153729 | 153650, 153655 (con Jolteon) |
| gengar | Gengar / Gengar | 153749, 153756, 153800 | — |
| toad | Toad / Toad | 113706, 113714, 113721, 113731 | 113702, 113758 (con Bullet Bill) |
| bullet-bill | Bullet Bill / Bullet Bill | 113750, 113802, 113808, 113813, 113816, 113831, 113840, 113847 | 113702, 113758 (con Toad) |
| sorcerer-mickey | Topolino stregone / Sorcerer Mickey | 113914, 113919, 113929, 113934, 113940, 113945 | — |
| daffy-duck | Daffy Duck / Daffy Duck | 121144, 121152, 121202, 121224, 121231 | — |
| tweety | Titti / Tweety | 122458, 122503, 122508, 122515, 122521, 122531 | — |

Tutte le foto sono portrait 3:4; nella carta la mostra è 4:3 con crop
`object-position: top` per non tagliare le teste; nel dettaglio le foto vere
(oggi tutte `.jpg`) si mostrano intere in portrait.

## Architettura

### 1. Schema — `website/src/content.config.ts`

I campi delle specifiche diventano opzionali (`.optional()`): `materials`,
`dimensions`, `layerHeight`, `weight`, `printTime`. `photos` e `alt` restano
obbligatori; `category`, `origin`, `featured`, `order` invariati.

### 2. Tessera — `website/src/components/ProductPlate.astro`

- `.plate__spec`: renderizzato solo se `materials` o `layerHeight` esistono;
  le due span mostrano solo i valori presenti (con fallback silenzioso).
- Immagini: le foto vere sono `.jpg` (niente variante `-dark`, che resta solo
  per i placeholder `.svg`).

### 3. Dettaglio — `website/src/components/pages/WorkDetailPage.astro`

- `SpecTable`: righe con valore assente omesse del tutto; se nessun valore
  esiste, l'intero blocco `#specifiche` non viene renderizzato.
- Foto: se la foto non è `.svg` (foto vera), il `<figure>` principale non forza
  `aspect-ratio 4/3` — l'immagine si mostra intera (portrait); i placeholder
  `.svg` restano 4:3. Stesso criterio per i thumb.

### 4. Contenuti — 28 file in `website/src/content/works/`

Per ognuno dei 14 slug: `<slug>.it.md` + `<slug>.en.md` con:
- `origin: remix`, `category: figures`, `featured` solo per mario,
  sorcerer-mickey, gengar, tweety; `order` 7–20 (7 mario, 8 luigi, 9 dixie-kong,
  10 diddy-kong, 11 shy-guy, 12 daisy, 13 jolteon, 14 umbreon, 15 gengar,
  16 toad, 17 bullet-bill, 18 sorcerer-mickey, 19 daffy-duck, 20 tweety).
- I 6 pezzi attuali non cambiano (`featured` e `order` restano; i 4 featured
  attuali NON sono più tra i primi 4 visibili perché l'home prende i primi 4
  `featured` per `order`: con i nuovi featured a order 7/15/18/20, la home
  mostrerebbe drago(1), vaso(?), loop(?), organizer(?) PRIMA dei nuovi.
  → Decisione: gli attuali featured passano a `featured: false`, così la home
  mostra esattamente mario, gengar, sorcerer-mickey, tweety).
- Descrizioni: 2 paragrafi brevi IT + EN in voce del sito (giocosa, prima
  persona plurale), scritte dall'agente, correggibili dall'utente.
- `alt` descrittivi per ogni foto principale.

### 5. Foto — preparazione e inserimento

Script `sips` (macOS) dalla cartella sorgente:
1. Rinomina `<slug>-<n>.jpg` (n=1..k, ordine per qualità/composizione scelta
   nell'inventario sopra).
2. `sips -Z 1600 -s format jpeg -s formatOptions 72` in
   `website/public/images/works/` (stesso trattamento di `studio-16.jpg`).
3. Le foto di coppia: stesso file fisico usato da due pezzi (una copia sola,
   due nomi? No: il filesystem non ha symlink nel repo → ogni pezzo referenzia
   il proprio nome, ma per non duplicare i byte si accetta che ogni pezzo abbia
   le sue copie rinominate — sono ~1600px q72, ~150-300KB l'una, accettabile).

### 6. Verifica

- `npm run build` da `website/`.
- Grep su dist: 20 pagine di dettaglio totali (6 vecchie + 14 nuove ×2 lingue
  = 40 pagine pezzo; 21+20=41 pagine totali), 4 featured nuove in home.
- Controllo manuale dev server: home (4 nuove tessere), pagina lavori (20 pezzi,
  filtri origin=remix mostra 14), dettaglio di un pezzo con e senza specs,
  tema scuro.

## Casi limite

- Foto verticali in griglia 4:3 → crop top (teste al sicuro).
- Duplicati tra sessioni → scelti a mano nell'inventario (tabella sopra).
- Spec mancanti → tabella assente, tessera senza riga materiali.
- Alt text: obbligatori, scritti per la foto principale.

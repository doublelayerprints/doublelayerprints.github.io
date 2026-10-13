# Wordmark bicolore uniforme — Double viola, LayeR oro, prints grigino

Spec di design per il restyling dei colori del wordmark e di ogni sua ricomparsa
nel sito. Data: 2026-10-13. Stato: approvata dall'utente dopo brainstorming con
mockup (sessione `.superpowers/brainstorm/83159-1791884961`).

---

## 1. Il problema e le scelte dell'utente

**Problema.** Nel tema Notturno (tema principale) la scritta "LayeR" del
wordmark è quasi bianca (`--on-dark-text` #ECEAF0): si vede poco e pesa poco
rispetto al colore. L'utente vuole un sistema colore uniforme per il brand su
tutto il sito:

- **Double** in viola — come ora;
- **LayeR** in oro, con la copia fuori registro "sopra" (davanti) gialla e
  quella "sotto" (dietro) non bianca;
- **prints** in bianco o grigino, secondo ciò che serve alla coerenza.

**Decisioni prese durante il brainstorming:**

| Domanda | Scelta |
|---|---|
| Trattamento di "LayeR" | **A · Eco invertita**: fronte tutta oro, copia fuori registro dietro in un colore non bianco (l'inversione dell'attuale fronte quasi bianco + eco oro) |
| Colore della copia dietro | **B · Viola**: #8B68C9 di notte — richiama "Double", il wordmark legge viola-oro-viola |
| Comportamento in tema Giorno | **B · Oro sempre** anche su fondo chiaro, accettandone la tenue leggibilità (1.31:1): il wordmark è logo, non testo di lettura; l'eco viola scuro dietro ne rinforza il contorno |
| Approccio implementativo | **1 · Token semantici** in `global.css`, riusati da tutti i componenti |

---

## 2. I token

In `website/src/styles/global.css`, sezione `:root` (e corrispondente override
in `:root[data-theme='dark']`):

| Token | Giorno | Notturno | Ruolo |
|---|---|---|---|
| `--mark-layer` | `#FFCE00` | `#FFCE00` | Fronte "LayeR" — costante, entrambi i temi |
| `--mark-echo` | `#472271` | `#8B68C9` | Eco viola dietro "LayeR" |
| `--on-dark-muted` | `#A39DAF` | `#A39DAF` | "prints" su fondi sempre scuri (footer) — costante |

Riutilizzi senza token nuovi:

- **Double**: `--purple-display` (hero, tema-dipendente #5B2E91/#8B68C9) e
  `--purple-on-dark` (footer, costante su ink) — com'è ora;
- **prints** su fondi a tema: `--muted` (#625D6E/#A39DAF) — com'è ora;
- "prints" nel footer passa da oro → `--on-dark-muted` #A39DAF.

---

## 3. Le superfici toccate

### 3.1 Wordmark (`Wordmark.astro`) — hero home e footer

Cambio di soli colori: font, misure, offset dell'eco (0.085em/0.05em) e
animazione `echo-register` restano esattamente come sono.

- `.mark__a` (Double): invariato — `--purple-display`, in `onDark`
  `--purple-on-dark`;
- `.mark__b-ink` (fronte LayeR): da `--ink` → `--mark-layer` (oro, costante);
  in `onDark` resta oro (rimuovere l'override sul colore del fronte);
- `.mark__b-echo` (copia fuori registro): da `--gold` → `--mark-echo`; in
  `onDark` (footer, fondo sempre ink) `--purple-on-dark` #8B68C9 costante;
- `.mark__sub` (prints): `--muted` invariato; in `onDark` da oro →
  `--on-dark-muted`;
- `.mark__b-deep` (terzo strato viola scuro, solo scena): invariato
  (`--purple-deep`).

### 3.2 Nav (`Nav.astro`)

- `.nav__brand-a` (Double): resta `--purple-text`;
- `.nav__brand-b` (LayeR): da `--ink` → `--mark-layer`, e prende la **doppia
  copia** come il wordmark: markup aggiuntivo di uno span-eco (aria-hidden)
  posizionato assoluto agli stessi offset em (0.085em/0.05em), colore
  `--mark-echo`, z-index dietro la fronte, **senza animazione** (il gesto
  coreografico resta solo nell'hero);
- `.nav__brand-sub` (prints): resta `--muted`.

### 3.3 Scena "Deposizione" (`Wordmark.astro`, stack dello slicer)

- `.mark__slice-b` (le 20 fette di "LayeR"): da `--ink` → `--mark-layer`;
- `.mark__slice-a` (fette "Double"): invariato `--purple-display`;
- `.mark__slice-sub` (fette "prints"): invariato `--muted`;
- Il meccanismo della scena (creeping clock, clip-path, testa d'oro) non cambia.

### 3.4 Fuori scope (invariati)

G-code strip, colophon, testi i18n, 404, immagini, struttura delle pagine.

---

## 4. Accessibilità e registro delle eccezioni

**Notturno (tema principale)** — token su `#191322`:

- fronte "LayeR" oro `#FFCE00` — **12.2:1**: il colore del brand ora cala
  a piena forza al posto del bianco neutro di prima; risolto il "si vede poco";
- "Double" `#8B68C9` — 4.25:1, testo display grande ✓;
- "prints" `#A39DAF` — 6.9:1 ✓.

**Giorno** — token su `#EFF0F2`:

- "Double" `#5B2E91` — 8.2:1 ✓; "prints" `#625D6E` — 5.56:1 ✓;
- fronte "LayeR" oro `#FFCE00` — **1.31:1: eccezione voluta e documentata**.
  Il vincolo "l'oro non è mai testo su chiaro" (`DESIGN.md` §3) resta valido
  per ogni altro uso e viene aggiornato con l'eccezione da-logo per il
  wordmark: la scritta è un logotipo, la leggibilità del nome per screen
  reader e browsing testuale è garantita dal testo `sr-only` ("Double LayeR
  Prints") già presente, e l'eco viola scuro dietro ne rinforza il contorno.
  La scelta è stata presa dall'utente dopo il confronto visivo dei mockup su
  fondo chiaro.

**Footer / fondi sempre scuri**: per costruzione indipendenti dal tema —
eco `--purple-on-dark` su ink `#241A30` 3.9:1 e su footer-bg notturno
`#140F1D` 4.4:1 (testo display grande ✓); prints `--on-dark-muted`
rispettivamente 6.3:1 e 7.2:1 ✓.

Nota d'implementazione (da quality review): l'eco del footer non si vedeva
perché `z-index: -1` finisce sotto il fondo opaco del footer in assenza di
contesto di stacking — risolto con `isolation: isolate` su
`.mark--footer .mark__visual`.

---

## 5. Documentazione da aggiornare

- `docs/DESIGN.md` §3 (vincolo d'uso dell'oro: aggiungere l'eccezione
  wordmark), §3.1 tabella temi (nuovi token), §6.1 (descrizione del wordmark e
  del suo doppio strato), §12 (contrasti: nota sull'eccezione).

---

## 6. Verifica

1. `npm run build` dentro `website/` (vincolo di `AGENTS.md`);
2. `npm run dev` + ispezione manuale di home (incluso lo scorrimento della
   scena "Deposizione"), nav, footer — in entrambi i temi (toggle + override di
   sistema);
3. Screenshot di confronto Notturno/Giorno dell'hero e del footer.

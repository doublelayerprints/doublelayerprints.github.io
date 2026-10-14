# Scena hero "Deposizione" — documento di design

Data: 2026-10-13. Stato: approvato in brainstorming (design verbale confermato
dall'utente; spec da revisionare prima del piano di implementazione).
Riferimenti: `docs/DESIGN.md` (sistema "Layer by layer"), `docs/IMPROVEMENTS.md`.

---

## 1. Obiettivo

La home (IT `/` e EN `/en/`) diventa **dinamica nel solo hero**: scrollando, l'hero
si trasforma in una scena pinned "deposizione strato per strato" nel linguaggio
"Layer by layer", **mantenendo tutto il contenuto e l'aspetto attuali a riposo**
(al load, e a fine scena prima del rilascio). Il resto della home e tutte le altre
pagine restano invariati.

- **Input:** la partenza resta quella di oggi: hero con wordmark, tagline, CTA,
  foto laboratorio, colonna G-code (tutto invariato in markup, contenuti e ordine;
  la coreografia al load — `echo-register`, layer lines — permane).
- **Output:** ~1.4 viewport di scroll "in scena" dentro il pin; trasformazioni
  scroll-linked e **reversibili al 100%** (scorrendo su l'oggetto si rimonta;
  fermarsi a metà = stampa in pausa, voluto).
- **Non-scopi (espliciti):** nessun contenuto nuovo, nessuna stringa i18n nuova,
  niente animazioni nelle sezioni sotto (Lavori, Processo, Duo, Banda), niente
  dipendenze.

## 2. Decisioni prese (dialogo col committente)

| Decisione | Scelta | Alternativa scartata |
|---|---|---|
| Ambito | Solo hero | hero + prima sezione; tutta la home |
| Modalità | Pin con sticky (progresso scroll 0→1) | parallax fluido senza pin |
| Gesto in scena | Deposizione strato per strato (bed → foto → scritta → nome) | vista esplosa / flip 3D della foto |
| Tecnologia | Vanilla JS + CSS variables (approccio A) | GSAP ScrollTrigger (dipendenza ~70KB, viola il no-deps registrato); CSS scroll-driven puro (supporto browser non universale) |

## 3. Storyboard (finestre di scroll)

`p` = progresso nel pin (0→1), calcolato dal wrapper dello stage:
`p = clamp((scrollY − top) / (stageH − winH))`.

| p | Strato | Cosa va in scena |
|---|---|---|
| 0 → 0.15 | **Bed** | Ancora nulla si deforma. L'apparecchio si arma: la riga di esecuzione nel G-code si evidenzia e avanza riga per riga (`; LAYER:001`); una hairline **oro** attraversa il bordo superiore del plate foto ("testina al lavoro" — stesso linguaggio della testa della rail). |
| 0.15 → 0.55 | **La foto** | L'immagine si frantuma in **4 fasce orizzontali** (strati FDM), ognuna si alza ~10px in 3D con micro-offset X, poi si deposita bottom-up. Sotto la foto scivolano 2 plate-fantasma (paper-dim + viola) che restano in scena come spessore dell'oggetto (il "double layer" reso visibile). Contatore mono che avanza: `LAYER 3/9`. |
| 0.50 → 0.80 | **Scritta + CTA** | Tagline e bottoni subiscono la stampa: sprofondano di 2–3px (la piastra appena premente) e tornano a registro. |
| 0.75 → 0.95 | **Il nome** | Wordmark per ultimo, la firma a fine stampa: l'eco oro di `LayeR` si allarga temporaneamente (0.085em → ~0.18em) poi torna a registro; un terzo strato viola-deep scivola e scompare prima del settle. "Double" resta fermo. |
| 0.92 → 1.00 | **Rilascio** | Tutte le trasformazioni tornano a 0; il pin si scioglie; LayerLines si stende e la sezione "Lavori selezionati" entra. |

Numeri = target di partenza, da tarare al browser (mockup e dev server) con
l'utente. Le finestre si sovrappongono con intenzione (fusione tra strati); i
settle delle fasce vanno in sequenza bottom-up, come FDM.

## 4. Architettura e componenti

**Nuovo componente `website/src/components/HeroScene.astro`** — pin + motore:

```html
<div class="hero-stage" data-hero-stage>            <!-- ~240svh, guida dello scroll -->
  <div class="hero-scene" data-hero-scene>          <!-- sticky, 100svh -->
    <slot />                                        <!-- markup hero attuale, invariato -->
  </div>
</div>
```

- **Motore** (IIFE inline, stesso pattern di `PageRail`, ~120 righe): misura top e
  altezza del wrapper, calcola `p`, mappa le finestre e scrive CSS vars per
  strato sull'elemento sticky (`--p-bed`, `--p-photo`, `--p-cta`, `--p-mark`,
  `--p-out`); attiva/disattiva il lavoro al transito con IntersectionObserver
  (`data-scene-live`).
- **Tutte le trasformazioni vivono nel CSS** (amount, easing, mapping su vars con
  `calc()`): il JS è solo clock. Più facile da tarare e reversibile per costruzione.
- **Attivazione**: flag pre-paint via script inline che aggiunge `data-motion-ok`
  a `<html>` solo se JS attivo e `prefers-reduced-motion: no-preference`
  (stesso schema del no-flash del tema in `Base.astro`).

**Integrazioni puntuali (diff minimali):**

| File | Intervento |
|---|---|
| `components/pages/HomePage.astro` | hero avvolto in `<HeroScene>`; tutto il resto invariato |
| `components/GCodeStrip.astro` | hook per la riga di esecuzione (marker spostato via var) e contatore di strato; testi invariati |
| `components/Wordmark.astro` | eco guidata da `--echo-spread` (calc su base 0.085em) + terzo strato viola-deep visibile solo nella sua finestra |
| `styles/global.css` | token di scena; CSS dello stage/sticky e delle fasce; gate `prefers-reduced-motion` |

**Fasce foto:** 4 copie assolute del `<img>` con `clip-path` e translateY
(stesso file: un solo decode); sotto, 2 plate-fantasma. Se il risultato pesa,
ripiego durante il tuning: 1 immagine + maschere/overlay a fasce.

## 5. Robustezza e qualità

- **Niente JS** → `data-motion-ok` mai aggiunto → stage alto quanto l'hero
  naturale: pagina com'è oggi, zero CLS.
- **`prefers-reduced-motion: reduce`** → scena disattivata (vars restano 0; le
  regole globali già annullano le animazioni di load). Nessuna deroga.
- **Perf**: solo `transform`/`opacity`; `will-change` su ≤4 nodi; rAF solo quando
  la scena è in viewport (IntersectionObserver); scroll listener passive;
  misure ricalibrate a `load`, `fonts.ready`, `resize` e (dove esiste) con
  `ResizeObserver` su `<html>` — pattern della rail.
- **Tema Notturno**: solo token costanti tra i temi (oro, viola); nessun colore
  theme-dependent nella scena.
- **Rail**: sticky interno non cambia i `docTops` (il wrapper scorre in flusso
  normale); la rail ricalibra da sola su resize/osservazione; verificare che
  `#intro` resti coerente.
- **Tastiera/tocco**: nessun elemento interattivo spostato; ordine di tab e focus
  ring invariati.
- **i18n**: un solo componente usato da IT ed EN; nessuna stringa nuova.

## 6. Verifica

1. `npm run build` dentro `website/` (obbligatorio, come da AGENTS.md).
2. `npm run dev` (porta 4321) — matrice manuale:
   - scroll lungo: Chrome/Safari/Firefox;
   - tema chiaro e Notturno;
   - breakpoint mobile — decisione di tuning: fasce attive ≥760px, sotto la
     scena semplificata (fino al 40% della trasformazione: echo + stamp CTA);
   - reduced motion (toggle di sistema / devtools);
   - JS disattivato (hero statico attuale).
3. Tuning visivo: prototipo Companion in `.superpowers/brainstorm/` + screenshot
   del dev server per conferma dell'utente sui valori.

## 7. Registro delle scelte (coerenza "Layer by layer")

- La scena **riusa e non aggiunge** linguaggio: oro = testa di stampa (già della
  rail), fasce = strati FDM (già layer lines), eco = layer shift (già del
  wordmark), G-code = voce macchina (già dell'hero).
- L'audacia resta concentrata in un solo posto (l'hero), il resto disciplinato.
- Zero dipendenze, zero stringhe, zero contenuti nuovi.

---

## Self-review (post-scrittura)

- Nessun placeholder o TBD nelle decisioni; i valori numerici sono dichiarati
  come target di partenza con percorso di tuning esplicito (mockup + dev
  server), non ambiguità irrisolte.
- Coerenza interna: storyboard e sezione ingegneria usano lo stesso vocabolario
  di componenti/vars; rollback per no-JS/reduced-motion dichiarato in §4 e §5.
- Scope: un piano di implementazione è sufficiente (1 componente nuovo + 3 diff
  puntuali); nessuna scomposizione necessaria.

---

## Addendum tuning 2026-10-13 (post-prova reale)

- Strati portati a **20 foto + 20 scritta = LAYER 000/040**, stampa
  **simultanea** (una finestra 15–70%), G-code in esecuzione allineato
  alla finestra di stampa.
- **Orologio macchina**: il progresso visibile insegue lo scroll con
  velocità limitata (`CAP = 0.7` p/s, `K = 20`): anche uno scroll
  violento attraversa l'intera stampa in ~1.4s e ogni strato si vede.
  Fuori viewport il progresso si azzera.
- **Tentato e scartato**: blocco macchina via wheel-jack (pagina
  parcheggiata nel pin, fling convertita in intento consumato a ritmo
  macchina). Due round di fix (matematica del residuo, cooldown) non
  hanno reso il pattern abbastanza robusto (momentum morto al primo
  preventDefault in Safari, ping-pong ai confini): **revert completo**.
  Il rischio di bug su un portfolio di produzione prevale sul
  beneficio; resta il clock limitato sopra descritto come mitigazione
  dello scroll veloce.

## Addendum 2026-10-13 b — plate fermo

Richiesta del committente: durante la scena l'immagine non deve ruotare
sull'asse X ("la voglio tenere fissa con l'effetto layer"). Rimosso il
tilt del plate foto (rotateX 12° + sollevamento −18px via `--k-tilt`) e
la `perspective` sul grid che gli serviva; l'effetto strato resta nelle
fasce che depositano dentro la piastra. `--k-tilt` tolto anche dal
clock (`HeroScene.astro`): nessuna regola lo consuma più.
Mobile <760px e reduced-motion non cambiano (la scena lì è già spenta).

## Addendum 2026-10-13 c — plate-ghost, testa e strati più fin

Tre correzioni su prova reale (screenshot del committente a LAYER 032):

1. **Sovrapposizione sul caption**: i plate-ghost scivola-vano in
   verticale (+16/+30px) e finivano sopra la didascalia. Ora la deriva
   è orizzontale (±14px, il layer-shift ai lati — stessa cifra del
   micro-offset X delle fasce ±9px): lo "spessore dell'oggetto" resta,
   la didascalia è sempre libera (verificato in CDP: bottom del ghost
   10px sopra il fondo dell'immagine, intersezione = false a p .45/.62/.78).
2. **Niente strato oltre la testa**: prima la clip era per-fascia e lo
   strato successivo, cadendo da −26px, passava sopra la linea d'oro.
   Ora il **contenitore** delle fasce è tagliato alla testa
   (`.hero__bands` e `.mark__slicestack`: `clip-path: inset((1−p)·100% …)`);
   le testine d'oro sono diventate sorelle dei contenitori
   (in `.hero__imgwrap` / `.mark__visual`) per non finire tagliate loro.
   Il nuovo strato nasce solo sotto la linea, foto e titolo.
3. **Strati più fin**: 20→40 fasce foto e 20→40 slice del wordmark
   (`--n: 40`, monospaziato con i contatori): barra `LAYER n/080`.

## Addendum 2026-10-13 d — prima il vuoto, poi la stampa

Due correzioni su verifica reale dello slicing:

1. **"Prima scompare, poi stampa"**: materiale (foto + wordmark) e stampa
   condividevano la stessa finestra — a LAYER 013 il materiale ancora
   dissolvenzato era visibile mentre la testa già tagliava. Nuove
   finestre in `HeroScene`: 10–24% dissolvenza del materiale, 4–26% bed,
   28–70% finestra di stampa, 68–90% rilascio. Le testine d'oro (+
   contatore) vivono solo nella finestra di stampa (var `--k-head`).
2. **Riquadro viola nel vuoto**: i plate-ghost avevano vita per tutta la
   scena e restavano visibili nel vuoto di stampa sopra la linea. Ora
   il respiro è agganciato alla finestra di dissolvenza
   (`sin(W(p, .10, .24)·π)`) — una volta pronti svaniscono e il vuoto
   di stampa è fondo pulito.

Verifica CDP a p .06/.17/.26/.44: dissolvenza senza teste né contatori
(op. 0), a fine dissolvenza foto/word/ghost = 0 e testa appena accesa,
a metà stampa testa a 1 e linea a ~33%, caption sempre pulita.

## Addendum 2026-10-13 e — la scritta non si legge "tagliata"

In nascent: durante la stampa la testa risaliva il blocco del wordmark
tagliando il capo dei glifi (l'"e" di Double rasentata a metà lettera,
in salita e in discesa). Due strumenti:

1. **Bozza da slicer**: durante la stampa la scritta resta visibile a
   opacità 0.14 (la "eco" già nel LESSICO del wordmark) — i glifi non
   scompaiono mai nella forma, la testa "recupera" l'inchiostro sopra
   la bozza. La formula `opacity: calc(0.14 + (1 − var(--k-word-ghost))
   · 0.86)` dà 1 a riposo e senza JS (identità a tutto il resto).
2. **Linea a battute di strato**: la testa del wordmark e la clip dello
   stack snappano a `--pw-snap` (scritta dal JS: floor(pw·40)+1 su 40):
   l'avanzamento è strato per strato, la separazione d'ingresso non
   attraversa mai il glifo a metà del suo strato. Foto: resta continua
   (il vuoto della foto non legge come "lettera tagliata").

Verifica CDP a pw ~0.87 in salita e discesa: glifi interi, bozza sopra
la linea, linea a battuta di strato; build ok.

## Addendum 2026-10-13 f — la firma torna a essere una firma

Anche con il ritaglio a strati e la bozza (addendum e) la riga dentro
i glifi si leggeva come bug (screenshot utente a LAYER 064: "Double"
mezza attraversata). Decisione: per il wordmark l'printing a fasce è
finito si torna all'intenzione originale della spec §3 — il nome è
**la firma a fine stampa**:

- Tolto lo stack di 40 slice e la testa del wordmark (DOM e CSS).
- Finestra firma 61–67%: il wordmark torna INTERO come uno strato
  unico che deposita dall'alto (fade + discesa −14px, entrambi
  proporzionali a --k-word-ghost): glifi mai tagliati, in nessuna
  direzione.
- Finestra di stampa foto compressa a 28–60%; il bed resta 4–26%;
  dissolvenza 10–24%; rilascio 68–90%.
- `printable` su `Wordmark` resta un prop inerte per compatibilità;
  i var `--pw`, `--pw-snap`, `--k-wfade` sono spariti.

Verifica CDP a p .06/.18/.45/.635/.72/.80: a riposo tutto intero;
in dissolvenza scritta e foto svaniscono insieme (slide −8.9px);
in stampa scritta ASSENTE e foto sotto la testa; alla firma parole
piene che scendono in posto; al rilascio foto torna piena.

## Addendum 2026-10-13 g — la scritta torna subito, non alla firma

Il committente: durante la stampa la scritta sparisce per tutta la
finestra — la vuole visibile. Finestra firma 61–67% antecipata a
**25.5–29.5%**: appena la dissolvenza è finita (24%), il wordmark
depona intero (unico strato, fade + discesa −14px) e resta pieno per
TUTTA la stampa. Al primo istante di stampa (28%) è già su testo
pieno; la foto si ritaglia da sola con la testa. Verificato con CDP
a p .10/.27/.34/.45/.62: scritta piena durante tutti gli strati,
deposito concluso all'apertura della finestra di stampa, nessun
taglio possibile sui glifi.

## Addendum 2026-10-13 h — lo slicing della scritta, senza disallineamenti

Il committente: lo slicing della scritta deve stare (era sparito con
il blocco unico f/g). La radice del difetto d'"e tagliata" era
l'ARRIVO di ogni strata che scivolava da −0.32em: glifi a metà
fuori registro rispetto agli strati già stampati. Ripristinato lo
stack a 40 copie + contenitore confinato alla testa (clip) +
testa sorella, con le correzioni al posto giusto:

- arrivo SENZA traslazione: lo strato si dissolvenza dentro la sua
  banda a registro (sliceTransform none in CDP a tre stadi);
- inchiostro base assente per tutta la stampa (si dissolvenza con la
  foto e torna pieno al rilascio con slide −14px ∝ ghost);
- contenitore di scanalatura e testa come la foto (--pp continuo).

Verifica CDP a pp .07/.56/.97: 40 strati, clip 93→3%, testa 0.57→1,
LAYER 007→078; screenshot: strati visibili nei glifi, niente lettere
mezza disallineate.

## Addendum 2026-10-13 i — inchiostro che sborda dal box

L'inchiostro di Clash Display sborda dal box di layout (il bowl della
"e" di Double sporge a destra; le aste alte di D/b/l superano il top
perché line-height 0.94 nega negligible lo spazio del measurement);
le copie a strati con inset 0 orizzontale lo tagliavano in scena.
Soluzione 2 (committente): padding di respiro sul box (.mark__visual:
padding-top 0.05em, padding-right 0.08em, margin-top −0.05em di
compensazione) e stesse correzioni su .mark__slice (inset 0 non
eredita il padding: glifi copia allineati al base). La testa d'oro ora
arriva fino al bordo del padding così copre anche la "e".

Verifica CDP a pp .72/.97: "e" integra, aste sane, linea larga
quanto il full ink; build ok.

## Addendum 2026-10-13 i — la "e" tagliata (ink overflow)

Causa radice (diagnosi del committente): i clip con `inset(...) 0 0 0`
orizzontale tagliano l'ink overflow dei glifi Clash Display — la pancia
della "e" esce dal box di layout di 2–3px, così la curva sparisce.
Fix (soluzione 1 consigliata): inset laterali negativi.

- `.mark__slicestack`: `inset((1−pp)·100% −0.15em −0.1em −0.15em)`
- `.mark__slice`: lati orizzontali a `−0.15em` (verticale invariato).

Verifica (CDP, computed clips espansi −18.2px a fs 121.6)
screenshot mid-print: "e" di Double e "R" di LayeR intere, texture
strati intatta.

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

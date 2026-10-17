# Intro hero automatica all'arrivo — design

Data: 2026-10-16 · Stato: approvato in sessione con Tancredi

## Problema

La scena "Deposizione" (dissolvenza → piatto → stampa a strati di foto e
scritta → rilascio) era guidata dallo scroll: l'hero era pinnato su uno
stage da 240svh e il progresso derivava da `scrollY`. Conseguenze: le
prime ~1,4 schermate di scroll erano "pedaggio" prima dei contenuti, chi
non scrollava non vedeva mai l'animazione, su mobile era statica, e il
codice portava tutta la macchina a stati del clock-inseguimento (CAP,
latch "solo in discesa", riallineamenti, resize).

## Decisioni

1. **Timeline temporale all'arrivo.** L'intro parte quando si arriva in
   home (prima visita, dal menu, da link esterno). Durata ~2,35s:
   pausa 0,20s · dissolvenza+piatto 0,35s · stampa 1,25s · pausa 0,10s ·
   rilascio 0,45s. Le finestre di progresso della scena restano
   identiche (10–24% dissolvenza, 4–26% bed, 28–60% stampa, 68–90%
   rilascio): estetica invariata, driver diverso.
2. **Skip istantaneo.** Qualsiasi input — rotella, touch, tastiera,
   scroll reale — completa l'intro all'istante. La pagina non è mai
   bloccata: niente pin, lo scroll scende dal primo istante.
3. **Ripetizioni.** L'intro riparte a ogni arrivo in home (scelta
   esplicita); lo skip la rende non invasiva per chi ha fretta.
4. **Mobile <760px inclusa.** Le ragioni storiche dell'esclusione (pin,
   stage allungato con spazio morto, flick) spariscono senza scroll.
   Le regole scene escono dal blocco `≥760px` e vivono solo dentro il
   gate `[data-scene-live]`.
5. **Pagina aperta già scrollata (back/refresh): niente intro.** Il
   listener `scroll` + controllo iniziale su `scrollY` coprono anche il
   ripristino tardivo della posizione. Con bfcache si riprende a riposo.
6. **LCP.** Il primo paint è la pagina intera: lo stato di riposo
   (p=0 e p=1) coincide con i default CSS, poi l'intro dissolve e
   ristampa.
7. **Reduced-motion / no-JS:** statico come oggi (gate
   `data-motion-ok` → `[data-scene-live]`).
8. **Coreografia d'ingresso.** Tagline e CTA salgono al rilascio
   (~1,9s / 2,05s); se l'intro viene interrotta, `[data-scene-skip]`
   li rilascia subito (`animation: none`). L'eco del wordmark resta
   a 0,2s.

## Implementazione

- `website/src/components/HeroScene.astro` — riscritto il clock:
  segmenti lineari p↔tempo (un solo rAF), skip, gate d'apertura.
  Cancellati: stage 240svh, sticky, chase-clock (K/CAP), latch "solo
  in discesa", IntersectionObserver, measure/resize, matchMedia mobile.
  A fine intro l'attributo `data-scene-live` viene rimosso (rilascia
  i layer `will-change`).
- `website/src/styles/global.css` — rimossi `height: 240svh` e sticky;
  regole scene slegate dal blocco `≥760px`; rimosso il kill-switch
  `≤759px`; delay `.anim-rise`/`.anim-rise-late` a 1,9s/2,05s; nuova
  regola `[data-scene-skip]`.

## Verifica

`npm run build` dentro `website/`. Manuali: prima visita (intro
completa), skip a metà con rotella e touch, back da una pagina lavoro
(niente intro, posizione ripristinata), mobile <760px, reduced-motion,
refresh a metà pagina.

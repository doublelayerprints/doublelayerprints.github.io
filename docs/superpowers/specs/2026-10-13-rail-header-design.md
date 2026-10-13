# Rail: i titoli di sezione come header in cima (`testa di colonna`)

Spec di design per lo spostamento dell'indice mobile della rail dal carosello
a 3 slot (centro/sopra/sotto) a una colonna "header": la sezione attiva resta
in cima alla rail — come le scritte LINEUP/PRINCIPLES su getartcraft.com —
i passati escono sopra sfumando, i futuri restano appuntati in fondo.
Data: 2026-10-13. Stato: approvata dall'utente dopo brainstorming (approccio A).

---

## 1. Il problema

`PageRail.astro` mostra i titoli delle sezioni in un carosello a 3 slot lungo
la rail: il titolo attivo sta a **metà** della rail, il precedente sopra l'orlo
superiore, il successivo sotto l'orlo inferiore. L'utente vuole il modello del
sito di riferimento (getartcraft.com/apps):

- il titolo della sezione in cui si sta leggendo è sempre **in alto**,
  come header della pagina;
- al cambio di sezione la colonna dei titoli **scorre**: il nuovo sale dal
  fondo fino in cima, il vecchio passa oltre l'orlo superiore e sfuma.

**Decisioni prese durante il brainstorming:**

| Domanda | Scelta |
|---|---|
| Titolo della sezione appena lasciata | **Rimane e sfuma**: idealmente visibile sopra l'header un attimo, poi scompare |
| Numero di sezione (01, 02, …) | **Mantieni numeri e slash** come ora (`01 / SELECTED WORKS`) |
| Effetto al cambio sezione | **Colonna che scorre** (carosello verticale), come nel riferimento |
| Approccio | **A · Riuso della mappa-slot**: stessa architettura (label assolute nel track, posizioni via JS in `render()`), cambia solo la definizione degli slot |

## 2. I nuovi slot (mappa sostitutiva, funzione `render()`)

Si mantiene l'associazione `d = i - active` (0 = attivo, -1/-2… passati,
+1/+2… futuri) e il meccanismo `top` + `--lo` (opacità). Cambia solo la
geometria degli slot, calcolata da `trackH` e `labelH`:

| d | Slot `top` | Opacità `--lo` | Ruolo |
|---|---|---|---|
| `0` (attivo) | `slotHead = EXIT + STEP`, dove `EXIT = 6px` e `STEP = labelH + 10px` (≈34px con label ~18px) | `1` | **Header** della pagina — un gradino sotto l'orlo del track, così lo slot d'uscita resta **visibile sotto la nav sticky** (la rail parte a `top: 4rem` = orlo nav) |
| `-1` (uscita) | `EXIT = 6px` — gradino appena sotto la nav, sopra l'header | `0.45` | il passato "resta e sfuma": resta visibile finché la sezione non cambia di nuovo |
| `-2, -3…` | `slotExit - (|d| - 1)·STEP` (oltre l'orlo del track: coperto dalla nav, invisibile di fatto) | `0` | coda in uscita |
| `+1` (in arrivo) | `H - labelH - 12px` (appuntato al fondo: sopra il readout percentuale per non sovrapporgli) | `0.38` | prossimo titolo |
| `+2…` | `slotArrive + (d - 1)·STEP` (scende sotto l'orlo del track) | `0.18` il secondo, `0` oltre | futuri in coda sotto |

Il transito: al cambio sezione l'intera colonna trasla con la transizione CSS
già esistente su `top` (`0.5s var(--ease-lay)`) e sull'opacità
(`0.28s ease`) — nessuna transizione nuova da scrivere.

## 3. Modifiche al codice (`PageRail.astro` soltanto)

1. **Slot-map in `render()`**: rimpiazzare `slotMid/slotTop/slotBot` con
   `slotHead`, `slotExit`, `slotArrive` come da §2 (STEP = labelH + 10px).
   La direzione `dir` esiste già e non serve al calcolo geometrico: la
   colonna è unica e scorre nella stessa direzione per tutti.
2. **Hover ("hot")**: invariato il meccanismo (`mouseenter`/`focusin` →
   `data-hot` → opacità piena); la posizione non cambia — la label "hot"
   resta nel suo slot e diventa solo leggibile a piena opacità.
3. **Primo paint**: al primo `render()` disattivare la transizione di `top`
   (attributo `data-instant` sulle `.rail__label`, rimosso dopo una rAF)
   per evitare lo scatto iniziale dal valore CSS di default (`top: 0`).
4. **No-JS**: le etichette restano nascoste (`opacity: var(--lo, 0)`,
   default 0) come oggi — degradazione graziosa invariata.
5. **Invariati**: segmenti/tick/testa d'oro, percentuale e "PRINT COMPLETE",
   `measure()` e la ricalibrazione (load/fonti/ResizeObserver).

## 4. Dettagli visivi (stato attivo)

- Attivo: numero in viola (`--purple-text`) e nome a pieno colore (`--ink`)
  — regole `[data-active]` già esistenti, nessuna modifica;
- lo stile `.rail__label` non cambia: stessa tipografia mono, stesso gap;
- il titolo attivo sta in cima alla rail, un gradino sotto la nav sticky
  (la rail comincia a `top: 4rem`, che coincide con l'orlo della nav;
  l'header si ferma a `EXIT + STEP` ≈ 34px — lo spazio tra i due è
  riservato al titolo precedente in uscita).

## 5. Fuori scope

Temi, i18n, altre componenti della rail (segmenti, testa, status), layout
delle pagine, `global.css`.

## 6. Verifica

1. `npm run build` dentro `website/` (vincolo di `AGENTS.md`);
2. `npm run dev` + scorrimento manuale su home e /lavori (rail con più
   sezioni): verificare che il titolo attivo resti in cima, il passato
   esca sopra sfumando, il futuro sia appuntato in fondo;
3. Hover sui segmenti (etichette "hot") e resize della finestra
   (ricalibrazione).

# Tema persistente, accenti viola nel chiaro, stampa solo in discesa

Data: 2026-10-14 · Stato: approvato dall'utente (design)

## 1. Tema che ritorna indietro navigando

**Sintomo riprodotto (Chrome headless):** su Home tema → chiaro (salvato in
`localStorage['dl-theme']'), navigando su `/lavori/` il tema torna scuro
nonostante lo storage; body dipinto `#191322`.

**Causa:** il tema chiaro è rappresentato dall'assenza di `data-theme` su
`<html>` (Base.astro setta l'attributo solo per il tema scuro). Lo script di
stato in `Nav.astro` (currentTheme) rilegge l'attributo ad ogni caricamento:
se assente, cade sul tema di sistema → scuro.

**Fix:** lo script no-flash in `Base.astro` setta sempre l'attributo in modo
esplicito (`data-theme="light"` oppure `"dark"`). Il copione di Nav rilegge
così sempre la scelta salvata.

## 2. Accenti gialli → viola nel tema chiaro

Token `--print-accent`: `var(--purple)` nel tema chiaro (default), `var(--gold)`
nel tema scuro (override `:root[data-theme='dark']`). Fonte: global.css.

Applicato a (elementi "macchina" dell'animazione):
- `.gcode .gl.exec` — highlight della riga G-code in esecuzione
- `.print-head` — testa di stampa sulla foto (global.css)
- `.mark__print-head` — testa di stampa sulla scritta (Wordmark.astro)

Restano dorate anche nel chiaro, per coerenza (approvato): `.scene-bed` (linea
del bed sopra la foto) e `.scene-count` (contatore LAYER, testo oro su chip
sempre scuro).

## 3. Stampa solo scendendo

In `HeroScene.astro` il progresso resta legato allo scroll in discesa; in
risalita la scena si fissa istantaneamente allo stato di riposo (p = 1:
foto e scritta piene, fasce e ghost assenti), senza animare all'indietro.
Al ritorno in discesa il progresso si riallinea al punto di scroll corrente
prima di inseguire in avanti (niente scatto di stato né rimonta dal fondo).

Dettagli: la direzione si legge dalla differenza del scrollY tra eventi; il
latch "riposo" sopravvive a resize/load/fonts (snap) e si disattiva appena
si riprende a scendere (cur = target).

## Verifica

- `npm run build` in website/
- Test CDP headless: toggle tema → navigazione → tema resta; calcolo colore
  `--print-accent` nei due temi; risalita → foto piena e fasce invisibili.

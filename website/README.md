# Double LayeR Prints — sito

Sito statico in [Astro](https://astro.build), bilingue IT/EN, deployato su GitHub Pages:
**https://doublelayerprints.github.io**

## Comandi

```bash
npm install        # una volta sola
npm run dev        # dev server → http://localhost:4321/
npm run build      # build di produzione in dist/
npm run preview    # prova la build
npm run placeholders  # rigenera le immagini placeholder dei pezzi
```

## Aggiungere un pezzo alla galleria

1. Metti le foto in `public/images/works/` (consigliato: 2–3 per pezzo, le prime in formato 4:3).
2. Crea due file in `src/content/works/`:
   - `mio-pezzo.it.md` (versione italiana)
   - `mio-pezzo.en.md` (versione inglese)
   con lo stesso nome base. Frontmatter di riferimento (copia da un file esistente):
   `title, category (figures|home|tools|art), materials, dimensions, layerHeight, weight, printTime, photos[], alt, featured, order`.
3. `featured: true` lo fa apparire tra i "Lavori selezionati" in home. `order` decide l'ordine in galleria.
4. Riferimenti al pezzo: `lavori/mio-pezzo` in italiano, `en/works/mio-pezzo` in inglese.

## Dove si cambia cosa

| Cosa | File |
|---|---|
| Instagram, email, numero WhatsApp | `src/consts.ts` |
| Testi dell'interfaccia (IT/EN) | `src/i18n/ui.ts` |
| Storia "Chi siamo" | `src/components/pages/AboutPage.astro` |
| Colori, font, spaziature | `src/styles/global.css` (sezione Token) |
| Stampanti | `src/consts.ts` (`PRINTERS`) |

I contatti attuali (handle Instagram, email, numero WhatsApp) sono **placeholder**: sostituirli in `src/consts.ts`.

## Foto vere

**Dove vanno le immagini:** tutto in `public/images/` (i file lì sono serviti così come sono).

- **Foto dei pezzi (portfolio):** meta in `public/images/works/`, referenziate nei
  frontmatter dei `.md` in `src/content/works/` (vedi "Aggiungere un pezzo" sopra).
- **Immagini generiche (hero, chi-siamo, ecc.):** in `public/images/`, usate nei
  componenti con `asset('images/file.jpg')` (es. `src/components/pages/HomePage.astro`).

Le immagini dei pezzi sono attualmente placeholder SVG generati (`npm run placeholders`).
Quando arrivate le foto custom, basta salvarle in `public/images/works/` con lo stesso
nome del file referenziato nei `.md` (es. `dragon-bust-1.jpg`) e aggiornare i path
nei frontmatter: un solo file per foto basta (le varianti `-dark` servivano solo
ai placeholder SVG per i due temi). La foto del laboratorio: `public/images/studio.jpg` è
l'originale full-res, `public/images/studio-16.jpg` (1600px) è la versione
compressa usata dal sito (rigenerabile con
`sips -Z 1600 -s format jpeg -s formatOptions 72`): quando aggiorni la foto,
aggiorna **entrambi** i file.

## Font

Self-hosted in `public/fonts/` (Clash Display e Satoshi da Fontshare, Space Mono da
Google Fonts). Se cambi `base` in `astro.config.mjs`, aggiorna anche i path
`/fonts/...` in `src/styles/global.css` (i preload in `src/layouts/Base.astro`
derivano automaticamente da `BASE_URL`).

## Deploy

Su ogni push su `main`, GitHub Actions builda e pubblica (`.github/workflows/deploy.yml`
nella root del repo). La prima volta: nelle impostazioni del repo → Pages → Source =
"GitHub Actions".

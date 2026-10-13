# DoubleLayeRPrints

Portfolio di stampa 3D di Tancredi e Rachele. Il sito vero sta in `website/`.

## Comandi

```bash
cd website
npm install
npm run dev      # http://localhost:4321/
npm run build    # verifica build
```

## Stack

- Astro 5 statico, zero framework JS
- i18n: IT alla root, EN sotto `/en/`
- Deploy: GitHub Pages (sito-org, https://doublelayerprints.github.io) via `.github/workflows/deploy.yml` (base `/`)
- Font self-hosted in `website/public/fonts/`

Prima di dichiarare completo un lavoro sul sito: `npm run build` dentro `website/`.

## Immagini

- Tutto in `website/public/images/`: `works/` per le foto dei pezzi (referenziate
  nei frontmatter dei `.md` in `website/src/content/works/`), il resto per
  immagini generiche (usate con `asset('images/...')` nei componenti).
-   Dettagli in `website/README.md` (sezioni "Aggiungere un pezzo" e "Foto vere").

## Git

- **Vietato fare commit e push se non richiesti esplicitamente dall'utente.**
- Aggiornare solo file in locale; l'utente decide quando e se portare le modifiche su GitHub (nuova repo: `doublelayerprints/doublelayerprints.github.io`).

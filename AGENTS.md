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

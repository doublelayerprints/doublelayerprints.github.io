import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: https://tancredibosi.github.io/doublelayer
export default defineConfig({
  site: 'https://tancredibosi.github.io',
  base: '/doublelayer',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

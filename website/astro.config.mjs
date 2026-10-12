import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages org-site: https://doublelayerprints.github.io
export default defineConfig({
  site: 'https://doublelayerprints.github.io',
  base: '/',
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

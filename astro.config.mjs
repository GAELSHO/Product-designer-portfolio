// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://gaelsho.github.io/Product-designer-portfolio/
  site: 'https://gaelsho.github.io',
  base: '/Product-designer-portfolio',
  trailingSlash: 'ignore',
  // React solo para las islas .tsx (el dock). El resto del sitio sigue en .astro.
  integrations: [react()],
  build: {
    // Emit `about/index.html` instead of `about.html` so URLs work with or
    // without a trailing slash on GitHub Pages' static file server.
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

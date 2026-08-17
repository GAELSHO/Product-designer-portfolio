// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://gaelsho.github.io/Product-designer-portfolio/
  site: 'https://gaelsho.github.io',
  base: '/Product-designer-portfolio',
  trailingSlash: 'ignore',
  // React solo para las islas .tsx (el dock). El resto del sitio sigue en .astro.
  // MDX solo para poder usar <Board> dentro del case study; el resto del
  // markdown se escribe igual que antes.
  integrations: [react(), mdx()],
  image: {
    // Sin esto, una imagen del case study se sirve en un solo tamaño: el móvil
    // se descargaba el archivo de 2208px para pintarlo a 358px. Con `layout`
    // Astro genera el `srcset` y cada pantalla baja el ancho que le toca.
    layout: 'constrained',
    responsiveStyles: true,
  },
  build: {
    // Emit `about/index.html` instead of `about.html` so URLs work with or
    // without a trailing slash on GitHub Pages' static file server.
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

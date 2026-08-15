# CLAUDE.md

Portfolio de product designer. Sitio estático con **Astro 7** + **Tailwind CSS v4**, publicado en
GitHub Pages desde el repo `GAELSHO/Product-designer-portfolio`.

## Comandos

| Comando          | Qué hace                                              |
| ---------------- | ----------------------------------------------------- |
| `npm install`    | Instala dependencias                                   |
| `npm run dev`    | Dev server: `http://localhost:4321/Product-designer-portfolio/` |
| `npm run build`  | Build de producción a `dist/`                          |
| `npm run preview`| Sirve `dist/` localmente para verificar el build       |
| `npm run check`  | Type-check de `.astro` y `.ts` (`astro check`)         |

Antes de dar por terminado un cambio: `npm run build`. Es lo mismo que corre CI, y falla ahí por
las mismas razones.

## Estructura

```
src/
  pages/      Rutas basadas en archivos: src/pages/about.astro -> /about
  layouts/    Envoltorios de página (BaseLayout.astro: <head>, nav, footer)
  components/ Componentes .astro reutilizables
  lib/        Helpers TS (url.ts)
  styles/     global.css: import de Tailwind + tokens @theme
public/       Assets servidos tal cual (favicon, imágenes, PDFs)
```

Alias de imports: `@/*` apunta a `src/*` (definido en `tsconfig.json`). Usa `@/layouts/...` en vez
de rutas relativas con `../../`.

## GitHub Pages: `base` es la regla que más se rompe

El sitio vive en un subdirectorio: `https://gaelsho.github.io/Product-designer-portfolio/`. Por eso
`astro.config.mjs` define `site` + `base`, y **Astro no reescribe los `href`/`src` que escribes a
mano**. Un `<a href="/work">` apunta a la raíz del dominio, fuera del sitio: da 404 en producción y
también en dev, porque el dev server respeta `base`.

- Todo enlace interno y toda referencia a `public/` pasa por `withBase()` de `@/lib/url`:
  ```astro
  ---
  import { withBase } from '@/lib/url';
  ---
  <a href={withBase('/about')}>Sobre mí</a>
  <img src={withBase('/hero.jpg')} alt="" />
  ```
- Lo que Astro **sí** resuelve solo, y no debe pasar por `withBase()`: imports de assets en
  `src/` (`import hero from '@/assets/hero.jpg'` + `<Image>`), el CSS que genera el bundler, y
  `Astro.url` / `new URL(..., Astro.site)`.
- Los enlaces externos y `mailto:` van tal cual.

Si cambia el nombre del repo, se actualiza `base` en `astro.config.mjs` y nada más.

## Convenciones

**Estilos.** Tailwind v4 se configura en CSS, no en JS — no hay `tailwind.config.js`. Los tokens
(colores, fuentes) se declaran en el bloque `@theme` de `src/styles/global.css` y Tailwind genera
las utilidades: `--color-ink-600` habilita `text-ink-600`, `bg-ink-600`, `border-ink-600`.

- Usa los tokens `ink-*` / `accent-*`; evita colores arbitrarios tipo `text-[#333]`.
- Utilidades en el markup. `@apply` solo en `global.css` para estilos base (`body`, `:focus-visible`).
- Mobile-first: escribe el caso móvil y añade `sm:` / `lg:` hacia arriba.

**Componentes.** `.astro` por defecto — el sitio es estático y no necesita JS de cliente. Si algún
día hace falta interactividad, se añade el framework y se marca la isla con `client:*`, nunca
hidratando la página entera.

**Contenido.** Los case studies largos van como colecciones de contenido (`src/content/`) con
schema en Zod, no como `.astro` sueltos con el texto incrustado.

**Accesibilidad y SEO.** Cada página se renderiza con `BaseLayout` y pasa `title` (y `description`
cuando aporta algo distinto al genérico). Un solo `<h1>` por página, jerarquía de headings sin
saltos, `alt` en todas las imágenes con contenido y `alt=""` en las decorativas.

**Idioma.** El sitio está en español (`<html lang="es">`); mantén copy y nombres de rutas en
español y consistentes.

## Deploy

`.github/workflows/deploy.yml` hace build y deploy en cada push a `main` (y a mano con
`workflow_dispatch`). Usa `actions/upload-pages-artifact` + `actions/deploy-pages`, sin rama
`gh-pages`.

Requisito de una sola vez en GitHub: **Settings → Pages → Build and deployment → Source:
"GitHub Actions"**. Sin eso el workflow falla en el paso de deploy.

`dist/` no se commitea.

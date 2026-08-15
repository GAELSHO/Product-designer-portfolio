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

## Git: se trabaja directo en `main`

Nada de ramas de feature ni pull requests salvo que se pidan explícitamente: commit y push a `main`.

Ojo con lo que eso implica: **cada push a `main` publica el sitio**. `.github/workflows/deploy.yml`
dispara en ese push, así que el commit que subes es el que queda en producción. Corre
`npm run build` antes de pushear — no hay revisión intermedia que atrape un build roto.

## Estructura

```
src/
  pages/      Rutas basadas en archivos: src/pages/about.astro -> /about
              proyectos/[slug].astro genera una página por proyecto
  layouts/    Envoltorios de página (BaseLayout.astro: <head>, dock, footer)
  components/ Componentes .astro reutilizables
  data/       proyectos.js: fuente única de los proyectos
  lib/        Helpers TS (url.ts)
  styles/     global.css: import de Tailwind + tokens @theme
public/       Assets servidos tal cual (favicon, portadas, PDFs)
  proyectos/  Portadas de las cards. Hoy son SVG placeholder: al sustituirlas
              por las imágenes reales, actualiza `portada` en data/proyectos.js
```

Para añadir un proyecto basta con un objeto más en `src/data/proyectos.js`: la home y la ruta
`/proyectos/[slug]` salen de ahí. El primero del array se pinta a ancho completo y el resto en el
grid de dos columnas.

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

- Fondo blanco y texto negro. Usa los tokens `ink-*` para grises; evita colores arbitrarios tipo
  `text-[#333]`.
- Tipografía: **solo Poppins** (se carga desde Google Fonts en `BaseLayout`). Los pesos en uso son
  300 / 400 / 600 / 700; si necesitas otro, añádelo a la URL de la fuente o no cargará.
- Utilidades en el markup. `@apply` solo en `global.css` para estilos base (`body`, `:focus-visible`).
- Mobile-first: escribe el caso móvil y añade `sm:` / `lg:` hacia arriba.

**Hover no es universal.** Un `hover:` que esconde contenido lo deja inalcanzable en móvil, donde
no hay puntero. Por eso `global.css` define la variante `hover-device`
(`@media (hover: hover) and (pointer: fine)`): el estado por defecto es el visible, y el hover solo
lo esconde donde existe ratón.

```astro
<!-- Visible siempre en táctil; en desktop aparece al hacer hover -->
<div class="opacity-100 hover-device:opacity-0 hover-device:group-hover:opacity-100">
```

Empareja siempre `group-hover:` con `group-focus-visible:` para que el teclado llegue al mismo
estado que el ratón.

**Componentes.** `.astro` por defecto — el sitio es estático y casi no necesita JS de cliente. Si
algún día hace falta interactividad de verdad, se añade el framework y se marca la isla con
`client:*`, nunca hidratando la página entera.

**Contenido que se anima ≠ contenido que no existe.** El título rotativo (`TituloRotativo.astro`)
es el patrón a seguir: el HTML servido ya trae el texto completo (una versión plana en `sr-only`
para buscadores y lectores de pantalla, más las tres palabras con la primera activa por CSS). El
script solo va alternando un `data-activa`. Sin JS el título se ve entero y quieto; nada depende de
que el script llegue a ejecutarse. Si añades algo animado, hazlo así y respeta
`prefers-reduced-motion`.

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

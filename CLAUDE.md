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
              work/[slug].astro genera una página por proyecto
  layouts/    Envoltorios de página (BaseLayout.astro: <head>, dock, footer)
  components/ Componentes reutilizables (.astro; .tsx solo para islas)
    unlumen-ui/ Dock de unlumen.com — código vendorizado
    vendor/     Otros componentes de terceros pegados tal cual (DiaTextReveal)
  content/    work/<slug>/: un proyecto = una carpeta (index.md + sus imágenes)
  content.config.ts  Esquema Zod de la colección `work`
  lib/        Helpers TS (url.ts, utils.ts)
  styles/     global.css: import de Tailwind + tokens @theme
public/       Assets servidos tal cual (favicon, portadas, PDFs)
  proyectos/  Portadas de las cards, dos recortes por proyecto (ver abajo).
              Hoy son SVG placeholder
```

**Portadas: dos recortes, no uno escalado.** La card es 4:5 en móvil y 16:9 en desktop, y la
imagen se pinta con `object-cover`, que recorta para llenar. Con una sola fuente, el breakpoint
que no coincide se queda viendo el **45% central** de la pieza —da igual cuál de las dos subas—.
Por eso `TarjetaProyecto.astro` usa `<picture>` con un `<source media="(min-width: 40rem)">`:
cada dispositivo descarga solo su recorte, nunca los dos.

Convención de archivos en `public/proyectos/`:

| Archivo | Recorte | Tamaño | Campo en el frontmatter |
| ------- | ------- | ------ | ----------------------- |
| `<slug>.webp`       | 16:9 (desktop) | ~2208×1242 | `portada` |
| `<slug>-movil.webp` | 4:5 (móvil)    | ~1200×1500 | `portadaMovil` |

`portadaMovil` es opcional: si falta, se usa la de desktop en los dos tamaños (y se pierde ese 55%
en móvil). Los tamaños salen de multiplicar el ancho real de la card por la densidad de pantalla:
1104px de card en desktop a 2x, y 398px a 3x en móvil. Exporta en WebP; el `<picture>` sirve el
archivo tal cual, sin optimizar, porque vive en `public/`.

Si cambias las proporciones en `proporcion` (dentro de `TarjetaProyecto.astro`), la media query
`40rem` tiene que moverse con ellas — es el `sm:` de Tailwind.

**Un proyecto es una carpeta.** `src/content/work/<slug>/` con un `index.md` dentro y sus imágenes
al lado. El nombre de la carpeta es el slug de la URL (`/work/ampia`). El frontmatter es la ficha
—lo que pinta la card de la home— y el cuerpo del markdown es el case study; el esquema está en
`src/content.config.ts` y el build falla si falta un campo. Añadir un proyecto es copiar la carpeta
de `ampia/`, cambiar el `.md` y sustituir las imágenes: no hay que registrarlo en ningún índice.

`orden` decide la posición en la home. Todas las cards se apilan en una sola columna, también en
desktop; la proporción es 4:5 en móvil (para que la card llene pantalla) y 16:9 de `sm:` en
adelante, donde a ancho completo una 4:5 mediría más de 1300px de alto.

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

- Fondo `#191919` y texto `#F4F2EB` (un crema, no blanco puro). Usa los tokens `ink-*` para los
  grises; evita colores arbitrarios tipo `text-[#333]`. En la escala `ink-*` el número **no** es
  "qué tan claro" sino cuánto contrasta con el fondo: `ink-50` apenas se despega del fondo,
  `ink-950` es el color del texto. Escrito así, cambiar el tema es tocar seis valores en `@theme`
  y nada más — y por eso `body` usa `bg-background`, no `bg-black`.
- Cuidado con las sombras: sobre fondo negro casi no se ven. Para separar algo del fondo se usa
  geometría (tamaño, espaciado) o un borde claro, no `shadow-*`. La excepción medida: como el fondo
  es `#191919` y no negro puro, una sombra con mucha alfa y mucho radio sí se percibe — las cards de
  servicios la usan en hover, acompañada de un `translateY` que es lo que realmente vende la
  elevación.
- Tipografía: **solo Poppins** (se carga desde Google Fonts en `BaseLayout`). Los pesos en uso son
  300 / 400 / 500 / 600; si necesitas otro, añádelo a la URL de la fuente o no cargará —
  `font-medium` estuvo un tiempo pidiendo un 500 que no se descargaba y el navegador lo sustituía
  por su cuenta. El título va en 600 (`Gael SHO |`) y 300 (el resto).
- El `<h1>` usa `text-[clamp(...)]` en vez de saltos por breakpoint: tiene que caber en una línea
  desde 320px, y con un `text-4xl` fijo se partía en dos en móvil.
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

**Componentes.** `.astro` por defecto — el sitio es estático y casi no necesita JS de cliente. React
está instalado, pero **solo para islas**: hoy son dos, el dock y la palabra que rota en el título.
Nada de convertir páginas a `.tsx` porque sí; si un componente no necesita estado ni eventos, va en
`.astro` y pesa cero.

Cada isla nueva arrastra su coste: el runtime de React ya son ~60KB gzip y `motion` otros ~48KB,
compartidos entre todas. Antes de añadir una tercera, comprueba que el efecto no salga en CSS.

**El dock es una isla React.** `src/components/unlumen-ui/dock.tsx` es el componente de
[unlumen.com](https://unlumen.com) traído con `npx shadcn@latest add @unlumen-ui/dock`; usa
`motion/react` para la magnificación. Alrededor hay tres piezas:

- `src/components/DockNav.tsx` declara los items. Es el archivo que se toca para añadir o quitar
  entradas del menú.
- `src/components/Dock.astro` lo posiciona y lo envuelve en `<nav>` (el componente renderiza un
  `div` y no aporta esa semántica). Se hidrata con `client:idle`, no `client:load`: Astro deja los
  `<a>` en el HTML estático, así que la navegación funciona sin JS y la animación llega después.
- `@/lib/utils` exporta `cn()` (clsx + tailwind-merge), que es lo que importan los componentes de
  shadcn.

Dos cosas que muerden si tocas esto:

- El componente asume los tokens de shadcn (`bg-background`, `text-foreground`). Están declarados
  como alias en el `@theme` de `global.css`; si los borras, el dock se queda sin colores.
- **`dock.tsx` está modificado respecto al original.** Son dos props añadidas, ambas aditivas: con
  los valores por defecto el componente se comporta exactamente como el de unlumen. Si algún día lo
  actualizas desde el registro, estos cambios se pierden y hay que volver a aplicarlos.

  - `variant` (`"icons"` | `"text"`, default `"icons"`). El original pinta iconos en items
    cuadrados que crecen en ancho y alto. Nosotros usamos `"text"`: se pinta el `label` y lo que se
    magnifica es el cuerpo de letra, que al crecer empuja a los vecinos igual que los iconos. El
    dock no cambia de alto y no dibuja tooltip, porque el nombre ya está a la vista. `fontSize`
    (default 14) es el tamaño base de ese texto.
  - `tooltipPlacement` (`"top"` | `"bottom"`, default `"top"`). Hoy no se usa —en modo texto no hay
    tooltip— pero hace falta si se vuelve a `"icons"`: el original ancla el tooltip arriba, que es
    correcto para un dock tipo macOS pegado abajo, y con el nuestro fijo en el top se salía de la
    pantalla.

  La magnificación baja de 1.8 a 1.45 en `DockNav`: sobre texto, 1.8 se ve desproporcionado.

Bajar más componentes de shadcn necesita salida a `ui.shadcn.com` y `unlumen.com`, que la política
de red del entorno remoto bloquea. Desde una máquina local funciona normal.

**Contenido que se anima ≠ contenido que no existe.** El HTML servido tiene que traer el contenido
aunque el JS no llegue nunca. El título (`TituloRotativo.astro`) es el patrón: una versión plana en
`sr-only` para buscadores y lectores de pantalla, y la parte visual con `aria-hidden` donde Astro
pre-renderiza la primera palabra.

La palabra que rota es la segunda isla: `TituloSweep.tsx` envuelve `DiaTextReveal`
(`components/vendor/`), que hace a la vez el barrido de color y el cambio de palabra. Dos trampas
de ese componente, ya resueltas, que conviene conocer antes de tocarlo:

- Pinta el texto con `color: transparent` y lo revela con un degradado. **Sin JS la palabra sería
  invisible**, así que `TituloRotativo.astro` lleva un `<noscript>` que la devuelve a blanco sólido.
  Cualquier componente que revele texto con `background-clip` necesita ese mismo respaldo.
- Su `textColor` por defecto es `var(--foreground)`, y Tailwind v4 genera `--color-foreground`, no
  `--foreground`. Por eso `global.css` declara los dos alias en `:root`; si los borras, el texto
  termina el barrido en un color inválido y se queda transparente.

**No uses `fixedWidth` aquí.** Reserva el ancho de la palabra más larga, así que las cortas quedan
centradas dentro de esa caja con aire sobrando a los lados: "WEB Designer" se separaba mucho más
que "UX/UI Designer". Sin esa prop el ancho sigue a cada palabra y la distancia con "Designer" es
la misma siempre (el hueco lo pone el `gap-x` del contenedor); a cambio la línea se re-centra, pero
el componente lo anima en 0.4s.

Eso hace que el ancho lo mida JS, y las medidas dependen de la tipografía: si se miden antes de que
cargue Poppins salen con la fuente de sistema y las palabras se recortan (hay `overflow: hidden`).
Por eso el componente lleva un re-medido en `document.fonts.ready` — es otra modificación respecto
al original.

La cadencia son `duration` + `repeatDelay` (1.5s + 1s = una palabra cada 2.5s).

`prefers-reduced-motion` lo respeta el propio componente: deja el texto sólido y no rota.

**Imágenes: `public/` vs `src/`, y por qué importa.** Las dos portadas de la card viven en
`public/proyectos/` y se sirven tal cual, sin tocar. **Las imágenes del case study van dentro de
`src/content/work/<slug>/`**, referenciadas en relativo desde el `.md` (`![alt](./01-charger.webp)`).
Ahí Astro sí las procesa: genera los anchos del `srcset`, comprime y les pone hash de caché. La
diferencia se mide — en AMPIA el móvil descarga 225KB en vez de 477KB. Además, si escribes mal una
ruta el build falla, en vez de dejar un 404 silencioso como haría `public/`.

Eso depende de `image.layout: 'constrained'` en `astro.config.mjs`. Sin esa línea Astro emite un
solo tamaño por imagen y el teléfono se baja el archivo de 2208px para pintarlo a 358px.

Exporta a **2208px de ancho** (el ancho real de la columna en desktop, ×2 por retina) y en WebP.
La regla general: el archivo tiene que medir el doble del ancho en que se va a ver; Astro reduce,
pero nunca amplía.

**Cada pieza del case study va con `<Board>`** (`src/components/Board.astro`), no con un
`![alt](./x.webp)`: el markdown solo puede apuntar a un archivo y `<Board>` emite un `<picture>`
con dos. Por eso los `.md` de proyecto son en realidad `.mdx` — es lo único que necesita MDX aquí.

```mdx
import b01 from './01-movil.webp';

<Board movil={b01} alt="…" />
```

Las dos props son opcionales, pero hace falta al menos una:

| Props | Cuándo | Qué hace |
| ----- | ------ | -------- |
| `desktop` sola | Renders y mockups sin texto dentro | Una sola fuente a todos los tamaños; al reducirse solo se ve más pequeña |
| las dos | Boards con texto compuesto | `<picture>`: cada pantalla descarga **solo su recorte**, nunca los dos |
| `movil` sola | Board compuesto a proporción de teléfono | En desktop se limita a `32rem` centrado, o mediría más de 1800px de alto |

**Los boards van a sangre y pegados entre sí**: son composiciones continuas, así que no llevan
margen, ni radio, ni hueco entre ellos. El ancho completo se consigue con
`margin-inline: calc(50% - 50vw)`, que los saca del padding lateral de `<main>`.

**El `alt` de un board no es decorativo.** Estos boards llevan el texto dentro, así que el `alt` es
lo único que pueden leer Google y un lector de pantalla: escríbelo con el copy real de la pieza, no
con "board de tipografías". Si cambias el texto de un board, cambia también su `alt`.

**Si un board se ve borroso o su texto no se lee, la salida es sacar ese texto de la imagen** y
escribirlo en el `.mdx` como texto normal: se reordena solo, se lee igual a cualquier ancho, se
puede seleccionar y Google lo indexa. Los estilos de párrafos y encabezados ya están puestos por si
hace falta; la columna de lectura se queda en `62ch` aunque los boards vayan a ancho completo.

Los estilos del cuerpo están en el `<style>` de `src/pages/work/[slug].astro`, no en el markdown:
el `.mdx` solo debería tener contenido.

**Accesibilidad y SEO.** Cada página se renderiza con `BaseLayout` y pasa `title` (y `description`
cuando aporta algo distinto al genérico). Un solo `<h1>` por página, jerarquía de headings sin
saltos, `alt` en todas las imágenes con contenido y `alt=""` en las decorativas.

**Idioma.** El sitio está en inglés (`<html lang="en">`): todo lo que ve el visitante va en inglés
—copy, `alt`, `aria-label`, títulos de proyecto y nombres de ruta (`/work/[slug]`, `#about`)—.
El código no: nombres de archivo, variables y comentarios siguen en español, que es el idioma en
el que se trabaja el repo. La frontera es "¿esto se renderiza?": si sí, inglés.

## Deploy

`.github/workflows/deploy.yml` hace build y deploy en cada push a `main` (y a mano con
`workflow_dispatch`). Usa `actions/upload-pages-artifact` + `actions/deploy-pages`, sin rama
`gh-pages`.

Requisito de una sola vez en GitHub: **Settings → Pages → Build and deployment → Source:
"GitHub Actions"**. Sin eso el workflow falla en el paso de deploy.

`dist/` no se commitea.

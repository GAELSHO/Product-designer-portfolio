import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Un proyecto = una carpeta en `src/content/work/<slug>/` con su `index.md` y
 * sus imágenes al lado. El frontmatter es la ficha (lo que pinta la card de la
 * home) y el cuerpo del markdown es el case study.
 *
 * Fuente única: antes esto vivía en `src/data/proyectos.js` y el case study
 * habría ido aparte, lo que obligaba a mantener título y tags en dos sitios.
 */
const work = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/work',
    // El id es el nombre de la carpeta, que es el slug de la URL:
    // `ampia/index.md` -> `ampia` -> /work/ampia
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    tags: z.array(z.string()),
    /** Orden en la home; menor sale antes. */
    orden: z.number(),
    /** Recorte 16:9 (desktop), ~2208x1242. Ruta dentro de public/. */
    portada: z.string(),
    /** Recorte 4:5 (móvil), ~1200x1500. Si falta se usa `portada`. */
    portadaMovil: z.string().optional(),
    portadaAlt: z.string(),
    /** Ficha lateral del case study. */
    rol: z.string().optional(),
    anio: z.string().optional(),
  }),
});

export const collections = { work };

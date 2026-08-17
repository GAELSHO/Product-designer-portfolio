/**
 * Fuente única de los proyectos del portafolio.
 * Se listan en una sola columna, en este orden, tanto en móvil como en desktop.
 *
 * Ojo: todo lo que se pinta en pantalla va en inglés — el sitio está en inglés,
 * aunque el código y los comentarios estén en español.
 *
 * Sobre las portadas: son dos recortes distintos de la misma pieza, no la misma
 * imagen escalada. La card es 16:9 en desktop y 4:5 en móvil, así que una sola
 * fuente perdería el 55% de la pieza en el breakpoint que no coincide.
 *
 * @typedef {Object} Proyecto
 * @property {string} slug         Segmento de URL: /work/{slug}
 * @property {string} titulo       Nombre del proyecto
 * @property {string} descripcion  Descripción corta, una línea sobre la card
 * @property {string[]} tags       Disciplinas, se pintan como píldoras
 * @property {string} portada      Recorte 16:9 (desktop), ~2208x1242. Ruta en public/
 * @property {string} [portadaMovil] Recorte 4:5 (móvil), ~1200x1500. Si falta se usa `portada`
 * @property {string} portadaAlt   Texto alternativo, vale para los dos recortes
 */

/** @type {Proyecto[]} */
export const proyectos = [
  {
    slug: 'ampia',
    titulo: 'AMPIA',
    descripcion: 'Branding and UX design for a network of EV charging stations',
    tags: ['Branding', 'UX/UI', 'Advertising'],
    portada: '/proyectos/ampia.svg',
    portadaMovil: '/proyectos/ampia-movil.svg',
    portadaAlt: 'AMPIA charger installed under a solar canopy in a parking lot',
  },
  {
    slug: 'project-two',
    titulo: 'Project two',
    descripcion: 'Short one-line description of the project',
    tags: ['Branding', 'UX/UI'],
    portada: '/proyectos/placeholder-2.svg',
    portadaMovil: '/proyectos/placeholder-2-movil.svg',
    portadaAlt: 'Cover pending for project two',
  },
  {
    slug: 'project-three',
    titulo: 'Project three',
    descripcion: 'Short one-line description of the project',
    tags: ['Branding', 'Web'],
    portada: '/proyectos/placeholder-3.svg',
    portadaMovil: '/proyectos/placeholder-3-movil.svg',
    portadaAlt: 'Cover pending for project three',
  },
  {
    slug: 'project-four',
    titulo: 'Project four',
    descripcion: 'Short one-line description of the project',
    tags: ['UX/UI', 'Advertising'],
    portada: '/proyectos/placeholder-4.svg',
    portadaMovil: '/proyectos/placeholder-4-movil.svg',
    portadaAlt: 'Cover pending for project four',
  },
];

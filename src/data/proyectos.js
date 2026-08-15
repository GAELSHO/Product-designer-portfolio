/**
 * Fuente única de los proyectos del portafolio.
 * El primero se renderiza como card a ancho completo; el resto va al grid de 2 columnas.
 *
 * Ojo: todo lo que se pinta en pantalla va en inglés — el sitio está en inglés,
 * aunque el código y los comentarios estén en español.
 *
 * @typedef {Object} Proyecto
 * @property {string} slug        Segmento de URL: /work/{slug}
 * @property {string} titulo      Nombre del proyecto
 * @property {string} descripcion Descripción corta, una línea sobre la card
 * @property {string[]} tags      Disciplinas, se pintan como píldoras
 * @property {string} portada     Ruta dentro de public/ (pasa por withBase() al usarse)
 * @property {string} portadaAlt  Texto alternativo de la imagen de portada
 */

/** @type {Proyecto[]} */
export const proyectos = [
  {
    slug: 'ampia',
    titulo: 'AMPIA',
    descripcion: 'Branding and UX design for a network of EV charging stations',
    tags: ['Branding', 'UX/UI', 'Advertising'],
    portada: '/proyectos/ampia.svg',
    portadaAlt: 'AMPIA charger installed under a solar canopy in a parking lot',
  },
  {
    slug: 'project-two',
    titulo: 'Project two',
    descripcion: 'Short one-line description of the project',
    tags: ['Branding', 'UX/UI'],
    portada: '/proyectos/placeholder-2.svg',
    portadaAlt: 'Cover pending for project two',
  },
  {
    slug: 'project-three',
    titulo: 'Project three',
    descripcion: 'Short one-line description of the project',
    tags: ['Branding', 'Web'],
    portada: '/proyectos/placeholder-3.svg',
    portadaAlt: 'Cover pending for project three',
  },
  {
    slug: 'project-four',
    titulo: 'Project four',
    descripcion: 'Short one-line description of the project',
    tags: ['UX/UI', 'Advertising'],
    portada: '/proyectos/placeholder-4.svg',
    portadaAlt: 'Cover pending for project four',
  },
  {
    slug: 'project-five',
    titulo: 'Project five',
    descripcion: 'Short one-line description of the project',
    tags: ['Web', 'UX/UI'],
    portada: '/proyectos/placeholder-5.svg',
    portadaAlt: 'Cover pending for project five',
  },
];

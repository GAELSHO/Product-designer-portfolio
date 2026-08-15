/**
 * Fuente única de los proyectos del portafolio.
 * El primero se renderiza como card a ancho completo; el resto va al grid de 2 columnas.
 *
 * @typedef {Object} Proyecto
 * @property {string} slug        Segmento de URL: /proyectos/{slug}
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
    portadaAlt: 'Cargador AMPIA instalado bajo una marquesina solar en un estacionamiento',
  },
  {
    slug: 'proyecto-dos',
    titulo: 'Proyecto dos',
    descripcion: 'Descripción corta del proyecto en una línea',
    tags: ['Branding', 'UX/UI'],
    portada: '/proyectos/placeholder-2.svg',
    portadaAlt: 'Portada pendiente del proyecto dos',
  },
  {
    slug: 'proyecto-tres',
    titulo: 'Proyecto tres',
    descripcion: 'Descripción corta del proyecto en una línea',
    tags: ['Branding', 'Web'],
    portada: '/proyectos/placeholder-3.svg',
    portadaAlt: 'Portada pendiente del proyecto tres',
  },
  {
    slug: 'proyecto-cuatro',
    titulo: 'Proyecto cuatro',
    descripcion: 'Descripción corta del proyecto en una línea',
    tags: ['UX/UI', 'Advertising'],
    portada: '/proyectos/placeholder-4.svg',
    portadaAlt: 'Portada pendiente del proyecto cuatro',
  },
  {
    slug: 'proyecto-cinco',
    titulo: 'Proyecto cinco',
    descripcion: 'Descripción corta del proyecto en una línea',
    tags: ['Web', 'UX/UI'],
    portada: '/proyectos/placeholder-5.svg',
    portadaAlt: 'Portada pendiente del proyecto cinco',
  },
];

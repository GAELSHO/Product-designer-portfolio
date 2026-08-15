/**
 * Prefix an internal path with the configured `base` (`/Product-designer-portfolio`
 * in production, `/` in dev). Astro does NOT rewrite hand-written `href`/`src`
 * attributes, so every internal link and public-asset reference must go through
 * this helper or it will 404 on GitHub Pages.
 *
 *   withBase('/')            -> '/Product-designer-portfolio/'
 *   withBase('/work/acme')   -> '/Product-designer-portfolio/work/acme'
 *   withBase('favicon.svg')  -> '/Product-designer-portfolio/favicon.svg'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}` || '/';
}

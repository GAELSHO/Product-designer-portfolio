import { Dock, type DockItem } from '@/components/unlumen-ui/dock';
import { withBase } from '@/lib/url';

/**
 * Isla que arma los items del dock. Existe porque `icon` es un ReactNode y eso
 * no se puede pasar como prop desde un `.astro`: los iconos se declaran aquí.
 */

const trazo = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const IconoInicio = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...trazo}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
  </svg>
);

const IconoProyectos = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...trazo}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </svg>
);

const IconoSobreMi = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...trazo}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </svg>
);

const IconoContacto = () => (
  <svg viewBox="0 0 24 24" aria-hidden {...trazo}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

const items: DockItem[] = [
  { icon: <IconoInicio />, label: 'Inicio', href: withBase('/') },
  { icon: <IconoProyectos />, label: 'Proyectos', href: withBase('/#proyectos') },
  { icon: <IconoSobreMi />, label: 'Sobre mí', href: withBase('/#sobre-mi'), separator: true },
  { icon: <IconoContacto />, label: 'Contacto', href: 'mailto:gaelsho10@gmail.com' },
];

export default function DockNav() {
  // `tooltipPlacement="bottom"`: el dock va fijo arriba, así que el tooltip
  // tiene que caer hacia dentro de la pantalla, no hacia el borde.
  return <Dock items={items} tooltipPlacement="bottom" className="shadow-sm" />;
}

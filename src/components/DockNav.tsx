import { Dock, type DockItem } from '@/components/unlumen-ui/dock';
import { withBase } from '@/lib/url';

/**
 * Isla que arma los items del dock. Van como texto (`variant="text"`), así que
 * no hay tooltip: el nombre ya está a la vista. Lo que se magnifica al pasar
 * el cursor es el cuerpo de letra, y al crecer empuja a los vecinos.
 */

const items: DockItem[] = [
  { label: 'Home', href: withBase('/') },
  { label: 'Work', href: withBase('/#work') },
  { label: 'Services', href: withBase('/#services') },
  { label: 'About', href: withBase('/#about'), separator: true },
  { label: 'Contact', href: 'mailto:gaelsho10@gmail.com' },
];

export default function DockNav() {
  return (
    <Dock
      items={items}
      variant="text"
      // 1.8 es la magnificación de los iconos; en texto se ve desproporcionada.
      magnification={1.45}
      distance={100}
      fontSize={14}
      iconSize={40}
    />
  );
}

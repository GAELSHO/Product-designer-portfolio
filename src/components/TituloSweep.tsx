import { DiaTextReveal } from '@/components/vendor/dia-text-reveal';

/**
 * La palabra que rota dentro del título. El componente hace las dos cosas —
 * el barrido de color y el cambio de palabra— así que la rotación ya no la
 * lleva CSS.
 *
 * Cadencia: 1.5s de barrido + 1s de pausa = una palabra cada 2.5s, que es el
 * ritmo que tenía antes.
 *
 * Sin `fixedWidth` a propósito: con él la caja mide siempre lo que la palabra
 * más larga ("UX/UI"), así que las cortas quedan centradas dentro dejando aire
 * a los lados —"WEB Designer" se veía muy separado—. Dejando que el ancho siga
 * a cada palabra, la separación con "Designer" es la misma siempre; el precio
 * es que la línea se re-centra, pero el componente lo anima en 0.4s.
 */
export default function TituloSweep() {
  return (
    <DiaTextReveal
      text={['Brand', 'WEB', 'UX/UI']}
      repeat
      duration={1.5}
      repeatDelay={1}
      className="titulo-sweep"
    />
  );
}

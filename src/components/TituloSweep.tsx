import { DiaTextReveal } from '@/components/vendor/dia-text-reveal';

/**
 * La palabra que rota dentro del título. El componente hace las dos cosas —
 * el barrido de color y el cambio de palabra— así que la rotación ya no la
 * lleva CSS.
 *
 * Cadencia: 1.5s de barrido + 1s de pausa = una palabra cada 2.5s, que es el
 * ritmo que tenía antes.
 *
 * `fixedWidth`: reserva el ancho de la palabra más larga ("UX/UI") y así el
 * título no se re-centra en cada cambio. Con `false` el ancho se anima entre
 * palabras y "Designer" se desplaza; queda bien en un texto pequeño, pero en
 * un titular de 72px se lee como que la línea entera baila.
 */
export default function TituloSweep() {
  return (
    <DiaTextReveal
      text={['Brand', 'WEB', 'UX/UI']}
      repeat
      fixedWidth
      duration={1.5}
      repeatDelay={1}
      className="titulo-sweep"
    />
  );
}

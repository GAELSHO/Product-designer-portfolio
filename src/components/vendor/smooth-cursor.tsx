'use client';

import { motion, useSpring } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * SmoothCursor de magicui.design — código vendorizado.
 *
 * Sustituye el puntero del sistema por una flecha que sigue al ratón con
 * muelles: la posición va con retardo, el giro apunta a la dirección real del
 * movimiento y la pieza se encoge un pelo mientras te mueves.
 *
 * **Está modificado respecto al original.** magicui.design está bloqueado por
 * la política de red del entorno remoto, así que la fuente se reconstruyó
 * desde el build publicado en npm (`smooth-cursor@0.1.2`). Las constantes de
 * los muelles, el SVG y la lógica de velocidad son las del original; los
 * cambios son estos cinco, y si algún día se actualiza desde el registro hay
 * que volver a aplicarlos:
 *
 * 1. Importa de `motion/react` en vez de `framer-motion` — es la misma
 *    librería con su nombre nuevo, y la que ya usa el dock.
 * 2. Paleta invertida: el original pinta la flecha en negro con filo blanco,
 *    pensado para fondo claro. Aquí va en crema con filo `#191919`, que es
 *    legible tanto sobre el fondo del sitio como sobre las cards crema.
 * 3. Respeta `prefers-reduced-motion`: no pinta nada y deja el puntero del
 *    sistema. El componente **es** el efecto de movimiento, así que no hay
 *    versión estática que tenga sentido.
 * 4. El `setTimeout` que devuelve la escala a 1 vive en un ref y se limpia.
 *    En el original se creaba dentro del manejador de `mousemove` y su
 *    `clearTimeout` iba en un `return` de ese manejador, que nadie ejecuta:
 *    se acumulaba un timer por cada movimiento.
 * 5. Fuera el estado `isMoving`, que no se leía en ningún sitio y forzaba un
 *    render de React por cada ráfaga de movimiento.
 */

interface Posicion {
  x: number;
  y: number;
}

interface SmoothCursorProps {
  cursor?: ReactNode;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

function FlechaPorDefecto() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
    >
      <g filter="url(#filtro-cursor)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="#f4f2eb"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="#191919"
          strokeWidth={2.25825}
        />
      </g>
      <defs>
        <filter
          id="filtro-cursor"
          x={0.602397}
          y={0.952444}
          width={49.0584}
          height={52.428}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={2.25825} />
          <feGaussianBlur stdDeviation={2.25825} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export function SmoothCursor({
  cursor = <FlechaPorDefecto />,
  springConfig = { damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 },
}: SmoothCursorProps) {
  const [activo, setActivo] = useState(false);

  const ultimaPos = useRef<Posicion>({ x: 0, y: 0 });
  const velocidad = useRef<Posicion>({ x: 0, y: 0 });
  const ultimoInstante = useRef(Date.now());
  const anguloPrevio = useRef(0);
  const giroAcumulado = useRef(0);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  // El giro y la escala llevan muelles propios: con los de la posición el
  // puntero trompicaba en cada cambio de dirección.
  const giro = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
  const escala = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

  // El puntero personalizado es movimiento y nada más, así que con
  // `prefers-reduced-motion` no se monta y se deja el del sistema.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sincronizar = () => setActivo(!mq.matches);
    sincronizar();
    mq.addEventListener('change', sincronizar);
    return () => mq.removeEventListener('change', sincronizar);
  }, []);

  useEffect(() => {
    if (!activo) return;

    const medirVelocidad = (pos: Posicion) => {
      const ahora = Date.now();
      const dt = ahora - ultimoInstante.current;
      if (dt > 0) {
        velocidad.current = {
          x: (pos.x - ultimaPos.current.x) / dt,
          y: (pos.y - ultimaPos.current.y) / dt,
        };
      }
      ultimoInstante.current = ahora;
      ultimaPos.current = pos;
    };

    const alMover = (e: MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      medirVelocidad(pos);

      const rapidez = Math.sqrt(velocidad.current.x ** 2 + velocidad.current.y ** 2);
      x.set(pos.x);
      y.set(pos.y);

      // Por debajo de este umbral el ángulo lo decide el ruido del ratón y la
      // flecha se pone a girar sola estando casi quieta.
      if (rapidez <= 0.1) return;

      const angulo = Math.atan2(velocidad.current.y, velocidad.current.x) * (180 / Math.PI) + 90;
      // Se acumula el giro en vez de fijarlo: así el muelle va por el camino
      // corto y no da la vuelta entera al cruzar de 359° a 0°.
      let delta = angulo - anguloPrevio.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      giroAcumulado.current += delta;
      giro.set(giroAcumulado.current);
      anguloPrevio.current = angulo;

      escala.set(0.95);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => escala.set(1), 150);
    };

    // Un `mousemove` puede dispararse más veces que fotogramas hay; sin este
    // freno se calcula velocidad y ángulo para posiciones que no se pintan.
    let pendiente = 0;
    const encolar = (e: MouseEvent) => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        alMover(e);
        pendiente = 0;
      });
    };

    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', encolar);

    return () => {
      window.removeEventListener('mousemove', encolar);
      // Vacío, no `auto`: así manda de nuevo la hoja de estilos.
      document.body.style.cursor = '';
      if (pendiente) cancelAnimationFrame(pendiente);
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, [activo, x, y, giro, escala]);

  if (!activo) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        translateX: '-50%',
        translateY: '-50%',
        rotate: giro,
        scale: escala,
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {cursor}
    </motion.div>
  );
}

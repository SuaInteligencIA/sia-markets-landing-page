import { useEffect, useRef, useState } from 'react';
import type { mountAnimatedGradient } from './runtime';

// O mesmo gradiente animado do topo do site da Sua InteligêncIA. O runtime WebGL só é carregado
// quando o elemento se aproxima da tela; até lá (ou sem WebGL), fica o degradê de CSS do fundo.
export function AnimatedGradient({ className = '' }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const runtime = useRef<ReturnType<typeof mountAnimatedGradient>>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(() => {
        void import('./runtime').then(({ mountAnimatedGradient }) => {
          if (cancelled || !canvas.current) return;
          runtime.current = mountAnimatedGradient(canvas.current, () => { if (!cancelled) setReady(true); }, { fps: 30, maxPixels: 180000 });
        }).catch(() => { /* Sem WebGL, o degradê de CSS continua visível. */ });
      }, 250);
    }, { rootMargin: '200px' });
    if (container.current) observer.observe(container.current);
    return () => { cancelled = true; observer.disconnect(); window.clearTimeout(timer); runtime.current?.dispose(); };
  }, []);

  return <div ref={container} className={`animated-gradient ${className}`} data-ready={ready} aria-hidden="true"><canvas ref={canvas} /></div>;
}

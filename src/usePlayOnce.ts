import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Toca uma linha do tempo uma única vez, na primeira vez que o elemento aparece na tela.
 *
 * Retorna `beat`: quantos momentos da linha do tempo já passaram. `Infinity` = tudo visível, que é o
 * estado do HTML pré-renderizado, do fim da animação e de quem pede "reduzir movimento". Antes de o
 * elemento aparecer, o beat é 0: o conteúdo continua ocupando o espaço (só fica invisível), então a
 * página não pula enquanto as mensagens entram.
 */
export function usePlayOnce(ref: RefObject<HTMLElement | null>, beats: number[], threshold = 0.35) {
  const [beat, setBeat] = useState(Infinity);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setBeat(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      beats.forEach((at, index) => timers.push(setTimeout(() => setBeat(index + 1), at)));
      timers.push(setTimeout(() => setBeat(Infinity), beats[beats.length - 1] + 600));
    }, { threshold });
    observer.observe(element);
    return () => { observer.disconnect(); timers.forEach(clearTimeout); };
  }, [ref, beats, threshold]);

  return beat;
}

/**
 * Rola um elemento até `to` devagar, desacelerando no fim (como o dedo soltando a tela).
 * Devolve uma função que cancela a rolagem. Com "reduzir movimento", vai direto ao destino.
 */
export function glide(element: HTMLElement, to: number, duration = 1400): () => void {
  const from = element.scrollTop;
  if (Math.abs(to - from) < 2) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { element.scrollTop = to; return () => {}; }
  const start = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    element.scrollTop = from + (to - from) * (1 - Math.pow(1 - progress, 3));
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

/** Posição de rolagem que deixa o último elemento visível (não pendente) no pé da área, com folga. */
export function bottomOfVisible(body: HTMLElement, gap = 14): number {
  const visible = [...body.children].filter(child => !child.classList.contains('is-pending')) as HTMLElement[];
  const last = visible[visible.length - 1];
  if (!last) return 0;
  return Math.min(body.scrollHeight - body.clientHeight, Math.max(0, last.offsetTop + last.offsetHeight + gap - body.clientHeight));
}

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Autoplay das etapas de "Como funciona".
 *
 * - Modo "auto": cada etapa roda a sua linha do tempo (os "beats" revelam a conversa aos poucos) e,
 *   ao fim da duração, passa para a próxima; da última volta à primeira.
 * - Modo "manual": o visitante escolheu uma etapa (clique ou teclado). Ela fica parada e completa,
 *   como um slide. Depois de `idleMs` sem interação na seção, o autoplay recomeça daquela etapa.
 * - Pausa do visitante (botão): nada anda, nem por inatividade, até ele retomar.
 * - O tempo só corre com a seção visível na tela e a aba em primeiro plano; ao voltar, continua de onde
 *   parou. Com "reduzir movimento" ligado no sistema, nunca anda sozinho.
 *
 * Um único setTimeout por vez, sempre para o próximo evento (próximo beat ou fim da etapa): nenhum
 * re-render por quadro. `beat === Infinity` significa "etapa completa", que também é o estado do HTML
 * pré-renderizado e do modo manual.
 */
export interface StepTimeline { beats: number[]; duration: number }

export function useStepAutoplay(timelines: StepTimeline[], sectionRef: RefObject<HTMLElement | null>, idleMs = 10000) {
  const [step, setStep] = useState(0);
  const [beat, setBeat] = useState(Infinity);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [userPaused, setUserPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [cycle, setCycle] = useState(0);
  const elapsed = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastActivity = useRef(0);

  const running = mode === 'auto' && motionAllowed && inView && pageVisible && !userPaused;

  // Ambiente: preferência de movimento, aba visível e seção na tela.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setMotionAllowed(!query.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    updateMotion();
    updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const section = sectionRef.current;
    const observer = section ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 }) : undefined;
    if (section) observer?.observe(section);
    return () => { query.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); observer?.disconnect(); };
  }, [sectionRef]);

  // Começo de uma etapa animada: a conversa parte do zero.
  const startStep = useCallback((index: number) => {
    elapsed.current = 0;
    setStep(index);
    setBeat(0);
    setCycle(value => value + 1);
  }, []);

  // Primeira vez que pode animar (ou depois de "reduzir movimento" ser desligado): recomeça a etapa atual.
  useEffect(() => {
    if (running && beat === Infinity) startStep(step);
  }, [running, beat, step, startStep]);

  // Linha do tempo da etapa atual.
  useEffect(() => {
    if (!running || beat === Infinity) return;
    const { beats, duration } = timelines[step];
    const startedAt = performance.now() - elapsed.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let advanced = false;
    const tick = () => {
      const now = performance.now() - startedAt;
      if (now >= duration) {
        advanced = true;
        startStep((step + 1) % timelines.length);
        return;
      }
      setBeat(beats.filter(at => at <= now).length);
      const next = [...beats, duration].find(at => at > now) ?? duration;
      timer = setTimeout(tick, Math.max(16, next - now));
    };
    tick();
    return () => {
      clearTimeout(timer);
      if (!advanced) elapsed.current = performance.now() - startedAt;
    };
    // `beat` fica fora de propósito: o tick já o atualiza; incluí-lo reiniciaria a contagem a cada beat.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, step, cycle, timelines, startStep]);

  // Inatividade no modo manual: volta ao autoplay.
  const armIdle = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => { setMode('auto'); setBeat(Infinity); }, idleMs);
  }, [idleMs]);

  useEffect(() => {
    if (mode !== 'manual' || userPaused || !motionAllowed) { clearTimeout(idleTimer.current); return; }
    armIdle();
    const section = sectionRef.current;
    if (!section) return;
    // Qualquer interação na seção adia o retorno; movimentos do mouse contam no máximo a cada 250 ms.
    const activity = (event: Event) => {
      if (event.type === 'pointermove' && event.timeStamp - lastActivity.current < 250) return;
      lastActivity.current = event.timeStamp;
      armIdle();
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'focusin', 'wheel'];
    events.forEach(name => section.addEventListener(name, activity, { passive: true }));
    return () => { clearTimeout(idleTimer.current); events.forEach(name => section.removeEventListener(name, activity)); };
  }, [mode, userPaused, motionAllowed, armIdle, sectionRef]);

  /** O visitante escolheu uma etapa: vira slide, parado e completo. */
  const select = useCallback((index: number) => {
    elapsed.current = 0;
    setMode('manual');
    setStep(index);
    setBeat(Infinity);
  }, []);

  /** Botão de pausa: pausa o autoplay ou, se estiver pausado ou em slide, retoma da etapa atual. */
  const togglePause = useCallback(() => {
    if (mode === 'auto' && !userPaused) { setUserPaused(true); return; }
    setUserPaused(false);
    setMode('auto');
    startStep(step);
  }, [mode, userPaused, step, startStep]);

  return { step, beat, cycle, running, mode, userPaused, motionAllowed, select, togglePause };
}

import { useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { steps, whatsappUrl } from './content';
import { ArrowUpRight, ChevronRight } from './icons';
import { sceneOf, StepVisual, stepTimelines } from './StepVisual';
import { useStepAutoplay } from './useStepAutoplay';

const talkUrl = whatsappUrl('Olá! Quero conhecer o SIA Markets e ver como ele funciona no meu supermercado.');
const navigationKeys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];

// "Como funciona": as etapas passam sozinhas com a conversa animada; clicar numa etapa a mostra como
// slide; após um tempo sem interação, o autoplay volta. Regras completas em useStepAutoplay.ts.
export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { step: activeStep, beat, cycle, running, mode, userPaused, motionAllowed, select, togglePause } = useStepAutoplay(stepTimelines, sectionRef);
  const autoplayOn = mode === 'auto' && !userPaused;

  // Troca de etapa como uma conversa rolando: a anterior sobe e some enquanto a nova entra por baixo.
  // A anterior fica na tela só durante a transição (e nunca com "reduzir movimento"). useLayoutEffect
  // prepara a saída antes da pintura, e a nova etapa já nasce com a animação: nenhum quadro piscando.
  const [leaving, setLeaving] = useState<{ step: number; id: number } | null>(null);
  const shownStep = useRef(activeStep);
  useLayoutEffect(() => {
    if (shownStep.current === activeStep) return;
    const previous = shownStep.current;
    shownStep.current = activeStep;
    if (!motionAllowed || sceneOf(previous) === sceneOf(activeStep)) return; // mesma conversa: só rola
    setLeaving({ step: previous, id: performance.now() });
    const timer = setTimeout(() => setLeaving(null), 650);
    return () => clearTimeout(timer);
  }, [activeStep, motionAllowed]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!navigationKeys.includes(event.key)) return;
    event.preventDefault();
    const last = steps.length - 1;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? last : ['ArrowDown', 'ArrowRight'].includes(event.key) ? (index === last ? 0 : index + 1) : (index === 0 ? last : index - 1);
    select(next);
    document.getElementById(`step-tab-${next}`)?.focus();
  };

  return <section className="workflow-section page-inset" id="como-funciona" aria-labelledby="workflow-title" ref={sectionRef}>
    <div className="workflow-copy">
      <p className="eyebrow">COMO FUNCIONA</p>
      <h2 id="workflow-title">Do pedido no WhatsApp<br />à venda no painel.</h2>
      <div className="step-list" role="tablist" aria-label="Etapas do atendimento">{steps.map((step, index) => {
        const active = activeStep === index;
        return <button key={step.id} id={`step-tab-${index}`} role="tab" aria-selected={active} aria-controls="step-panel" tabIndex={active ? 0 : -1} onClick={() => select(index)} onKeyDown={event => onKeyDown(event, index)} className={`step ${active ? 'active' : ''}`}>
          <span className="step-number">{step.number}</span>
          <span><strong>{step.title}</strong>{active && <span className="step-description">{step.description}</span>}</span>
          <ChevronRight size={20} aria-hidden="true" />
          {active && autoplayOn && motionAllowed && <span key={cycle} className={`step-progress ${running ? '' : 'is-paused'}`} style={{ animationDuration: `${stepTimelines[index].duration}ms` }} aria-hidden="true" />}
        </button>;
      })}</div>
      <a className="text-link" href={talkUrl} target="_blank" rel="noopener noreferrer">Quero ver no meu supermercado <span className="round-arrow"><ArrowUpRight size={18} /></span></a>
    </div>
    <div className="workflow-visual" role="tabpanel" id="step-panel" aria-labelledby={`step-tab-${activeStep}`} tabIndex={0} aria-live="off">
      <div className="workflow-orbit orbit-one" /><div className="workflow-orbit orbit-two" />
      <div className="step-stage">
        {leaving && <div key={`saindo-${leaving.id}`} className="stage-item is-leaving" aria-hidden="true"><StepVisual step={leaving.step} beat={Infinity} /></div>}
        <div key={`cena-${sceneOf(activeStep)}`} className={`stage-item ${motionAllowed && (leaving || sceneOf(shownStep.current) !== sceneOf(activeStep)) ? 'is-entering' : ''}`}><StepVisual step={activeStep} beat={beat} /></div>
      </div>
      {motionAllowed && <button type="button" className={`autoplay-toggle ${autoplayOn ? '' : 'is-off'}`} onClick={togglePause} aria-label={autoplayOn ? 'Pausar animação' : 'Retomar animação'}>{autoplayOn ? <span className="pause-icon" aria-hidden="true" /> : <span className="play-icon" aria-hidden="true" />}</button>}
    </div>
  </section>;
}

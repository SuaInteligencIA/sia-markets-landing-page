import { useEffect, useRef } from 'react';
import { BASE } from './base';
import { bottomOfVisible, glide } from './glide';
import { AiListening, AiUnderstood, AudioMessage, ChatBody, ChatHeader, ListCard, Message, TypingBubble } from './ChatDemo';
import { BarChart3, Check, MessagesSquare, MoreHorizontal, ShoppingBag, Truck, Users } from './icons';
import type { StepTimeline } from './useStepAutoplay';

// Linha do tempo de cada etapa (ms desde o início dela): cada número revela o próximo pedaço da cena.
// `beat` é quantos já passaram; Infinity mostra a etapa completa (slide, pré-render, movimento reduzido).
// Ritmo calmo, para dar tempo de ler: cerca de 33 s o ciclo inteiro.
export const stepTimelines: StepTimeline[] = [
  { beats: [500, 1700, 2600, 5600, 7400], duration: 9500 }, // mensagem, áudio, SIA ouvindo, SIA entendeu, SIA digitando
  { beats: [400, 2600, 6400], duration: 9000 }, // SIA digitando, lista, cliente confirma
  { beats: [1200, 2000, 2800, 3600, 4400, 5600], duration: 8000 }, // cinco itens separados, pedido sai
  { beats: [800, 1600], duration: 7000 }, // venda registrada, barras sobem
  { beats: [1400], duration: 7000 }, // a entrega; depois, o selo de pedido entregue
];
const listenMs = stepTimelines[0].beats[3] - stepTimelines[0].beats[2];

const list = [['Mercearia', 'Arroz 5 kg'], ['Mercearia', 'Feijão carioca 1 kg'], ['Laticínios', 'Leite integral (6 unidades)'], ['Padaria', 'Pão francês (10 unidades)'], ['Hortifrúti', 'Banana prata (1 dúzia)']];
const bars = [36, 53, 44, 65, 57, 79, 72, 93];

/** As cenas que são a mesma tela: etapas 1 e 2 são uma só conversa, que continua. */
export const sceneOf = (step: number) => (step <= 1 ? 0 : step);

// Etapas 1 e 2: a mesma conversa. Na etapa 2 ela continua (a SIA manda a lista) e a área rola
// devagar para baixo, sem trocar de tela.
function ConversationScene({ step, beat, className }: { step: number; beat: number; className: string }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const first = step === 0 ? beat : Infinity; // a parte da etapa 1 já terminou quando estamos na 2
  const second = step === 1 ? beat : -1;
  useEffect(() => {
    const body = bodyRef.current;
    return body ? glide(body, bottomOfVisible(body)) : undefined;
  }, [step, beat]);
  return <div className={`step-conversation ${className}`}><ChatHeader /><ChatBody scrollRef={bodyRef} label="Conversa de exemplo">
    {first >= 1 && <Message from="cliente" time="09:41">Oi! Queria fazer um pedido para entrega.</Message>}
    {first >= 2 && <Message from="cliente" time="09:41"><AudioMessage duration="0:14" state={first === 2 ? 'idle' : first === 3 ? 'playing' : 'heard'} listenMs={listenMs} /></Message>}
    {first === 3 && <AiListening />}
    {first >= 4 && <AiUnderstood text="arroz, feijão, leite, pão e banana" />}
    {((step === 0 && first >= 5 && first !== Infinity) || (step === 0 && first === Infinity) || (step === 1 && second >= 0 && second < 2)) && <TypingBubble />}
    {second >= 2 && <Message from="sia" time="09:42">Oi, Marina! Sua lista ficou assim:<ListCard title="Lista de compras" items={list.map(([group, item]) => ({ group, item }))} />Está tudo certo?</Message>}
    {second >= 3 && <Message from="cliente" time="09:42">Tudo certo!</Message>}
  </ChatBody><span className="preview-label">Exemplo ilustrativo de atendimento</span></div>;
}

export function StepVisual({ step, beat }: { step: number; beat: number }) {
  const animated = beat !== Infinity;
  const className = animated ? 'is-animated' : 'is-static';

  if (step <= 1) return <ConversationScene step={step} beat={beat} className={className} />;

  if (step === 2) {
    const done = animated ? Math.min(beat, list.length) : 3;
    const shipped = animated && beat > list.length;
    return <div className={`order-preview ${className}`}><div className="order-top"><ShoppingBag size={20} aria-hidden="true" /><div><strong>Pedido de Marina Souza</strong><small>Lista confirmada pela SIA · {list.length} itens</small></div></div>
      <ul className="order-items">{list.map(([, item], index) => <li key={item} className={index < done ? 'done' : ''}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
      <div className={`order-status ${shipped ? 'shipped' : ''}`}><Truck size={17} aria-hidden="true" /> {shipped ? 'Saiu para entrega' : 'Separando para entrega'}</div>
      <span className="preview-label">Visualização ilustrativa</span></div>;
  }

  if (step === 4) return <div className={`delivery-preview ${className}`}>
    <picture><source type="image/avif" srcSet={`${BASE}images/entrega-cliente-640.avif 640w, ${BASE}images/entrega-cliente-960.avif 960w, ${BASE}images/entrega-cliente-1280.avif 1280w`} sizes="(max-width:760px) calc(100vw - 80px), 480px" /><img src={`${BASE}images/entrega-cliente.webp`} width="960" height="1024" alt="Entregador de boné e camisa azuis entregando as sacolas de compras a uma cliente na porta de casa" loading="lazy" decoding="async" /></picture>
    {(!animated || beat >= 1) && <span className="delivery-pill"><Check size={15} aria-hidden="true" /> Pedido entregue · Marina Souza</span>}
  </div>;

  return <div className={`insights-preview ${className}`}><div className="insights-top"><img src={`${BASE}brand/icon.svg`} width="26" height="26" alt="" /><span>Vendas pelo WhatsApp</span><MoreHorizontal size={18} /></div>
    <p>Venda registrada.</p><strong>Direto no seu painel.</strong>
    {(!animated || beat >= 1) && <span className="sale-registered"><Check size={14} aria-hidden="true" /> Marina Souza · venda registrada</span>}
    <div className="chart-bars" aria-hidden="true">{bars.map((height, index) => <span key={index} style={{ height: `${!animated || beat >= 2 ? height : 6}%`, transitionDelay: animated ? `${index * 90}ms` : undefined }} />)}</div>
    <div className="insights-stats">{([[BarChart3, 'Vendas', '412'], [MessagesSquare, 'Atendimentos', '538'], [Users, 'Equipe online', '3']] as const).map(([Icon, label, value]) => <div className="insights-stat" key={label}><span className="insights-stat-icon"><Icon size={16} /></span><span className="insights-stat-text"><small>{label}</small><strong className="insights-stat-value">{value}</strong></span></div>)}</div>
    <span className="preview-label">Visualização ilustrativa</span></div>;
}

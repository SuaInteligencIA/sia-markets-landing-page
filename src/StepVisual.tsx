import { BASE } from './base';
import { AudioMessage, ChatBody, ChatHeader, ListCard, Message, TypingBubble } from './ChatDemo';
import { BarChart3, Check, MessagesSquare, MoreHorizontal, ShoppingBag, Truck, Users } from './icons';
import type { StepTimeline } from './useStepAutoplay';

// Linha do tempo de cada etapa (ms desde o início dela): cada número revela o próximo pedaço da cena.
// `beat` é quantos já passaram; Infinity mostra a etapa completa (slide, pré-render, movimento reduzido).
export const stepTimelines: StepTimeline[] = [
  { beats: [300, 1300, 2400], duration: 5000 }, // mensagem, áudio, SIA digitando
  { beats: [200, 1500, 3600], duration: 5600 }, // SIA digitando, lista, cliente confirma
  { beats: [600, 1100, 1600, 2100, 2600, 3200], duration: 5200 }, // cinco itens separados, pedido sai
  { beats: [400, 900], duration: 4800 }, // venda registrada, barras sobem
];

const list = [['Mercearia', 'Arroz 5 kg'], ['Mercearia', 'Feijão carioca 1 kg'], ['Laticínios', 'Leite integral (6 unidades)'], ['Padaria', 'Pão francês (10 unidades)'], ['Hortifrúti', 'Banana prata (1 dúzia)']];
const bars = [36, 53, 44, 65, 57, 79, 72, 93];

export function StepVisual({ step, beat }: { step: number; beat: number }) {
  const animated = beat !== Infinity;
  const className = animated ? 'is-animated' : 'is-static';

  if (step === 0) return <div className={`step-conversation ${className}`}><ChatHeader /><ChatBody>
    {beat >= 1 && <Message from="cliente" time="09:41">Oi! Queria fazer um pedido para entrega.</Message>}
    {beat >= 2 && <Message from="cliente" time="09:41"><AudioMessage duration="0:14" /></Message>}
    {beat >= 3 && <TypingBubble />}
  </ChatBody><span className="preview-label">Exemplo ilustrativo de atendimento</span></div>;

  if (step === 1) return <div className={`step-conversation ${className}`}><ChatHeader /><ChatBody>
    {beat === 1 && <TypingBubble />}
    {beat >= 2 && <Message from="sia" time="09:42">Oi, Marina! Sua lista ficou assim:<ListCard title="Lista de compras" items={list.map(([group, item]) => ({ group, item }))} />Está tudo certo?</Message>}
    {beat >= 3 && <Message from="cliente" time="09:42">Tudo certo!</Message>}
  </ChatBody><span className="preview-label">Exemplo ilustrativo de atendimento</span></div>;

  if (step === 2) {
    const done = animated ? Math.min(beat, list.length) : 3;
    const shipped = animated && beat > list.length;
    return <div className={`order-preview ${className}`}><div className="order-top"><ShoppingBag size={20} aria-hidden="true" /><div><strong>Pedido de Marina Souza</strong><small>Lista confirmada pela SIA · {list.length} itens</small></div></div>
      <ul className="order-items">{list.map(([, item], index) => <li key={item} className={index < done ? 'done' : ''}><Check size={17} aria-hidden="true" />{item}</li>)}</ul>
      <div className={`order-status ${shipped ? 'shipped' : ''}`}><Truck size={17} aria-hidden="true" /> {shipped ? 'Saiu para entrega' : 'Separando para entrega'}</div>
      <span className="preview-label">Visualização ilustrativa</span></div>;
  }

  return <div className={`insights-preview ${className}`}><div className="insights-top"><img src={`${BASE}brand/icon.svg`} width="26" height="26" alt="" /><span>Vendas pelo WhatsApp</span><MoreHorizontal size={18} /></div>
    <p>Venda registrada.</p><strong>Direto no seu painel.</strong>
    {(!animated || beat >= 1) && <span className="sale-registered"><Check size={14} aria-hidden="true" /> Marina Souza · venda registrada</span>}
    <div className="chart-bars" aria-hidden="true">{bars.map((height, index) => <span key={index} style={{ height: `${!animated || beat >= 2 ? height : 6}%` }} />)}</div>
    <div className="insights-foot"><span><BarChart3 /> Vendas</span><span><MessagesSquare /> Atendimentos</span><span><Users /> Equipe</span></div>
    <span className="preview-label">Visualização ilustrativa</span></div>;
}

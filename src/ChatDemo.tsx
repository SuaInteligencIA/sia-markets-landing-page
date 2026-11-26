import type { ReactNode } from 'react';
import { BASE } from './base';
import { Check, Mic, Sparkles } from './icons';

// Peças da conversa ilustrativa, vista do celular do cliente: as mensagens dele à direita (azul claro),
// as da SIA à esquerda (azul da marca), como no WhatsApp, mas com a identidade da SIA.

export function AgentAvatar({ className = '' }: { className?: string }) {
  return <span className={`agent-avatar ${className}`}><img src={`${BASE}brand/sia-agente-avatar.webp`} width="240" height="240" alt="SIA, agente de IA do supermercado" /></span>;
}

export function ChatHeader() {
  return <div className="chat-header"><AgentAvatar /><div><strong>SIA · Supermercado do Bairro</strong><small><span className="online-dot" aria-hidden="true" /> online</small></div><Sparkles size={19} /></div>;
}

export function ChatBody({ children }: { children: ReactNode }) {
  return <div className="chat-body"><span className="chat-day">Hoje</span>{children}</div>;
}

export function ChatComposer() {
  return <div className="chat-composer" aria-hidden="true"><span>Mensagem</span><span className="composer-mic"><Mic size={16} /></span></div>;
}

// Check duplo de mensagem lida, no traço de 1,5 px do Iconsax.
function ReadTicks() {
  return <svg className="read-ticks" width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true" focusable="false"><path d="M1 5.8 3.9 8.7 10.2 2.3M6.4 8.7l.6.6 6.3-6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Meta({ time, read }: { time: string; read: boolean }) {
  return <span className="msg-meta"><time>{time}</time>{read && <ReadTicks />}</span>;
}

export function Message({ from, time, children }: { from: 'cliente' | 'sia'; time: string; children: ReactNode }) {
  const mine = from === 'cliente';
  return <div className={`bubble ${mine ? 'guest-bubble' : 'agent-bubble'}`}>{children}<Meta time={time} read={mine} /></div>;
}

// Alturas fixas das barras (em % da altura da onda), para o desenho ser igual no servidor e no navegador.
const wave = [30, 52, 74, 46, 88, 64, 40, 70, 96, 58, 36, 62, 84, 50, 28, 66, 90, 54, 38, 72, 48, 80, 34, 56, 42, 26];

export function AudioMessage({ duration }: { duration: string }) {
  return <span className="audio-message" role="img" aria-label={`Mensagem de áudio de ${duration}`}>
    <span className="audio-play" aria-hidden="true" />
    <span className="audio-track" aria-hidden="true">
      <span className="audio-wave">{wave.map((height, index) => <span key={index} className={index < 9 ? 'played' : ''} style={{ height: `${height}%` }} />)}</span>
      <span className="audio-time">{duration}</span>
    </span>
    <span className="audio-mic" aria-hidden="true"><Mic size={12} /></span>
  </span>;
}

export function ListCard({ title, items }: { title: string; items: { group: string; item: string }[] }) {
  return <div className="list-card"><span className="list-card-title">{title}</span><ul>{items.map(({ group, item }) => <li key={item}><Check size={16} aria-hidden="true" /><span className="list-item">{item}</span><span className="list-tag">{group}</span></li>)}</ul></div>;
}

export function TypingBubble() {
  return <div className="typing-bubble" role="status" aria-label="SIA está digitando"><span /><span /><span /></div>;
}

export function SystemPill({ children }: { children: ReactNode }) {
  return <span className="chat-system"><Check size={14} aria-hidden="true" />{children}</span>;
}

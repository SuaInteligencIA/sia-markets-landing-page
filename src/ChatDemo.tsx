import type { ReactNode } from 'react';
import { BASE } from './base';
import { Check } from './icons';

// Peças da conversa ilustrativa, vista do celular do cliente: as mensagens dele à direita (azul claro),
// as da SIA à esquerda (azul da marca), como no WhatsApp, mas com a identidade da SIA.

export function AgentAvatar({ className = '' }: { className?: string }) {
  return <span className={`agent-avatar ${className}`}><img src={`${BASE}brand/sia-agente-avatar.webp`} width="240" height="240" alt="SIA, agente de IA do supermercado" /></span>;
}

export function ChatHeader() {
  return <div className="chat-header"><AgentAvatar /><div><strong>SIA · Supermercado Boa Compra</strong><small><span className="online-dot" aria-hidden="true" /> online</small></div></div>;
}

export function ChatBody({ children }: { children: ReactNode }) {
  return <div className="chat-body"><span className="chat-day">Hoje</span>{children}</div>;
}

export function ChatComposer() {
  return <div className="chat-composer" aria-hidden="true"><span>Mensagem</span><span className="composer-mic"><MicIcon size={17} /></span></div>;
}

// Check duplo de mensagem lida: ícone "check-check" do Lucide (https://lucide.dev, licença ISC,
// Copyright (c) Lucide Contributors), o desenho mais reconhecível de "lida", como no WhatsApp.
function ReadTicks() {
  return <svg className="read-ticks" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></svg>;
}

// Microfone do Lucide (mesma origem e licença do check duplo), no traço das conversas.
function MicIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>;
}

function Meta({ time, read }: { time: string; read: boolean }) {
  return <span className="msg-meta"><time>{time}</time>{read && <ReadTicks />}</span>;
}

export function Message({ from, time, className = '', children }: { from: 'cliente' | 'sia'; time: string; className?: string; children: ReactNode }) {
  const mine = from === 'cliente';
  return <div className={`bubble ${mine ? 'guest-bubble' : 'agent-bubble'} ${className}`}>{children}<Meta time={time} read={mine} /></div>;
}

/** Classes de revelação para conversas que aparecem aos poucos; `null` = sem animação (completa). */
export function reveal(shown: boolean | null): string {
  return shown === null ? '' : `reveal ${shown ? 'is-shown' : 'is-pending'}`;
}

// Alturas fixas das barras (em % da altura da onda), para o desenho ser igual no servidor e no navegador.
const wave = [30, 52, 74, 46, 88, 64, 40, 70, 96, 58, 36, 62, 84, 50, 28, 66, 90, 54, 38, 72, 48, 80, 34, 56, 42, 26];

/**
 * Áudio do cliente. `idle`: acabou de chegar, ninguém ouviu (onda toda clara).
 * `playing`: a SIA está ouvindo; a onda se preenche no tempo `listenMs`. `heard`: já ouvido inteiro.
 */
export function AudioMessage({ duration, state = 'idle', listenMs = 3000 }: { duration: string; state?: 'idle' | 'playing' | 'heard'; listenMs?: number }) {
  const step = Math.round(listenMs / wave.length);
  return <span className={`audio-message is-${state}`} role="img" aria-label={`Mensagem de áudio de ${duration}${state === 'playing' ? ', sendo ouvida pela SIA' : ''}`}>
    <span className={`audio-play ${state === 'playing' ? 'is-pause' : ''}`} aria-hidden="true" />
    <span className="audio-track" aria-hidden="true">
      <span className="audio-wave">{wave.map((height, index) => <span key={index} className={state === 'heard' ? 'played' : ''} style={{ height: `${height}%`, animationDelay: state === 'playing' ? `${index * step}ms` : undefined }} />)}</span>
      <span className="audio-time">{duration}</span>
    </span>
    <span className="audio-mic" aria-hidden="true"><MicIcon size={13} /></span>
  </span>;
}

export function ListCard({ title, items }: { title: string; items: { group: string; item: string }[] }) {
  return <div className="list-card"><span className="list-card-title">{title}</span><ul>{items.map(({ group, item }) => <li key={item}><Check size={16} aria-hidden="true" /><span className="list-item">{item}</span><span className="list-tag">{group}</span></li>)}</ul></div>;
}

/** A SIA ouvindo o áudio, com barrinhas de equalizador. */
export function AiListening({ className = '' }: { className?: string }) {
  return <div className={`ai-note ai-listening ${className}`} role="status"><AgentAvatar className="ai-note-avatar" /><span>SIA ouvindo o áudio</span><span className="ai-eq" aria-hidden="true"><i /><i /><i /><i /></span></div>;
}

/** O que a SIA entendeu do áudio. */
export function AiUnderstood({ text, className = '' }: { text: string; className?: string }) {
  return <div className={`ai-note ai-understood ${className}`}><AgentAvatar className="ai-note-avatar" /><span><strong>SIA entendeu:</strong> “{text}”</span><Check size={14} aria-hidden="true" /></div>;
}

export function TypingBubble() {
  return <div className="typing-bubble" role="status" aria-label="SIA está digitando"><span /><span /><span /></div>;
}

export function SystemPill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`chat-system ${className}`}><Check size={14} aria-hidden="true" />{children}</span>;
}

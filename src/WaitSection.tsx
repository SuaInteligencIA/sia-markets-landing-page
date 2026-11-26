import { BASE } from './base';
import { waitPoints } from './content';
import { Check, MessagesSquare, Timer, Users } from './icons';

const icons = { messages: MessagesSquare, users: Users, timer: Timer } as const;

// "Quanto tempo o seu cliente espera?": a IA responde na hora, a qualquer hora (sem fila no WhatsApp).
export function WaitSection() {
  return <section className="section wait-section" id="atendimento-na-hora" aria-labelledby="wait-title">
    <div className="wait-copy">
      <p className="eyebrow">ATENDIMENTO NA HORA</p>
      <h2 id="wait-title">Quanto tempo o seu cliente <span className="nowrap">espera para</span> <span className="accent">ser atendido?</span></h2>
      <p className="wait-answer">Com a SIA, <strong>nenhum</strong>. A IA responde <strong>na hora, a qualquer hora</strong>: no pico de sexta, no domingo ou às dez da noite. O cliente não fica sem resposta e não desiste da compra no meio do caminho.</p>
      <div className="wait-points">{waitPoints.map(point => { const Icon = icons[point.icon as keyof typeof icons]; return <div className="wait-point" key={point.title}><span className="wait-point-icon"><Icon size={20} aria-hidden="true" /></span><div><h3>{point.title}</h3><p>{point.description.split('\n').map((line, index) => <span key={index}>{index > 0 && <br className="desktop-break" />}{index > 0 ? ' ' : ''}{line}</span>)}</p></div></div>; })}</div>
    </div>
    <div className="wait-visual wait-art">
      <picture><source type="image/avif" srcSet={`${BASE}images/cliente-atendido-640.avif 640w, ${BASE}images/cliente-atendido-960.avif 960w, ${BASE}images/cliente-atendido-1280.avif 1280w`} sizes="(max-width:950px) calc(100vw - 40px), 46vw" /><img src={`${BASE}images/cliente-atendido.webp`} width="960" height="895" alt="Cliente na cozinha mandando mensagem pelo celular, enquanto a notificação mostra a SIA já digitando a resposta" loading="lazy" decoding="async" /></picture>
      <span className="wait-pill"><Check size={15} aria-hidden="true" /> SIA respondendo na hora</span>
    </div>
  </section>;
}

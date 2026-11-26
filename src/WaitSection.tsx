import { ChatBody, ChatHeader, Message, SystemPill } from './ChatDemo';
import { waitPoints } from './content';
import { MessagesSquare, Timer, Users } from './icons';

const icons = { messages: MessagesSquare, users: Users, timer: Timer } as const;

// "Quanto tempo o seu cliente espera?": a IA responde na hora, a qualquer hora (sem fila no WhatsApp).
export function WaitSection() {
  return <section className="section wait-section" id="atendimento-na-hora" aria-labelledby="wait-title">
    <div className="wait-copy">
      <p className="eyebrow">ATENDIMENTO NA HORA</p>
      <h2 id="wait-title">Quanto tempo o seu cliente <span className="nowrap">espera para</span> <span className="accent">ser atendido?</span></h2>
      <p className="wait-answer">Com a SIA, <strong>nenhum</strong>. A IA responde <strong>na hora, a qualquer hora</strong>: no pico de sexta, no domingo ou às dez da noite. O cliente não fica sem resposta e não desiste da compra no meio do caminho.</p>
      <div className="wait-points">{waitPoints.map(point => { const Icon = icons[point.icon as keyof typeof icons]; return <div className="wait-point" key={point.title}><span className="wait-point-icon"><Icon size={20} aria-hidden="true" /></span><div><h3>{point.title}</h3><p>{point.description}</p></div></div>; })}</div>
    </div>
    <div className="wait-visual">
      <div className="wait-chat">
        <ChatHeader />
        <ChatBody>
          <Message from="cliente" time="22:14">Boa noite! Ainda dá pra fazer um pedido pra amanhã cedo?</Message>
          <Message from="sia" time="22:14">Boa noite! Dá sim 😊 Pode me mandar a lista do jeito que preferir, por texto ou áudio.</Message>
          <SystemPill>Respondido na hora</SystemPill>
        </ChatBody>
      </div>
    </div>
  </section>;
}

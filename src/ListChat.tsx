import { Fragment, useRef } from 'react';
import { AiListening, AiUnderstood, AudioMessage, ChatBody, ChatHeader, ChatComposer, ListCard, Message, SystemPill, reveal } from './ChatDemo';
import { chatDemo } from './content';
import { usePlayOnce } from './usePlayOnce';

// Conversa da seção "Lista de compras": acontece uma vez, na primeira vez que o visitante chega nela.
// Momentos (ms): três mensagens do cliente, SIA ouvindo o áudio, SIA entendeu, lista, pergunta,
// resposta, confirmação e o selo final.
const beats = [400, 1600, 2800, 3600, 6400, 9000, 11800, 13200, 14800, 16200];
const listenMs = beats[4] - beats[3];
// Em que momento cada mensagem de `chatDemo` aparece (na ordem do array).
const messageBeat = [1, 2, 3, 6, 7, 8, 9];
const audioIndex = chatDemo.findIndex(message => message.audio);

export function ListChat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const beat = usePlayOnce(chatRef, beats);
  const animating = beat !== Infinity;
  const shown = (at: number) => (animating ? beat >= at : null);
  const audioState = !animating || beat >= 5 ? 'heard' : beat === 4 ? 'playing' : 'idle';
  const heard = chatDemo[audioIndex]?.heard ?? '';

  // Celular minimalista feito só com formas (moldura, ilha, barra de status, botões e barra inferior).
  return <div className="phone-wrap">
    <div className="phone">
      <span className="phone-btn phone-btn--action" aria-hidden="true" /><span className="phone-btn phone-btn--up" aria-hidden="true" /><span className="phone-btn phone-btn--down" aria-hidden="true" /><span className="phone-btn phone-btn--power" aria-hidden="true" />
      <div className="phone-screen list-chat" ref={chatRef}>
        <div className="phone-status" aria-hidden="true"><time>9:41</time><span className="phone-island" /><span className="phone-icons"><span className="phone-signal"><i /><i /><i /><i /></span><span className="phone-battery" /></span></div>
    <ChatHeader />
    <ChatBody>
      {chatDemo.map((message, index) => <Fragment key={index}>
        <Message from={message.from} time={message.time} className={reveal(shown(messageBeat[index]))}>
          {message.audio ? <AudioMessage duration={message.audio} state={audioState} listenMs={listenMs} /> : message.text}
          {message.list && <ListCard title="Lista de compras" items={message.list.flatMap(group => group.items.map(item => ({ group: group.group, item })))} />}
        </Message>
        {/* Logo depois do áudio: a SIA ouvindo e, em seguida, o que ela entendeu, no mesmo lugar (sem pular). */}
        {index === audioIndex && <div className="ai-slot">
          <AiUnderstood text={heard} className={reveal(shown(5))} />
          {animating && <AiListening className={reveal(beat === 4)} />}
        </div>}
      </Fragment>)}
      <SystemPill className={reveal(shown(10))}>Lista enviada para a equipe</SystemPill>
    </ChatBody>
    <ChatComposer />
        <span className="phone-home" aria-hidden="true" />
      </div>
    </div>
    <span className="preview-label">Exemplo ilustrativo de atendimento</span>
  </div>;
}

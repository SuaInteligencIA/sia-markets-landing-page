import { Fragment, useEffect, useRef } from 'react';
import { AiListening, AiUnderstood, AudioMessage, ChatBody, ChatHeader, ChatComposer, ListCard, Message, SystemPill, reveal } from './ChatDemo';
import { chatDemo } from './content';
import { bottomOfVisible, glide } from './glide';
import { usePlayOnce } from './usePlayOnce';
import { AnimatedGradient } from './gradient/AnimatedGradient';

// Conversa da seção "Lista de compras": acontece uma vez, na primeira vez que o visitante chega nela.
// Momentos (ms): três mensagens do cliente, SIA ouvindo o áudio, SIA entendeu, lista, pergunta,
// resposta, confirmação e o selo final.
const beats = [600, 2200, 3800, 4800, 8000, 10800, 14400, 16200, 18200, 20000];
const listenMs = beats[4] - beats[3];
// Em que momento cada mensagem de `chatDemo` aparece (na ordem do array).
const messageBeat = [1, 2, 3, 6, 7, 8, 9];
const audioIndex = chatDemo.findIndex(message => message.audio);

export function ListChat() {
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const beat = usePlayOnce(chatRef, beats);
  const played = useRef(false);

  // A cada mensagem nova, a tela do celular desliza até ela. No fim, fica mostrando a última.
  useEffect(() => {
    const body = scrollRef.current;
    if (!body) return;
    if (beat !== Infinity) played.current = true;
    else if (!played.current) return; // sem animação (pré-render ou movimento reduzido): começa do topo
    return glide(body, bottomOfVisible(body));
  }, [beat]);
  const animating = beat !== Infinity;
  const shown = (at: number) => (animating ? beat >= at : null);
  const audioState = !animating || beat >= 5 ? 'heard' : beat === 4 ? 'playing' : 'idle';
  const heard = chatDemo[audioIndex]?.heard ?? '';

  // Celular minimalista feito só com formas (moldura, ilha, barra de status, botões e barra inferior).
  return <div className="phone-wrap">
    <AnimatedGradient className="list-stage-gradient" />
    <div className="phone">
      <span className="phone-btn phone-btn--action" aria-hidden="true" /><span className="phone-btn phone-btn--up" aria-hidden="true" /><span className="phone-btn phone-btn--down" aria-hidden="true" /><span className="phone-btn phone-btn--power" aria-hidden="true" />
      <div className="phone-screen list-chat" ref={chatRef}>
        <div className="phone-status" aria-hidden="true"><time>9:41</time><span className="phone-island" /><span className="phone-icons"><span className="phone-signal"><i /><i /><i /><i /></span><span className="phone-battery" /></span></div>
    <ChatHeader />
    <ChatBody scrollRef={scrollRef} label="Conversa de exemplo no celular">
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

import { BASE } from './base';
import { BarChart3, Check, MessagesSquare, Users } from './icons';
import { AudioMessage, ChatBody, ListCard, Message } from './ChatDemo';

// Equipe com os retratos fictícios dos nossos outros sites; clientes com as próprias fotos fictícias.
const team = [
  { name: 'Ana', photo: 'ana-costa' },
  { name: 'Rafael', photo: 'rafael-lima' },
  { name: 'Julia', photo: 'julia-martins' },
];

const conversations = [
  { photo: 'marina-souza', name: 'Marina Souza', text: 'Entrega, por favor!', time: 'Agora', unread: 0, assignee: 0, tag: 'Pedido' },
  { photo: 'paulo-mendes', name: 'Paulo Mendes', text: 'Chegou certinho, obrigado!', time: '14:32', unread: 0, assignee: 1, tag: 'Entregue' },
  { photo: 'sonia-ribeiro', name: 'Sônia Ribeiro', text: 'Vocês entregam no Centro?', time: '14:25', unread: 2, assignee: 2, tag: 'Dúvida' },
];

function Photo({ name, size }: { name: string; size: number }) {
  return <img src={`${BASE}images/people/${name}.webp`} width={size} height={size} alt="" loading="lazy" decoding="async" />;
}

function TeamPhoto({ index, size }: { index: number; size: number }) {
  return <Photo name={team[index].photo} size={size} />;
}

export function CrmPreview() {
  return <div className="crm-preview" role="img" aria-label="Ilustração do CRM: a equipe Ana, Rafael e Julia atende no mesmo WhatsApp do supermercado; na conversa aberta, a SIA montou a lista da cliente Marina Souza e a atendente Ana pode registrar a venda">
    <div className="crm-sidebar">
      <img src={`${BASE}brand/icon.svg`} alt="" width="26" height="26" />
      <span className="crm-nav selected"><MessagesSquare size={18} /></span>
      <span className="crm-nav"><Users size={18} /></span>
      <span className="crm-nav"><BarChart3 size={18} /></span>
      <span className="crm-team">{team.map((member, index) => <span key={member.name} className="crm-team-member"><TeamPhoto index={index} size={30} /><span className="online" /></span>)}</span>
    </div>
    <div className="crm-inbox">
      <div className="crm-topline"><strong>Conversas</strong><span className="crm-count">3</span></div>
      <div className="crm-filters"><span className="active">Todas</span><span>Minhas</span><span>Aguardando</span></div>
      {conversations.map((conversation, index) => <div key={conversation.name} className={`inbox-person ${index === 0 ? 'active' : ''}`}>
        <span className="person-avatar"><Photo name={conversation.photo} size={30} /></span>
        <div className="inbox-text"><strong>{conversation.name}</strong><span>{conversation.text}</span><em className="inbox-tag">{conversation.tag}</em></div>
        <div className="inbox-side"><small>{conversation.time}</small><span className="inbox-badges">{conversation.unread > 0 && <span className="unread">{conversation.unread}</span>}<span className="assignee"><TeamPhoto index={conversation.assignee} size={18} /></span></span></div>
      </div>)}
    </div>
    <div className="crm-chat">
      <div className="chat-topline">
        <span className="person-avatar"><Photo name="marina-souza" size={30} /></span>
        <div><strong>Marina Souza</strong><small>WhatsApp · atendida por <span className="topline-agent"><TeamPhoto index={0} size={16} /> Ana</span></small></div>
        <span className="crm-register"><Check size={14} /> Registrar venda</span>
      </div>
      <ChatBody>
        <Message from="cliente" time="09:41">Oi! Preciso de arroz, feijão e óleo</Message>
        <Message from="cliente" time="09:42"><AudioMessage duration="0:08" /></Message>
        <Message from="sia" time="09:42">Sua lista ficou assim:<ListCard title="Lista de compras" items={[{ group: 'Mercearia', item: 'Arroz 5 kg' }, { group: 'Mercearia', item: 'Feijão carioca 1 kg' }, { group: 'Mercearia', item: 'Óleo de soja' }]} /></Message>
        <Message from="cliente" time="09:43">Entrega, por favor!</Message>
      </ChatBody>
    </div>
  </div>;
}

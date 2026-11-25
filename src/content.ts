// Número comercial (o mesmo do SIA Reserve) e endereço do site, numa subpasta do site da Sua InteligêncIA.
export const WHATSAPP_NUMBER = '5531995342318';
export const SITE_URL = 'https://suainteligenc.ia.br/markets/';

export function whatsappUrl(message = 'Olá! Quero conhecer o SIA Markets para o meu supermercado.'): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Ex.: '55' '31' '99999' '0000' → '+55 31 99999-0000' (ou com outro separador, como '-' para dados estruturados).
export function formatPhone(number: string, separator = ' '): string {
  return `+${number.slice(0, 2)}${separator}${number.slice(2, 4)}${separator}${number.slice(4, -4)}-${number.slice(-4)}`;
}

export const contact = {
  phone: formatPhone(WHATSAPP_NUMBER),
  phoneHref: `tel:+${WHATSAPP_NUMBER}`,
  whatsapp: whatsappUrl(),
};

export const socials = [
  { name: 'Instagram', label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/suainteligenc.ia/' },
  { name: 'LinkedIn', label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/x3inteligencia/' },
  { name: 'WhatsApp', label: 'WhatsApp', icon: 'whatsapp', href: whatsappUrl() },
];

export const company = {
  name: 'SIA Markets',
  legalName: 'X3 Inteligencia Digital LTDA',
  cnpj: '61.867.350/0001-44',
  parentName: 'Sua InteligêncIA',
  website: 'https://suainteligenc.ia.br/',
  privacyUrl: 'https://app.suainteligenc.ia.br/terms/privacy-policy',
  copyright: '© 2026 Sua InteligêncIA. Todos os direitos reservados.',
};

// Cada item entra quando a seção correspondente existe na página.
export const nav: { label: string; href: string }[] = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Painel', href: '#painel' },
  { label: 'Lista de compras', href: '#lista' },
  { label: 'Sua agente', href: '#sua-agente' },
  { label: 'Dúvidas', href: '#duvidas' },
];

// Troque por { kind: 'scene', name: 'hero-mercado', alt: '...' } quando a imagem nova chegar
// (arquivos public/images/hero-mercado-{768,1024,1536}.avif e hero-mercado.webp).
export const heroImage: { kind: 'mascot' } | { kind: 'scene'; name: string; alt: string } = {
  kind: 'scene',
  name: 'hero-mercado',
  alt: 'SIA, a agente de IA de uniforme azul, olhando o celular em um supermercado, ao lado de caixas de frutas e verduras, com um balão de lista confirmada',
};

export const benefits = [
  { label: 'Vendas no painel', icon: 'chart' },
  { label: 'Lista montada pela IA', icon: 'list' },
  { label: 'Equipe desafogada', icon: 'users' },
  { label: 'Um só WhatsApp', icon: 'whatsapp' },
];

export const problems = [
  {
    title: 'Quanto vendeu? Ninguém sabe.',
    description: 'Os pedidos pelo WhatsApp viram entregas, mas no fim do mês não existe um total. O canal vende, só que não aparece nos números.',
    icon: 'chart',
  },
  {
    title: 'Lista ditada aos pedaços',
    description: 'O cliente manda um item, depois um áudio, depois mais dois. O atendente para tudo para juntar a lista e conferir se não faltou nada.',
    icon: 'mic',
  },
  {
    title: 'Equipe sufocada no pico',
    description: 'Na sexta à tarde e na véspera de feriado, as mensagens acumulam, o cliente espera e a equipe não dá conta de responder todo mundo.',
    icon: 'timer',
  },
];

export const steps = [
  {
    id: 'pedido',
    number: '01',
    title: 'O cliente chama no WhatsApp',
    description: 'Do jeito que ele já faz hoje: mensagem de texto, áudio ou a lista inteira de uma vez, no WhatsApp do seu supermercado.',
  },
  {
    id: 'lista',
    number: '02',
    title: 'A IA monta a lista',
    description: 'O agente de IA atende na hora, entende o que o cliente pediu, organiza tudo numa lista e confirma com ele antes de passar para a equipe.',
  },
  {
    id: 'separacao',
    number: '03',
    title: 'A equipe separa e envia',
    description: 'Seu atendente recebe a lista pronta, separa os produtos e envia, sem precisar reler a conversa inteira.',
  },
  {
    id: 'painel',
    number: '04',
    title: 'A venda vai para o painel',
    description: 'Ao finalizar o atendimento, a equipe registra a venda. Ela entra no painel, e você acompanha quanto o supermercado vendeu pelo WhatsApp.',
  },
];

// Valores fictícios do painel ilustrativo (412 vendas × R$ 117 ≈ R$ 48.200).
export const dashboardDemo = {
  period: 'Últimos 7 dias',
  kpis: [
    { label: 'Vendido pelo WhatsApp', value: 'R$ 48.200', icon: 'chart' },
    { label: 'Vendas registradas', value: '412', icon: 'receipt' },
    { label: 'Ticket médio', value: 'R$ 117', icon: 'bag' },
    { label: 'Atendimentos finalizados', value: '538', icon: 'messages' },
  ],
  byDay: [
    { day: 'Seg', value: 46 }, { day: 'Ter', value: 52 }, { day: 'Qua', value: 49 }, { day: 'Qui', value: 58 },
    { day: 'Sex', value: 81 }, { day: 'Sáb', value: 77 }, { day: 'Dom', value: 49 },
  ],
  // Atendentes com os retratos fictícios dos nossos outros sites.
  byAgent: [
    { name: 'Ana', photo: 'ana-costa', sales: 152 },
    { name: 'Rafael', photo: 'rafael-lima', sales: 138 },
    { name: 'Julia', photo: 'julia-martins', sales: 122 },
  ],
};

export const dashboardHighlights = [
  'Total vendido pelo WhatsApp no período',
  'Quantidade de vendas e ticket médio',
  'Atendimentos finalizados',
  'Vendas de cada atendente e de cada dia',
];

// Conversa ilustrativa: itens comuns, sem preço, marca ou disponibilidade.
export const chatDemo: { from: 'cliente' | 'sia'; text?: string; audio?: string; list?: { group: string; items: string[] }[] }[] = [
  { from: 'cliente', text: 'Oi! Preciso de arroz, feijão e óleo' },
  { from: 'cliente', text: 'ah, e 6 caixas de leite' },
  { from: 'cliente', audio: '0:08' },
  {
    from: 'sia',
    text: 'Entendi o áudio também! Sua lista ficou assim:',
    list: [
      { group: 'Mercearia', items: ['Arroz 5 kg', 'Feijão carioca 1 kg', 'Óleo de soja'] },
      { group: 'Laticínios', items: ['Leite integral (6 caixas)'] },
      { group: 'Padaria', items: ['Pão francês (10 unidades)'] },
      { group: 'Hortifrúti', items: ['Banana prata (1 dúzia)'] },
    ],
  },
  { from: 'sia', text: 'É para entrega ou retirada?' },
  { from: 'cliente', text: 'Entrega, por favor!' },
];

export const teamGains = [
  { title: 'A lista chega pronta', description: 'O atendente recebe os itens organizados e confirmados com o cliente. É só separar.', icon: 'list' },
  { title: 'Menos tempo digitando', description: 'A IA junta os pedidos soltos, entende áudio e tira as dúvidas comuns. A equipe para de copiar mensagem por mensagem.', icon: 'messages' },
  { title: 'Mais fôlego no pico', description: 'Quando as mensagens acumulam, a IA responde todo mundo na hora e a equipe cuida de separar e entregar.', icon: 'timer' },
];

export const agentPersonalization = [
  { title: 'O seu tom de voz', description: 'Conversas naturais por texto ou áudio, com a simpatia do atendimento do seu balcão.', icon: 'customize' },
  { title: 'As informações do seu supermercado', description: 'Horários, bairros atendidos, formas de pagamento e regras de entrega ficam na memória da sua agente.', icon: 'book' },
  { title: 'Os seus roteiros de atendimento', description: 'Do primeiro "oi" à lista confirmada, cada etapa segue o jeito que a sua equipe trabalha.', icon: 'messages' },
];

export const crmHighlights = [
  'Um WhatsApp para toda a equipe',
  'Atendimentos distribuídos entre os atendentes',
  'Histórico de cada cliente',
  'Venda registrada ao finalizar o atendimento',
];

export const faqs = [
  {
    question: 'Como eu sei quanto o supermercado vendeu pelo WhatsApp?',
    answer: 'Ao finalizar cada atendimento, sua equipe registra a venda no CRM. Essas vendas formam o painel, onde você acompanha o total vendido pelo WhatsApp, a quantidade de vendas, o ticket médio e as vendas de cada atendente.',
  },
  {
    question: 'A IA substitui a minha equipe?',
    answer: 'Não. O agente de IA atende o cliente, monta a lista de compras e confirma o pedido. Sua equipe continua separando, enviando e registrando a venda, só que com a lista pronta e muito menos mensagem para digitar.',
  },
  {
    question: 'Funciona com o WhatsApp que o supermercado já usa?',
    answer: 'O atendimento acontece no WhatsApp do seu supermercado, conectado ao nosso CRM. Na conversa com o nosso time, avaliamos o número que você usa hoje e explicamos como fica a conexão no seu caso.',
  },
  {
    question: 'Preciso entender de tecnologia?',
    answer: 'Não. Nosso time acompanha a implantação e orienta a equipe. No dia a dia, seus atendentes conversam pelo CRM e você acompanha os números pelo painel.',
  },
  {
    question: 'Quanto tempo leva para começar?',
    answer: 'Depende das informações do seu supermercado e de como a sua equipe atende hoje. O prazo é combinado na primeira conversa com o nosso time.',
  },
];

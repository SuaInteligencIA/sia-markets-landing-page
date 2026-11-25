// PROVISÓRIO: confirmar com o Samuel o número comercial e o domínio do SIA Markets.
export const WHATSAPP_NUMBER = '5531995342318';
export const SITE_URL = 'https://siamarkets.com.br/';

export function whatsappUrl(message = 'Olá! Quero conhecer o SIA Markets para o meu supermercado.'): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const contact = {
  phone: '+55 31 99534-2318',
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
];

// Troque por { kind: 'scene', name: 'hero-mercado', alt: '...' } quando a imagem nova chegar
// (arquivos public/images/hero-mercado-{768,1024,1536}.avif e hero-mercado.webp).
export const heroImage: { kind: 'mascot' } | { kind: 'scene'; name: string; alt: string } = { kind: 'mascot' };

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

// PROVISÓRIO: confirmar com o Samuel o número comercial e o domínio do SIA Markets.
export const WHATSAPP_NUMBER = '5531995342318';
export const SITE_URL = 'https://siamarkets.com.br/';

export function whatsappUrl(message = 'Olá! Quero conhecer o SIA Markets para o meu mercado.'): string {
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
export const nav: { label: string; href: string }[] = [];

// Troque por { kind: 'scene', name: 'hero-mercado', alt: '...' } quando a imagem nova chegar
// (arquivos public/images/hero-mercado-{768,1024,1536}.avif e hero-mercado.webp).
export const heroImage: { kind: 'mascot' } | { kind: 'scene'; name: string; alt: string } = { kind: 'mascot' };

export const benefits = [
  { label: 'Vendas no painel', icon: 'chart' },
  { label: 'Lista montada pela IA', icon: 'list' },
  { label: 'Equipe desafogada', icon: 'users' },
  { label: 'Um só WhatsApp', icon: 'whatsapp' },
];

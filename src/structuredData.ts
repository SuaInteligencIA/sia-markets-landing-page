import { company, contact, faqs, SITE_URL, socials, WHATSAPP_NUMBER } from './content';

const title = 'SIA Markets | Saiba quanto seu supermercado vende pelo WhatsApp';
const description = 'Painel de vendas e atendimentos do WhatsApp para supermercados, com agente de IA que atende seus clientes e monta a lista de compras para a sua equipe.';

// Dados estruturados gerados a partir do mesmo conteúdo da página, para o FAQ nunca divergir.
// Sem avaliações nem notas: o site não publica depoimentos.
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: company.parentName,
      legalName: company.legalName,
      taxID: company.cnpj,
      url: company.website,
      logo: `${SITE_URL}brand/icon.svg`,
      contactPoint: { '@type': 'ContactPoint', telephone: contact.phone.replace(/\s/g, '-').replace('-', ''), contactType: 'sales', availableLanguage: 'pt-BR', url: `https://wa.me/${WHATSAPP_NUMBER}` },
      sameAs: socials.filter(social => social.name !== 'WhatsApp').map(social => social.href),
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}#website`, url: SITE_URL, name: company.name, inLanguage: 'pt-BR', publisher: { '@id': `${SITE_URL}#organization` } },
    { '@type': 'WebPage', '@id': `${SITE_URL}#webpage`, url: SITE_URL, name: title, description, inLanguage: 'pt-BR', isPartOf: { '@id': `${SITE_URL}#website` }, publisher: { '@id': `${SITE_URL}#organization` } },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}#produto`,
      name: company.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description,
      audience: { '@type': 'BusinessAudience', name: 'Supermercados de pequeno e médio porte' },
      provider: { '@id': `${SITE_URL}#organization` },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}#duvidas`,
      mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
    },
  ],
};

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, BarChart3, Book, Bot, Check, Customize, Globe2, Instagram, Linkedin, ListCheck, Menu, MessagesSquare, Mic, Plus, Sparkles, Timer, Users, WhatsApp, X, Sparks, WhatsAppFilled } from './icons';
import { BASE } from './base';
import { agentPersonalization, benefits, company, contact, crmHighlights, dashboardHighlights, faqs, heroImage, nav, problems, socials, teamGains, whatsappUrl } from './content';
import { structuredData } from './structuredData';
import { DashboardPreview } from './DashboardPreview';
import { CrmPreview } from './CrmPreview';
import { HowItWorks } from './HowItWorks';
import { ListChat } from './ListChat';
import { AnimatedGradient } from './gradient/AnimatedGradient';
import { PoweredBadge } from './PoweredBadge';

const talkUrl = whatsappUrl('Olá! Quero conhecer o SIA Markets e ver como ele funciona no meu supermercado.');

function FeatureIcon({ name, size = 22 }: { name: string; size?: number }) {
  const icons: Record<string, typeof Bot> = { bot: Bot, messages: MessagesSquare, whatsapp: WhatsApp, chart: BarChart3, list: ListCheck, users: Users, mic: Mic, timer: Timer, customize: Customize, book: Book, sparkles: Sparkles, instagram: Instagram, linkedin: Linkedin };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}

function ExternalLink({ children, href = talkUrl, className = '', ...props }: { children: ReactNode; href?: string; className?: string; 'aria-label'?: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}

function TalkButton({ className = 'button button-primary', href = talkUrl }: { className?: string; href?: string }) {
  return <ExternalLink className={className} href={href}>Fale com a gente<ArrowUpRight size={17} aria-hidden="true" /></ExternalLink>;
}

function HeroArt() {
  if (heroImage.kind === 'scene') {
    const { name, alt } = heroImage;
    return <div className="hero-art"><picture><source type="image/avif" srcSet={`${BASE}images/${name}-768.avif 768w, ${BASE}images/${name}-1024.avif 1024w, ${BASE}images/${name}-1536.avif 1536w, ${BASE}images/${name}-2048.avif 2048w`} sizes="(max-width:950px) 73vw, (max-width:1180px) 66vw, 64vw" /><img src={`${BASE}images/${name}.webp`} alt={alt} width="1536" height="1024" fetchPriority="high" /></picture></div>;
  }
  return <div className="hero-art hero-art--mascot">
    <div className="hero-mascot-glow" aria-hidden="true" />
    <img className="hero-mascot" src={`${BASE}brand/sia-agente.webp`} srcSet={`${BASE}brand/sia-agente-400.webp 400w, ${BASE}brand/sia-agente.webp 500w`} sizes="(max-width:760px) 260px, 420px" width="500" height="889" alt="SIA, a agente de IA do SIA Markets, de uniforme azul, segurando um celular" fetchPriority="high" />
    <div className="hero-float hero-float--list" aria-hidden="true"><ListCheck size={18} /><span>Lista pronta para separar</span></div>
    <div className="hero-float hero-float--sales" aria-hidden="true"><BarChart3 size={18} /><span>Venda registrada no painel</span></div>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const headerRef = useRef<HTMLElement>(null);

  // Um único par de ouvintes desde a montagem: o estado atual do menu vem da ref, então Esc funciona
  // mesmo no primeiro instante depois de abrir (o efeito do Preact só roda depois da pintura).
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpenRef.current) { document.getElementById('mobile-toggle')?.focus(); setMenuOpen(false); } };
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, []);

  const closeNav = () => setMenuOpen(false);

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header" ref={headerRef}>
      <a className="brand" href="#inicio" onClick={closeNav} aria-label="SIA Markets — início"><img src={`${BASE}brand/logo.svg`} width="164" height="35" alt="SIA Markets" /></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{nav.filter(item => item.href !== '#duvidas').map(item => <a key={item.href} className="nav-link" href={item.href} onClick={closeNav}>{item.label}</a>)}</nav>
      <div className="header-right">{nav.some(item => item.href === '#duvidas') && <a className="nav-link help-link" href="#duvidas" onClick={closeNav}>Dúvidas</a>}<TalkButton className="button button-small button-primary header-contact" /></div>
      <button id="mobile-toggle" className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X /> : <Menu />}</button>
      {menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Navegação móvel">{nav.map(item => <a key={item.href} href={item.href} onClick={closeNav}>{item.label}<ArrowUpRight size={19} /></a>)}<TalkButton /></nav>}
    </header>

    <main id="conteudo">
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <HeroArt />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><Sparks size={20} className="hero-sparks" /> IA PARA SUPERMERCADOS NO WHATSAPP</p>
          <h1 id="hero-title">Quanto o seu supermercado <br /><span>vende pelo WhatsApp?</span></h1>
          <p className="hero-description">Com o SIA Markets, cada venda feita pelo WhatsApp vai para um <strong>painel</strong> que você acompanha. E um <strong>agente de IA</strong> atende seus clientes e monta a lista de compras para a sua equipe.</p>
          <div className="button-row"><TalkButton /><a className="button button-light" href="#como-funciona">Veja como funciona</a></div>
          <p className="hero-note">Para supermercados de pequeno e médio porte.</p>
        </div>
        <a className="hero-explore" href="#beneficios" aria-label="Ver mais"><ArrowDown size={18} /></a>
      </section>

      <div className="benefit-strip" id="beneficios" aria-label="Benefícios do SIA Markets">{benefits.map(benefit => <span key={benefit.label}><FeatureIcon name={benefit.icon} />{benefit.label}</span>)}</div>

      <section className="section problem-section" id="problema" aria-labelledby="problem-title">
        <div className="section-heading centered"><p className="eyebrow">O QUE ACONTECE HOJE</p><h2 id="problem-title">Os pedidos chegam.<br /><span className="accent">Os números, não.</span></h2><p>O WhatsApp já vende para o seu supermercado.<br className="desktop-break" /> Falta enxergar quanto, e tirar o peso das costas da equipe.</p></div>
        <div className="problem-grid">{problems.map(problem => <article className="problem-card" key={problem.title}><span className="problem-icon"><FeatureIcon name={problem.icon} size={26} /></span><h3>{problem.title}</h3><p>{problem.description}</p></article>)}</div>
      </section>

      <HowItWorks />

      <section className="dashboard-section page-inset" id="painel" aria-labelledby="dashboard-title">
        <div className="dashboard-halo" aria-hidden="true" />
        <div className="dashboard-copy">
          <p className="eyebrow">SEU PAINEL</p>
          <h2 id="dashboard-title">Seu WhatsApp vendendo.<br /><span className="accent">Você vendo quanto.</span></h2>
          <p>Ao finalizar cada atendimento, sua equipe registra a venda. Ela entra no <strong>painel na hora</strong>, e você acompanha quanto o WhatsApp do seu supermercado vende, <strong>de onde estiver</strong>.</p>
          <ul className="dashboard-highlights">{dashboardHighlights.map(item => <li key={item}><Check size={19} aria-hidden="true" />{item}</li>)}</ul>
          <TalkButton className="button button-white" />
        </div>
        <div className="dashboard-visual"><DashboardPreview /></div>
      </section>

      <section className="list-banner page-inset" id="lista" aria-labelledby="list-title">
        <div className="list-banner-art"><picture><source media="(max-width:950px)" type="image/avif" srcSet={`${BASE}images/cliente-audio-recorte-640.avif 640w, ${BASE}images/cliente-audio-recorte-768.avif 768w, ${BASE}images/cliente-audio-recorte-1024.avif 1024w`} sizes="100vw" /><source type="image/avif" srcSet={`${BASE}images/cliente-audio-768.avif 768w, ${BASE}images/cliente-audio-1024.avif 1024w, ${BASE}images/cliente-audio-1536.avif 1536w, ${BASE}images/cliente-audio-2048.avif 2048w`} sizes="(max-width:950px) 100vw, min(1536px, calc(100vw - 64px))" /><img src={`${BASE}images/cliente-audio.webp`} width="1024" height="682" alt="Cliente na cozinha de casa mandando um áudio pelo celular, olhando a geladeira aberta e uma fruteira" loading="lazy" decoding="async" /></picture></div>
        <div className="list-banner-copy">
          <p className="eyebrow">LISTA DE COMPRAS SEM ESFORÇO</p>
          <h2 id="list-title">A lista sai pronta.<br /><span className="accent">A fila anda.</span></h2>
          <p>Seu cliente manda o pedido do jeito que fala: aos pedaços, por texto ou por áudio. O agente de IA junta tudo, organiza e confirma. Para o cliente, <strong>comprar fica mais fácil</strong>. Para a equipe, <strong>o atendimento anda mais rápido</strong>.</p>
        </div>
      </section>

      <section className="section list-section" aria-label="Exemplo de lista montada pela IA e ganhos para a equipe">
        <div className="list-stage">
          <ListChat />
        </div>
        <div className="team-panel">
          <div className="team-art"><picture><source type="image/avif" srcSet={`${BASE}images/separacao-pedido-640.avif 640w, ${BASE}images/separacao-pedido-768.avif 768w, ${BASE}images/separacao-pedido-1024.avif 1024w, ${BASE}images/separacao-pedido-1536.avif 1536w`} sizes="(max-width:950px) calc(100vw - 40px), 46vw" /><img src={`${BASE}images/separacao-pedido.webp`} width="1024" height="682" alt="Atendente de avental azul embalando um pedido em sacolas de papel, com a lista confirmada no celular sobre o balcão" loading="lazy" decoding="async" /></picture></div>
          <h3 className="team-title">Sua equipe recebe tudo pronto.</h3>
          <div className="team-gains">{teamGains.map(gain => <div className="team-gain" key={gain.title}><span className="team-gain-icon"><FeatureIcon name={gain.icon} size={22} /></span><div><h4>{gain.title}</h4><p>{gain.description}</p></div></div>)}</div>
        </div>
      </section>

      <section className="agent-section page-inset" id="sua-agente" aria-labelledby="agent-title">
        <div className="agent-portrait">
          <div className="agent-orbit" aria-hidden="true" />
          <img className="agent-mascot" src={`${BASE}brand/sia-agente.webp`} srcSet={`${BASE}brand/sia-agente-320.webp 320w, ${BASE}brand/sia-agente-400.webp 400w, ${BASE}brand/sia-agente.webp 500w`} sizes="(max-width:760px) 55vw, (max-width:1180px) 42vw, 500px" width="500" height="889" alt="SIA, a agente de IA de cabelos escuros com mechas azuis e uniforme azul, segurando um celular" loading="lazy" decoding="async" />
        </div>
        <div className="agent-copy">
          <p className="eyebrow">UMA AGENTE ÚNICA. COMO O SEU SUPERMERCADO.</p>
          <h2 id="agent-title">Sou a SIA.<br /><span>Do jeito do seu supermercado.</span></h2>
          <p className="agent-description">Seu supermercado tem clientes fiéis e um jeito próprio de atender. A SIA aprende esse jeito e conversa com a cara da sua loja.</p>
          <div className="agent-features">{agentPersonalization.map(feature => <div className="agent-feature" key={feature.title}><span className="agent-feature-icon"><FeatureIcon name={feature.icon} size={22} /></span><div><h3>{feature.title}</h3><p>{feature.description}</p></div></div>)}</div>
          <TalkButton href={whatsappUrl('Olá! Quero conhecer a agente SIA para o meu supermercado.')} />
        </div>
      </section>

      <section className="section crm-section" id="crm" aria-labelledby="crm-title">
        <article className="product-card crm-product"><div className="product-art crm-art"><AnimatedGradient className="crm-gradient" /><CrmPreview /><span className="image-label crm-label"><span className="label-icon"><WhatsAppFilled size={17} /></span><span className="label-text">Um número para toda a equipe</span><span className="label-avatars" aria-hidden="true">{['ana-costa', 'rafael-lima', 'julia-martins'].map(name => <img key={name} src={`${BASE}images/people/${name}.webp`} width="24" height="24" alt="" loading="lazy" decoding="async" />)}</span></span></div></article>
        <div className="crm-copy">
          <p className="eyebrow">CRM DA SIA</p>
          <h2 id="crm-title">Toda a equipe<br /><span className="accent">no mesmo WhatsApp.</span></h2>
          <p>Um número só para o supermercado inteiro. Os atendimentos são distribuídos entre a equipe, e o histórico de cada cliente fica guardado: o que pediu, quando e com quem falou.</p>
          <ul className="crm-highlights">{crmHighlights.map(item => <li key={item}><Check size={19} aria-hidden="true" />{item}</li>)}</ul>
        </div>
      </section>

      <section className="section faq-section" id="duvidas" aria-labelledby="faq-title"><div className="faq-intro"><p className="eyebrow">PODE PERGUNTAR</p><h2 id="faq-title">Dúvidas de quem<br />tem supermercado.</h2><p>Algumas respostas para você<br className="desktop-break" /> conhecer melhor o SIA Markets.</p><ExternalLink className="text-link">Converse com o nosso time <span className="round-arrow"><ArrowUpRight size={18} /></span></ExternalLink></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${activeFaq === index ? 'active' : ''}`} key={faq.question}><h3><button id={`faq-question-${index}`} aria-expanded={activeFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setActiveFaq(activeFaq === index ? null : index)}>{faq.question}<Plus size={21} aria-hidden="true" /></button></h3><div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={activeFaq !== index}><p>{faq.answer}</p></div></div>)}</div></section>

      <section className="contact-banner page-inset" id="contato" aria-labelledby="contact-title"><div className="contact-halo" /><div className="contact-content"><p className="eyebrow">O PRÓXIMO PASSO É UMA CONVERSA</p><h2 id="contact-title">Venda pelo WhatsApp.<br />Saiba quanto.</h2><p>Conheça o SIA Markets e veja como o painel e a agente SIA<br className="desktop-break" /> funcionam no seu supermercado.</p><TalkButton className="button button-white" /><span className="contact-note">Uma conversa com o nosso time, sem compromisso.</span></div><div className="contact-spark spark-one" aria-hidden="true">✳</div><div className="contact-spark spark-two" aria-hidden="true">✳</div></section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a href="#inicio" aria-label="SIA Markets — voltar ao início"><img src={`${BASE}brand/logo.svg`} alt="SIA Markets" width="178" height="38" /></a><p>Suas vendas pelo WhatsApp,<br />na palma da mão.</p><div className="social-links">{socials.map(social => <ExternalLink key={social.name} href={social.href} className="icon-button" aria-label={social.label}><FeatureIcon name={social.icon} size={19} /></ExternalLink>)}</div><PoweredBadge href={company.website} /></div><div className="footer-column"><h3>Explore</h3><a href="#inicio">Início</a>{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><h3>Vamos conversar</h3><ExternalLink href={talkUrl}>Fale com a gente</ExternalLink><a href={contact.phoneHref}>{contact.phone}</a></div><div className="footer-column"><h3>Sobre a gente</h3><ExternalLink href={company.website}>SIA Markets é um produto Sua InteligêncIA <ArrowUpRight size={12} /></ExternalLink><ExternalLink href={company.privacyUrl}>Privacidade</ExternalLink><span className="footer-company">{company.legalName}<br />CNPJ {company.cnpj}</span></div></div><div className="footer-bottom"><span>{company.copyright}</span><span><Globe2 size={14} /> Brasil · Português</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={14} /></a></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </>;
}

export default App;

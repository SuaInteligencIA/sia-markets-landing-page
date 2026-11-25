import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, BarChart3, Bot, Globe2, Instagram, Linkedin, ListCheck, Menu, MessagesSquare, Sparkles, Users, WhatsApp, X } from './icons';
import { benefits, company, contact, heroImage, nav, socials, whatsappUrl } from './content';
import { PoweredBadge } from './PoweredBadge';

const talkUrl = whatsappUrl('Olá! Quero conhecer o SIA Markets e ver como ele funciona no meu mercado.');

function FeatureIcon({ name, size = 22 }: { name: string; size?: number }) {
  const icons: Record<string, typeof Bot> = { bot: Bot, messages: MessagesSquare, whatsapp: WhatsApp, chart: BarChart3, list: ListCheck, users: Users, sparkles: Sparkles, instagram: Instagram, linkedin: Linkedin };
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
    return <div className="hero-art"><picture><source type="image/avif" srcSet={`/images/${name}-768.avif 768w, /images/${name}-1024.avif 1024w, /images/${name}-1536.avif 1536w`} sizes="(max-width:950px) 73vw, (max-width:1180px) 66vw, 64vw" /><img src={`/images/${name}.webp`} alt={alt} width="1536" height="1024" fetchPriority="high" /></picture></div>;
  }
  return <div className="hero-art hero-art--mascot">
    <div className="hero-mascot-glow" aria-hidden="true" />
    <img className="hero-mascot" src="/brand/sia-agente.webp" srcSet="/brand/sia-agente-400.webp 400w, /brand/sia-agente.webp 500w" sizes="(max-width:760px) 260px, 420px" width="500" height="889" alt="SIA, a agente de IA do SIA Markets, de uniforme azul, segurando um celular" fetchPriority="high" />
    <div className="hero-float hero-float--list" aria-hidden="true"><ListCheck size={18} /><span>Lista pronta para separar</span></div>
    <div className="hero-float hero-float--sales" aria-hidden="true"><BarChart3 size={18} /><span>Venda registrada no painel</span></div>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && menuOpen) { document.getElementById('mobile-toggle')?.focus(); setMenuOpen(false); } };
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [menuOpen]);

  const closeNav = () => setMenuOpen(false);

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header" ref={headerRef}>
      <a className="brand" href="#inicio" onClick={closeNav} aria-label="SIA Markets — início"><img src="/brand/logo.svg" width="164" height="35" alt="SIA Markets" /></a>
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
          <p className="eyebrow hero-eyebrow"><span className="tiny-mark"><Sparkles size={14} /></span> IA PARA SUPERMERCADOS NO WHATSAPP</p>
          <h1 id="hero-title">Quanto o seu mercado <br /><span>vende pelo WhatsApp?</span></h1>
          <p className="hero-description">Com o SIA Markets, cada venda feita pelo WhatsApp vai para um <strong>painel</strong> que você acompanha. E um <strong>agente de IA</strong> atende seus clientes e monta a lista de compras para a sua equipe.</p>
          <div className="button-row"><TalkButton /></div>
          <p className="hero-note">Para supermercados de pequeno e médio porte.</p>
        </div>
        <a className="hero-explore" href="#beneficios" aria-label="Ver mais"><ArrowDown size={18} /></a>
      </section>

      <div className="benefit-strip" id="beneficios" aria-label="Benefícios do SIA Markets">{benefits.map(benefit => <span key={benefit.label}><FeatureIcon name={benefit.icon} />{benefit.label}</span>)}</div>
    </main>

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a href="#inicio" aria-label="SIA Markets — voltar ao início"><img src="/brand/logo.svg" alt="SIA Markets" width="178" height="38" /></a><p>Suas vendas pelo WhatsApp,<br />na palma da mão.</p><div className="social-links">{socials.map(social => <ExternalLink key={social.name} href={social.href} className="icon-button" aria-label={social.label}><FeatureIcon name={social.icon} size={19} /></ExternalLink>)}</div><PoweredBadge href={company.website} /></div><div className="footer-column"><h3>Explore</h3><a href="#inicio">Início</a>{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><h3>Vamos conversar</h3><ExternalLink href={talkUrl}>Fale com a gente</ExternalLink><a href={contact.phoneHref}>{contact.phone}</a></div><div className="footer-column"><h3>Sobre a gente</h3><ExternalLink href={company.website}>SIA Markets é um produto Sua InteligêncIA <ArrowUpRight size={12} /></ExternalLink><ExternalLink href={company.privacyUrl}>Privacidade</ExternalLink><span className="footer-company">{company.legalName}<br />CNPJ {company.cnpj}</span></div></div><div className="footer-bottom"><span>{company.copyright}</span><span><Globe2 size={14} /> Brasil · Português</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={14} /></a></div></footer>
  </>;
}

export default App;

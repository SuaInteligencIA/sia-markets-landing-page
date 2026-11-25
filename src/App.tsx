import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, BarChart3, Bot, Check, CheckCheck, ChevronRight, Globe2, Instagram, Linkedin, ListCheck, Menu, MessagesSquare, Mic, MoreHorizontal, ShoppingBag, Sparkles, Timer, Truck, Users, WhatsApp, X } from './icons';
import { benefits, company, contact, dashboardHighlights, heroImage, nav, problems, socials, steps, whatsappUrl } from './content';
import { DashboardPreview } from './DashboardPreview';
import { PoweredBadge } from './PoweredBadge';

const talkUrl = whatsappUrl('Olá! Quero conhecer o SIA Markets e ver como ele funciona no meu supermercado.');

function FeatureIcon({ name, size = 22 }: { name: string; size?: number }) {
  const icons: Record<string, typeof Bot> = { bot: Bot, messages: MessagesSquare, whatsapp: WhatsApp, chart: BarChart3, list: ListCheck, users: Users, mic: Mic, timer: Timer, sparkles: Sparkles, instagram: Instagram, linkedin: Linkedin };
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
  const [activeStep, setActiveStep] = useState(0);
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

      <section className="workflow-section page-inset" id="como-funciona" aria-labelledby="workflow-title">
        <div className="workflow-copy"><p className="eyebrow">COMO FUNCIONA</p><h2 id="workflow-title">Do pedido no WhatsApp<br />à venda no painel.</h2><div className="step-list" role="tablist" aria-label="Etapas do atendimento">{steps.map((step, index) => <button key={step.id} id={`step-tab-${index}`} role="tab" aria-selected={activeStep === index} aria-controls="step-panel" tabIndex={activeStep === index ? 0 : -1} onClick={() => setActiveStep(index)} onKeyDown={event => { const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']; if (!keys.includes(event.key)) return; event.preventDefault(); const last = steps.length - 1; const next = event.key === 'Home' ? 0 : event.key === 'End' ? last : ['ArrowDown', 'ArrowRight'].includes(event.key) ? (index === last ? 0 : index + 1) : (index === 0 ? last : index - 1); setActiveStep(next); document.getElementById(`step-tab-${next}`)?.focus(); }} className={`step ${activeStep === index ? 'active' : ''}`}><span className="step-number">{step.number}</span><span><strong>{step.title}</strong>{activeStep === index && <span className="step-description">{step.description}</span>}</span><ChevronRight size={20} aria-hidden="true" /></button>)}</div><ExternalLink className="text-link">Quero ver no meu supermercado <span className="round-arrow"><ArrowUpRight size={18} /></span></ExternalLink></div>
        <div className="workflow-visual" role="tabpanel" id="step-panel" aria-labelledby={`step-tab-${activeStep}`} tabIndex={0}>
          <div className="workflow-orbit orbit-one" /><div className="workflow-orbit orbit-two" />
          <StepVisual step={activeStep} />
        </div>
      </section>

      <section className="dashboard-section page-inset" id="painel" aria-labelledby="dashboard-title">
        <div className="dashboard-halo" aria-hidden="true" />
        <div className="dashboard-copy">
          <p className="eyebrow">SEU PAINEL</p>
          <h2 id="dashboard-title">Seu WhatsApp vendendo.<br /><span className="accent">Você vendo quanto.</span></h2>
          <p>Ao finalizar cada atendimento, sua equipe registra a venda. Ela entra no <strong>painel na hora</strong>, e você acompanha quanto o WhatsApp do seu supermercado vende, <strong>de onde estiver</strong>.</p>
          <ul className="dashboard-highlights">{dashboardHighlights.map(item => <li key={item}><Check size={19} aria-hidden="true" />{item}</li>)}</ul>
          <TalkButton className="button button-white" />
        </div>
        <div className="dashboard-visual"><DashboardPreview /><span className="dashboard-note">Imagem ilustrativa. Valores fictícios.</span></div>
      </section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a href="#inicio" aria-label="SIA Markets — voltar ao início"><img src="/brand/logo.svg" alt="SIA Markets" width="178" height="38" /></a><p>Suas vendas pelo WhatsApp,<br />na palma da mão.</p><div className="social-links">{socials.map(social => <ExternalLink key={social.name} href={social.href} className="icon-button" aria-label={social.label}><FeatureIcon name={social.icon} size={19} /></ExternalLink>)}</div><PoweredBadge href={company.website} /></div><div className="footer-column"><h3>Explore</h3><a href="#inicio">Início</a>{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</div><div className="footer-column"><h3>Vamos conversar</h3><ExternalLink href={talkUrl}>Fale com a gente</ExternalLink><a href={contact.phoneHref}>{contact.phone}</a></div><div className="footer-column"><h3>Sobre a gente</h3><ExternalLink href={company.website}>SIA Markets é um produto Sua InteligêncIA <ArrowUpRight size={12} /></ExternalLink><ExternalLink href={company.privacyUrl}>Privacidade</ExternalLink><span className="footer-company">{company.legalName}<br />CNPJ {company.cnpj}</span></div></div><div className="footer-bottom"><span>{company.copyright}</span><span><Globe2 size={14} /> Brasil · Português</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={14} /></a></div></footer>
  </>;
}

function AgentAvatar({ className = '' }: { className?: string }) {
  return <span className={`agent-avatar ${className}`}><img src="/brand/sia-agente-avatar.webp" width="160" height="284" alt="SIA, agente de IA do supermercado" /></span>;
}

function ChatHeader() {
  return <div className="chat-header"><AgentAvatar /><div><strong>SIA · Supermercado Bom Preço</strong><small>Atendendo pelo WhatsApp</small></div><Sparkles size={19} /></div>;
}

function StepVisual({ step }: { step: number }) {
  if (step === 0) return <div className="step-conversation"><ChatHeader /><p className="bubble guest-bubble">Oi! Queria fazer um pedido para entrega.</p><p className="bubble guest-bubble"><Mic size={14} aria-hidden="true" /> Áudio · 0:14</p><p className="bubble agent-bubble">Oi, Ana! Claro. Pode mandar tudo o que precisa, do jeito que for mais fácil.</p><span className="preview-label">Exemplo ilustrativo de atendimento</span></div>;
  if (step === 1) return <div className="step-conversation"><ChatHeader /><div className="bubble agent-bubble step-list-bubble"><strong>Sua lista ficou assim:</strong><ul><li>Arroz 5 kg</li><li>Feijão carioca 1 kg</li><li>Leite integral (6 unidades)</li><li>Pão francês (10 unidades)</li><li>Banana prata (1 dúzia)</li></ul>Está tudo certo? <CheckCheck size={13} aria-hidden="true" /></div><p className="bubble guest-bubble">Tudo certo!</p><span className="preview-label">Exemplo ilustrativo de atendimento</span></div>;
  if (step === 2) return <div className="order-preview"><div className="order-top"><ShoppingBag size={20} aria-hidden="true" /><div><strong>Pedido de Ana Costa</strong><small>Lista confirmada pela SIA · 5 itens</small></div></div><ul className="order-items">{['Arroz 5 kg', 'Feijão carioca 1 kg', 'Leite integral (6 unidades)', 'Pão francês (10 unidades)', 'Banana prata (1 dúzia)'].map((item, index) => <li key={item} className={index < 3 ? 'done' : ''}><Check size={17} aria-hidden="true" />{item}</li>)}</ul><div className="order-status"><Truck size={17} aria-hidden="true" /> Separando para entrega</div><span className="preview-label">Visualização ilustrativa</span></div>;
  return <div className="insights-preview"><div className="insights-top"><img src="/brand/icon.svg" width="26" height="26" alt="" /><span>Vendas pelo WhatsApp</span><MoreHorizontal size={18} /></div><p>Venda registrada.</p><strong>Direto no seu painel.</strong><div className="chart-bars" aria-hidden="true">{[36, 53, 44, 65, 57, 79, 72, 93].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div><div className="insights-foot"><span><BarChart3 /> Vendas</span><span><MessagesSquare /> Atendimentos</span><span><Users /> Equipe</span></div><span className="preview-label">Visualização ilustrativa</span></div>;
}

export default App;

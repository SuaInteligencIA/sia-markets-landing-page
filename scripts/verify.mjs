import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { preview } from 'vite';

// Termos que nunca podem aparecer no site publicado: o fornecedor do CRM, assuntos de estoque
// (o site não fala disso, nem para negar) e qualquer resto do site de hospedagem que serviu de base.
const FORBIDDEN = [/helena/i, /white.?label/i, /estoque/i, /\bsku/i, /cat[aá]logo/i, /prateleira/i, /invent[aá]rio/i,
  /h[oó]spede/i, /\breservas?\b/i, /pousada/i, /\bhote(l|is)\b/i, /hostel/i, /estadia/i, /\bOTA\b/, /\bPMS\b/,
  // Pedido do Samuel: sempre "supermercado", nunca "mercado" sozinho.
  /(?<![a-zà-ú-])mercados?\b/i,
  // Nome de exemplo não pode lembrar rede real (Bompreço).
  /bom ?pre[cç]o/i];

const content = await readFile('src/content.ts', 'utf8');
const WHATSAPP_NUMBER = content.match(/WHATSAPP_NUMBER = '(\d+)'/)?.[1];
assert.ok(WHATSAPP_NUMBER, 'WHATSAPP_NUMBER em src/content.ts');

// Sem SITE_URL, o teste sobe sozinho a prévia do build em dist/.
const server = process.env.SITE_URL ? null : await preview({ preview: { host: '127.0.0.1', port: 4175, strictPort: true }, logLevel: 'error' });
// O site é publicado numa subpasta (ex.: suainteligenc.ia.br/markets/); a prévia usa o mesmo caminho.
const SITE_URL_CONST = content.match(/SITE_URL = '([^']+)'/)[1];
const BASE_PATH = new URL(SITE_URL_CONST).pathname;
const baseUrl = process.env.SITE_URL || `http://127.0.0.1:4175${BASE_PATH}`;
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(file => file && existsSync(file));
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
const checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });

async function check(name, fn) {
  await fn();
  checks.push(name);
  console.log(`OK ${name}`);
}

async function accessibility(name) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  assert.deepEqual(results.violations.map(item => ({ rule: item.id, nodes: item.nodes.map(node => ({ target: node.target, reason: node.failureSummary })) })), [], name);
}

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}

async function noOverflow(widths) {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const metrics = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth }));
    assert.ok(metrics.documentWidth <= metrics.width, `Overflow em ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  await check('Endereço: tudo carrega de dentro da subpasta do site', async () => {
    const urls = await page.evaluate(() => [
      ...[...document.querySelectorAll('img, script[src]')].map(element => element.currentSrc || element.src),
      ...[...document.querySelectorAll('link[href]')].map(link => link.href),
      ...[...document.querySelectorAll('source[srcset], img[srcset], link[imagesrcset]')].flatMap(element => (element.getAttribute('srcset') || element.getAttribute('imagesrcset')).split(',').map(part => new URL(part.trim().split(' ')[0], location.href).href)),
    ]);
    const local = urls.filter(url => new URL(url).origin === new URL(baseUrl).origin);
    assert.ok(local.length > 10);
    assert.deepEqual(local.filter(url => !new URL(url).pathname.startsWith(BASE_PATH)), []);
  });

  await check('Página: idioma, título, fonte, imagens, âncoras e WhatsApp', async () => {
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.title(), /SIA Markets/);
    assert.match(await page.locator('h1').innerText(), /vende pelo WhatsApp/);
    assert.ok(await page.evaluate(() => document.fonts.check('16px "Space Grotesk"')));
    await page.evaluate(async () => { await Promise.all([...document.images].map(async image => { image.loading = 'eager'; await image.decode(); })); });
    assert.deepEqual(await page.evaluate(() => [...document.images].filter(image => !image.naturalWidth).map(image => image.src)), []);
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(anchor => anchor.getAttribute('href').length > 1 && !document.getElementById(anchor.getAttribute('href').slice(1))).map(anchor => anchor.outerHTML)), []);
    assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('a[target="_blank"]')].filter(anchor => !anchor.rel.includes('noopener') || !anchor.rel.includes('noreferrer')).map(anchor => anchor.href)), []);
    const whatsappLinks = await page.locator('a[href^="https://wa.me/"]').evaluateAll(anchors => anchors.map(anchor => anchor.href));
    assert.ok(whatsappLinks.length >= 3);
    assert.deepEqual(whatsappLinks.filter(href => new URL(href).pathname !== `/${WHATSAPP_NUMBER}`), []);
    assert.ok(whatsappLinks.every(href => /mercado/i.test(new URL(href).searchParams.get('text') || '')), 'Mensagem pré-escrita cita o mercado');
    assert.equal(await page.locator('.powered-badge').getAttribute('href'), 'https://suainteligenc.ia.br/');
  });

  await check('Palavras proibidas: nenhum arquivo publicado as contém', async () => {
    const found = [];
    for (const file of await filesIn('dist')) {
      if (!/\.(html|js|xml|txt|json|svg|webmanifest)$/.test(file)) continue;
      const text = await readFile(file, 'utf8');
      for (const pattern of FORBIDDEN) { const match = text.match(pattern); if (match) found.push(`${file}: "${match[0]}"`); }
    }
    assert.deepEqual(found, []);
  });

  await check('Botão principal: sempre "Fale com a gente"', async () => {
    const labels = await page.locator('.button-primary, .button-white').evaluateAll(buttons => buttons.map(button => button.textContent.trim()));
    assert.ok(labels.length >= 2);
    assert.deepEqual(labels.filter(label => label !== 'Fale com a gente'), []);
  });

  await check('Acessibilidade: página desktop sem violações axe WCAG A/AA', () => accessibility('Página desktop'));

  await check('Problema: três dores do dono do supermercado', async () => {
    assert.equal(await page.locator('#problema .problem-card').count(), 3);
  });

  await check('Etapas: cinco passos, teclado e ARIA', async () => {
    assert.equal(await page.locator('#como-funciona [role="tab"]').count(), 5);
    await page.locator('#step-tab-0').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#step-tab-1').getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'step-tab-1');
    await accessibility('Segunda etapa');
    await page.keyboard.press('End');
    assert.equal(await page.locator('#step-tab-4').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#step-panel .delivery-preview img').count(), 1, 'Última etapa: a entrega');
    assert.match(await page.locator('#step-panel .delivery-pill').innerText(), /entregue/i);
    await accessibility('Última etapa');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#step-tab-0').getAttribute('aria-selected'), 'true', 'Depois da última volta à primeira');
    await page.keyboard.press('ArrowUp');
    assert.equal(await page.locator('#step-tab-4').getAttribute('aria-selected'), 'true', 'Antes da primeira vai à última');
    assert.deepEqual(await page.locator('[role="tab"]').evaluateAll(tabs => tabs.filter(tab => !document.getElementById(tab.getAttribute('aria-controls'))).map(tab => tab.id)), []);
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#step-tab-0').getAttribute('aria-selected'), 'true');
    // Etapa da separação: a ilustração da atendente separando o pedido ao lado da lista.
    await page.locator('#step-tab-2').click();
    const orderArt = page.locator('#step-panel .order-art img');
    assert.equal(await orderArt.count(), 1);
    assert.match(await orderArt.evaluate(image => { image.loading = 'eager'; return image.decode().then(() => image.currentSrc); }), /separacao-etapa/, 'Atendente diferente da do bloco da equipe');
    // Etapa do painel: três indicadores legíveis, cada um com ícone, rótulo e número.
    await page.locator('#step-tab-3').click();
    const stats = page.locator('#step-panel .insights-stat');
    assert.equal(await stats.count(), 3);
    assert.deepEqual(await stats.evaluateAll(items => items.map(item => [item.querySelector('svg') !== null, item.querySelector('.insights-stat-value')?.textContent.trim()])), [[true, '412'], [true, '538'], [true, '3']]);
    await page.locator('#step-tab-0').click();
  });

  await check('Painel: ilustração acessível, quatro indicadores e sem rolagem lateral', async () => {
    const illustration = page.locator('#painel [role="img"]');
    assert.equal(await illustration.count(), 1);
    assert.match(await illustration.getAttribute('aria-label'), /ilustra/i);
    // Sem avisos visíveis de "ilustrativo" (decisão do Samuel); o leitor de tela ainda ouve que é ilustração.
    assert.doesNotMatch(await page.locator('main').innerText(), /ilustrativ|fict[ií]ci/i);
    for (const label of ['Vendido pelo WhatsApp', 'Vendas registradas', 'Ticket médio', 'Atendimentos finalizados']) {
      assert.equal(await page.locator('#painel .kpi').filter({ hasText: label }).count(), 1, label);
    }
    assert.equal(await page.locator('#painel .agent-row').count(), 3);
    // Atendentes com os retratos dos nossos outros sites.
    assert.deepEqual(await page.locator('#painel .agent-row img').evaluateAll(images => images.map(image => new URL(image.src).pathname.split('/').pop()).sort()), ['ana-costa.webp', 'julia-martins.webp', 'rafael-lima.webp']);
    await noOverflow([320, 375, 768]);
  });

  await check('Lista: conversa ilustrativa termina em lista organizada, sem preços', async () => {
    const chat = page.locator('.list-chat');
    assert.ok(await chat.locator('.guest-bubble .audio-message').count() >= 1, 'Ao menos um áudio do cliente');
    assert.ok(await chat.locator('.agent-bubble ul li').count() >= 5, 'Lista com 5 itens ou mais');
    assert.doesNotMatch(await chat.innerText(), /R\$|\d+,\d{2}/);
    assert.equal(await page.locator('.team-gain').count(), 3);
  });

  await check('Conversa: interface de chat com hora, áudio tocável, lista em cartão e barra de mensagem', async () => {
    const chat = page.locator('.list-chat');
    const bubbles = chat.locator('.bubble');
    assert.ok(await bubbles.count() >= 6);
    assert.equal(await chat.locator('.bubble .msg-meta time').count(), await bubbles.count(), 'Todo balão tem hora');
    const audio = chat.locator('.audio-message');
    assert.equal(await audio.locator('.audio-play').count(), 1, 'Botão de play no áudio');
    assert.ok(await audio.locator('.audio-wave span').count() >= 20, 'Onda sonora em barras');
    assert.equal(await chat.locator('.agent-bubble .list-card li .list-tag').count(), await chat.locator('.agent-bubble .list-card li').count(), 'Cada item com a seção');
    assert.equal(await chat.locator('.chat-composer').count(), 1, 'Barra de mensagem');
    // O balão acompanha o texto: o "Entrega, por favor!" não ocupa a largura toda.
    const shortBubble = await chat.locator('.guest-bubble').last().evaluate(bubble => bubble.getBoundingClientRect().width / bubble.parentElement.getBoundingClientRect().width);
    assert.ok(shortBubble < 0.6, `Balão curto ocupa ${Math.round(shortBubble * 100)}%`);
    await page.locator('#step-tab-0').click();
    assert.equal(await page.locator('#step-panel .typing-bubble').count(), 1, 'SIA digitando na primeira etapa');
  });

  await check('Imagens novas: topo, cliente mandando áudio e equipe separando', async () => {
    for (const [selector, name] of [['#inicio .hero-art img', 'hero-mercado'], ['#lista img', 'cliente-audio'], ['.team-panel img', 'separacao-pedido']]) {
      const image = page.locator(selector).first();
      assert.match(await image.evaluate(img => img.currentSrc), new RegExp(name), selector);
      assert.ok(await image.evaluate(img => img.complete && img.naturalWidth > 0), `${name} carregou`);
      assert.ok((await image.getAttribute('alt')).length > 10, `${name} tem texto alternativo`);
    }
  });

  await check('Agente: mascote e três formas de personalizar', async () => {
    assert.equal(await page.locator('#sua-agente .agent-feature').count(), 3);
    assert.ok(await page.locator('#sua-agente .agent-mascot').evaluate(image => image.complete && image.naturalWidth > 0));
  });

  await check('CRM: equipe e clientes com fotos e conversa legível', async () => {
    const crm = page.locator('.crm-preview');
    // Clientes com as próprias fotos (Marina, Paulo, Sônia), diferentes dos retratos da equipe.
    assert.deepEqual(await crm.locator('.inbox-person .person-avatar img').evaluateAll(images => images.map(image => new URL(image.src).pathname.split('/').pop())), ['marina-souza.webp', 'paulo-mendes.webp', 'sonia-ribeiro.webp'], 'Clientes com foto');
    assert.match(await crm.locator('.chat-topline .person-avatar img').getAttribute('src'), /marina-souza\.webp$/);
    assert.equal(await crm.locator('.inbox-person').count(), 3);
    assert.deepEqual(await crm.locator('.crm-team img').evaluateAll(images => images.map(image => new URL(image.src).pathname.split('/').pop()).sort()), ['ana-costa.webp', 'julia-martins.webp', 'rafael-lima.webp'], 'Equipe com fotos na barra lateral');
    assert.equal(await crm.locator('.inbox-person .assignee img').count(), 3, 'Cada conversa mostra a foto de quem atende');
    assert.match(await crm.locator('.chat-topline strong').innerText(), /Marina Souza/);
    assert.match(await crm.locator('.inbox-person.active').innerText(), /Marina Souza/);
    assert.equal(await crm.locator('.crm-register').count(), 1, 'Botão de registrar a venda');
    assert.doesNotMatch(await page.locator('main').innerText(), /Ana Costa|Oi, Ana/, 'Ana Costa é atendente, não cliente');
    // Legível: a tela não fica inclinada demais e o texto das mensagens tem tamanho de leitura no computador.
    const angle = await crm.evaluate(element => { const m = new DOMMatrix(getComputedStyle(element).transform); return Math.abs(Math.atan2(m.b, m.a) * 180 / Math.PI); });
    assert.ok(angle <= 2.5, `Inclinação de ${angle.toFixed(1)}°`);
    const fontSize = await crm.locator('.chat-body .bubble').first().evaluate(bubble => parseFloat(getComputedStyle(bubble).fontSize));
    assert.ok(fontSize >= 11, `Mensagens com ${fontSize}px`);
  });

  await check('Foto de perfil: mascote 3D recortada no rosto', async () => {
    const avatar = page.locator('.chat-header .agent-avatar img').first();
    await avatar.evaluate(image => { image.loading = 'eager'; return image.decode(); });
    const size = await avatar.evaluate(image => [image.naturalWidth, image.naturalHeight]);
    assert.equal(size[0], size[1], 'Recorte quadrado no rosto');
    assert.ok(size[0] >= 160);
  });

  await check('CRM: ilustração inteira visível no celular', async () => {
    for (const width of [320, 360, 375, 430]) {
      await page.setViewportSize({ width, height: 900 });
      const boxes = await page.locator('#crm .product-card').evaluate(card => {
        const frame = card.getBoundingClientRect();
        return [...card.querySelectorAll('.crm-chat, .crm-preview-caption, .image-label')].map(element => { const box = element.getBoundingClientRect(); return { name: element.className, inside: box.left >= frame.left - 1 && box.right <= frame.right + 1 }; });
      });
      assert.deepEqual(boxes.filter(box => !box.inside).map(box => box.name), [], `Recortado em ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  });

  await check('Configuração: domínio e telefone vêm de content.ts', async () => {
    const SITE_URL = content.match(/SITE_URL = '([^']+)'/)[1];
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), SITE_URL);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), SITE_URL);
    assert.ok((await page.locator('meta[property="og:image"]').getAttribute('content')).startsWith(SITE_URL));
    assert.ok((await readFile('dist/sitemap.xml', 'utf8')).includes(`<loc>${SITE_URL}</loc>`));
    // Nenhum arquivo-fonte repete o domínio ou o número: trocar a constante troca tudo.
    for (const file of ['index.html', 'src/App.tsx', 'src/structuredData.ts']) assert.doesNotMatch(await readFile(file, 'utf8'), new RegExp(`${new URL(SITE_URL).hostname.replaceAll('.', '\\.')}|${WHATSAPP_NUMBER.slice(4)}`), file);
    assert.equal((content.match(new RegExp(WHATSAPP_NUMBER.slice(4), 'g')) || []).length, 1, 'Número escrito uma vez só em content.ts');
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    assert.equal(graph[0].contactPoint.telephone, `+${WHATSAPP_NUMBER.slice(0, 2)}-${WHATSAPP_NUMBER.slice(2, 4)}-${WHATSAPP_NUMBER.slice(4, -4)}-${WHATSAPP_NUMBER.slice(-4)}`);
  });

  await check('FAQ: abrir, ler e recolher com teclado', async () => {
    assert.equal(await page.locator('#duvidas .faq-item').count(), 5);
    await page.locator('#faq-question-2').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#faq-question-2').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#faq-answer-2').isVisible(), true);
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#faq-answer-2').isVisible(), false);
  });

  await check('Chamada final: botão branco para o WhatsApp', async () => {
    assert.equal(await page.locator('#contato .button-white').getAttribute('href').then(href => new URL(href).hostname), 'wa.me');
  });

  await check('SEO: JSON-LD com organização, produto e perguntas do FAQ', async () => {
    const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
    const types = graph.map(item => item['@type']);
    for (const type of ['Organization', 'WebSite', 'WebPage', 'SoftwareApplication', 'FAQPage']) assert.ok(types.includes(type), type);
    assert.ok(graph.every(item => !item.review && !item.aggregateRating), 'Sem avaliações inventadas');
    const faqQuestions = graph.find(item => item['@type'] === 'FAQPage').mainEntity.map(entity => entity.name);
    assert.deepEqual(faqQuestions, await page.locator('#duvidas .faq-item h3 button').evaluateAll(buttons => buttons.map(button => button.textContent.trim())));
  });

  await check('Responsividade: 11 larguras de 320 a 1920px', async () => {
    await noOverflow([320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920]);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.header-contact').isVisible(), true);
    assert.equal(await page.locator('#mobile-toggle').isVisible(), true);
    await page.setViewportSize({ width: 1440, height: 1000 });
  });

  await check('Mobile: menu, foco e navegação', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#mobile-toggle').click();
    assert.equal(await page.locator('#mobile-menu .button-primary').isVisible(), true);
    await page.locator('#mobile-menu a').first().focus();
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'mobile-toggle');
    await page.locator('#mobile-toggle').click();
    await page.locator('#mobile-menu').getByRole('link', { name: 'Dúvidas', exact: true }).click();
    assert.equal(await page.locator('#mobile-menu').count(), 0);
    assert.equal(new URL(page.url()).hash, '#duvidas');
    await accessibility('Página mobile');
  });

  await check('Mobile paisagem: menu com rolagem própria', async () => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.locator('#mobile-toggle').click();
    const metrics = await page.locator('#mobile-menu').evaluate(menu => ({ bottom: menu.getBoundingClientRect().bottom, viewport: innerHeight, overflow: getComputedStyle(menu).overflowY }));
    assert.ok(metrics.bottom <= metrics.viewport + 1);
    assert.equal(metrics.overflow, 'auto');
    await page.locator('#mobile-menu .button-primary').scrollIntoViewIfNeeded();
    const cta = await page.locator('#mobile-menu .button-primary').boundingBox();
    assert.ok(cta.y + cta.height <= 376);
    await page.keyboard.press('Escape');
  });

  await check('Etapas: autoplay com a conversa, clique vira slide, volta após inatividade, pausa e movimento reduzido', async () => {
    // Página à parte, com movimento permitido e relógio controlado, para medir os tempos sem esperar de verdade.
    const motion = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    const live = await motion.newPage();
    live.on('pageerror', error => errors.push(error.message));
    await live.clock.install();
    await live.goto(baseUrl, { waitUntil: 'networkidle' });
    const selected = () => live.locator('#como-funciona [role="tab"][aria-selected="true"]').getAttribute('id');
    const bubbles = () => live.locator('#step-panel .chat-body > *').count();

    // Fora da tela, nada anda.
    await live.clock.runFor(12000);
    assert.equal(await selected(), 'step-tab-0', 'Parado enquanto a seção não aparece');

    await live.locator('#como-funciona').scrollIntoViewIfNeeded();
    await live.waitForFunction(() => document.querySelector('#como-funciona .step-progress:not(.is-paused)'));
    await live.clock.runFor(600);
    const early = await bubbles();
    await live.clock.runFor(2400);
    assert.ok(await bubbles() > early, 'A conversa vai aparecendo aos poucos');
    // A SIA ouve o áudio (tocando + "ouvindo") e depois mostra o que entendeu, antes de digitar.
    assert.equal(await live.locator('#step-panel .audio-message.is-playing').count(), 1, 'Áudio tocando');
    assert.equal(await live.locator('#step-panel .ai-listening').count(), 1, 'SIA ouvindo o áudio');
    assert.equal(await live.locator('#step-panel .typing-bubble').count(), 0, 'Ainda não digita enquanto ouve');
    await live.clock.runFor(3000);
    assert.match(await live.locator('#step-panel .ai-understood').innerText(), /arroz.*feij[aã]o.*leite.*p[aã]o.*banana/i, 'SIA mostra o que entendeu');
    // Mais devagar: depois de 6 s ainda está na primeira etapa.
    assert.equal(await selected(), 'step-tab-0', 'Ritmo calmo: a primeira etapa dura mais de 6 s');
    await live.clock.runFor(3700);
    assert.equal(await selected(), 'step-tab-1', 'Passa sozinho para a etapa 2');
    await live.clock.runFor(9200);
    assert.equal(await selected(), 'step-tab-2', 'E para a etapa 3');

    // Clique: vira slide, parado e completo.
    await live.locator('#step-tab-4').click();
    assert.equal(await selected(), 'step-tab-4');
    assert.equal(await live.locator('#como-funciona .step-progress').count(), 0, 'Sem barra de progresso no modo slide');
    await live.clock.runFor(8000);
    assert.equal(await selected(), 'step-tab-4', 'Continua na etapa escolhida');
    // Inatividade: a animação volta e segue da última para a primeira.
    await live.clock.runFor(3000);
    assert.equal(await live.locator('#como-funciona .step-progress').count(), 1, 'Autoplay volta após 10 s parado');
    await live.clock.runFor(7400);
    assert.equal(await selected(), 'step-tab-0', 'Da última volta à primeira');

    // Pausa pelo botão: nada anda, nem depois do tempo de inatividade.
    const toggle = live.locator('#como-funciona .autoplay-toggle');
    assert.equal(await toggle.getAttribute('aria-label'), 'Pausar animação');
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-label'), 'Retomar animação');
    const pausedAt = await selected();
    await live.clock.runFor(20000);
    assert.equal(await selected(), pausedAt, 'Pausado continua pausado');
    await toggle.click();
    await live.clock.runFor(10000);
    assert.notEqual(await selected(), pausedAt, 'Retomar volta a andar');
    // Painel (etapa 4): o selo da venda aparece sem mudar o tamanho do cartão.
    await live.locator('#step-tab-0').click();
    await live.locator('#como-funciona .autoplay-toggle').click(); // retoma o autoplay a partir da etapa 1
    await live.clock.runFor(9500 + 9000 + 8000 + 300);
    assert.equal(await selected(), 'step-tab-3', 'Chegou ao painel');
    const panelCard = live.locator('#step-panel .insights-preview').last();
    // Altura de layout (offsetHeight), que não muda com a animação de entrada do cartão (escala).
    const before = await panelCard.evaluate(element => element.offsetHeight);
    assert.equal(await panelCard.locator('.sale-registered.is-pending').count(), 1, 'Selo reservado antes de aparecer');
    await live.clock.runFor(1500);
    await live.waitForTimeout(900);
    assert.equal(await panelCard.locator('.sale-registered.is-shown').count(), 1, 'Selo aparece');
    assert.equal(await panelCard.evaluate(element => element.offsetHeight), before, 'O cartão não cresce');

    // Conversa da Lista de compras: espera a primeira chegada, toca uma vez e fica completa.
    const listChat = live.locator('.list-chat');
    const pending = () => listChat.locator('.reveal.is-pending').count();
    assert.ok(await pending() > 5, 'Antes de chegar, as mensagens esperam (com o espaço reservado)');
    const heightBefore = await listChat.evaluate(element => element.getBoundingClientRect().height);
    await listChat.scrollIntoViewIfNeeded();
    await live.waitForFunction(() => document.querySelectorAll('.list-chat .reveal.is-shown').length > 0);
    // Celular em proporção real (9:19,5): a conversa rola dentro da tela, sem esticar o aparelho.
    const phoneBox = await live.locator('.phone').boundingBox();
    assert.ok(Math.abs(phoneBox.height / phoneBox.width - 19.5 / 9) < 0.06, `Proporção do celular ${(phoneBox.height / phoneBox.width).toFixed(2)}`);
    const chatScroll = listChat.locator('.chat-body');
    const scrollStart = await chatScroll.evaluate(element => element.scrollTop);
    await live.clock.runFor(5600);
    assert.equal(await listChat.locator('.audio-message.is-playing').count(), 1, 'SIA ouvindo o áudio da lista');
    assert.equal(await listChat.locator('.ai-listening.is-shown').count(), 1);
    assert.equal(Math.round(await listChat.evaluate(element => element.getBoundingClientRect().height)), Math.round(heightBefore), 'A conversa não muda de altura enquanto anima');
    await live.clock.runFor(17000);
    assert.equal(await pending(), 0, 'No fim, tudo visível');
    const scroll = await chatScroll.evaluate(element => ({ top: element.scrollTop, max: element.scrollHeight - element.clientHeight }));
    assert.ok(scroll.max > 0 && scroll.top > scrollStart, 'A tela rolou junto com as mensagens');
    assert.ok(scroll.max - scroll.top < 4, 'Termina mostrando a última mensagem');
    assert.equal(await listChat.locator('.reveal').count(), 0, 'Fica no estado completo');
    assert.match(await listChat.locator('.ai-understood').innerText(), /p[aã]o franc[eê]s.*banana/i);
    await live.locator('#inicio').scrollIntoViewIfNeeded();
    await listChat.scrollIntoViewIfNeeded();
    await live.clock.runFor(2000);
    assert.equal(await listChat.locator('.reveal').count(), 0, 'Não repete ao voltar');
    await motion.close();

    // Movimento reduzido (a página principal deste teste): nada anda e não há botão de pausa.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('#step-tab-0').click();
    await page.locator('#como-funciona').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#como-funciona .step-progress').count(), 0);
    assert.equal(await page.locator('#como-funciona .autoplay-toggle').count(), 0);
  });

  assert.deepEqual(errors, [], 'Erros JavaScript no navegador');
  await mkdir('docs', { recursive: true });
  await writeFile('docs/validation.json', `${JSON.stringify({ date: new Date().toISOString(), url: baseUrl, browser: 'Chromium', checks, javascriptErrors: errors, status: 'passed' }, null, 2)}\n`);
  console.log(`\n${checks.length} grupos de verificações passaram. Nenhum erro JavaScript.`);
} finally {
  await browser.close();
  await server?.close();
}

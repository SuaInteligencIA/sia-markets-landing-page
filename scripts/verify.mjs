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
  /(?<![a-zà-ú-])mercados?\b/i];

const content = await readFile('src/content.ts', 'utf8');
const WHATSAPP_NUMBER = content.match(/WHATSAPP_NUMBER = '(\d+)'/)?.[1];
assert.ok(WHATSAPP_NUMBER, 'WHATSAPP_NUMBER em src/content.ts');

// Sem SITE_URL, o teste sobe sozinho a prévia do build em dist/.
const server = process.env.SITE_URL ? null : await preview({ preview: { host: '127.0.0.1', port: 4175, strictPort: true }, logLevel: 'error' });
const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:4175';
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(file => file && existsSync(file));
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
const checks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

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

  await check('Etapas: quatro passos, teclado e ARIA', async () => {
    assert.equal(await page.locator('#como-funciona [role="tab"]').count(), 4);
    await page.locator('#step-tab-0').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#step-tab-1').getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'step-tab-1');
    await accessibility('Segunda etapa');
    await page.keyboard.press('End');
    assert.equal(await page.locator('#step-tab-3').getAttribute('aria-selected'), 'true');
    await accessibility('Última etapa');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#step-tab-0').getAttribute('aria-selected'), 'true', 'Depois da última volta à primeira');
    await page.keyboard.press('ArrowUp');
    assert.equal(await page.locator('#step-tab-3').getAttribute('aria-selected'), 'true', 'Antes da primeira vai à última');
    assert.deepEqual(await page.locator('[role="tab"]').evaluateAll(tabs => tabs.filter(tab => !document.getElementById(tab.getAttribute('aria-controls'))).map(tab => tab.id)), []);
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#step-tab-0').getAttribute('aria-selected'), 'true');
  });

  await check('Painel: ilustração acessível, quatro indicadores e sem rolagem lateral', async () => {
    const illustration = page.locator('#painel [role="img"]');
    assert.equal(await illustration.count(), 1);
    assert.match(await illustration.getAttribute('aria-label'), /ilustra/i);
    assert.match(await page.locator('#painel').innerText(), /Imagem ilustrativa/);
    for (const label of ['Vendido pelo WhatsApp', 'Vendas registradas', 'Ticket médio', 'Atendimentos finalizados']) {
      assert.equal(await page.locator('#painel .kpi').filter({ hasText: label }).count(), 1, label);
    }
    assert.equal(await page.locator('#painel .agent-row').count(), 3);
    await noOverflow([320, 375, 768]);
  });

  await check('Lista: conversa ilustrativa termina em lista organizada, sem preços', async () => {
    const chat = page.locator('#lista .list-chat');
    assert.ok(await chat.locator('.guest-bubble .audio-message').count() >= 1, 'Ao menos um áudio do cliente');
    assert.ok(await chat.locator('.agent-bubble ul li').count() >= 5, 'Lista com 5 itens ou mais');
    assert.doesNotMatch(await chat.innerText(), /R\$|\d+,\d{2}/);
    assert.equal(await page.locator('#lista .team-gain').count(), 3);
  });

  await check('Agente: mascote e três formas de personalizar', async () => {
    assert.equal(await page.locator('#sua-agente .agent-feature').count(), 3);
    assert.ok(await page.locator('#sua-agente .agent-mascot').evaluate(image => image.complete && image.naturalWidth > 0));
  });

  await check('CRM: retratos e conversa selecionada', async () => {
    assert.deepEqual(await page.locator('.crm-preview .person-avatar img').evaluateAll(images => [...new Set(images.map(image => image.getAttribute('src')))].sort()), ['/images/people/ana-costa.webp', '/images/people/julia-martins.webp', '/images/people/rafael-lima.webp']);
    assert.match(await page.locator('.crm-preview .chat-topline strong').innerText(), /Ana Costa/);
    assert.match(await page.locator('.crm-preview .inbox-person.active').innerText(), /Ana Costa/);
  });

  await check('Topo: sem rolagem lateral de 320 a 1920px', () => noOverflow([320, 360, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920]));

  assert.deepEqual(errors, [], 'Erros JavaScript no navegador');
  await mkdir('docs', { recursive: true });
  await writeFile('docs/validation.json', `${JSON.stringify({ date: new Date().toISOString(), url: baseUrl, browser: 'Chromium', checks, javascriptErrors: errors, status: 'passed' }, null, 2)}\n`);
  console.log(`\n${checks.length} grupos de verificações passaram. Nenhum erro JavaScript.`);
} finally {
  await browser.close();
  await server?.close();
}

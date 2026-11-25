# Site SIA Markets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site de página única que vende o SIA Markets a supermercados pequenos e médios, com a tecla "saiba quanto seu mercado vende pelo WhatsApp".

**Architecture:** Cópia enxuta do SIA Reserve (`samueeth/sia-reserve-site`, clonado em
`H:/claude-tmp/claude/802f14e5d4f89cdb/280cd201-b71b-4e10-817d-0c54b4ce5ee5/scratchpad/refs/sia-reserve-site`;
se sumir, clonar de novo com `git clone --depth 1`). Mesmo build (Vite + Preact compat + TS, HTML pré-renderizado), mesmos
CSS e componentes; muda o conteúdo, saem as seções de hospedagem e entra um painel ilustrativo em HTML/CSS.
Testes = `scripts/verify.mjs` (Playwright + axe) rodando contra `npm run preview`.

**Tech Stack:** Vite 6, Preact compat (API React 19), TypeScript 5.7, iconsax-react 0.0.8, Playwright, @axe-core/playwright. Gerenciador: **npm** (pnpm não está instalado nesta máquina; não copiar `pnpm-lock.yaml`/`pnpm-workspace.yaml`).

**Spec:** `docs/superpowers/specs/2026-11-25-site-sia-markets-design.md` (ler antes de qualquer tarefa).

## Global Constraints

- Nunca escrever "Helena", "HelenaCRM", "white label", "estoque", "SKU", "catálogo", "prateleira", "inventário", nem frases que deem a entender controle de produtos/preços. O agente "monta a lista com o que o cliente pede"; a equipe separa.
- Nenhum resto de hospedagem: "hóspede", "reserva", "pousada", "hotel", "hostel", "estadia", "OTA", "PMS".
- Botão principal sempre com o texto exato **"Fale com a gente"** + `ArrowUpRight`.
- Sem depoimentos, sem preços, sem números de resultado, sem promessa de entrega/atendimento humano 24 horas. Pode dizer que o agente recebe a lista a qualquer hora.
- Tudo de contato/domínio em `src/content.ts`: `WHATSAPP_NUMBER = '5531995342318'` e `SITE_URL = 'https://siamarkets.com.br/'`, ambos **provisórios** (comentário `// PROVISÓRIO: confirmar com o Samuel`).
- Identidade: Space Grotesk Regular/Medium, `#2B5CFF`, logo `#2d5ffe`, Ink `#0B1020`, fundo `#F3F5FA`; um trecho da headline em azul; Iconsax Linear.
- `lang="pt-BR"`, um único `h1`, zero violações axe WCAG 2.1 A/AA, sem rolagem lateral de 320 a 1920 px.
- Commits em português no estilo do repositório do Samuel (`feat: ...`, `fix: ...`), terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Palavra proibida escondida em texto não visível** (alt, title, aria-label, meta, JSON-LD, sitemap) → o teste de palavras proibidas lê o `dist/` inteiro, não só o texto visível (Task 1).
2. **Celular de 320 px com o painel** (muitos números em grade) → deve empilhar sem rolar para o lado (Task 3, verificação de largura).
3. **Leitor de tela no painel ilustrativo** → números fictícios não podem ser lidos como dados reais: o bloco tem `role="img"` com `aria-label` que diz "ilustração" (Task 3).
4. **Todos os links de WhatsApp com o mesmo número** e mensagem pré-escrita citando o mercado (Task 1, verificado de novo na Task 5).
5. **Imagem nova ainda não entregue** → o site funciona com a mascote no topo; trocar depois é só substituir arquivos com os mesmos nomes (Task 1, `heroImage` em `content.ts`).

---

### Task 1: Base do projeto, topo, rodapé e trava de palavras proibidas

**Files:**
- Create (copiados do Reserve e adaptados): `package.json` (name `sia-markets-site`; scripts iguais; `preview` com `--port 4175 --strictPort`), `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore` (+ `node_modules`, `dist`, `.prerender`), `src/main.tsx`, `src/entry-server.tsx`, `src/icons.tsx`, `src/styles.css`, `src/updates.css`, `src/hero-blend.css`, `src/experience.css`, `src/PoweredBadge.tsx`, `scripts/prerender.mjs`, `scripts/optimize-images.mjs`, `public/fonts/space-grotesk-latin.woff2`, `public/brand/icon.svg`, `public/brand/sia-agente*.webp`, `public/images/people/*.webp`, `public/images/atendimento-ia-color-v2*`.
- Create: `public/brand/logo.svg` a partir de `F:\clientes temporario\SIA NOVO\Identidade Visual SIA\SIA Markets\LOGO SIA MARKETS.svg`, com o `viewBox` recortado ao `getBBox()` do conteúdo (medir no Chromium do Playwright) + 0,5% de folga.
- Create: `src/content.ts`, `src/App.tsx` (só header, hero e footer nesta tarefa), `scripts/verify.mjs`, `public/robots.txt`, `public/sitemap.xml`, `README.md`.
- Não copiar: `docs/`, imagens `hero-reservas*`, `hospitalidade*`, `public/brand/stores/`, `scripts/lighthouse.mjs` (entra na Task 5).

**Interfaces:**
- Produces em `src/content.ts`: `WHATSAPP_NUMBER: string`, `SITE_URL: string`, `whatsappUrl(message?: string): string` (mensagem padrão: `'Olá! Quero conhecer o SIA Markets para o meu mercado.'`), `contact`, `company` (dados do Reserve, `name: 'SIA Markets'`), `socials`, `nav: { label: string; href: string }[]` com âncoras `#como-funciona`, `#painel`, `#lista`, `#sua-agente`, `#duvidas`, `heroImage: { src: string; alt: string }`.
- Produces em `scripts/verify.mjs`: `check(name, fn)` e `accessibility(name)` iguais aos do Reserve; `FORBIDDEN: RegExp[]` exportável dentro do arquivo.

- [ ] **Step 1: Copiar a base e instalar**

Run: `npm install` → termina sem erro.

- [ ] **Step 2: Escrever o teste da página e o de palavras proibidas em `scripts/verify.mjs`**

Manter do Reserve só a checagem de página e a de acessibilidade, adaptadas:
```js
const FORBIDDEN = [/helena/i, /white.?label/i, /estoque/i, /\bsku/i, /cat[aá]logo/i, /prateleira/i, /invent[aá]rio/i,
  /h[oó]spede/i, /reserva/i, /pousada/i, /\bhote(l|is)\b/i, /hostel/i, /estadia/i, /\bOTA/, /\bPMS\b/];
// 'Página': title /SIA Markets/; 1 h1; lang pt-BR; fonte; imagens carregam; âncoras existem; _blank com noopener noreferrer;
// todos os a[href^="https://wa.me/"] com pathname `/${WHATSAPP_NUMBER}` (ler o número de src/content.ts com regex).
// 'Palavras proibidas': para cada arquivo de dist/ (.html, .js, .xml, .txt, .json), nenhum FORBIDDEN casa.
// 'Botão principal': todo .button-primary tem texto exato 'Fale com a gente'.
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm run build; npm run preview` (em segundo plano) e `$env:SITE_URL='http://localhost:4175'; npm test`
Expected: FAIL (ainda há conteúdo do Reserve ou falta o h1 novo).

- [ ] **Step 4: Escrever header, hero e footer**

Header: logo SIA Markets, `nav`, "Fale com a gente". Hero: chip "IA PARA SUPERMERCADOS NO WHATSAPP", h1 `Quanto o seu mercado <span class="accent">vende pelo WhatsApp?</span>`, apoio *"Com o SIA Markets, cada venda feita pelo WhatsApp vai para um **painel** que você acompanha. E um **agente de IA** atende seus clientes e monta a lista de compras para a sua equipe."*, botão "Fale com a gente" + link secundário "Veja como funciona" (`#como-funciona`), imagem `heroImage` (mascote `sia-agente.webp` em corpo inteiro com elipse azul atrás, formato do `design.md`). Faixa de 4 selos: "Vendas no painel", "Lista montada pela IA", "Equipe desafogada", "Um só WhatsApp". Footer do Reserve com textos do Markets ("SIA Markets é um produto Sua InteligêncIA"). `index.html`: título `SIA Markets | Saiba quanto seu mercado vende pelo WhatsApp`, description, canonical/og com `SITE_URL`, sem `preload` da imagem antiga.

- [ ] **Step 5: Rodar e ver passar**

Run: `npm run build` e `npm test` → `OK Página`, `OK Acessibilidade`, `OK Palavras proibidas`, `OK Botão principal`.

- [ ] **Step 6: Commit**

`git add -A; git commit -m "feat: base do site SIA Markets com topo, rodapé e trava de palavras proibidas"`

---

### Task 2: O problema e Como funciona

**Files:** Modify `src/App.tsx`, `src/content.ts`, `scripts/verify.mjs`; CSS só se faltar algo em `styles.css`.

**Interfaces:**
- Consumes: `check`, `accessibility` (Task 1).
- Produces em `content.ts`: `problems: { title: string; description: string; icon: string }[]` (3 itens), `steps: { id: string; number: string; title: string; description: string; icon: string }[]` (4 itens, ids `pedido`, `lista`, `separacao`, `painel`).

- [ ] **Step 1: Teste** `'Etapas: quatro passos, teclado e ARIA'` — portar a checagem de etapas do Reserve: 4 abas (`role="tab"`), setas do teclado trocam o painel, `aria-controls` aponta para painel existente.
- [ ] **Step 2: Rodar e ver falhar** (`npm run build; npm test` → FAIL em Etapas).
- [ ] **Step 3: Implementar** seção do problema (título sugerido: *"Os pedidos chegam. **Os números, não.**"*; três cartões: vendas sem total, lista ditada aos pedaços que prende o atendente, pico de mensagens que trava a equipe) e `#como-funciona` reaproveitando o componente de etapas do Reserve com os 4 passos: cliente chama no WhatsApp → agente de IA monta a lista → equipe separa e envia → venda registrada vai para o painel.
- [ ] **Step 4: Rodar e ver passar** (todas as checagens OK).
- [ ] **Step 5: Commit** `feat: seções do problema e de como funciona`

---

### Task 3: Painel ilustrativo

**Files:** Create `src/DashboardPreview.tsx`, `src/dashboard.css` (importar em `main.tsx` e `entry-server.tsx` não precisa: CSS vai pelo `main.tsx`); Modify `src/App.tsx`, `src/content.ts`, `scripts/verify.mjs`.

**Interfaces:**
- Produces em `content.ts`: `dashboardDemo = { period: string; kpis: { label: string; value: string; note?: string }[]; byDay: { day: string; value: number }[]; byAgent: { name: string; photo: string; sales: number }[] }` com valores fictícios redondos. KPIs exatos: "Vendido pelo WhatsApp", "Vendas registradas", "Ticket médio", "Atendimentos finalizados". `byAgent` usa os 3 retratos (Ana Costa, Rafael Lima, Julia Martins).
- Produces: `export function DashboardPreview(): JSX.Element`.

- [ ] **Step 1: Teste** `'Painel: ilustração acessível e sem rolagem lateral'`: `#painel [role="img"]` existe com `aria-label` contendo "ilustra"; texto visível "Imagem ilustrativa"; os 4 rótulos de KPI aparecem; em 320, 375 e 768 px `document.documentElement.scrollWidth <= innerWidth`.
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** seção `#painel` em fundo azul (gradiente hero do `design.md`): título *"Seu WhatsApp vendendo. **Você vendo quanto.**"*; apoio explicando que, ao finalizar o atendimento, a equipe registra a venda e ela entra no painel; à direita `DashboardPreview` em cartão de vidro (KPIs em grade 2×2, barras por dia em CSS puro, lista por atendente com foto). No celular, a grade vira 1 coluna e as barras continuam visíveis.
- [ ] **Step 4: Rodar e ver passar.**
- [ ] **Step 5: Commit** `feat: painel ilustrativo de vendas pelo WhatsApp`

---

### Task 4: Lista de compras, agente SIA e CRM

**Files:** Modify `src/App.tsx`, `src/content.ts`, `scripts/verify.mjs`.

**Interfaces:**
- Produces em `content.ts`: `chatDemo: { from: 'cliente' | 'sia'; text?: string; audio?: string; list?: string[] }[]`, `teamGains: { title: string; description: string; icon: string }[]` (3), `agentPersonalization` (3 itens, como no Reserve, reescritos para mercado: tom de voz; informações do mercado — horários, bairros atendidos, formas de pagamento, regras de entrega; roteiros).
- Consumes: `CrmPreview` e `AgentAvatar` do Reserve (manter dentro de `App.tsx`).

- [ ] **Step 1: Testes** `'Lista: conversa ilustrativa termina em lista organizada'` (a seção `#lista` mostra ao menos uma mensagem de áudio do cliente e uma mensagem da SIA com `<ul>` de ≥5 itens; nenhuma mensagem casa `/R\$|\d+,\d{2}/`) e `'CRM: retratos e conversa selecionada'` (portar do Reserve).
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `#lista`: título *"A lista sai pronta. **A fila anda.**"*; conversa: cliente manda pedidos soltos ("arroz, feijão…", áudio "e não esquece o pão"), SIA confirma e devolve a lista organizada por seção (hortifrúti, mercearia, padaria, laticínios) e pergunta entrega ou retirada (imagem da seção: `cliente-audio` quando chegar; até lá, `atendimento-ia-color-v2`); ao lado, `teamGains` (imagem: `separacao-pedido` quando chegar; até lá, sem imagem): lista chega pronta para separar, menos tempo digitando, equipe livre nos horários de pico. Depois `#sua-agente` (seção da mascote do Reserve, título *"Sou a SIA. **Do jeito do seu mercado.**"*) e a seção do CRM (*"Toda a equipe no mesmo WhatsApp."*, histórico de cada cliente, atendimentos distribuídos).
- [ ] **Step 4: Rodar e ver passar.**
- [ ] **Step 5: Commit** `feat: lista de compras pela IA, agente SIA e CRM`

---

### Task 5: Dúvidas, chamada final, SEO e acabamento

**Files:** Modify `src/App.tsx`, `src/content.ts`, `index.html`, `public/sitemap.xml`, `public/robots.txt`, `scripts/verify.mjs`, `README.md`; Create `scripts/lighthouse.mjs` (do Reserve, URL padrão 4175).

**Interfaces:** Produces `faqs: { question: string; answer: string }[]` (5 itens).

- [ ] **Step 1: Testes** portados do Reserve: `'FAQ: abrir, ler e recolher com teclado'`, `'Responsividade: 11 larguras de 320 a 1920px'`, `'Mobile: menu, foco e navegação'`, `'Mobile paisagem: menu com rolagem própria'`; mais `'SEO: JSON-LD válido'` (um `script[type="application/ld+json"]` que faz `JSON.parse`, com `Organization` + `SoftwareApplication`/`Product` sem `review`/`aggregateRating`, e `FAQPage` igual a `faqs`).
- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** FAQ (sugestões: "Como sei quanto vendi pelo WhatsApp?", "A IA substitui minha equipe?" — não: ela monta a lista e a equipe separa, envia e registra; "Funciona com o WhatsApp que já uso?" — resposta genérica, sem prometer migração; "Preciso entender de tecnologia?"; "Quanto tempo leva para começar?" — depende, alinhado na conversa), chamada final azul (*"Venda pelo WhatsApp. **Saiba quanto.**"* + "Fale com a gente"), JSON-LD, sitemap/robots com `SITE_URL`, README no formato do Reserve (como rodar com npm, onde editar, o que é provisório: número e domínio; onde ficam os prompts: `docs/prompts-imagens.md`).
- [ ] **Step 4: Rodar tudo:** `npm run build; npm test` → todas as checagens OK; `npm run lighthouse` → registrar notas no README (sem meta mínima bloqueante).
- [ ] **Step 5: Revisão visual:** screenshots em 1440 e 375 px salvos em `docs/visual-review/`, conferidos contra a captura do Reserve.
- [ ] **Step 6: Commit** `feat: dúvidas, chamada final e SEO do SIA Markets`

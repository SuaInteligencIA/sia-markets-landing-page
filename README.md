# SIA Markets

Site do **SIA Markets**, produto da Sua InteligêncIA para supermercados de pequeno e médio porte: painel de vendas e
atendimentos do WhatsApp e agente de IA que monta a lista de compras. Mesma base e mesma identidade do SIA Reserve
(API React 19 com Preact compat, Vite 6 e TypeScript, HTML pré-renderizado, Space Grotesk e azul `#2d5ffe`).

Endereço: **https://suainteligenc.ia.br/markets/** (subpasta do site da Sua InteligêncIA). Ainda não publicado.

## Executar

Na raiz do projeto, com Node.js instalado:

```powershell
npm install
npm run dev
```

## Gerar a entrega e testar

```powershell
npm run build
npm test
```

`npm run build` confere os tipos, gera os arquivos e pré-renderiza a página em `dist/index.html`. `npm test` sobe a
prévia do `dist/` sozinho (porta 4175) e roda as verificações em Chromium: acessibilidade (axe WCAG 2.1 A/AA), teclado,
menu no celular, sem rolagem lateral de 320 a 1920 px, links de WhatsApp e a **trava de palavras proibidas**, que lê
todos os arquivos publicados.

Para publicar, envie o conteúdo de `dist/` para a pasta `public_html/markets/` da hospedagem da Sua InteligêncIA
(a mesma do site principal). O deploy do site principal só apaga o que ele mesmo enviou, então não mexe nessa pasta.
Todos os caminhos já saem com `/markets/` na frente; a subpasta vem do `SITE_URL`.

O `robots.txt` só vale na raiz do domínio, então este site não gera um. Para o Google achar a página, inclua
`https://suainteligenc.ia.br/markets/` no `sitemap.xml` do site principal (ou aponte o `robots.txt` de lá também para
`https://suainteligenc.ia.br/markets/sitemap.xml`).

Para medir desempenho: `npm run preview` em um terminal e `npm run lighthouse entrega` em outro.
Última medição (26/11/2026): celular 100 / 100 / 100 / 100 (LCP 1,8 s, CLS 0) e computador 100 / 100 / 100 / 100 (LCP 0,5 s, CLS 0)
(desempenho, acessibilidade, boas práticas, SEO). Resumo em `docs/lighthouse/entrega-summary.json`.

## Regras de texto (a trava de `scripts/verify.mjs` reprova o build se forem quebradas)

- Sempre **"supermercado"**, nunca "mercado" sozinho.
- Nada sobre estoque, SKU, catálogo, prateleira ou inventário, nem para negar.
- Nenhum nome do fornecedor do CRM: o site fala em "nosso CRM" / "CRM da SIA".
- Nenhum resto do site de hospedagem (hóspede, reserva, pousada, hotel...).
- Botão principal sempre **"Fale com a gente"**.
- Sem depoimentos, preços ou números de resultado. Os números do painel são fictícios e marcados como ilustrativos.

## Endereço e contato

Ficam só em `src/content.ts`: `WHATSAPP_NUMBER` (o mesmo do SIA Reserve) e `SITE_URL`
(`https://suainteligenc.ia.br/markets/`). O `index.html`, o `sitemap.xml`, os caminhos dos arquivos e os dados
estruturados usam essas constantes.

## Imagens

As três ilustrações do SIA Markets (`hero-mercado`, `cliente-audio`, `separacao-pedido`) foram geradas a partir dos prompts
de `docs/prompts-imagens.md`. Os PNGs originais ficam em `docs/source-assets/`; os derivados AVIF e WebP usados pela página
ficam em `public/images/`. Para trocar uma delas, substitua o PNG com o mesmo nome e rode `node scripts/optimize-images.mjs`.
A mascote, os retratos fictícios do CRM e a fonte vêm do SIA Reserve.

Capturas da página inteira: `docs/visual-review/`.

## Onde editar

| Arquivo | Conteúdo |
| --- | --- |
| `src/content.ts` | Todos os textos, contato, menu, etapas, painel, conversa de exemplo e FAQ. |
| `src/App.tsx` | Seções da página e interações. |
| `src/DashboardPreview.tsx` | Painel ilustrativo. |
| `src/structuredData.ts` | Dados estruturados para o Google, gerados do mesmo conteúdo (o FAQ nunca diverge). |
| `src/markets.css` | Estilos próprios do SIA Markets. |
| `src/styles.css`, `src/updates.css`, `src/experience.css`, `src/hero-blend.css` | Base visual herdada do SIA Reserve. |
| `index.html` | Título, descrição e metadados de compartilhamento. |
| `docs/superpowers/` | Desenho e plano de construção. |

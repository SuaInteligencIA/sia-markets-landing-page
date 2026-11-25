# Site SIA Markets: desenho

Data: 25/11/2026. Aprovação: pendente com o Samuel.

## Intenção e o porquê

O SIA Markets é um produto da **Sua InteligêncIA**, irmão do **SIA Reserve**. O site existe para explicar o que fazemos e
**vender a solução para supermercados de pequeno e médio porte**.

A tecla principal: **o dono do mercado passa a saber quanto vende pelo WhatsApp**, com um painel (dashboard) de vendas e
de atendimentos. Junto disso, duas promessas que o Samuel pediu para reforçar:

1. **Fica mais fácil para o cliente montar a lista de compras.** Ele manda o que precisa do jeito que fala (texto ou
   áudio, em pedaços), e o agente de IA organiza tudo numa lista.
2. **Os atendimentos ficam mais ágeis e os atendentes, desafogados.** O agente faz a parte repetitiva da conversa; a
   equipe recebe a lista pronta, separa, envia e registra a venda.

## Como a solução funciona de verdade (base de todo o texto)

1. O cliente do mercado manda mensagem no WhatsApp.
2. O agente de IA atende e monta a lista de compras.
3. O funcionário separa os produtos e envia.
4. Ao finalizar o atendimento, o funcionário registra a venda no CRM.
5. As vendas registradas alimentam o painel que o dono acessa.

O site chama o CRM de "nosso CRM" / "CRM da SIA".

## Objetivos

- O empresário entende em poucos segundos: "vou saber quanto meu mercado vende pelo WhatsApp".
- Entende o fluxo acima e que o atendimento fica mais rápido sem sobrecarregar a equipe.
- Clica em **Fale com a gente** (WhatsApp comercial).

## Não objetivos

- Não é área de cliente, nem loja, nem cardápio de produtos.
- Não tem preço publicado, depoimentos inventados nem números de resultado inventados.
- Cobranças, integrações e aplicativo ficam fora, salvo pedido do Samuel.

## Antiobjetivos (fracasso mesmo funcionando)

- **Citar o fornecedor do CRM** (white label). Nunca aparece em texto, imagem, código público ou metadados.
- **Falar de estoque, SKU, catálogo ou controle de produtos**, ou dar a entender que fazemos isso. Também não citar que
  não fazemos. Evitar frases como "o agente sabe o que tem na prateleira", "consulta preços", "atualiza o estoque".
  O agente **monta a lista com o que o cliente pede**; quem separa é a equipe.
- Prometer o que o painel não mostra, ou prometer entrega/atendimento humano 24 horas.
- Parecer outro site: precisa ter a cara da família SIA Reserve / Sua InteligêncIA.

## Restrições

- **Identidade visual:** a mesma do SIA Reserve (`design.md` do repositório `samueeth/sia-reserve-site`): Space Grotesk
  (Regular e Medium), azul (`#2B5CFF` / logo `#2d5ffe`), Ink `#0B1020`, fundo claro `#F3F5FA`, cards grandes
  arredondados, vidro sobre fundos com cor, alternância de superfícies claras e azuis, um trecho da headline em azul,
  termos-chave em Medium, ícones Iconsax Linear (Bold em selos), ícone colorido do WhatsApp para o canal.
- **Botão principal sempre "Fale com a gente"**, com a seta diagonal (ArrowUpRight).
- **Logo:** `F:\clientes temporario\SIA NOVO\Identidade Visual SIA\SIA Markets\LOGO SIA MARKETS.svg` (copiar para
  `public/brand/`, recortando as margens da exportação, como foi feito no site da Sua InteligêncIA).
- **Rodapé:** produto da Sua InteligêncIA, com os mesmos dados de empresa do SIA Reserve (X3 Inteligencia Digital LTDA,
  CNPJ, privacidade, redes).
- Português do Brasil, linguagem de dono de mercado, sem jargão de tecnologia.
- Desempenho e SEO no mesmo nível do SIA Reserve (HTML pré-renderizado, imagens AVIF/WebP, lazy loading).

## Abordagens consideradas

| Abordagem | Troca | Decisão |
|---|---|---|
| **A. Partir do SIA Reserve** (Vite + Preact compat + TypeScript, HTML pré-renderizado, mesmos CSS e componentes) | Mesma cara e mesma manutenção da família; reaproveita header, cards, FAQ, rodapé, demonstração de chat | **Escolhida** (decisão do Claude; o Samuel delegou a parte técnica) |
| B. Partir do site da Sua InteligêncIA | Traz shaders e orbes animados, mais peso e menos foco em venda | Descartada |
| C. HTML/CSS solto, sem build | Mais simples, mas se afasta do padrão e perde o pré-render e a otimização de imagens | Descartada |

## Estrutura da página (aprovada pelo Samuel)

1. **Topo (hero):** headline com a promessa, por exemplo *"Quanto o seu mercado **vende pelo WhatsApp**?"*; apoio
   falando de painel de vendas + agente que monta a lista; botão Fale com a gente; imagem de mercado (nova).
   Faixa abaixo com 3 a 4 selos curtos (Vendas no painel · Lista montada pela IA · Equipe desafogada · Um só WhatsApp).
2. **O problema:** os pedidos chegam pelo WhatsApp, mas ninguém sabe quanto isso soma; atendentes presos digitando e
   conferindo lista no meio do movimento.
3. **Como funciona:** 4 passos do fluxo real (cliente chama → IA monta a lista → equipe separa e envia → venda
   registrada vai para o painel). Reaproveita o componente de etapas do SIA Reserve.
4. **O painel (destaque, fundo azul):** representação ilustrativa do dashboard feita em HTML/CSS (não imagem gerada),
   com o selo "imagem ilustrativa". Ver métricas abaixo.
5. **Lista de compras sem esforço + atendimento mais ágil:** demonstração de conversa (componente de chat do Reserve)
   em que o cliente manda pedidos soltos/áudio e o agente devolve a lista organizada; ao lado, os ganhos para a equipe.
6. **A agente SIA** (mascote): atende com o jeito do seu mercado: tom de voz, informações do mercado (horários, bairros
   atendidos, formas de pagamento, regras de entrega) e roteiros.
7. **CRM:** toda a equipe no mesmo WhatsApp, histórico de cada cliente, atendimentos distribuídos. Reaproveita o
   mockup de CRM com os retratos fictícios.
8. **Perguntas frequentes.**
9. **Chamada final** + **rodapé**.

### Métricas do painel (decisão do Claude, a conferir pelo Samuel)

Só o que decorre do fluxo descrito (vendas registradas pelos funcionários + atendimentos do CRM):
total vendido pelo WhatsApp no período, quantidade de vendas, ticket médio, atendimentos finalizados, vendas por
atendente e evolução por dia. Valores do mockup são fictícios e marcados como ilustrativos.

## Imagens

- **Reaproveitar** do SIA Reserve / Sua InteligêncIA: mascote (`sia-agente`), retratos fictícios do CRM,
  ilustração do celular de atendimento (`atendimento-ia-color-v2`), ícones das lojas não entram.
- **Novas (o Samuel gera a partir dos prompts que o Claude entrega):**
  1. Hero: mascote num pequeno supermercado de bairro brasileiro, com celular, balão de conversa azul; lateral
     esquerda clara para o texto (mesma técnica da hero do Reserve).
  2. Equipe separando um pedido: atendente com sacolas e o celular com a lista, no balcão/corredor do mercado.
  3. (Opcional) Cliente em casa mandando áudio com a lista no WhatsApp.
  Regras para os prompts: estilo 3D colorido do Reserve, acentos azul cobalto, **sem marcas, rótulos legíveis,
  etiquetas de preço ou prateleiras em foco** (para não puxar o assunto de estoque/catálogo), sem texto.
- Enquanto as imagens novas não chegam, o site usa as reaproveitadas no lugar.

## Onde fica

Repositório próprio em `F:\SIA Connect\SIA Markets` (git iniciado, branch `main`). Remoto sugerido:
`samueeth/sia-markets-site` (criar só com o OK do Samuel). A pasta está dentro do repositório do SIA Connect;
convém ignorar `SIA Markets/` lá.

## Em aberto com o Samuel

- Número de WhatsApp comercial do botão (Reserve usa um, Sua InteligêncIA outro).
- Domínio do site (para URL canônica, sitemap e metadados).

Os dois ficam numa única constante em `src/content.ts`; o site pode ser construído antes, mas não publicado.

## Decisões do Claude depois da revisão (a conferir)

- **Ordem de trabalho:** nada é construído antes da aprovação deste documento. A estrutura da página foi aprovada
  pelo Samuel; as métricas do painel são provisórias.
- **Arquivos reaproveitados (existem no Reserve, já otimizados):** `public/brand/sia-agente*.webp` (mascote e avatar),
  `public/images/atendimento-ia-color-v2-*.avif|webp`, `public/images/people/*.webp`, `public/fonts/space-grotesk-latin.woff2`,
  e no código `src/icons.tsx`, `src/styles.css`, `src/updates.css`, `src/experience.css`, `src/PoweredBadge.tsx`,
  `scripts/prerender.mjs`, `scripts/optimize-images.mjs`. Nada de hospedagem (hero de resort, recepção) entra.
- **Hero provisória:** mascote em corpo inteiro sobre o fundo claro, com a elipse azul borrada atrás e o texto na coluna
  esquerda (formato previsto no `design.md`). Troca pela imagem nova quando ela chegar, sem mudar o layout.
- **Privacidade e termos:** mesmos links da Sua InteligêncIA usados no Reserve; nenhuma página nova.
- **Demonstração de conversa:** produtos e mensagens de exemplo inventados (itens comuns de mercado), sem preço,
  marca, disponibilidade ou "tem/não tem".
- **Analytics:** nenhum, como nos dois sites atuais.

## Fica para quem constrói

Textos finais dentro destas regras, layout responsivo, escolha de ícones Iconsax, ordem fina dos cards, perguntas do
FAQ (respeitando os antiobjetivos), otimização de imagens, testes e validação visual no padrão do Reserve.

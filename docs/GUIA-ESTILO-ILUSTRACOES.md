# Guia de estilo das ilustrações SIA

Como escrever prompts para gerar ilustrações no estilo da arte principal do **SIA Reserve**: a pousada com piscina, a
hóspede de chapéu, o balão azul com três pontos e a chave com pingente. O guia vale para todos os produtos da
Sua InteligêncIA (SIA Reserve, SIA Markets, SIA Connect e o site institucional) e funciona **sem anexar imagem de
referência**: o estilo inteiro está descrito em palavras.

Os prompts ficam em inglês, porque os geradores (Gemini, ChatGPT, Midjourney e outros) seguem estilo e composição melhor
assim. As explicações estão em português.

---

## 1. O estilo em uma frase

Ilustração editorial pintada à mão, clara e arejada, com arquitetura branca em arcos, plantas tropicais em vasos de
terracota, luz do dia e **um único azul cobalto forte**, mais um objeto flutuante aveludado que representa o produto.

## 2. As sete marcas do estilo

| Marca | Como pedir |
| --- | --- |
| **Técnica** | Pintura suave com cara de guache e aquarela sobre desenho digital limpo. Proporções semirrealistas, traço quase invisível, textura leve de papel. **Não é 3D**, não é render e não tem brilho de plástico. |
| **Luz** | Luz do dia clara, paleta alta (*high-key*), sombras suaves de folhas e de palmeiras projetadas nas paredes e no chão. |
| **Arquitetura** | Paredes de reboco branco e marfim, arcos arredondados, janelas altas, piso claro. Mediterrâneo tropical brasileiro. |
| **Natureza** | Palmeiras, costela-de-adão, folhas de bananeira, vasos de terracota, madeira clara, rattan. |
| **Cor de destaque** | Só uma: azul cobalto royal `#2b5cff`, nos objetos que importam (balão, mala, almofadas, avental, uniforme). Todo o resto é neutro e natural. |
| **Objeto flutuante** | Um balão de conversa azul cobalto, arredondado, com **textura fosca aveludada**, ligado por uma **linha cobalto fina e curva** a um segundo objeto que simboliza o produto: a chave com pingente no Reserve, a sacola de papel com fita no Markets. |
| **Composição** | Calma, com bastante espaço vazio e perspectiva profunda. As pessoas aparecem em escala pequena ou média, dentro da cena, nunca como retrato fechado. |

## 3. Bloco de estilo (copiar e colar sempre)

Comece **todo** prompt com este bloco. É ele que garante que as artes saiam iguais entre si.

```text
Premium editorial illustration, landscape 3:2. STYLE: soft hand-painted look with a gouache and watercolor feel over clean digital drawing, semi-realistic proportions, delicate nearly invisible linework, subtle paper-like texture, like a premium travel and lifestyle campaign. Bright airy daylight, high-key palette dominated by warm ivory and chalk-white plaster architecture with rounded arches, pale sky blue, lush tropical greens (palm fronds, monstera and banana leaves) in terracotta pots, natural light wood and rattan, soft cast shadows of leaves on walls and floor, and ONE strong accent color: saturated cobalt royal blue (#2b5cff). Calm, uncluttered composition with deep perspective and generous negative space.
```

## 4. Estrutura do prompt

Depois do bloco de estilo, escreva nesta ordem:

1. **SCENE:** onde é. Lugar brasileiro, claro e elegante, com os elementos de arquitetura e natureza do estilo.
2. **CHARACTER / PEOPLE:** quem aparece, o que está fazendo, a posição no quadro (por exemplo, *"at about 60% of the width"*) e a escala (*"medium scale"*).
3. **FLOATING:** o balão cobalto aveludado, o que vai dentro dele (três pérolas brancas, *checks*, onda de áudio) e o segundo objeto ligado pela linha fina.
4. **ESPAÇO PARA TEXTO** (quando a arte vai em site): *"The left 35% of the image is open, soft and calm (pale ivory fading to very light cool blue #edf3ff), with no objects near the left edge, to leave room for website text."*
5. **PROIBIÇÕES** (sempre): *"No text, no letters, no numbers, no price tags, no product labels, no brand names, no readable signs, no watermark."*

## 5. A mascote SIA, descrita em palavras

Use sempre a mesma descrição, para ela sair reconhecível sem imagem anexa:

```text
a friendly adult woman with a short wavy black bob with vivid cobalt blue streaks and straight bangs, big blue eyes, light freckles, wearing a royal blue polo shirt with a small white emblem made of four rounded petal shapes around a center, and navy trousers
```

Poses por assunto: **celular na mão** para atendimento, **joinha** para convite e fechamento, **comemorando** para
conquista e resultado.

## 6. Objeto flutuante por produto

| Produto | Balão | Segundo objeto (ligado pela linha fina) |
| --- | --- | --- |
| SIA Reserve | três pérolas brancas brilhantes | chave antiga prateada com pingente de franja azul |
| SIA Markets | três *checks* brancos ao lado de barras curtas (sem letras) | sacola de papel kraft amarrada com fita azul |
| SIA Connect | três pérolas brancas | dois balões menores conversando (equipe) |
| Sua InteligêncIA | brilho de IA (estrela de quatro pontas branca) | — |
| Áudio, em qualquer produto | onda sonora branca | — |

## 7. Regras que não mudam

- **Um azul só.** Nada de roxo, verde-água forte ou gradiente neon. O azul cobalto aparece em poucos objetos.
- **Sem texto na imagem.** Nada de letras, números, placas, rótulos, preços ou logotipos de outras marcas.
- **Pessoas brasileiras e naturais**, com tons de pele variados, em atitude tranquila. Ninguém posando para a câmera.
- **Nada de 3D brilhante, CGI ou estilo de desenho animado.** O ar é de pintura editorial.
- **Supermercado** (SIA Markets): as prateleiras ficam sempre ao fundo, desfocadas e secundárias. O foco são as pessoas, as frutas e verduras em caixotes de madeira e o balão azul.

## 8. Quando dá errado

| Problema | Acrescente ao prompt |
| --- | --- |
| Saiu texto, preço ou rótulo legível | *"Absolutely no text, letters or labels anywhere."* (no começo) |
| Ficou 3D, brilhante ou com cara de render | *"Not 3D, not CGI, not glossy: flat soft painted illustration with gouache texture."* |
| A mascote mudou | repita a descrição da seção 5 e acrescente *"keep exactly this hairstyle and outfit"* |
| Muitas cores competindo | *"Muted natural colors everywhere except the cobalt blue accents."* |
| O fundo virou o destaque | *"The background is soft and secondary; the people and the blue bubble are the focus."* |
| Faltou espaço para o texto do site | reforce o item 4 da seção 4 e peça *"subject on the right half"* |

## 9. Exemplo completo (SIA Markets, topo do site)

```text
Premium editorial illustration, landscape 3:2, for a Brazilian AI product for supermarkets. STYLE: soft hand-painted look with a gouache and watercolor feel over clean digital drawing, semi-realistic proportions, delicate nearly invisible linework, subtle paper-like texture, like a premium travel and lifestyle campaign. Bright airy daylight, high-key palette dominated by warm ivory and chalk-white plaster architecture with rounded arches, pale sky blue, lush tropical greens (palm fronds, monstera and banana leaves) in terracotta pots, natural light wood and rattan, soft cast shadows of leaves on walls and floor, and ONE strong accent color: saturated cobalt royal blue (#2b5cff). Calm, uncluttered composition with deep perspective and generous negative space. SCENE: the interior of a bright, elegant small Brazilian neighborhood supermarket with white plaster arches, tall windows with daylight, tropical plants in terracotta pots, and wooden crates overflowing with colorful fresh produce in the right foreground; shelves only far in the background, softly painted and out of focus. CHARACTER at medium scale, standing at about 62% of the width, three-quarter view, smiling while looking at a smartphone in her hand: a friendly adult woman with a short wavy black bob with vivid cobalt blue streaks and straight bangs, big blue eyes, light freckles, wearing a royal blue polo shirt with a small white emblem made of four rounded petal shapes around a center, and navy trousers. FLOATING above her on the upper right: a large rounded cobalt blue chat bubble with a soft matte velvety texture, holding three small white check marks next to three short white bars (no letters), connected by a thin flowing cobalt line to a small floating kraft paper grocery bag tied with a cobalt blue ribbon tassel. The left 35% of the image is open, soft and calm (pale ivory fading to very light cool blue #edf3ff), with no objects near the left edge, to leave room for website text. No text, no letters, no numbers, no price tags, no product labels, no brand names, no readable signs, no watermark.
```

Outros prompts prontos do SIA Markets: `docs/prompts-imagens.md`, no repositório `samueeth/sia-markets-landing-page`.

## 10. Depois de gerar

- Peça em **paisagem 3:2**, de preferência 1536 × 1024 ou maior.
- Confira se não há texto escondido (placas, rótulos, telas de celular).
- Nos sites, a imagem vai otimizada em AVIF e WebP; o PNG original fica em `docs/source-assets/` de cada repositório.

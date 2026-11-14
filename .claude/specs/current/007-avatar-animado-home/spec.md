# 007 — Avatar animado do site e revisão da tela inicial

- **Domínio:** ui
- **Status:** emendada (emendas 1, 2 e 3, 2026-11-14) — versão original implementada e aprovada pela Lupa (31/31); a emenda troca o sprite
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-14
- **Origem:** pedido do usuário em 2026-11-14, literal: "Quero que esse avatar seja meu avatar do site do portfólio, faça orquestração para implementar esse avatar com sistema de animação. Quero que faça uma revisão nessa tela inicial, por exemplo meu nome aparece em mais 3 lugares diferentes só na primeira tela, etc."
- **Referência visual:** `ref/sprites-gemini.png` (emenda 1: folha de 8 quadros entregue pelo usuário; é a arte do avatar). `ref/avatar-ref.png` foi a referência da versão original.
- **Descoberta:** o usuário delegou as decisões ao time ("implemente e revise o pedido"). As decisões de produto abaixo (DP-x) foram tomadas pelo Arquiteto com padrões sensatos e estão na nota `decisoes`, cada uma com custo de reverter. O usuário pode reverter qualquer uma na revisão do PR.

## Contexto

O site é só modo aventura (spec 005, emenda 1). A spec 006 colocou um retrato estático de NPC na caixa de diálogo (`public/npc-andre.svg`, 30×33, exibido em escala não inteira: 2,53× no desktop e 1,6× no celular). O PR #2 (`feat/006-ui-npc-dialog`) está aberto, sem merge.

## Problema

1. **O avatar atual não é o avatar que o usuário quer.** Ele entregou uma referência nova (touca verde, cabelo castanho, barba cheia, túnica verde com gola clara, alça marrom com fivela, arma no ombro) e quer que ela seja o avatar do site.
2. **O avatar é uma imagem parada.** O usuário pediu um sistema de animação.
3. **A primeira tela repete informação.** Inventário feito no código (branch `feat/006-ui-npc-dialog`, commit `a62d5c9`), `/pt`:

| # | Onde | Texto | Arquivo |
|---|------|-------|---------|
| N1 | Logo do cabeçalho | "◆ André Menezes" | `src/app/[lang]/layout.tsx:76` |
| N2 | `<h1>` do hero | "André Menezes" | `src/app/[lang]/page.tsx:54` |
| N3 | Etiqueta de quem fala no diálogo | "André" | `DialogBox.tsx:46` (`hero.speaker`) |
| N4 | Primeira fala do diálogo | "Eu sou o André, Endpoint Engineer…" | `hero.lines[0]` |
| R1 | Cargo no `<h1>` | "Endpoint Engineer" | `page.tsx:55` |
| R2 | Cargo na primeira fala | "…Endpoint Engineer no Rio de Janeiro." | `hero.lines[0]` |
| P1 | Frase de apresentação | "Automatizo a infraestrutura de endpoints…" | `hero.pitch` |
| P2 | Segunda fala | "Automatizo a infraestrutura: testo hardware…" | `hero.lines[1]` |
| G1 | Dica de jogo | "…abra o inventário… procure as gemas escondidas." | `hero.gameHint` |
| G2 | Terceira fala | "No inventário abaixo… gemas escondidas pelo caminho." | `hero.lines[2]` |
| C1 | Botão do cabeçalho | "Fale comigo" | `layout.tsx` (`nav.cta`) |
| C2 | Botão do hero | "✉ Fale comigo" | `page.tsx` (`hero.ctaContact`) |

   O nome aparece 4 vezes, o cargo 2, e as três falas do diálogo repetem a frase de apresentação e a dica de jogo.

## Decisões de produto

| ID | Decisão | Alternativa rejeitada | Custo de reverter |
|----|---------|----------------------|-------------------|
| DP-1 | ~~Sprite próprio redesenhado em grade 32×32, em SVG vetorial; o raster da referência não entra no site.~~ **Revogada pela emenda 1**; substituída pela DP-11. | — | — |
| DP-2 | **Elementos autorais no lugar dos de franquia.** Ficam proibidos: espada, escudo, orelhas pontudas, gorro comprido caído, emblema de triângulos. Mantém a regra da 006 (emenda 2): "estilo, não personagem". **Emenda 1:** a folha do usuário já atende (gorro de lã verde arredondado, cajado de madeira com gema verde à esquerda da imagem); a exigência de a gema ter a forma e as cores de `GemShape` cai. | Manter a espada da primeira referência | Baixo |
| DP-3 | ~~Animação por camadas, só CSS, SVG inline, zero raster.~~ **Revogada pela emenda 1**; substituída pela DP-12. Continua valendo: só CSS, zero dependência nova, estado em `data-state`. | — | — |
| DP-4 | **Estados e gatilhos:** `idle` (respiração + piscar), `talking` (boca alterna enquanto o texto do diálogo digita), `happy` (sorriso + coração) quando a última fala termina de digitar e por 1,6 s quando o visitante coleta uma gema. **Emenda 1:** os gatilhos não mudam; o que cada estado mostra passa a ser a sequência de quadros da DP-12. | Reagir a hover de botões, clique no avatar | Baixo |
| DP-5 | **`prefers-reduced-motion: reduce` = quadro estático.** Nenhuma animação roda; a troca de expressão para `happy` continua (é troca de estado, não movimento), sem o coração. **Emenda 1:** `idle` e `talking` mostram o quadro 1; `happy` mostra o quadro 6. | Desligar também a troca de expressão | Baixo |
| DP-6 | **Onde o avatar aparece:** na caixa de diálogo do hero (única ocorrência na primeira tela, animado) e na ficha do herói em "Sobre", no lugar das iniciais "AM" (estado `idle`). Não há uma segunda cópia solta no hero: duplicaria o rosto na mesma dobra, o mesmo defeito que o usuário apontou no nome. | Avatar grande no hero além do diálogo | Baixo |
| DP-7 | **Nome na primeira tela: 2 ocorrências.** Ficam N1 (logo, identidade e navegação em todas as páginas) e N2 (`<h1>`, SEO e CA-25 da 005). Saem N3 (a etiqueta de quem fala; o retrato já diz quem fala) e N4. | Tirar o nome do logo na home | Baixo: uma chave de dicionário e um `span` |
| DP-8 | **Cargo: 1 ocorrência no hero** (R1, no `<h1>`). **Falas reescritas** para não repetir `hero.pitch` nem `hero.gameHint` (textos no Anexo A). `hero.pitch` e `hero.gameHint` ficam como estão (CA-25 da 005). | Remover a dica de jogo | Baixo |
| DP-9 | **Os dois "Fale comigo" ficam** (C1 e C2). C2 é exigido por CA-02 da 002 e CA-25 da 005; C1 é a ação fixa do cabeçalho nas demais páginas. Registrado como redundância aceita. | Esconder C1 na home | Baixo |
| DP-11 | **Emenda 1 (decisão do usuário: "quero usar essas para meu avatar").** A arte do avatar é a folha de 8 quadros de `ref/sprites-gemini.png`, limpa e servida como **PNG** em `public/avatar/andre-sprites.png`: fundo transparente, resolução nativa da pixel art (1 pixel da arte = 1 pixel do PNG), paleta reduzida, quadros alinhados. Revoga "raster não entra" e "SVG por camadas". | Manter o sprite SVG 32×32 da versão original (aprovado 31/31, mas não é a arte que o usuário escolheu) | Baixo: o sprite SVG está no histórico do git; a API do componente não muda |
| DP-12 | **Emenda 1.** Animação por **troca de quadro**: uma tira horizontal de 8 quadros, deslocada por `transform` com função de tempo em degraus e `image-rendering: pixelated`. Sequências por estado na tabela do contrato de `NpcAvatar.css`. Consequências aceitas: não há piscar durante a fala (a folha não tem esse quadro) e o coração aparece em vez de subir. | Recortar olhos e boca em camadas a partir do PNG (reintroduz o desenho manual que o usuário dispensou) | Baixo |
| DP-13 | **Reescrita pela emenda 2 (decisão do usuário).** O avatar mede **128 px no desktop**, na caixa de diálogo e na ficha "Sobre", e **64 px no celular** na caixa de diálogo. Na ficha "Sobre" no celular mede 128 px (decisão do Arquiteto: o usuário não citou esse caso; uma regra só, e o cartão comporta). A célula do PNG tem N = 64, então a escala é sempre inteira: 2× e 1×, em qualquer densidade de tela. A limitação de 1,5× da emenda 1 deixa de existir. | 96/64 da emenda 1 (1,5× em monitor de densidade 1, pixels desiguais) | Baixo: três regras de CSS e dois atributos |
| DP-10 | `profile.avatar` continua reservado para foto real e segue `undefined`. Com foto definida, a ficha "Sobre" mostra a foto, como hoje. | Usar `profile.avatar` para o sprite | Baixo |

## Escopo (dentro)

1. Sprite do avatar a partir da folha do usuário (DP-11, DP-2), servido como PNG e exibido pelo componente `NpcAvatar`.
2. Sistema de animação por estado, por troca de quadro (DP-12, DP-4, DP-5).
3. Integração na caixa de diálogo, em escala inteira, e na ficha "Sobre" (DP-6).
4. Revisão da primeira tela (DP-7, DP-8): remoção da etiqueta de quem fala, falas reescritas em pt e en.
5. Itens do backlog da 006 absorvidos: escala inteira do retrato (com a ressalva da DP-13); barba/olhos (resolvidos pela arte nova); `.hero-role` pequeno demais no celular.
6. Remoção de `public/npc-andre.svg` (fica sem uso).

## Escopo (fora)

- Favicon, ícones do manifest e imagens OpenGraph com o avatar novo (spec 004 arquivada; vira item do INBOX).
- `HeroScene.tsx`, `Hud.tsx`, `Fairy.tsx`, `Gem.tsx`, `Effects.tsx`, `Controls.tsx`, `Inventory.tsx`, `ContactForm.tsx`, `MobileContactBar.tsx`, `layout.tsx`, `store.ts`, `projects.css`, páginas de projeto, analytics.
- Overflow preexistente em 320 px e `label-content-name-mismatch` do botão EN (backlog da 006, continuam lá).
- Som novo para o avatar. O `playBlip` da digitação fica como está.
- Mudança em `hero.pitch`, `hero.gameHint`, `<h1>` e nos botões do hero.

## Contratos nomeados

### `src/components/NpcAvatar.tsx` (novo)

```ts
export type AvatarState = "idle" | "talking" | "happy";
export function NpcAvatar(props: { state?: AvatarState; className?: string }): JSX.Element;
```

- Sem `"use client"` e sem hooks: pode ser usado por componente de servidor (`page.tsx`) e de cliente (`DialogBox.tsx`).
- **Emenda 1.** Renderiza um único `<svg>` com `viewBox="0 0 N N"` (N = lado da célula do PNG), `width="128"`, `height="128"` (emenda 2), `aria-hidden="true"`, `focusable="false"`, classe `npc-avatar` e `data-state` igual a `state` (padrão `idle`).
- Dentro do `<svg>` há exatamente um filho: `<image href="/avatar/andre-sprites.png" width="8N" height="N">`. O `viewBox` funciona como janela de um quadro; o deslocamento do `<image>` escolhe o quadro. Não há mais `data-layer`.
- A raiz continua `<svg>` de propósito: os seletores `.npc-portrait svg` e `.avatar svg` de `globals.css`, o `DialogBox.tsx` e o `page.tsx` seguem valendo sem edição.

### `public/avatar/andre-sprites.png` (novo, emenda 1)

Tira horizontal de 8 quadros, gerada a partir de `ref/sprites-gemini.png` (grade 4×2 em fundo magenta, lida da esquerda para a direita, de cima para baixo).

| Quadro | Posição na tira | Conteúdo |
|--------|-----------------|----------|
| 1 | 0 | idle A (neutro, boca fechada) |
| 2 | N | idle B (respirar) |
| 3 | 2N | piscar (olhos fechados, boca fechada) |
| 4 | 3N | falar (boca entreaberta) |
| 5 | 4N | falar 2 (boca aberta) |
| 6 | 5N | feliz (sorriso) |
| 7 | 6N | feliz + coração |
| 8 | 7N | feliz piscando |

Regras da imagem:

- **Dimensões:** 8N × N, com célula quadrada de lado N ∈ {32, 64}. Se a resolução nativa detectada na folha não der célula quadrada desse lado, a célula é recortada ou completada com transparência. **Não se reamostra a arte**: cada pixel da arte é exatamente 1 pixel do PNG.
- **Transparência:** alfa só 0 ou 255. Nenhum resto do fundo magenta nem franja.
- **Paleta:** no máximo 32 cores opacas distintas.
- **Alinhamento:** os quadros são registrados entre si. O que não muda de um quadro para outro (gorro, cajado, túnica) fica idêntico pixel a pixel; as regiões permitidas de diferença estão no CA-32.
- **Peso:** no máximo 30 KB.
- `public/avatar/` contém só esse arquivo.

### `src/components/NpcAvatar.css` (novo)

CSS global (não é CSS Module), importado por `NpcAvatar.tsx`. Todas as classes e `@keyframes` têm o prefixo `npc-` e nenhuma classe se chama `.npc-portrait` (essa é de `globals.css`). Dono de toda a animação do avatar.

**Emenda 1.** O `<image>` tem `image-rendering: pixelated`. A única propriedade animada é `transform` (`translateX` em múltiplos inteiros de N), com função de tempo em degraus (`steps(...)` ou `step-end`). Sequências:

| `data-state` | Ciclo | Sequência de quadros |
|--------------|-------|----------------------|
| `idle` | 4,8 s, infinito | 1 (1,2 s) → 2 (1,2 s) → 1 (1,2 s) → 2 (1,05 s) → 3 (150 ms) |
| `talking` | 560 ms, infinito | 4 → 1 → 5 → 1, 140 ms cada |
| `happy` | entrada + ciclo de 4 s | 6 por 300 ms; depois 7, com o quadro 8 por 150 ms a cada 4 s |

Com `prefers-reduced-motion: reduce`: nenhuma animação; `idle` e `talking` mostram o quadro 1; `happy` mostra o quadro 6 (sem coração).

### `src/components/DialogBox.tsx`

- A prop `speaker` sai. As demais ficam.
- Estado do avatar derivado, sem estado novo além do pulso de gema:
  - antes da hidratação e no HTML do servidor: `idle`;
  - digitando (`!done`): `talking`;
  - linha terminada, não é a última: `idle`;
  - última linha terminada: `happy`;
  - `gems.length` (de `usePrefs()`) aumentou depois da montagem: `happy` por 1600 ms, com prioridade sobre os demais.
- Comportamento atual preservado: clique/Enter avança, foco, `aria-label`, `sr-only` com o texto inteiro, prompt de continuar.

### `src/dictionaries/pt.json` e `en.json`

- Sai `hero.speaker` dos dois.
- `hero.lines` recebe os textos do Anexo A (3 falas em cada idioma).
- Paridade de chaves entre os dois arquivos.

## Restrições

- **Next.js modificado:** ler o guia relevante em `node_modules/next/dist/docs/` antes de escrever código (CSS Modules e componentes de servidor/cliente).
- **Termos vedados:** `.claude/specs/termos-vedados.local` — grep = 0 linhas em tudo que for para stage.
- **Sem dependência nova** em `package.json`. Raster novo em `public/` só em `public/avatar/` (emenda 1).
- **Acessibilidade:** avatar decorativo; Lighthouse acessibilidade 100 em `/pt` e `/en`; contraste ≥ 4,5:1 mantido.
- **Regressão proibida:** CA-25 da 005 (primeira dobra) e CA-21 da 006 (sem overflow em 360/375/390) continuam valendo.
- **Git:** executores não rodam git. Branch, stage e commit são do Sentinela.

## Critérios de aceite (binários)

Valem em `/pt` e `/en`. "Desktop" = 1366×768; "celular" = 390×844. "Primeira tela" = página no topo (`scrollY = 0`), elementos com `getBoundingClientRect().top < innerHeight` e visíveis.

### Avatar

| ID | Critério |
|----|----------|
| CA-01 | `src/components/NpcAvatar.tsx` existe e exporta `NpcAvatar` e `AvatarState` como no contrato; o arquivo não tem `"use client"` nem hook |
| CA-02 | **Reescrito (emenda 1).** O `<svg>` renderizado tem `viewBox="0 0 N N"`, `aria-hidden="true"`, `data-state` e exatamente um elemento filho: um `<image>` com `href="/avatar/andre-sprites.png"`, `width` = 8N e `height` = N. Nenhum elemento com `data-layer` existe no DOM |
| CA-03 | **Reescrito (emenda 1).** `public/avatar/andre-sprites.png` mede 8N × N com N ∈ {32, 64}; todo pixel tem alfa 0 ou 255; há no máximo 32 cores opacas distintas; nenhum pixel opaco tem R ≥ 200, G ≤ 90 e B ≥ 200 (magenta); não existe inteiro k ≥ 2 para o qual todos os blocos k×k alinhados à grade sejam de cor única (prova de resolução nativa); o arquivo tem no máximo 30 KB |
| CA-04 | **Reescrito (emenda 1).** Conferência visual contra `ref/sprites-gemini.png`: os 8 quadros da tira estão na ordem da tabela do contrato e cada um mostra a expressão da célula correspondente da folha; em todos aparecem gorro verde, cabelo e barba castanhos, gola clara, túnica verde, alça marrom com fivela dourada e cajado com gema verde à esquerda da imagem; o coração aparece só no quadro 7 |
| CA-05 | **Reescrito (emenda 1).** Lista de proibidos, todos ausentes nos 8 quadros: espada; escudo; orelhas pontudas; gorro comprido caído; emblema de triângulos. Não há URI `data:` em `NpcAvatar.tsx` nem em `NpcAvatar.css` |
| CA-06 | **Reescrito (emenda 1).** `NpcAvatar.tsx` tem no máximo 4 KB; `public/avatar/` contém só `andre-sprites.png`; `public/npc-andre.svg` não existe e `grep -r "npc-andre" src public` devolve 0 linhas |
| CA-07 | **Reescrito (emenda 2).** Largura e altura renderizadas do `<svg>` do avatar: na caixa de diálogo, 128 px no desktop e 64 px no celular; na ficha "Sobre", 128 px no desktop e no celular. Em todos os casos, medida ÷ 64 é inteiro |

### Animação

| ID | Critério |
|----|----------|
| CA-08 | Enquanto a fala digita, o `<svg>` do diálogo tem `data-state="talking"`; ao terminar uma fala que não é a última, `data-state="idle"` |
| CA-09 | **Reescrito (emenda 1).** Ao terminar a última fala, `data-state="happy"` e, 400 ms depois, o quadro exibido é o 7 (feliz + coração): `translateX` computado do `<image>` = −6N |
| CA-10 | Ao coletar uma gema (clique na gema do hero), `data-state` vira `happy` e volta ao estado derivado em 1600 ms (± 100 ms) |
| CA-11 | **Reescrito (emenda 1).** Em `talking`, amostrando o `translateX` computado do `<image>` a cada 35 ms por 1,2 s, o quadro exibido é sempre 1, 4 ou 5 e cada um dos três aparece ao menos uma vez |
| CA-12 | **Reescrito (emenda 1).** Em `idle`, amostrando por 10 s, o quadro exibido é sempre 1, 2 ou 3, e o quadro 3 fica entre 100 e 200 ms a cada 4,8 s (± 200 ms). Em `happy`, depois dos primeiros 400 ms, o quadro exibido é sempre 7 ou 8 |
| CA-13 | **Reescrito (emenda 1).** Toda animação do avatar anima só `transform`, com função de tempo em degraus (`steps(...)` ou `step-end`); em toda amostra o `translateX` computado é múltiplo inteiro de N; `getComputedStyle(image).imageRendering` é `pixelated` |
| CA-14 | **Reescrito (emenda 1).** Com `prefers-reduced-motion: reduce` emulado, `getAnimations({ subtree: true })` no `<svg>` devolve lista vazia nos três estados; o quadro exibido é o 1 em `idle` e em `talking` e o 6 em `happy` |
| CA-15 | O HTML servido (`curl`, sem JS) traz o `<svg>` do diálogo com `data-state="idle"` |
| CA-16 | `git diff` de `package.json` e `package-lock.json` vazio |

### Primeira tela

| ID | Critério |
|----|----------|
| CA-17 | No texto visível da primeira tela, "André" aparece exatamente 2 vezes (logo do cabeçalho e `<h1>`), em desktop e celular |
| CA-18 | Dentro de `section.hero`, "Endpoint Engineer" aparece exatamente 1 vez no texto visível e nenhuma no texto `sr-only` do diálogo |
| CA-19 | Não existe elemento `.dialog-speaker` no DOM; `hero.speaker` não existe em `pt.json` nem em `en.json`; `grep -rn "speaker" src` devolve 0 linhas |
| CA-20 | `hero.lines` de `pt.json` e `en.json` é igual, caractere por caractere, ao Anexo A |
| CA-21 | `pt.json` e `en.json` têm o mesmo conjunto de chaves |
| CA-22 | `hero.pitch`, `hero.gameHint`, `hero.cta` e `hero.ctaContact` sem diferença no `git diff` |
| CA-23 | No celular, `font-size` computado de `.hero-role` ≥ 11,5 px; no desktop, contraste de `.hero-role` ≥ 4,5:1 mantido nos temas dia e templo |
| CA-24 | Na ficha "Sobre", com `profile.avatar` indefinido, aparece o `<svg>` do avatar com `data-state="idle"` e o texto "AM" não é renderizado |

### Regressão e qualidade

| ID | Critério |
|----|----------|
| CA-25 | CA-25 da spec 005 continua passando: desktop e celular mostram na primeira dobra o `<h1>`, `hero.pitch` e `hero.gameHint`; no desktop, o botão "Fale comigo" do hero; no celular, `.mobile-bar` |
| CA-26 | Em 360, 375 e 390 px, `document.documentElement.scrollWidth === clientWidth` |
| CA-27 | CLS da home ≤ 0,02 no Lighthouse (desktop e celular); o avatar tem `width` e `height` explícitos |
| CA-28 | `npm run lint`, `npx tsc --noEmit` e `npm run build` saem com código 0 |
| CA-29 | Lighthouse acessibilidade = 100 em `/pt` e `/en` |
| CA-30 | Avatar íntegro (sem corte, sem borrão, sem franja magenta) nos temas dia, noite e templo, em desktop e celular: 6 capturas por idioma anexadas à revisão. **Emenda 2:** capturas do desktop em densidade 1 e do celular em densidade 2; a captura extra de limitação da emenda 1 deixa de ser exigida |
| CA-31 | Termos vedados = 0 linhas nos arquivos em stage; o diff só toca os caminhos listados em "Fronteiras de arquivo" |
| CA-32 | **Reescrito (emenda 3), alinhamento dos quadros.** Coordenadas em pixels do quadro (N = 64, origem no canto superior esquerdo, limites inclusivos). Caixas: **boca** x 26–40, y 33–43; **margem da boca** = boca alargada em 2 px para cada lado (x 24–42, y 31–45), para retoque de barba; **olhos** x 22–45, y 22–30; **coração** x 5–13, y 9–16. Comparando pixel a pixel dentro da tira, todo pixel diferente tem de cair na região indicada e tem de haver ao menos 1 pixel diferente: (a) quadro 3 × quadro 1: só olhos; (b) quadros 4 e 5 × quadro 1: só margem da boca; (c) quadro 6 × quadro 1: só margem da boca e olhos; (d) quadro 7 × quadro 6: só coração; (e) quadro 8 × quadro 6: só olhos; (f) quadro 2 × quadro 1: só em y ≥ 32. Fora dessas regiões os quadros são idênticos, inclusive no alfa |
| CA-33 | **Reescrito (emenda 2), integração mínima.** Em relação ao estado aprovado pela Lupa (31/31): diff vazio em `DialogBox.tsx`, `src/app/[lang]/page.tsx`, `pt.json` e `en.json`; em `globals.css`, o diff só toca os blocos da caixa de diálogo (`.dialog-box`, `.npc-portrait`) e `.avatar` |

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| ~~Semelhança com a referência é subjetiva~~ | — | Resolvido pela emenda 1: a arte é a que o usuário entregou |
| Sprite ainda evocar personagem de franquia (touca verde + túnica verde) | Médio | DP-2 e CA-05; touca arredondada, cajado com gema do site, sem orelhas pontudas; a Lupa confere a lista |
| PR #2 aberto toca os mesmos arquivos (`DialogBox.tsx`, `globals.css`, `page.tsx`) | Médio | Branch da 007 empilhada sobre `feat/006-ui-npc-dialog`; decisão de base e de ordem de merge é do Maestro com o Sentinela |
| Retrato maior (128 px no desktop, emenda 2) empurrar o botão do hero para fora da primeira dobra em 1366×768 | Alto | CA-25 é critério de regressão e precisa ser medido de novo; o ajuste de espaçamento da caixa de diálogo fica com o dono de `globals.css` na emenda 2 |
| Animação infinita gastar bateria ou distrair | Baixo | Só `transform` em degraus (CA-13); `prefers-reduced-motion` (CA-14) |
| Emenda 1: a folha veio de gerador de imagem; os quadros não nascem alinhados e trazem borrão, cores a mais e franja magenta | Alto | Regras da imagem no contrato; CA-03 e CA-32 medem por script, pixel a pixel. O caminho esperado é montar os quadros 2 a 8 a partir do quadro 1 limpo, trocando só rosto, coração e deslocamento do corpo |
| ~~Emenda 1: com N = 64, desktop de densidade 1 mostra a arte em 1,5×~~ | — | Resolvido pela emenda 2 (128 px = 2×) |
| Emenda 1: `image-rendering: pixelated` em `<image>` de SVG pode não valer em algum navegador (conferir Safari) | Médio | CA-13 mede o valor computado; conferência manual no Safari. Plano B: raiz vira `<span>` com `background-image`, o que muda os seletores de `globals.css` e exige bloqueio para o Maestro |
| Emenda 1: o PNG carrega depois do HTML e o retrato fica vazio por um instante | Baixo | `width`/`height` fixos, sem deslocamento de layout (CA-27); arquivo ≤ 30 KB |
| `data-state="talking"` no HTML do servidor deixaria a boca mexendo sem JS | Baixo | CA-15 |
| Remover a etiqueta "André" enfraquecer a leitura de "quem fala" | Baixo | O retrato fica colado na fala; DP-7 tem custo de reverter baixo |

## Fronteiras de arquivo sugeridas

Um dono por caminho. O Maestro particiona e pode fundir donos.

| Dono sugerido | Possui | Fora de escopo |
|---------------|--------|----------------|
| **A — UI Designer (sprite e animação)** | `src/components/NpcAvatar.tsx`, `src/components/NpcAvatar.css`, `public/avatar/**` (emenda 1); em `src/app/globals.css`, só os blocos da caixa de diálogo (`.dialog-box`, `.npc-portrait`) e `.avatar` (emenda 2) | Todo o resto. Não edita `DialogBox.tsx`, `page.tsx` nem dicionários |
| **B — Engineer (integração e home)** | Entregue e aprovado na versão original: `DialogBox.tsx`, `page.tsx`, `globals.css`, dicionários, remoção de `public/npc-andre.svg`. **Na emenda 1 não possui nada**: esses caminhos não podem aparecer no diff (CA-33) | `NpcAvatar.*`; `public/avatar/**`; `layout.tsx`; `projects.css`; demais componentes |
| **Reviewer (Lupa)** | Evidências dos CAs, capturas | Não edita código |
| **Git Master (Sentinela)** | Branch, stage, commit, push e PR quando autorizado | — |
| **Arquiteto (Prisma)** | `.claude/specs/current/007-avatar-animado-home/**`, `ROADMAP.md`, `INBOX.md` | Código |

## Evidências esperadas

- Saída de `lint`, `tsc`, `build` e Lighthouse (CA-27 a CA-29).
- Medidas por script no navegador para CA-07 a CA-15, CA-17, CA-18, CA-23, CA-25, CA-26 (números, não relato).
- 12 capturas do CA-30 e uma comparação lado a lado sprite × referência (CA-04, CA-05).
- Revisão independente: quem produz não aprova.

## Anexo A — falas do diálogo

`hero.lines` em `pt.json`:

1. `Olá, viajante! Que bom ver você por aqui. Sente-se perto da fogueira.`
2. `Meu ofício é tirar trabalho manual do caminho: testo hardware, padronizo máquinas e escrevo scripts que rodam sozinhos. Cada teste devolve PASS ou FAIL.`
3. `O que eu forjei está logo abaixo. E se a jornada pedir um aliado, as placas do caminho levam até mim.`

`hero.lines` em `en.json`:

1. `Hello, traveler! Good to see you here. Take a seat by the fire.`
2. `My craft is getting manual work out of the way: I test hardware, standardize machines and write scripts that run on their own. Every test returns PASS or FAIL.`
3. `What I've forged is right below. And if your journey calls for an ally, the signposts lead to me.`

## Emenda 1 — sprite em PNG a partir da folha do usuário (2026-11-14)

**Origem:** decisão do usuário, literal: "quero usar essas para meu avatar", com a folha `ref/sprites-gemini.png` (2576×1438, grade 4×2 em fundo magenta). Autor da emenda: Arquiteto (Prisma), a pedido do Maestro.

**O que muda:** só a arte e o mecanismo de animação. Revogadas DP-1 e DP-3; novas DP-11, DP-12 e DP-13; DP-2, DP-4 e DP-5 ajustadas. O texto da spec acima já está atualizado; esta seção é o resumo.

**O que não muda:** a API `NpcAvatar({ state, className })`, o tipo `AvatarState`, a raiz `<svg>` com `data-state`, os estados e os gatilhos, o HTML do servidor em `idle`, os tamanhos 96/64, a revisão da primeira tela e os dicionários.

### Situação dos critérios

| Situação | CAs |
|----------|-----|
| Reescritos | CA-02, CA-03, CA-04, CA-05, CA-06, CA-09, CA-11, CA-12, CA-13, CA-14 |
| Texto ajustado, mesma medida | CA-07 (sai a menção à grade 32), CA-30 (densidade das capturas) |
| Novos | CA-32 (alinhamento dos quadros), CA-33 (integração sem diff) |
| Valem como estão | CA-01, CA-08, CA-10, CA-15 a CA-29, CA-31 |

### Trabalho de integração (antiga WP-20)

Nenhum CA da WP-20 exige mudança de código. Como a raiz continua `<svg>` com `data-state`, `width` e `height`, o `DialogBox.tsx`, o `page.tsx`, o `globals.css` e os dicionários ficam intocados (CA-33).

- **Valem sem retrabalho e sem nova medição** (não dependem da arte): CA-16 a CA-23, CA-26, CA-28, CA-31.
- **Valem sem retrabalho, mas a Lupa mede de novo** (o avatar participa da medida): CA-07, CA-08, CA-10, CA-15, CA-24, CA-25, CA-27, CA-29, CA-30.
- **Reescrito, ainda sem retrabalho:** CA-09 (a lógica de estado é a mesma; mudou o que se observa).

### Fronteira

Um dono só: UI Designer, com `src/components/NpcAvatar.tsx`, `src/components/NpcAvatar.css` e `public/avatar/**`. Revisão independente pela Lupa. Git pelo Sentinela.

## Emenda 2 — avatar em 128 px no desktop (2026-11-14)

**Origem:** decisão do usuário, depois de ver a emenda 1: avatar em 128 px no desktop, na caixa de diálogo e na ficha "Sobre"; no celular continua 64 px. Autor da emenda: Arquiteto (Prisma), a pedido do Maestro.

**O que muda:** DP-13, CA-07, CA-30 e CA-33 (texto acima já atualizado); o atributo `width`/`height` do `<svg>` passa a 128; a fronteira do dono A ganha três blocos de `globals.css`.

**Decisão do Arquiteto dentro da emenda:** a ficha "Sobre" no celular fica em 128 px. O usuário não citou esse caso; 96 px (valor anterior) daria 1,5× e 64 px ficaria pequeno no cartão. Custo de reverter: uma regra de CSS.

**Medir de novo:** CA-07, CA-25 (primeira dobra em 1366×768, risco alto com o retrato 32 px mais alto), CA-26, CA-27 e CA-30.

### Defeito conhecido, em diagnóstico (não muda o contrato)

O usuário relatou que, durante a fala, a cabeça parece maior em algum quadro (cintilação). A Lupa está diagnosticando; a correção é do dono A, nos arquivos que ele já possui. O contrato já proíbe esse efeito: o CA-32(a) exige que os quadros 4 e 5 só difiram do quadro 1 dentro do retângulo central, e a regra de alinhamento do PNG exige que o que não muda fique idêntico pixel a pixel. Se o diagnóstico mostrar que a diferença está **dentro** do retângulo central (contorno do rosto ou da barba variando entre quadros), o CA-32 passa e o defeito continua; nesse caso o Arquiteto aperta o CA-32 em nova emenda.

## Emenda 3 — CA-32 apertado (2026-11-14)

**Origem:** diagnóstico da Lupa sobre a cintilação relatada pelo usuário (cabeça parecendo maior em alguns quadros). O CA-32(a) da emenda 1 aceitava diferença em todo o retângulo central (x, y de 16 a 55), que cobre o rosto inteiro; por isso a variação de contorno dos quadros 5 a 8 passou. A ressalva registrada na emenda 2 se confirmou.

**O que muda:** só o CA-32, reescrito acima com caixas por região (boca, olhos, coração) e tolerância de 2 px em volta da boca para retoque de barba. A seção "Defeito conhecido" da emenda 2 fica superada: agora o contrato mede o defeito.

**Consequência para a arte:** a tira aprovada na emenda 1 deixa de passar. Os quadros 3 a 8 têm de ser remontados sobre o quadro 1 (e o 7 e o 8 sobre o 6), copiando só as caixas. Dono: A (UI Designer), em `public/avatar/**`. Nenhum outro CA muda.


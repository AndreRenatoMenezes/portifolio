# 007 — Avatar animado do site e revisão da tela inicial

- **Domínio:** ui
- **Status:** aprovada para particionamento
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-14
- **Origem:** pedido do usuário em 2026-11-14, literal: "Quero que esse avatar seja meu avatar do site do portfólio, faça orquestração para implementar esse avatar com sistema de animação. Quero que faça uma revisão nessa tela inicial, por exemplo meu nome aparece em mais 3 lugares diferentes só na primeira tela, etc."
- **Referência visual:** `ref/avatar-ref.png` (pixel art 16-bit, dois painéis: expressão neutra e sorrindo).
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
| DP-1 | O avatar é um **sprite pixel art próprio**, redesenhado a partir da referência numa grade de **32×32** pixels lógicos, em SVG vetorial. A imagem raster da referência **não** entra no site. | Recortar o PNG da referência (fundo, compressão e borrão de IA; não anima; peso) | Médio: redesenhar |
| DP-2 | **Elementos autorais no lugar dos de franquia.** Mantêm-se: touca/capuz verde arredondado, cabelo castanho, barba cheia, gola clara, túnica verde, alça marrom diagonal com fivela dourada. A espada de guarda alada roxa/azul sai e entra um **cajado de madeira com a gema do site na ponta** (mesma forma e cores `--gem` do componente `GemShape`), à direita da imagem (atrás do ombro esquerdo do personagem), como na referência. Ficam proibidos: espada, escudo, orelhas pontudas, gorro comprido caído, emblema de triângulos. Mantém a regra da 006 (emenda 2): "estilo, não personagem". | Manter a espada da referência | Baixo: trocar uma camada do sprite |
| DP-3 | **Animação por camadas, só CSS.** O sprite é SVG inline com camadas (base, corpo, olhos, boca, coração) e o estado vem de um atributo `data-state`. Zero dependência nova, zero raster. | Folha de sprites com `background-position` (cada combinação de estado vira quadro novo) ; biblioteca de animação | Médio |
| DP-4 | **Estados e gatilhos:** `idle` (respiração + piscar), `talking` (boca alterna enquanto o texto do diálogo digita), `happy` (sorriso + coração) quando a última fala termina de digitar e por 1,6 s quando o visitante coleta uma gema. | Reagir a hover de botões, clique no avatar | Baixo |
| DP-5 | **`prefers-reduced-motion: reduce` = quadro estático.** Nenhuma animação roda; a troca de expressão para `happy` continua (é troca de estado, não movimento), sem o coração. | Desligar também a troca de expressão | Baixo |
| DP-6 | **Onde o avatar aparece:** na caixa de diálogo do hero (única ocorrência na primeira tela, animado) e na ficha do herói em "Sobre", no lugar das iniciais "AM" (estado `idle`). Não há uma segunda cópia solta no hero: duplicaria o rosto na mesma dobra, o mesmo defeito que o usuário apontou no nome. | Avatar grande no hero além do diálogo | Baixo |
| DP-7 | **Nome na primeira tela: 2 ocorrências.** Ficam N1 (logo, identidade e navegação em todas as páginas) e N2 (`<h1>`, SEO e CA-25 da 005). Saem N3 (a etiqueta de quem fala; o retrato já diz quem fala) e N4. | Tirar o nome do logo na home | Baixo: uma chave de dicionário e um `span` |
| DP-8 | **Cargo: 1 ocorrência no hero** (R1, no `<h1>`). **Falas reescritas** para não repetir `hero.pitch` nem `hero.gameHint` (textos no Anexo A). `hero.pitch` e `hero.gameHint` ficam como estão (CA-25 da 005). | Remover a dica de jogo | Baixo |
| DP-9 | **Os dois "Fale comigo" ficam** (C1 e C2). C2 é exigido por CA-02 da 002 e CA-25 da 005; C1 é a ação fixa do cabeçalho nas demais páginas. Registrado como redundância aceita. | Esconder C1 na home | Baixo |
| DP-10 | `profile.avatar` continua reservado para foto real e segue `undefined`. Com foto definida, a ficha "Sobre" mostra a foto, como hoje. | Usar `profile.avatar` para o sprite | Baixo |

## Escopo (dentro)

1. Sprite novo do avatar (DP-1, DP-2) como componente React com SVG inline em camadas.
2. Sistema de animação por estado (DP-3 a DP-5).
3. Integração na caixa de diálogo, em escala inteira, e na ficha "Sobre" (DP-6).
4. Revisão da primeira tela (DP-7, DP-8): remoção da etiqueta de quem fala, falas reescritas em pt e en.
5. Itens do backlog da 006 absorvidos: escala inteira do retrato; barba/olhos (resolvidos pelo redesenho); `.hero-role` pequeno demais no celular.
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
- Renderiza um único `<svg>` com `viewBox="0 0 32 32"`, `width="96"`, `height="96"`, `shape-rendering="crispEdges"`, `aria-hidden="true"`, `focusable="false"` e `data-state` igual a `state` (padrão `idle`).
- Todo pixel é um retângulo alinhado à grade inteira (coordenadas e medidas inteiras; pode ser `<path>` com `h`/`v`). No máximo **16 cores**, fixas (não dependem do tema).
- Camadas, cada uma num `<g>` com `data-layer`:

| `data-layer` | Conteúdo | Visível em |
|--------------|----------|------------|
| `head` | touca, cabelo, rosto, orelhas, barba | sempre |
| `body` | gola, túnica, alça com fivela, cajado com gema | sempre |
| `eyes-open` | olhos abertos, com 1 pixel de brilho | padrão |
| `eyes-closed` | olhos fechados | só no quadro de piscar |
| `mouth-rest` | boca fechada, neutra | `idle`; quadro par de `talking` |
| `mouth-open` | boca aberta | quadro ímpar de `talking` |
| `mouth-smile` | sorriso com dentes (painel direito da referência) | `happy` |
| `heart` | coração de 5×5, à esquerda da imagem (lado oposto ao cajado) | `happy` |

### `src/components/NpcAvatar.css` (novo)

CSS global (não é CSS Module), importado por `NpcAvatar.tsx`. Todas as classes têm o prefixo `npc-` e nenhuma se chama `.npc-portrait` (essa é de `globals.css`, dono B). Dono de toda a animação do avatar. Anima só `transform`, `opacity` e `visibility`. Tempos:

| Animação | Ciclo | Regra |
|----------|-------|-------|
| Respiração | 2,4 s | camada `body` desce exatamente 1 pixel lógico em metade do ciclo; `steps()`, sem interpolação |
| Piscar | 4 s | `eyes-closed` no lugar de `eyes-open` por 150 ms por ciclo; roda nos três estados |
| Fala | 280 ms | `mouth-rest` e `mouth-open` alternam a cada 140 ms; só em `data-state="talking"` |
| Coração | 600 ms, uma vez | sobe 2 pixels lógicos em `steps(2)` e fica; só em `data-state="happy"` |

Com `prefers-reduced-motion: reduce`: `animation: none` em todas as camadas; `eyes-open` e a boca do estado ficam fixas; `heart` oculto.

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
- **Sem dependência nova** em `package.json`. Sem raster novo em `public/`.
- **Acessibilidade:** avatar decorativo; Lighthouse acessibilidade 100 em `/pt` e `/en`; contraste ≥ 4,5:1 mantido.
- **Regressão proibida:** CA-25 da 005 (primeira dobra) e CA-21 da 006 (sem overflow em 360/375/390) continuam valendo.
- **Git:** executores não rodam git. Branch, stage e commit são do Sentinela.

## Critérios de aceite (binários)

Valem em `/pt` e `/en`. "Desktop" = 1366×768; "celular" = 390×844. "Primeira tela" = página no topo (`scrollY = 0`), elementos com `getBoundingClientRect().top < innerHeight` e visíveis.

### Avatar

| ID | Critério |
|----|----------|
| CA-01 | `src/components/NpcAvatar.tsx` existe e exporta `NpcAvatar` e `AvatarState` como no contrato; o arquivo não tem `"use client"` nem hook |
| CA-02 | O `<svg>` renderizado tem `viewBox="0 0 32 32"`, `shape-rendering="crispEdges"`, `aria-hidden="true"` e as 8 camadas `data-layer` da tabela |
| CA-03 | Todas as coordenadas e medidas dentro do `<svg>` são inteiras e o número de cores distintas de preenchimento é ≤ 16 |
| CA-04 | Lista de conferência visual contra `ref/avatar-ref.png`, todos presentes: touca verde arredondada; cabelo castanho visível sob a touca; barba cheia castanha; gola clara; túnica verde; alça marrom diagonal com fivela dourada; cajado de madeira com gema na ponta à direita da imagem (atrás do ombro esquerdo do personagem), como na referência |
| CA-05 | Lista de proibidos, todos ausentes: espada; escudo; orelhas pontudas; gorro comprido caído; emblema de triângulos; qualquer `<image>` ou `data:` dentro do `<svg>` |
| CA-06 | `NpcAvatar.tsx` tem no máximo 16 KB; `public/npc-andre.svg` não existe mais e `grep -r "npc-andre" src public` devolve 0 linhas |
| CA-07 | Na caixa de diálogo, a largura renderizada do `<svg>` é 96 px no desktop e 64 px no celular (3× e 2× da grade); na ficha "Sobre" é 96 px nos dois |

### Animação

| ID | Critério |
|----|----------|
| CA-08 | Enquanto a fala digita, o `<svg>` do diálogo tem `data-state="talking"`; ao terminar uma fala que não é a última, `data-state="idle"` |
| CA-09 | Ao terminar a última fala, `data-state="happy"`, com `mouth-smile` e `heart` visíveis e `mouth-rest` oculto |
| CA-10 | Ao coletar uma gema (clique na gema do hero), `data-state` vira `happy` e volta ao estado derivado em 1600 ms (± 100 ms) |
| CA-11 | Em `talking`, `mouth-rest` e `mouth-open` nunca estão visíveis ao mesmo tempo (amostragem de `getComputedStyle` a cada 35 ms por 1 s) |
| CA-12 | Em qualquer estado, `eyes-closed` fica visível entre 100 e 200 ms a cada 4 s (± 200 ms) |
| CA-13 | Todas as animações do avatar usam função de tempo `steps(...)` e só as propriedades `transform`, `opacity` ou `visibility` |
| CA-14 | Com `prefers-reduced-motion: reduce` emulado, `getAnimations()` no `<svg>` e descendentes devolve lista vazia nos três estados; em `happy`, `mouth-smile` visível e `heart` oculto |
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
| CA-30 | Avatar íntegro (sem corte, sem borrão de subpixel) nos temas dia, noite e templo, em desktop e celular: 6 capturas por idioma anexadas à revisão |
| CA-31 | Termos vedados = 0 linhas nos arquivos em stage; o diff só toca os caminhos listados em "Fronteiras de arquivo" |

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Semelhança com a referência é subjetiva e o usuário não participou da descoberta | Médio | CA-04 como lista fechada; capturas do CA-30 vão no PR para o usuário aprovar ou pedir ajuste; DP-1 e DP-2 têm custo de reverter registrado |
| Sprite ainda evocar personagem de franquia (touca verde + túnica verde) | Médio | DP-2 e CA-05; touca arredondada, cajado com gema do site, sem orelhas pontudas; a Lupa confere a lista |
| PR #2 aberto toca os mesmos arquivos (`DialogBox.tsx`, `globals.css`, `page.tsx`) | Médio | Branch da 007 empilhada sobre `feat/006-ui-npc-dialog`; decisão de base e de ordem de merge é do Maestro com o Sentinela |
| Retrato maior (96 px) empurrar o botão do hero para fora da primeira dobra em 1366×768 | Médio | CA-25 é critério de regressão; ajuste de espaçamento do diálogo fica na posse da WP de integração |
| Animação infinita gastar bateria ou distrair | Baixo | Só `transform`/`opacity`/`visibility` com `steps()` (CA-13); `prefers-reduced-motion` (CA-14) |
| `data-state="talking"` no HTML do servidor deixaria a boca mexendo sem JS | Baixo | CA-15 |
| Remover a etiqueta "André" enfraquecer a leitura de "quem fala" | Baixo | O retrato fica colado na fala; DP-7 tem custo de reverter baixo |

## Fronteiras de arquivo sugeridas

Um dono por caminho. O Maestro particiona e pode fundir donos.

| Dono sugerido | Possui | Fora de escopo |
|---------------|--------|----------------|
| **A — UI Designer (sprite e animação)** | `src/components/NpcAvatar.tsx` (novo), `src/components/NpcAvatar.css` (novo) | Todo o resto. Não edita `DialogBox.tsx`, `globals.css` nem `page.tsx` |
| **B — Engineer (integração e home)** | `src/components/DialogBox.tsx`; `src/app/[lang]/page.tsx` (seção `hero` e bloco `.avatar` da seção `about`); `src/app/globals.css` (blocos `.hero-role`, "Caixa de diálogo"/`.npc-portrait`/`.dialog-speaker` e `.avatar`); `src/dictionaries/pt.json` e `en.json` (só `hero.speaker` e `hero.lines`); remoção de `public/npc-andre.svg` | `NpcAvatar.*`; `layout.tsx`; `projects.css`; demais componentes |
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

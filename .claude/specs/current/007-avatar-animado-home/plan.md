# Plano — 007 Avatar animado do site e revisão da tela inicial

Lê-se junto com `spec.md`. Os critérios (CA-xx), as decisões de produto (DP-x), os contratos e as fronteiras por dono estão lá.

## Decisões técnicas

- **T1 — Um componente, sem cliente.** `NpcAvatar` é função pura: recebe `state` e devolve o `<svg>` com `data-state`. Quem decide o estado é quem usa. Assim a ficha "Sobre" (componente de servidor em `page.tsx`) usa o mesmo componente que o `DialogBox` (cliente), sem duplicar o desenho.
- **T2 — Camadas em vez de quadros.** Olhos, boca, corpo e coração são grupos separados. Piscar, falar e respirar rodam ao mesmo tempo sem multiplicar desenhos: são 2 olhos + 3 bocas + 1 coração, e não um quadro por combinação.
- **T3 — Visibilidade por CSS, estado por atributo.** O seletor é `[data-state="talking"] [data-layer="mouth-open"]` etc. A alternância de camadas usa `visibility` ou `opacity` com `steps()`; a respiração usa `transform: translateY` de 1 unidade do `viewBox` na camada `body`. Nada de `top`/`height`/`d` animados.
- **T4 — CSS global ao lado do componente** (`src/components/NpcAvatar.css`, importado por `NpcAvatar.tsx`). Motivo: `globals.css` já tem dono (B) e é grande; um arquivo próprio dá a A uma posse só dele, e a fronteira A/B não muda. O plano original era um CSS Module (`NpcAvatar.module.css`); o bloqueio aberto por A foi resolvido pelo Maestro em 2026-11-14 com CSS global. Como não há escopo automático, toda classe leva o prefixo `npc-` e os seletores de camada ficam sob a classe raiz (`.npc-avatar [data-layer=…]`). O nome `.npc-portrait` não pode ser usado: já existe em `globals.css` e é de B.
- **T5 — Desenho como `<path>` por cor e por camada.** Cada camada tem um `<path>` por cor, com segmentos `M x y h w v 1 h -w z`, como no `npc-andre.svg` atual. Mantém o arquivo abaixo de 16 KB (CA-06) e as coordenadas inteiras (CA-03).
- **T6 — Tamanho.** O `<svg>` sai com `width="96" height="96"`. O consumidor reduz para 64 px no celular por CSS (`.npc-portrait svg { width: 64px; height: 64px }` em `max-width: 559px`). Nunca porcentagem: a escala tem de ser inteira (CA-07). A moldura `.npc-portrait` passa a envolver o `<svg>` com medidas fixas, sem `aspect-ratio: 80 / 88`.
- **T7 — Estado no `DialogBox`.** Um `mounted` (falso no servidor) garante `idle` no HTML servido (CA-15). O pulso de gema: `usePrefs().gems.length` comparado com o valor anterior num `useRef`; se aumentou depois da montagem, liga um `happyUntil` e um `setTimeout` de 1600 ms o desliga (limpar o timer no `cleanup`). A carga inicial das gemas do `localStorage` não conta como coleta: o `ref` é iniciado no primeiro efeito, depois da hidratação.
- **T8 — Sem a etiqueta de quem fala.** Sai o `<span className="dialog-speaker">`, a prop `speaker` e a regra `.dialog-speaker` do `globals.css`. O espaço de 16 px que a etiqueta ocupava acima da moldura pode ser devolvido ao `margin-top` do diálogo, o que ajuda o CA-25.
- **T9 — Ficha "Sobre".** No bloco `.avatar` de `page.tsx`: com `profile.avatar`, segue a `<img>`; sem, entra `<NpcAvatar />` no lugar de `profile.initials`. A regra `.avatar` (círculo com iniciais) é ajustada para moldura quadrada do sprite, com o mesmo fundo de céu de `.npc-portrait`. `profile.initials` continua em `profile.ts` (não é posse desta spec).
- **T10 — `.hero-role` no celular.** `font-size: max(0.42em, 0.72rem)` (sugestão da Lupa no backlog da 006).

## Pacotes de trabalho

Numeração continua a da nota `tasks` (última: WP-18b).

### WP-19 — Sprite e animação do avatar (dono A, UI Designer)

- **Possui:** `src/components/NpcAvatar.tsx`, `src/components/NpcAvatar.css`.
- **Fora de escopo:** todo o resto.
- **Objetivo:** o sprite 32×32 da referência com as 8 camadas e as 4 animações do contrato.
- **Aceite:** CA-01 a CA-06, CA-11 a CA-14, CA-16.
- **Depende de:** nada.
- **Como conferir sem a integração:** página temporária local fora do stage, ou a própria home depois da WP-20. A conferência final de CA-11 a CA-14 é feita na WP-21.

### WP-20 — Integração no diálogo e revisão da primeira tela (dono B, Engineer)

- **Possui:** `src/components/DialogBox.tsx`; `src/app/[lang]/page.tsx` (seção `hero`, bloco `.avatar` de `about`); `src/app/globals.css` (blocos `.hero-role`, caixa de diálogo, `.avatar`); `src/dictionaries/pt.json` e `en.json` (`hero.speaker`, `hero.lines`); remoção de `public/npc-andre.svg`.
- **Fora de escopo:** `NpcAvatar.*`, `layout.tsx`, `projects.css`, demais componentes.
- **Objetivo:** avatar novo no diálogo com estado derivado, avatar na ficha "Sobre", primeira tela sem repetição.
- **Aceite:** CA-07 a CA-10, CA-15, CA-17 a CA-28.
- **Depende de:** WP-19 para a ligação final. A parte de dicionários, `.dialog-speaker` e `.hero-role` (T8, T10, Anexo A) não depende e pode começar em paralelo, tipando contra o contrato de `NpcAvatar` da spec.

### WP-21 — Revisão independente (Lupa)

- **Possui:** evidências. Não edita código.
- **Objetivo:** medir os 31 CAs, com atenção a CA-04/CA-05 (lado a lado com `ref/avatar-ref.png`), CA-11 a CA-14 (amostragem por script) e CA-25/CA-26 (regressão).
- **Depende de:** WP-19 e WP-20.

### Git (Sentinela)

- Branch sugerida: `feat/007-avatar-animado-home`, criada a partir de `feat/006-ui-npc-dialog` (a 007 edita arquivos que o PR #2 alterou). Base e ordem de merge: decisão do Maestro.
- Um commit por WP aprovada. A pasta `.claude/specs/current/007-avatar-animado-home/` (inclusive `ref/avatar-ref.png`, 784 KB) entra no commit de spec; se o Maestro não quiser o PNG versionado, fica fora do stage e a spec continua válida.

## Ordem sugerida

1. WP-19 (A) e a parte independente da WP-20 (B) em paralelo.
2. WP-20: ligação do avatar, depois de WP-19 entregue.
3. WP-21 (Lupa).
4. Correções, se houver, pelo dono do caminho. Commit pelo Sentinela.

## Verificação

- `npm run lint`, `npx tsc --noEmit`, `npm run build` (CA-28).
- `curl -s localhost:3000/pt | grep -o 'data-state="[a-z]*"'` (CA-15).
- No navegador, 1366×768 e 390×844, `/pt` e `/en`:
  - largura do `<svg>`: `getBoundingClientRect().width` (CA-07);
  - contagem de "André" e "Endpoint Engineer" no `innerText` dos elementos da primeira tela (CA-17, CA-18);
  - amostragem de `getComputedStyle(layer).visibility`/`opacity` a cada 35 ms (CA-11, CA-12);
  - `document.querySelector('.npc-portrait svg').getAnimations({ subtree: true })` com movimento reduzido emulado (CA-14);
  - `scrollWidth === clientWidth` em 360/375/390 (CA-26).
- Lighthouse em `/pt` e `/en` (CA-27, CA-29).
- `grep -rn -i -f .claude/specs/termos-vedados.local` nos arquivos em stage (CA-31).

## Banco

Não há. Nenhum estado novo no `localStorage`.

## Emenda 1 — sprite em PNG (2026-11-14)

Lê-se com a seção "Emenda 1" da `spec.md`. Revoga T2, T3 e T5 (camadas e desenho em `<path>`). T1, T4, T6 a T10 continuam valendo.

### Decisões técnicas

- **T11 — A raiz continua `<svg>`, com um `<image>` dentro.** O `viewBox="0 0 N N"` recorta um quadro da tira de 8N × N; mover o `<image>` em múltiplos de N troca o quadro. Motivo: `globals.css` dimensiona o avatar por `.npc-portrait svg` e `.avatar svg`, e o `DialogBox` só passa `state`. Mantendo a raiz, a integração não é tocada (CA-33). Em SVG, 1 px de `transform` é 1 unidade do `viewBox`, ou seja, 1 pixel da arte.
- **T12 — Um `@keyframes` por estado, só `transform`, em degraus.** `idle`: 4,8 s com `step-end`, paradas em 0%, 25%, 50%, 75% e 96,875% (quadros 1, 2, 1, 2, 3). `talking`: 560 ms, paradas em 0%, 25%, 50%, 75% (quadros 4, 1, 5, 1). `happy`: duas animações na mesma regra, a entrada (300 ms no quadro 6, uma vez) e o ciclo de 4 s (quadro 7, com o 8 nos últimos 150 ms) com `animation-delay` de 300 ms. Tudo dentro de `@media (prefers-reduced-motion: no-preference)`; fora dela, o quadro vem de `transform` fixo por `data-state` (quadro 1 ou 6).
- **T13 — Preparo da imagem é script descartável, fora do repositório.** Passos: detectar o lado do pixel da arte na folha (tamanho do degrau, em pixels da folha); reduzir cada célula por vizinho mais próximo para a resolução nativa; tirar o magenta com alfa binário; reduzir a paleta para até 32 cores; recortar ou completar a célula para N × N; montar os quadros 2 a 8 sobre o quadro 1 limpo, copiando só a região do rosto (e o coração no 7; o corpo 1 pixel abaixo no 2), para cumprir o CA-32; exportar a tira. Ferramenta à escolha do dono (o `sips` do macOS e Node bastam); **nada entra em `package.json`** (CA-16). Só o PNG final vai para o stage.
- **T14 — `image-rendering: pixelated` no `<image>`**, por CSS em `NpcAvatar.css`. Conferir no Safari; se não valer, abrir bloqueio (plano B na tabela de riscos da spec).

### Pacotes de trabalho

#### WP-22 — Sprite em PNG e animação por quadro (dono A, UI Designer)

- **Possui:** `src/components/NpcAvatar.tsx`, `src/components/NpcAvatar.css`, `public/avatar/**`.
- **Fora de escopo:** todo o resto, inclusive `DialogBox.tsx`, `page.tsx`, `globals.css` e dicionários.
- **Objetivo:** trocar o sprite SVG em camadas pela tira PNG da folha do usuário, com as sequências da DP-12.
- **Aceite:** CA-01 a CA-06, CA-11 a CA-14, CA-16, CA-32, CA-33.
- **Depende de:** `ref/sprites-gemini.png` (já na pasta da spec).

#### WP-23 — Revisão independente da emenda (Lupa)

- **Possui:** evidências. Não edita código.
- **Objetivo:** medir os CAs reescritos e novos (02 a 06, 09, 11 a 14, 32, 33) e medir de novo os que dependem do avatar (07, 08, 10, 15, 24, 25, 27, 29, 30).
- **Depende de:** WP-22.

### Verificação adicional

- CA-03 e CA-32: script que lê o PNG (dimensões, alfa, contagem de cores, teste de blocos k×k, diferenças entre quadros por região). Saída numérica anexada.
- CA-09, CA-11 a CA-14: `new DOMMatrix(getComputedStyle(image).transform).m41 / -N` dá o índice do quadro (0 a 7); amostrar com `setInterval` de 35 ms.
- CA-33: `git diff --stat <commit aprovado> -- src/components/DialogBox.tsx "src/app/[lang]/page.tsx" src/app/globals.css src/dictionaries` vazio.

## Emenda 2 — 128 px no desktop (2026-11-14)

- **T15 — Tamanhos.** `NpcAvatar.tsx`: `width="128" height="128"`. `globals.css`: `.npc-portrait` e `.npc-portrait svg` em 128 px (64 px em `max-width: 559px`, como hoje); `.avatar` e `.avatar svg` em 128 px. O comentário de `.npc-portrait` que cita "grade 32x32 em escala inteira 3x/2x" é atualizado para 64 e 2×/1×.
- **T16 — Primeira dobra.** O retrato fica 32 px mais alto no desktop. Se o botão do hero sair da primeira dobra em 1366×768 (CA-25), o ajuste é no espaçamento de `.dialog-box` (inclusive o bloco `max-height: 800px`), não no tamanho do avatar.
- **WP-24 (dono A, UI Designer):** possui `NpcAvatar.tsx`, `NpcAvatar.css`, `public/avatar/**` e os blocos `.dialog-box`, `.npc-portrait` e `.avatar` de `globals.css`. Aceite: CA-07, CA-25, CA-26, CA-27, CA-30, CA-33. Inclui a correção da cintilação da cabeça na fala, depois do diagnóstico da Lupa.
- **WP-25 (Lupa):** diagnóstico da cintilação e nova medição dos CAs acima.

## Emenda 3 — CA-32 apertado (2026-11-14)

- **T17 — Remontagem da tira.** Base única: quadro 1 limpo. Quadro 3 = quadro 1 + caixa dos olhos do quadro de piscar. Quadros 4 e 5 = quadro 1 + caixa da boca (com até 2 px de margem para acertar a barba). Quadro 6 = quadro 1 + boca e olhos felizes. Quadro 7 = quadro 6 + coração. Quadro 8 = quadro 6 + olhos fechados felizes. Quadro 2 = quadro 1 com a parte de baixo (y ≥ 32) deslocada. Assim contorno da cabeça, gorro, cajado e túnica saem idênticos por construção.
- **Verificação:** script que compara os quadros e imprime, por par, a caixa envolvente dos pixels diferentes e a contagem fora da região permitida (tem de ser 0).
- **WP-24** passa a incluir o CA-32 no aceite; **WP-25** mede.


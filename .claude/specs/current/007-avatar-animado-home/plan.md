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

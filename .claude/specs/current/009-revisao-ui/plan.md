# Plano — 009 Revisão da UI: nome completo, padronização das fichas e simplificação do hero

Lê-se junto com `spec.md`. Os critérios (CA-01 a CA-20), as decisões de produto (DP-01 a DP-09), os contratos e as fronteiras por dono estão lá.

## Decisões técnicas

- **T1 — Fonte única do nome completo onde já existe ligação dinâmica.** Alterar `profile.name` em `src/content/profile.ts` atualiza automaticamente `layout.tsx` (título, `og:site_name`, `.logo` e rodapé), `page.tsx` (`<h1>` e `alt` da foto), `site.ts` (`personJsonLd`) e as duas rotas `opengraph-image.tsx`. As ocorrências literais restantes (`pt.json`, `en.json`, `privacy.ts` e `manifest.ts`) são atualizadas diretamente pelo Dono A. `src/lib/site.ts` e `README.md` não são editados, mantendo zero sobreposição com o PR #4 (`feat/008-dominio-apex`).
- **T2 — Ajuste da imagem OG da home (`src/app/[lang]/opengraph-image.tsx`).** Com 35 caracteres (`"Andre Renato Silva Braga de Menezes"`), o bloco do nome passa de `fontSize: 92, marginTop: 70` para `fontSize: 56, marginTop: 24`, e o bloco da descrição passa de `marginTop: 44` para `marginTop: 28`. Assim o título cabe em até 2 linhas (~118 px) e o conjunto (título + cargo/cidade + caixa de descrição + rodapé `OgFrame`) fica confortavelmente dentro dos `630px` de altura.
- **T3 — Cabeçalho responsivo com nome de 35 caracteres (`src/app/globals.css`).**
  - O layout de 1 linha (`grid-template-areas: "logo hud nav controls"`) sobe de `@media (min-width: 900px)` para `@media (min-width: 1080px)` (em 900–1079 px o nome de 35 caracteres + HUD + nav + 4 botões excederia a largura útil). Em `min-width: 1080px`, `.logo` usa `font-size: clamp(0.88rem, 1.1vw, 1rem); white-space: nowrap;`, cabendo inteiro em 1 linha em `1366×768`.
  - Abaixo de `1080px`, `.header-inner` usa 2 linhas (`"logo controls"` / `"hud nav"`). No bloco `@media (max-width: 419px)` (e em `max-width: 559px`), removem-se `white-space: nowrap`, `overflow: hidden` e `text-overflow: ellipsis` de `.logo`, aplicando `font-size: 0.82rem; line-height: 1.2;` para que o nome completo quebre em 2 linhas (~31 px de altura total, menor que os 38 px dos botões `.controls`), sem truncar `"Silva Braga de Menezes"`.
- **T4 — Padronização das fichas `.item-sheet.dialog-frame` (`src/app/projects.css`).**
  - Em `.inventory-sheets`: adicionar `grid-auto-rows: 1fr;`. Todas as faixas de linha do grid passam a ter a altura da ficha mais alta, tanto no grid de 2 colunas (`min-width: 900px`) quanto no de 1 coluna (`< 900px`).
  - Em `.inventory-sheets > li`: adicionar `display: flex;`.
  - Em `.item-sheet`: adicionar `width: 100%; height: 100%; box-sizing: border-box;`.
  - Em `.item-sheet-slot`: garantir `align-self: start;` para o slot de 88×88 (72×72 no celular) não esticar.
  - Em `.item-sheet-body`: adicionar `align-self: stretch; height: 100%;`.
  - Em `.item-sheet .tags`: definir `margin: 4px 0 0;` (substituindo a margem inferior global `margin: 10px 0 16px` de `.tags`).
  - Em `.item-sheet .project-links`: adicionar `margin-top: auto; padding-top: 6px;`, colando a fileira de botões na base de cada cartão.
  - Nenhuma alteração em `src/components/Inventory.tsx` é necessária: a marcação atual já possui todas as classes-alvo.
- **T5 — Enxugamento de `.hero-inner` (`src/app/[lang]/page.tsx`, `src/app/globals.css`, `src/app/projects.css`).**
  - Em `page.tsx`, substituir `<h1 className="hero-title">{profile.name} <span className="hero-role">{profile.role[lang]}</span></h1>`, `<p className="hero-pitch">{dict.hero.pitch}</p>` e `<p className="hero-game-hint">{dict.hero.gameHint}</p>` por `<h1 className="sr-only">{profile.name} — {profile.role[lang]}</h1>`.
  - Em `globals.css`, remover `.hero-title` e `.hero-role`.
  - Em `projects.css`, remover `.hero-pitch`, `.hero-game-hint` e os overrides mobile de `.hero-title` e `.hero-pitch`.
  - Ajustar `.hero` e `.hero-inner` em `projects.css`:
    - Desktop: `.hero { min-height: min(62vh, 480px); }` e `.hero-inner { padding-block: 96px 28px; gap: 14px; }` (em `max-height: 800px`, `min-height: min(58vh, 440px); padding-block: 88px 22px;`), garantindo `>= 80px` de paisagem visível acima da `.dialog-box` e mantendo `.dialog-box` + `.hero-cta` com folga dentro da primeira dobra de `1366×768` (CA-15, CA-16).
    - Celular (`max-width: 767px`): `.hero { min-height: min(48vh, 360px); }` e `.hero-inner { padding-block: 72px 20px; gap: 12px; }` (em `max-width: 559px`, `.dialog-box` já tem `margin-top: 50px` para o retrato de 64 px que espia no topo, totalizando `>= 56px` entre o cabeçalho e o topo da `.dialog-box`).

## Pacotes de trabalho

Numeração continua a da nota `tasks` (última da spec 008: WP-31).

### WP-32 — Nome completo, dicionários, OG e JSX do hero (Dono A, Forja)

- **Possui:** `src/content/profile.ts`, `src/content/privacy.ts`, `src/app/manifest.ts`, `src/app/[lang]/opengraph-image.tsx`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `src/app/[lang]/page.tsx`.
- **Fora de escopo:** `src/app/globals.css`, `src/app/projects.css`, `src/components/**`, `src/lib/site.ts`, `README.md`, `ACOES-PENDENTES.md`.
- **Objetivo:** aplicar o nome completo `Andre Renato Silva Braga de Menezes` em todas as superfícies do contrato, ajustar a imagem OG da home, enxugar o JSX de `.hero-inner` (`h1.sr-only` + `DialogBox` + `.hero-cta`) e atualizar `pt.json`/`en.json` (remoção de `hero.pitch`/`hero.gameHint` e novas `hero.lines` do Anexo A).
- **Aceite:** CA-01 a CA-04, CA-06, CA-11, CA-13, CA-14, CA-18, CA-20.
- **Depende de:** branch `feat/009-revisao-ui` (já criada pela Sentinela a partir de `origin/development` `bd47b61`).

### WP-33 — Padronização CSS das fichas, hero enxuto e cabeçalho com nome completo (Dono B, Pixel)

- **Possui:** `src/app/projects.css`, `src/app/globals.css`.
- **Fora de escopo:** qualquer `.ts`, `.tsx` ou `.json`, `src/components/NpcAvatar.css`.
- **Objetivo:** igualar largura e altura das 8 fichas `.item-sheet.dialog-frame` com `.project-links` alinhado na base, remover o CSS morto de `.hero-title`/`.hero-role`/`.hero-pitch`/`.hero-game-hint`, calibrar a altura do `.hero` para a primeira dobra e a paisagem, e ajustar `.header-inner`/`.logo` para exibir o nome completo sem corte.
- **Aceite:** CA-05, CA-07 a CA-10, CA-12, CA-15 a CA-19, CA-20.
- **Depende de:** branch `feat/009-revisao-ui` (já criada; roda em paralelo com a WP-32; a verificação integrada de CA-05, CA-12, CA-15 e CA-16 usa o estado combinado de WP-32 + WP-33).

### WP-34 — Revisão independente (Lupa)

- **Possui:** evidências e medições. Não edita código.
- **Objetivo:** validar de forma independente os 20 CAs (medidas por script no navegador em `1366×768` e `390×844` para `/pt` e `/en`, conferência das imagens OG, grep de nome curto e termos vedados, Lighthouse e gates `lint`/`tsc`/`build`).
- **Depende de:** WP-32 e WP-33.

### WP-35 — Git (Sentinela)

- **Possui:** operações git.
- **Objetivo:** sobre a branch `feat/009-revisao-ui` (base `origin/development` `bd47b61`), fazer stage e commits por caminhos explícitos após aprovação da Lupa, e abrir PR apontando para `development` quando autorizado pelo usuário.
- **Depende de:** WP-34 para commits/push/PR.

## Ordem de execução

1. Branch `feat/009-revisao-ui` já criada pela Sentinela a partir de `origin/development` (`bd47b61`).
2. WP-32 (Forja) e WP-33 (Pixel) executam em paralelo (zero arquivos em comum).
3. WP-34 (Lupa) executa a validação independente sobre o working tree integrado.
4. WP-35 (Sentinela) realiza os commits por pacote aprovado e, mediante autorização, push + PR.

## Verificação (comandos e scripts de medição)

- **Gates estáticos (CA-02, CA-12, CA-18, CA-20):**
  - `grep -rn "André Menezes" src public` → 0 linhas
  - `grep -rn "Andre Menezes" src public` → 0 linhas
  - `grep -rnE "hero-title|hero-role|hero-pitch|hero-game-hint|hero\.pitch|hero\.gameHint" src` → 0 linhas
  - `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` → 0 linhas
  - `npm run lint && npx tsc --noEmit && npm run build` → exit 0
- **Medição no navegador em `1366×768` e `390×844`, `/pt` e `/en` (CA-05, CA-07 a CA-11, CA-13, CA-15 a CA-17):**
  - Fichas `.item-sheet.dialog-frame`:
    ```js
    const sheets = [...document.querySelectorAll('.item-sheet.dialog-frame')];
    const rects = sheets.map(el => el.getBoundingClientRect());
    const widths = rects.map(r => r.width);
    const heights = rects.map(r => r.height);
    const linkBottomDiffs = sheets.map((el, i) => rects[i].bottom - el.querySelector('.project-links').getBoundingClientRect().bottom);
    // max(widths) - min(widths) <= 1
    // max(heights) - min(heights) <= 1
    // max(linkBottomDiffs) - min(linkBottomDiffs) <= 2
    ```
  - Hero e primeira dobra (`scrollY === 0`):
    ```js
    const children = [...document.querySelectorAll('.hero-inner > *')].map(el => el.className);
    // ['sr-only', 'dialog-box dialog-frame', 'btn-row hero-cta']
    const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
    const dialogRect = document.querySelector('.dialog-box').getBoundingClientRect();
    const ctas = [...document.querySelectorAll('.hero-cta .btn')].map(el => el.getBoundingClientRect());
    // dialogRect.top - headerBottom >= 80 (desktop) / >= 56 (mobile)
    // dialogRect.bottom <= innerHeight && ctas.every(r => r.bottom <= innerHeight)
    ```
- **Lighthouse (CA-19):** Acessibilidade = 100 em `/pt` e `/en` (desktop e celular).

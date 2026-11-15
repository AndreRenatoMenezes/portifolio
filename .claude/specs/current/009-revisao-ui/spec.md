# 009 — Revisão da UI: nome completo, padronização das fichas e simplificação do hero

- **Domínio:** ui
- **Status:** aprovada para particionamento
- **Autor:** Arquiteto (Prisma)
- **Data:** 2026-11-14
- **Origem:** pedido do usuário em 2026-11-14, em 3 frentes: (1) nome completo `Andre Renato Silva Braga de Menezes` onde o nome curto aparece hoje (grafia `Silva` confirmada pelo usuário); (2) padronização de tamanho dos elementos `class="item-sheet dialog-frame"`; (3) enxugamento do container `.hero-inner`, mantendo visíveis apenas a caixa de diálogo, os botões de ação e o fundo ilustrado.
- **Base git:** branch `feat/009-revisao-ui` criada pela Sentinela a partir de `origin/development` (`bd47b61`), conforme o git flow do projeto (`main` = produção, `development` = preview; features nascem de `origin/development` e o PR aponta para `development`). Interseção de arquivos vazia com o PR #4 (`feat/008-dominio-apex`, que aponta para `main`).

## Contexto e descoberta no repositório

Inventário realizado sobre a base `origin/development` (`bd47b61`):

### 1. Onde o nome curto (`André Menezes`) aparece hoje

| # | Caminho | Linha | Como aparece hoje | Destino na spec 009 |
|---|---------|-------|-------------------|---------------------|
| 1 | `src/content/profile.ts` | 7 | `name: "André Menezes"` | Muda para `"Andre Renato Silva Braga de Menezes"` |
| 2 | `src/app/[lang]/layout.tsx` | 40, 46, 76, 100 | Lê `{profile.name}` em `title.template`, `openGraph.siteName`, `.logo` do cabeçalho e rodapé | Atualiza automaticamente via `profile.name` |
| 3 | `src/app/[lang]/page.tsx` | 55, 110 | Lê `{profile.name}` no `<h1>` do hero e no `alt` da foto em `#about` | Atualiza automaticamente via `profile.name` (`<h1>` vira `.sr-only`; ver frente 3) |
| 4 | `src/lib/site.ts` | 18 | Lê `profile.name` em `personJsonLd` (`Person.name`) | Atualiza automaticamente via `profile.name` (sem editar `site.ts`) |
| 5 | `src/app/[lang]/opengraph-image.tsx` | 8, 19 | Lê `{profile.name}` no `alt` e no título principal da imagem OG (1200×630) | Recebe o nome completo via `profile.name`; exige ajuste de `fontSize`/`marginTop` para não estourar os 630 px de altura |
| 6 | `src/app/[lang]/projects/[slug]/opengraph-image.tsx` | 12, 26 | Lê `{profile.name}` no `alt` e no rodapé (`26px`) | Atualiza automaticamente via `profile.name` (cabe em 1 linha nos 1056 px úteis) |
| 7 | `src/dictionaries/pt.json` | 3, 4 | `"André Menezes — Portfólio"` em `meta.title` e `"André Menezes, Endpoint Engineer: ..."` em `meta.description` | Muda para `"Andre Renato Silva Braga de Menezes"` nos dois campos |
| 8 | `src/dictionaries/en.json` | 3, 4 | `"André Menezes — Portfolio"` em `meta.title` e `"André Menezes, Endpoint Engineer: ..."` em `meta.description` | Muda para `"Andre Renato Silva Braga de Menezes"` nos dois campos |
| 9 | `src/content/privacy.ts` | 19, 83 | `"André Menezes, pessoa física..."` (`pt`) e `"André Menezes, an individual..."` (`en`) na cláusula de controlador (LGPD) | Muda para `"Andre Renato Silva Braga de Menezes"` em `pt` e `en` |
| 10 | `src/app/manifest.ts` | 5, 6, 7 | `name: "André Menezes — Portfólio"`, `short_name: "André"`, `description: "Portfólio de André Menezes, Endpoint Engineer."` | `name` e `description` usam `"Andre Renato Silva Braga de Menezes"`; `short_name` passa a `"Andre"` |

> **Ocorrências apenas do prenome que não são o nome curto e permanecem fora de alteração:** `contact.whatsappText` (`"Olá, André!"` / `"Hi André!"`), `privacy.ts:28,92` (`"caixa de entrada do André"` / `"André's inbox"`) e `projects.ts:171,172` (`"Emanuele e André"` no `alt` do convite de casamento).

### 2. Por que `.item-sheet.dialog-frame` tem tamanhos divergentes hoje

Na seção `#inventory` (`src/components/Inventory.tsx:121-180` e `src/app/projects.css:82-161`), cada um dos 8 projetos renderiza `<article className="item-sheet dialog-frame">` dentro de `<ul className="inventory-sheets"> > <li>`:

1. `.inventory-sheets` define `grid-template-columns: minmax(0, 1fr)` (e `repeat(2, minmax(0, 1fr))` em `min-width: 900px`), mas **não define `grid-auto-rows: 1fr`**, de modo que cada linha do grid assume uma altura distinta conforme o volume de texto.
2. `.inventory-sheets > li` não propaga altura ao filho `<article className="item-sheet dialog-frame">` (`height: 100%` ausente), fazendo com que até fichas lado a lado na mesma linha tenham alturas visuais diferentes.
3. `.item-sheet` usa `align-items: start`, impedindo `.item-sheet-body` de preencher a altura total do cartão, e `.project-links` não tem `margin-top: auto`, deixando os botões de ação desalinhados na base de cada ficha.

### 3. Por que `.hero-inner` está sobrecarregado hoje

Em `src/app/[lang]/page.tsx:50-75`, `<div className="container hero-inner">` empilha 5 blocos visíveis sobre `<HeroScene />`:
1. `<h1 className="hero-title">` com `{profile.name}` + crachá `<span className="hero-role">{profile.role[lang]}</span>`;
2. `<p className="hero-pitch">{dict.hero.pitch}</p>`;
3. `<p className="hero-game-hint">{dict.hero.gameHint}</p>`;
4. `<DialogBox ... />` (retrato animado de 128 px no desktop / 64 px no celular + fala digitada + botão `CONTINUE`);
5. `<div className="btn-row hero-cta">` (`"✉ Fale comigo"` e `"Abrir inventário ↓"`).

As três caixas estáticas acima de `<DialogBox />` cobrem grande parte da paisagem (`<HeroScene />`), competem visualmente com o diálogo do NPC e comprimem a primeira dobra em `1366×768`.

## Decisões de produto

| ID | Decisão | Alternativa rejeitada | Custo de reverter |
|----|---------|----------------------|-------------------|
| DP-01 | **Nome completo em todas as superfícies de identificação.** `profile.name`, `meta.title`, `meta.description` (`pt` e `en`), `privacy.ts` (controlador em `pt` e `en`) e `manifest.ts` (`name` e `description`) passam a usar exatamente **`Andre Renato Silva Braga de Menezes`** (`short_name` do manifest vira `"Andre"`). | Trocar só no `<h1>` ou só no `profile.ts` (deixaria metadados, título da aba e LGPD divergentes) | Baixo |
| DP-02 | **Cabeçalho acomoda o nome completo sem truncar com reticências.** Em `min-width: 1080px` (inclui desktop `1366×768`), `.header-inner` mantém 1 linha (`"logo hud nav controls"`) com `.logo { font-size: clamp(0.88rem, 1.1vw, 1rem); white-space: nowrap; }`, exibindo `"◆ Andre Renato Silva Braga de Menezes"` inteiro em 1 linha. Abaixo de `1080px` (tablet e celular `360–390px`), `.logo` não usa `white-space: nowrap` nem `text-overflow: ellipsis`: quebra de forma limpa em até 2 linhas (`font-size: 0.82rem; line-height: 1.2` em `max-width: 559px`), cabendo dentro dos `38px` de altura dos botões `.controls`. | Manter `white-space: nowrap; text-overflow: ellipsis` em `< 420px` (cortaria para `"◆ Andre Renato…"`, ocultando `"Silva Braga de Menezes"`) | Baixo |
| DP-03 | **Imagem Open Graph da home ajustada para 35 caracteres.** Em `src/app/[lang]/opengraph-image.tsx`, o título `{profile.name}` passa a `fontSize: 56` e `marginTop: 24` (antes `92` e `70`), e a caixa de descrição passa a `marginTop: 28` (antes `44`), mantendo todo o conteúdo dentro de `1200×630`. | Manter `fontSize: 92` (estoura a altura de 630 px com o nome completo) | Baixo |
| DP-04 | **Padronização estrita das 8 fichas `.item-sheet.dialog-frame`.** `.inventory-sheets` recebe `grid-auto-rows: 1fr`, `.inventory-sheets > li` recebe `display: flex` e `.item-sheet` recebe `width: 100%; height: 100%; box-sizing: border-box`. Assim todas as 8 fichas têm a **mesma largura e a mesma altura** em qualquer viewport (desktop 2 colunas e celular 1 coluna). No interior da ficha, `.item-sheet-slot` mantém `align-self: start`, `.item-sheet-body` recebe `align-self: stretch; height: 100%`, `.item-sheet .tags` zera a margem inferior avulsa (`margin: 4px 0 0`) e `.item-sheet .project-links` recebe `margin-top: auto; padding-top: 6px`, alinhando os botões na borda inferior de todas as fichas sem truncar nenhum texto (`line-clamp` proibido pelo CA-20 da spec 005). | Equalizar altura apenas por par de linha (`grid-auto-rows: auto`), que deixaria as 4 linhas do grid com 4 alturas diferentes; ou usar `line-clamp`, que violaria o CA-20 da spec 005 | Baixo |
| DP-05 | **Em `.hero-inner`, ficam visíveis apenas `<DialogBox />` e `.hero-cta` sobre o fundo.** Saem do JSX de `page.tsx` os elementos `<p className="hero-pitch">` e `<p className="hero-game-hint">`, bem como o `<span className="hero-role">` e a classe visual `.hero-title`. Saem de `pt.json` e `en.json` as chaves `hero.pitch` e `hero.gameHint`. Saem de `globals.css` e `projects.css` as regras `.hero-title`, `.hero-role`, `.hero-pitch` e `.hero-game-hint`. | Esconder com `display: none` mantendo HTML/CSS mortos | Baixo |
| DP-06 | **`<h1>` permanece no DOM como `.sr-only` dentro de `.hero-inner`.** `<h1 className="sr-only">{profile.name} — {profile.role[lang]}</h1>` preserva o único `<h1>` da página com nome completo e cargo para leitores de tela, SEO e hierarquia `h1 → h2 → h3` (CA-35 da spec 005 e Lighthouse Acessibilidade 100), sem ocupar espaço visual no hero. | Remover o `<h1>` da página (quebraria a semântica `h1 → h2 → h3` e o CA-35 da spec 005) | Baixo |
| DP-07 | **As 3 falas de `hero.lines` absorvem o cargo, a proposta de valor e a dica de jogo.** Textos exatos no Anexo A: a fala 1 (visível imediatamente ao abrir a página) apresenta o cargo (`Endpoint Engineer` no Rio de Janeiro) e o resumo de atuação (automação de infraestrutura de endpoints em Windows, macOS e Linux e construção de produtos com times de agentes de IA guiados por spec); a fala 2 detalha o ofício (`PASS` ou `FAIL`); a fala 3 informa que o portfólio é um jogo (inventário, fada, gemas escondidas) e aponta para as placas do caminho. | Manter a fala 1 genérica da spec 007 (`"Olá, viajante! ... Sente-se perto da fogueira."`), o que deixaria a primeira tela sem informar o cargo nem o que o autor faz após a retirada de `.hero-role` e `.hero-pitch` | Baixo |
| DP-08 | **Reescrita do critério de primeira dobra (antigo CA-25).** Em `1366×768` (desktop) e `390×844` (celular), com `scrollY = 0`, devem estar integralmente visíveis na primeira dobra (`top >= 0` e `bottom <= innerHeight`): o `.logo` no cabeçalho (com o nome completo), a `.dialog-box` (com `.npc-portrait`) e os dois botões de `.hero-cta` (`"✉ Fale comigo"` / `"✉ Contact me"` e `"Abrir inventário ↓"` / `"Open inventory ↓"`), além da `.mobile-bar` no celular. O `.hero` preserva área de respiro acima da caixa de diálogo para exibir o céu, o sol/lua e as montanhas de `<HeroScene />` (`min-height: min(62vh, 480px)` no desktop e `min-height: min(48vh, 360px)` no celular). | Encolher `.hero` ao tamanho mínimo da caixa de diálogo, esmagando a paisagem de `<HeroScene />` | Baixo |
| DP-09 | **Branch `feat/009-revisao-ui` criada a partir de `origin/development` (`bd47b61`), com PR apontando para `development`.** Segue o git flow do projeto (`main` = produção, `development` = preview). `README.md`, `ACOES-PENDENTES.md`, `src/lib/site.ts` e `.env.example` ficam fora de escopo desta spec (interseção zero com o PR #4). | — | Baixo |

## Dentro do escopo

1. Atualização do nome completo `Andre Renato Silva Braga de Menezes` em `src/content/profile.ts`, `src/content/privacy.ts`, `src/app/manifest.ts`, `src/dictionaries/pt.json` e `src/dictionaries/en.json`.
2. Ajuste tipográfico da imagem OG da home (`src/app/[lang]/opengraph-image.tsx`) e do `.logo` no cabeçalho (`src/app/globals.css`) para exibir o nome completo sem corte nem estouro.
3. Padronização das dimensões externas e do alinhamento interno das 8 fichas `.item-sheet.dialog-frame` em `src/app/projects.css`.
4. Simplificação de `.hero-inner` em `src/app/[lang]/page.tsx`, `src/app/globals.css`, `src/app/projects.css`, `src/dictionaries/pt.json` e `src/dictionaries/en.json`: `<h1 className="sr-only">`, remoção de `.hero-pitch`, `.hero-game-hint` e `.hero-role`, e atualização de `hero.lines` (Anexo A).

## Fora de escopo

- `src/lib/site.ts`, `.env.example`, `README.md`, `ACOES-PENDENTES.md` (tocados pela spec 008 / PR #4).
- `src/components/DialogBox.tsx`, `src/components/NpcAvatar.tsx`, `src/components/NpcAvatar.css`, `public/avatar/**`, `src/components/Inventory.tsx`, `src/components/HeroScene.tsx`, `src/content/projects.ts`.
- Ocorrências informais apenas do primeiro nome `"André"` (`contact.whatsappText`, texto explicativo de caixa de entrada em `privacy.ts` e `alt` de casamento em `projects.ts`).
- Posição da `.gem-hero` no celular (item preexistente registrado no `INBOX.md`).

## Contratos nomeados

### 1. `src/content/profile.ts`

```ts
export const profile = {
  name: "Andre Renato Silva Braga de Menezes",
  initials: "AM",
  // demais campos inalterados
```

### 2. `src/dictionaries/pt.json` e `src/dictionaries/en.json`

- `meta.title`:
  - `pt.json`: `"Andre Renato Silva Braga de Menezes — Portfólio"`
  - `en.json`: `"Andre Renato Silva Braga de Menezes — Portfolio"`
- `meta.description`:
  - `pt.json`: `"Andre Renato Silva Braga de Menezes, Endpoint Engineer: automação para infraestrutura, homologação de hardware e produtos construídos com Spec-Driven Development."`
  - `en.json`: `"Andre Renato Silva Braga de Menezes, Endpoint Engineer: infrastructure automation, hardware certification and products built with Spec-Driven Development."`
- `hero`:
  - Chaves **removidas** em `pt.json` e `en.json`: `hero.pitch` e `hero.gameHint`.
  - Chave **atualizada** em `pt.json` e `en.json`: `hero.lines` (3 strings; valores exatos no Anexo A).
  - Chaves **mantidas** sem alteração: `hero.next`, `hero.continue`, `hero.restart`, `hero.cta`, `hero.ctaContact`.

### 3. `src/content/privacy.ts`

- `privacy.pt.sections[0].body[0]`:
  `"Andre Renato Silva Braga de Menezes, pessoa física, Rio de Janeiro, Brasil — o controlador dos dados, nos termos da LGPD (Lei 13.709/2018)."`
- `privacy.en.sections[0].body[0]`:
  `"Andre Renato Silva Braga de Menezes, an individual based in Rio de Janeiro, Brazil — the data controller under Brazil's LGPD (Law 13,709/2018)."`

### 4. `src/app/manifest.ts`

- `name`: `"Andre Renato Silva Braga de Menezes — Portfólio"`
- `short_name`: `"Andre"`
- `description`: `"Portfólio de Andre Renato Silva Braga de Menezes, Endpoint Engineer."`

### 5. `src/app/[lang]/page.tsx` (bloco `section.hero`)

```tsx
      <section className="hero">
        <HeroScene />
        <Gem id="hero" {...gem} className="gem-hero" />
        <div className="container hero-inner">
          <h1 className="sr-only">
            {profile.name} — {profile.role[lang]}
          </h1>
          <DialogBox
            lines={dict.hero.lines}
            nextLabel={dict.hero.next}
            restartLabel={dict.hero.restart}
            continueLabel={dict.hero.continue}
          />
          <div className="btn-row hero-cta">
            <a className="btn btn-primary" href="#contact">
              ✉ {dict.hero.ctaContact}
            </a>
            <a className="btn btn-ghost" href="#inventory">
              {dict.hero.cta} ↓
            </a>
          </div>
        </div>
      </section>
```

### 6. `src/app/projects.css` e `src/app/globals.css`

- **Padronização de `.item-sheet.dialog-frame` (`src/app/projects.css`):**
  - `.inventory-sheets`: `grid-auto-rows: 1fr;`
  - `.inventory-sheets > li`: `display: flex;`
  - `.item-sheet`: `width: 100%; height: 100%; box-sizing: border-box;`
  - `.item-sheet-slot`: `align-self: start;`
  - `.item-sheet-body`: `align-self: stretch; height: 100%;`
  - `.item-sheet .tags`: `margin: 4px 0 0;`
  - `.item-sheet .project-links`: `margin-top: auto; padding-top: 6px;`
- **Hero enxuto (`src/app/globals.css` e `src/app/projects.css`):**
  - Remover `.hero-title`, `.hero-role`, `.hero-pitch` e `.hero-game-hint`.
  - `.hero`: `min-height: min(62vh, 480px);` no desktop e `min-height: min(48vh, 360px);` em `max-width: 767px`, mantendo `display: flex; align-items: flex-end;` para preservar a paisagem visível acima da `<DialogBox />`.
- **Cabeçalho com nome completo (`src/app/globals.css`):**
  - Breakpoint de linha única do cabeçalho (`.header-inner` com `"logo hud nav controls"`) em `@media (min-width: 1080px)` e `.logo` com `font-size: clamp(0.88rem, 1.1vw, 1rem); white-space: nowrap;`.
  - Abaixo de `1080px` (incluindo `@media (max-width: 419px)`), `.logo` sem `white-space: nowrap`, sem `overflow: hidden` e sem `text-overflow: ellipsis`, com `font-size: 0.82rem; line-height: 1.2;` em `max-width: 559px`.

## Critérios de aceite (binários)

Valem em `/pt` e `/en`. "Desktop" = `1366×768`; "celular" = `390×844`. "Primeira dobra" = com `scrollY === 0`, o elemento tem `getBoundingClientRect().top >= 0`, `getBoundingClientRect().bottom <= window.innerHeight` e está visível (`display !== 'none'`, `visibility !== 'hidden'`, `opacity !== '0'`).

### Frente 1 — Nome completo

| ID | Critério |
|----|----------|
| CA-01 | `profile.name` em `src/content/profile.ts` é exatamente `"Andre Renato Silva Braga de Menezes"` |
| CA-02 | `grep -rn "André Menezes" src public` e `grep -rn "Andre Menezes" src public` retornam **0 linhas** |
| CA-03 | Em `/pt` e `/en`, `document.title`, `meta[name="description"]`, `meta[property="og:site_name"]`, o JSON-LD `Person.name`, o `.logo` no cabeçalho, o `<h1>` e o rodapé contêm `"Andre Renato Silva Braga de Menezes"` |
| CA-04 | Em `/pt/privacy` e `/en/privacy`, o primeiro parágrafo da seção de controlador contém `"Andre Renato Silva Braga de Menezes"`; em `/manifest.webmanifest`, `name` e `description` contêm `"Andre Renato Silva Braga de Menezes"` |
| CA-05 | No desktop (`1366×768`), `.logo` renderiza em 1 linha (`logo.getClientRects().length <= 2` considerando o `span.logo-mark` e o texto, e `logo.getBoundingClientRect().height <= 28`) e `logo.scrollWidth <= logo.clientWidth`. No celular (`390×844`), `getComputedStyle(logo).textOverflow` não é `"ellipsis"`, o texto completo está visível sem corte e `logo.getBoundingClientRect().height <= 42` |
| CA-06 | As rotas `/pt/opengraph-image` e `/en/opengraph-image` respondem `200` (`image/png`, `1200×630`) com o nome completo visível e sem sobreposição ou corte do rodapé |

### Frente 2 — Padronização de `.item-sheet.dialog-frame`

| ID | Critério |
|----|----------|
| CA-07 | Em `/pt` e `/en`, no desktop (`1366×768`), os 8 elementos `.item-sheet.dialog-frame` têm **a mesma largura** (`max(widths) - min(widths) <= 1` px) e **a mesma altura** (`max(heights) - min(heights) <= 1` px) medidas via `getBoundingClientRect()` |
| CA-08 | Em `/pt` e `/en`, no celular (`390×844`), os 8 elementos `.item-sheet.dialog-frame` têm **a mesma largura** (`max(widths) - min(widths) <= 1` px) e **a mesma altura** (`max(heights) - min(heights) <= 1` px) medidas via `getBoundingClientRect()` |
| CA-09 | Em cada uma das 8 fichas `.item-sheet.dialog-frame` (desktop e celular), a distância entre a borda inferior da ficha (`sheet.getBoundingClientRect().bottom`) e a borda inferior de `.project-links` (`links.getBoundingClientRect().bottom`) é uniforme: `max(diffs) - min(diffs) <= 2` px |
| CA-10 | Nenhum elemento dentro de `.item-sheet` usa `-webkit-line-clamp` ou `text-overflow: ellipsis`; todos os campos exigidos pelo CA-20 da spec 005 continuam integralmente visíveis |

### Frente 3 — Simplificação de `.hero-inner` e primeira dobra

| ID | Critério |
|----|----------|
| CA-11 | Dentro de `.hero-inner`, os únicos elementos filhos diretos no DOM são `h1.sr-only`, `.dialog-box.dialog-frame` e `.btn-row.hero-cta` (`document.querySelectorAll('.hero-inner > *').length === 3`) |
| CA-12 | Não existem elementos `.hero-title`, `.hero-role`, `.hero-pitch` nem `.hero-game-hint` no DOM; `grep -rnE "hero-title|hero-role|hero-pitch|hero-game-hint|hero\.pitch|hero\.gameHint" src` retorna **0 linhas** |
| CA-13 | O `<h1>` dentro de `.hero-inner` tem classe `sr-only`, contém `"Andre Renato Silva Braga de Menezes"` e `"Endpoint Engineer"`, e `document.querySelectorAll('h1').length === 1` |
| CA-14 | `hero.lines` em `src/dictionaries/pt.json` e `src/dictionaries/en.json` tem exatamente as 3 falas do Anexo A, caractere por caractere, e `pt.json` e `en.json` mantêm exatamente o mesmo conjunto de chaves |
| CA-15 | **Primeira dobra (atualiza CA-25 da spec 005/007):** em `1366×768` (desktop) e `390×844` (celular), com `scrollY === 0`, estão integralmente na primeira dobra (`top >= 0` e `bottom <= innerHeight`): `.logo`, `.dialog-box` (incluindo `.npc-portrait`) e ambos os botões de `.hero-cta` (`"✉ Fale comigo"` / `"✉ Contact me"` e `"Abrir inventário ↓"` / `"Open inventory ↓"`), além de `.mobile-bar` no celular |
| CA-16 | Paisagem visível no hero: a distância entre o fundo de `.site-header` e o topo de `.dialog-box` (`dialogBox.getBoundingClientRect().top - header.getBoundingClientRect().bottom`) é `>= 80` px no desktop (`1366×768`) e `>= 56` px no celular (`390×844`), garantindo que o céu e os elementos de `<HeroScene />` fiquem visíveis acima da caixa de diálogo |

### Regressão e qualidade

| ID | Critério |
|----|----------|
| CA-17 | Em `360px`, `375px`, `390px` e `1366px`, `document.documentElement.scrollWidth === document.documentElement.clientWidth` em `/pt` e `/en` |
| CA-18 | `npm run lint`, `npx tsc --noEmit` e `npm run build` saem com código `0` |
| CA-19 | Lighthouse Acessibilidade = **100** em `/pt` e `/en` (desktop e celular); contraste ≥ 4,5:1 mantido nos temas `day`, `night` e `temple` |
| CA-20 | `grep -rniE -f .claude/specs/termos-vedados.local --exclude='*.local' src public .claude/specs ACOES-PENDENTES.md README.md` retorna **0 linhas**; o diff toca apenas os caminhos listados em "Fronteiras de arquivo sugeridas" |

## Riscos

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Nome completo (35 caracteres) quebrar o layout do cabeçalho ou ser cortado por `text-overflow: ellipsis` no celular | Alto | DP-02 e CA-05: `clamp` em linha única a partir de `1080px` e quebra limpa sem `ellipsis` abaixo disso |
| Nome completo estourar a altura de 630 px da imagem Open Graph da home | Médio | DP-03 e CA-06: redução de `fontSize` para `56` e `marginTop` para `24` em `src/app/[lang]/opengraph-image.tsx` |
| `grid-auto-rows: 1fr` aumentar a altura das fichas mais curtas deixando os botões flutuando no meio do cartão | Médio | DP-04 e CA-09: `.item-sheet-body` com `height: 100%` e `.project-links` com `margin-top: auto` ancoram os botões na base em todas as fichas |
| Retirada de `.hero-role`, `.hero-pitch` e `.hero-game-hint` esconder do recrutador o cargo e a proposta de valor na primeira tela | Alto | DP-07 e CA-14: a fala 1 de `hero.lines` (exibida imediatamente ao abrir) incorpora o cargo (`Endpoint Engineer`) e a proposta de valor; a fala 3 incorpora a dica de jogo |
| Retirada visual do `<h1>` quebrar a hierarquia de títulos (`h1 → h2 → h3`) no Lighthouse | Médio | DP-06, CA-13 e CA-19: `<h1>` mantido com classe `sr-only` |
| Conflito de git com o PR #4 (`feat/008-dominio-apex`) aguardando merge | Baixo | DP-09: branch nasce de `origin/development` (PR apontando para `development`) e não toca em nenhum arquivo do PR #4 |

## Fronteiras de arquivo sugeridas

Um dono por caminho. Dono A e Dono B têm interseção vazia e podem executar em paralelo (ou ser fundidos pelo Maestro em um único executor).

| Dono sugerido | Possui | Fora de escopo |
|---------------|--------|----------------|
| **A — Engineer (Forja): Conteúdo, Dicionários, OG e JSX da Home** | `src/content/profile.ts`, `src/content/privacy.ts`, `src/app/manifest.ts`, `src/app/[lang]/opengraph-image.tsx`, `src/dictionaries/pt.json`, `src/dictionaries/en.json`, `src/app/[lang]/page.tsx` | Qualquer `.css`, `src/components/**`, `src/lib/site.ts`, `README.md`, `ACOES-PENDENTES.md` |
| **B — UI Designer (Pixel): CSS das Fichas, Hero e Cabeçalho** | `src/app/projects.css`, `src/app/globals.css` | Qualquer `.ts`, `.tsx` ou `.json`, `src/components/NpcAvatar.css` |
| **Reviewer (Lupa)** | Evidências dos CAs (medidas por script no navegador, capturas e Lighthouse) | Não edita código |
| **Git Master (Sentinela)** | Branch `feat/009-revisao-ui` a partir de `origin/development`, stage, commits por WP aprovada, push e PR para `development` quando autorizado | Não edita código de produto |
| **Arquiteto (Prisma)** | `.claude/specs/current/009-revisao-ui/**`, `.claude/specs/ROADMAP.md` | Código de produto e git |

## Anexo A — Falas do diálogo (`hero.lines`)

`hero.lines` em `src/dictionaries/pt.json`:

1. `Olá, viajante! Sou Endpoint Engineer no Rio de Janeiro: automatizo a infraestrutura de endpoints em Windows, macOS e Linux e construo produtos com times de agentes de IA guiados por spec.`
2. `Meu ofício é tirar trabalho manual do caminho: testo hardware, padronizo máquinas e escrevo scripts que rodam sozinhos. Cada teste devolve PASS ou FAIL.`
3. `Este portfólio é um jogo: explore o inventário abaixo, siga a fada e procure as gemas escondidas. Se a jornada pedir um aliado, as placas do caminho levam até mim.`

`hero.lines` em `src/dictionaries/en.json`:

1. `Hello, traveler! I'm an Endpoint Engineer in Rio de Janeiro: I automate endpoint infrastructure across Windows, macOS and Linux and build products with spec-driven AI agent teams.`
2. `My craft is getting manual work out of the way: I test hardware, standardize machines and write scripts that run on their own. Every test returns PASS or FAIL.`
3. `This portfolio is a game: explore the inventory below, follow the fairy and look for hidden gems. If your journey calls for an ally, the signposts lead to me.`

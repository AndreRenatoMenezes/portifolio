# Plano — 005 Revisão do portfólio (emenda 1)

Lê-se junto com `spec.md`. Os critérios (CA-xx), as decisões de produto (DP-x) e as fronteiras por dono estão lá.

A versão original deste plano (D1 a D16) descrevia os dois modos e já foi implementada no branch `feat/005-revisao-portfolio`. Este plano descreve **só o delta** da emenda 1 sobre esse branch. Das decisões originais continuam valendo: D8 (`ProjectLinks` único), D12 (papel e resultado no cabeçalho da página do projeto), D14 (prints do OpenWeddy), D15 (capas SVG dos projetos novos) e D16 (sem dependência nova; ler `node_modules/next/dist/docs/` antes de mexer em `layout.tsx`, metadados ou `opengraph-image`). As demais (D1 a D7, D9 a D11, D13) estão revogadas.

## Decisões técnicas

- **E1 — Remover o modo, por inteiro e de uma vez (dono B).** A regra de `mode.css` esconde tudo que tem `data-mode-only="adventure"` quando o `<html>` não tem `data-mode="adventure"`. Por isso, tirar o atributo `data-mode` sem tirar as marcações faria o jogo sumir. A remoção vai junta:
  - `layout.tsx`: o script inline volta a tratar só o tema (sai a leitura de `portfolio-mode` e o `d.dataset.mode`); o `<html>` perde `data-mode="direct"`; sai `import "../mode.css"`; sai o `ModeToggle` do cabeçalho; a navegação usa `dict.sections.projects` e `dict.sections.about` como texto direto (sem `ModeText`); a dica da melodia perde `data-mode-only`.
  - `store.ts`: saem `Mode`, `MODE_KEY`, `mode` de `Prefs` e de `serverSnapshot`, a leitura de `dataset.mode`, a gravação em `setPrefs` e `setMode`.
  - `Controls.tsx`: sai a reaplicação de `dataset.mode` ao trocar de idioma e o `data-mode-only` dos botões de som e da fada.
  - `Hud.tsx`, `Fairy.tsx`, `Gem.tsx`, `DialogBox.tsx`, `Effects.tsx`: sai o `data-mode-only` do elemento raiz. Em `Effects.tsx`, sai também a guarda `if (document.documentElement.dataset.mode !== "adventure") return;` (sem ela removida, os efeitos nunca disparam).
  - `analytics.ts`: se o tipo de evento listar `mode_switch`, sai.
  - Apagar `ModeToggle.tsx`, `ModeText.tsx` e `mode.css` **depois** que o dono C tirar os usos (ver Ordem). O cabeçalho volta à grade de `globals.css` (`"logo controls" / "hud nav"`, e `"logo hud nav controls"` a partir de 900 px), que não tem a área `mode`.
  - Resultado esperado: o `grep` do CA-41 não acha nada.

- **E2 — Hero e rótulos da home (dono C, `page.tsx`).**
  - Hero, nesta ordem: `<h1>` (como está), `<p className="hero-pitch">` (como está), `<p className="hero-game-hint">{dict.hero.gameHint}</p>` (novo), `DialogBox` (sem `data-mode-only`), linha de botões com "Fale comigo" (primário) e "Abrir inventário". Saem os botões de GitHub e LinkedIn e o `ModeToggle` (DP-14).
  - Se no desktop 1366×768 o botão "Fale comigo" não couber na primeira dobra (CA-25), a linha de botões sobe para antes do `DialogBox`. Medir antes de decidir; registrar no `tasks.md`.
  - Títulos `<h2>`: texto direto, `${dict.inventory.title} · ${dict.sections.projects}`, `${dict.about.title} · ${dict.sections.about}`, `${dict.contact.title} · ${dict.sections.contact}` (CA-27). Subtítulos, `<dt>` e `<h3>` do "Sobre" usam as chaves de jogo que já existem (`inventory.subtitle`, `about.*`, `contact.text`). Sai todo `ModeText` e todo `data-mode-only` da página (inclusive o do `li.signpost-gem`).
  - Sai `<ProjectCards>`; a seção `#inventory` renderiza só `<Inventory>`.

- **E3 — `InventoryItem` ganha `icon`.** `icon?: { src: string; width: number; height: number }`, copiado de `project.icon` em `page.tsx`. `cover` continua no tipo (o modal usa). `role`, `outcome`, `summary`, `stats`, `tags`, `links`, `private` continuam.

- **E4 — `ProjectIcon` (dono C, novo, sem estado).** Assinatura: `<ProjectIcon icon={InventoryItem["icon"]} item={ItemIcon} size={number} className? />`. Com `icon`: `next/image` com `src`, `width={size}`, `height={size}`, `alt=""`, `unoptimized` (SVG) e a classe `project-icon-real`. Sem `icon`: `<ItemIconSvg name={item} size={size} />`. Não usa API de servidor, então serve tanto no `Inventory` (cliente) quanto na página do projeto (servidor). Usado em três lugares: slot da ficha (56 px no desktop, 48 no celular), modal (72 px) e cabeçalho da página do projeto (64 px). CSS: `.project-icon-real { filter: none; }` e nenhuma regra de `rotate` ou `drop-shadow` alcança essa classe (CA-44).

- **E5 — `Inventory` em fichas (dono C, reescrita de `Inventory.tsx`).**
  - Estrutura: `<ul className="inventory-sheets">` → `<li>` → `<article className="item-sheet dialog-frame">`. Dentro do `article`: o slot e o corpo.
  - Slot: `<Link className="slot item-sheet-slot" href={`/${lang}/projects/${slug}`} prefetch={false} aria-label={`${dict.open}: ${title}`} data-index={i}>` com `<ProjectIcon>` e `<span className="target-cursor" aria-hidden="true" />`. O cursor de mira aparece por CSS (`.item-sheet-slot:hover .target-cursor`, `:focus-visible .target-cursor`), sem estado de seleção.
  - Clique no slot: o mesmo tratamento de hoje (sem modificador e botão 0 → `preventDefault` e abre o modal; com modificador → segue o link). Sem JavaScript, é um link comum (CA-10).
  - Corpo: `<p className="item-panel-label">{kind} · {year}</p>`, `<h3 className="item-sheet-title">{title}</h3>`, `<p className="item-sheet-summary">{summary}</p>`, `<dl className="project-role-outcome">` (papel e resultado), `<Stats>` (até 3), `<ul className="tags">`, `<ProjectLinks showDetails … />`. Sem capa (CA-40).
  - Teclado (DP-16): todos os slots com `tabIndex` padrão (sem tabindex móvel). `onKeyDown` no `<ul>`: se o alvo tem `data-index`, as setas calculam o vizinho com o número de colunas lido de `getComputedStyle(ul).gridTemplateColumns`, Home/End vão ao primeiro e ao último; move o foco e toca `playCursor()` (o som já respeita a preferência).
  - Saem: estado `selected`, `SLOTS_PER_PAGE`, slots vazios, painel `item-panel` e o botão "Inspecionar item" do painel.
  - Modal `ItemGetModal`: troca `ItemIconSvg` por `ProjectIcon` (72 px); o resto fica. Guardar numa `ref` o slot que abriu o modal e devolver o foco a ele no `onClose` (Safari não foca link no clique, então não dá para confiar na restauração do navegador) (CA-46).

- **E6 — CSS das fichas (dono C, `src/app/projects.css`).**
  - Renomear `.project-card*` para `.item-sheet*` e tirar o que era da capa (`.project-card-media`, `.project-card-cover`).
  - `.inventory-sheets`: `display: grid; gap: 20px;` em 1 coluna; `grid-template-columns: repeat(2, minmax(0, 1fr))` a partir de 900 px (CA-19). `list-style: none; padding: 0`.
  - `.item-sheet`: `display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: start;` com o slot à esquerda (`.item-sheet-slot`: 88×88 px, 72×72 abaixo de 560 px). A classe `.slot` de `globals.css` dá a moldura, o fundo e o `aspect-ratio`.
  - Efeito de hover/foco no slot: ícone de fantasia escala e inclina como hoje (`scale(1.12) rotate(-6deg)`); ícone real só escala (`scale(1.08)`), sem rotação (CA-44).
  - `@media (prefers-reduced-motion: reduce)`: `.item-sheet-slot svg, .item-sheet-slot img { transform: none }` e `.item-sheet-slot .target-cursor { animation: none }` (CA-38). A regra global de `globals.css` zera a duração, mas não desfaz o `transform` estático.
  - Celular: `min-width: 0` nos filhos do grid e `overflow-wrap: anywhere` em tags longas, para o CA-23.
  - O dono C não edita `globals.css`. As regras que ficam mortas lá (`.inventory`, `.inventory-grid`, `.slot-empty`, `.slot-name`, `.slot[data-selected]…`, `.item-panel`) podem ser removidas pelo dono B no fim, **sem** tocar em `.item-panel-label`, `.item-stats` e `.target-cursor`, que continuam em uso. É limpeza opcional, não é critério.

- **E7 — Página do projeto (dono C).** `ProjectIcon` (64 px) no lugar de `ItemIconSvg` no cabeçalho. O link de volta usa `dict.project.back` e o `<dt>` da stack usa `dict.project.stack`, como texto direto (CA-30). Sai `ModeText`.

- **E8 — Imagem OG do projeto (dono C, `opengraph-image.tsx`).** Com `project.icon`: ler o arquivo de `public` (`readFile(join(process.cwd(), "public", project.icon.src))`) e passar como `data:image/svg+xml;base64,…` (ou `image/png` para raster) num `<img width={128} height={128}>`. Sem `icon`: `ItemIconSvg` como hoje (CA-45). Antes de mexer, ler o guia de `opengraph-image` e `ImageResponse` em `node_modules/next/dist/docs/` (regra do `AGENTS.md`).

- **E9 — Ícones reais (dono A).**
  - Hardware Test Hub: baixar `docs/assets/brand/icon.svg` do repositório público `AndreRenatoMenezes/win_testehub` (por exemplo, `gh api -H "Accept: application/vnd.github.raw" repos/AndreRenatoMenezes/win_testehub/contents/docs/assets/brand/icon.svg`). Remover o bloco `<metadata>…</metadata>` e o atributo `xmlns:c2pa`. Salvar como `public/projects/hardware-test-hub/icon.svg`.
  - Índice: copiar `docs/marca/indice-icon.svg` do repo local `indice` para `public/projects/indice/icon.svg`, sem alteração.
  - OrçaZen: copiar `public/icon-mark.svg` do repo local `app-financeiro` para `public/projects/orcazen/icon.svg`, sem alteração.
  - `width`/`height` no contrato: para SVG, o tamanho do `viewBox` (os três são quadrados); para raster, os pixels do arquivo.
  - Conferir os três com o `grep` do CA-43 e com o do CA-05 antes de entregar.
  - **Não** copiar nenhum ícone dos repositórios `macbenchmark`, `ELV` ou `relatorio_lab` (DP-12, DP-15).

- **E10 — Dicionários (dono A).** Aplicar a seção de dicionários da spec e o Anexo B em `pt.json`, e traduzir para `en.json`: novas `hero.gameHint` e `sections.{projects,about,contact}`; removidos os grupos `mode` e `direct`, mais `nav.projects`, `nav.about`, `inventory.selected` e `inventory.empty`; alterados `inventory.subtitle`, `project.stack` e a dica da fada sobre o escudo. Como o tipo `Dictionary` vem do JSON, a remoção quebra o `tsc` nos arquivos de B e C até eles tirarem os usos. Por isso A entrega as **chaves novas primeiro** (A1) e as **remoções por último** (A3), depois de B1 e C1.

- **E11 — Sem dependência nova.** Nada a instalar.

## Arquivos

| Arquivo | Ação | Dono |
|---|---|---|
| `src/content/projects.ts` | campo `icon` no tipo; `icon` em `hardware-test-hub`, `indice`, `orcazen` | A |
| `public/projects/{hardware-test-hub,indice,orcazen}/icon.svg` | novos | A |
| `src/dictionaries/pt.json`, `en.json` | E10 | A |
| `ACOES-PENDENTES.md` | T12: acrescentar que a autorização também é condição para usar o ícone dos projetos do laboratório | A |
| `src/lib/store.ts` | E1 | B |
| `src/lib/analytics.ts` | E1, se aplicável | B |
| `src/app/[lang]/layout.tsx` | E1 | B |
| `src/components/Controls.tsx`, `Hud.tsx`, `Fairy.tsx`, `Gem.tsx`, `Effects.tsx`, `DialogBox.tsx` | E1 | B |
| `src/components/ModeToggle.tsx`, `ModeText.tsx`, `src/app/mode.css` | apagar (depois de C1) | B |
| `src/app/globals.css` | limpeza opcional de regras mortas (E6) | B |
| `src/app/[lang]/page.tsx` | E2, E3 | C |
| `src/components/ProjectIcon.tsx` | novo (E4) | C |
| `src/components/Inventory.tsx` | reescrita (E5) | C |
| `src/components/ProjectCards.tsx` | apagar | C |
| `src/app/projects.css` | E6 | C |
| `src/app/[lang]/projects/[slug]/page.tsx` | E7 | C |
| `src/app/[lang]/projects/[slug]/opengraph-image.tsx` | E8 | C |
| `.claude/specs/schema.md` | "modo" sai do estado do visitante | Arquiteto (feito nesta emenda) |

## Ordem sugerida

1. **A1** (dono A): campo `icon` no tipo e nos 3 projetos, os 3 arquivos de ícone, e as **chaves novas** do dicionário (sem remover nada ainda). Destrava C.
2. **B1** (dono B), em paralelo com A1: E1 inteiro, **menos** apagar `ModeToggle.tsx`, `ModeText.tsx` e `mode.css`.
3. **C1** (dono C), depois de A1: E2 a E8; apagar `ProjectCards.tsx`.
4. **B2** (dono B), depois de C1: apagar `ModeToggle.tsx`, `ModeText.tsx` e `mode.css`; limpeza opcional de `globals.css`.
5. **A3** (dono A), depois de B1 e C1: remover as chaves antigas (grupos `mode` e `direct`, `nav.projects`, `nav.about`, `inventory.selected`, `inventory.empty`) e aplicar os valores alterados.
6. Revisão: todos os CAs, em `/pt` e `/en`, desktop e celular, nos temas dia e noite.

A A2 da versão original (projetos novos, capas, T10–T13) e a dependência da T10 para o link e os prints do OpenWeddy continuam como estavam. Se a T10 não for feita a tempo, o CA-03 vale como "ausente" e o CA-04 e o CA-31 ficam como pendência no `tasks.md`.

## Verificação

- **Dados e ícones (CA-01 a CA-08, CA-42, CA-43):** `npx tsc --noEmit`; `grep` do CA-05 com a lista local (registrar só "0 linhas"); `git check-ignore` do CA-05b; `ls public/projects/*`; `grep -ciaE 'c2pa|<metadata|xmp|exif'` em cada `icon.*`; `wc -c` (≤ 30 KB); `npm run build && npm run start` e `curl -I` nas 16 rotas, nas 16 imagens OG e no sitemap.
- **Sem modo (CA-41, CA-24):** o `grep` do CA-41; no navegador, `document.documentElement.hasAttribute("data-mode") === false`; conferir que diálogo, HUD, fada, gemas, som, notificações e melodia aparecem e funcionam.
- **Primeira dobra e rótulos (CA-18, CA-25, CA-27):** os dois viewports; medir `getBoundingClientRect()` no console.
- **Fichas (CA-10, CA-19 a CA-23, CA-28, CA-36, CA-44, CA-46):** contar `#inventory article` (8); conferir `href` de cada link; percorrer com Tab e com as setas; abrir e fechar o modal por clique, Esc e fundo, conferindo o foco de volta; clique com ⌘/Ctrl abre a página do projeto; repetir com JavaScript desligado; `getComputedStyle` do ícone real (`filter`, `transform` com hover).
- **Página do projeto e OG (CA-29 a CA-31, CA-45):** `/pt/projects/indice`, `/pt/projects/macbenchmark` e `/pt/projects/openweddy`; abrir `/pt/projects/indice/opengraph-image` e `/pt/projects/macbenchmark/opengraph-image`.
- **i18n (CA-32, CA-33):** `tsc` e busca dos textos do Anexo B no HTML de `/en`.
- **Qualidade (CA-34 a CA-40):** Lighthouse (registrar no `tasks.md` a medição de `main` antes da 005 e a final), `npm run lint`, console do navegador, `prefers-reduced-motion` emulado no DevTools.

## Banco

Sem alterações. A emenda remove o único estado novo da versão original (`portfolio-mode` no `localStorage`).

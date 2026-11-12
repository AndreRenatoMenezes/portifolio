# Plano — 005 Revisão do portfólio

Lê-se junto com `spec.md`. Os critérios (CA-xx), as decisões de produto (DP-x) e as fronteiras por dono estão lá.

## Decisões técnicas

- **D1 — Modo no `<html>`, antes da pintura.** O script inline de `layout.tsx` que hoje aplica o tema passa a aplicar também `data-mode`: lê `localStorage["portfolio-mode"]`, aceita só `direct` ou `adventure`, e usa `direct` em qualquer outro caso. O `<html>` sai do servidor com `data-mode="direct"`, então sem JavaScript vale o modo direto (CA-09, CA-10).
- **D2 — Estado em `src/lib/store.ts`.** `Prefs` ganha `mode: "direct" | "adventure"`, lido de `document.documentElement.dataset.mode` (como `theme`). `setMode(mode)` grava `portfolio-mode`, atualiza o atributo e notifica os assinantes. `serverSnapshot.mode = "direct"`. Como `Controls` já reaplica o tema ao trocar de idioma (o `<html>` remonta), reaplicar o modo no mesmo efeito (CA-14).
- **D3 — `ModeText` (server component, dono B).** Assinatura: `<ModeText direct={string} adventure={string} />`. Renderiza dois `<span>`, `data-mode-only="direct"` e `data-mode-only="adventure"`. O CSS esconde o que não é do modo atual com `display: none`, então o nome acessível de um `<h2>` é só o texto visível (CA-18, CA-27, CA-36). Para blocos inteiros, o mesmo atributo `data-mode-only` vai direto no elemento.
- **D4 — `ModeToggle` (client component, dono B).** Assinatura: `<ModeToggle dict={Dictionary["mode"]} variant="hero" | "header" />`. Um `<button aria-pressed>` com texto visível: `mode.toAdventure` no modo direto, `mode.toDirect` no aventura. No `variant="hero"`, mostra também `mode.hint` no modo direto. Ao acionar: `setMode`, `track("mode_switch", { to })` (CA-11, CA-13, CA-15).
- **D5 — Regras de visibilidade em `src/app/mode.css` (dono B).**
  `html[data-mode="direct"] [data-mode-only="adventure"], html[data-mode="adventure"] [data-mode-only="direct"] { display: none }`.
  No modo direto, também `display: none` para `.hud`, `.fairy`, as gemas, os botões de som e da fada em `Controls` e a dica da melodia (CA-17). Preferir marcar esses elementos com `data-mode-only="adventure"` no JSX a listar classes no CSS; onde o componente retorna `null` por preferência (fada), o atributo no elemento raiz basta.
- **D6 — Um só HTML com as duas cascas (DP-7).** Em `page.tsx`, a seção `#inventory` renderiza `<ProjectCards>` com `data-mode-only="direct"` e `<Inventory>` com `data-mode-only="adventure"`. Os dois recebem a mesma lista `items`, montada uma vez. O `id="inventory"` fica para não quebrar âncoras e links externos.
- **D7 — `ProjectCards` (server component, dono C).** Sem estado e sem JavaScript de cliente. `<ul>` de `<li><article>`; capa com `next/image` e `loading="lazy"`; campos do CA-20; links por `ProjectLinks`.
- **D8 — `ProjectLinks` (dono C).** Um componente para os botões "ao vivo", "código", "pedir demonstração" e, opcionalmente, "ver detalhes". Usado nos cartões, no painel do item, no modal e na página do projeto, para os quatro lugares terem os mesmos links (CA-21, CA-26, CA-29). Substitui os blocos `btn-row` repetidos hoje em `Inventory.tsx` e `projects/[slug]/page.tsx`.
- **D9 — `InventoryItem` ganha `role` e `outcome`** (já traduzidos em `page.tsx`). O painel do item mostra os dois e usa `ProjectLinks` (CA-26). O comportamento de teclado e o modal não mudam (CA-28).
- **D10 — Hero.** O `<h1>` fica como está. Logo abaixo entra `<p className="hero-pitch">` com `hero.pitch`, visível nos dois modos (CA-16, CA-25). `DialogBox` recebe `data-mode-only="adventure"`. A linha de botões no modo direto: contato (primário), GitHub, LinkedIn, e o `ModeToggle variant="hero"`. No modo aventura continua "Fale comigo" + "Abrir inventário", mais o `ModeToggle`. Os links de GitHub e LinkedIn vêm de `profile.contacts`.
- **D11 — Rótulos das seções.** Cada `<h2>`, subtítulo, `<dt>` e item de navegação com termo de jogo passa a usar `ModeText`. No modo aventura, o título é "termo de jogo · termo liso" (CA-27), montado em `page.tsx` a partir das duas chaves; não criar chaves novas para a forma composta.
- **D12 — Página do projeto.** Papel e resultado entram no cabeçalho, abaixo do resumo, como `<dl>`. `project.back`/`project.stack` passam por `ModeText` com `direct.project.*`. Links por `ProjectLinks` (CA-29, CA-30).
- **D13 — CSS por dono.** `mode.css` (dono B) e `projects.css` (dono C), importados em `layout.tsx` depois de `globals.css`. O dono C não edita `globals.css`; se precisar mudar uma regra existente de `.inventory`, `.item-panel` ou `.project`, pede ao dono B ou sobrescreve em `projects.css`.
- **D14 — Prints do OpenWeddy (dono A).** Capturados do site público, em janela anônima, 1440 px de largura, convertidos para webp com o `sharp` que já vem com o Next (script descartável, não versionado, ou `scripts/` se o Maestro preferir manter). `width`/`height` reais no contrato. Só depois da T10.
- **D15 — Capas dos projetos novos (dono A).** SVG ilustrado 1200×750 no estilo de `public/projects/hardware-test-hub/1.svg`, um por projeto, sem logo nem nome de empresa.
- **D16 — Sem dependência nova.** Nada a instalar. Next 16: antes de mexer em `layout.tsx` ou em metadados, ler o guia em `node_modules/next/dist/docs/` (regra do `AGENTS.md`).

## Arquivos

| Arquivo | Ação | Dono |
|---|---|---|
| `src/content/projects.ts` | tipo `Project` (+`role`, +`outcome`); 4 projetos novos; OpenWeddy com demo e prints; reordenar | A |
| `public/projects/{macbenchmark,indice,linux-endpoint-bench,homolog-dashboard}/1.svg` | novos | A |
| `public/projects/openweddy/*.webp` | novos (≥ 3); `1.svg` removido | A |
| `src/dictionaries/pt.json`, `en.json` | chaves do Anexo B; `modal.demo`/`modal.github` alinhados; dicas da fada atualizadas | A |
| `ACOES-PENDENTES.md` | T10–T13 | A |
| `.claude/specs/schema.md`, `INBOX.md` | "modo" no estado do visitante; marcar itens promovidos | A |
| `src/lib/store.ts` | `mode`, `setMode` | B |
| `src/app/[lang]/layout.tsx` | script inline com modo; `data-mode`; imports de CSS; `ModeText` na navegação; `ModeToggle` no cabeçalho; marcar HUD, fada, melodia | B |
| `src/components/Controls.tsx` | reaplicar modo ao trocar idioma; marcar botões de som e fada | B |
| `src/components/ModeToggle.tsx`, `ModeText.tsx` | novos | B |
| `src/app/mode.css` | novo | B |
| `src/components/Hud.tsx`, `Fairy.tsx`, `Gem.tsx`, `Effects.tsx`, `DialogBox.tsx` | `data-mode-only="adventure"` no elemento raiz, onde D5 não resolver pelo pai | B |
| `src/app/[lang]/page.tsx` | hero (D10), seção de projetos (D6), rótulos (D11) | C |
| `src/components/ProjectCards.tsx`, `ProjectLinks.tsx` | novos | C |
| `src/components/Inventory.tsx` | `role`/`outcome` no painel; `ProjectLinks` no painel e no modal | C |
| `src/app/[lang]/projects/[slug]/page.tsx` | D12 | C |
| `src/app/projects.css` | novo | C |

## Ordem sugerida

1. **A1** (dono A): tipo `Project` com `role`/`outcome` preenchidos nos 4 existentes + chaves de dicionário pt/en. Destrava B e C.
2. **B1** (dono B), em paralelo com A1: `store`, script inline, `ModeText`, `ModeToggle`, `mode.css`, cabeçalho.
3. **C1** (dono C), depois de A1 e B1: `ProjectLinks`, `ProjectCards`, `page.tsx`, `Inventory`, página do projeto.
4. **A2** (dono A), em paralelo com C1: 4 projetos novos com capas; T10–T13 em `ACOES-PENDENTES.md`.
5. **A3** (dono A), depois de o usuário fazer a T10: prints e link do OpenWeddy.
6. Revisão: todos os CAs nos dois modos, em `/pt` e `/en`, desktop e celular.

Se a T10 não for feita a tempo, a feature fecha sem A3: o CA-03 vale como "ausente" e o CA-04 e o CA-31 ficam como pendência registrada no `tasks.md`.

## Verificação

- **Dados (CA-01 a CA-08):** `npx tsc --noEmit`; `grep` do CA-05 com a lista local `.claude/specs/termos-vedados.local` (nunca colar os termos em `tasks.md`, log ou commit; registrar só "0 linhas"); `git check-ignore` do CA-05b; `ls public/projects/*`; `npm run build && npm run start` e `curl -I` nas 16 rotas e no sitemap.
- **Modo e primeira dobra (CA-09 a CA-18, CA-23 a CA-25):** navegador nos dois viewports; medir `getBoundingClientRect()` no console; repetir com JavaScript desligado para o CA-10.
- **Projetos (CA-19 a CA-22, CA-26 a CA-31):** contar `article` na lista; conferir `href` de cada link; percorrer com Tab.
- **i18n (CA-32, CA-33):** `tsc` e busca dos textos do Anexo B no HTML de `/en`.
- **Qualidade (CA-34 a CA-40):** Lighthouse antes e depois (registrar no `tasks.md`), `npm run lint`, console do navegador.

## Banco

Sem alterações. O único estado novo é `portfolio-mode` no `localStorage`.

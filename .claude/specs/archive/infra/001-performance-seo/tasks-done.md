# Tasks concluídas — 001 Performance de carregamento e SEO

Lanes: `planejado → fazendo → revisão → pronto`. O Software Engineer move até `revisão`; o Review Agent move para `pronto` ou devolve para `fazendo`.

| WP | O quê | Critérios | Estimativa | Lane |
|---|---|---|---|---|
| WP-00 | Baseline: Lighthouse mobile da home `/pt` (build de produção) salvo em `baseline.md` nesta pasta | CA-18 (antes) | 30 min | pronto |
| WP-01 | `site.ts` + metadataBase + canonical/hreflang/x-default + `robots.ts` + `sitemap.ts` | CA-03, CA-04, CA-05, CA-10 | 60 min | pronto |
| WP-02 | Inventário rastreável: slots como `Link`, nome visível, clique abre o modal, modificador navega | CA-01, CA-02 | 60 min | pronto |
| WP-03 | Imagens OG (home e projeto) + `twitter:card` grande + `icon.svg` + `apple-icon`; remover o favicon padrão | CA-06, CA-08 | 90 min | pronto |
| WP-04 | JSON-LD Person e SoftwareSourceCode; separador no `<h1>`; `aria-label` da nav localizado | CA-07, CA-09 | 45 min | pronto |
| WP-05 | Matcher do proxy restrito a caminhos sem idioma | CA-11 | 30 min | pronto |
| WP-06 | Animações: parada da fada, lock-on com `transform`, pausa de estrelas e vaga-lumes, blur só em overlays; checagem visual nos 3 temas | CA-12, CA-13, CA-14 | 75 min | pronto |
| WP-07 | Fonte só no peso 800; `width`/`height` reais nas imagens; not-found sem dicionários inteiros | CA-15, CA-16, CA-17 | 45 min | pronto |
| WP-08 | Medição final: Lighthouse depois, comparação com o baseline, `lint` e `build` limpos | CA-18 (depois) | 30 min | pronto |

## Dependências

- WP-00 antes de qualquer outra WP (o baseline precisa ser do código atual).
- WP-03 e WP-04 dependem de WP-01 (`siteUrl` e `metadataBase`).
- WP-08 é a última.
- WP-02, WP-05, WP-06 e WP-07 são independentes entre si.

## Como verificar cada WP (para o Review Agent)

- **WP-01:** `curl /robots.txt` e `curl /sitemap.xml` → 200; no HTML de `/pt` e de `/en/projects/openweddy`, `canonical` e `hreflang` absolutos + `x-default`.
- **WP-02:** HTML de `/pt` (`curl`, sem JS) contém os 4 títulos e 4 `href="/pt/projects/…"`; no navegador, clique abre o modal e Cmd+clique abre a página em nova aba; setas ainda navegam.
- **WP-03:** `og:image` absoluto em home e projeto; abrir a URL da imagem → PNG 1200×630; aba mostra a gema.
- **WP-04:** Rich Results Test (ou validação do JSON) sem erros; o h1 extraído como texto tem espaço/quebra entre nome e cargo.
- **WP-05:** log do dev server sem `proxy.ts:` em `GET /pt`; `curl -H "Accept-Language: en" /` → 307 para `/en`.
- **WP-06:** Performance panel: sem frames da fada parada; sem "Layout" recorrente; screenshots dos 3 temas.
- **WP-07:** só 1 woff2 de Cinzel no build; banner do SDD Maestri sem distorção nem salto; bundle do not-found sem `fairy.tips`.
- **WP-08:** tabela antes/depois em `baseline.md` cumprindo CA-18.

## Notas do Software Engineer

- **WP-06 — desvio de D9 (para o Review Agent):** pausar estrelas e vaga-lumes não bastava. As nuvens, estrelas e vaga-lumes animavam **dentro** do SVG de tela cheia do hero, e qualquer animação ali repinta o SVG inteiro a cada frame (era a tarefa longa de 1,5 s do baseline). Movi essas três camadas para elementos HTML sobrepostos, animados só com `transform`/`opacity`. O SVG ficou estático. As estrelas fixas continuam no SVG; o brilho agora são 8 pontos HTML. Camadas noturnas usam `display: none` fora do tema noite. O brilho da fada passou de `box-shadow` animado para `opacity`.
- **WP-05:** o matcher também exclui `/icon` e `/apple-icon` (gerados pela WP-03), senão o proxy os redirecionava para `/pt/apple-icon` (404).
- **WP-01:** o `x-default` das páginas de projeto aponta para o caminho sem idioma (`/projects/<slug>`), que o proxy redireciona conforme o navegador. Na home é `/`.

## Revisão (Review Agent, 2026-11-07)

Verificado no build de produção (`next start`, porta 3001) e por `git diff`.

| WP | Veredito | Evidência |
|---|---|---|
| WP-00 | aprovada | `baseline.md` com as métricas de antes e a causa do TBT |
| WP-01 | aprovada | `/robots.txt` 200 com `Sitemap:`; `/sitemap.xml` com 10 `<loc>` e 20 `hreflang`; canonical + pt/en + x-default absolutos na home e em projeto |
| WP-02 | aprovada | HTML sem JS tem os 4 títulos visíveis e 4 `href="/pt/projects/…"`; clique simples abre o modal ("SDD Maestri!"), Cmd+clique abre nova aba sem abrir o modal |
| WP-03 | aprovada | `og:image` absoluto 1200×630 (home e projeto, PNG conferido visualmente); `summary_large_image`; `/icon.svg` e `/apple-icon` 200 |
| WP-04 | aprovada | JSON-LD `Person` na home; `SoftwareSourceCode` no projeto, sem `codeRepository` no OrçaZen (privado) e com ele no OpenWeddy; h1 "André Menezes · Endpoint Engineer" com espaço; nav "Navegação principal" / "Main navigation" |
| WP-05 | aprovada | `GET /pt` sem `proxy.ts` no log; `/` e `/projects/openweddy` → 307 pelo idioma; `/apple-icon` não é mais redirecionado |
| WP-06 | **devolvida → aprovada** | `@keyframes woods` (árvores da 404) anima `left` → viola CA-13. O resto confere: 0 chamadas de rAF com a fada parada (2 s), `backdrop-filter` só em header, backdrop do modal e toast, mira com `transform`, visual OK nos 3 temas. O desvio de D9 (camadas HTML) foi aceito: mantém o visual e resolveu a tarefa longa |
| WP-07 | aprovada | só Cinzel 800 no CSS de produção; `width`/`height` reais (banner 1200×340); CLS 0,002; nenhum chunk do cliente contém textos do dicionário |
| WP-08 | aprovada | Lighthouse 98 / 100 / 100 / 100 (home), projeto 98 / 100 / 100; lint e build limpos |

Observações (não bloqueiam):
- `/favicon.ico` responde 404. Navegadores modernos usam o `<link rel="icon">` (SVG), mas alguns clientes antigos pedem `/favicon.ico` direto. Registrado no INBOX.
- Em localhost, as URLs absolutas apontam para `:3000` (fallback do CA-10). Em produção, definir `NEXT_PUBLIC_SITE_URL` ou usar a URL de produção da Vercel.

- **WP-06 (correção após devolução):** `@keyframes woods` agora usa `transform: translateX(560px → -60px)` no lugar de `left`. O container tem largura máxima de 520 px, então 560 px começa fora da área visível em qualquer tela.

**Re-revisão WP-06:** nenhum `@keyframes` altera propriedade de layout ou pintura; lint e build limpos; a 404 anima as árvores normalmente. Aprovada.

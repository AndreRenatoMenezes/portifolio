# Plano — 001 Performance de carregamento e SEO

## Evidências da auditoria (build de produção, 2026-11-07)

| Achado | Evidência | Critério |
|---|---|---|
| Projetos invisíveis para buscadores | HTML de `/pt`: "Hardware Test Hub" aparece 1× como texto; os outros 3 projetos aparecem 0× (só `aria-label`); 0 ocorrências de `href="/pt/projects/` | CA-01, CA-02 |
| Sem robots e sitemap | `GET /robots.txt` → 404; `GET /sitemap.xml` → 404 | CA-03, CA-04 |
| URLs relativas | `<link rel="alternate" hrefLang="pt" href="/pt"/>`; sem `canonical`; sem `x-default`; sem `metadataBase` no layout | CA-05, CA-10 |
| Sem imagem social | `twitter:card` = `summary`; nenhum `og:image`; capas são SVG (redes sociais não aceitam) | CA-06 |
| Sem dados estruturados | nenhum `application/ld+json` | CA-07 |
| Favicon padrão | `src/app/favicon.ico` é o do create-next-app | CA-08 |
| `<h1>` colado | texto extraído: "André MenezesEndpoint Engineer"; `nav aria-label="Principal"` fixo em PT | CA-09 |
| Proxy em toda página | `matcher: ["/((?!_next\|.*\\..*).*)"]` captura `/pt` e `/en`; o log do dev mostra `proxy.ts: 3–4ms` em cada GET | CA-11 |
| Loop contínuo da fada | `Fairy.tsx`: `requestAnimationFrame(loop)` sem condição de parada | CA-12 |
| Animação que força layout | `.target-cursor` anima `inset` (`@keyframes lock-on`) | CA-13 |
| Animações invisíveis | `.scene-stars circle` e `.scene-fireflies circle` animam com `opacity: var(--night)` = 0 de dia | CA-13 |
| Blur em todo painel | `.dialog-frame { backdrop-filter: blur(4px) }`: usado em slots, painéis, ~12 tiles de equipamento e na galeria | CA-14 |
| Peso de fonte sem uso | `Cinzel({ weight: ["600", "800"] })`; o CSS só usa 800 na fonte de títulos | CA-15 |
| Proporção errada | `Image` com `width={960} height={600}` fixos para toda capa; o banner do SDD Maestri é 1200×340 | CA-16 |
| Dicionários no cliente | `[lang]/not-found.tsx` é Client Component e importa `pt.json` e `en.json` inteiros | CA-17 |

Não tem ganho relevante: o JS da home soma cerca de 190 KB gzip, quase tudo runtime do React/Next. O código do site é pequeno. Não vale trocar bibliotecas.

## Decisões técnicas

### D1 — Domínio (CA-10)
Novo `src/lib/site.ts` exporta `siteUrl`, nesta ordem: `NEXT_PUBLIC_SITE_URL` → `https://${VERCEL_PROJECT_PRODUCTION_URL}` → `http://localhost:3000`. É a única fonte de URL absoluta do projeto.

### D2 — Metadados (CA-05, CA-06, CA-09)
- `metadataBase: new URL(siteUrl)` no `generateMetadata` de `app/[lang]/layout.tsx`.
- Helper `alternatesFor(path)` em `src/lib/site.ts` devolve `canonical` + `languages { pt, en, "x-default": "/" }`. Usado na home e nas páginas de projeto.
- `twitter.card = "summary_large_image"`.

### D3 — Robots e sitemap (CA-03, CA-04)
`app/robots.ts` e `app/sitemap.ts` (metadata routes na raiz do `app/`; não dependem do layout `[lang]`). O sitemap gera as entradas a partir de `locales` × `projects` com `alternates.languages`. O matcher do proxy já ignora caminhos com ponto: confirmar.

### D4 — Imagens sociais (CA-06)
`opengraph-image.tsx` com `ImageResponse` (`next/og`) em:
- `app/[lang]/opengraph-image.tsx`: nome, cargo e cena dia/noite simplificada;
- `app/[lang]/projects/[slug]/opengraph-image.tsx`: ícone do item, título, tipo e os 3 atributos.

Gerados no build (estáticos, com `generateStaticParams` herdado). Ler o guia `node_modules/next/dist/docs/` de `opengraph-image` antes de implementar (Next 16 pode ter mudado a API).

### D5 — Inventário rastreável (CA-01, CA-02)
Cada slot vira `<Link href="/{lang}/projects/{slug}">` com o **nome do projeto visível** abaixo do ícone. No `onClick` sem tecla modificadora (Ctrl, Cmd, Shift ou botão do meio), chama `preventDefault()` e abre o modal, como hoje. Com modificador ou sem JS, navega para a página. A navegação por setas e o roving tabindex continuam iguais. Nada de texto escondido: o nome fica visível.

### D6 — Dados estruturados (CA-07)
Componente servidor `JsonLd` que serializa um objeto em `<script type="application/ld+json">`, escapando `<` como `<`.
- Home: `Person` (`name`, `jobTitle`, `address.addressLocality`, `sameAs` = GitHub e LinkedIn de `profile.ts`, `url`).
- Projeto: `SoftwareSourceCode` (`name`, `description`, `programmingLanguage` = tags, `codeRepository` só se o repo for público, `author` → Person).

### D7 — Ícones (CA-08)
`app/icon.svg` (gema original, mesmo desenho do HUD) e `app/apple-icon.tsx` (180×180 via `ImageResponse`). Remover `app/favicon.ico`.

### D8 — Proxy (CA-11)
Matcher só para o que precisa de detecção: `["/", "/((?!pt(?:/|$)|en(?:/|$)|_next|.*\\..*).*)"]`. A lógica de `proxy.ts` não muda.

### D9 — Animações (CA-12, CA-13, CA-14)
- **Fada:** o loop para quando a distância até o alvo for < 0,5 px e não houver alvo ativo. O balanço vertical idle passa para uma animação CSS (`translate`) na `.fairy-core`. Volta a rodar ao mudar de alvo, em `resize` e em `scroll`.
- **Mira:** `@keyframes lock-on` com `transform: scale(1.06)` no lugar de `inset`.
- **Estrelas e vaga-lumes:** `animation-play-state: paused` fora de `[data-theme="night"]`.
- **Blur:** `backdrop-filter` sai de `.dialog-frame` e fica só em `.site-header`, `.item-get::backdrop`/modal e `.toast`. Compensar com fundo um pouco mais opaco (`--frame-bg`) para manter o contraste.

### D10 — Fontes, imagens e bundle (CA-15, CA-16, CA-17)
- `Cinzel({ weight: ["800"] })`.
- `Project.images[]` ganha `width` e `height` obrigatórios. `Inventory`, `Gallery` e a página do projeto passam esses valores ao `next/image`.
- `[lang]/not-found.tsx` vira Server Component: o idioma vem de `next/root-params` (ver o guia de i18n do Next 16), e o componente só recebe as strings de `notFound`. Se `root-params` não funcionar em `not-found`, extrair só a parte cliente mínima e passar as strings como props.

## Arquivos

| Arquivo | Ação |
|---|---|
| `src/lib/site.ts` | novo (D1, D2) |
| `src/app/robots.ts`, `src/app/sitemap.ts` | novo (D3) |
| `src/app/[lang]/opengraph-image.tsx`, `src/app/[lang]/projects/[slug]/opengraph-image.tsx` | novo (D4) |
| `src/app/icon.svg`, `src/app/apple-icon.tsx` | novo; remover `src/app/favicon.ico` (D7) |
| `src/components/JsonLd.tsx` | novo (D6) |
| `src/app/[lang]/layout.tsx` | metadataBase, alternates, twitter, aria-label localizado, peso da fonte (D2, D10) |
| `src/app/[lang]/page.tsx` | JSON-LD Person, separador no h1 (D6, CA-09) |
| `src/app/[lang]/projects/[slug]/page.tsx` | alternates, JSON-LD, dimensões das imagens (D2, D6, D10) |
| `src/components/Inventory.tsx` | slots como Link, nome visível, dimensões da capa (D5, D10) |
| `src/components/Gallery.tsx` | dimensões reais (D10) |
| `src/components/Fairy.tsx` | loop com parada (D9) |
| `src/app/globals.css` | lock-on, pausa das animações, blur, estilo do nome no slot (D5, D9) |
| `src/proxy.ts` | matcher (D8) |
| `src/content/projects.ts` | `width`/`height` nas imagens (D10) |
| `src/app/[lang]/not-found.tsx` | server + strings mínimas (D10) |
| `src/dictionaries/*.json` | chave `nav.label` (CA-09) |

## Banco
Sem alterações (o projeto não tem banco; ver `schema.md`).

## Riscos

- **Mudar o slot para `<a>` altera o comportamento de foco e teclado.** Mitigação: manter `tabIndex` roving e o handler de setas. Enter num link dispara clique, que abre o modal.
- **`ImageResponse` precisa de fonte própria para Cinzel.** Se carregar a fonte no build for frágil, usar fonte padrão no OG; não bloqueia o aceite.
- **Fundo mais opaco sem blur pode reduzir o contraste sobre o céu.** A verificação visual nos 3 temas faz parte da WP-06.

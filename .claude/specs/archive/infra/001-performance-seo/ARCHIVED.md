# Arquivado — 001 Performance de carregamento e SEO

- **Domínio:** infra
- **Status:** concluída
- **Data:** 2026-11-07
- **WPs:** 9/9 em `pronto` (WP-06 devolvida uma vez e aprovada após correção)

## Resultado

Lighthouse mobile da home `/pt`: Performance 72 → 98, SEO 90 → 100, TBT 1.440 ms → 0–10 ms, Speed Index 2,4 s → 0,8 s. Acessibilidade e boas práticas continuam em 100. Detalhes em `baseline.md`.

## O que ficou

- `src/lib/site.ts`: URL absoluta (`NEXT_PUBLIC_SITE_URL` → URL de produção da Vercel → localhost), `alternatesFor`, `personJsonLd`.
- `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` (home e projeto), `icon.svg`, `apple-icon.tsx`.
- Inventário com slots como links rastreáveis; o clique abre o modal.
- Proxy só em caminhos sem idioma.
- Cena do hero com arte SVG estática e camadas animadas em HTML (só `transform`/`opacity`).

## Reaproveitável em outros projetos

- O padrão "SVG de tela cheia estático + camadas HTML compostas" para cenas animadas.
- O matcher de proxy que exclui prefixos de idioma e ícones gerados.
- A fada: o loop de `requestAnimationFrame` só roda enquanto há distância a percorrer.

## Pendências (INBOX)

- Servir `/favicon.ico`.
- Definir `NEXT_PUBLIC_SITE_URL` quando houver domínio.

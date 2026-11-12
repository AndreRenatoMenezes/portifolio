# Plano — 004 Conjunto de favicons e manifest

## Decisões técnicas
- **D1 — `favicon.ico`:** gerado uma vez a partir de `src/app/icon.svg` por `scripts/make-favicon.mjs`. O script usa o `sharp`, que já vem instalado como dependência do Next, e monta um ICO com PNGs de 16, 32 e 48 px. O arquivo gerado é versionado em `src/app/favicon.ico` (convenção do Next). Rodar de novo só se o ícone mudar.
- **D2 — Ícones PWA:** `public/icons/icon-192.png`, `icon-512.png` e `icon-maskable-512.png` (com margem de segurança de 20%), gerados pelo mesmo script.
- **D3 — Manifest:** `src/app/manifest.ts` (`MetadataRoute.Manifest`). `name` = "André Menezes — Portfólio", `short_name` = "André", `theme_color` = `#0d1430`, `background_color` = `#0d1430`.
- **D4 — `theme-color`:** export `viewport` no `app/[lang]/layout.tsx` com `themeColor: [{ media: "(prefers-color-scheme: light)", color: "#eef1dc" }, { media: "(prefers-color-scheme: dark)", color: "#0d1430" }]`.
- **D5 — Proxy:** `favicon.ico` e `manifest.webmanifest` têm ponto, então já ficam fora do matcher, e `/icons/*.png` também. Só confirmar.

## Arquivos
| Arquivo | Ação |
|---|---|
| `scripts/make-favicon.mjs` | novo |
| `src/app/favicon.ico` | gerado |
| `public/icons/*.png` | gerados |
| `src/app/manifest.ts` | novo |
| `src/app/[lang]/layout.tsx` | `export const viewport` |

## Banco
Sem alterações.

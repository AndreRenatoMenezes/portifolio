# Tasks concluídas — 004 Conjunto de favicons e manifest

| WP | O quê | Critérios | Estimativa | Lane |
|---|---|---|---|---|
| WP-01 | Script de geração + `favicon.ico` + PNGs 192/512/maskable | CA-01, CA-03 | 40 min | pronto |
| WP-02 | `manifest.ts` + `viewport.themeColor` + conferir o proxy | CA-02, CA-04, CA-05 | 25 min | pronto |
| WP-03 | Verificação: `curl` dos 5 caminhos, Lighthouse de boas práticas e console | CA-06 | 15 min | pronto |

## Como verificar
- `curl -I` em `/favicon.ico`, `/manifest.webmanifest`, `/icons/icon-192.png`, `/icons/icon-512.png` e `/icons/icon-maskable-512.png` → 200 com o content-type certo.
- `file src/app/favicon.ico` → "MS Windows icon resource - 3 icons".
- DevTools → Application → Manifest sem avisos.

## Revisão (Review Agent, 2026-11-07)

| WP | Veredito | Evidência |
|---|---|---|
| WP-01 | aprovada | `file favicon.ico` → "MS Windows icon resource - 3 icons" (16/32/48); PNGs 192, 512 e maskable 512 gerados por `scripts/make-favicon.mjs` (gema dentro da zona segura, conferida visualmente) |
| WP-02 | aprovada | `/manifest.webmanifest` 200 (`standalone`, `start_url: /`, 3 ícones); `theme-color` claro/escuro no `<head>`; nenhum dos caminhos passa pelo proxy (todos 200 sem redirect) |
| WP-03 | aprovada | 5 caminhos → 200 com o content-type certo; Lighthouse Boas práticas = 100 (sem erros de console) |

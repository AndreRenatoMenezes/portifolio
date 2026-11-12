# 004 — Conjunto de favicons e manifest

- **Domínio:** ui
- **Status:** concluída (2026-11-07)
- **Autor:** Spec Architect
- **Data:** 2026-11-07
- **Origem:** auditoria, item 5; pendência da 001 (`/favicon.ico` → 404)

## Problema
O site tem `icon.svg` (navegadores atuais) e `apple-icon` (iOS), mas `/favicon.ico` responde 404. Alguns clientes ainda pedem esse arquivo direto: navegadores antigos, leitores de RSS, prévias de link e o próprio Google na busca. Também não há web manifest, então o Android usa um ícone genérico ao "Adicionar à tela inicial".

## Objetivo
Ter o conjunto completo de ícones com a mesma gema do HUD, sem 404 e sem ícone genérico em nenhuma plataforma.

## Critérios de aceite
- **CA-01** `/favicon.ico` responde 200 com um ICO de 16, 32 e 48 px.
- **CA-02** `/manifest.webmanifest` responde 200 com nome, nome curto, cores de tema e fundo, `display: "standalone"`, `start_url: "/"` e ícones de 192 e 512 px (o de 512 também com `purpose: "maskable"`).
- **CA-03** Os ícones de 192 e 512 px respondem 200 como PNG.
- **CA-04** O `<head>` tem `theme-color` com uma cor para o modo claro e outra para o escuro.
- **CA-05** Os novos caminhos não passam pelo proxy de idioma.
- **CA-06** Lighthouse continua com Boas práticas = 100 e sem erros de console.

## Fora de escopo
Service worker / uso offline (PWA completo).

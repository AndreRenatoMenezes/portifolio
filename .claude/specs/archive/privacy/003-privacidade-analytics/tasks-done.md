# Tasks concluídas — 003 Privacidade, cookies e Google Analytics

| WP | O quê | Critérios | Estimativa | Lane |
|---|---|---|---|---|
| WP-01 | Página `/{idioma}/privacy` + conteúdo em `privacy.ts` + link no rodapé + sitemap | CA-01, CA-02, CA-03 | 60 min | pronto |
| WP-02 | `consent` no store + `CookieNotice` + "Preferências de cookies" no rodapé | CA-04 a CA-07, CA-11 | 60 min | pronto |
| WP-03 | `Analytics` condicionado ao consentimento + revogação | CA-08, CA-09, CA-11, CA-12 | 45 min | pronto |
| WP-04 | `track` + eventos `item_open`, `contact_click`, `generate_lead` + validação de page_view nas navegações | CA-09, CA-10 | 45 min | pronto |
| WP-05 | Lighthouse com e sem consentimento + lint/build | CA-12 | 20 min | pronto |

## Dependências
- WP-02 antes de WP-03; WP-03 antes de WP-04.
- WP-04: `contact_click` na barra do celular e `generate_lead` exigem a 002 (WP-02 e WP-06 de lá).
- O teste real da WP-03 exige `NEXT_PUBLIC_GA_ID` (T5). Até lá, testar com um ID fictício e conferir as requisições na aba Network.

## Como verificar
- **WP-01:** `/pt/privacy` e `/en/privacy` → 200, com title próprio; presentes no sitemap; o link no rodapé de todas as páginas.
- **WP-02:** primeira visita → aviso; Aceitar/Recusar → some e não volta ao recarregar; "Preferências de cookies" → reabre; sem `NEXT_PUBLIC_GA_ID` → o aviso não aparece.
- **WP-03:** sem consentimento → 0 requisições a `google-analytics.com`/`googletagmanager.com` e nenhum cookie `_ga`; aceitar → `gtag/js` carregado e `collect` disparado; recusar depois → cookies `_ga*` removidos e nenhum `collect` novo.
- **WP-04:** DebugView do GA4 mostra `page_view` ao navegar para um projeto, `item_open` ao abrir o modal e `contact_click` nas placas.
- **WP-05:** Performance ≥ 95 nos dois cenários.

## Notas do Software Engineer
- **CA-05:** sem `localStorage`, `setConsent` grava `denied` só em memória: o aviso some nesta visita, o GA não liga e o aviso volta na próxima.
- **Revogação:** além de `consent update`, liga o flag oficial `ga-disable-<ID>` (o gtag já carregado para de enviar, inclusive os page_views automáticos) e apaga os cookies `_ga*`. Reaceitar remove o flag.
- **`contact_click`:** por delegação (`data-track` + `data-track-channel`) no `Analytics`, sem transformar as placas em Client Components.
- **`generate_lead`:** só com `?sent=1`, que a Server Action adiciona apenas no envio real; o descarte anti-spam também redireciona para `/thanks`, mas sem o parâmetro, então não conta como lead.

## Revisão (Review Agent, 2026-11-07)

Testado em `next build` + `next start` com `NEXT_PUBLIC_GA_ID=G-TEST000000` (ID fictício).

| WP | Veredito | Evidência |
|---|---|---|
| WP-01 | aprovada | `/pt/privacy` e `/en/privacy` 200 com title e canonical próprios; no sitemap (12 `<loc>`); link "Privacidade" no rodapé; cobre controlador, formulário/Resend, GA só com aceite, localStorage, Vercel, compartilhamento, direitos (art. 18) e data de atualização |
| WP-02 | aprovada | primeira visita → aviso com Aceitar e Recusar de mesmo estilo; a escolha persiste; "Preferências de cookies" reabre; sem `NEXT_PUBLIC_GA_ID` nem o aviso nem o link aparecem no HTML; no celular (375 px) o aviso termina em 652 px e a barra começa em 668 px (sem sobreposição); `position: fixed`, CLS 0,002 |
| WP-03 | aprovada | sem consentimento: 0 requisições a domínios do Google e 0 cookies `_ga`; aceitar → `gtag/js` + `g/collect`, cookies `_ga` e `_ga_TEST000000`; recusar depois → cookies apagados, flag `ga-disable` ligado, 0 eventos e 0 `collect` novos |
| WP-04 | aprovada com ressalva | `item_open {slug: openweddy}`, `contact_click {channel: github}` e `generate_lead` (só com `?sent=1`) confirmados. **Ressalva:** o `page_view` em navegação interna depende da "medição otimizada" do stream real; com o ID fictício só deu para ver 1 `page_view`. Conferir no Tempo real do GA4 na T5 (passo 8) |
| WP-05 | aprovada | Lighthouse `/pt`: sem consentimento 97/100/100/100 (0 requisições Google); com consentimento semeado via CDP 100/100/100/100 com o GA carregado (cache aquecido pelo perfil, o que favorece esse número); lint e build limpos |

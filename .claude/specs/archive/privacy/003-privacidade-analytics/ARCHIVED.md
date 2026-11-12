# Arquivado — 003 Privacidade, cookies e Google Analytics

- **Domínio:** privacy · **Status:** concluída · **Data:** 2026-11-07 · **WPs:** 5/5 (WP-04 com ressalva)

Política de privacidade PT/EN (`src/content/privacy.ts`), aviso de cookies com Aceitar/Recusar de mesmo peso, GA4 carregado **só** depois do consentimento, revogação que apaga os cookies, eventos `item_open`, `contact_click` e `generate_lead`. Sem `NEXT_PUBLIC_GA_ID`, nada disso aparece.

**Pendências do André:** T5 (ID do GA4, e conferir no Tempo real o `page_view` nas navegações internas, que é a ressalva da WP-04) e T6 (revisar o texto da política).

**Reaproveitável:** consentimento no mesmo store do visitante (`useSyncExternalStore`, com `undefined` na hidratação para o aviso não piscar); `data-track` por delegação; `ga-disable-<ID>` para revogar com o gtag já carregado.

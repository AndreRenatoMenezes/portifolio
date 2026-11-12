# Plano — 003 Privacidade, cookies e Google Analytics

## Decisões técnicas

### D1 — Consentimento no store existente
`src/lib/store.ts` já guarda as preferências do visitante. Acrescentar `consent: "granted" | "denied" | null` (`null` = ainda não escolheu), com as mesmas garantias de hoje (`try/catch` no `localStorage`; sem armazenamento, fica `null` a cada visita). Funções `setConsent(value)` e `reopenConsent()`. Nada de cookie próprio: a escolha vive no `localStorage`.

### D2 — Carregamento do GA condicionado
`src/components/Analytics.tsx` (cliente), no layout:
- Se `!process.env.NEXT_PUBLIC_GA_ID` → `return null` (CA-11).
- Se `consent !== "granted"` → não renderiza nenhum script (CA-08). Não usar só o Consent Mode do Google com o script carregado: o CA-08 exige **zero** requisições sem consentimento.
- Com `granted` → `next/script` (`strategy="afterInteractive"`) carrega `gtag/js?id=…` e inicializa com `send_page_view` padrão. O GA4 com "medição otimizada" registra as trocas de rota do App Router pelo History API. Validar na WP-04; se não registrar, enviar `page_view` manual a cada mudança de `usePathname()`.
- Revogação (`denied` depois de `granted`): `gtag('consent','update',{analytics_storage:'denied'})`, apagar os cookies `_ga*` do domínio e parar de enviar eventos.

### D3 — Eventos
`src/lib/analytics.ts` → `track(name, params)`: no-op sem consentimento ou sem `window.gtag`. Chamadas em:
- `Inventory.tsx`, ao abrir o modal → `item_open`;
- links de contato (placas, barra do celular) → `contact_click`;
- `ContactForm`/página de obrigado → `generate_lead`, disparado uma vez ao carregar `/thanks`.

### D4 — Aviso de cookies
`src/components/CookieNotice.tsx` (cliente), no layout, renderizado só se `GA_ID` existir e `consent === null`. Usa a moldura `.dialog-frame`, `position: fixed`, acima da barra de contato do celular (`bottom: calc(var(--contact-bar-h) + 12px)`). Botões **Aceitar** e **Recusar** com o mesmo estilo (`.btn`, nenhum como primário). Foco não é capturado (não é modal); `role="region"` com `aria-label`.

### D5 — Página de privacidade
`src/app/[lang]/privacy/page.tsx`, estática. O texto fica em `src/content/privacy.ts` (PT e EN, por seções), para o André editar sem mexer em JSX. Data de atualização no próprio conteúdo. Entra no `sitemap.ts` (CA-03).

### D6 — Rodapé
Links "Privacidade" e "Preferências de cookies" (o segundo só se `GA_ID` existir, e chama `reopenConsent()`).

## Arquivos

| Arquivo | Ação |
|---|---|
| `src/lib/store.ts` | `consent`, `setConsent`, `reopenConsent` |
| `src/lib/analytics.ts` | novo: `track` |
| `src/components/Analytics.tsx` | novo |
| `src/components/CookieNotice.tsx` | novo |
| `src/content/privacy.ts` | novo: texto da política |
| `src/app/[lang]/privacy/page.tsx` | novo |
| `src/app/[lang]/layout.tsx` | `Analytics`, `CookieNotice`, links do rodapé |
| `src/app/sitemap.ts` | incluir `/privacy` |
| `src/components/Inventory.tsx`, `MobileContactBar.tsx`, `src/app/[lang]/page.tsx`, `src/app/[lang]/thanks/page.tsx` | chamadas `track` |
| `src/dictionaries/*.json` | textos do aviso e do rodapé |
| `src/app/globals.css` | estilos do aviso e da política |

## Banco
Sem alterações.

## Riscos
- **A política é texto jurídico.** O agente redige o ponto de partida; o André revisa (T6). Não é assessoria jurídica.
- **Eventos dependem da 002** (barra do celular, formulário). Se a 003 vier antes, os eventos `contact_click` da barra e `generate_lead` ficam para quando a 002 entrar.

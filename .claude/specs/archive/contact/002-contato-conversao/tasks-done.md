# Tasks concluídas — 002 Contato e conversão

| WP | O quê | Critérios | Estimativa | Lane |
|---|---|---|---|---|
| WP-01 | CTA "Fale comigo" no header e no hero | CA-01, CA-02 | 30 min | pronto |
| WP-02 | `whatsappUrl` + barra fixa no celular (fada e toast acima dela; some com dialog aberto) | CA-03 a CA-06 | 60 min | pronto |
| WP-03 | `loading.tsx` com a fada | CA-17, CA-18 | 30 min | pronto |
| WP-04 | Formulário (UI + validação no cliente + estados: enviando, erros por campo, erro geral) com a Server Action ainda sem envio real | CA-07 a CA-12 | 90 min | pronto |
| WP-05 | Envio pelo Resend na Server Action + `replyTo` + fallback sem variáveis | CA-13, CA-14 | 45 min | pronto |
| WP-06 | Página `/{idioma}/thanks` com `noindex` | CA-15, CA-16 | 30 min | pronto |
| WP-07 | Lighthouse de regressão + lint/build | CA-19 | 20 min | pronto |

## Dependências
- WP-05 espera a ação T4 do André (integração Resend + variáveis).
- WP-04 antes de WP-05 e WP-06.
- WP-02 usa o número do WhatsApp (T1). Sem ele, implementa só o atalho do formulário, e o WhatsApp aparece quando o número for preenchido.
- WP-07 por último.

## Como verificar
- **WP-01:** CTA visível em 375 px, 768 px e 1440 px; o link leva a `/{lang}#contact`.
- **WP-02:** em 375 px, barra visível, fada e toast acima dela, some com o modal aberto; em 1024 px, a barra não existe; o link `wa.me` tem o número e o texto codificado.
- **WP-03:** com a rede em "Slow 4G", navegar para um projeto mostra "Carregando…".
- **WP-04:** enviar vazio → 3 erros sob os campos e foco no primeiro; e-mail inválido → erro só nele; armadilha preenchida → fluxo normal sem envio; erro de servidor → texto preservado.
- **WP-05:** envio real chega na caixa do `CONTACT_TO` e "Responder" vai para o remetente; sem `RESEND_API_KEY` → erro geral, sem exceção.
- **WP-06:** `/pt/thanks` e `/en/thanks` com `<meta name="robots" content="noindex">`; ausentes do sitemap.
- **WP-07:** Lighthouse ≥ 95 / 100 / ≥ 95.

## Notas do Software Engineer
- **Envio:** `src/lib/mailer.ts` hoje só verifica `RESEND_API_KEY`, `CONTACT_TO` e `CONTACT_FROM` e retorna `unconfigured` (o formulário mostra o erro geral, CA-14). A WP-05 liga o Resend ali.
- **CA-17:** só o `loading.tsx` não bastava. Ele aparece depois que o router baixa a fronteira de loading (1,6 s com 1,5 s de latência emulada). Entrou o `NavProgress`: aviso imediato no clique de links internos (os slots do inventário, que abrem o modal, são marcados com `data-opens-modal`). O `loading.tsx` continua como segunda camada.
- **Altura da barra:** `--contact-bar-h: 72px` fixo, com `env(safe-area-inset-bottom)` somado na barra e no `padding-bottom` do `body`.

## Revisão (Review Agent, 2026-11-07)

| WP | Veredito | Evidência |
|---|---|---|
| WP-01 | aprovada | header com "Fale comigo"/"Contact me" (vira "Contato" abaixo de 560 px) em todas as páginas; hero com "Fale comigo" primário + "Abrir inventário" |
| WP-02 | aprovada | 375 px: barra de 72 px no rodapé, `body` com `padding-bottom` 72 px, fada acima (base em 638 px, barra a partir de 664 px), sem scroll horizontal; some com o modal aberto (`display: none`); ≥ 768 px: `display: none`. Sem número (T1), mostra só "Mandar mensagem" (CA-04) |
| WP-03 | **devolvida → aprovada** | 1ª revisão: com latência de 1,5 s o aviso só aparecia em 1.616 ms (CA-17 pede < 100 ms). Depois do `NavProgress`: "Carregando…" em **21 ms**, `role="status"`, e some ao chegar (3,3 s) |
| WP-04 | **devolvida → aprovada** | Envio vazio → 3 erros sob os campos, foco no nome, `aria-describedby`, resumo em `role="alert"`; e-mail inválido → erro só nele; "Enviando…" com o botão desabilitado (MutationObserver); erro geral com o texto preservado; armadilha → `/pt/thanks` sem envio; envio em 846 ms → descartado. **Devolvida** porque, sem JS, `t=0` era tratado como robô e a mensagem sumia; corrigido (o teste de tempo só vale com `t > 0`; a armadilha vale sempre) |
| WP-06 | aprovada | `/pt/thanks` e `/en/thanks` 200, `robots: noindex, follow`, title "Mensagem enviada"; fora do sitemap |
| WP-07 | aprovada | Lighthouse `/pt` (produção, com o aviso de cookies ativo): Performance 97, Acessibilidade 100, Boas práticas 100, SEO 100, TBT 0 ms, CLS 0,002 (3 execuções: 97/97/97); lint e build limpos |

### WP-05 (implementada depois, mesma data)

**Nota do Software Engineer:** a integração da Vercel não pôde ser instalada daqui. O CLI está logado, mas o projeto não está vinculado, e vincular cria o projeto na conta do André (T2); instalar o Resend provisiona um recurso e exige aceitar termos (T4). O envio foi feito pela **API REST** do Resend com `fetch` (`POST https://api.resend.com/emails`, conferida na documentação oficial), sem SDK nem dependência nova, ativado pelas variáveis: sem elas, retorna `unconfigured`. Só texto puro, `reply_to` = visitante, `Idempotency-Key` = SHA-256 de e-mail + mensagem (dedupe de 24 h), timeout de 10 s. Depois da T4, se a skill do provedor instalada pela integração recomendar o SDK, a troca fica restrita a `src/lib/mailer.ts`.

**Revisão:**

| WP | Veredito | Evidência |
|---|---|---|
| WP-05 | aprovada com ressalva | Teste com `fetch` simulado: URL, `Bearer`, `Idempotency-Key` (64 hex) e corpo `{from, to, reply_to, subject, text}` conforme a documentação → `sent`; 422 → `failed`; rede caída → `failed`; sem chave → `unconfigured` (CA-14). De ponta a ponta contra a API real com chave falsa: o Resend respondeu `401 API key is invalid`, o servidor registrou, o formulário mostrou o erro geral e manteve o texto. Nenhum chunk do cliente contém `api.resend.com` nem `RESEND_API_KEY`. **Ressalva (CA-13):** a entrega real na caixa do `CONTACT_TO` só pode ser confirmada com a chave verdadeira, no passo final da T4 |

# Plano — 002 Contato e conversão

## Decisões técnicas

### D1 — Dados de contato
`src/content/profile.ts` → `contacts.whatsapp` (string, só dígitos, vazio = sem WhatsApp) e `contacts.email` corrigido. Helper `whatsappUrl(lang)` em `src/lib/contact.ts` monta `https://wa.me/<n>?text=<mensagem codificada>`. A mensagem inicial fica nos dicionários (`contact.whatsappText`).

### D2 — CTAs
- Header: `<a className="btn btn-primary header-cta" href="/{lang}#contact">`. Em telas estreitas vira botão compacto, sem quebrar o grid do header.
- Hero: "Fale comigo" (primário) + "Abrir inventário" (secundário).

### D3 — Barra fixa no celular
Novo `src/components/MobileContactBar.tsx` (Client Component pequeno), renderizado no layout.
- CSS `@media (max-width: 767px)` com `position: fixed; bottom: 0`, `env(safe-area-inset-bottom)` e `padding-bottom` no `body` igual à altura da barra.
- Variável CSS `--contact-bar-h`: a fada (posição "home") e o `.toast-region` sobem esse tanto.
- Esconde quando há um `dialog[open]` (seletor `body:has(dialog[open]) .mobile-bar { display: none }`).

### D4 — Envio de e-mail: Resend
Descoberto via `vercel integration discover --category messaging`: o resultado é **Resend** (`resend/resend-email`). Instalação pela integração da Vercel (ação do André, T4), que cria a variável `RESEND_API_KEY`. Variáveis extras definidas pelo André:
- `CONTACT_TO` — e-mail que recebe;
- `CONTACT_FROM` — remetente verificado no Resend (ex.: `Portfólio <contato@dominio>`). Antes do domínio verificado, usar `onboarding@resend.dev`, que só entrega para o e-mail da conta Resend.

Implementação: API REST com `fetch` (conferida na documentação oficial), sem SDK. Depois da T4, se a skill do provedor recomendar o SDK, a troca fica só em `src/lib/mailer.ts`.

### D5 — Formulário
- `src/components/ContactForm.tsx` (cliente): `useActionState` + Server Action. Validação no cliente para dar retorno imediato; os mesmos limites no servidor.
- `src/app/[lang]/actions.ts` (`"use server"`): `sendContact(prevState, formData)`.
  1. Lê os campos e **revalida** (o servidor é a fronteira de confiança).
  2. Armadilha: campo `website` preenchido → retorna sucesso falso, sem enviar.
  3. Tempo mínimo: campo oculto `t` com o timestamp de render; envio em menos de 3 s → mesmo descarte.
  4. Envia pelo Resend com `replyTo`. Erro ou variável ausente → `{ status: "error", code }`.
  5. Sucesso → `redirect("/{lang}/thanks")`.
- O estado de retorno traz `fieldErrors` por campo e os valores enviados (para não perder o texto, CA-11).
- Mensagens de erro nos dicionários (`form.errors.*`).
- Acessibilidade: `aria-invalid`, `aria-describedby`, resumo em `role="alert"` e foco no primeiro campo inválido após a resposta.

### D6 — Página de obrigado
`src/app/[lang]/thanks/page.tsx`, estática (`generateStaticParams` herdado), com `robots: { index: false }`. Fora do `sitemap.ts` (que hoje lista só a home e os projetos, então não precisa mudar).

### D7 — Carregando
`src/app/[lang]/loading.tsx`: fada pulsando + "Carregando…" dentro de `role="status"`. Sem JS extra (Server Component + CSS). Com `prefers-reduced-motion`, sem animação.

## Arquivos

| Arquivo | Ação |
|---|---|
| `src/content/profile.ts` | `whatsapp`, e-mail corrigido |
| `src/lib/contact.ts` | novo: `whatsappUrl` |
| `src/app/[lang]/layout.tsx` | CTA no header, `MobileContactBar` |
| `src/app/[lang]/page.tsx` | CTA duplo no hero, `ContactForm` na seção de contato |
| `src/components/MobileContactBar.tsx` | novo |
| `src/components/ContactForm.tsx` | novo |
| `src/app/[lang]/actions.ts` | novo (Server Action) |
| `src/app/[lang]/thanks/page.tsx` | novo |
| `src/app/[lang]/loading.tsx` | novo |
| `src/components/Fairy.tsx` | posição "home" considera `--contact-bar-h` |
| `src/app/globals.css` | estilos de CTA, barra, formulário, loading, obrigado |
| `src/dictionaries/*.json` | textos de CTA, formulário, erros, obrigado, loading, WhatsApp |
| `package.json` | dependência do Resend (vem pela integração/skill do provedor) |

## Banco
Sem alterações.

## Riscos
- **Resend sem domínio verificado só entrega para o dono da conta.** Isso basta para receber as mensagens no próprio e-mail; documentado na T4.
- **Server Action numa página estática:** a página continua estática; só a action roda como função.

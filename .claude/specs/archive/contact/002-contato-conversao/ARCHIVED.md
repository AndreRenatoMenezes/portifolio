# Arquivado — 002 Contato e conversão

- **Domínio:** contact · **Status:** concluída · **Data:** 2026-11-07 · **WPs:** 7/7 (WP-03 e WP-04 devolvidas uma vez; WP-05 com ressalva)

CTA "Fale comigo" no header e no hero; barra fixa de contato no celular (WhatsApp quando houver número); formulário com validação dupla, erros por campo, "Enviando…", erro geral que preserva o texto e anti-spam sem CAPTCHA; envio via API REST do Resend ligado por variáveis; página `/thanks` com `noindex`; aviso de carregamento imediato (`NavProgress`) + `loading.tsx`.

**Pendências do André:** T1 (número do WhatsApp, e-mail) e T4 (integração Resend + `CONTACT_TO`/`CONTACT_FROM`; confirmar a entrega real, que é a ressalva da WP-05).

**Reaproveitável:**
- `loading.tsx` não aparece instantâneo quando a fronteira não foi pré-carregada; um indicador no clique cobre esse intervalo.
- O `<Link>` do Next sempre chama `preventDefault`; para distinguir "abre modal", use um atributo explícito.
- Anti-spam por tempo precisa tolerar navegação sem JS.

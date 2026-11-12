# 002 — Contato e conversão

- **Domínio:** contact
- **Status:** concluída (2026-11-07) — a entrega real é confirmada na T4
- **Autor:** Spec Architect
- **Data:** 2026-11-07
- **Origem:** auditoria `../../AUDITORIA-2026-11-07.md`, itens 4, 11, 12, 13 e 14

## Problema

O portfólio mostra bem os projetos, mas o caminho até "falar com o André" é longo e frágil:

- O único botão do topo leva ao inventário. Quem já decidiu entrar em contato precisa rolar até o fim da página.
- No celular, que é onde a maioria abre um link mandado por WhatsApp ou LinkedIn, não existe atalho fixo para contato.
- O contato é só por links externos (GitHub, LinkedIn, e-mail). Não há formulário, então também não há confirmação de envio, mensagem de erro nem página de obrigado.
- Navegar para uma página de projeto não mostra nenhum sinal de carregamento numa conexão lenta.

## Objetivo

Encurtar o caminho até o contato, em qualquer tela, com um formulário que dá retorno claro em cada etapa (enviando, erro, enviado), sem quebrar o tom do site.

## Critérios de aceite

### CTA no topo
- **CA-01** O header tem um botão "Fale comigo" / "Contact me", visível em todas as páginas e larguras, que leva à seção de contato da home do mesmo idioma.
- **CA-02** O hero mostra o CTA de contato ao lado de "Abrir inventário", com o contato como ação principal.

### CTA fixo no celular
- **CA-03** Em telas com até 767 px, uma barra fixa no rodapé mostra **WhatsApp** (quando há número configurado) e **E-mail/Formulário**.
- **CA-04** O link do WhatsApp abre `https://wa.me/<número>` com uma mensagem inicial no idioma da página. Sem número configurado, a barra mostra só o atalho para o formulário.
- **CA-05** A barra não cobre conteúdo nem os botões da fada e do toast. Some enquanto o modal do inventário ou o lightbox estão abertos.
- **CA-06** Acima de 767 px a barra não existe.

### Formulário de contato
- **CA-07** A seção "Placas do caminho" ganha um formulário com nome, e-mail e mensagem, mantendo as placas de links.
- **CA-08** Cada campo inválido mostra a mensagem de erro **embaixo dele**, no idioma da página, ligada ao campo por `aria-describedby`, e o foco vai para o primeiro campo com erro. Regras: nome com 2 a 80 caracteres; e-mail válido; mensagem com 10 a 2.000 caracteres.
- **CA-09** A validação roda no navegador **e** no servidor. O servidor nunca confia no que vem do navegador.
- **CA-10** Durante o envio, o botão fica desabilitado e mostra "Enviando…" com indicador animado (respeitando `prefers-reduced-motion`).
- **CA-11** Se o envio falhar (rede, serviço de e-mail fora do ar, limite excedido), aparece uma mensagem de erro geral que explica o que fazer e oferece o e-mail/WhatsApp como alternativa. O texto digitado **não se perde**.
- **CA-12** Proteção contra spam sem CAPTCHA: campo armadilha invisível e tempo mínimo de preenchimento. Envio suspeito é descartado em silêncio, mas a pessoa vê o fluxo normal.
- **CA-13** O e-mail chega na caixa do André com nome, e-mail e mensagem, e com `reply-to` = e-mail de quem enviou.
- **CA-14** Sem as variáveis do serviço de e-mail configuradas, o formulário mostra o erro geral do CA-11 e o build continua funcionando.

### Página de obrigado
- **CA-15** Envio bem-sucedido leva a `/{idioma}/thanks`, com mensagem no tom do site ("Mensagem entregue!"), prazo de resposta e botão de volta.
- **CA-16** A página de obrigado tem `noindex` e não aparece no sitemap.

### Carregando
- **CA-17** Ao navegar para uma página que ainda não carregou, aparece um aviso de "Carregando…" no estilo do site (a fada), em menos de 100 ms.
- **CA-18** Leitores de tela recebem o aviso de carregamento (`role="status"`).

### Não regredir
- **CA-19** Lighthouse mobile da home continua com Performance ≥ 95, SEO = 100 e Acessibilidade ≥ 95.

## Fora de escopo
- Agendamento de reuniões, chat ao vivo, CAPTCHA.
- Guardar as mensagens num banco: elas só vão por e-mail.

## Perguntas em aberto (respostas em `/ACOES-PENDENTES.md`)
- Número do WhatsApp (formato internacional, ex.: `5521999999999`).
- E-mail que recebe as mensagens (o atual, `andrereanto.ti@gmail.com`, parece ter erro de digitação).

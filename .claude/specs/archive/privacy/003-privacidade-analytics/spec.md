# 003 — Privacidade, cookies e Google Analytics

- **Domínio:** privacy
- **Status:** concluída (2026-11-07)
- **Autor:** Spec Architect
- **Data:** 2026-11-07
- **Origem:** auditoria `../../AUDITORIA-2026-11-07.md`, itens 15, 17 e 18

## Problema

O André quer medir visitas com o Google Analytics. O GA grava cookies de identificação e, pela LGPD, isso exige base legal (consentimento) e transparência. Hoje o site não tem política de privacidade, aviso de cookies nem analytics. E, com a 002, vai passar a receber dados pessoais pelo formulário (nome, e-mail, mensagem).

## Objetivo

Medir o uso do site com o Google Analytics **só com o consentimento** do visitante, explicar com clareza quais dados são tratados, e permitir mudar de ideia a qualquer momento, sem piorar a performance.

## Critérios de aceite

### Política de privacidade
- **CA-01** Existe uma página `/{idioma}/privacy` em PT e EN, linkada no rodapé de todas as páginas e no aviso de cookies.
- **CA-02** A política diz, em linguagem simples:
  - quem é o controlador e como falar com ele;
  - quais dados são tratados e por quê: formulário (nome, e-mail, mensagem → só para responder, por e-mail via Resend); Google Analytics (uso agregado, só com consentimento); preferências do site no navegador (tema, som, fada, gemas e a escolha de cookies, que nunca saem do aparelho);
  - os provedores envolvidos (Vercel, Resend, Google);
  - o prazo de guarda;
  - os direitos do titular (LGPD, art. 18) e como exercê-los;
  - a data da última atualização.
- **CA-03** A página entra no sitemap e tem title e description próprios.

### Aviso de cookies
- **CA-04** Na primeira visita aparece um aviso fixo no rodapé com **Aceitar** e **Recusar**, de mesmo destaque visual, e o link da política. Sem caixa marcada por padrão e sem "aceitar ao rolar".
- **CA-05** A escolha fica salva no navegador e o aviso não reaparece. Sem armazenamento disponível, o aviso reaparece a cada visita e o GA continua desligado.
- **CA-06** O rodapé tem o link "Preferências de cookies", que reabre o aviso. Recusar depois de aceitar desliga a coleta dali em diante.
- **CA-07** O aviso não gera salto de layout (CLS), é acessível por teclado e convive com a barra de contato do celular (spec 002) sem sobreposição.

### Google Analytics
- **CA-08** Sem consentimento, **nenhuma** requisição vai para domínios do Google e nenhum cookie `_ga*` é criado.
- **CA-09** Depois de aceitar, o GA4 carrega e registra a visualização de página, inclusive nas navegações internas.
- **CA-10** Eventos registrados: abrir um item do inventário (`item_open`, com o slug), clicar em WhatsApp, GitHub ou LinkedIn (`contact_click`, com o canal) e enviar o formulário com sucesso (`generate_lead`).
- **CA-11** O ID do GA vem da variável `NEXT_PUBLIC_GA_ID`. Sem ela, nada de analytics é carregado e o aviso de cookies **não aparece**, porque não há cookie opcional.
- **CA-12** O script do GA carrega depois de a página ficar interativa. O Lighthouse mobile da home continua com Performance ≥ 95, mesmo com o consentimento dado.

## Fora de escopo
- Outras ferramentas de analytics, mapas de calor, pixels de anúncio.
- Gestão de consentimento por categoria (só existe uma categoria opcional: analytics).
- Revisão jurídica: o texto é um ponto de partida, e o André revisa (T6).

## Perguntas em aberto
- ID de medição do GA4 (`G-XXXXXXXXXX`), na ação T5.

import type { Locale } from "@/lib/i18n";

/**
 * Texto da política de privacidade (spec 003). Ponto de partida, NÃO é assessoria jurídica:
 * revise conforme ACOES-PENDENTES.md (T6). Edite aqui sem mexer em JSX.
 * `{email}` é substituído pelo e-mail de contato do perfil.
 */
export const privacyUpdated = "2026-11-11";

export const privacy: Record<Locale, { title: string; intro: string; sections: { heading: string; body: string[] }[] }> = {
  pt: {
    title: "Política de privacidade",
    intro:
      "Este é um portfólio pessoal. Ele coleta o mínimo de dados possível, e só com uma finalidade clara. Aqui está tudo o que acontece com os seus dados quando você o visita.",
    sections: [
      {
        heading: "Quem é o responsável",
        body: [
          "André Menezes, pessoa física, Rio de Janeiro, Brasil — o controlador dos dados, nos termos da LGPD (Lei 13.709/2018).",
          "Contato para qualquer assunto de privacidade: {email}.",
        ],
      },
      {
        heading: "Formulário de contato",
        body: [
          "Dados: nome, e-mail e a mensagem que você escrever.",
          "Finalidade: responder ao seu contato. Base legal: seu consentimento ao enviar e o legítimo interesse em responder a quem escreveu.",
          "Como: a mensagem é entregue por e-mail por meio do serviço Resend e fica na caixa de entrada do André. Não é guardada em banco de dados nem usada para marketing.",
          "Prazo: até 12 meses depois da última troca de mensagens, ou antes, se você pedir a exclusão.",
        ],
      },
      {
        heading: "Google Analytics (só com o seu aceite)",
        body: [
          "Se — e somente se — você clicar em \"Aceitar\" no aviso de cookies, o site carrega o Google Analytics 4, que usa cookies (_ga, _ga_*) para medir de forma agregada quais páginas e projetos são vistos, de onde vêm as visitas e de que tipo de aparelho.",
          "Base legal: consentimento. Sem aceite, nenhuma requisição é feita ao Google.",
          "O GA4 não registra o endereço IP completo. Os dados ficam retidos por até 14 meses nas configurações da conta.",
          "Você pode mudar de ideia a qualquer momento em \"Preferências de cookies\", no rodapé. Ao recusar, a coleta para e os cookies do Analytics são apagados deste navegador.",
        ],
      },
      {
        heading: "Preferências guardadas no seu aparelho",
        body: [
          "O site guarda no armazenamento local do navegador (localStorage) o tema (dia/noite), o som, a fada, as gemas que você encontrou e a sua escolha sobre cookies.",
          "Esses dados nunca saem do seu aparelho, não identificam você e servem só para o site lembrar das suas escolhas. Você pode apagá-los limpando os dados do site no navegador.",
        ],
      },
      {
        heading: "Hospedagem",
        body: [
          "O site é hospedado na Vercel, que registra dados técnicos de cada acesso (como endereço IP e navegador) por um período curto, para segurança e operação do serviço.",
          "O site também usa o Vercel Web Analytics para contar visitas de forma agregada (páginas vistas, origem da visita, país, tipo de aparelho e navegador). Ele não usa cookies de terceiros e não identifica você: cada visita é reconhecida por um código gerado a partir da requisição, descartado depois de 24 horas. Funciona independentemente da sua escolha sobre os cookies do Google Analytics.",
        ],
      },
      {
        heading: "Com quem os dados são compartilhados",
        body: [
          "Apenas com os prestadores acima, cada um para a sua função: Vercel (hospedagem e métricas de visitas), Resend (entrega do e-mail do formulário) e Google (Analytics, só com aceite). Eles podem processar dados fora do Brasil, sob as próprias políticas e garantias contratuais.",
          "Nenhum dado é vendido nem usado para publicidade.",
        ],
      },
      {
        heading: "Seus direitos",
        body: [
          "Pela LGPD (art. 18), você pode pedir a confirmação de que tratamos seus dados, o acesso a eles, a correção, a exclusão, a portabilidade, informações sobre o compartilhamento e a revogação do consentimento.",
          "Para qualquer pedido, escreva para {email}. A resposta vem em até 15 dias.",
        ],
      },
      {
        heading: "Mudanças nesta política",
        body: ["Se esta política mudar, a data de atualização no topo da página muda junto."],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    intro:
      "This is a personal portfolio. It collects as little data as possible, always for a clear purpose. Here is everything that happens to your data when you visit.",
    sections: [
      {
        heading: "Who is responsible",
        body: [
          "André Menezes, an individual based in Rio de Janeiro, Brazil — the data controller under Brazil's LGPD (Law 13,709/2018).",
          "Contact for any privacy matter: {email}.",
        ],
      },
      {
        heading: "Contact form",
        body: [
          "Data: your name, email and the message you write.",
          "Purpose: replying to you. Legal basis: your consent when sending, and the legitimate interest in answering whoever wrote.",
          "How: the message is delivered by email through the Resend service and stays in André's inbox. It is not stored in a database or used for marketing.",
          "Retention: up to 12 months after the last exchange, or sooner if you ask for deletion.",
        ],
      },
      {
        heading: "Google Analytics (only if you accept)",
        body: [
          "If — and only if — you click \"Accept\" on the cookie notice, the site loads Google Analytics 4, which uses cookies (_ga, _ga_*) to measure in aggregate which pages and projects are viewed, where visits come from and what kind of device is used.",
          "Legal basis: consent. Without it, no request is made to Google.",
          "GA4 does not log full IP addresses. Data is kept for up to 14 months under the account settings.",
          "You can change your mind at any time under \"Cookie preferences\" in the footer. Declining stops collection and deletes the Analytics cookies from this browser.",
        ],
      },
      {
        heading: "Preferences stored on your device",
        body: [
          "The site keeps the theme (day/night), sound, fairy, the gems you found and your cookie choice in your browser's local storage (localStorage).",
          "This data never leaves your device, does not identify you and only lets the site remember your choices. You can delete it by clearing the site's data in your browser.",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "The site is hosted on Vercel, which logs technical data for each request (such as IP address and browser) for a short period, for security and operation of the service.",
          "The site also uses Vercel Web Analytics to count visits in aggregate (pages viewed, referrer, country, device type and browser). It does not use third-party cookies and does not identify you: each visit is recognized by a hash generated from the request, discarded after 24 hours. It works regardless of your choice about Google Analytics cookies.",
        ],
      },
      {
        heading: "Who data is shared with",
        body: [
          "Only the providers above, each for its own role: Vercel (hosting and visit metrics), Resend (delivering the form email) and Google (Analytics, only with consent). They may process data outside Brazil under their own policies and contractual safeguards.",
          "No data is sold or used for advertising.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under the LGPD (art. 18) you may request confirmation of processing, access, correction, deletion, portability, information about sharing, and withdrawal of consent.",
          "For any request, write to {email}. You will get an answer within 15 days.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: ["If this policy changes, the date at the top of the page changes too."],
      },
    ],
  },
};

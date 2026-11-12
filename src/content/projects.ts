import type { Localized } from "@/lib/i18n";
import type { ItemIcon } from "@/components/icons/ItemIcons";

/**
 * SLOTS DE PROJETOS
 * -----------------
 * Para adicionar um projeto:
 *   1. Copie um objeto abaixo e troque os campos.
 *   2. Coloque os prints em `public/projects/<slug>/` (png, jpg, webp ou svg).
 *   3. Pronto — ele aparece no inventário (na ordem deste array) e ganha a página
 *      /<idioma>/projects/<slug>.
 *
 * Ícones (`item`): sword, shield, bow, boomerang, bomb, map, potion, key, lantern, scroll, letter, pouch.
 * As capas atuais são ilustrações; troque por prints reais quando tiver.
 */
export type Project = {
  slug: string;
  title: Localized;
  /** Tipo do item, como num RPG: "Ferramenta de laboratório", "Skill de IA"... */
  kind: Localized;
  /** Papel do autor no projeto, em uma linha. Ex.: "Autor único: arquitetura, código e documentação". */
  role: Localized;
  /** 1–2 frases. Aparece no inventário e no modal. */
  summary: Localized;
  /** Resultado concreto em uma frase: o que mudou para quem usa. Sem adjetivo vago. */
  outcome: Localized;
  /** Texto mais longo para a página do projeto. Parágrafos separados por linha em branco. */
  description?: Localized;
  item: ItemIcon;
  tags: string[];
  year: number;
  /** Atributos do item (até 3 aparecem no inventário). */
  stats: { value: string; label: Localized }[];
  /** A primeira imagem é a capa. `alt` é obrigatório (acessibilidade); width/height = tamanho real do arquivo. */
  images: { src: string; width: number; height: number; alt: Localized }[];
  links: { demo?: string; github?: string };
  /** Código fechado: mostra o selo "privado" em vez do link do GitHub. */
  private?: boolean;
};

export const projects: Project[] = [
  {
    slug: "hardware-test-hub",
    title: { pt: "Hardware Test Hub", en: "Hardware Test Hub" },
    kind: { pt: "Ferramenta de laboratório", en: "Lab tool" },
    role: {
      pt: "Autor único: framework, módulos de teste e relatórios",
      en: "Sole author: framework, test modules and reports",
    },
    summary: {
      pt: "Framework para homologar notebooks e desktops Windows: CPU, memória, disco, rede, boot, bateria e Wi-Fi 802.11r, com relatórios rastreáveis por cenário.",
      en: "Framework to certify Windows laptops and desktops: CPU, memory, disk, network, boot, battery and 802.11r Wi-Fi, with traceable per-scenario reports.",
    },
    outcome: {
      pt: "Homologar um notebook virou uma bateria retomável, com PASS ou FAIL por teste e evidência guardada por cenário.",
      en: "Certifying a laptop became a resumable test suite, with PASS or FAIL per test and evidence stored per scenario.",
    },
    description: {
      pt: "Um único ponto de entrada (hub.bat) eleva privilégios, prepara a máquina e abre um menu no console onde o operador escolhe os testes. Cada teste é um script independente que devolve PASS ou FAIL pelo exit code e grava evidências numa pasta controlada pelo hub.\n\nOs resultados ficam agrupados em cenários — por exemplo, imagem limpa × com agentes de segurança — para comparar a mesma máquina em configurações diferentes, retomar uma bateria em outro dia e reexecutar só o que falhou, sem perder evidência. A saída sai em HTML, CSV, JSON e log, além de CSVs temáticos prontos para BI.\n\nÉ extensível por convenção: qualquer .py ou .ps1 colocado na pasta de testes vira um item do menu.",
      en: "A single entry point (hub.bat) elevates privileges, prepares the machine and opens a console menu where the operator picks the tests. Each test is an independent script that returns PASS or FAIL through its exit code and stores evidence in a folder managed by the hub.\n\nResults are grouped into scenarios — e.g. clean image × with security agents — so you can compare the same machine across configurations, resume a run another day and re-run only what failed, without losing evidence. Output comes as HTML, CSV, JSON and logs, plus themed CSVs ready for BI.\n\nIt's extensible by convention: any .py or .ps1 dropped into the tests folder becomes a menu item.",
    },
    item: "shield",
    tags: ["Python", "PowerShell", "Windows", "WPR/WPA", "DiskSpd"],
    year: 2026,
    stats: [
      { value: "9", label: { pt: "módulos de teste", en: "test modules" } },
      { value: "4", label: { pt: "formatos de relatório", en: "report formats" } },
      { value: "v1.0", label: { pt: "release", en: "release" } },
    ],
    images: [
      {
        src: "/projects/hardware-test-hub/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do menu do console com os módulos de teste e o status PASS/FAIL de cada um",
          en: "Illustration of the console menu listing test modules with their PASS/FAIL status",
        },
      },
    ],
    links: { github: "https://github.com/AndreRenatoMenezes/win_testehub" },
  },
  {
    slug: "sdd-maestri",
    title: { pt: "SDD Maestri", en: "SDD Maestri" },
    kind: { pt: "Skill de IA · open source", en: "AI skill · open source" },
    role: {
      pt: "Autor: desenho do método, papéis e documentação",
      en: "Author: method design, roles and documentation",
    },
    summary: {
      pt: "Skill de Spec-Driven Development para times de agentes de IA: papéis que não se cruzam, a spec como contrato e um painel auditável no canvas.",
      en: "Spec-Driven Development skill for teams of AI agents: roles that never overlap, the spec as a contract and an auditable board on the canvas.",
    },
    outcome: {
      pt: "Times de agentes de IA trabalham em paralelo sem dois editarem o mesmo arquivo, com um commit por pacote aprovado.",
      en: "AI agent teams work in parallel without two agents editing the same file, with one commit per approved work package.",
    },
    description: {
      pt: "Rodar cinco agentes ao mesmo tempo é fácil; o que quebra é sempre a mesma coisa: dois agentes editando o mesmo arquivo, cada um inventando uma regra de negócio, contexto que não atravessa terminais e um histórico de git que vira sopa.\n\nA skill impõe disciplina: a spec é o contrato e existe antes do primeiro executor começar. Quem escreve o contrato (Arquiteto) não é quem rege a execução (Maestro); quem implementa (Engineer) não é quem aprova (Reviewer); e só um papel toca no git, com um commit por pacote de trabalho aprovado.\n\nTudo isso com referências a Star Wars espalhadas pela documentação — porque ninguém ataca a estação antes de roubar a planta.",
      en: "Running five agents at once is easy; what breaks is always the same: two agents editing the same file, each inventing its own business rule, context that never crosses terminals and a git history that turns into soup.\n\nThe skill enforces discipline: the spec is the contract and exists before the first executor starts. Whoever writes the contract (Architect) isn't who conducts execution (Maestro); whoever implements (Engineer) isn't who approves (Reviewer); and only one role touches git, with one commit per approved work package.\n\nAll of it sprinkled with Star Wars references throughout the docs — because nobody attacks the station before stealing the plans.",
    },
    item: "scroll",
    tags: ["Claude Code", "AI agents", "Markdown", "Git"],
    year: 2026,
    stats: [
      { value: "5", label: { pt: "papéis de agente", en: "agent roles" } },
      { value: "1", label: { pt: "commit por WP aprovada", en: "commit per approved WP" } },
      { value: "MIT", label: { pt: "licença", en: "license" } },
    ],
    images: [
      {
        src: "/projects/sdd-maestri/banner.svg",
        width: 1200,
        height: 340,
        alt: {
          pt: "Banner do SDD Maestri: Spec-Driven Development para times de agentes de IA",
          en: "SDD Maestri banner: Spec-Driven Development for AI agent teams",
        },
      },
    ],
    links: { github: "https://github.com/AndreRenatoMenezes/SDD-Maestri" },
  },
  {
    slug: "openweddy",
    title: { pt: "OpenWeddy", en: "OpenWeddy" },
    kind: { pt: "Produto open source", en: "Open-source product" },
    role: {
      pt: "Autor único: produto, front-end, banco e painel dos noivos",
      en: "Sole author: product, front-end, database and couple's dashboard",
    },
    summary: {
      pt: "Convite digital de casamento open-source e sem taxas: envelope animado, contagem regressiva, RSVP por família e lista de presentes com Pix direto para o casal.",
      en: "Open-source, fee-free digital wedding invitation: animated envelope, countdown, per-family RSVP and a gift list paid by Pix straight to the couple.",
    },
    outcome: {
      pt: "Usado no meu próprio casamento: convidados confirmaram presença e presentearam por Pix, sem taxa de plataforma.",
      en: "Used at my own wedding: guests confirmed attendance and sent gifts via Pix, with zero platform fees.",
    },
    description: {
      pt: "Nasceu do convite do meu próprio casamento e virou produto: um site completo que o casal hospeda no próprio domínio. As plataformas fechadas cobram por convidado, ficam com parte dos presentes e guardam a lista num banco que não é seu — o OpenWeddy inverte isso.\n\nCada família recebe um link único e responde pessoa a pessoa, sem login. Os presentes geram Pix Copia e Cola e QR Code na hora, e o dinheiro cai 100% na conta do casal. Há um painel para os noivos acompanharem confirmações, marcarem pagamentos e importarem convidados por planilha.\n\nRoda nos planos gratuitos da Vercel e do Supabase: custo zero.",
      en: "It started as the invitation for my own wedding and became a product: a complete site the couple hosts on their own domain. Closed platforms charge per guest, take a cut of the gifts and keep your list in a database that isn't yours — OpenWeddy flips that.\n\nEach family gets a unique link and answers person by person, no login. Gifts generate a Pix copy-paste code and QR code on the spot, and 100% of the money goes to the couple. There's a dashboard for the couple to follow RSVPs, mark payments and import guests from a spreadsheet.\n\nIt runs on Vercel's and Supabase's free tiers: zero cost.",
    },
    item: "letter",
    tags: ["Next.js", "React", "TypeScript", "Supabase", "Pix"],
    year: 2026,
    stats: [
      { value: "R$ 0", label: { pt: "de taxa por convidado", en: "fee per guest" } },
      { value: "100%", label: { pt: "dos presentes ao casal", en: "of gifts to the couple" } },
      { value: "AGPL", label: { pt: "licença", en: "license" } },
    ],
    images: [
      {
        src: "/projects/openweddy/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do convite: envelope fechado com selo, contagem regressiva e botão de confirmar presença",
          en: "Invitation illustration: sealed envelope, countdown and RSVP button",
        },
      },
    ],
    links: { github: "https://github.com/AndreRenatoMenezes/OpenWeddy" },
  },
  {
    slug: "orcazen",
    title: { pt: "OrçaZen", en: "OrçaZen" },
    kind: { pt: "App pessoal", en: "Personal app" },
    role: {
      pt: "Autor único: produto, front-end, banco e integração com IA",
      en: "Sole author: product, front-end, database and AI integration",
    },
    summary: {
      pt: "App de finanças pessoais: despesas, receitas, faturas de cartão e assinaturas, com importação de extrato por IA e lançamentos em linguagem natural.",
      en: "Personal finance app: expenses, income, credit card bills and subscriptions, with AI statement import and natural-language entries.",
    },
    outcome: {
      pt: "Substituiu a planilha de finanças da casa, com extratos importados por IA e conferidos antes de gravar.",
      en: "Replaced the household finance spreadsheet, with statements imported by AI and reviewed before saving.",
    },
    description: {
      pt: "Começou como uma planilha e virou um app completo, construído inteiro com Spec-Driven Development: cada funcionalidade tem spec, pacotes de trabalho e revisão independente antes de entrar.\n\nImporta extratos e faturas em OFX, CSV ou PDF — a IA (Gemini, com retry, fallback entre modelos e circuit breaker) sugere categorias, e nada é gravado sem confirmação. Também aceita lançamentos em linguagem natural e por um bot de Telegram, projeta compras parceladas nas faturas futuras e concilia pagamentos e estornos.\n\nO código é privado; posso mostrar numa conversa.",
      en: "It started as a spreadsheet and became a full app, built entirely with Spec-Driven Development: every feature has a spec, work packages and independent review before it lands.\n\nIt imports statements and card bills in OFX, CSV or PDF — the AI (Gemini, with retries, model fallback and a circuit breaker) suggests categories, and nothing is saved without confirmation. It also takes natural-language entries and a Telegram bot, projects installment purchases onto future bills and reconciles payments and refunds.\n\nThe code is private; happy to show it in a conversation.",
    },
    item: "pouch",
    tags: ["React", "Vite", "Supabase", "Gemini", "Telegram"],
    year: 2026,
    stats: [
      { value: "26+", label: { pt: "features entregues", en: "features shipped" } },
      { value: "638", label: { pt: "testes automatizados", en: "automated tests" } },
      { value: "IA", label: { pt: "na importação", en: "on import" } },
    ],
    images: [
      {
        src: "/projects/orcazen/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do painel: cards de entradas, saídas e fatura, gráfico mensal e importação de extrato",
          en: "Dashboard illustration: income, expense and card bill cards, monthly chart and statement import",
        },
      },
    ],
    links: {},
    private: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

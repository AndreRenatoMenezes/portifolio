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
    slug: "macbenchmark",
    title: { pt: "MacBenchmark", en: "MacBenchmark" },
    kind: { pt: "Ferramenta de laboratório · macOS", en: "Lab tool · macOS" },
    role: {
      pt: "Autor único: arquitetura, app em Swift, backend e metodologia de medição",
      en: "Sole author: architecture, Swift app, backend and measurement methodology",
    },
    summary: {
      pt: "Benchmark nativo para homologar MacBooks Apple Silicon: mede CPU, RAM, SSD, rede, bateria e boot com cargas sintéticas e reais (Numbers, Pages, Safari) e gera um score reproduzível contra um baseline.",
      en: "Native benchmark to certify Apple Silicon MacBooks: measures CPU, RAM, SSD, network, battery and boot with synthetic and real workloads (Numbers, Pages, Safari) and produces a reproducible score against a baseline.",
    },
    outcome: {
      pt: "O laboratório de endpoints de uma fintech compara máquinas e imagens de sistema com dados brutos auditáveis, em vez de um número de caixa-preta.",
      en: "A fintech endpoint lab compares machines and system images using auditable raw data instead of a black-box number.",
    },
    description: {
      pt: "Benchmarks comerciais como PCMark e Geekbench entregam um número final sem expor como cada carga se comportou sob agentes corporativos. O MacBenchmark foi criado para dar transparência total à homologação: antes de iniciar, um pré-voo confere energia, disco, rede e processos na máquina, e a telemetria ao vivo acompanha cada etapa.\n\nPara garantir reprodutibilidade, as cargas usam seeds determinísticos, descartam o aquecimento (warmup) e rodam em série com pausas de resfriamento térmico. O score é calculado em camadas por média harmônica ponderada contra uma máquina de referência (baseline = 1000), com baseline e resultados brutos exportáveis em JSON.\n\nConta ainda com sincronização opcional para um backend em Node.js/TypeScript e PostgreSQL com fila offline para consolidar baterias do laboratório. O código é privado; posso mostrar numa conversa.",
      en: "Commercial benchmarks like PCMark and Geekbench hand back a single score without exposing how each workload behaved under corporate agents. MacBenchmark was built for full certification transparency: before starting, a preflight check validates power, disk, network and running processes, while live telemetry tracks every stage.\n\nTo ensure reproducibility, workloads use deterministic seeds, discard warmup runs and execute serially with thermal cooldown pauses. The layered score is computed via weighted harmonic mean against a reference machine (baseline = 1000), with both the baseline and raw results exportable as JSON.\n\nIt also includes optional sync to a Node.js/TypeScript and PostgreSQL backend with an offline queue to consolidate lab runs. The code is private; happy to show it in a conversation.",
    },
    item: "sword",
    tags: ["Swift 6", "SwiftUI", "IOReport", "Node.js", "PostgreSQL", "GitHub Actions"],
    year: 2026,
    stats: [
      { value: "4", label: { pt: "suítes de teste", en: "test suites" } },
      { value: "1000", label: { pt: "score do baseline", en: "baseline score" } },
      { value: "2", label: { pt: "pipelines de CI", en: "CI pipelines" } },
    ],
    images: [
      {
        src: "/projects/macbenchmark/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do painel do MacBenchmark com pré-voo, suítes de teste, telemetria térmica e score comparativo contra o baseline 1000",
          en: "Illustration of the MacBenchmark dashboard showing preflight checks, test suites, thermal telemetry and comparative score against the 1000 baseline",
        },
      },
    ],
    links: {},
    private: true,
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
    slug: "indice",
    title: { pt: "Índice", en: "Índice" },
    kind: { pt: "Produto pessoal · web + Android", en: "Personal product · web + Android" },
    role: {
      pt: "Autor único: API, web, app Android e infraestrutura",
      en: "Sole author: API, web, Android app and infrastructure",
    },
    summary: {
      pt: "Painel pessoal inspirado no Bullet Journal: tarefas, hábitos, finanças, metas e arquivo de mídia numa API própria, com cliente web e app Android.",
      en: "Personal dashboard inspired by the Bullet Journal: tasks, habits, finances, goals and media archive on a custom API, with a web client and an Android app.",
    },
    outcome: {
      pt: "Uma única API serve o site e o app, com as regras de negócio cobertas por testes e deploy em contêiner.",
      en: "A single API serves both the website and the Android app, with business rules covered by tests and containerized deployment.",
    },
    description: {
      pt: "Organizado como monorepo, reúne a API em Fastify + Prisma, o cliente web em Next.js e o aplicativo Android nativo em Kotlin + Jetpack Compose com widget na tela inicial. Os contratos de dados em Zod são compartilhados entre a API e a web para evitar divergência entre pontas.\n\nNa rotina diária, suporta tarefas em árvore, recorrência e migração entre dias mantendo o histórico do Bullet Journal, além de régua semanal de hábitos, metas de longo prazo e catálogo de mídia. O módulo financeiro porta as regras de negócio do OrçaZen — como fechamento de ciclo de fatura e projeção de parcelas — cobertas por testes automatizados.\n\nToda a infraestrutura foi desenhada API-first e empacotada em contêineres prontos para Google Cloud Run e Cloud SQL. O código é privado; posso mostrar numa conversa.",
      en: "Structured as a monorepo, it brings together a Fastify + Prisma API, a Next.js web client and a native Kotlin + Jetpack Compose Android app with a home-screen widget. Zod data contracts are shared between the API and web client to prevent drift across layers.\n\nFor daily planning, it supports nested tasks, recurrence rules and day-to-day migration preserving Bullet Journal history, alongside a weekly habit tracker, long-term goals and a media archive. The finance module ports OrçaZen's business rules — including credit card billing cycles and installment projections — backed by automated tests.\n\nThe entire stack is designed API-first and packaged in containers ready for Google Cloud Run and Cloud SQL. The code is private; happy to show it in a conversation.",
    },
    item: "key",
    tags: ["TypeScript", "Fastify", "Prisma", "Next.js", "Kotlin", "Jetpack Compose", "PostgreSQL", "Cloud Run"],
    year: 2026,
    stats: [
      { value: "3", label: { pt: "apps (API, web, Android)", en: "apps (API, web & Android)" } },
      { value: "5", label: { pt: "áreas num painel", en: "areas in one dashboard" } },
      { value: "API-first", label: { pt: "arquitetura", en: "architecture" } },
    ],
    images: [
      {
        src: "/projects/indice/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do painel Índice mostrando a visão diária de bullets, hábitos da semana, resumo financeiro e metas",
          en: "Illustration of the Índice dashboard showing daily bullets, weekly habits, financial summary and goals",
        },
      },
    ],
    links: {},
    private: true,
  },
  {
    slug: "linux-endpoint-bench",
    title: { pt: "Linux Endpoint Bench", en: "Linux Endpoint Bench" },
    kind: { pt: "Ferramenta de laboratório · Linux", en: "Lab tool · Linux" },
    role: {
      pt: "Autor único: orquestrador, testes e documentação de operação",
      en: "Sole author: orchestrator, test suites and operations documentation",
    },
    summary: {
      pt: "Orquestrador de benchmark para estações Ubuntu que mede o impacto de agentes de segurança (antivírus, EDR, DLP) em CPU, disco, memória, boot e aplicativos.",
      en: "Benchmark orchestrator for Ubuntu workstations that measures the impact of security agents (antivirus, EDR, DLP) on CPU, disk, memory, boot and applications.",
    },
    outcome: {
      pt: "A decisão de homologar um agente de segurança passa a se apoiar em medições repetíveis, com reinícios reais e ambiente controlado.",
      en: "Approving a security agent now relies on repeatable measurements with real reboots and a controlled environment.",
    },
    description: {
      pt: "Coordena 19 testes distribuídos em 6 domínios — incluindo uma bateria de boot com reinícios reais coordenada via systemd — para comparar uma estação Ubuntu limpa com cenários sob agentes de segurança corporativos.\n\nAntes da bateria, um preflight valida dependências e perfil de energia, o comando doctor diagnostica o ambiente e o orquestrador suspende atualizações automáticas para evitar ruído durante a coleta. Além de microbenchmarks com hyperfine, executa cargas reais de escritório automatizando o LibreOffice via UNO e fluxos de navegador com Playwright.\n\nConstruído de ponta a ponta com Spec-Driven Development (mais de 30 specs entregues). O código é privado; posso mostrar numa conversa.",
      en: "Coordinates 19 tests across 6 domains — including a boot battery with real reboots orchestrated via systemd — to compare a clean Ubuntu workstation against scenarios running corporate security agents.\n\nBefore running, a preflight check validates dependencies and power profiles, a doctor command diagnoses the environment and the orchestrator suspends automatic updates to prevent noise during collection. Alongside hyperfine microbenchmarks, it runs real office workloads by automating LibreOffice via UNO and browser flows with Playwright.\n\nBuilt end-to-end with Spec-Driven Development (30+ specs shipped). The code is private; happy to show it in a conversation.",
    },
    item: "lantern",
    tags: ["Python", "Ubuntu", "systemd", "LibreOffice UNO", "Playwright", "hyperfine"],
    year: 2026,
    stats: [
      { value: "19", label: { pt: "testes", en: "tests" } },
      { value: "6", label: { pt: "domínios medidos", en: "measured domains" } },
      { value: "30+", label: { pt: "specs entregues", en: "specs shipped" } },
    ],
    images: [
      {
        src: "/projects/linux-endpoint-bench/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do terminal do Linux Endpoint Bench executando preflight e os 6 domínios de teste em Ubuntu",
          en: "Illustration of the Linux Endpoint Bench terminal running preflight checks and the 6 test domains on Ubuntu",
        },
      },
    ],
    links: {},
    private: true,
  },
  {
    slug: "homolog-dashboard",
    title: { pt: "Homolog Dashboard", en: "Homolog Dashboard" },
    kind: { pt: "Ferramenta de laboratório · relatórios", en: "Lab tool · reporting" },
    role: {
      pt: "Autor único: coleta, modelo de dados, geração dos relatórios e integração com IA",
      en: "Sole author: data collection, data model, report generation and AI integration",
    },
    summary: {
      pt: "Gerador de relatórios de homologação: aponta para a pasta de resultados, descobre a estrutura sozinho e produz dashboard interativo, apresentação em slides e relatório em markdown.",
      en: "Certification report generator: point it at a results folder and it auto-discovers the structure to produce an interactive dashboard, a slide deck and a Markdown report.",
    },
    outcome: {
      pt: "O relatório de uma homologação sai em uma passada, com parecer opcional de IA embutido, em vez de ser montado à mão.",
      en: "A certification report is generated in a single pass with an optional embedded AI assessment, instead of being assembled by hand.",
    },
    description: {
      pt: "Uma única instalação atende todas as homologações do laboratório, tanto pela interface gráfica em Streamlit quanto pela linha de comando (CLI), rodando em Windows e macOS. Basta apontar para a pasta de resultados: uma etapa de prévia da coleta mostra os cenários e arquivos detectados antes de gerar, evitando processar diretório incompleto.\n\nEm uma passada, produz três artefatos prontos para públicos diferentes: dashboard HTML interativo, apresentação em slides e relatório técnico em Markdown. Opcionalmente, consulta a API do Gemini para embutir um parecer analítico — com degradação graciosa que conclui a geração normalmente caso a API esteja indisponível.\n\nO código é privado; posso mostrar numa conversa.",
      en: "A single installation serves every lab certification run through both a Streamlit graphical interface and a command-line interface (CLI) on Windows and macOS. Point it at a results folder and a collection preview step displays detected scenarios and files before generating, preventing incomplete runs.\n\nIn a single pass, it outputs three artifacts tailored to different audiences: an interactive HTML dashboard, a slide presentation and a technical Markdown report. Optionally, it queries the Gemini API to embed an analytical assessment — with graceful degradation that completes report generation even if the API is unreachable.\n\nThe code is private; happy to show it in a conversation.",
    },
    item: "map",
    tags: ["Python", "Streamlit", "Gemini", "HTML", "CLI"],
    year: 2026,
    stats: [
      { value: "3", label: { pt: "artefatos por execução", en: "artifacts per run" } },
      { value: "2", label: { pt: "sistemas (Windows, macOS)", en: "OSes (Windows, macOS)" } },
      { value: "Gemini", label: { pt: "parecer por IA", en: "AI assessment" } },
    ],
    images: [
      {
        src: "/projects/homolog-dashboard/1.svg",
        width: 1200,
        height: 750,
        alt: {
          pt: "Ilustração do Homolog Dashboard com prévia da coleta, gráficos comparativos por cenário e geração de HTML, slides e Markdown",
          en: "Illustration of Homolog Dashboard showing collection preview, scenario comparison charts and HTML, slides and Markdown output",
        },
      },
    ],
    links: {},
    private: true,
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
      { value: "Gemini", label: { pt: "importação por IA", en: "AI import" } },
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

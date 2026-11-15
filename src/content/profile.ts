import type { Localized } from "@/lib/i18n";

/**
 * Dados pessoais e currículo exibidos na ficha do herói e no JSON-LD.
 */
export const profile = {
  name: "Andre Renato Silva Braga de Menezes",
  /** Grafia usada no currículo; vai para Person.alternateName. */
  cvName: "André Braga de Menezes",
  initials: "AM",
  /** Foto da ficha do herói (retrato 4:5, P&B). */
  avatar: "/profile/andre-braga-de-menezes.jpg",
  role: { pt: "AI Builder", en: "AI Builder" } satisfies Localized,
  headline: {
    pt: "AI Builder | Automação de Infraestrutura | Agentes de IA e Python",
    en: "AI Builder | Infrastructure Automation | AI Agents and Python",
  } satisfies Localized,
  home: { pt: "Rio de Janeiro", en: "Rio de Janeiro" } satisfies Localized,
  experience: { pt: "5+ anos", en: "5+ years" } satisfies Localized,
  bio: {
    pt: "Profissional de tecnologia com 5+ anos de experiência em infraestrutura, sistemas corporativos e automação de processos, hoje focado em construir soluções de ponta a ponta com Inteligência Artificial. Como Endpoint Engineer na Stone, desenvolvo automações em Python e ferramentas com IA para testes de performance, benchmark e homologação de atualizações de sistema operacional e agentes de segurança. Experiência em orquestração de agentes de IA (Claude Code, Gemini API), desenvolvimento multiagente orientado a especificações (Spec-Driven Development), integrações via APIs, SQL, JavaScript/TypeScript e digitalização de fluxos de negócio (TOTVS Fluig e Protheus).",
    en: "Technology professional with 5+ years of experience in infrastructure, enterprise systems and process automation, now focused on building end-to-end solutions with Artificial Intelligence. As an Endpoint Engineer at Stone, I build Python automation and AI-powered tools for performance testing, benchmarking and certification of operating system and security agent updates. Experienced in AI agent orchestration (Claude Code, Gemini API), spec-driven multi-agent development (Spec-Driven Development), API integrations, SQL, JavaScript/TypeScript and business workflow digitization (TOTVS Fluig and Protheus).",
  } satisfies Localized,
  /** Experiência profissional, mais recente primeiro. */
  quests: [
    {
      when: { pt: "03/2026 – Atual", en: "Mar 2026 – Present" },
      title: {
        pt: "Endpoint Engineer (Infra Automation)",
        en: "Endpoint Engineer (Infra Automation)",
      },
      org: "Stone",
      detail: {
        pt: "InfraCorp – Laboratório de Endpoints · Rio de Janeiro, RJ",
        en: "InfraCorp – Endpoint Lab · Rio de Janeiro, Brazil",
      },
      points: [
        {
          pt: "Desenvolvi automação em Python para testes de performance com Windows Performance Analyzer (WPA), consolidando métricas em CSV e gerando relatórios HTML automaticamente, reduzindo trabalho manual na homologação.",
          en: "Built Python automation for performance testing with Windows Performance Analyzer (WPA), consolidating metrics into CSV and generating HTML reports automatically, reducing manual work in certification.",
        },
        {
          pt: "Executo testes de performance, benchmark e regressão que liberam o rollout de novas versões do Windows e de agentes de segurança, identificando regressões que afetam a experiência do usuário final.",
          en: "Run performance, benchmark and regression tests that clear the rollout of new Windows and security agent versions, identifying regressions that affect the end-user experience.",
        },
        {
          pt: "Conduzi análise comparativa de performance entre Windows 10 e Windows 11 (23H2, 24H2 e 25H2) em notebooks corporativos, avaliando a eficiência dos agentes instalados e apresentando os resultados aos times internos.",
          en: "Led a comparative performance analysis of Windows 10 and Windows 11 (23H2, 24H2 and 25H2) on corporate laptops, assessing the efficiency of installed agents and presenting the results to internal teams.",
        },
        {
          pt: "Desenvolvo ferramentas internas com apoio de IA generativa e agentes de código para otimizar rotinas operacionais do laboratório.",
          en: "Build internal tools with generative AI and coding agents to streamline the lab's operational routines.",
        },
        {
          pt: "Desenvolvi dashboard de controle do estoque de equipamentos de rede com rastreio de localização física, dando visibilidade do inventário ao time de Ativos.",
          en: "Built a network equipment inventory dashboard with physical location tracking, giving the Assets team visibility into inventory.",
        },
        {
          pt: "Estruturei bases de conhecimento técnicas no Confluence para onboarding de novos integrantes e investigação de incidentes.",
          en: "Structured technical knowledge bases in Confluence for onboarding new team members and investigating incidents.",
        },
        {
          pt: "Apoio o troubleshooting de rede em switches Cisco Catalyst (IOS/IOS-XE).",
          en: "Support network troubleshooting on Cisco Catalyst switches (IOS/IOS-XE).",
        },
      ],
    },
    {
      when: { pt: "12/2022 – 02/2026", en: "Dec 2022 – Feb 2026" },
      title: { pt: "Analista de Sistemas", en: "Systems Analyst" },
      org: "OceanPact Serviços Marítimos",
      detail: {
        pt: "Analista de Sistemas (01/2025 – 02/2026) · Assistente de Sistemas (03/2024 – 12/2024) · Estagiário de Sistemas (12/2022 – 03/2024)",
        en: "Systems Analyst (Jan 2025 – Feb 2026) · Systems Assistant (Mar 2024 – Dec 2024) · Systems Intern (Dec 2022 – Mar 2024)",
      },
      points: [
        {
          pt: "Sustentei e evoluí as plataformas TOTVS Fluig, Protheus e Movidesk, garantindo estabilidade operacional e cumprimento de SLAs.",
          en: "Maintained and evolved the TOTVS Fluig, Protheus and Movidesk platforms, ensuring operational stability and SLA compliance.",
        },
        {
          pt: "Digitalizei e automatizei processos de negócio com formulários e workflows no Fluig (JavaScript), integrações via APIs REST entre Fluig, Narwal, WMS e Protheus e consultas SQL (SQL Server).",
          en: "Digitized and automated business processes with Fluig forms and workflows (JavaScript), REST API integrations between Fluig, Narwal, WMS and Protheus, and SQL queries (SQL Server).",
        },
        {
          pt: "Realizei levantamento de requisitos, documentação técnica e governança de fluxos, contribuindo para melhorias de arquitetura e eficiência operacional.",
          en: "Gathered requirements, wrote technical documentation and governed workflows, contributing to architecture improvements and operational efficiency.",
        },
      ],
    },
    {
      when: { pt: "02/2021 – 11/2022", en: "Feb 2021 – Nov 2022" },
      title: { pt: "Técnico de Suporte de TI", en: "IT Support Technician" },
      org: "Synapse Brasil",
      detail: {
        pt: "Terceirizado (BPO) alocado no cliente FSB Comunicação · Rio de Janeiro, RJ",
        en: "Outsourced (BPO) at client FSB Comunicação · Rio de Janeiro, Brazil",
      },
      points: [
        {
          pt: "Prestei atendimento N1 e N2 (presencial e remoto), diagnosticando e resolvendo incidentes em ambientes corporativos e sistemas internos.",
          en: "Provided L1 and L2 support (on-site and remote), diagnosing and resolving incidents in corporate environments and internal systems.",
        },
        {
          pt: "Administrei ambientes Google Workspace e Microsoft 365 e gerenciei usuários, permissões e políticas no Active Directory.",
          en: "Administered Google Workspace and Microsoft 365 environments and managed users, permissions and policies in Active Directory.",
        },
      ],
    },
    {
      when: { pt: "Projeto paralelo", en: "Side quest" },
      title: { pt: "Consultoria independente de TI", en: "Independent IT consulting" },
      org: "",
      points: [
        {
          pt: "Serviços de infraestrutura para pequenas empresas: domínios, e-mail corporativo, servidores de arquivos e sistemas de ponto eletrônico; manutenção do site institucional de uma organização sem fins lucrativos.",
          en: "Infrastructure services for small businesses: domains, corporate email, file servers and time-tracking systems; maintenance of a nonprofit organization's institutional website.",
        },
      ],
    },
  ] satisfies {
    when: Localized;
    title: Localized;
    org: string;
    detail?: Localized;
    points: Localized[];
  }[],
  /** Formação e certificações. */
  education: [
    {
      when: { pt: "Previsão: 12/2026", en: "Expected: Dec 2026" },
      title: {
        pt: "Bacharelado em Engenharia da Computação",
        en: "Bachelor's in Computer Engineering",
      },
      org: "Centro Universitário União das Américas",
    },
  ] satisfies { when: Localized; title: Localized; org: string }[],
  certifications: [
    {
      title: "TOTVS Fluig Voyager 2.0",
      org: "TOTVS",
    },
  ] satisfies { title: string; org: string }[],
  /** Competências técnicas em grupos, na ordem do currículo. */
  skills: [
    {
      group: { pt: "IA e Agentes", en: "AI and Agents" },
      items: [
        { pt: "IA Generativa", en: "Generative AI" },
        { pt: "LLMs", en: "LLMs" },
        { pt: "Engenharia de Prompt", en: "Prompt Engineering" },
        { pt: "Agentes de IA", en: "AI Agents" },
        { pt: "Sistemas Multiagente", en: "Multi-Agent Systems" },
        { pt: "Claude Code", en: "Claude Code" },
        { pt: "Gemini API", en: "Gemini API" },
        { pt: "Google AI Studio", en: "Google AI Studio" },
        { pt: "Spec-Driven Development", en: "Spec-Driven Development" },
      ],
    },
    {
      group: { pt: "Automação", en: "Automation" },
      items: [
        { pt: "Python", en: "Python" },
        { pt: "Automação de Testes", en: "Test Automation" },
        { pt: "Testes de Performance", en: "Performance Testing" },
        { pt: "Benchmark", en: "Benchmarking" },
        { pt: "Windows Performance Analyzer", en: "Windows Performance Analyzer" },
        { pt: "Power Automate (RPA)", en: "Power Automate (RPA)" },
        { pt: "Workflows TOTVS Fluig", en: "TOTVS Fluig Workflows" },
      ],
    },
    {
      group: { pt: "Desenvolvimento e Dados", en: "Development and Data" },
      items: [
        { pt: "JavaScript", en: "JavaScript" },
        { pt: "TypeScript", en: "TypeScript" },
        { pt: "Node.js", en: "Node.js" },
        { pt: "Next.js", en: "Next.js" },
        { pt: "Kotlin", en: "Kotlin" },
        { pt: "SQL", en: "SQL" },
        { pt: "SQL Server", en: "SQL Server" },
        { pt: "APIs REST", en: "REST APIs" },
        { pt: "Integração de Sistemas", en: "Systems Integration" },
      ],
    },
    {
      group: { pt: "Cloud e DevOps", en: "Cloud and DevOps" },
      items: [
        { pt: "Google Cloud Run", en: "Google Cloud Run" },
        { pt: "Git", en: "Git" },
        { pt: "GitHub", en: "GitHub" },
        { pt: "GitHub Actions", en: "GitHub Actions" },
        { pt: "CI/CD", en: "CI/CD" },
        { pt: "Vercel", en: "Vercel" },
      ],
    },
    {
      group: { pt: "Infraestrutura e Plataformas", en: "Infrastructure and Platforms" },
      items: [
        { pt: "Windows 10/11", en: "Windows 10/11" },
        { pt: "Endpoint Engineering", en: "Endpoint Engineering" },
        { pt: "Active Directory", en: "Active Directory" },
        { pt: "Microsoft 365", en: "Microsoft 365" },
        { pt: "Google Workspace", en: "Google Workspace" },
        { pt: "Cisco Catalyst (IOS/IOS-XE)", en: "Cisco Catalyst (IOS/IOS-XE)" },
        { pt: "ServiceNow", en: "ServiceNow" },
        { pt: "Confluence", en: "Confluence" },
        { pt: "TOTVS Fluig", en: "TOTVS Fluig" },
        { pt: "TOTVS Protheus", en: "TOTVS Protheus" },
        { pt: "Movidesk", en: "Movidesk" },
      ],
    },
    {
      group: { pt: "Competências complementares", en: "Complementary skills" },
      items: [
        { pt: "Levantamento de requisitos", en: "Requirements gathering" },
        { pt: "Documentação técnica", en: "Technical documentation" },
        { pt: "Governança de processos", en: "Process governance" },
        { pt: "Resolução de problemas", en: "Problem solving" },
        { pt: "Melhoria contínua", en: "Continuous improvement" },
      ],
    },
  ] satisfies { group: Localized; items: Localized[] }[],
  /** Links de contato. Deixe vazio para esconder. */
  contacts: {
    github: "https://github.com/AndreRenatoMenezes",
    linkedin: "https://www.linkedin.com/in/andrerenatomenezes/",
    email: "andre@bragademenezes.com",
    /** WhatsApp só com dígitos: país + DDD + número (ex.: "5521999999999"). Vazio esconde o botão. */
    whatsapp: "5521972764096",
  },
  /** PDF do currículo por idioma (em /public). */
  cv: {
    pt: "/cv/andre-braga-de-menezes-cv-pt.pdf",
    en: "/cv/andre-braga-de-menezes-cv-en.pdf",
  } satisfies Localized,
};

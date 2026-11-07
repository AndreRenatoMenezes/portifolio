import type { Localized } from "@/lib/i18n";
import type { ItemIcon } from "@/components/icons/ItemIcons";

/**
 * SLOTS DE PROJETOS
 * -----------------
 * Para adicionar um projeto:
 *   1. Copie um objeto abaixo e troque os campos.
 *   2. Coloque os prints em `public/projects/<slug>/` (png, jpg, webp ou svg).
 *   3. Pronto — ele aparece no inventário e ganha a página /<idioma>/projects/<slug>.
 *
 * Ícones disponíveis (`item`): sword, shield, bow, boomerang, bomb, map, potion, key, lantern, scroll.
 * Os três projetos abaixo são EXEMPLOS — substitua pelos seus.
 */
export type Project = {
  slug: string;
  title: Localized;
  /** 1–2 frases. Aparece no inventário e no modal. */
  summary: Localized;
  /** Texto mais longo para a página do projeto. Parágrafos separados por linha em branco. */
  description?: Localized;
  item: ItemIcon;
  tags: string[];
  year: number;
  /** A primeira imagem é a capa. `alt` é obrigatório (acessibilidade). */
  images: { src: string; alt: Localized }[];
  links: { demo?: string; github?: string };
};

export const projects: Project[] = [
  {
    slug: "exemplo-dashboard",
    title: { pt: "Painel de Missões", en: "Quest Dashboard" },
    summary: {
      pt: "Exemplo: dashboard em tempo real para acompanhar tarefas de um time, com gráficos e filtros.",
      en: "Example: real-time dashboard to track a team's tasks, with charts and filters.",
    },
    description: {
      pt: "Este é um projeto de exemplo. Conte aqui o problema, o que você construiu e o que aprendeu.\n\nUse um segundo parágrafo para detalhes técnicos: arquitetura, decisões e resultados.",
      en: "This is a sample project. Describe the problem, what you built and what you learned.\n\nUse a second paragraph for technical details: architecture, decisions and results.",
    },
    item: "map",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    year: 2026,
    images: [
      {
        src: "/projects/exemplo-dashboard/1.svg",
        alt: { pt: "Tela principal do painel", en: "Dashboard main screen" },
      },
      {
        src: "/projects/exemplo-dashboard/2.svg",
        alt: { pt: "Tela de filtros", en: "Filters screen" },
      },
    ],
    links: { demo: "https://example.com", github: "https://github.com/" },
  },
  {
    slug: "exemplo-api",
    title: { pt: "API Mestre-Espada", en: "Blade Master API" },
    summary: {
      pt: "Exemplo: API REST robusta com autenticação, testes e documentação automática.",
      en: "Example: robust REST API with authentication, tests and auto-generated docs.",
    },
    item: "sword",
    tags: ["Node.js", "Fastify", "Docker"],
    year: 2025,
    images: [
      {
        src: "/projects/exemplo-api/1.svg",
        alt: { pt: "Documentação da API", en: "API documentation" },
      },
    ],
    links: { github: "https://github.com/" },
  },
  {
    slug: "exemplo-app",
    title: { pt: "Poção de Hábitos", en: "Habit Potion" },
    summary: {
      pt: "Exemplo: app mobile-first para criar hábitos, com lembretes e sequência de dias.",
      en: "Example: mobile-first app to build habits, with reminders and streaks.",
    },
    item: "potion",
    tags: ["React", "PWA", "Supabase"],
    year: 2025,
    images: [
      {
        src: "/projects/exemplo-app/1.svg",
        alt: { pt: "Tela inicial do app", en: "App home screen" },
      },
    ],
    links: { demo: "https://example.com" },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

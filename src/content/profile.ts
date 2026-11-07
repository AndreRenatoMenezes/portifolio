import type { Localized } from "@/lib/i18n";

/**
 * Seus dados pessoais (baseados no README do perfil do GitHub).
 */
export const profile = {
  name: "André Menezes",
  initials: "AM",
  /** Foto opcional em /public (ex.: "/avatar.jpg"). Sem foto, mostra as iniciais. */
  avatar: undefined as string | undefined,
  role: { pt: "Endpoint Engineer", en: "Endpoint Engineer" } satisfies Localized,
  home: { pt: "Rio de Janeiro", en: "Rio de Janeiro" } satisfies Localized,
  bio: {
    pt: "Construo automações e ferramentas que sustentam a operação de infraestrutura: menos trabalho manual, configuração de dispositivos padronizada e um suporte do dia a dia mais rápido e confiável. Nas horas vagas, transformo problemas da vida real em produtos — de convite de casamento a app de finanças.",
    en: "I build automation and tooling that keep infrastructure operations running: less manual work, standardized device configuration and faster, more reliable day-to-day support. In my spare time I turn real-life problems into products — from wedding invitations to a finance app.",
  } satisfies Localized,
  /** Habilidades exibidas como "equipamento". */
  skills: ["PowerShell", "Python", "Bash", "Windows", "Linux", "TypeScript", "React", "Next.js", "Supabase", "PostgreSQL", "Docker", "Git"],
  /** O que está treinando agora. */
  training: ["CI/CD", "Terraform / IaC", "Kubernetes"],
  /** Linha do tempo (mais recente primeiro). */
  quests: [
    {
      when: { pt: "Agora", en: "Now" },
      title: { pt: "Endpoint Engineer", en: "Endpoint Engineer" },
      text: {
        pt: "Automação e tooling para o time de infraestrutura: homologação de hardware, gestão de endpoints e scripts que rodam sem supervisão.",
        en: "Automation and tooling for the infrastructure team: hardware certification, endpoint management and scripts that run unsupervised.",
      },
    },
    {
      when: { pt: "Em treinamento", en: "In training" },
      title: { pt: "DevOps", en: "DevOps" },
      text: {
        pt: "CI/CD, containers e infraestrutura como código.",
        en: "CI/CD, containers and infrastructure as code.",
      },
    },
    {
      when: { pt: "Projetos paralelos", en: "Side quests" },
      title: { pt: "Produtos com Spec-Driven Development", en: "Products with Spec-Driven Development" },
      text: {
        pt: "Times de agentes de IA guiados por spec — e os produtos que saem deles.",
        en: "Spec-guided AI agent teams — and the products that come out of them.",
      },
    },
  ] satisfies { when: Localized; title: Localized; text: Localized }[],
  /** Links de contato. Deixe vazio para esconder. */
  contacts: {
    github: "https://github.com/AndreRenatoMenezes",
    linkedin: "https://www.linkedin.com/in/andrerenatomenezes/",
    email: "andrereanto.ti@gmail.com",
  },
  /** Caminho do currículo em /public (ex.: "/cv.pdf"). Vazio esconde o botão. */
  cv: "",
};

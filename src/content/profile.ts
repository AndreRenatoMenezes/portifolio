import type { Localized } from "@/lib/i18n";

/**
 * Seus dados pessoais. Troque os valores marcados com TODO.
 */
export const profile = {
  name: "André Menezes",
  initials: "AM",
  /** Foto opcional em /public (ex.: "/avatar.jpg"). Sem foto, mostra as iniciais. */
  avatar: undefined as string | undefined,
  role: { pt: "Dev full-stack", en: "Full-stack developer" } satisfies Localized,
  home: { pt: "Brasil", en: "Brazil" } satisfies Localized, // TODO: sua cidade
  bio: {
    pt: "TODO: escreva 2–3 frases sobre você — o que gosta de construir, como trabalha e o que procura agora.",
    en: "TODO: write 2–3 sentences about yourself — what you like to build, how you work and what you're looking for.",
  } satisfies Localized,
  /** Habilidades exibidas como "equipamento". */
  skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Tailwind", "Docker", "Git"],
  /** Linha do tempo (mais recente primeiro). */
  quests: [
    {
      when: "2024 —",
      title: { pt: "TODO: Cargo atual @ Empresa", en: "TODO: Current role @ Company" },
      text: { pt: "O que você faz por lá.", en: "What you do there." },
    },
    {
      when: "2021 — 2024",
      title: { pt: "TODO: Cargo anterior @ Empresa", en: "TODO: Previous role @ Company" },
      text: { pt: "Principal conquista.", en: "Main achievement." },
    },
  ] satisfies { when: string; title: Localized; text: Localized }[],
  /** Links de contato. Deixe vazio para esconder. */
  contacts: {
    github: "https://github.com/", // TODO: seu usuário
    linkedin: "https://www.linkedin.com/", // TODO: seu perfil
    email: "", // TODO: ex. "voce@email.com"
  },
  /** Caminho do currículo em /public (ex.: "/cv.pdf"). Vazio esconde o botão. */
  cv: "",
};

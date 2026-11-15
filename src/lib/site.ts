import type { Metadata } from "next";
import { locales } from "@/lib/i18n";

/**
 * URL absoluta do site (única fonte). Ordem:
 * NEXT_PUBLIC_SITE_URL → domínio canônico (https://bragademenezes.com).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://bragademenezes.com"
).replace(/\/$/, "");

import { profile } from "@/content/profile";

/** URL absoluta para um caminho do site. */
export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

/** Pessoa (schema.org) reaproveitada na home e como autor dos projetos. */
export const personJsonLd = (lang: "pt" | "en") => ({
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: profile.name,
  alternateName: profile.cvName,
  jobTitle: profile.role[lang],
  url: `${siteUrl}/${lang}`,
  image: absoluteUrl(profile.avatar),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  worksFor: { "@type": "Organization", name: "Stone" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Centro Universitário União das Américas",
  },
  ...(profile.contacts.email && { email: profile.contacts.email }),
  ...(profile.contacts.whatsapp && { telephone: `+${profile.contacts.whatsapp}` }),
  sameAs: [profile.contacts.github, profile.contacts.linkedin].filter(Boolean),
  knowsAbout: profile.skills.flatMap((g) => g.items.map((i) => i[lang])),
});

/**
 * canonical + hreflang de uma página que existe nos dois idiomas.
 * `path` é o caminho sem o prefixo de idioma ("" para a home, "/projects/x").
 */
export function alternatesFor(lang: string, path = ""): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      // Sem prefixo: o proxy escolhe o idioma pelo navegador.
      "x-default": path || "/",
    },
  };
}

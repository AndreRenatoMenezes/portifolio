import type { Metadata } from "next";
import { locales } from "@/lib/i18n";

/**
 * URL absoluta do site (única fonte). Ordem:
 * NEXT_PUBLIC_SITE_URL → URL de produção da Vercel → localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000"
).replace(/\/$/, "");

import { profile } from "@/content/profile";

/** Pessoa (schema.org) reaproveitada na home e como autor dos projetos. */
export const personJsonLd = (lang: "pt" | "en") => ({
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: profile.name,
  jobTitle: profile.role[lang],
  url: `${siteUrl}/${lang}`,
  address: { "@type": "PostalAddress", addressLocality: profile.home[lang] },
  ...(profile.contacts.email && { email: profile.contacts.email }),
  ...(profile.contacts.whatsapp && { telephone: `+${profile.contacts.whatsapp}` }),
  sameAs: [profile.contacts.github, profile.contacts.linkedin].filter(Boolean),
  knowsAbout: profile.skills,
});

/** URL absoluta para um caminho do site. */
export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

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

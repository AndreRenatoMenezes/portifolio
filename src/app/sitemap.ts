import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

/** Uma entrada por idioma para cada página, com as alternativas de idioma. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projects.map((p) => `/projects/${p.slug}`), "/privacy"];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: absoluteUrl(`/${lang}${path}`),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/privacy" ? 0.3 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}${path}`)])),
      },
    })),
  );
}

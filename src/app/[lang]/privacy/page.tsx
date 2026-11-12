import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";
import { privacy, privacyUpdated } from "@/content/privacy";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang).privacy;
  return { title: dict.metaTitle, description: dict.metaDescription, alternates: alternatesFor(lang, "/privacy") };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).privacy;
  const doc = privacy[lang];
  const fill = (text: string) => text.replaceAll("{email}", profile.contacts.email);
  const updated = new Date(`${privacyUpdated}T12:00:00Z`).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="section container prose">
      <h1 className="section-title">{doc.title}</h1>
      <p className="prose-updated">
        {dict.updated} <time dateTime={privacyUpdated}>{updated}</time>
      </p>
      <p className="prose-intro">{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.heading}>
          <h2 className="subhead">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p}>{fill(p)}</p>
          ))}
        </section>
      ))}
    </article>
  );
}

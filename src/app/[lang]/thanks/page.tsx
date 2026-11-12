import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackOnMount } from "@/components/Analytics";
import { ItemIconSvg } from "@/components/icons/ItemIcons";
import { getDictionary, hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/thanks">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).thanks.metaTitle, robots: { index: false, follow: true } };
}

/** Página de obrigado depois do formulário (fora do sitemap, sem indexação). */
export default async function ThanksPage({ params }: PageProps<"/[lang]/thanks">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang).thanks;

  return (
    <section className="section container thanks">
      <TrackOnMount name="generate_lead" onlyIfQuery="sent" />
      <div className="item-get-hero" aria-hidden="true">
        <span className="item-get-rays" />
        <span className="item-get-icon">
          <ItemIconSvg name="letter" size={72} />
        </span>
      </div>
      <p className="item-get-kicker">{dict.kicker}</p>
      <h1 className="section-title">{dict.title}</h1>
      <p>{dict.text}</p>
      <Link className="btn btn-primary" href={`/${lang}`}>
        {dict.back}
      </Link>
    </section>
  );
}

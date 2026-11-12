import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { getDictionary, hasLocale } from "@/lib/i18n";

/** 404 dentro do layout: a floresta que dá voltas. Server Component — nenhum dicionário vai para o cliente. */
export default async function NotFound() {
  const raw = await rootLang();
  const lang = hasLocale(raw) ? raw : "pt";
  const dict = getDictionary(lang).notFound;

  return (
    <section className="section container lost">
      <div className="lost-woods" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="lost-tree" style={{ animationDelay: `${i * -1.1}s` }} />
        ))}
      </div>
      <p className="lost-code">404</p>
      <h1 className="section-title">{dict.title}</h1>
      <p>{dict.text}</p>
      <Link className="btn btn-primary" href={`/${lang}`}>
        {dict.back}
      </Link>
    </section>
  );
}

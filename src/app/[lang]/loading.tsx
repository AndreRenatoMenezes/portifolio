import { lang as rootLang } from "next/root-params";
import { getDictionary, hasLocale } from "@/lib/i18n";

/** Aviso de carregamento entre páginas: a fada esperando. */
export default async function Loading() {
  const raw = await rootLang();
  const dict = getDictionary(hasLocale(raw) ? raw : "pt");
  return (
    <div className="page-loading" role="status">
      <span className="loading-orb" aria-hidden="true" />
      <p>{dict.loading.text}</p>
    </div>
  );
}

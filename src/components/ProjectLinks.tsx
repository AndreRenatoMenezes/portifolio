import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  slug: string;
  title?: string;
  links: { demo?: string; github?: string };
  isPrivate?: boolean;
  liveLabel: string;
  codeLabel: string;
  askDemoLabel: string;
  privateTitle: string;
  moreLabel?: string;
  showDetails?: boolean;
  onAction?: () => void;
};

/**
 * Links reais de ação de um projeto (ao vivo, código, pedir demonstração, ver detalhes).
 * Usado nos cartões do modo direto, no painel/modal do inventário e na página do projeto.
 */
export function ProjectLinks({
  lang,
  slug,
  title,
  links,
  isPrivate,
  liveLabel,
  codeLabel,
  askDemoLabel,
  privateTitle,
  moreLabel,
  showDetails = false,
  onAction,
}: Props) {
  return (
    <div className="btn-row project-links">
      {links.demo && (
        <a className="btn btn-primary" href={links.demo} target="_blank" rel="noreferrer">
          {liveLabel} ↗
        </a>
      )}
      {links.github && (
        <a className="btn" href={links.github} target="_blank" rel="noreferrer">
          {codeLabel} ↗
        </a>
      )}
      {isPrivate && (
        <a className="btn" href={`/${lang}#contact`} onClick={onAction} title={privateTitle}>
          🔒 {askDemoLabel}
        </a>
      )}
      {showDetails && moreLabel && (
        <Link
          className="btn"
          href={`/${lang}/projects/${slug}`}
          aria-label={title ? `${moreLabel} — ${title}` : undefined}
        >
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}

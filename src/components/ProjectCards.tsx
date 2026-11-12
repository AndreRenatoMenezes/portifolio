import Image from "next/image";
import Link from "next/link";
import type { InventoryItem } from "@/components/Inventory";
import { ProjectLinks } from "@/components/ProjectLinks";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  items: InventoryItem[];
  projectDict: Dictionary["project"];
  modalDict: Dictionary["modal"];
};

/**
 * Grade de cartões completos para o modo direto (Server Component, sem estado cliente).
 * Exibe todos os 8 projetos com papel, resultado, métricas, stack, ano e links reais.
 */
export function ProjectCards({ lang, items, projectDict, modalDict }: Props) {
  return (
    <ul className="project-cards" data-mode-only="direct">
      {items.map((item, index) => (
        <li key={item.slug} className="project-card-item">
          <article className="project-card dialog-frame">
            {item.cover && (
              <div className="project-card-media">
                <Image
                  className="project-card-cover"
                  src={item.cover.src}
                  alt={item.cover.alt}
                  width={item.cover.width}
                  height={item.cover.height}
                  preload={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 860px) 92vw, 480px"
                  unoptimized={item.cover.src.endsWith(".svg")}
                />
              </div>
            )}
            <div className="project-card-body">
              <p className="item-panel-label">
                {item.kind} · <span className="project-card-year">{item.year}</span>
              </p>
              <h3 className="project-card-title">
                <Link href={`/${lang}/projects/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="project-card-summary">{item.summary}</p>
              <dl className="project-role-outcome">
                <div>
                  <dt>{projectDict.role}</dt>
                  <dd>{item.role}</dd>
                </div>
                <div>
                  <dt>{projectDict.outcome}</dt>
                  <dd>{item.outcome}</dd>
                </div>
              </dl>
              <dl className="item-stats">
                {item.stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="tags">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ProjectLinks
                lang={lang}
                slug={item.slug}
                title={item.title}
                links={item.links}
                isPrivate={item.private}
                liveLabel={projectDict.live}
                codeLabel={projectDict.code}
                askDemoLabel={modalDict.askDemo}
                privateTitle={modalDict.private}
                moreLabel={modalDict.more}
                showDetails
              />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

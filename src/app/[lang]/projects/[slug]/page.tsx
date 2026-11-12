import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { ItemIconSvg } from "@/components/icons/ItemIcons";
import { JsonLd } from "@/components/JsonLd";
import { ModeText } from "@/components/ModeText";
import { ProjectLinks } from "@/components/ProjectLinks";
import { getProject, projects } from "@/content/projects";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { absoluteUrl, alternatesFor, personJsonLd } from "@/lib/site";
import "../../../projects.css";

export const dynamicParams = false;
export const generateStaticParams = () =>
  locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return {
    title: project.title[lang],
    description: project.summary[lang],
    alternates: alternatesFor(lang, `/projects/${slug}`),
    openGraph: {
      type: "article",
      url: `/${lang}/projects/${slug}`,
      title: project.title[lang],
      description: project.summary[lang],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) notFound();
  const dict = getDictionary(lang);
  const paragraphs = (project.description?.[lang] ?? project.summary[lang]).split(/\n\s*\n/);

  return (
    <article className="section container project">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: project.title[lang],
          description: project.summary[lang],
          url: absoluteUrl(`/${lang}/projects/${project.slug}`),
          inLanguage: lang === "pt" ? "pt-BR" : "en",
          dateCreated: String(project.year),
          keywords: project.tags.join(", "),
          programmingLanguage: project.tags,
          ...(project.links.github && !project.private ? { codeRepository: project.links.github } : {}),
          author: personJsonLd(lang),
        }}
      />
      <Link href={`/${lang}#inventory`} className="back-link">
        ← <ModeText direct={dict.direct.project.back} adventure={dict.project.back} />
      </Link>

      <header className="project-header">
        <span className="project-icon dialog-frame">
          <ItemIconSvg name={project.item} size={64} />
        </span>
        <div>
          <p className="item-panel-label">{project.kind[lang]}</p>
          <h1 className="section-title">{project.title[lang]}</h1>
          <p className="project-summary">{project.summary[lang]}</p>
          <dl className="project-role-outcome">
            <div>
              <dt>{dict.project.role}</dt>
              <dd>{project.role[lang]}</dd>
            </div>
            <div>
              <dt>{dict.project.outcome}</dt>
              <dd>{project.outcome[lang]}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="project-body">
        <div className="project-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="project-meta dialog-frame">
          <dl className="item-stats">
            {project.stats.map((s) => (
              <div key={s.label.en}>
                <dt>{s.label[lang]}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <dl>
            <dt>{dict.project.year}</dt>
            <dd>{project.year}</dd>
            <dt>
              <ModeText direct={dict.direct.project.stack} adventure={dict.project.stack} />
            </dt>
            <dd>
              <ul className="tags">
                {project.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </dl>
          <ProjectLinks
            lang={lang}
            slug={project.slug}
            title={project.title[lang]}
            links={project.links}
            isPrivate={project.private}
            liveLabel={dict.project.live}
            codeLabel={dict.project.code}
            askDemoLabel={dict.modal.askDemo}
            privateTitle={dict.modal.private}
          />
          {project.private && (
            <p className="private-note">
              🔒 {dict.project.private}
            </p>
          )}
        </aside>
      </div>

      {project.images.length > 0 && (
        <section aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="subhead">
            {dict.project.gallery}
          </h2>
          <Gallery
            images={project.images.map((img) => ({ ...img, alt: img.alt[lang] }))}
            dict={dict.project}
            closeLabel={dict.modal.close}
          />
        </section>
      )}
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/Gallery";
import { ItemIconSvg } from "@/components/icons/ItemIcons";
import { getProject, projects } from "@/content/projects";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";

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
    alternates: { languages: { pt: `/pt/projects/${slug}`, en: `/en/projects/${slug}` } },
    openGraph: { images: project.images[0]?.src.endsWith(".svg") ? undefined : project.images[0]?.src },
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
      <Link href={`/${lang}#inventory`} className="back-link">
        ← {dict.project.back}
      </Link>

      <header className="project-header">
        <span className="project-icon dialog-frame">
          <ItemIconSvg name={project.item} size={64} />
        </span>
        <div>
          <h1 className="section-title">{project.title[lang]}</h1>
          <p className="project-summary">{project.summary[lang]}</p>
        </div>
      </header>

      <div className="project-body">
        <div className="project-text">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside className="project-meta dialog-frame">
          <dl>
            <dt>{dict.project.year}</dt>
            <dd>{project.year}</dd>
            <dt>{dict.project.stack}</dt>
            <dd>
              <ul className="tags">
                {project.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </dl>
          <div className="btn-row">
            {project.links.demo && (
              <a className="btn btn-primary" href={project.links.demo} target="_blank" rel="noreferrer">
                {dict.modal.demo} ↗
              </a>
            )}
            {project.links.github && (
              <a className="btn" href={project.links.github} target="_blank" rel="noreferrer">
                {dict.modal.github} ↗
              </a>
            )}
          </div>
        </aside>
      </div>

      {project.images.length > 0 && (
        <section aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="subhead">
            {dict.project.gallery}
          </h2>
          <Gallery
            images={project.images.map((img) => ({ src: img.src, alt: img.alt[lang] }))}
            dict={dict.project}
            closeLabel={dict.modal.close}
          />
        </section>
      )}
    </article>
  );
}

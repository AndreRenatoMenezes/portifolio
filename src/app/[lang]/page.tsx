import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { DialogBox } from "@/components/DialogBox";
import { Gem } from "@/components/Gem";
import { HeroScene } from "@/components/HeroScene";
import { Inventory, type InventoryItem } from "@/components/Inventory";
import { JsonLd } from "@/components/JsonLd";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { whatsappUrl } from "@/lib/contact";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { personJsonLd } from "@/lib/site";
import "../projects.css";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const gem = { label: dict.gems.collect, foundText: dict.gems.found, allText: dict.gems.all };

  const items: InventoryItem[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title[lang],
    kind: p.kind[lang],
    role: p.role[lang],
    outcome: p.outcome[lang],
    summary: p.summary[lang],
    item: p.item,
    icon: p.icon,
    stats: p.stats.map((s) => ({ value: s.value, label: s.label[lang] })),
    private: p.private,
    tags: p.tags,
    year: p.year,
    cover: p.images[0] && { ...p.images[0], alt: p.images[0].alt[lang] },
    links: p.links,
  }));

  const contacts = [
    profile.contacts.github && { label: "GitHub", href: profile.contacts.github },
    profile.contacts.linkedin && { label: "LinkedIn", href: profile.contacts.linkedin },
    profile.contacts.email && { label: "E-mail", href: `mailto:${profile.contacts.email}` },
    whatsappUrl(dict.contact.whatsappText) && { label: "WhatsApp", href: whatsappUrl(dict.contact.whatsappText)! },
  ].filter(Boolean) as { label: string; href: string }[];
  const channel = (label: string) => label.toLowerCase().replace(/[^a-z]/g, "");

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...personJsonLd(lang) }} />
      <section className="hero">
        <HeroScene />
        <Gem id="hero" {...gem} className="gem-hero" />
        <div className="container hero-inner">
          <h1 className="sr-only">
            {profile.name} — {profile.role[lang]}
          </h1>
          <DialogBox
            lines={dict.hero.lines}
            nextLabel={dict.hero.next}
            restartLabel={dict.hero.restart}
            continueLabel={dict.hero.continue}
          />
          <div className="btn-row hero-cta">
            <a className="btn btn-primary" href="#contact">
              ✉ {dict.hero.ctaContact}
            </a>
            <a className="btn btn-ghost" href="#inventory">
              {dict.hero.cta} ↓
            </a>
          </div>
        </div>
      </section>

      <section id="inventory" className="section container" aria-labelledby="inventory-title">
        <header className="section-header">
          <h2 id="inventory-title" className="section-title">
            {dict.inventory.title} · {dict.sections.projects}
          </h2>
          <p>
            {dict.inventory.subtitle}
          </p>
          <Gem id="inventory" {...gem} className="gem-inline" />
        </header>
        <Inventory
          lang={lang}
          items={items}
          dict={dict.inventory}
          modalDict={dict.modal}
          projectDict={dict.project}
        />
      </section>

      <section id="about" className="section container" aria-labelledby="about-title">
        <header className="section-header">
          <h2 id="about-title" className="section-title">
            {dict.about.title} · {dict.sections.about}
          </h2>
          <p>
            {dict.about.subtitle}
          </p>
        </header>
        <div className="about-grid">
          <div className="hero-card dialog-frame">
            <div className="avatar avatar-photo">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={800}
                height={1000}
                sizes="(min-width: 900px) 240px, 200px"
              />
            </div>
            <p className="hero-card-name">{profile.name}</p>
            <p className="hero-card-headline">{profile.headline[lang]}</p>
            <dl className="stats">
              <div>
                <dt>
                  {dict.about.class}
                </dt>
                <dd>{profile.role[lang]}</dd>
              </div>
              <div>
                <dt>
                  {dict.about.home}
                </dt>
                <dd>{profile.home[lang]}</dd>
              </div>
              <div>
                <dt>
                  {dict.about.experience}
                </dt>
                <dd>{profile.experience[lang]}</dd>
              </div>
              <div>
                <dt>
                  {dict.about.degree}
                </dt>
                <dd>{profile.education[0].title[lang]}</dd>
              </div>
            </dl>
            <p>{profile.bio[lang]}</p>
            <a
              className="btn btn-primary cv-download"
              href={profile.cv[lang]}
              download
              data-track="cv_download"
              data-track-channel={lang}
            >
              {dict.about.cv}
            </a>
            <Gem id="about" {...gem} className="gem-corner" />
          </div>

          <div className="about-side">
            <h3 className="subhead">
              {dict.about.questLog}
            </h3>
            <ol className="quests">
              {profile.quests.map((q) => (
                <li key={`${q.when.en}-${q.title.en}`}>
                  <span className="quest-when">{q.when[lang]}</span>
                  <strong>
                    {q.title[lang]}
                    {q.org ? ` · ${q.org}` : ""}
                  </strong>
                  {q.detail && <span className="quest-detail">{q.detail[lang]}</span>}
                  <ul className="quest-points">
                    {q.points.map((point) => (
                      <li key={point.en}>{point[lang]}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <h3 className="subhead">
              {dict.about.scrolls}
            </h3>
            <ul className="scrolls">
              {profile.education.map((edu) => (
                <li key={edu.title.en}>
                  <strong>{edu.title[lang]}</strong>
                  <span>
                    {edu.org} · {edu.when[lang]}
                  </span>
                </li>
              ))}
              {profile.certifications.map((cert) => (
                <li key={cert.title}>
                  <strong>
                    {cert.title} — {cert.org}
                  </strong>
                </li>
              ))}
            </ul>
            <h3 className="subhead">
              {dict.about.equipment}
            </h3>
            <div className="equipment-groups">
              {profile.skills.map((group) => (
                <div key={group.group.en}>
                  <h4 className="equipment-group-title">{group.group[lang]}</h4>
                  <ul className="equipment">
                    {group.items.map((item) => (
                      <li key={item.en} className="dialog-frame">
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section container" aria-labelledby="contact-title">
        <header className="section-header">
          <h2 id="contact-title" className="section-title">
            {dict.contact.title} · {dict.sections.contact}
          </h2>
          <p>
            {dict.contact.text}
          </p>
        </header>
        <ul className="signposts">
          {contacts.map((c) => (
            <li key={c.label}>
              <a
                className="signpost"
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-track="contact_click"
                data-track-channel={channel(c.label)}
              >
                {c.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="signpost"
              href={profile.cv[lang]}
              download
              data-track="cv_download"
              data-track-channel={lang}
            >
              {dict.contact.cv}
            </a>
          </li>
          <li className="signpost-gem">
            <Gem id="contact" {...gem} />
          </li>
        </ul>
        <div id="contact-form" className="contact-form-wrap">
          <ContactForm lang={lang} dict={dict.form} title={dict.contact.formTitle} />
        </div>
      </section>
    </>
  );
}

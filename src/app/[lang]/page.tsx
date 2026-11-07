import { notFound } from "next/navigation";
import { DialogBox } from "@/components/DialogBox";
import { Gem } from "@/components/Gem";
import { HeroScene } from "@/components/HeroScene";
import { Inventory, type InventoryItem } from "@/components/Inventory";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { getDictionary, hasLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const gem = { label: dict.gems.collect, foundText: dict.gems.found, allText: dict.gems.all };

  const items: InventoryItem[] = [...projects]
    .sort((a, b) => b.year - a.year)
    .map((p) => ({
      slug: p.slug,
      title: p.title[lang],
      summary: p.summary[lang],
      item: p.item,
      tags: p.tags,
      year: p.year,
      cover: p.images[0] && { src: p.images[0].src, alt: p.images[0].alt[lang] },
      links: p.links,
    }));

  const contacts = [
    profile.contacts.github && { label: "GitHub", href: profile.contacts.github },
    profile.contacts.linkedin && { label: "LinkedIn", href: profile.contacts.linkedin },
    profile.contacts.email && { label: "E-mail", href: `mailto:${profile.contacts.email}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <section className="hero">
        <HeroScene />
        <Gem id="hero" {...gem} className="gem-hero" />
        <div className="container hero-inner">
          <h1 className="hero-title">
            {profile.name}
            <span className="hero-role">{profile.role[lang]}</span>
          </h1>
          <DialogBox
            speaker={dict.hero.speaker}
            lines={dict.hero.lines}
            nextLabel={dict.hero.next}
            restartLabel={dict.hero.restart}
          />
          <a className="btn btn-primary hero-cta" href="#inventory">
            {dict.hero.cta} ↓
          </a>
        </div>
      </section>

      <section id="inventory" className="section container" aria-labelledby="inventory-title">
        <header className="section-header">
          <h2 id="inventory-title" className="section-title">
            {dict.inventory.title}
          </h2>
          <p>{dict.inventory.subtitle}</p>
          <Gem id="inventory" {...gem} className="gem-inline" />
        </header>
        <Inventory lang={lang} items={items} dict={dict.inventory} modalDict={dict.modal} />
      </section>

      <section id="about" className="section container" aria-labelledby="about-title">
        <header className="section-header">
          <h2 id="about-title" className="section-title">
            {dict.about.title}
          </h2>
          <p>{dict.about.subtitle}</p>
        </header>
        <div className="about-grid">
          <div className="hero-card dialog-frame">
            <div className="avatar" aria-hidden={!profile.avatar}>
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                profile.initials
              )}
            </div>
            <dl className="stats">
              <div>
                <dt>{dict.about.class}</dt>
                <dd>{profile.role[lang]}</dd>
              </div>
              <div>
                <dt>{dict.about.home}</dt>
                <dd>{profile.home[lang]}</dd>
              </div>
            </dl>
            <p>{profile.bio[lang]}</p>
            <Gem id="about" {...gem} className="gem-corner" />
          </div>

          <div className="about-side">
            <h3 className="subhead">{dict.about.equipment}</h3>
            <ul className="equipment">
              {profile.skills.map((s) => (
                <li key={s} className="dialog-frame">
                  {s}
                </li>
              ))}
            </ul>
            <h3 className="subhead">{dict.about.questLog}</h3>
            <ol className="quests">
              {profile.quests.map((q) => (
                <li key={q.when + q.title.en}>
                  <span className="quest-when">{q.when}</span>
                  <strong>{q.title[lang]}</strong>
                  <span>{q.text[lang]}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="contact" className="section container" aria-labelledby="contact-title">
        <header className="section-header">
          <h2 id="contact-title" className="section-title">
            {dict.contact.title}
          </h2>
          <p>{dict.contact.text}</p>
        </header>
        <ul className="signposts">
          {contacts.map((c) => (
            <li key={c.label}>
              <a className="signpost" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                {c.label}
              </a>
            </li>
          ))}
          {profile.cv && (
            <li>
              <a className="signpost" href={profile.cv} download>
                {dict.contact.cv}
              </a>
            </li>
          )}
          <li className="signpost-gem">
            <Gem id="contact" {...gem} />
          </li>
        </ul>
      </section>
    </>
  );
}

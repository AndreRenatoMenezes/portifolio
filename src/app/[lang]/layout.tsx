import type { Metadata } from "next";
import { Cinzel, Nunito } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Controls } from "@/components/Controls";
import { MelodyListener, MessageToast, Starfall } from "@/components/Effects";
import { Fairy } from "@/components/Fairy";
import { Gem } from "@/components/Gem";
import { Hud } from "@/components/Hud";
import { InlineScript } from "@/components/InlineScript";
import { profile } from "@/content/profile";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import "../globals.css";

const display = Cinzel({ variable: "--font-display", subsets: ["latin"], weight: ["600", "800"] });
const body = Nunito({ variable: "--font-body", subsets: ["latin"] });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: dict.meta.title, template: `%s · ${profile.name}` },
    description: dict.meta.description,
    alternates: { languages: { pt: "/pt", en: "/en" } },
    openGraph: { title: dict.meta.title, description: dict.meta.description, locale: lang === "pt" ? "pt_BR" : "en_US" },
  };
}

/** Aplica o tema antes da primeira pintura: salvo pelo visitante ou pela hora local. */
const themeScript = `(function(){var t;try{t=localStorage.getItem("portfolio-theme")}catch(e){}if(t!=="day"&&t!=="night"&&t!=="temple"){var h=new Date().getHours();t=h>=6&&h<18?"day":"night"}document.documentElement.dataset.theme=t})()`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang === "pt" ? "pt-BR" : "en"} data-theme="day" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {dict.nav.skip}
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href={`/${lang}`} className="logo">
              <span className="logo-mark" aria-hidden="true">◆</span> {profile.name}
            </Link>
            <nav aria-label="Principal" className="main-nav">
              <a href={`/${lang}#inventory`}>{dict.nav.projects}</a>
              <a href={`/${lang}#about`}>{dict.nav.about}</a>
              <a href={`/${lang}#contact`}>{dict.nav.contact}</a>
            </nav>
            <Hud dict={dict.hud} />
            <Controls lang={lang} dict={dict.controls} />
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <p>
              © {new Date().getFullYear()} {profile.name}. {dict.footer.made}
            </p>
            <p className="melody-hint">
              {dict.footer.melody}
              <Gem id="footer" label={dict.gems.collect} foundText={dict.gems.found} allText={dict.gems.all} className="gem-inline" />
            </p>
          </div>
        </footer>

        <Fairy label={dict.fairy.label} tips={dict.fairy.tips} />
        <MessageToast />
        <MelodyListener successText={dict.melody.success} />
        <Starfall />
      </body>
    </html>
  );
}

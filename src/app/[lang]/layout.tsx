import type { Metadata, Viewport } from "next";
import { Cinzel, Nunito } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics } from "@/components/Analytics";
import { Controls } from "@/components/Controls";
import { CookieNotice, CookiePrefsLink } from "@/components/CookieNotice";
import { MelodyListener, MessageToast, Starfall } from "@/components/Effects";
import { Fairy } from "@/components/Fairy";
import { Gem } from "@/components/Gem";
import { Hud } from "@/components/Hud";
import { InlineScript } from "@/components/InlineScript";
import { MobileContactBar } from "@/components/MobileContactBar";
import { NavProgress } from "@/components/NavProgress";
import { profile } from "@/content/profile";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/contact";
import { alternatesFor, siteUrl } from "@/lib/site";
import "../globals.css";

const display = Cinzel({ variable: "--font-display", subsets: ["latin"], weight: ["800"] });
const body = Nunito({ variable: "--font-body", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1dc" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1430" },
  ],
};

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: dict.meta.title, template: `%s · ${profile.name}` },
    description: dict.meta.description,
    metadataBase: new URL(siteUrl),
    alternates: alternatesFor(lang),
    openGraph: {
      type: "website",
      siteName: profile.name,
      url: `/${lang}`,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "pt" ? "pt_BR" : "en_US",
    },
    twitter: { card: "summary_large_image" },
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
            <nav aria-label={dict.nav.label} className="main-nav">
              <a href={`/${lang}#inventory`}>{dict.nav.projects}</a>
              <a href={`/${lang}#about`}>{dict.nav.about}</a>
              <a href={`/${lang}#contact`} className="btn btn-primary nav-cta">
                <span className="cta-long">{dict.nav.cta}</span>
                <span className="cta-short">{dict.nav.contact}</span>
              </a>
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
            <p className="footer-links">
              <Link href={`/${lang}/privacy`}>{dict.footer.privacy}</Link>
              <CookiePrefsLink label={dict.footer.cookiePrefs} />
            </p>
            <p className="melody-hint">
              {dict.footer.melody}
              <Gem id="footer" label={dict.gems.collect} foundText={dict.gems.found} allText={dict.gems.all} className="gem-inline" />
            </p>
          </div>
        </footer>

        <MobileContactBar lang={lang} dict={dict.contact} whatsapp={whatsappUrl(dict.contact.whatsappText)} />
        <Fairy label={dict.fairy.label} tips={dict.fairy.tips} />
        <MessageToast />
        <NavProgress label={dict.loading.text} />
        <MelodyListener successText={dict.melody.success} />
        <CookieNotice lang={lang} dict={dict.cookies} />
        <Analytics />
        {/* Métricas agregadas da Vercel, sem cookies de terceiros; independe do consentimento do GA4. */}
        <VercelAnalytics />
        <Starfall />
      </body>
    </html>
  );
}

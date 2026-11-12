"use client";

import Link from "next/link";
import { GA_ID } from "@/lib/analytics";
import type { Dictionary, Locale } from "@/lib/i18n";
import { reopenConsent, setConsent, usePrefs } from "@/lib/store";

/** Aviso de cookies: só existe se houver GA configurado e o visitante ainda não escolheu. */
export function CookieNotice({ lang, dict }: { lang: Locale; dict: Dictionary["cookies"] }) {
  const { consent } = usePrefs();
  if (!GA_ID || consent !== null) return null; // undefined = ainda hidratando; não pisca

  return (
    <section className="cookie-notice dialog-frame" role="region" aria-label={dict.label}>
      <p>
        {dict.text}{" "}
        <Link href={`/${lang}/privacy`}>{dict.policy}</Link>
      </p>
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setConsent("granted")}>
          {dict.accept}
        </button>
        <button type="button" className="btn" onClick={() => setConsent("denied")}>
          {dict.reject}
        </button>
      </div>
    </section>
  );
}

/** Link "Preferências de cookies" do rodapé (só com GA configurado). */
export function CookiePrefsLink({ label }: { label: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" className="link-btn" onClick={reopenConsent}>
      {label}
    </button>
  );
}

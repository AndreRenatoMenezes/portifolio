"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cycleTheme, readPrefs, toggleFairy, toggleSound, usePrefs } from "@/lib/store";

export function Controls({ lang, dict }: { lang: Locale; dict: Dictionary["controls"] }) {
  const prefs = usePrefs();
  const pathname = usePathname();
  const other: Locale = lang === "pt" ? "en" : "pt";
  // Trocar de idioma remonta o <html> (layout raiz por idioma): reaplica o tema atual.
  useEffect(() => {
    const current = readPrefs();
    document.documentElement.dataset.theme = current.theme;
  }, [lang]);

  const otherPath = pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${other}`);

  const themeLabel =
    prefs.theme === "day" ? dict.themeDay : prefs.theme === "night" ? dict.themeNight : dict.themeTemple;

  return (
    <div className="controls">
      <Link href={otherPath} className="icon-btn lang-btn" hrefLang={other} aria-label={dict.switchTo} title={dict.switchTo}>
        {other.toUpperCase()}
      </Link>
      <button type="button" className="icon-btn" onClick={cycleTheme} aria-label={themeLabel} title={themeLabel}>
        <span aria-hidden="true">{prefs.theme === "day" ? "☾" : prefs.theme === "night" ? "☀" : "✦"}</span>
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleSound}
        aria-pressed={prefs.sound}
        aria-label={prefs.sound ? dict.soundOn : dict.soundOff}
        title={prefs.sound ? dict.soundOn : dict.soundOff}
      >
        <span aria-hidden="true">{prefs.sound ? "♪" : "♪̸"}</span>
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleFairy}
        aria-pressed={prefs.fairy}
        aria-label={prefs.fairy ? dict.fairyOn : dict.fairyOff}
        title={prefs.fairy ? dict.fairyOn : dict.fairyOff}
      >
        <span aria-hidden="true" className={prefs.fairy ? "fairy-dot" : "fairy-dot off"} />
      </button>
    </div>
  );
}

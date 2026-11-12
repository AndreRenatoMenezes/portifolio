"use client";

import { ModeText } from "@/components/ModeText";
import { track } from "@/lib/analytics";
import type { Dictionary } from "@/lib/i18n";
import { setMode, usePrefs, type Mode } from "@/lib/store";

type Props = {
  dict: Dictionary["mode"];
  variant?: "hero" | "header";
};

/**
 * Alternador entre os modos direto e aventura.
 * `aria-pressed` reflete o modo aventura (CA-11).
 */
export function ModeToggle({ dict, variant = "header" }: Props) {
  const { mode } = usePrefs();
  const isAdventure = mode === "adventure";

  const onToggle = () => {
    const next: Mode = isAdventure ? "direct" : "adventure";
    setMode(next);
    track("mode_switch", { to: next });
  };

  const button = (
    <button
      type="button"
      className={`mode-toggle mode-toggle-${variant}`}
      aria-pressed={isAdventure}
      onClick={onToggle}
    >
      <ModeText direct={dict.toAdventure} adventure={dict.toDirect} />
    </button>
  );

  if (variant === "hero") {
    return (
      <div className="mode-toggle-hero-wrap">
        {button}
        <p className="mode-toggle-hint" data-mode-only="direct">
          {dict.hint}
        </p>
      </div>
    );
  }

  return button;
}

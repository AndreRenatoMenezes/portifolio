"use client";

import type { Dictionary } from "@/lib/i18n";
import { GEM_IDS, usePrefs } from "@/lib/store";

function Heart() {
  return (
    <svg viewBox="0 0 16 14" width="18" height="16" aria-hidden="true">
      <path
        d="M8 13 1.6 6.8A3.7 3.7 0 0 1 8 2.4a3.7 3.7 0 0 1 6.4 4.4z"
        fill="var(--heart)"
        stroke="var(--heart-stroke)"
        strokeWidth="1.2"
      />
      <path d="M4 4.2c.6-.6 1.4-.6 2 0" stroke="#fff" strokeWidth="1" fill="none" opacity=".7" />
    </svg>
  );
}

export function GemShape({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 16" width={size * 0.75} height={size} aria-hidden="true">
      <path d="M6 0 12 5v6l-6 5-6-5V5z" fill="var(--gem)" stroke="var(--gem-stroke)" strokeWidth="1" />
      <path d="M6 0v16M0 5l6 3 6-3" stroke="var(--gem-stroke)" strokeWidth=".6" fill="none" opacity=".6" />
    </svg>
  );
}

export function Hud({ dict }: { dict: Dictionary["hud"] }) {
  const { gems } = usePrefs();
  return (
    <div className="hud" data-mode-only="adventure">
      <span className="hud-hearts" role="img" aria-label={dict.hearts}>
        <Heart />
        <Heart />
        <Heart />
      </span>
      <span className="hud-gems" title={dict.gems}>
        <GemShape />
        <span className="sr-only">{dict.gems}: </span>
        <span>
          {gems.length}/{GEM_IDS.length}
        </span>
      </span>
    </div>
  );
}

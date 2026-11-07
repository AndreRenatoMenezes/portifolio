"use client";

import { GemShape } from "@/components/Hud";
import { playGem } from "@/lib/sound";
import { collectGem, say, usePrefs, type GemId } from "@/lib/store";

type Props = {
  id: GemId;
  label: string;
  foundText: string;
  allText: string;
  className?: string;
};

/** Gema escondida. Some depois de coletada. */
export function Gem({ id, label, foundText, allText, className = "" }: Props) {
  const { gems } = usePrefs();
  if (gems.includes(id)) return null;

  return (
    <button
      type="button"
      className={`gem ${className}`}
      aria-label={label}
      onClick={() => {
        const result = collectGem(id);
        if (result === "dup") return;
        playGem();
        say(result === "all" ? allText : foundText);
      }}
    >
      <GemShape size={18} />
    </button>
  );
}

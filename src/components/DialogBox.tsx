"use client";

import { useEffect, useRef, useState } from "react";
import { type AvatarState, NpcAvatar } from "@/components/NpcAvatar";
import { playBlip } from "@/lib/sound";
import { usePrefs } from "@/lib/store";

type Props = {
  lines: string[];
  nextLabel: string;
  restartLabel: string;
  continueLabel: string;
};

/** Caixa de diálogo de NPC: retrato decorativo + texto "digitado" letra a letra. Clique/Enter avança. */
export function DialogBox({ lines, nextLabel, restartLabel, continueLabel }: Props) {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [gemHappy, setGemHappy] = useState(false);
  const { gems, consent } = usePrefs();
  const prevGems = useRef<number | null>(null);
  const hydrated = consent !== undefined;
  const text = lines[line];
  const done = chars >= text.length;
  const last = line === lines.length - 1;

  useEffect(() => {
    if (done) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => {
      setChars((c) => (reduce ? text.length : c + 1));
    }, 28);
    return () => window.clearInterval(id);
  }, [text, done]);

  useEffect(() => {
    if (chars > 0 && chars % 3 === 0) playBlip();
  }, [chars]);

  useEffect(() => {
    if (!hydrated) return;
    if (prevGems.current === null) {
      prevGems.current = gems.length;
      return;
    }
    if (gems.length <= prevGems.current) {
      prevGems.current = gems.length;
      return;
    }
    prevGems.current = gems.length;
    const start = window.setTimeout(() => setGemHappy(true), 0);
    const end = window.setTimeout(() => setGemHappy(false), 1600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [hydrated, gems.length]);

  const state: AvatarState = !hydrated
    ? "idle"
    : gemHappy
      ? "happy"
      : !done
        ? "talking"
        : last
          ? "happy"
          : "idle";

  const advance = () => {
    if (!done) return setChars(text.length);
    setChars(0);
    setLine(last ? 0 : line + 1);
  };

  return (
    <div className="dialog-box dialog-frame">
      <div className="npc-portrait" aria-hidden="true">
        <NpcAvatar state={state} />
      </div>
      <p className="dialog-text">
        <span aria-hidden="true">{text.slice(0, chars)}</span>
        <span className="sr-only">{text}</span>
      </p>
      <button type="button" className="dialog-next" onClick={advance} aria-label={last && done ? restartLabel : nextLabel}>
        {done && (
          <span className="dialog-prompt" aria-hidden="true">
            {last ? restartLabel : continueLabel}
            <span className="dialog-prompt-arrow">{last ? "↺" : "▼"}</span>
          </span>
        )}
      </button>
    </div>
  );
}

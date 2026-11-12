"use client";

import { useEffect, useState } from "react";
import { playBlip } from "@/lib/sound";

type Props = {
  speaker: string;
  lines: string[];
  nextLabel: string;
  restartLabel: string;
};

/** Caixa de diálogo com texto "digitado" letra a letra. Clique/Enter avança. */
export function DialogBox({ speaker, lines, nextLabel, restartLabel }: Props) {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const text = lines[line];
  const done = chars >= text.length;
  const last = line === lines.length - 1;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    const id = window.setInterval(() => {
      i = reduce ? text.length : i + 1;
      setChars(i);
      if (i % 3 === 0) playBlip();
      if (i >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [text]);

  const advance = () => {
    if (!done) return setChars(text.length);
    setChars(0);
    setLine(last ? 0 : line + 1);
  };

  return (
    <div className="dialog-box dialog-frame">
      <span className="dialog-speaker">{speaker}</span>
      <p className="dialog-text">
        <span aria-hidden="true">{text.slice(0, chars)}</span>
        <span className="sr-only">{text}</span>
      </p>
      <button type="button" className="dialog-next" onClick={advance} aria-label={last && done ? restartLabel : nextLabel}>
        {done && <span aria-hidden="true">{last ? "↺" : "▼"}</span>}
      </button>
    </div>
  );
}

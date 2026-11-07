"use client";

import { useEffect, useRef, useState } from "react";
import { playNote } from "@/lib/sound";
import { onMessage, say, STARFALL_EVENT } from "@/lib/store";

/** Caixa de mensagem no rodapé da tela (dicas da fada, gemas, segredos). */
export function MessageToast() {
  const [text, setText] = useState("");
  const [key, setKey] = useState(0);

  useEffect(() => {
    let timer = 0;
    const off = onMessage((message) => {
      setText(message);
      setKey((k) => k + 1);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setText(""), 4500);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="toast-region" aria-live="polite" role="status">
      {text && (
        <p key={key} className="toast dialog-frame">
          {text}
        </p>
      )}
    </div>
  );
}

const KEYMAP: Record<string, "up" | "down" | "left" | "right" | "a"> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  a: "a",
  A: "a",
};
/** Melodia secreta (sequência original): ↑ ↓ ← → A */
const SECRET = ["up", "down", "left", "right", "a"];

/** Ouve o "instrumento" no teclado e dispara a chuva de estrelas. */
export function MelodyListener({ successText }: { successText: string }) {
  useEffect(() => {
    let played: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable], [data-inventory], dialog")) return;
      const note = KEYMAP[e.key];
      if (!note) return;
      playNote(note);
      played = [...played, note].slice(-SECRET.length);
      if (played.join() === SECRET.join()) {
        played = [];
        say(successText);
        window.dispatchEvent(new Event(STARFALL_EVENT));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [successText]);
  return null;
}

type Star = { id: number; left: number; delay: number; size: number; duration: number };

/** Chuva de estrelas temporária. */
export function Starfall() {
  const [stars, setStars] = useState<Star[]>([]);
  const seq = useRef(0);

  useEffect(() => {
    let timer = 0;
    const start = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setStars(
        Array.from({ length: 40 }, () => ({
          id: seq.current++,
          left: Math.random() * 100,
          delay: Math.random() * 1.2,
          size: 6 + Math.random() * 10,
          duration: 1.6 + Math.random() * 1.4,
        })),
      );
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setStars([]), 4000);
    };
    window.addEventListener(STARFALL_EVENT, start);
    return () => {
      window.removeEventListener(STARFALL_EVENT, start);
      window.clearTimeout(timer);
    };
  }, []);

  if (!stars.length) return null;
  return (
    <div className="starfall" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

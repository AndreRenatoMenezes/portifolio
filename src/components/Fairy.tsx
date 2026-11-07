"use client";

import { useEffect, useRef } from "react";
import { say, usePrefs } from "@/lib/store";

const TARGETS = "a, button, [data-fairy]";

/**
 * Fada companheira: descansa no canto da tela e voa até o elemento
 * interativo sob o mouse/foco, como quem aponta "olha aqui!".
 * Com `prefers-reduced-motion`, fica parada no canto.
 */
export function Fairy({ label, tips }: { label: string; tips: string[] }) {
  const { fairy } = usePrefs();
  const ref = useRef<HTMLButtonElement>(null);
  const tipIndex = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!fairy || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const home = () => ({ x: window.innerWidth - 52, y: window.innerHeight - 60 });
    let pos = home();
    let target = home();
    let current: Element | null = null;
    let leaveTimer = 0;
    let frame = 0;
    let t = 0;
    // Passa a posicionar pelo canto superior esquerdo (o CSS padrão ancora no canto inferior direito).
    Object.assign(el.style, { left: "0px", top: "0px", right: "auto", bottom: "auto" });

    const aim = (node: Element | null) => {
      window.clearTimeout(leaveTimer);
      current = node;
    };
    const updateTarget = () => {
      if (current && current.isConnected) {
        const r = current.getBoundingClientRect();
        target = {
          x: Math.min(r.right + 6, window.innerWidth - 32),
          y: Math.min(Math.max(r.top - 22, 8), window.innerHeight - 40),
        };
      } else {
        target = home();
      }
    };

    const onOver = (e: Event) => {
      const node = (e.target as Element).closest?.(TARGETS);
      // Mouse em cima da própria fada: fica parada para poder ser clicada.
      if (node === el) return window.clearTimeout(leaveTimer);
      if (node) aim(node);
    };
    const onOut = () => {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => (current = null), 700);
    };

    const loop = () => {
      t += 0.05;
      updateTarget();
      pos = { x: pos.x + (target.x - pos.x) * 0.08, y: pos.y + (target.y - pos.y) * 0.08 };
      const bob = Math.sin(t) * 4;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y + bob}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("focusin", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusout", onOut);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(leaveTimer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusout", onOut);
      Object.assign(el.style, { transform: "", left: "", top: "", right: "", bottom: "" });
    };
  }, [fairy]);

  if (!fairy) return null;

  return (
    <button
      ref={ref}
      type="button"
      className="fairy"
      aria-label={label}
      title={label}
      onClick={() => {
        say(tips[tipIndex.current % tips.length]);
        tipIndex.current += 1;
      }}
    >
      <span className="fairy-wing left" aria-hidden="true" />
      <span className="fairy-wing right" aria-hidden="true" />
      <span className="fairy-core" aria-hidden="true" />
    </button>
  );
}

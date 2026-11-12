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

    // Acima da barra de contato do celular, quando ela existe (--contact-bar-h).
    const barHeight = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--contact-bar-h")) || 0;
    const home = () => ({ x: window.innerWidth - 52, y: window.innerHeight - 60 - barHeight() });
    let pos = home();
    let target = home();
    let current: Element | null = null;
    let leaveTimer = 0;
    let frame = 0;
    let running = false;
    // Passa a posicionar pelo canto superior esquerdo (o CSS padrão ancora no canto inferior direito).
    Object.assign(el.style, { left: "0px", top: "0px", right: "auto", bottom: "auto" });
    const place = () => (el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`);
    place();

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

    // Só anima enquanto há distância a percorrer; parada, o balanço é só CSS.
    const loop = () => {
      updateTarget();
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        pos = target;
        place();
        running = false;
        return;
      }
      pos = { x: pos.x + dx * 0.08, y: pos.y + dy * 0.08 };
      place();
      frame = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const aim = (node: Element | null) => {
      window.clearTimeout(leaveTimer);
      current = node;
      kick();
    };

    const onOver = (e: Event) => {
      const node = (e.target as Element).closest?.(TARGETS);
      // Mouse em cima da própria fada: fica parada para poder ser clicada.
      if (node === el) return window.clearTimeout(leaveTimer);
      if (!node) return;
      if (node === current) window.clearTimeout(leaveTimer); // ainda no mesmo alvo
      else aim(node);
    };
    const onOut = () => {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => aim(null), 700);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("focusin", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusout", onOut);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(leaveTimer);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusout", onOut);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
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
      <span className="fairy-body" aria-hidden="true">
        <span className="fairy-wing left" />
        <span className="fairy-wing right" />
        <span className="fairy-core" />
      </span>
    </button>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Aviso imediato de "Carregando…" ao clicar num link interno (spec 002, CA-17).
 * O `loading.tsx` só aparece quando o router já tem a fronteira de loading; isto cobre o intervalo antes.
 */
export function NavProgress({ label }: { label: string }) {
  const pathname = usePathname();
  const [loadingFrom, setLoadingFrom] = useState<string | null>(null);
  const [seenPath, setSeenPath] = useState(pathname);
  // Rota mudou: a navegação terminou (padrão do React de ajustar estado quando a entrada muda).
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setLoadingFrom(null);
  }
  const loading = loadingFrom !== null && loadingFrom === pathname;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a");
      // `data-opens-modal`: o clique simples abre o modal do inventário, não navega.
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-opens-modal")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // externo ou âncora
      // Não dá para usar `defaultPrevented`: o <Link> do Next sempre o chama para navegar no cliente.
      setLoadingFrom(location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Rede de segurança: nunca fica preso na tela.
  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoadingFrom(null), 10000);
    return () => window.clearTimeout(id);
  }, [loading]);

  return (
    <div className="nav-progress-region" role="status" aria-live="polite">
      {loading && (
        <div className="nav-progress dialog-frame">
          <span className="loading-orb small" aria-hidden="true" />
          {label}
        </div>
      )}
    </div>
  );
}

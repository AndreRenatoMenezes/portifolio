"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { disableAnalytics, GA_ID, track } from "@/lib/analytics";
import { usePrefs } from "@/lib/store";

/**
 * Google Analytics 4, carregado SÓ depois do consentimento (spec 003).
 * Sem NEXT_PUBLIC_GA_ID não renderiza nada.
 * Também escuta cliques em elementos com `data-track` (ex.: links de contato).
 */
export function Analytics() {
  const { consent } = usePrefs();
  const wasGranted = useRef(false);

  useEffect(() => {
    if (consent === "granted") {
      wasGranted.current = true;
      if (GA_ID) delete (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`];
    } else if (consent === "denied" && wasGranted.current) {
      disableAnalytics();
      wasGranted.current = false;
    }
  }, [consent]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest?.<HTMLElement>("[data-track]");
      if (!el) return;
      const { track: name, trackChannel, trackSlug } = el.dataset;
      track(name!, { ...(trackChannel && { channel: trackChannel }), ...(trackSlug && { slug: trackSlug }) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID || consent !== "granted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}

/** Dispara um evento uma vez ao montar (ex.: `generate_lead` na página de obrigado). */
export function TrackOnMount({ name, onlyIfQuery }: { name: string; onlyIfQuery?: string }) {
  useEffect(() => {
    if (onlyIfQuery && !new URLSearchParams(location.search).has(onlyIfQuery)) return;
    // O gtag pode ainda estar carregando: tenta por alguns segundos.
    let tries = 0;
    const id = window.setInterval(() => {
      if (typeof window.gtag === "function" || ++tries > 20) {
        track(name);
        window.clearInterval(id);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [name, onlyIfQuery]);
  return null;
}

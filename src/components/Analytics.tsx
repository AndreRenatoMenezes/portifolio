"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { disableAnalytics, GTM_ID, GTM_INIT, track } from "@/lib/analytics";
import { usePrefs } from "@/lib/store";

/**
 * Google Tag Manager, carregado SÓ depois do consentimento (spec 003). O GA4 roda dentro do GTM.
 * Sem NEXT_PUBLIC_GTM_ID não renderiza nada.
 * Também escuta cliques em elementos com `data-track` (ex.: links de contato).
 */
export function Analytics() {
  const { consent } = usePrefs();
  const wasGranted = useRef(false);

  // Revogação depois de aceitar nesta visita: o GTM já carregado não pode ser descarregado,
  // então disableAnalytics apaga os cookies e recarrega a página (com "denied", o GTM não carrega).
  useEffect(() => {
    if (consent === "granted") wasGranted.current = true;
    else if (consent === "denied" && wasGranted.current) disableAnalytics();
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

  if (!GTM_ID || consent !== "granted") return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {GTM_INIT}
      </Script>
      <Script id="gtm" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
    </>
  );
}

/**
 * Dispara um evento uma vez ao montar (ex.: `generate_lead` na página de obrigado).
 * O dataLayer guarda o evento até o GTM carregar, então não precisa esperar.
 */
export function TrackOnMount({ name, onlyIfQuery }: { name: string; onlyIfQuery?: string }) {
  useEffect(() => {
    if (onlyIfQuery && !new URLSearchParams(location.search).has(onlyIfQuery)) return;
    track(name);
  }, [name, onlyIfQuery]);
  return null;
}

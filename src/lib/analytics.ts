"use client";

import { readPrefs } from "@/lib/store";

/**
 * ID do contêiner do Google Tag Manager. O GA4 é configurado dentro do GTM (ACOES-PENDENTES T5).
 * Validado porque vai para um script inline: formato inválido conta como ausente.
 */
const rawId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
export const GTM_ID = /^GTM-[A-Z0-9]+$/.test(rawId) ? rawId : "";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * Início do snippet oficial do GTM (o <noscript>/iframe fica de fora: a CSP bloqueia iframes e,
 * sem JS, não há aceite). `gtag` só empurra comandos de consentimento para o dataLayer. Como o
 * GTM carrega só depois do aceite, o padrão já é analytics_storage = granted; anúncios negados.
 */
export const GTM_INIT =
  "window.dataLayer=window.dataLayer||[];" +
  "window.gtag=function(){dataLayer.push(arguments);};" +
  "gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});" +
  "dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});";

/** Envia um evento ao dataLayer (o GTM repassa ao GA4). Sem ID ou sem consentimento: não faz nada. */
export function track(name: string, params: Record<string, string> = {}) {
  if (!GTM_ID || readPrefs().consent !== "granted") return;
  (window.dataLayer ||= []).push({ event: name, ...params });
}

/**
 * Revogação: o GTM já carregado não pode ser descarregado e o GA4 dentro dele seguiria mandando
 * hits sem cookie. Então: consentimento negado (para o GA não recriar cookies), cookies `_ga*`
 * apagados e a página recarregada. Com "denied" salvo, o GTM não carrega de novo.
 */
export function disableAnalytics() {
  if (!GTM_ID) return;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name.startsWith("_ga"))
    .forEach((name) =>
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
      }),
    );
  location.reload();
}

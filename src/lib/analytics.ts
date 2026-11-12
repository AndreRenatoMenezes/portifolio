"use client";

import { readPrefs } from "@/lib/store";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/** Envia um evento ao GA4. Sem ID, sem consentimento ou sem o gtag carregado: não faz nada. */
export function track(name: string, params: Record<string, string> = {}) {
  if (!GA_ID || readPrefs().consent !== "granted" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Revogação: desliga o GA (flag oficial `ga-disable-<ID>`) e apaga os cookies `_ga*`. */
export function disableAnalytics() {
  if (!GA_ID) return;
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
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
}

"use client";

/**
 * Script inline que roda só no HTML do servidor (antes da pintura).
 * No cliente vira `text/plain` para o React não reclamar nem reexecutar.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

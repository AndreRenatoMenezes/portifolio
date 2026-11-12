import type { ReactNode } from "react";

/** Moldura compartilhada das imagens Open Graph (1200×630), no estilo noite do site. */
export const ogSize = { width: 1200, height: 630 };

export function OgFrame({ children, footer }: { children: ReactNode; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0a1030 0%, #2b3470 100%)",
        color: "#f4f1e6",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="1020" cy="120" r="60" fill="#f4f1d6" />
        <circle cx="1046" cy="104" r="54" fill="#141c48" />
        {[
          [80, 60], [220, 140], [380, 50], [560, 110], [700, 40], [860, 150], [1140, 260], [140, 300],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 3} fill="#ffffff" />
        ))}
        <path d="M0 520C180 470 340 490 520 515s360-30 520-25 160 30 160 30V630H0z" fill="#1f3f3a" />
        <path d="M0 575c170-45 380-30 560-8s420 6 640-14V630H0z" fill="#16302b" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "64px 72px 0", position: "relative" }}>
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 72px 40px",
          fontSize: 26,
          color: "#f0c75e",
          position: "relative",
        }}
      >
        <svg width="20" height="26" viewBox="0 0 12 16">
          <path d="M6 0 12 5v6l-6 5-6-5V5z" fill="#3fd17a" />
        </svg>
        {footer}
      </div>
    </div>
  );
}

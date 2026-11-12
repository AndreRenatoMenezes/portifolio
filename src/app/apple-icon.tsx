import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone para tela inicial do iOS: a gema do HUD sobre fundo noturno. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a1030, #2b3470)",
        }}
      >
        <svg width="110" height="146" viewBox="0 0 12 16">
          <path d="M6 0 12 5v6l-6 5-6-5V5z" fill="#3fd17a" stroke="#0f5e30" strokeWidth="0.6" />
          <path d="M6 0v16M0 5l6 3 6-3" stroke="#0f5e30" strokeWidth="0.4" fill="none" opacity="0.6" />
        </svg>
      </div>
    ),
    size,
  );
}

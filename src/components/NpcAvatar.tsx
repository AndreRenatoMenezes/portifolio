import "./NpcAvatar.css";

export type AvatarState = "idle" | "talking" | "happy";

type Layer =
  | "body"
  | "head"
  | "eyes-open"
  | "eyes-closed"
  | "mouth-rest"
  | "mouth-open"
  | "mouth-smile"
  | "heart";

/**
 * Sprite 32x32 do avatar, em camadas. Cada camada tem um <path> por cor, só com
 * retângulos de 1 pixel de altura em coordenadas inteiras (crispEdges, escala inteira).
 * Ordem de pintura: o cajado e a túnica (body) ficam atrás da cabeça.
 * Gerado a partir de uma grade de caracteres; 16 cores fixas, independentes do tema.
 */
const LAYERS: [Layer, [fill: string, d: string][]][] = [
  ["body", [
    ["#0f5e30", "M29 1h1v1h-1zM28 2h1v1h-1zM30 2h1v1h-1zM27 3h1v1h-1zM31 3h1v1h-1zM27 4h1v1h-1zM31 4h1v1h-1zM27 5h1v1h-1zM31 5h1v1h-1zM28 6h1v1h-1zM30 6h1v1h-1zM29 7h1v1h-1z"],
    ["#f2efe2", "M29 2h1v1h-1zM28 3h1v1h-1zM12 22h1v1h-1zM19 22h1v1h-1zM12 23h2v1h-2zM18 23h2v1h-2zM13 24h2v1h-2zM17 24h2v1h-2zM14 25h4v1h-4zM15 26h1v1h-1z"],
    ["#3fd17a", "M29 3h2v1h-2zM28 4h3v1h-3zM28 5h3v1h-3zM29 6h1v1h-1z"],
    ["#8a5428", "M29 8h1v1h-1zM29 9h1v1h-1zM29 10h1v1h-1zM29 11h1v1h-1zM29 12h1v1h-1zM29 13h1v1h-1zM28 14h1v1h-1zM28 15h1v1h-1zM28 16h1v1h-1zM28 17h1v1h-1zM28 18h1v1h-1zM28 19h1v1h-1zM27 20h1v1h-1zM27 21h1v1h-1zM27 22h1v1h-1zM23 23h2v1h-2zM27 23h1v1h-1zM21 24h2v1h-2zM19 25h2v1h-2zM17 26h2v1h-2zM11 29h2v1h-2zM9 30h2v1h-2zM7 31h2v1h-2z"],
    ["#55311a", "M30 8h1v1h-1zM30 9h1v1h-1zM30 10h1v1h-1zM30 11h1v1h-1zM30 12h1v1h-1zM30 13h1v1h-1zM29 14h1v1h-1zM29 15h1v1h-1zM29 16h1v1h-1zM29 17h1v1h-1zM29 18h1v1h-1zM29 19h1v1h-1zM28 20h1v1h-1zM28 21h1v1h-1zM28 22h1v1h-1zM22 23h1v1h-1zM28 23h1v1h-1zM20 24h1v1h-1zM23 24h1v1h-1zM18 25h1v1h-1zM21 25h1v1h-1zM16 26h1v1h-1zM19 26h1v1h-1zM14 27h1v1h-1zM17 27h1v1h-1zM12 28h1v1h-1zM15 28h1v1h-1zM10 29h1v1h-1zM13 29h1v1h-1zM8 30h1v1h-1zM11 30h1v1h-1zM6 31h1v1h-1zM9 31h1v1h-1z"],
    ["#f0b48a", "M12 18h8v1h-8zM12 19h8v1h-8zM12 20h8v1h-8zM12 21h8v1h-8z"],
    ["#2a1a12", "M9 22h3v1h-3zM20 22h3v1h-3zM6 23h3v1h-3zM11 23h1v1h-1zM20 23h1v1h-1zM25 23h1v1h-1zM4 24h2v1h-2zM12 24h1v1h-1zM19 24h1v1h-1zM26 24h2v1h-2zM3 25h1v1h-1zM13 25h1v1h-1zM28 25h1v1h-1zM2 26h1v1h-1zM14 26h1v1h-1zM29 26h1v1h-1zM1 27h1v1h-1zM30 27h1v1h-1zM1 28h1v1h-1zM30 28h1v1h-1zM0 29h1v1h-1zM31 29h1v1h-1zM0 30h1v1h-1zM31 30h1v1h-1zM0 31h1v1h-1zM31 31h1v1h-1z"],
    ["#c98a5e", "M13 22h6v1h-6zM14 23h4v1h-4zM15 24h2v1h-2z"],
    ["#3f8f3a", "M9 23h2v1h-2zM21 23h1v1h-1zM6 24h6v1h-6zM5 25h8v1h-8zM22 25h2v1h-2zM4 26h10v1h-10zM20 26h4v1h-4zM3 27h11v1h-11zM18 27h6v1h-6zM3 28h9v1h-9zM16 28h8v1h-8zM2 29h8v1h-8zM14 29h10v1h-10zM2 30h6v1h-6zM12 30h12v1h-12zM2 31h4v1h-4zM10 31h14v1h-14z"],
    ["#2b6a28", "M24 24h2v1h-2zM24 25h4v1h-4zM24 26h5v1h-5zM24 27h6v1h-6zM24 28h6v1h-6zM24 29h7v1h-7zM24 30h7v1h-7zM24 31h7v1h-7z"],
    ["#5fb35a", "M4 25h1v1h-1zM3 26h1v1h-1zM2 27h1v1h-1zM2 28h1v1h-1zM1 29h1v1h-1zM1 30h1v1h-1zM1 31h1v1h-1z"],
    ["#e8b84a", "M15 27h2v1h-2zM13 28h2v1h-2z"],
  ]],
  ["head", [
    ["#2a1a12", "M10 1h12v1h-12zM8 2h2v1h-2zM22 2h2v1h-2zM7 3h1v1h-1zM24 3h1v1h-1zM6 4h1v1h-1zM25 4h1v1h-1zM6 5h1v1h-1zM25 5h1v1h-1zM6 6h1v1h-1zM25 6h1v1h-1zM5 7h1v1h-1zM26 7h1v1h-1zM5 8h1v1h-1zM26 8h1v1h-1zM5 9h1v1h-1zM26 9h1v1h-1zM5 10h1v1h-1zM26 10h1v1h-1zM4 11h1v1h-1zM6 11h1v1h-1zM25 11h1v1h-1zM27 11h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM25 12h1v1h-1zM27 12h1v1h-1zM4 13h1v1h-1zM6 13h1v1h-1zM25 13h1v1h-1zM27 13h1v1h-1zM5 14h1v1h-1zM26 14h1v1h-1zM5 15h1v1h-1zM26 15h1v1h-1zM5 16h1v1h-1zM26 16h1v1h-1zM5 17h1v1h-1zM26 17h1v1h-1zM6 18h1v1h-1zM25 18h1v1h-1zM7 19h1v1h-1zM24 19h1v1h-1zM8 20h2v1h-2zM22 20h2v1h-2zM10 21h12v1h-12z"],
    ["#5fb35a", "M10 2h3v1h-3zM8 3h1v1h-1zM7 4h1v1h-1z"],
    ["#3f8f3a", "M13 2h9v1h-9zM9 3h13v1h-13zM8 4h14v1h-14zM7 5h15v1h-15z"],
    ["#2b6a28", "M22 3h2v1h-2zM22 4h3v1h-3zM22 5h3v1h-3zM7 6h18v1h-18z"],
    ["#4a2c1a", "M6 7h1v1h-1zM8 7h2v1h-2zM11 7h2v1h-2zM14 7h4v1h-4zM19 7h2v1h-2zM22 7h2v1h-2zM25 7h1v1h-1zM6 8h2v1h-2zM24 8h2v1h-2zM6 9h1v1h-1zM9 9h2v1h-2zM21 9h2v1h-2zM25 9h1v1h-1zM6 10h1v1h-1zM8 10h1v1h-1zM23 10h1v1h-1zM25 10h1v1h-1zM6 14h1v1h-1zM25 14h1v1h-1zM6 15h2v1h-2zM24 15h2v1h-2zM6 16h3v1h-3zM11 16h10v1h-10zM23 16h3v1h-3zM6 17h2v1h-2zM9 17h14v1h-14zM24 17h2v1h-2zM7 18h4v1h-4zM12 18h8v1h-8zM21 18h4v1h-4zM8 19h3v1h-3zM12 19h8v1h-8zM21 19h3v1h-3zM10 20h12v1h-12z"],
    ["#6b4226", "M7 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM18 7h1v1h-1zM21 7h1v1h-1zM24 7h1v1h-1zM8 8h1v1h-1zM11 8h1v1h-1zM20 8h1v1h-1zM23 8h1v1h-1zM10 16h1v1h-1zM21 16h1v1h-1zM8 17h1v1h-1zM23 17h1v1h-1zM11 18h1v1h-1zM20 18h1v1h-1zM11 19h1v1h-1zM20 19h1v1h-1z"],
    ["#f0b48a", "M9 8h2v1h-2zM12 8h8v1h-8zM21 8h2v1h-2zM7 9h2v1h-2zM11 9h10v1h-10zM23 9h2v1h-2zM7 10h1v1h-1zM9 10h14v1h-14zM24 10h1v1h-1zM7 11h18v1h-18zM7 12h18v1h-18zM7 13h7v1h-7zM15 13h2v1h-2zM18 13h7v1h-7zM7 14h6v1h-6zM19 14h6v1h-6zM8 15h16v1h-16zM9 16h1v1h-1zM22 16h1v1h-1z"],
    ["#c98a5e", "M5 11h1v1h-1zM26 11h1v1h-1zM5 12h1v1h-1zM26 12h1v1h-1zM5 13h1v1h-1zM14 13h1v1h-1zM17 13h1v1h-1zM26 13h1v1h-1zM13 14h6v1h-6z"],
  ]],
  ["eyes-open", [
    ["#f2efe2", "M9 11h1v1h-1zM21 11h1v1h-1z"],
    ["#4a2c1a", "M10 11h1v1h-1zM22 11h1v1h-1zM9 12h2v1h-2zM21 12h2v1h-2z"],
  ]],
  ["eyes-closed", [
    ["#2a1a12", "M9 12h2v1h-2zM21 12h2v1h-2z"],
  ]],
  ["mouth-rest", [
    ["#7a2e22", "M14 17h4v1h-4z"],
  ]],
  ["mouth-open", [
    ["#7a2e22", "M13 17h6v1h-6zM14 18h4v1h-4z"],
  ]],
  ["mouth-smile", [
    ["#7a2e22", "M12 17h1v1h-1zM19 17h1v1h-1zM13 18h6v1h-6z"],
    ["#f2efe2", "M13 17h6v1h-6z"],
  ]],
  ["heart", [
    ["#e0453a", "M0 20h2v1h-2zM3 20h2v1h-2zM0 21h1v1h-1zM2 21h3v1h-3zM0 22h5v1h-5zM1 23h3v1h-3zM2 24h1v1h-1z"],
    ["#f2efe2", "M1 21h1v1h-1z"],
  ]],
];

/**
 * Avatar do site (NPC do diálogo e ficha "Sobre"). Função pura, sem hooks:
 * quem usa decide o estado. A animação mora em NpcAvatar.css e é
 * escolhida pelo atributo data-state. Decorativo para leitores de tela.
 */
export function NpcAvatar({ state = "idle", className }: { state?: AvatarState; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="96"
      height="96"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      data-state={state}
      className={className ? `npc-avatar ${className}` : "npc-avatar"}
    >
      {LAYERS.map(([layer, paths]) => (
        <g key={layer} data-layer={layer}>
          {paths.map(([fill, d]) => (
            <path key={fill} fill={fill} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}

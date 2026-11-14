import "./NpcAvatar.css";

export type AvatarState = "idle" | "talking" | "happy";

/** Lado da célula de public/avatar/andre-sprites.png (1 pixel da arte = 1 pixel do PNG). */
const N = 64;

/**
 * Avatar do site (NPC do diálogo e ficha "Sobre"). Função pura, sem hooks: quem usa
 * decide o estado. A raiz é um <svg> cujo viewBox é a janela de um quadro da tira de
 * 8 quadros; NpcAvatar.css escolhe o quadro deslocando o <image> conforme data-state.
 * Decorativo para leitores de tela.
 */
export function NpcAvatar({ state = "idle", className }: { state?: AvatarState; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${N} ${N}`}
      width="96"
      height="96"
      aria-hidden="true"
      focusable="false"
      data-state={state}
      className={className ? `npc-avatar ${className}` : "npc-avatar"}
    >
      <image href="/avatar/andre-sprites.png" width={8 * N} height={N} />
    </svg>
  );
}

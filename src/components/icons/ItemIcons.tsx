/**
 * Ícones de itens desenhados do zero (genéricos de fantasia), viewBox 32x32.
 */
const icons = {
  sword: (
    <>
      <path d="M22 3h7v7L14 25l-3-1-1-3z" fill="#dfe6ee" stroke="#5b6b7c" strokeWidth="1.2" />
      <path d="M24 5 12 17" stroke="#fff" strokeWidth="1" opacity=".7" />
      <path d="M6 19l7 7-2 2-2-2-3 3-2-2 3-3-2-2z" fill="#3c6fd1" stroke="#1f3b73" strokeWidth="1.2" />
      <circle cx="4" cy="28" r="2" fill="#f2c94c" stroke="#8a6a12" strokeWidth="1" />
    </>
  ),
  shield: (
    <>
      <path d="M16 3 27 7v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="#3c6fd1" stroke="#1f3b73" strokeWidth="1.4" />
      <path d="M16 6 24 9v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V9z" fill="#c9d3dd" stroke="#5b6b7c" strokeWidth="1" />
      <path d="M16 11l4 7h-8z" fill="#c0392b" />
    </>
  ),
  bow: (
    <>
      <path d="M8 3c12 3 18 11 21 21" fill="none" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 3 29 24" stroke="#f3eadb" strokeWidth="1" />
      <path d="M4 28 24 8" stroke="#a37b4f" strokeWidth="1.6" />
      <path d="m24 8 2-5 1 4 4 1-5 2z" fill="#dfe6ee" stroke="#5b6b7c" strokeWidth=".8" />
      <path d="m4 28 1-4 1 2 2 1z" fill="#c0392b" />
    </>
  ),
  boomerang: (
    <>
      <path d="M5 6c6-2 12 0 15 5l7 13c1 2-1 4-3 3l-6-6c-2-2-5-3-8-2l-4 1c-3 1-5-2-4-4z" fill="#c98a3a" stroke="#6e4515" strokeWidth="1.3" />
      <circle cx="11" cy="10" r="2" fill="#c0392b" />
    </>
  ),
  bomb: (
    <>
      <circle cx="14" cy="19" r="10" fill="#2f3a7a" stroke="#141a3d" strokeWidth="1.4" />
      <circle cx="10" cy="15" r="3" fill="#6f7bd6" opacity=".7" />
      <rect x="18" y="6" width="6" height="5" rx="1" transform="rotate(35 21 8)" fill="#7f8c8d" />
      <path d="M24 6c2-2 4-1 5 1" fill="none" stroke="#c7a46b" strokeWidth="1.4" />
      <path d="m28 3 1 2 2 .5-2 .5-1 2-.5-2-2-.5 2-.5z" fill="#f9d64a" />
    </>
  ),
  map: (
    <>
      <path d="M3 7l8-3 10 3 8-3v21l-8 3-10-3-8 3z" fill="#f3e2b3" stroke="#8a6a3a" strokeWidth="1.3" />
      <path d="M11 4v21M21 7v21" stroke="#c7a46b" strokeWidth="1" />
      <path d="M6 18c3-4 6 2 9-2s5 0 8-3" fill="none" stroke="#c0392b" strokeWidth="1.4" strokeDasharray="2 2" />
      <path d="m23 10 2 2m0-2-2 2" stroke="#c0392b" strokeWidth="1.4" />
    </>
  ),
  potion: (
    <>
      <path d="M12 3h8v3h-1v5c4 1 7 5 7 9a10 10 0 0 1-20 0c0-4 3-8 7-9V6h-1z" fill="#dfe6ee" stroke="#5b6b7c" strokeWidth="1.3" />
      <path d="M8 19c3-2 6 1 8 0s5-2 8 0a8 8 0 0 1-16 0z" fill="#e0457b" />
      <circle cx="13" cy="21" r="1.5" fill="#fff" opacity=".7" />
      <rect x="11.5" y="2" width="9" height="3" rx="1" fill="#a0703c" />
    </>
  ),
  key: (
    <>
      <circle cx="10" cy="10" r="6" fill="none" stroke="#f2c94c" strokeWidth="3.5" />
      <path d="M14 14 28 28M22 22l3-3M25 25l3-3" stroke="#f2c94c" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="10" cy="10" r="6" fill="none" stroke="#8a6a12" strokeWidth="1" />
    </>
  ),
  lantern: (
    <>
      <path d="M12 4h8M16 2v2" stroke="#5b6b7c" strokeWidth="1.6" />
      <rect x="9" y="6" width="14" height="4" rx="1" fill="#8b5a2b" />
      <path d="M10 10h12l-1 14H11z" fill="#ffd36b" stroke="#8a6a12" strokeWidth="1.2" />
      <path d="M16 13c2 3 2 5 0 7-2-2-2-4 0-7z" fill="#ff7a2e" />
      <rect x="9" y="24" width="14" height="4" rx="1" fill="#8b5a2b" />
    </>
  ),
  scroll: (
    <>
      <rect x="7" y="5" width="18" height="22" rx="2" fill="#f3e2b3" stroke="#8a6a3a" strokeWidth="1.3" />
      <rect x="4" y="3" width="24" height="4" rx="2" fill="#c98a3a" stroke="#6e4515" strokeWidth="1" />
      <rect x="4" y="25" width="24" height="4" rx="2" fill="#c98a3a" stroke="#6e4515" strokeWidth="1" />
      <path d="M11 12h10M11 16h10M11 20h7" stroke="#8a6a3a" strokeWidth="1.2" />
    </>
  ),
} as const;

export type ItemIcon = keyof typeof icons;

export function ItemIconSvg({ name, size = 40 }: { name: ItemIcon; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      {icons[name]}
    </svg>
  );
}

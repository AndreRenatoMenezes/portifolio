/** Paisagem original em SVG. Cores vêm dos tokens do tema (dia/noite/templo). */
export function HeroScene() {
  const stars = [
    [60, 40], [140, 90], [220, 30], [310, 70], [420, 25], [520, 85], [600, 45], [700, 20],
    [780, 75], [860, 35], [950, 60], [1040, 28], [1120, 80], [1180, 40], [380, 120], [880, 115],
  ];
  // Camadas animadas ficam fora do SVG (HTML com transform/opacity = só composição, sem repintar a cena).
  const twinkles = [[8, 12], [22, 26], [37, 8], [51, 20], [66, 6], [74, 30], [88, 14], [95, 40]];
  const fireflies = [[14, 80], [22, 72], [36, 84], [53, 74], [68, 82], [82, 72], [90, 86]];
  return (
    <div className="hero-scene" aria-hidden="true">
    <svg className="hero-scene-art" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="1" stopColor="var(--sky-bottom)" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="var(--orb)" stopOpacity=".9" />
          <stop offset="1" stopColor="var(--orb)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="420" fill="url(#sky)" />

      <g className="scene-stars" fill="#fff">
        {stars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 ? 1.4 : 2.2} />
        ))}
      </g>

      <circle cx="960" cy="90" r="90" fill="url(#glow)" />
      <circle cx="960" cy="90" r="34" fill="var(--orb)" />
      <circle className="scene-moon-cut" cx="976" cy="80" r="30" fill="var(--sky-top)" />

      {/* montanha distante com nuvem no topo */}
      <path d="M560 300 760 120 820 160 870 130 1060 300z" fill="var(--mountain)" />
      <path d="M760 120 790 150 820 160 845 145 870 130 840 175 790 170z" fill="var(--snow)" opacity=".8" />

      <path d="M0 300C180 230 320 260 480 290s320-40 460-30 220 40 260 40V420H0z" fill="var(--hill-far)" />
      <path d="M0 350c160-60 360-40 520-10s380 10 520-20 160 10 160 10v90H0z" fill="var(--hill-near)" />

      {/* caminho de terra */}
      <path d="M540 420c10-30 60-50 120-62s140-14 170-20c-40 10-120 20-150 40s-50 30-40 42z" fill="var(--path)" opacity=".9" />

      {/* árvore */}
      <g transform="translate(150 230)">
        <rect x="26" y="70" width="14" height="70" rx="4" fill="var(--trunk)" />
        <circle cx="33" cy="50" r="42" fill="var(--leaf-dark)" />
        <circle cx="16" cy="64" r="26" fill="var(--leaf)" />
        <circle cx="52" cy="40" r="26" fill="var(--leaf)" />
      </g>

      {/* placa */}
      <g transform="translate(1010 318)">
        <rect x="18" y="20" width="6" height="40" fill="var(--trunk)" />
        <rect x="0" y="4" width="44" height="22" rx="3" fill="var(--wood)" stroke="var(--trunk)" strokeWidth="2" />
        <path d="M8 15h26" stroke="var(--trunk)" strokeWidth="2" />
      </g>

    </svg>
      <div className="scene-layer scene-clouds">
        <svg className="cloud cloud-a" viewBox="0 0 120 40" width="190">
          <ellipse cx="50" cy="26" rx="48" ry="13" />
          <ellipse cx="78" cy="17" rx="28" ry="15" />
        </svg>
        <svg className="cloud cloud-b" viewBox="0 0 140 36" width="210">
          <ellipse cx="78" cy="22" rx="58" ry="12" />
          <ellipse cx="48" cy="15" rx="28" ry="12" />
        </svg>
      </div>
      <div className="scene-layer scene-night">
        {twinkles.map(([x, y], i) => (
          <span key={i} className="twinkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 5) * 0.6}s` }} />
        ))}
        {fireflies.map(([x, y], i) => (
          <span key={i} className="firefly" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>
    </div>
  );
}

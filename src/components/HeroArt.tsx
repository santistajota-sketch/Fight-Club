/** Arte de destaque em SVG (octógono, linhas de movimento e luvas estilizadas). Sem imagens externas. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 420" className={className} role="img" aria-label="Ilustração de um octógono de luta com luvas em movimento">
      <defs>
        <linearGradient id="ha-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--primary))" />
          <stop offset="1" stopColor="rgb(var(--vivid))" />
        </linearGradient>
        <radialGradient id="ha-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgb(var(--primary))" stopOpacity=".55" />
          <stop offset="1" stopColor="rgb(var(--primary))" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-glove" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d4d4d8" />
        </linearGradient>
      </defs>
      <circle cx="320" cy="210" r="210" fill="url(#ha-glow)" />
      {[1, 0.78, 0.56].map((s, i) => (
        <polygon key={i} transform={`translate(320 210) scale(${s})`} points="-80,-190 80,-190 190,-80 190,80 80,190 -80,190 -190,80 -190,-80"
          fill={i === 2 ? 'url(#ha-bg)' : 'none'} fillOpacity={i === 2 ? 0.9 : 0} stroke="rgb(var(--primary))" strokeOpacity={0.5 - i * 0.1} strokeWidth={i === 0 ? 3 : 2} strokeDasharray={i === 0 ? '6 8' : undefined} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={20} y1={120 + i * 22} x2={190 - (i % 3) * 40} y2={120 + i * 22} stroke="rgb(var(--vivid))" strokeOpacity={0.15 + (i % 3) * 0.12} strokeWidth={i % 2 ? 3 : 6} strokeLinecap="round" />
      ))}
      {/* luva esquerda */}
      <g transform="translate(220 150) rotate(-18)">
        <rect x="0" y="0" width="120" height="96" rx="46" fill="url(#ha-glove)" />
        <rect x="-6" y="20" width="44" height="54" rx="20" fill="#e4e4e7" />
        <rect x="88" y="34" width="70" height="40" rx="12" fill="#18181b" />
        <rect x="96" y="40" width="54" height="8" rx="4" fill="rgb(var(--primary))" />
      </g>
      {/* luva direita */}
      <g transform="translate(330 230) rotate(12)">
        <rect x="0" y="0" width="120" height="96" rx="46" fill="url(#ha-glove)" />
        <rect x="-6" y="22" width="44" height="54" rx="20" fill="#e4e4e7" />
        <rect x="88" y="30" width="70" height="40" rx="12" fill="#18181b" />
        <rect x="96" y="36" width="54" height="8" rx="4" fill="rgb(var(--vivid))" />
      </g>
      {[[470, 90], [500, 330], [140, 350], [520, 200]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} opacity=".85">
          <path d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z" fill="rgb(var(--vivid))" />
        </g>
      ))}
    </svg>
  );
}

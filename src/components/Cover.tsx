import { memo } from 'react';
import { MODALITIES } from '../data/modalities';
import { cn, hashHue } from '../utils';

const GLYPH: Record<string, string> = {
  mma: 'MMA', boxe: 'BOX', muaythai: 'THAI', bjj: 'BJJ', judo: 'JUDÔ', wrestling: 'WREST',
  karate: 'KARATÊ', taekwondo: 'TKD', kickboxing: 'KICK', defesa: 'DEFESA',
};

interface Props {
  seed: string;
  modality?: string;
  label?: string;
  className?: string;
  variant?: number;
  alt?: string;
  big?: boolean;
}

/** Capa esportiva gerada em SVG (sem imagens externas): gradiente + padrão + tipografia. */
export const Cover = memo(function Cover({ seed, modality, label, className, variant, alt, big }: Props) {
  const m = MODALITIES.find((x) => x.id === modality);
  const hue = m?.hue ?? hashHue(seed);
  const v = variant ?? (hashHue(seed + 'v') % 4);
  const id = `g-${seed.replace(/[^a-z0-9]/gi, '')}-${v}`;
  const glyph = label ?? GLYPH[modality ?? ''] ?? 'FIGHT';
  return (
    <div className={cn(className?.includes('absolute') ? '' : 'relative', 'overflow-hidden', className)} role="img" aria-label={alt ?? `Capa ilustrativa${m ? ` de ${m.name}` : ''}`}>
      <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${hue} 75% 42%)`} />
            <stop offset="0.55" stopColor={`hsl(${(hue + 25) % 360} 70% 22%)`} />
            <stop offset="1" stopColor={`hsl(${(hue + 40) % 360} 60% 9%)`} />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="0.75" cy="0.3" r="0.6">
            <stop offset="0" stopColor={`hsl(${(hue + 330) % 360} 95% 65%)`} stopOpacity="0.55" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#${id}-bg)`} />
        <rect width="400" height="225" fill={`url(#${id}-glow)`} />
        {v === 0 && Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={i * 40 - 120} y1="240" x2={i * 40 + 40} y2="-20" stroke="white" strokeOpacity="0.07" strokeWidth="10" />
        ))}
        {v === 1 && [0, 1, 2, 3].map((i) => (
          <polygon key={i} transform={`translate(300 110) scale(${0.5 + i * 0.45})`} points="-60,-145 60,-145 145,-60 145,60 60,145 -60,145 -145,60 -145,-60" fill="none" stroke="white" strokeOpacity={0.14 - i * 0.025} strokeWidth="3" />
        ))}
        {v === 2 && Array.from({ length: 9 }).map((_, i) => (
          <circle key={i} cx="320" cy="60" r={20 + i * 28} fill="none" stroke="white" strokeOpacity={0.12 - i * 0.01} strokeWidth="2" />
        ))}
        {v === 3 && Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M -20 ${170 - i * 18} Q 200 ${60 - i * 22} 420 ${150 - i * 14}`} fill="none" stroke="white" strokeOpacity="0.1" strokeWidth={2 + i} />
        ))}
        <text x="18" y="218" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={big ? 150 : 120} fill="none" stroke="white" strokeOpacity="0.22" strokeWidth="1.5">{glyph}</text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
    </div>
  );
});

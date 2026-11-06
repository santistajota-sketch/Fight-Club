import type { AnalysisSection } from '../types';

const stroke = 'rgb(var(--fg))';
const accent = 'rgb(var(--primary))';
const muted = 'rgb(var(--muted))';
const T = ({ x, y, children, a = 'middle', c = stroke, s = 13 }: { x: number; y: number; children: string; a?: 'start' | 'middle' | 'end'; c?: string; s?: number }) =>
  <text x={x} y={y} textAnchor={a} fill={c} fontSize={s} fontFamily="Inter, sans-serif" fontWeight={600}>{children}</text>;

/** Diagramas técnicos ilustrativos em SVG */
export function Diagram({ kind }: { kind: NonNullable<AnalysisSection['diagram']> }) {
  const caption: Record<string, string> = {
    distance: 'Zonas de distância no boxe: longa, média e curta.',
    gravity: 'Centro de gravidade baixo e dentro da base = maior estabilidade.',
    sprawl: 'Sprawl: quadril desce e as pernas vão para trás, afastando-se das mãos do atacante.',
    footwork: 'Saída em ângulo versus recuo em linha reta.',
    energy: 'Esforço intermitente: picos anaeróbios e recuperação aeróbia ao longo do round.',
    guard: 'Guarda fechada: pernas cruzadas controlam a postura de quem está por cima.',
  };
  return (
    <figure className="card my-4 overflow-hidden p-4">
      <svg viewBox="0 0 520 220" className="w-full" role="img" aria-label={caption[kind]}>
        {kind === 'distance' && (<>
          <circle cx="70" cy="110" r="22" fill={accent} /><T x={70} y={150}>Você</T>
          {[[120, 'Curta', 0.45], [250, 'Média', 0.3], [400, 'Longa', 0.16]].map(([w, l, o], i) => (
            <g key={i}><rect x={92 + (i === 0 ? 0 : i === 1 ? 120 : 250)} y={60} width={i === 0 ? 120 : i === 1 ? 130 : 160} height={100} rx={10} fill={accent} fillOpacity={o as number} stroke={accent} strokeOpacity=".5" />
              <T x={92 + (i === 0 ? 60 : i === 1 ? 185 : 330)} y={115}>{l as string}</T></g>
          ))}
          <T x={152} y={185} c={muted} s={11}>uppercut · cruzado curto</T><T x={277} y={185} c={muted} s={11}>direto · cruzado</T><T x={422} y={185} c={muted} s={11}>jab</T>
        </>)}
        {kind === 'gravity' && (<>
          {[[140, 'Postura alta', 60], [380, 'Postura baixa', 110]].map(([x, l, cy], i) => (
            <g key={i}>
              <line x1={(x as number) - 50} y1={190} x2={(x as number) + 50} y2={190} stroke={stroke} strokeWidth="3" />
              <line x1={(x as number) - 30} y1={190} x2={x as number} y2={cy as number} stroke={stroke} strokeWidth="3" />
              <line x1={(x as number) + 30} y1={190} x2={x as number} y2={cy as number} stroke={stroke} strokeWidth="3" />
              <circle cx={x as number} cy={(cy as number) - 30} r={14} fill="none" stroke={stroke} strokeWidth="3" />
              <line x1={x as number} y1={(cy as number) - 16} x2={x as number} y2={cy as number} stroke={stroke} strokeWidth="3" />
              <circle cx={x as number} cy={(cy as number) + 10} r={8} fill={accent} />
              <line x1={x as number} y1={(cy as number) + 18} x2={x as number} y2={190} stroke={accent} strokeDasharray="4 4" />
              <T x={x as number} y={212}>{l as string}</T>
            </g>
          ))}
          <T x={260} y={30} c={muted} s={12}>● centro de gravidade</T>
        </>)}
        {kind === 'sprawl' && (<>
          <line x1="20" y1="190" x2="500" y2="190" stroke={muted} />
          <path d="M150 150 Q 200 120 250 135" stroke={muted} strokeWidth="10" fill="none" strokeLinecap="round" /><T x={150} y={120} c={muted}>atacante</T>
          <path d="M250 130 L 330 150 L 460 185" stroke={accent} strokeWidth="12" fill="none" strokeLinecap="round" />
          <circle cx="245" cy="118" r="14" fill={accent} /><T x={380} y={130} c={accent}>quadril baixo, pernas para trás</T>
          <path d="M470 160 l 25 0 m -8 -8 l 8 8 l -8 8" stroke={accent} strokeWidth="3" fill="none" />
        </>)}
        {kind === 'footwork' && (<>
          <circle cx="260" cy="110" r="18" fill={muted} /><T x={260} y={80} c={muted}>adversário</T>
          <circle cx="260" cy="170" r="14" fill={accent} />
          <path d="M260 170 L 260 205" stroke={muted} strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#ar)" /><T x={300} y={212} c={muted} s={11}>recuo reto (previsível)</T>
          <path d="M260 170 Q 330 175 360 130" stroke={accent} strokeWidth="4" fill="none" /><T x={430} y={135} c={accent}>saída em ângulo</T>
          <path d="M360 130 L 290 115" stroke={accent} strokeWidth="2" strokeDasharray="3 4" /><T x={330} y={108} c={accent} s={11}>contra-ataque</T>
        </>)}
        {kind === 'energy' && (<>
          <line x1="30" y1="190" x2="500" y2="190" stroke={muted} /><line x1="30" y1="190" x2="30" y2="20" stroke={muted} />
          <path d={`M30 160 ${Array.from({ length: 10 }).map((_, i) => `L ${60 + i * 45} ${i % 3 === 1 ? 40 : 150 - (i % 2) * 20}`).join(' ')}`} fill="none" stroke={accent} strokeWidth="3" />
          <line x1="30" y1="130" x2="500" y2="130" stroke={muted} strokeDasharray="5 5" />
          <T x={490} y={124} a="end" c={muted} s={11}>limiar aeróbio</T><T x={150} y={35} c={accent} s={11}>pico anaeróbio</T><T x={265} y={210} c={muted} s={11}>tempo do round →</T>
        </>)}
        {kind === 'guard' && (<>
          <ellipse cx="200" cy="150" rx="90" ry="26" fill={muted} fillOpacity=".3" /><T x={140} y={195} c={muted}>por baixo (guarda)</T>
          <path d="M260 140 Q 330 70 370 130" stroke={accent} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M260 160 Q 330 210 370 150" stroke={accent} strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="400" cy="110" r="16" fill={stroke} /><rect x="370" y="122" width="60" height="50" rx="14" fill={stroke} fillOpacity=".75" />
          <T x={430} y={200}>por cima</T><T x={330} y={60} c={accent}>pernas cruzadas = controle</T>
        </>)}
        <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill={muted} /></marker></defs>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted">Diagrama ilustrativo · {caption[kind]}</figcaption>
    </figure>
  );
}

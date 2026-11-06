import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, FlaskConical } from 'lucide-react';
import type { Lesson } from '../types';
import { Cover } from './Cover';
import { cn } from '../utils';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Player SIMULADO: não há vídeo real. A linha do tempo avança em velocidade acelerada
 * e exibe os pontos-chave da aula em sequência. Tudo que aparece funciona de verdade.
 */
export function SimPlayer({ lesson, modality, completed, onComplete }: { lesson: Lesson; modality: string; completed: boolean; onComplete: () => void }) {
  const duration = lesson.minutes * 60;
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(20);
  const timer = useRef<number>();

  useEffect(() => { setPos(0); setPlaying(false); }, [lesson.id]);
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setPos((p) => {
        const n = p + speed / 4;
        if (n >= duration) { setPlaying(false); return duration; }
        return n;
      });
    }, 250);
    return () => clearInterval(timer.current);
  }, [playing, speed, duration]);

  const ended = pos >= duration;
  const segment = Math.min(lesson.keyPoints.length - 1, Math.floor((pos / duration) * lesson.keyPoints.length));
  const started = pos > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black text-white">
      <div className="relative aspect-video">
        <Cover seed={lesson.id} modality={modality} className="absolute inset-0" big />
        <div className="absolute inset-0 bg-black/45" />
        <span className="badge absolute left-3 top-3 bg-amber-400 text-black"><FlaskConical size={12} />Simulação de vídeo</span>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {!started && (
            <>
              <p className="font-display text-3xl tracking-wide sm:text-4xl">{lesson.title}</p>
              <p className="mt-2 max-w-md text-sm text-white/80">Esta é uma aula demonstrativa: em vez de vídeo, a reprodução apresenta os pontos-chave da aula em uma linha do tempo acelerada.</p>
              <button onClick={() => setPlaying(true)} className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-105" aria-label="Reproduzir simulação da aula"><Play size={28} className="ml-1" /></button>
            </>
          )}
          {started && !ended && (
            <div key={segment} className="animate-rise max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">Ponto-chave {segment + 1} de {lesson.keyPoints.length}</p>
              <p className="mt-2 font-display text-3xl leading-tight tracking-wide sm:text-5xl">{lesson.keyPoints[segment]}</p>
            </div>
          )}
          {ended && (
            <div className="animate-rise">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
              <p className="mt-2 font-display text-3xl tracking-wide">Fim da aula</p>
              {completed ? <p className="text-sm text-white/80">Aula já marcada como concluída.</p> : (
                <button onClick={onComplete} className="btn mt-3 bg-white text-black">Marcar como concluída</button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-zinc-950 px-3 py-2.5">
        <button onClick={() => (ended ? (setPos(0), setPlaying(true)) : setPlaying((p) => !p))} className="rounded-lg p-1.5 hover:bg-white/10" aria-label={playing ? 'Pausar' : 'Reproduzir'}>
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={() => { setPos(0); setPlaying(false); }} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Reiniciar"><RotateCcw size={18} /></button>
        <span className="w-24 text-xs tabular-nums text-white/80">{fmt(pos)} / {fmt(duration)}</span>
        <label htmlFor="seek" className="sr-only">Posição na aula</label>
        <input id="seek" type="range" min={0} max={duration} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="h-1 flex-1 cursor-pointer accent-[rgb(var(--primary))]" />
        <label htmlFor="speed" className="sr-only">Velocidade da simulação</label>
        <select id="speed" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className={cn('rounded-md bg-white/10 px-1.5 py-1 text-xs text-white')}>
          <option value={10} className="text-black">10×</option><option value={20} className="text-black">20×</option><option value={40} className="text-black">40×</option>
        </select>
      </div>
    </div>
  );
}

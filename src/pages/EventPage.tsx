import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, CalendarDays, Trophy, ChevronRight, Target } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { eventDate, eventStatus } from '../hooks/useContent';
import { fighterById } from '../data/events';
import { Cover } from '../components/Cover';
import { StatusPill } from '../components/cards';
import { Avatar, DemoBadge, EmptyState, Modal, SaveButton } from '../components/ui';
import { modalityName } from '../data/modalities';
import { cn } from '../utils';
import type { Fighter } from '../types';

export default function EventPage() {
  const { id } = useParams();
  const e = useStore((s) => s.events.find((x) => x.id === id));
  const predict = useStore((s) => s.predict);
  const preds = useUserData().predictions;
  const [fighter, setFighter] = useState<Fighter | null>(null);
  if (!e) return <EmptyState title="Evento não encontrado" action={<Link to="/eventos" className="btn-primary">Ver eventos</Link>} />;
  const status = eventStatus(e);
  const open = status === 'Programado';
  const correct = e.fights.filter((f) => f.result && preds[f.id] === f.result.winner).length;
  const made = e.fights.filter((f) => preds[f.id]).length;

  const FighterBtn = ({ fid, side, fightId, winner }: { fid: string; side: 'a' | 'b'; fightId: string; winner?: string }) => {
    const f = fighterById(fid);
    if (!f) return null;
    const picked = preds[fightId] === fid;
    return (
      <div className={cn('flex flex-1 flex-col items-center gap-2 text-center', side === 'b' && 'sm:items-center')}>
        <button onClick={() => setFighter(f)} className="rounded-full" aria-label={`Ver perfil de ${f.name}`}><Avatar name={f.name} hue={f.hue} size={64} className={cn(winner === fid && 'ring-emerald-500')} /></button>
        <div><p className="font-bold leading-tight">{f.name}</p><p className="text-xs text-muted">“{f.nickname}” · {f.record}</p></div>
        {winner && <span className={cn('badge', winner === fid ? 'bg-emerald-600 text-white' : 'bg-zinc-500/20 text-muted')}>{winner === fid ? 'Vencedor' : 'Derrota'}</span>}
        {open && (
          <button onClick={() => predict(fightId, fid)} aria-pressed={picked} className={cn('btn px-3 py-1.5 text-xs', picked ? 'bg-primary text-onprimary' : 'border border-line bg-bg2')}>
            <Target size={14} />{picked ? 'Seu palpite' : 'Palpitar'}
          </button>
        )}
        {!open && preds[fightId] === fid && <span className="text-xs font-semibold text-accent">Seu palpite</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Trilha de navegação" className="flex items-center gap-1 text-sm text-muted"><Link to="/eventos" className="hover:text-fg">Eventos</Link><ChevronRight size={14} /><span className="text-fg">{e.name}</span></nav>
      <section className="relative overflow-hidden rounded-3xl">
        <Cover seed={e.id + 'banner'} modality={e.modality} className="h-64 md:h-80" variant={1} big alt={`Banner do evento ${e.name}`} />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-white md:p-8">
          <div className="mb-2 flex flex-wrap gap-2"><StatusPill e={e} /><DemoBadge text="Evento fictício" /></div>
          <h1 className="h-display text-5xl md:text-6xl">{e.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
            <span className="flex items-center gap-1"><CalendarDays size={15} />{new Date(eventDate(e)).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}{e.durationDays > 1 && ` (${e.durationDays} dias)`}</span>
            <span className="flex items-center gap-1"><MapPin size={15} />{e.venue} · {e.city}</span>
          </p>
        </div>
        <div className="absolute right-4 top-4"><SaveButton type="event" id={e.id} compact /></div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <p className="text-muted">{e.description}</p>
          <h2 className="section-title">Card de lutas</h2>
          {e.fights.map((f) => (
            <div key={f.id} className={cn('card p-5', f.main && 'border-primary/60')}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider">
                <span className="text-accent">{f.main ? 'Luta principal' : 'Card'} · {f.weight}</span>
                <span className="text-muted">{f.rounds} round{f.rounds > 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <FighterBtn fid={f.a} side="a" fightId={f.id} winner={f.result?.winner} />
                <span className="font-display text-4xl text-muted">VS</span>
                <FighterBtn fid={f.b} side="b" fightId={f.id} winner={f.result?.winner} />
              </div>
              {f.result && <p className="mt-4 rounded-xl bg-bg2 p-3 text-center text-sm">Resultado simulado: <strong>{fighterById(f.result.winner)?.name}</strong> venceu por {f.result.method} (R{f.result.round})</p>}
            </div>
          ))}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-2 flex items-center gap-2 font-bold"><Trophy size={18} className="text-accent" />Palpites recreativos</h2>
            <p className="text-sm text-muted">Apenas por diversão: sem dinheiro, apostas ou prêmios. Cada palpite novo rende +5 Fight XP.</p>
            <p className="mt-3 text-sm">{open ? `Você palpitou em ${made} de ${e.fights.length} lutas.` : status === 'Acontecendo' ? 'Palpites encerrados: o evento está acontecendo.' : `Você acertou ${correct} de ${made} palpites.`}</p>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 font-bold">Sobre</h2>
            <dl className="space-y-1 text-sm"><div className="flex justify-between"><dt className="text-muted">Modalidade</dt><dd>{modalityName(e.modality)}</dd></div><div className="flex justify-between"><dt className="text-muted">Status</dt><dd>{status}</dd></div><div className="flex justify-between"><dt className="text-muted">Lutas</dt><dd>{e.fights.length}</dd></div></dl>
          </div>
        </aside>
      </div>
      <Modal open={!!fighter} onClose={() => setFighter(null)} title="Perfil do atleta">
        {fighter && (
          <div className="text-center">
            <Avatar name={fighter.name} hue={fighter.hue} size={96} />
            <h3 className="mt-3 font-display text-3xl tracking-wide">{fighter.name}</h3>
            <p className="text-muted">“{fighter.nickname}”</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[['Cartel', fighter.record], ['País', fighter.country], ['Equipe', fighter.team]].map(([k, v]) => <div key={k} className="rounded-xl bg-bg2 p-3"><dt className="text-xs text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
            </dl>
            <p className="mt-4 text-xs text-muted">Atleta fictício criado para a demonstração.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, List } from 'lucide-react';
import { useStore } from '../store/useStore';
import { eventDate, eventStatus } from '../hooks/useContent';
import { EventCard, StatusPill } from '../components/cards';
import { DemoBadge, EmptyState, PageHeader, Tabs } from '../components/ui';
import { MODALITIES, modalityName } from '../data/modalities';
import { DAY, cn, dayKey } from '../utils';
import type { EventStatus } from '../types';

const WD = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function Events() {
  const events = useStore((s) => s.events);
  const [mod, setMod] = useState('all');
  const [status, setStatus] = useState<'all' | EventStatus>('all');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => events.filter((e) => (mod === 'all' || e.modality === mod) && (status === 'all' || eventStatus(e) === status)).sort((a, b) => a.dayOffset - b.dayOffset), [events, mod, status]);

  // mapa dia -> eventos (inclui eventos de vários dias)
  const byDay = useMemo(() => {
    const m = new Map<string, typeof filtered>();
    filtered.forEach((e) => { for (let i = 0; i < e.durationDays; i++) { const k = dayKey(eventDate(e) + i * DAY); m.set(k, [...(m.get(k) ?? []), e]); } });
    return m;
  }, [filtered]);

  const first = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((first + daysInMonth) / 7) * 7 }, (_, i) => { const d = i - first + 1; return d >= 1 && d <= daysInMonth ? d : null; });
  const todayKey = dayKey(Date.now());
  const selectedEvents = selected ? byDay.get(selected) ?? [] : [];
  const featured = filtered.filter((e) => e.featured && eventStatus(e) !== 'Encerrado');

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Calendário esportivo" title="Eventos" text="Competições fictícias, criadas para a demonstração. Datas calculadas a partir de hoje para manter o calendário coerente.">
        <DemoBadge text="Eventos demonstrativos" />
      </PageHeader>

      {featured.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Em destaque</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{featured.slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}</div>
        </section>
      )}

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-end">
        <div className="flex-1"><label htmlFor="ev-mod" className="mb-1 block text-xs font-semibold text-muted">Modalidade</label><select id="ev-mod" className="input py-2" value={mod} onChange={(e) => setMod(e.target.value)}><option value="all">Todas</option>{MODALITIES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        <div className="flex-1"><label htmlFor="ev-st" className="mb-1 block text-xs font-semibold text-muted">Status</label><select id="ev-st" className="input py-2" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="all">Todos</option><option>Programado</option><option>Acontecendo</option><option>Encerrado</option></select></div>
        <Tabs label="Visualização" value={view} onChange={setView} options={[{ value: 'calendar', label: 'Calendário' }, { value: 'list', label: 'Lista' }]} />
      </div>

      {view === 'calendar' ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="card p-4">
            <div className="mb-4 flex items-center justify-between">
              <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mês anterior"><ChevronLeft size={18} /></button>
              <h2 className="font-display text-3xl capitalize tracking-wide">{month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
              <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Próximo mês"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted">{WD.map((d) => <div key={d} className="py-1">{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const k = dayKey(new Date(month.getFullYear(), month.getMonth(), d).getTime());
                const evs = byDay.get(k) ?? [];
                return (
                  <button key={i} onClick={() => setSelected(k)} aria-label={`${d}${evs.length ? `, ${evs.length} evento(s)` : ''}`} aria-pressed={selected === k}
                    className={cn('flex aspect-square flex-col items-center justify-start gap-1 rounded-xl border p-1 text-sm sm:aspect-[4/3]',
                      selected === k ? 'border-primary bg-primary/15' : 'border-transparent hover:bg-bg2', k === todayKey && 'font-bold text-accent')}>
                    <span className={cn(k === todayKey && 'rounded-full bg-primary px-1.5 text-onprimary')}>{d}</span>
                    <span className="flex flex-wrap justify-center gap-0.5">{evs.slice(0, 3).map((e) => <span key={e.id} className={cn('h-1.5 w-1.5 rounded-full', eventStatus(e) === 'Encerrado' ? 'bg-muted' : eventStatus(e) === 'Acontecendo' ? 'bg-red-500' : 'bg-primary')} />)}</span>
                    {evs[0] && <span className="hidden w-full truncate text-[10px] font-semibold text-muted sm:block">{evs[0].name}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Programado</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" />Acontecendo</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted" />Encerrado</span></div>
          </div>
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 font-bold"><CalendarDays size={18} />{selected ? 'Eventos do dia selecionado' : 'Próximos eventos'}</h2>
            {(selected ? selectedEvents : filtered.filter((e) => eventStatus(e) !== 'Encerrado').slice(0, 5)).map((e) => (
              <Link key={e.id} to={`/eventos/${e.id}`} className="card card-hover flex items-center gap-3 p-3">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/15 text-accent">
                  <span className="font-display text-2xl leading-none">{new Date(eventDate(e)).getDate()}</span>
                  <span className="text-[10px] font-bold uppercase">{new Date(eventDate(e)).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                </div>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{e.name}</p><p className="text-xs text-muted">{modalityName(e.modality)} · {e.city}</p></div>
                <StatusPill e={e} />
              </Link>
            ))}
            {selected && !selectedEvents.length && <p className="text-sm text-muted">Nenhum evento neste dia.</p>}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="sr-only">Lista de eventos</h2>
          {filtered.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((e) => <EventCard key={e.id} e={e} />)}</div>
            : <EmptyState icon={List} title="Nenhum evento" text="Nenhum evento corresponde aos filtros." />}
        </section>
      )}
    </div>
  );
}

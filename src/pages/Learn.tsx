import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Route as RouteIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useCourseProgress, courseMinutes, useFavorites } from '../hooks/useContent';
import { CourseCard } from '../components/cards';
import { EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { MODALITIES, modalityName } from '../data/modalities';
import { cn } from '../utils';

const sel = 'input py-2';

export default function Learn() {
  const { courses, lessons, experts } = useStore();
  const prog = useCourseProgress();
  const favs = useFavorites();
  const [f, setF] = useState({ modality: 'all', level: 'all', expert: 'all', duration: 'all', type: 'all', status: 'all', sort: 'popular' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => courses.filter((c) => {
    const p = prog(c); const mins = courseMinutes(c, lessons);
    return (f.modality === 'all' || c.modality === f.modality) && (f.level === 'all' || c.level === f.level) && (f.expert === 'all' || c.expertId === f.expert)
      && (f.type === 'all' || c.type === f.type)
      && (f.duration === 'all' || (f.duration === 'short' ? mins < 50 : f.duration === 'mid' ? mins >= 50 && mins <= 65 : mins > 65))
      && (f.status === 'all' || (f.status === 'started' ? p.done > 0 && p.pct < 100 : f.status === 'new' ? p.done === 0 : p.pct === 100));
  }).sort((a, b) => f.sort === 'popular' ? b.students - a.students : f.sort === 'rating' ? b.rating - a.rating : courseMinutes(a, lessons) - courseMinutes(b, lessons)), [courses, lessons, f, prog]);

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];
  const tracks = favs.map((m) => ({ m, items: levels.map((lv) => courses.filter((c) => c.modality === m && c.level === lv)) })).filter((t) => t.items.some((x) => x.length));
  const active = Object.entries(f).filter(([k, v]) => k !== 'sort' && v !== 'all').length;

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Fight Academy" title="Aprender" text="Cursos estruturados com especialistas, trilhas por modalidade e acompanhamento de progresso.">
        <button className="btn-ghost md:hidden" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}><SlidersHorizontal size={16} />Filtros{active ? ` (${active})` : ''}</button>
      </PageHeader>

      {tracks.length > 0 && (
        <section aria-labelledby="tracks">
          <h2 id="tracks" className="section-title mb-4 flex items-center gap-2"><RouteIcon className="text-accent" />Suas trilhas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map(({ m, items }) => {
              const all = items.flat(); const pcts = all.map((c) => prog(c).pct);
              const avg = all.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / all.length) : 0;
              return (
                <div key={m} className="card p-5">
                  <div className="mb-3 flex items-center justify-between"><h3 className="font-display text-2xl tracking-wide">Trilha {modalityName(m)}</h3><span className="text-sm font-semibold text-accent">{avg}%</span></div>
                  <ProgressBar value={avg} label={`Progresso na trilha ${modalityName(m)}`} />
                  <ol className="mt-4 space-y-2">
                    {levels.map((lv, i) => (
                      <li key={lv} className="flex items-start gap-3">
                        <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', items[i].length ? 'bg-primary text-onprimary' : 'bg-line text-muted')}>{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{lv}</p>
                          {items[i].length ? items[i].map((c) => <Link key={c.id} to={`/aprender/${c.id}`} className="block truncate text-sm text-accent hover:underline">{c.title} · {prog(c).pct}%</Link>) : <p className="text-xs text-muted">Em breve nesta trilha.</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section aria-labelledby="catalog">
        <h2 id="catalog" className="section-title mb-4">Catálogo de cursos</h2>
        <div className={cn('card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7', !showFilters && 'hidden md:grid')}>
          {[
            ['modality', 'Modalidade', [['all', 'Todas'], ...MODALITIES.map((m) => [m.id, m.name])]],
            ['level', 'Nível', [['all', 'Todos'], ...levels.map((l) => [l, l])]],
            ['expert', 'Especialista', [['all', 'Todos'], ...experts.map((e) => [e.id, e.name])]],
            ['duration', 'Duração', [['all', 'Qualquer'], ['short', 'Até 50 min'], ['mid', '50–65 min'], ['long', 'Mais de 65 min']]],
            ['type', 'Tipo de conteúdo', [['all', 'Todos'], ['Curso', 'Curso'], ['Trilha', 'Trilha'], ['Workshop', 'Workshop']]],
            ['status', 'Status', [['all', 'Todos'], ['new', 'Não iniciado'], ['started', 'Em andamento'], ['done', 'Concluído']]],
            ['sort', 'Ordenar por', [['popular', 'Popularidade'], ['rating', 'Avaliação'], ['duration', 'Duração']]],
          ].map(([k, label, opts]) => (
            <div key={k as string}>
              <label htmlFor={`f-${k}`} className="mb-1 block text-xs font-semibold text-muted">{label as string}</label>
              <select id={`f-${k}`} className={sel} value={f[k as keyof typeof f]} onChange={set(k as keyof typeof f)}>
                {(opts as string[][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <p className="mb-3 text-sm text-muted" aria-live="polite">{list.length} curso(s) encontrados</p>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CourseCard key={c.id} course={c} />)}</div>
        ) : (
          <EmptyState title="Nenhum curso encontrado" text="Ajuste os filtros para ver mais opções." action={<button className="btn-ghost" onClick={() => setF({ modality: 'all', level: 'all', expert: 'all', duration: 'all', type: 'all', status: 'all', sort: 'popular' })}>Limpar filtros</button>} />
        )}
      </section>
    </div>
  );
}

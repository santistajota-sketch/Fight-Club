import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { BookOpenCheck, GraduationCap, Clock, Flame, Layers, Target, Trash2, Plus, Info, CheckCircle2, Circle } from 'lucide-react';
import { useStore, useUserData, computeStats, completedCourses } from '../store/useStore';
import { useChartColors } from '../hooks/useChartColors';
import { useFavorites } from '../hooks/useContent';
import { ConfirmDialog, PageHeader, ProgressBar, ICONS } from '../components/ui';
import { ACHIEVEMENTS, levelFor } from '../data/gamification';
import { modalityName } from '../data/modalities';
import { DAY, cn, dayKey, startOfDay, startOfWeek, fmtDate } from '../utils';
import type { Goal } from '../types';

const KIND_LABEL: Record<Goal['kind'], string> = {
  lessons_week: 'Aulas nesta semana', finish_course: 'Cursos concluídos', new_modality: 'Novas modalidades exploradas', read_analyses: 'Análises lidas', custom: 'Meta personalizada',
};

export default function Progress() {
  const u = useUserData();
  const { courses, lessons, addGoal, toggleGoal, removeGoal } = useStore();
  const favs = useFavorites();
  const c = useChartColors();
  const s = computeStats(u, courses);
  const lvl = levelFor(u.xp);
  const minutes = u.completedLessons.reduce((acc, id) => acc + (lessons.find((l) => l.id === id)?.minutes ?? 0), 0);
  const ws = startOfWeek();
  const lessonsWeek = u.activity.filter((a) => a.type === 'lesson' && a.ts >= ws).length;
  const exploredMods = [...new Set(u.activity.filter((a) => a.type === 'lesson' && a.modality).map((a) => a.modality!))];
  const newMods = exploredMods.filter((m) => !favs.includes(m)).length;

  const goalValue = (g: Goal) => g.kind === 'lessons_week' ? lessonsWeek : g.kind === 'finish_course' ? s.courses : g.kind === 'new_modality' ? newMods : g.kind === 'read_analyses' ? s.analyses : g.done ? 1 : 0;

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = startOfDay(Date.now()) - (13 - i) * DAY;
    const acts = u.activity.filter((a) => dayKey(a.ts) === dayKey(d));
    return { dia: fmtDate(d, { day: '2-digit', month: '2-digit' }), aulas: acts.filter((a) => a.type === 'lesson').length, análises: acts.filter((a) => a.type === 'analysis').length };
  });
  let acc = 0;
  const xpSeries = [...u.activity].sort((a, b) => a.ts - b.ts).map((a) => ({ t: fmtDate(a.ts, { day: '2-digit', month: '2-digit' }), xp: (acc += a.xp ?? 0) }));
  const baseXp = u.xp - acc; // XP inicial (dados de demonstração)
  const xpData = xpSeries.map((x) => ({ ...x, xp: x.xp + baseXp }));

  const [kind, setKind] = useState<Goal['kind']>('lessons_week');
  const [target, setTarget] = useState(3);
  const [label, setLabel] = useState('');
  const [err, setErr] = useState('');
  const [del, setDel] = useState<string | null>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (kind === 'custom' && label.trim().length < 3) { setErr('Descreva a meta personalizada.'); return; }
    if (target < 1 || target > 50) { setErr('Escolha um alvo entre 1 e 50.'); return; }
    addGoal({ kind, target: kind === 'custom' ? 1 : target, label: kind === 'custom' ? label.trim() : `${KIND_LABEL[kind]}: ${target}` });
    setLabel(''); setErr('');
  };

  const cards = [
    [BookOpenCheck, s.lessons, 'Aulas assistidas'], [GraduationCap, s.courses, 'Cursos concluídos'], [Clock, `${(minutes / 60).toFixed(1)}h`, 'Horas de aprendizado'],
    [Flame, `${s.streak}d`, 'Sequência de estudo'], [Layers, exploredMods.length, 'Modalidades exploradas'], [Target, `${u.goals.filter((g) => goalValue(g) >= g.target).length}/${u.goals.length}`, 'Metas atingidas'],
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Fight ID" title="Meu Progresso" text="Sua evolução de aprendizado na plataforma." />
      <p className="flex items-start gap-2 rounded-xl border border-line bg-bg2 p-3 text-sm text-muted"><Info size={18} className="mt-0.5 shrink-0 text-accent" />Estes indicadores medem seu <strong className="text-fg">aprendizado digital</strong> na Fight Flow (aulas, leituras, participação). Eles não representam desempenho esportivo real, graduação ou aptidão para lutar.</p>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map(([Icon, v, l]) => (
          <div key={l} className="card p-4"><Icon size={20} className="text-accent" /><p className="mt-2 font-display text-4xl">{v}</p><p className="text-xs text-muted">{l}</p></div>
        ))}
      </section>

      <section className="card p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Nível {lvl.level} · {lvl.name}</h2><span className="text-sm text-muted">{u.xp} Fight XP · próximo nível em {Math.max(0, lvl.next - u.xp)} XP</span></div>
        <ProgressBar value={lvl.pct} className="h-3" label="Progresso de nível" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Atividade nos últimos 14 dias</h2>
          <div className="h-64" role="img" aria-label="Gráfico de barras com aulas e análises por dia">
            <ResponsiveContainer>
              <BarChart data={days}>
                <CartesianGrid stroke={c.grid} vertical={false} />
                <XAxis dataKey="dia" tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.grid}`, borderRadius: 12 }} cursor={{ fill: c.grid, opacity: 0.4 }} />
                <Bar dataKey="aulas" stackId="a" fill={c.primary} radius={[0, 0, 0, 0]} />
                <Bar dataKey="análises" stackId="a" fill={c.series[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 font-bold">Evolução de Fight XP</h2>
          <div className="h-64" role="img" aria-label="Gráfico de área com o acúmulo de XP">
            <ResponsiveContainer>
              <AreaChart data={xpData.length ? xpData : [{ t: 'hoje', xp: u.xp }]}>
                <defs><linearGradient id="xpg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.primary} stopOpacity={0.5} /><stop offset="1" stopColor={c.primary} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke={c.grid} vertical={false} />
                <XAxis dataKey="t" tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.grid}`, borderRadius: 12 }} />
                <Area type="monotone" dataKey="xp" stroke={c.primary} strokeWidth={2.5} fill="url(#xpg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-5">
          <h2 className="mb-1 font-bold">Metas</h2>
          <p className="mb-4 text-sm text-muted">Atualizadas automaticamente a partir das suas atividades.</p>
          <ul className="space-y-3">
            {u.goals.map((g) => {
              const v = Math.min(goalValue(g), g.target); const done = v >= g.target;
              return (
                <li key={g.id} className="rounded-xl border border-line p-3">
                  <div className="flex items-center gap-3">
                    {g.kind === 'custom' ? (
                      <button onClick={() => toggleGoal(g.id)} aria-pressed={!!g.done} aria-label={g.done ? 'Desmarcar meta' : 'Marcar meta como concluída'}>{g.done ? <CheckCircle2 className="text-emerald-500" /> : <Circle className="text-muted" />}</button>
                    ) : done ? <CheckCircle2 className="text-emerald-500" aria-label="Meta atingida" /> : <Circle className="text-muted" aria-label="Meta em andamento" />}
                    <span className={cn('flex-1 text-sm font-semibold', done && 'line-through opacity-70')}>{g.label}</span>
                    <span className="text-xs text-muted">{v}/{g.target}</span>
                    <button onClick={() => setDel(g.id)} className="text-muted hover:text-red-500" aria-label={`Remover meta ${g.label}`}><Trash2 size={16} /></button>
                  </div>
                  {g.kind !== 'custom' && <ProgressBar value={(v / g.target) * 100} className="mt-2" label={g.label} />}
                </li>
              );
            })}
            {!u.goals.length && <li className="text-sm text-muted">Nenhuma meta ainda. Crie a primeira abaixo.</li>}
          </ul>
          <form onSubmit={submit} className="mt-5 grid gap-2 border-t border-line pt-4 sm:grid-cols-[1fr_90px_auto]">
            <div>
              <label htmlFor="g-kind" className="sr-only">Tipo de meta</label>
              <select id="g-kind" className="input py-2" value={kind} onChange={(e) => setKind(e.target.value as Goal['kind'])}>{Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              {kind === 'custom' && <><label htmlFor="g-label" className="sr-only">Descrição</label><input id="g-label" className="input mt-2 py-2" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex.: Revisar anotações de boxe" /></>}
            </div>
            {kind !== 'custom' ? <div><label htmlFor="g-target" className="sr-only">Alvo</label><input id="g-target" type="number" min={1} max={50} className="input py-2" value={target} onChange={(e) => setTarget(Number(e.target.value))} /></div> : <div />}
            <button className="btn-primary"><Plus size={16} />Adicionar</button>
            {err && <p className="text-sm text-red-500 sm:col-span-3" role="alert">{err}</p>}
          </form>
        </div>
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Conquistas</h2><Link to="/ranking" className="text-sm font-semibold text-accent">Ver todas →</Link></div>
          <ul className="space-y-3">
            {ACHIEVEMENTS.map((a) => {
              const Icon = ICONS[a.icon]; const on = !!u.unlocked[a.id]; const [p, t] = a.progress(s);
              return (
                <li key={a.id} className={cn('flex items-center gap-3', !on && 'opacity-60')}>
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', on ? 'bg-gradient-to-br from-primary to-vivid text-white' : 'bg-bg2 text-muted')}><Icon size={18} /></span>
                  <div className="flex-1"><p className="text-sm font-semibold">{a.name}</p><ProgressBar value={(p / t) * 100} className="mt-1 h-1.5" label={a.name} /></div>
                  <span className="text-xs text-muted">{on ? '✓' : `${p}/${t}`}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-3 font-bold">Cursos</h2>
        <ul className="space-y-3">
          {courses.filter((co) => co.modules.flatMap((m) => m.lessonIds).some((l) => u.completedLessons.includes(l))).map((co) => {
            const ids = co.modules.flatMap((m) => m.lessonIds); const n = ids.filter((l) => u.completedLessons.includes(l)).length;
            return (
              <li key={co.id}><Link to={`/aprender/${co.id}`} className="block rounded-xl p-2 hover:bg-bg2">
                <div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{co.title}</span><span className="text-muted">{n}/{ids.length} · {modalityName(co.modality)}</span></div>
                <ProgressBar value={(n / ids.length) * 100} label={co.title} />
              </Link></li>
            );
          })}
          {completedCourses(u, courses).length === 0 && u.completedLessons.length === 0 && <li className="text-sm text-muted">Você ainda não iniciou nenhum curso. <Link to="/aprender" className="text-accent">Explore a Fight Academy</Link>.</li>}
        </ul>
      </section>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} title="Remover meta?" message="A meta será removida da sua lista." confirmLabel="Remover" onConfirm={() => del && removeGoal(del)} />
    </div>
  );
}

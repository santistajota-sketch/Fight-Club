import { useMemo, useState, type FormEvent } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { ShieldAlert, Users, FileText, GraduationCap, CheckCircle2, HeartHandshake, Plus, Pencil, Trash2, Search, ShieldCheck } from 'lucide-react';
import { useStore, useAccount } from '../store/useStore';
import { useChartColors } from '../hooks/useChartColors';
import { ConfirmDialog, Modal, PageHeader, Tabs, EmptyState } from '../components/ui';
import { MODALITIES, modalityName } from '../data/modalities';
import { PROFILES } from '../data/profiles';
import { ANALYSIS_CATEGORIES } from '../data/analyses';
import { brl, uid, hashHue } from '../utils';
import { toast } from '../store/toast';
import type { Analysis, Course, Expert, FightEvent, Lesson, Post } from '../types';

type Entity = 'courses' | 'lessons' | 'posts' | 'events' | 'analyses' | 'experts';
type Field = { key: string; label: string; type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox'; options?: [string, string][]; required?: boolean; hint?: string };

const LEVELS: [string, string][] = [['Iniciante', 'Iniciante'], ['Intermediário', 'Intermediário'], ['Avançado', 'Avançado']];
const MODS: [string, string][] = MODALITIES.map((m) => [m.id, m.name]);

const sectionsToText = (a: Analysis) => a.sections.map((s) => `## ${s.heading}\n${s.body}${s.bullets ? '\n' + s.bullets.map((b) => `- ${b}`).join('\n') : ''}`).join('\n\n');
const textToSections = (t: string, prev?: Analysis) => t.split(/^## /m).map((b) => b.trim()).filter(Boolean).map((block) => {
  const [heading, ...rest] = block.split('\n');
  const bullets = rest.filter((l) => l.trim().startsWith('- ')).map((l) => l.trim().slice(2));
  const body = rest.filter((l) => !l.trim().startsWith('- ')).join(' ').trim();
  const diagram = prev?.sections.find((s) => s.heading === heading.trim())?.diagram;
  return { heading: heading.trim(), body, bullets: bullets.length ? bullets : undefined, diagram };
});

export default function Admin() {
  const acc = useAccount()!;
  const state = useStore();
  const { courses, lessons, posts, events, analyses, experts, users, accounts, upsert, remove, logout } = state;
  const c = useChartColors();
  const [tab, setTab] = useState<'dash' | Entity>('dash');
  const [editing, setEditing] = useState<{ entity: Entity; item?: Record<string, unknown> } | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [del, setDel] = useState<{ entity: Entity; id: string; label: string } | null>(null);
  const [q, setQ] = useState('');

  const fields: Record<Entity, Field[]> = useMemo(() => ({
    courses: [
      { key: 'title', label: 'Título', type: 'text', required: true }, { key: 'description', label: 'Descrição', type: 'textarea', required: true },
      { key: 'modality', label: 'Modalidade', type: 'select', options: MODS }, { key: 'level', label: 'Nível', type: 'select', options: LEVELS },
      { key: 'expertId', label: 'Especialista', type: 'select', options: experts.map((e) => [e.id, e.name]) },
      { key: 'type', label: 'Tipo', type: 'select', options: [['Curso', 'Curso'], ['Trilha', 'Trilha'], ['Workshop', 'Workshop']] },
      { key: 'students', label: 'Alunos (fictício)', type: 'number' }, { key: 'rating', label: 'Avaliação demo (0–5)', type: 'number' },
      { key: 'materials', label: 'Materiais (um por linha)', type: 'textarea' },
    ],
    lessons: [
      { key: 'title', label: 'Título', type: 'text', required: true }, { key: 'courseId', label: 'Curso', type: 'select', options: courses.map((x) => [x.id, x.title]) },
      { key: 'description', label: 'Descrição', type: 'textarea', required: true }, { key: 'minutes', label: 'Duração (min)', type: 'number' },
      { key: 'keyPoints', label: 'Pontos-chave (um por linha)', type: 'textarea', required: true },
    ],
    posts: [
      { key: 'authorId', label: 'Autor', type: 'select', options: [[acc.id, `${acc.name} (você)`], ...PROFILES.map((p) => [p.id, p.name] as [string, string])] },
      { key: 'text', label: 'Texto', type: 'textarea', required: true }, { key: 'modality', label: 'Modalidade', type: 'select', options: MODS },
      { key: 'hashtags', label: 'Hashtags (separadas por espaço)', type: 'text' }, { key: 'likes', label: 'Curtidas', type: 'number' },
    ],
    events: [
      { key: 'name', label: 'Nome', type: 'text', required: true }, { key: 'modality', label: 'Modalidade', type: 'select', options: MODS },
      { key: 'dayOffset', label: 'Dias a partir de hoje', type: 'number', hint: 'Negativo = já aconteceu; 0 = hoje' }, { key: 'durationDays', label: 'Duração (dias)', type: 'number' },
      { key: 'venue', label: 'Local (fictício)', type: 'text', required: true }, { key: 'city', label: 'Cidade', type: 'text', required: true },
      { key: 'description', label: 'Descrição', type: 'textarea' }, { key: 'featured', label: 'Destaque', type: 'checkbox' },
    ],
    analyses: [
      { key: 'title', label: 'Título', type: 'text', required: true }, { key: 'summary', label: 'Resumo', type: 'textarea', required: true },
      { key: 'category', label: 'Categoria', type: 'select', options: ANALYSIS_CATEGORIES.map((x) => [x, x]) }, { key: 'modality', label: 'Modalidade', type: 'select', options: MODS },
      { key: 'authorId', label: 'Autor', type: 'select', options: experts.map((e) => [e.id, e.name]) }, { key: 'level', label: 'Dificuldade', type: 'select', options: LEVELS },
      { key: 'readMinutes', label: 'Leitura (min)', type: 'number' },
      { key: 'sections', label: 'Conteúdo', type: 'textarea', required: true, hint: 'Use “## Título” para seções e “- item” para listas.' },
    ],
    experts: [
      { key: 'name', label: 'Nome fictício', type: 'text', required: true }, { key: 'modality', label: 'Modalidade principal', type: 'select', options: MODS },
      { key: 'specialties', label: 'Especialidades (separadas por vírgula)', type: 'text', required: true }, { key: 'rank', label: 'Graduação (simulada)', type: 'text' },
      { key: 'experience', label: 'Experiência', type: 'text' }, { key: 'level', label: 'Público', type: 'select', options: LEVELS },
      { key: 'bio', label: 'Biografia', type: 'textarea', required: true }, { key: 'students', label: 'Alunos (fictício)', type: 'number' }, { key: 'rating', label: 'Avaliação demo', type: 'number' },
    ],
  }), [experts, courses, acc]);

  if (acc.role !== 'admin') {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState icon={ShieldCheck} title="Área administrativa" text="O painel demonstrativo está disponível apenas para a conta Admin Demo. Saia e entre como administrador na tela inicial." action={<button className="btn-primary" onClick={logout}>Sair e entrar como admin</button>} />
      </div>
    );
  }

  const lists: Record<Entity, { id: string }[]> = { courses, lessons, posts, events, analyses, experts };
  const label = (e: Entity, x: Record<string, unknown>) => String(x.title ?? x.name ?? (x.text as string)?.slice(0, 60) ?? x.id);
  const sub = (e: Entity, x: Record<string, unknown>) => {
    if (e === 'lessons') return courses.find((co) => co.id === x.courseId)?.title ?? 'Sem curso';
    if (e === 'courses') return `${modalityName(x.modality as string)} · ${x.level} · ${experts.find((ex) => ex.id === x.expertId)?.name ?? '—'}`;
    if (e === 'posts') return `${modalityName(x.modality as string)} · ${x.likes} curtidas`;
    if (e === 'events') return `${modalityName(x.modality as string)} · ${x.city} · D${(x.dayOffset as number) >= 0 ? '+' : ''}${x.dayOffset}`;
    if (e === 'analyses') return `${x.category} · ${modalityName(x.modality as string)}`;
    return `${modalityName(x.modality as string)} · ${x.rank}`;
  };

  const open = (entity: Entity, item?: Record<string, unknown>) => {
    const f: Record<string, string | boolean> = {};
    fields[entity].forEach((fd) => {
      const v = item?.[fd.key];
      if (fd.key === 'sections' && item) f.sections = sectionsToText(item as unknown as Analysis);
      else if (Array.isArray(v)) f[fd.key] = fd.key === 'specialties' ? v.join(', ') : fd.key === 'hashtags' ? v.join(' ') : v.join('\n');
      else if (fd.type === 'checkbox') f[fd.key] = !!v;
      else f[fd.key] = v !== undefined ? String(v) : fd.type === 'select' ? fd.options?.[0]?.[0] ?? '' : fd.type === 'number' ? (fd.key === 'durationDays' ? '1' : fd.key === 'minutes' ? '10' : fd.key === 'readMinutes' ? '5' : fd.key === 'rating' ? '4.8' : fd.key === 'dayOffset' ? '7' : '0') : '';
    });
    setForm(f); setErrors({}); setEditing({ entity, item });
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { entity, item } = editing;
    const errs: Record<string, string> = {};
    fields[entity].forEach((fd) => { if (fd.required && !String(form[fd.key] ?? '').trim()) errs[fd.key] = 'Campo obrigatório.'; if (fd.type === 'number' && isNaN(Number(form[fd.key]))) errs[fd.key] = 'Informe um número.'; });
    if (form.rating !== undefined && (Number(form.rating) < 0 || Number(form.rating) > 5)) errs.rating = 'Use um valor entre 0 e 5.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const s = (k: string) => String(form[k] ?? '').trim();
    const n = (k: string) => Number(form[k] ?? 0);
    const lines = (k: string) => s(k).split('\n').map((x) => x.trim()).filter(Boolean);
    const id = (item?.id as string) ?? uid(entity.slice(0, 2));

    if (entity === 'courses') {
      const prev = item as unknown as Course | undefined;
      upsert('courses', { id, title: s('title'), description: s('description'), modality: s('modality') as Course['modality'], level: s('level') as Course['level'], expertId: s('expertId'), type: s('type') as Course['type'], students: n('students'), rating: n('rating'), materials: lines('materials'), modules: prev?.modules ?? [{ title: 'Módulo 1', lessonIds: [] }] });
    } else if (entity === 'lessons') {
      const prev = item as unknown as Lesson | undefined;
      const lesson: Lesson = { id, courseId: s('courseId'), title: s('title'), description: s('description'), minutes: n('minutes') || 10, keyPoints: lines('keyPoints') };
      upsert('lessons', lesson);
      if (!prev || prev.courseId !== lesson.courseId) {
        useStore.setState((st) => ({ courses: st.courses.map((co) => {
          let modules = co.modules.map((m) => ({ ...m, lessonIds: m.lessonIds.filter((l) => l !== id) }));
          if (co.id === lesson.courseId) { if (!modules.length) modules = [{ title: 'Módulo 1', lessonIds: [] }]; modules[modules.length - 1].lessonIds.push(id); }
          return { ...co, modules };
        }) }));
      }
    } else if (entity === 'posts') {
      const prev = item as unknown as Post | undefined;
      upsert('posts', { ...(prev ?? { ts: Date.now(), shares: 0, comments: [] }), id, authorId: s('authorId'), text: s('text'), modality: s('modality') as Post['modality'], hashtags: s('hashtags').split(/[\s,#]+/).filter(Boolean), likes: n('likes') } as Post);
    } else if (entity === 'events') {
      const prev = item as unknown as FightEvent | undefined;
      upsert('events', { ...(prev ?? { fights: [] }), id, name: s('name'), modality: s('modality') as FightEvent['modality'], dayOffset: Math.round(n('dayOffset')), durationDays: Math.max(1, Math.round(n('durationDays'))), venue: s('venue'), city: s('city'), description: s('description'), featured: !!form.featured } as FightEvent);
    } else if (entity === 'analyses') {
      const prev = item as unknown as Analysis | undefined;
      upsert('analyses', { id, title: s('title'), summary: s('summary'), category: s('category') as Analysis['category'], modality: s('modality') as Analysis['modality'], authorId: s('authorId'), level: s('level') as Analysis['level'], readMinutes: n('readMinutes') || 5, sections: textToSections(s('sections'), prev) });
    } else {
      const prev = item as unknown as Expert | undefined;
      upsert('experts', { ...(prev ?? { reviews: [], hue: hashHue(s('name')) }), id, name: s('name'), modality: s('modality') as Expert['modality'], specialties: s('specialties').split(',').map((x) => x.trim()).filter(Boolean), rank: s('rank'), experience: s('experience'), level: s('level') as Expert['level'], bio: s('bio'), students: n('students'), rating: n('rating') } as Expert);
    }
    toast(item ? 'Registro atualizado.' : 'Registro criado.', 'success');
    setEditing(null);
  };

  // métricas
  const allUsers = Object.values(users);
  const donationsTotal = allUsers.reduce((s, u) => s + u.donations.reduce((a, d) => a + d.amount, 0), 0);
  const lessonsDone = allUsers.reduce((s, u) => s + u.completedLessons.length, 0);
  const FICT = { users: 12480, lessons: 38920, donations: 7340 };
  const growth = ['jun', 'jul', 'ago', 'set', 'out', 'nov'].map((m, i) => ({ mes: m, membros: Math.round(6200 + i * i * 260 + i * 700), posts: 900 + i * 410 }));
  const modPop = MODALITIES.map((m) => ({ name: m.name, conteúdos: courses.filter((x) => x.modality === m.id).length * 3 + posts.filter((x) => x.modality === m.id).length + analyses.filter((x) => x.modality === m.id).length * 2 })).sort((a, b) => b.conteúdos - a.conteúdos);

  const TABS: { value: 'dash' | Entity; label: string }[] = [{ value: 'dash', label: 'Dashboard' }, { value: 'courses', label: 'Cursos' }, { value: 'lessons', label: 'Aulas' }, { value: 'posts', label: 'Publicações' }, { value: 'events', label: 'Eventos' }, { value: 'analyses', label: 'Conteúdos técnicos' }, { value: 'experts', label: 'Especialistas' }];
  const current = tab !== 'dash' ? (lists[tab] as unknown as Record<string, unknown>[]).filter((x) => !q || label(tab, x).toLowerCase().includes(q.toLowerCase())) : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Administração" title="Painel administrativo" />
      <p role="note" className="flex items-start gap-2 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100"><ShieldAlert size={18} className="mt-0.5 shrink-0" /><span><strong>Painel demonstrativo sem controles de segurança para produção.</strong> Alterações são salvas apenas neste navegador e refletem imediatamente nas páginas públicas. Use “Restaurar dados” nas Configurações para desfazer.</span></p>
      <Tabs label="Seções do painel" value={tab} onChange={(v) => { setTab(v); setQ(''); }} options={TABS} />

      {tab === 'dash' ? (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[[Users, (FICT.users + accounts.length).toLocaleString('pt-BR'), 'Usuários cadastrados*'], [FileText, posts.length, 'Publicações'], [GraduationCap, `${courses.length} / ${lessons.length}`, 'Cursos / aulas'], [CheckCircle2, (FICT.lessons + lessonsDone).toLocaleString('pt-BR'), 'Aulas concluídas*'], [FileText, analyses.length, 'Conteúdos técnicos'], [HeartHandshake, brl(FICT.donations + donationsTotal), 'Contribuições simuladas*']].map(([I, v, l]) => {
              const Icon = I as typeof Users;
              return <div key={l as string} className="card p-4"><Icon size={18} className="text-accent" /><p className="mt-2 font-display text-3xl">{v as string}</p><p className="text-xs text-muted">{l as string}</p></div>;
            })}
          </section>
          <p className="text-xs text-muted">* Inclui valores-base fictícios de demonstração somados às atividades locais.</p>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-4 font-bold">Crescimento demonstrativo da comunidade</h2>
              <div className="h-64"><ResponsiveContainer><LineChart data={growth}><CartesianGrid stroke={c.grid} vertical={false} /><XAxis dataKey="mes" tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} width={44} /><Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.grid}`, borderRadius: 12 }} /><Line type="monotone" dataKey="membros" stroke={c.primary} strokeWidth={3} dot={false} /><Line type="monotone" dataKey="posts" stroke={c.series[2]} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>
            </div>
            <div className="card p-5">
              <h2 className="mb-4 font-bold">Modalidades populares (por volume de conteúdo)</h2>
              <div className="h-64"><ResponsiveContainer><BarChart data={modPop} layout="vertical" margin={{ left: 10 }}><CartesianGrid stroke={c.grid} horizontal={false} /><XAxis type="number" tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" tick={{ fill: c.text, fontSize: 11 }} axisLine={false} tickLine={false} width={90} /><Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.grid}`, borderRadius: 12 }} cursor={{ fill: c.grid, opacity: 0.4 }} /><Bar dataKey="conteúdos" fill={c.primary} radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
            </div>
          </section>
        </>
      ) : (
        <section className="card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1"><label htmlFor="adm-q" className="sr-only">Filtrar registros</label><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input id="adm-q" className="input pl-9" placeholder="Filtrar…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <span className="text-sm text-muted">{current.length} registro(s)</span>
            <button className="btn-primary" onClick={() => open(tab)}><Plus size={16} />Novo</button>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Registros de {TABS.find((t) => t.value === tab)?.label}</caption>
              <thead className="sticky top-0 bg-bg2 text-left text-xs uppercase tracking-wider text-muted"><tr><th className="p-3">Registro</th><th className="hidden p-3 md:table-cell">Detalhes</th><th className="p-3 text-right">Ações</th></tr></thead>
              <tbody>
                {current.map((x) => (
                  <tr key={x.id as string} className="border-t border-line">
                    <td className="max-w-xs truncate p-3 font-semibold">{label(tab, x)}</td>
                    <td className="hidden p-3 text-muted md:table-cell">{sub(tab, x)}</td>
                    <td className="whitespace-nowrap p-3 text-right">
                      <button className="icon-btn mr-1 h-8 w-8" onClick={() => open(tab, x)} aria-label={`Editar ${label(tab, x)}`}><Pencil size={15} /></button>
                      <button className="icon-btn h-8 w-8 hover:text-red-500" onClick={() => setDel({ entity: tab, id: x.id as string, label: label(tab, x) })} aria-label={`Excluir ${label(tab, x)}`}><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!current.length && <p className="p-6 text-center text-sm text-muted">Nenhum registro.</p>}
          </div>
        </section>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`${editing?.item ? 'Editar' : 'Novo'} — ${TABS.find((t) => t.value === editing?.entity)?.label ?? ''}`} wide>
        {editing && (
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2" noValidate>
            {fields[editing.entity].map((fd) => (
              <div key={fd.key} className={fd.type === 'textarea' ? 'sm:col-span-2' : ''}>
                {fd.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 pt-7 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-[rgb(var(--primary))]" checked={!!form[fd.key]} onChange={(e) => setForm((p) => ({ ...p, [fd.key]: e.target.checked }))} />{fd.label}</label>
                ) : (
                  <>
                    <label htmlFor={`fd-${fd.key}`} className="label">{fd.label}{fd.required && <span className="text-red-500"> *</span>}</label>
                    {fd.type === 'textarea' ? <textarea id={`fd-${fd.key}`} rows={fd.key === 'sections' ? 10 : 3} className="input font-[inherit]" value={String(form[fd.key] ?? '')} onChange={(e) => setForm((p) => ({ ...p, [fd.key]: e.target.value }))} aria-invalid={!!errors[fd.key]} />
                      : fd.type === 'select' ? <select id={`fd-${fd.key}`} className="input" value={String(form[fd.key] ?? '')} onChange={(e) => setForm((p) => ({ ...p, [fd.key]: e.target.value }))}>{fd.options?.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                      : <input id={`fd-${fd.key}`} type={fd.type} step="any" className="input" value={String(form[fd.key] ?? '')} onChange={(e) => setForm((p) => ({ ...p, [fd.key]: e.target.value }))} aria-invalid={!!errors[fd.key]} />}
                  </>
                )}
                {fd.hint && <p className="mt-1 text-xs text-muted">{fd.hint}</p>}
                {errors[fd.key] && <p className="mt-1 text-sm text-red-500">{errors[fd.key]}</p>}
              </div>
            ))}
            <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button><button className="btn-primary">Salvar</button></div>
          </form>
        )}
      </Modal>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)} title="Excluir registro?" confirmLabel="Excluir"
        message={`“${del?.label}” será removido localmente${del?.entity === 'courses' ? ' junto com suas aulas' : del?.entity === 'experts' ? '. Cursos desse especialista ficarão sem professor' : ''}.`}
        onConfirm={() => { if (del) { remove(del.entity, del.id); toast('Registro excluído.', 'success'); } }} />
    </div>
  );
}

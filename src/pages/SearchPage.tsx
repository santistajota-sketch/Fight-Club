import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, GraduationCap, Users, Award, ScanSearch, CalendarDays, Layers, UserCircle2, PlayCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuthorLookup } from '../hooks/useContent';
import { EmptyState, PageHeader, Tabs } from '../components/ui';
import { MODALITIES, modalityName } from '../data/modalities';
import { PROFILES } from '../data/profiles';
import { FIGHTERS } from '../data/events';

type Cat = 'all' | 'course' | 'lesson' | 'expert' | 'profile' | 'post' | 'analysis' | 'event' | 'modality';
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function SearchPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const q = params.get('q') ?? '';
  const [cat, setCat] = useState<Cat>('all');
  const { courses, lessons, experts, posts, analyses, events } = useStore();
  const author = useAuthorLookup();

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return [];
    const has = (...f: string[]) => f.some((x) => norm(x).includes(t));
    return [
      ...courses.filter((c) => has(c.title, c.description, modalityName(c.modality))).map((c) => ({ cat: 'course' as const, id: c.id, title: c.title, sub: `Curso · ${modalityName(c.modality)} · ${c.level}`, link: `/aprender/${c.id}`, icon: GraduationCap })),
      ...lessons.filter((l) => has(l.title, l.description)).map((l) => ({ cat: 'lesson' as const, id: l.id, title: l.title, sub: `Aula · ${courses.find((c) => c.id === l.courseId)?.title ?? ''}`, link: `/aprender/${l.courseId}?aula=${l.id}`, icon: PlayCircle })),
      ...experts.filter((e) => has(e.name, e.bio, ...e.specialties, modalityName(e.modality))).map((e) => ({ cat: 'expert' as const, id: e.id, title: e.name, sub: `Treinador(a) · ${modalityName(e.modality)}`, link: `/especialistas/${e.id}`, icon: Award })),
      ...PROFILES.filter((p) => has(p.name, p.handle, p.bio)).map((p) => ({ cat: 'profile' as const, id: p.id, title: p.name, sub: `${p.isAthlete ? 'Atleta fictício' : 'Membro'} · @${p.handle}`, link: `/perfil/${p.id}`, icon: UserCircle2 })),
      ...FIGHTERS.filter((f) => has(f.name, f.nickname, f.team)).map((f) => {
        const ev = events.find((e) => e.fights.some((x) => x.a === f.id || x.b === f.id));
        return { cat: 'profile' as const, id: f.id, title: `${f.name} “${f.nickname}”`, sub: `Atleta fictício · ${f.record} · ${f.team}`, link: ev ? `/eventos/${ev.id}` : '/eventos', icon: UserCircle2 };
      }),
      ...posts.filter((p) => has(p.text, ...p.hashtags)).map((p) => ({ cat: 'post' as const, id: p.id, title: p.text.slice(0, 100), sub: `Publicação de ${author(p.authorId).name}`, link: `/comunidade/post/${p.id}`, icon: Users })),
      ...analyses.filter((a) => has(a.title, a.summary, a.category)).map((a) => ({ cat: 'analysis' as const, id: a.id, title: a.title, sub: `Análise · ${a.category}`, link: `/analises/${a.id}`, icon: ScanSearch })),
      ...events.filter((e) => has(e.name, e.city, e.venue)).map((e) => ({ cat: 'event' as const, id: e.id, title: e.name, sub: `Evento · ${e.city}`, link: `/eventos/${e.id}`, icon: CalendarDays })),
      ...MODALITIES.filter((m) => has(m.name, m.short, m.description)).map((m) => ({ cat: 'modality' as const, id: m.id, title: m.name, sub: `Modalidade · ${m.short}`, link: `/modalidades/${m.id}`, icon: Layers })),
    ];
  }, [q, courses, lessons, experts, posts, analyses, events, author]);

  const shown = results.filter((r) => cat === 'all' || r.cat === cat);
  const count = (c: Cat) => results.filter((r) => r.cat === c).length;
  const LABEL: Record<Exclude<Cat, 'all'>, string> = { course: 'Cursos', lesson: 'Aulas', expert: 'Treinadores', profile: 'Atletas e perfis', post: 'Publicações', analysis: 'Análises', event: 'Eventos', modality: 'Modalidades' };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Busca global" title={q ? `“${q}”` : 'Buscar'} />
      <div className="relative mb-5 md:hidden">
        <label htmlFor="m-search" className="sr-only">Buscar</label>
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input id="m-search" autoFocus className="input pl-10" value={q} onChange={(e) => nav(`/busca?q=${encodeURIComponent(e.target.value)}`, { replace: true })} placeholder="Cursos, atletas, análises…" />
      </div>
      {q.trim() ? (
        <>
          <div className="mb-4"><Tabs<Cat> label="Categoria" value={cat} onChange={setCat} options={[{ value: 'all', label: 'Tudo', count: results.length }, ...(Object.keys(LABEL) as Exclude<Cat, 'all'>[]).filter((c) => count(c)).map((c) => ({ value: c, label: LABEL[c], count: count(c) }))]} /></div>
          <p className="sr-only" aria-live="polite">{shown.length} resultados</p>
          {shown.length ? (
            <ul className="card divide-y divide-line overflow-hidden">
              {shown.map((r) => (
                <li key={r.cat + r.id}><Link to={r.link} className="flex items-center gap-3 p-4 hover:bg-bg2">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-accent"><r.icon size={18} /></span>
                  <div className="min-w-0"><p className="truncate font-semibold">{r.title}</p><p className="truncate text-xs text-muted">{r.sub}</p></div>
                </Link></li>
              ))}
            </ul>
          ) : <EmptyState icon={Search} title="Nenhum resultado" text={`Não encontramos nada para “${q}”. Tente outro termo, como “jab”, “guarda” ou “Muay Thai”.`} />}
        </>
      ) : (
        <div className="card p-6">
          <p className="mb-3 text-sm text-muted">Sugestões de busca:</p>
          <div className="flex flex-wrap gap-2">{['jab', 'guarda', 'Muay Thai', 'quedas', 'Helena', 'Grand Prix', 'cardio', 'defesa pessoal'].map((s) => <Link key={s} to={`/busca?q=${encodeURIComponent(s)}`} className="chip">{s}</Link>)}</div>
        </div>
      )}
    </div>
  );
}

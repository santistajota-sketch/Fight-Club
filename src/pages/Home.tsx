import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, GraduationCap, Users, Zap, PlayCircle, Sparkles, Trophy } from 'lucide-react';
import { useStore, useAccount, useUserData, computeStats, challengeProgress, courseLessonIds } from '../store/useStore';
import { useFavorites, useCourseProgress, eventStatus, eventDate } from '../hooks/useContent';
import { useFakeLoading } from '../hooks/useFakeLoading';
import { HeroArt } from '../components/HeroArt';
import { CourseCard, PostCard, AnalysisCard, EventCard, ExpertCard } from '../components/cards';
import { Cover } from '../components/Cover';
import { Avatar, ProgressBar, SectionHeader } from '../components/ui';
import { MODALITIES, modalityName } from '../data/modalities';
import { PROFILES } from '../data/profiles';
import { CHALLENGES, levelFor } from '../data/gamification';
import { weekKey, compact } from '../utils';

function Skeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando">
      <div className="skeleton h-72 rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}</div>
    </div>
  );
}

export default function Home() {
  const loading = useFakeLoading();
  const acc = useAccount()!;
  const u = useUserData();
  const favs = useFavorites();
  const { courses, lessons, posts, analyses, events, experts } = useStore();
  const prog = useCourseProgress();
  const stats = computeStats(u, courses);
  const lvl = levelFor(u.xp);

  const rank = (m: string) => (favs.includes(m as never) ? 0 : 1);
  const recCourses = useMemo(() => [...courses].sort((a, b) => rank(a.modality) - rank(b.modality) || b.students - a.students).filter((c) => prog(c).pct < 100).slice(0, 8), [courses, favs, prog]);
  const hubPosts = useMemo(() => [...posts].filter((p) => favs.includes(p.modality)).sort((a, b) => b.ts - a.ts).slice(0, 2), [posts, favs]);
  const hubExperts = experts.filter((e) => favs.includes(e.modality)).slice(0, 3);
  const upcoming = [...events].filter((e) => eventStatus(e) !== 'Encerrado').sort((a, b) => a.dayOffset - b.dayOffset);
  const hubEvent = upcoming.find((e) => favs.includes(e.modality)) ?? upcoming[0];
  const popularAnalyses = [...analyses].sort((a, b) => (favs.includes(b.modality) ? 1 : 0) - (favs.includes(a.modality) ? 1 : 0)).slice(0, 4);
  const latestPosts = [...posts].sort((a, b) => b.ts - a.ts).slice(0, 3);
  const ranking = [...PROFILES.map((p) => ({ id: p.id, name: p.name, hue: p.hue, xp: p.xp, me: false, preset: undefined as number | undefined })), { id: acc.id, name: acc.name, hue: undefined, xp: u.xp, me: true, preset: acc.avatar }].sort((a, b) => b.xp - a.xp);
  const myPos = ranking.findIndex((r) => r.me) + 1;
  const claimed = u.claimed[weekKey()] ?? [];

  const last = u.lastLesson && lessons.find((l) => l.id === u.lastLesson!.lessonId);
  const lastCourse = last && courses.find((c) => c.id === last.courseId);
  const featuredCourse = recCourses[0];
  const featuredAnalysis = popularAnalyses[0];

  if (loading) return <Skeleton />;

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-bg2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(var(--primary)/0.25),transparent_60%)]" />
        <div className="relative grid items-center gap-6 p-6 md:p-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent"><Sparkles size={14} />Olá, {acc.name.split(' ')[0]}</p>
            <h1 className="h-display text-5xl sm:text-6xl xl:text-7xl">FIGHT FLOW — <span className="bg-gradient-to-r from-primary to-vivid bg-clip-text text-transparent">CONHECIMENTO. COMUNIDADE. EVOLUÇÃO.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-muted">O universo das lutas em um só lugar. Aprenda com especialistas, acompanhe o esporte e evolua dentro e fora do tatame.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/aprender" className="btn-primary px-6 py-3 text-base"><GraduationCap size={19} />Explorar aulas</Link>
              <Link to="/comunidade" className="btn-ghost px-6 py-3 text-base"><Users size={19} />Entrar na comunidade</Link>
            </div>
            <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[['Fight XP', compact(u.xp)], ['Nível', `${lvl.level}`], ['Sequência', `${stats.streak} dia${stats.streak === 1 ? '' : 's'}`]].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-bg/60 p-3"><dt className="text-[11px] font-bold uppercase tracking-wider text-muted">{k}</dt><dd className="mt-0.5 truncate font-display text-2xl tracking-wide">{v}</dd></div>
              ))}
            </dl>
          </div>
          <HeroArt className="mx-auto w-full max-w-md" />
        </div>
      </section>

      {/* FIGHT HUB */}
      <section aria-labelledby="hub">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="hub" className="section-title flex items-center gap-2"><Zap className="text-accent" />Fight Hub</h2>
            <p className="text-sm text-muted">Recomendações com base nas suas modalidades favoritas: {favs.map(modalityName).join(', ')}.</p>
          </div>
          <Link to="/modalidades" className="text-sm font-semibold text-accent hover:underline">Ajustar favoritas →</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {last && lastCourse ? (
            <Link to={`/aprender/${lastCourse.id}?aula=${last.id}`} className="card card-hover group relative overflow-hidden lg:col-span-2">
              <Cover seed={lastCourse.id} modality={lastCourse.modality} className="absolute inset-0" big />
              <div className="relative flex h-full min-h-56 flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/80">Continue de onde parou</p>
                <h3 className="font-display text-3xl tracking-wide">{last.title}</h3>
                <p className="text-sm text-white/80">{lastCourse.title}</p>
                <div className="mt-3 flex items-center gap-3"><ProgressBar value={prog(lastCourse).pct} className="max-w-xs bg-white/25" /><span className="text-sm font-semibold">{prog(lastCourse).pct}%</span></div>
                <span className="btn mt-4 w-fit bg-white text-black"><PlayCircle size={18} />Continuar aula</span>
              </div>
            </Link>
          ) : featuredCourse && (
            <div className="lg:col-span-2"><CourseCard course={featuredCourse} /></div>
          )}
          <div className="flex flex-col gap-4">
            {hubEvent && <EventCard e={hubEvent} />}
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">{hubPosts.map((p) => <PostCard key={p.id} post={p} />)}</div>
          <div className="card p-5">
            <h3 className="mb-3 font-bold">Especialistas para você</h3>
            <ul className="space-y-3">
              {hubExperts.map((e) => (
                <li key={e.id}><Link to={`/especialistas/${e.id}`} className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-bg2">
                  <Avatar name={e.name} hue={e.hue} size={44} />
                  <div className="min-w-0"><p className="truncate font-semibold">{e.name}</p><p className="text-xs text-muted">{modalityName(e.modality)} · {e.specialties[0]}</p></div>
                </Link></li>
              ))}
              {!hubExperts.length && <li className="text-sm text-muted">Escolha modalidades favoritas para ver especialistas.</li>}
            </ul>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section>
        <SectionHeader title="Conteúdos em destaque" subtitle="Seleção da semana na Fight Flow" />
        <div className="grid gap-4 md:grid-cols-2">
          {featuredAnalysis && (
            <Link to={`/analises/${featuredAnalysis.id}`} className="card card-hover relative min-h-64 overflow-hidden">
              <Cover seed={featuredAnalysis.id + 'f'} modality={featuredAnalysis.modality} className="absolute inset-0" variant={3} big />
              <div className="relative flex h-full flex-col justify-end bg-gradient-to-t from-black/85 to-transparent p-6 text-white">
                <span className="badge w-fit bg-white/20 text-white">Fight Breakdown</span>
                <h3 className="mt-2 font-display text-3xl tracking-wide">{featuredAnalysis.title}</h3>
                <p className="text-sm text-white/80">{featuredAnalysis.summary}</p>
              </div>
            </Link>
          )}
          {upcoming[0] && (
            <Link to={`/eventos/${upcoming[0].id}`} className="card card-hover relative min-h-64 overflow-hidden">
              <Cover seed={upcoming[0].id + 'f'} modality={upcoming[0].modality} className="absolute inset-0" variant={1} big />
              <div className="relative flex h-full flex-col justify-end bg-gradient-to-t from-black/85 to-transparent p-6 text-white">
                <span className="badge w-fit bg-red-600 text-white">{eventStatus(upcoming[0])}</span>
                <h3 className="mt-2 font-display text-3xl tracking-wide">{upcoming[0].name}</h3>
                <p className="text-sm text-white/80">{new Date(eventDate(upcoming[0])).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} · {upcoming[0].city}</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Aulas recomendadas" subtitle="Fight Academy · priorizando suas modalidades" to="/aprender" />
        <div className="scroll-x">{recCourses.map((c) => <CourseCard key={c.id} course={c} className="w-72" />)}</div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeader title="Últimas publicações" to="/comunidade" linkLabel="Ir para a comunidade" />
          <div className="space-y-4">{latestPosts.map((p) => <PostCard key={p.id} post={p} />)}</div>
        </div>
        <div className="space-y-8">
          <div>
            <SectionHeader title="Seu progresso" to="/progresso" linkLabel="Detalhes" />
            <div className="card space-y-4 p-5">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">Nível {lvl.level} · {lvl.name}</span><span className="text-xs text-muted">{u.xp} / {lvl.next} XP</span></div>
              <ProgressBar value={lvl.pct} label="Progresso para o próximo nível" />
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['Aulas', stats.lessons], ['Cursos', stats.courses], ['Análises', stats.analyses]].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-bg2 p-3"><p className="font-display text-3xl">{v}</p><p className="text-xs text-muted">{k}</p></div>
                ))}
              </div>
              <p className="flex items-center gap-2 text-sm"><Flame size={16} className="text-orange-500" />Sequência de estudo: <strong>{stats.streak} dia(s)</strong></p>
            </div>
          </div>
          <div>
            <SectionHeader title="Desafios da semana" to="/ranking" linkLabel="Fight Challenges" />
            <div className="card divide-y divide-line">
              {CHALLENGES.slice(0, 4).map((c) => {
                const p = Math.min(challengeProgress(u, c.metric, favs), c.target);
                const done = claimed.includes(c.id);
                return (
                  <div key={c.id} className="p-4">
                    <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-semibold">{c.title}</span><span className="text-xs text-muted">{done ? 'Resgatado ✓' : `${p}/${c.target}`}</span></div>
                    <ProgressBar value={(p / c.target) * 100} label={c.title} />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <SectionHeader title="Ranking" to="/ranking" />
            <ol className="card divide-y divide-line">
              {ranking.slice(0, 5).map((r, i) => (
                <li key={r.id} className="flex items-center gap-3 p-3">
                  <span className="w-6 text-center font-display text-xl text-muted">{i + 1}</span>
                  <Avatar name={r.name} hue={r.hue} preset={r.preset} size={34} />
                  <span className="flex-1 truncate text-sm font-semibold">{r.name}{r.me && ' (você)'}</span>
                  <span className="text-xs font-bold text-accent">{compact(r.xp)} XP</span>
                </li>
              ))}
              {myPos > 5 && <li className="flex items-center gap-3 bg-primary/10 p-3"><span className="w-6 text-center font-display text-xl">{myPos}</span><Trophy size={18} className="text-accent" /><span className="flex-1 text-sm font-semibold">Você</span><span className="text-xs font-bold text-accent">{u.xp} XP</span></li>}
            </ol>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Análises populares" subtitle="Fight Breakdown" to="/analises" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{popularAnalyses.map((a) => <AnalysisCard key={a.id} a={a} />)}</div>
      </section>

      <section>
        <SectionHeader title="Próximos eventos" subtitle="Calendário demonstrativo" to="/eventos" />
        <div className="scroll-x">{upcoming.slice(0, 6).map((e) => <EventCard key={e.id} e={e} className="w-80" />)}</div>
      </section>

      <section>
        <SectionHeader title="Especialistas em destaque" to="/especialistas" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">{[...experts].sort((a, b) => b.students - a.students).slice(0, 5).map((e) => <ExpertCard key={e.id} e={e} />)}</div>
      </section>

      <section>
        <SectionHeader title="Modalidades mais acessadas" to="/modalidades" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...MODALITIES].sort((a, b) => b.popularity - a.popularity).slice(0, 5).map((m) => (
            <Link key={m.id} to={`/modalidades/${m.id}`} className="card card-hover group relative h-36 overflow-hidden">
              <Cover seed={m.id} modality={m.id} className="absolute inset-0" />
              <div className="relative flex h-full flex-col justify-end p-4 text-white">
                <p className="font-display text-2xl tracking-wide">{m.name}</p>
                <p className="flex items-center gap-1 text-xs text-white/80">{m.popularity}% de interesse <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

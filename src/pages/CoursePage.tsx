import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight, Download, FileText, MessageCircleQuestion, NotebookPen, Info, Undo2, Users, Clock, BookOpen } from 'lucide-react';
import { useStore, useUserData, courseLessonIds } from '../store/useStore';
import { useCourseProgress, courseMinutes } from '../hooks/useContent';
import { SimPlayer } from '../components/SimPlayer';
import { Avatar, EmptyState, FollowButton, LevelPill, ProgressBar, SaveButton, Stars, Tabs } from '../components/ui';
import { modalityName } from '../data/modalities';
import { cn, compact, downloadText, timeAgo } from '../utils';

type Tab = 'overview' | 'notes' | 'materials' | 'qa';

export default function CoursePage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const course = useStore((s) => s.courses.find((c) => c.id === id));
  const lessons = useStore((s) => s.lessons);
  const experts = useStore((s) => s.experts);
  const questions = useStore((s) => s.questions).filter((q) => q.courseId === id);
  const { completeLesson, uncompleteLesson, setNote, setLastLesson, askQuestion } = useStore();
  const u = useUserData();
  const prog = useCourseProgress();
  const [tab, setTab] = useState<Tab>((params.get('tab') as Tab) || 'overview');
  const [question, setQuestion] = useState('');
  const [qErr, setQErr] = useState('');
  const [savedNote, setSavedNote] = useState(false);

  const ids = course ? courseLessonIds(course) : [];
  const currentId = params.get('aula') && ids.includes(params.get('aula')!) ? params.get('aula')! : ids.find((x) => !u.completedLessons.includes(x)) ?? ids[0];
  const lesson = lessons.find((l) => l.id === currentId);
  const idx = ids.indexOf(currentId ?? '');
  const next = idx >= 0 ? lessons.find((l) => l.id === ids[idx + 1]) : undefined;
  const expert = experts.find((e) => e.id === course?.expertId);
  const [note, setNoteText] = useState('');

  useEffect(() => { if (course && lesson) setLastLesson(course.id, lesson.id); setNoteText(u.notes[lesson?.id ?? ''] ?? ''); }, [lesson?.id]);
  useEffect(() => {
    if (!lesson) return;
    if ((u.notes[lesson.id] ?? '') === note) return;
    const t = setTimeout(() => { setNote(lesson.id, note); setSavedNote(true); setTimeout(() => setSavedNote(false), 1500); }, 600);
    return () => clearTimeout(t);
  }, [note]);

  const goTo = (lid: string) => { setParams({ aula: lid }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const materials = useMemo(() => course?.materials ?? [], [course]);
  if (!course) return <EmptyState title="Curso não encontrado" action={<Link to="/aprender" className="btn-primary">Ver cursos</Link>} />;
  const p = prog(course);
  const done = lesson ? u.completedLessons.includes(lesson.id) : false;

  const ask = (e: FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 5) { setQErr('Escreva uma pergunta com pelo menos 5 caracteres.'); return; }
    askQuestion(course.id, question.trim()); setQuestion(''); setQErr('');
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Trilha de navegação" className="flex items-center gap-1 text-sm text-muted">
        <Link to="/aprender" className="hover:text-fg">Fight Academy</Link><ChevronRight size={14} /><span className="truncate text-fg">{course.title}</span>
      </nav>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-accent">{modalityName(course.modality)} <LevelPill level={course.level} /><span className="badge bg-bg2 text-muted">{course.type}</span></div>
          <h1 className="h-display text-4xl md:text-5xl">{course.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1"><BookOpen size={14} />{ids.length} aulas</span>
            <span className="inline-flex items-center gap-1"><Clock size={14} />{courseMinutes(course, lessons)} min</span>
            <span className="inline-flex items-center gap-1"><Users size={14} />{compact(course.students)} alunos (fictício)</span>
            <Stars value={course.rating} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48"><div className="mb-1 flex justify-between text-xs font-semibold"><span>Progresso</span><span>{p.done}/{p.total} · {p.pct}%</span></div><ProgressBar value={p.pct} label="Progresso do curso" /></div>
          <SaveButton type="course" id={course.id} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-5">
          {lesson ? (
            <>
              <SimPlayer lesson={lesson} modality={course.modality} completed={done} onComplete={() => completeLesson(lesson.id)} />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">Aula {idx + 1} de {ids.length} · {lesson.minutes} min</p>
                  <h2 className="font-display text-3xl tracking-wide">{lesson.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SaveButton type="lesson" id={lesson.id} compact />
                  {done ? (
                    <button className="btn-ghost" onClick={() => uncompleteLesson(lesson.id)}><Undo2 size={16} />Desmarcar</button>
                  ) : (
                    <button className="btn-primary" onClick={() => completeLesson(lesson.id)}><CheckCircle2 size={16} />Concluir aula</button>
                  )}
                  {next && <button className="btn-ghost" onClick={() => goTo(next.id)}>Próxima aula<ChevronRight size={16} /></button>}
                </div>
              </div>
              {done && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">✓ Aula concluída. {next ? `Próxima: “${next.title}”.` : p.pct === 100 ? 'Você concluiu o curso inteiro! 🎓' : ''}</p>}

              <Tabs<Tab> label="Conteúdo da aula" value={tab} onChange={setTab} options={[
                { value: 'overview', label: 'Visão geral' }, { value: 'notes', label: 'Anotações' },
                { value: 'materials', label: 'Materiais', count: materials.length }, { value: 'qa', label: 'Perguntas', count: questions.length },
              ]} />

              {tab === 'overview' && (
                <div className="card space-y-4 p-5">
                  <div><h3 className="mb-1 flex items-center gap-2 font-bold"><Info size={16} />Descrição da aula</h3><p className="text-muted">{lesson.description}</p></div>
                  <div><h3 className="mb-2 font-bold">Pontos-chave</h3><ul className="space-y-1.5">{lesson.keyPoints.map((k) => <li key={k} className="flex gap-2 text-sm"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />{k}</li>)}</ul></div>
                  <p className="rounded-lg bg-bg2 p-3 text-xs text-muted">Conteúdo educativo demonstrativo. Pratique sempre com supervisão de um profissional qualificado e respeite seus limites. O progresso aqui é de aprendizado digital, não de desempenho esportivo real.</p>
                </div>
              )}
              {tab === 'notes' && (
                <div className="card p-5">
                  <div className="mb-2 flex items-center justify-between"><label htmlFor="notes" className="flex items-center gap-2 font-bold"><NotebookPen size={16} />Minhas anotações — {lesson.title}</label><span className="text-xs text-muted" aria-live="polite">{savedNote ? 'Salvo ✓' : 'Salvamento automático'}</span></div>
                  <textarea id="notes" rows={7} className="input" value={note} onChange={(e) => setNoteText(e.target.value)} placeholder="Anote detalhes, dúvidas e o que quer praticar…" />
                </div>
              )}
              {tab === 'materials' && (
                <ul className="card divide-y divide-line">
                  {materials.map((m) => (
                    <li key={m} className="flex items-center gap-3 p-4">
                      <FileText size={20} className="text-accent" />
                      <div className="flex-1"><p className="font-semibold">{m}</p><p className="text-xs text-muted">Material complementar fictício (.txt)</p></div>
                      <button className="btn-ghost" onClick={() => downloadText(`${m.replace(/[^\wÀ-ú ]/g, '').replace(/\s+/g, '-').toLowerCase()}.txt`,
                        `FIGHT FLOW — MATERIAL DEMONSTRATIVO\n\nCurso: ${course.title}\nMaterial: ${m}\nInstrutor(a): ${expert?.name}\n\nPontos-chave do curso:\n${ids.map((x, i) => { const l = lessons.find((y) => y.id === x); return l ? `${i + 1}. ${l.title}\n   - ${l.keyPoints.join('\n   - ')}` : ''; }).join('\n')}\n\nConteúdo fictício para fins de demonstração.`)}><Download size={16} />Baixar</button>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'qa' && (
                <div className="space-y-4">
                  <form onSubmit={ask} className="card p-4">
                    <label htmlFor="q" className="label flex items-center gap-2"><MessageCircleQuestion size={16} />Pergunte ao instrutor</label>
                    <div className="flex gap-2"><input id="q" className="input" value={question} onChange={(e) => { setQuestion(e.target.value); setQErr(''); }} placeholder="Sua dúvida sobre o curso…" aria-invalid={!!qErr} /><button className="btn-primary">Enviar</button></div>
                    {qErr && <p className="mt-1 text-sm text-red-500" role="alert">{qErr}</p>}
                    <p className="mt-2 text-xs text-muted">Respostas são simuladas e aparecem em alguns segundos.</p>
                  </form>
                  {questions.map((q) => (
                    <div key={q.id} className="card p-4">
                      <p className="text-sm"><strong>{q.author}</strong> <span className="text-xs text-muted">· {timeAgo(q.ts)}</span></p>
                      <p className="mt-1">{q.text}</p>
                      {q.answer ? (
                        <div className="mt-3 flex gap-3 rounded-xl bg-bg2 p-3"><Avatar name={expert?.name ?? 'Instrutor'} hue={expert?.hue} size={30} /><div><p className="text-xs font-bold text-accent">{expert?.name} · instrutor</p><p className="text-sm">{q.answer}</p></div></div>
                      ) : <p className="mt-2 animate-pulse text-xs text-muted">Aguardando resposta do instrutor…</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : <EmptyState title="Este curso ainda não tem aulas" text="O administrador pode adicionar aulas no painel." />}
        </div>

        <aside className="space-y-4">
          <div className="card overflow-hidden">
            <h2 className="border-b border-line p-4 font-bold">Conteúdo do curso</h2>
            {course.modules.map((m) => (
              <div key={m.title}>
                <p className="bg-bg2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">{m.title}</p>
                <ul>
                  {m.lessonIds.map((lid) => {
                    const l = lessons.find((x) => x.id === lid); if (!l) return null;
                    const isDone = u.completedLessons.includes(lid);
                    return (
                      <li key={lid}>
                        <button onClick={() => goTo(lid)} aria-current={lid === currentId ? 'true' : undefined}
                          className={cn('flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-bg2', lid === currentId && 'bg-primary/10')}>
                          {isDone ? <CheckCircle2 size={18} className="shrink-0 text-emerald-500" aria-label="Concluída" /> : <Circle size={18} className="shrink-0 text-muted" aria-label="Não concluída" />}
                          <span className={cn('flex-1', lid === currentId && 'font-semibold text-accent')}>{l.title}</span>
                          <span className="text-xs text-muted">{l.minutes}m</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          {expert && (
            <div className="card p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Professor(a)</p>
              <Link to={`/especialistas/${expert.id}`} className="flex items-center gap-3"><Avatar name={expert.name} hue={expert.hue} size={52} /><div><p className="font-bold hover:underline">{expert.name}</p><p className="text-xs text-muted">{expert.rank}</p></div></Link>
              <p className="mt-3 line-clamp-4 text-sm text-muted">{expert.bio}</p>
              <div className="mt-3"><FollowButton id={expert.id} label={expert.name} small /></div>
            </div>
          )}
          <p className="text-sm text-muted">{course.description}</p>
        </aside>
      </div>
    </div>
  );
}

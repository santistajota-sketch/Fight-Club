import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Share2, ChevronRight } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { useAuthorLookup } from '../hooks/useContent';
import { Cover } from '../components/Cover';
import { Diagram } from '../components/Diagram';
import { AnalysisCard, CourseCard } from '../components/cards';
import { Avatar, EmptyState, LevelPill, SaveButton } from '../components/ui';
import { modalityName } from '../data/modalities';
import { toast } from '../store/toast';

export default function AnalysisPage() {
  const { id } = useParams();
  const a = useStore((s) => s.analyses.find((x) => x.id === id));
  const all = useStore((s) => s.analyses);
  const courses = useStore((s) => s.courses);
  const markRead = useStore((s) => s.markAnalysisRead);
  const read = useUserData().readAnalyses.includes(id ?? '');
  const author = useAuthorLookup();
  if (!a) return <EmptyState title="Análise não encontrada" action={<Link to="/analises" className="btn-primary">Ver análises</Link>} />;
  const au = author(a.authorId);
  const related = all.filter((x) => x.id !== a.id && (x.modality === a.modality || x.category === a.category)).slice(0, 3);
  const relCourse = courses.find((c) => c.modality === a.modality);
  const share = () => { navigator.clipboard?.writeText(location.href).catch(() => {}); toast('Link copiado! (compartilhamento simulado)', 'success'); };

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Trilha de navegação" className="mb-4 flex items-center gap-1 text-sm text-muted"><Link to="/analises" className="hover:text-fg">Fight Breakdown</Link><ChevronRight size={14} /><span className="truncate text-fg">{a.category}</span></nav>
      <Cover seed={a.id} modality={a.modality} className="aspect-[21/9] rounded-2xl" big alt={`Capa da análise ${a.title}`} />
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-sm"><span className="font-bold uppercase tracking-wider text-accent">{a.category}</span>·<span>{modalityName(a.modality)}</span><LevelPill level={a.level} /><span className="inline-flex items-center gap-1 text-muted"><Clock size={14} />{a.readMinutes} min de leitura</span></div>
        <h1 className="h-display mt-2 text-4xl md:text-5xl">{a.title}</h1>
        <p className="mt-3 text-lg text-muted">{a.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-line py-4">
          <Link to={au.link} className="flex items-center gap-3"><Avatar name={au.name} hue={au.hue} size={40} /><div><p className="text-sm font-semibold hover:underline">{au.name}</p><p className="text-xs text-muted">{au.role}</p></div></Link>
          <div className="ml-auto flex gap-2">
            <SaveButton type="analysis" id={a.id} compact />
            <button className="icon-btn h-9 w-9" onClick={share} aria-label="Compartilhar (simulado)"><Share2 size={17} /></button>
          </div>
        </div>
      </header>
      <div className="mt-6 space-y-6">
        {a.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-3xl tracking-wide">{s.heading}</h2>
            <p className="mt-2 leading-relaxed">{s.body}</p>
            {s.diagram && <Diagram kind={s.diagram} />}
            {s.bullets && <ul className="mt-3 space-y-2">{s.bullets.map((b) => <li key={b} className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />{b}</li>)}</ul>}
          </section>
        ))}
        <p className="rounded-xl bg-bg2 p-4 text-sm text-muted">Conteúdo educativo fictício produzido para a demonstração da Fight Flow. Não descreve lutas ou atletas reais.</p>
      </div>
      <div className="my-8 flex justify-center">
        <button onClick={() => markRead(a.id)} className={read ? 'btn-ghost px-6 py-3' : 'btn-primary px-6 py-3'} aria-pressed={read}>
          {read ? <><CheckCircle2 size={18} className="text-emerald-500" />Lida — desmarcar</> : <><Circle size={18} />Marcar como lida (+20 XP)</>}
        </button>
      </div>
      {(related.length > 0 || relCourse) && (
        <section className="border-t border-line pt-8">
          <h2 className="section-title mb-4">Conteúdo relacionado</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => <AnalysisCard key={r.id} a={r} />)}
            {relCourse && <CourseCard course={relCourse} />}
          </div>
        </section>
      )}
    </article>
  );
}

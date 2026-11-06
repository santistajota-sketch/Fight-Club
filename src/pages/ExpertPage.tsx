import { Link, useParams } from 'react-router-dom';
import { Award, Users, Star, BookOpen } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { CourseCard, AnalysisCard } from '../components/cards';
import { Avatar, DemoBadge, EmptyState, FollowButton } from '../components/ui';
import { Cover } from '../components/Cover';
import { modalityName } from '../data/modalities';
import { compact } from '../utils';

export default function ExpertPage() {
  const { id } = useParams();
  const e = useStore((s) => s.experts.find((x) => x.id === id));
  const courses = useStore((s) => s.courses).filter((c) => c.expertId === id);
  const analyses = useStore((s) => s.analyses).filter((a) => a.authorId === id);
  const following = useUserData().follows.includes(id ?? '');
  if (!e) return <EmptyState title="Especialista não encontrado" action={<Link to="/especialistas" className="btn-primary">Ver especialistas</Link>} />;

  return (
    <div className="space-y-8">
      <section className="card overflow-hidden">
        <Cover seed={e.id + 'banner'} modality={e.modality} className="h-40 md:h-52" variant={2} big />
        <div className="relative px-5 pb-6 md:px-8">
          <div className="-mt-14 flex flex-col gap-4 md:flex-row md:items-end">
            <Avatar name={e.name} hue={e.hue} size={112} className="ring-4" />
            <div className="flex-1">
              <h1 className="h-display text-4xl md:text-5xl">{e.name}</h1>
              <p className="text-sm text-muted">{modalityName(e.modality)} · {e.rank} · {e.experience}</p>
            </div>
            <FollowButton id={e.id} label={e.name} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[[Users, `${compact(e.students + (following ? 1 : 0))}`, 'Alunos (fictício)'], [Star, e.rating.toFixed(1), 'Avaliação demo'], [BookOpen, String(courses.length), 'Cursos'], [Award, String(analyses.length), 'Análises']].map(([Icon, v, l]) => {
              const I = Icon as typeof Users;
              return <div key={l as string} className="rounded-xl bg-bg2 p-3"><I size={16} className="text-accent" /><p className="mt-1 font-display text-2xl">{v as string}</p><p className="text-xs text-muted">{l as string}</p></div>;
            })}
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-[2fr_1fr]">
            <div><h2 className="mb-2 font-bold">Biografia</h2><p className="text-muted">{e.bio}</p></div>
            <div><h2 className="mb-2 font-bold">Especialidades</h2><div className="flex flex-wrap gap-2">{e.specialties.map((s) => <span key={s} className="chip">{s}</span>)}</div></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">Cursos de {e.name.split(' ')[0]}</h2>
        {courses.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{courses.map((c) => <CourseCard key={c.id} course={c} />)}</div> : <EmptyState title="Sem cursos publicados" />}
      </section>

      {analyses.length > 0 && (
        <section>
          <h2 className="section-title mb-4">Análises publicadas</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{analyses.map((a) => <AnalysisCard key={a.id} a={a} />)}</div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-3"><h2 className="section-title">Avaliações</h2><DemoBadge text="Avaliações demonstrativas" /></div>
        <div className="grid gap-4 md:grid-cols-2">
          {e.reviews.map((r) => (
            <blockquote key={r.author} className="card p-5">
              <p className="text-amber-400" aria-label={`${r.rating} de 5 estrelas`}>{'★'.repeat(r.rating)}<span className="text-line">{'★'.repeat(5 - r.rating)}</span></p>
              <p className="mt-2">“{r.text}”</p>
              <footer className="mt-2 text-sm text-muted">— {r.author} (aluno fictício)</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

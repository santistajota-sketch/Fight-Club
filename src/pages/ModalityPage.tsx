import { Link, useParams } from 'react-router-dom';
import { ChevronRight, History, ListChecks, Swords, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import { modalityById } from '../data/modalities';
import { Cover } from '../components/Cover';
import { AnalysisCard, CourseCard, ExpertCard, PostCard } from '../components/cards';
import { EmptyState } from '../components/ui';
import { FavModalityButton } from './Modalities';

export default function ModalityPage() {
  const { id } = useParams();
  const m = modalityById(id ?? '');
  const { courses, experts, analyses, posts } = useStore();
  if (!m) return <EmptyState title="Modalidade não encontrada" action={<Link to="/modalidades" className="btn-primary">Ver modalidades</Link>} />;
  const mc = courses.filter((c) => c.modality === m.id);
  const me = experts.filter((e) => e.modality === m.id);
  const ma = analyses.filter((a) => a.modality === m.id);
  const mp = posts.filter((p) => p.modality === m.id).sort((a, b) => b.ts - a.ts).slice(0, 3);

  const Block = ({ icon: Icon, title, items }: { icon: typeof History; title: string; items: string[] }) => (
    <div className="card p-5"><h3 className="mb-3 flex items-center gap-2 font-bold"><Icon size={18} className="text-accent" />{title}</h3><ul className="space-y-1.5 text-sm">{items.map((i) => <li key={i} className="flex gap-2"><span className="text-accent">•</span>{i}</li>)}</ul></div>
  );

  return (
    <div className="space-y-10">
      <nav aria-label="Trilha de navegação" className="flex items-center gap-1 text-sm text-muted"><Link to="/modalidades" className="hover:text-fg">Modalidades</Link><ChevronRight size={14} /><span className="text-fg">{m.name}</span></nav>
      <section className="relative overflow-hidden rounded-3xl">
        <Cover seed={m.id + 'hero'} modality={m.id} className="h-64 md:h-80" big />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-6 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">{m.short} · {m.origin}</p>
          <h1 className="h-display text-6xl md:text-7xl">{m.name}</h1>
          <p className="mt-2 max-w-2xl text-white/85">{m.description}</p>
          <div className="mt-4"><FavModalityButton id={m.id} name={m.name} light /></div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 lg:row-span-2"><h2 className="mb-3 flex items-center gap-2 font-bold"><History size={18} className="text-accent" />História resumida</h2><p className="leading-relaxed text-muted">{m.history}</p></div>
        <Block icon={ListChecks} title="Características principais" items={m.characteristics} />
        <Block icon={Swords} title="Técnicas mais conhecidas" items={m.techniques} />
        <Block icon={Package} title="Equipamentos básicos" items={m.equipment} />
      </section>
      <section><h2 className="section-title mb-4">Cursos relacionados</h2>{mc.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{mc.map((c) => <CourseCard key={c.id} course={c} />)}</div> : <EmptyState title="Em breve" text="Ainda não há cursos desta modalidade." />}</section>
      {me.length > 0 && <section><h2 className="section-title mb-4">Especialistas</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{me.map((e) => <ExpertCard key={e.id} e={e} />)}</div></section>}
      {ma.length > 0 && <section><h2 className="section-title mb-4">Conteúdos técnicos</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{ma.map((a) => <AnalysisCard key={a.id} a={a} />)}</div></section>}
      <section><h2 className="section-title mb-4">Publicações da comunidade</h2>{mp.length ? <div className="grid gap-4 lg:grid-cols-2">{mp.map((p) => <PostCard key={p.id} post={p} />)}</div> : <EmptyState title="Sem publicações ainda" action={<Link className="btn-primary" to="/comunidade">Publicar na comunidade</Link>} />}</section>
    </div>
  );
}

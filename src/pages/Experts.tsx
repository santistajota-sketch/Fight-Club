import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { ExpertCard } from '../components/cards';
import { EmptyState, PageHeader } from '../components/ui';
import { MODALITIES } from '../data/modalities';

export default function Experts() {
  const experts = useStore((s) => s.experts);
  const [mod, setMod] = useState('all');
  const [level, setLevel] = useState('all');
  const [spec, setSpec] = useState('all');
  const specs = useMemo(() => [...new Set(experts.flatMap((e) => e.specialties))].sort(), [experts]);
  const list = experts.filter((e) => (mod === 'all' || e.modality === mod) && (level === 'all' || e.level === level) && (spec === 'all' || e.specialties.includes(spec)));

  return (
    <div>
      <PageHeader eyebrow="Profissionais Fight Flow" title="Especialistas" text="Treinadores e profissionais fictícios que produzem os cursos e análises da plataforma." />
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <div><label htmlFor="ex-mod" className="mb-1 block text-xs font-semibold text-muted">Modalidade</label>
          <select id="ex-mod" className="input py-2" value={mod} onChange={(e) => setMod(e.target.value)}><option value="all">Todas</option>{MODALITIES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        <div><label htmlFor="ex-lvl" className="mb-1 block text-xs font-semibold text-muted">Nível de público</label>
          <select id="ex-lvl" className="input py-2" value={level} onChange={(e) => setLevel(e.target.value)}><option value="all">Todos</option><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
        <div><label htmlFor="ex-spec" className="mb-1 block text-xs font-semibold text-muted">Especialidade</label>
          <select id="ex-spec" className="input py-2" value={spec} onChange={(e) => setSpec(e.target.value)}><option value="all">Todas</option>{specs.map((s) => <option key={s}>{s}</option>)}</select></div>
      </div>
      {list.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">{list.map((e) => <ExpertCard key={e.id} e={e} />)}</div>
      ) : <EmptyState title="Nenhum especialista encontrado" text="Tente outra combinação de filtros." />}
    </div>
  );
}

import { useState } from 'react';
import { useStore, useUserData } from '../store/useStore';
import { AnalysisCard } from '../components/cards';
import { EmptyState, PageHeader } from '../components/ui';
import { ANALYSIS_CATEGORIES } from '../data/analyses';
import { MODALITIES } from '../data/modalities';
import { cn } from '../utils';

export default function Analyses() {
  const analyses = useStore((s) => s.analyses);
  const read = useUserData().readAnalyses;
  const [cat, setCat] = useState<string>('all');
  const [mod, setMod] = useState('all');
  const [lvl, setLvl] = useState('all');
  const [status, setStatus] = useState('all');
  const list = analyses.filter((a) => (cat === 'all' || a.category === cat) && (mod === 'all' || a.modality === mod) && (lvl === 'all' || a.level === lvl)
    && (status === 'all' || (status === 'read' ? read.includes(a.id) : !read.includes(a.id))));

  return (
    <div>
      <PageHeader eyebrow="Fight Breakdown" title="Análises técnicas" text="Estudo aprofundado de técnicas, estratégias, preparação e biomecânica — conteúdo educativo fictício.">
        <p className="text-sm text-muted">{read.length} de {analyses.length} lidas</p>
      </PageHeader>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Categorias">
        <button className={cn('chip whitespace-nowrap', cat === 'all' && 'chip-on')} aria-pressed={cat === 'all'} onClick={() => setCat('all')}>Todas</button>
        {ANALYSIS_CATEGORIES.map((c) => <button key={c} className={cn('chip whitespace-nowrap', cat === c && 'chip-on')} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <div><label htmlFor="an-mod" className="mb-1 block text-xs font-semibold text-muted">Modalidade</label><select id="an-mod" className="input py-2" value={mod} onChange={(e) => setMod(e.target.value)}><option value="all">Todas</option>{MODALITIES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
        <div><label htmlFor="an-lvl" className="mb-1 block text-xs font-semibold text-muted">Dificuldade</label><select id="an-lvl" className="input py-2" value={lvl} onChange={(e) => setLvl(e.target.value)}><option value="all">Todas</option><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
        <div><label htmlFor="an-st" className="mb-1 block text-xs font-semibold text-muted">Leitura</label><select id="an-st" className="input py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Todas</option><option value="unread">Não lidas</option><option value="read">Lidas</option></select></div>
      </div>
      {list.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((a) => <AnalysisCard key={a.id} a={a} />)}</div>
        : <EmptyState title="Nenhuma análise encontrada" text="Mude a categoria ou os filtros." />}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { useAuthorLookup } from '../hooks/useContent';
import { Cover } from '../components/Cover';
import { ConfirmDialog, EmptyState, PageHeader, Tabs } from '../components/ui';
import { timeAgo } from '../utils';
import type { SavedType } from '../types';

const TYPE_LABEL: Record<SavedType, string> = { course: 'Curso', lesson: 'Aula', post: 'Publicação', analysis: 'Análise', event: 'Evento' };

export default function Favorites() {
  const u = useUserData();
  const { courses, lessons, posts, analyses, events, toggleSave } = useStore();
  const author = useAuthorLookup();
  const [tab, setTab] = useState<'all' | SavedType>('all');
  const [clear, setClear] = useState(false);

  const resolve = (type: SavedType, id: string) => {
    if (type === 'course') { const c = courses.find((x) => x.id === id); return c && { title: c.title, sub: 'Fight Academy', link: `/aprender/${c.id}`, mod: c.modality }; }
    if (type === 'lesson') { const l = lessons.find((x) => x.id === id); const c = courses.find((x) => x.id === l?.courseId); return l && c && { title: l.title, sub: c.title, link: `/aprender/${c.id}?aula=${l.id}`, mod: c.modality }; }
    if (type === 'post') { const p = posts.find((x) => x.id === id); return p && { title: p.text.slice(0, 90) + (p.text.length > 90 ? '…' : ''), sub: `por ${author(p.authorId).name}`, link: `/comunidade/post/${p.id}`, mod: p.modality }; }
    if (type === 'analysis') { const a = analyses.find((x) => x.id === id); return a && { title: a.title, sub: a.category, link: `/analises/${a.id}`, mod: a.modality }; }
    const e = events.find((x) => x.id === id); return e && { title: e.name, sub: e.city, link: `/eventos/${e.id}`, mod: e.modality };
  };
  const items = u.saved.filter((s) => tab === 'all' || s.type === tab).map((s) => ({ s, r: resolve(s.type, s.id) })).filter((x) => x.r);
  const count = (t: SavedType) => u.saved.filter((s) => s.type === t).length;

  return (
    <div>
      <PageHeader eyebrow="Lista de interesses" title="Favoritos" text="Tudo o que você salvou: cursos, aulas, publicações, análises e eventos.">
        {u.saved.length > 0 && <button className="btn-ghost" onClick={() => setClear(true)}><Trash2 size={16} />Limpar tudo</button>}
      </PageHeader>
      <div className="mb-5"><Tabs label="Tipo" value={tab} onChange={setTab} options={[{ value: 'all', label: 'Todos', count: u.saved.length }, ...(Object.keys(TYPE_LABEL) as SavedType[]).map((t) => ({ value: t, label: TYPE_LABEL[t] + 's', count: count(t) }))]} /></div>
      {items.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map(({ s, r }) => (
            <li key={s.type + s.id} className="card flex items-center gap-3 overflow-hidden pr-3">
              <Cover seed={s.id} modality={r!.mod} className="h-24 w-28 shrink-0" />
              <Link to={r!.link} className="min-w-0 flex-1 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">{TYPE_LABEL[s.type]}</p>
                <p className="line-clamp-2 font-semibold">{r!.title}</p>
                <p className="text-xs text-muted">{r!.sub} · salvo {timeAgo(s.ts)}</p>
              </Link>
              <div className="flex flex-col gap-2">
                <Link to={r!.link} className="icon-btn h-9 w-9" aria-label="Abrir conteúdo"><ExternalLink size={16} /></Link>
                <button onClick={() => toggleSave(s.type, s.id)} className="icon-btn h-9 w-9 hover:text-red-500" aria-label="Remover dos favoritos"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      ) : <EmptyState icon={Bookmark} title="Nada salvo aqui" text="Use o ícone de marcador em cursos, aulas, posts, análises e eventos para salvá-los." action={<Link to="/aprender" className="btn-primary">Explorar conteúdos</Link>} />}
      <ConfirmDialog open={clear} onClose={() => setClear(false)} title="Remover todos os favoritos?" message="Todos os itens salvos serão removidos." confirmLabel="Remover tudo" onConfirm={() => u.saved.forEach((s) => toggleSave(s.type, s.id))} />
    </div>
  );
}

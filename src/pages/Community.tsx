import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Video, X, Search, Send, Hash } from 'lucide-react';
import { useStore, useAccount } from '../store/useStore';
import { PostCard } from '../components/cards';
import { Avatar, EmptyState, FollowButton, PageHeader, Tabs } from '../components/ui';
import { MODALITIES } from '../data/modalities';
import { PROFILES } from '../data/profiles';
import { cn, compressImage, youtubeId } from '../utils';
import { toast } from '../store/toast';
import type { ModalityId } from '../types';

function Composer() {
  const acc = useAccount()!;
  const createPost = useStore((s) => s.createPost);
  const [text, setText] = useState('');
  const [modality, setModality] = useState<ModalityId>(acc.modalities[0] ?? 'mma');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<string>();
  const [video, setVideo] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast('Selecione um arquivo de imagem.', 'error'); return; }
    try { setImage(await compressImage(f)); } catch { toast('Não foi possível carregar a imagem.', 'error'); }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 3) { setError('Escreva pelo menos 3 caracteres.'); return; }
    if (video && !youtubeId(video)) { setError('Link de vídeo inválido. Use um link do YouTube.'); return; }
    createPost({
      text: text.trim(), modality, image, videoUrl: video || undefined,
      hashtags: tags.split(/[\s,#]+/).map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 6),
    });
    setText(''); setTags(''); setImage(undefined); setVideo(''); setShowVideo(false); setError('');
  };

  return (
    <form onSubmit={submit} className="card p-4" aria-label="Criar publicação">
      <div className="flex gap-3">
        <Avatar name={acc.name} preset={acc.avatar} size={42} />
        <div className="flex-1">
          <label htmlFor="post-text" className="sr-only">Texto da publicação</label>
          <textarea id="post-text" value={text} onChange={(e) => { setText(e.target.value); setError(''); }} rows={3} maxLength={1200}
            placeholder="Compartilhe uma dica, dúvida ou evolução no treino…" className="input resize-none border-transparent bg-transparent px-0 text-[15px] focus:ring-0 focus:border-transparent" aria-invalid={!!error} />
          {image && (
            <div className="relative mt-2 w-fit">
              <img src={image} alt="Pré-visualização da imagem" className="max-h-56 rounded-xl" />
              <button type="button" onClick={() => setImage(undefined)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white" aria-label="Remover imagem"><X size={14} /></button>
            </div>
          )}
          {showVideo && (
            <div className="mt-2">
              <label htmlFor="post-video" className="text-xs font-semibold text-muted">Link do vídeo demonstrativo (YouTube)</label>
              <input id="post-video" className="input mt-1" value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="post-mod" className="sr-only">Modalidade</label>
              <select id="post-mod" className="input py-2" value={modality} onChange={(e) => setModality(e.target.value as ModalityId)}>
                {MODALITIES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="post-tags" className="sr-only">Hashtags</label>
              <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input id="post-tags" className="input py-2 pl-8" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="hashtags separadas por espaço" />
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-500" role="alert">{error}</p>}
          <div className="mt-3 flex items-center gap-1">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Enviar imagem" />
            <button type="button" className="icon-btn border-transparent bg-transparent" onClick={() => fileRef.current?.click()} aria-label="Adicionar imagem"><ImagePlus size={19} /></button>
            <button type="button" className={cn('icon-btn border-transparent bg-transparent', showVideo && 'text-accent')} onClick={() => setShowVideo((v) => !v)} aria-label="Adicionar vídeo"><Video size={19} /></button>
            <span className="ml-auto mr-2 text-xs text-muted">{text.length}/1200</span>
            <button type="submit" className="btn-primary"><Send size={16} />Publicar</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function Community() {
  const posts = useStore((s) => s.posts);
  const [mod, setMod] = useState<ModalityId | 'all'>('all');
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase().replace(/^#/, '');
    return posts
      .filter((p) => mod === 'all' || p.modality === mod)
      .filter((p) => !term || p.text.toLowerCase().includes(term) || p.hashtags.some((h) => h.includes(term)))
      .sort((a, b) => (sort === 'recent' ? b.ts - a.ts : b.likes + b.comments.length * 5 - (a.likes + a.comments.length * 5)));
  }, [posts, mod, sort, q]);

  const trending = useMemo(() => {
    const m = new Map<string, number>();
    posts.forEach((p) => p.hashtags.forEach((h) => m.set(h, (m.get(h) ?? 0) + 1 + p.likes / 200)));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([h]) => h);
  }, [posts]);

  return (
    <div>
      <PageHeader eyebrow="Fight Community" title="Comunidade" text="Discussões, dicas e evolução compartilhada entre praticantes e fãs." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <Composer />
          <div className="card space-y-3 p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <label htmlFor="feed-search" className="sr-only">Pesquisar no feed</label>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input id="feed-search" className="input pl-9" placeholder="Pesquisar posts ou #hashtags" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Tabs label="Ordenar publicações" value={sort} onChange={setSort} options={[{ value: 'recent', label: 'Recentes' }, { value: 'popular', label: 'Populares' }]} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por modalidade">
              <button className={cn('chip', mod === 'all' && 'chip-on')} aria-pressed={mod === 'all'} onClick={() => setMod('all')}>Todas</button>
              {MODALITIES.map((m) => <button key={m.id} aria-pressed={mod === m.id} className={cn('chip whitespace-nowrap', mod === m.id && 'chip-on')} onClick={() => setMod(m.id)}>{m.name}</button>)}
            </div>
          </div>
          <p className="text-sm text-muted" aria-live="polite">{list.length} publicaç{list.length === 1 ? 'ão' : 'ões'}</p>
          {list.length ? list.map((p) => <PostCard key={p.id} post={p} />) : (
            <EmptyState title="Nada por aqui" text="Nenhuma publicação corresponde aos filtros. Que tal ser o primeiro a postar sobre isso?" action={<button className="btn-ghost" onClick={() => { setQ(''); setMod('all'); }}>Limpar filtros</button>} />
          )}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-3 font-bold">Em alta</h2>
            <div className="flex flex-wrap gap-2">{trending.map((h) => <button key={h} className="chip" onClick={() => setQ(`#${h}`)}>#{h}</button>)}</div>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-bold">Atletas e membros para seguir</h2>
            <ul className="space-y-3">
              {PROFILES.filter((p) => p.isAthlete || p.followers > 1500).slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <Link to={`/perfil/${p.id}`}><Avatar name={p.name} hue={p.hue} size={38} /></Link>
                  <Link to={`/perfil/${p.id}`} className="min-w-0 flex-1"><p className="truncate text-sm font-semibold hover:underline">{p.name}</p><p className="truncate text-xs text-muted">{p.role}</p></Link>
                  <FollowButton id={p.id} label={p.name} small />
                </li>
              ))}
            </ul>
          </div>
          <p className="px-1 text-xs text-muted">Perfis e publicações de demonstração são fictícios. Interações (curtidas e respostas automáticas) são simuladas localmente.</p>
        </aside>
      </div>
    </div>
  );
}

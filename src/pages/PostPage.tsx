import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Send } from 'lucide-react';
import { useStore, useAccount } from '../store/useStore';
import { useAuthorLookup } from '../hooks/useContent';
import { PostCard } from '../components/cards';
import { Avatar, ConfirmDialog, EmptyState } from '../components/ui';
import { timeAgo } from '../utils';

export default function PostPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const post = useStore((s) => s.posts.find((p) => p.id === id));
  const addComment = useStore((s) => s.addComment);
  const deleteComment = useStore((s) => s.deleteComment);
  const acc = useAccount()!;
  const author = useAuthorLookup();
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);

  if (!post) return <EmptyState title="Publicação não encontrada" text="Ela pode ter sido removida." action={<Link to="/comunidade" className="btn-primary">Voltar à comunidade</Link>} />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { setErr('Escreva um comentário.'); return; }
    addComment(post.id, text.trim()); setText(''); setErr('');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="sr-only">Publicação de {author(post.authorId).name}</h1>
      <button onClick={() => nav(-1)} className="btn-ghost"><ArrowLeft size={16} />Voltar</button>
      <PostCard post={post} onOpen={() => document.getElementById('comment-input')?.focus()} />
      <section className="card p-4" aria-labelledby="comments-title">
        <h2 id="comments-title" className="mb-4 font-bold">Comentários ({post.comments.length})</h2>
        <form onSubmit={submit} className="mb-5 flex gap-3">
          <Avatar name={acc.name} preset={acc.avatar} size={36} />
          <div className="flex-1">
            <label htmlFor="comment-input" className="sr-only">Escreva um comentário</label>
            <div className="flex gap-2">
              <input id="comment-input" className="input" value={text} onChange={(e) => { setText(e.target.value); setErr(''); }} placeholder="Escreva um comentário construtivo…" maxLength={500} aria-invalid={!!err} />
              <button className="btn-primary" aria-label="Enviar comentário"><Send size={16} /></button>
            </div>
            {err && <p className="mt-1 text-sm text-red-500" role="alert">{err}</p>}
          </div>
        </form>
        {post.comments.length === 0 && <p className="text-sm text-muted">Seja o primeiro a comentar.</p>}
        <ul className="space-y-4">
          {post.comments.map((c) => {
            const a = author(c.authorId);
            return (
              <li key={c.id} className="flex gap-3">
                <Link to={a.link}><Avatar name={a.name} hue={a.hue} preset={a.preset} size={36} /></Link>
                <div className="flex-1 rounded-2xl bg-bg2 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Link to={a.link} className="text-sm font-semibold hover:underline">{a.name}</Link>
                    <span className="text-xs text-muted">{timeAgo(c.ts)}</span>
                    {a.isMe && <button onClick={() => setToDelete(c.id)} className="ml-auto text-muted hover:text-red-500" aria-label="Excluir comentário"><Trash2 size={15} /></button>}
                  </div>
                  <p className="text-sm">{c.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <ConfirmDialog open={!!toDelete} onClose={() => setToDelete(null)} title="Excluir comentário?" message="Esta ação não pode ser desfeita." confirmLabel="Excluir" onConfirm={() => toDelete && deleteComment(post.id, toDelete)} />
    </div>
  );
}

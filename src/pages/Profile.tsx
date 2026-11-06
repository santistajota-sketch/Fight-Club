import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pencil, CalendarDays, Target, Bookmark, Trophy, Lock } from 'lucide-react';
import { useStore, useAccount, useUserData, computeStats, completedCourses, courseLessonIds, levelsList } from '../store/useStore';
import { PostCard } from '../components/cards';
import { AVATAR_PRESETS, Avatar, EmptyState, FollowButton, Modal, ProgressBar, ICONS } from '../components/ui';
import { Cover } from '../components/Cover';
import { PROFILES } from '../data/profiles';
import { MODALITIES, modalityName } from '../data/modalities';
import { ACHIEVEMENTS, levelFor } from '../data/gamification';
import { cn, compact, fmtDate, DAY } from '../utils';
import type { Level, ModalityId } from '../types';
import { toast } from '../store/toast';

function EditProfile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const acc = useAccount()!;
  const update = useStore((s) => s.updateAccount);
  const [name, setName] = useState(acc.name);
  const [bio, setBio] = useState(acc.bio);
  const [avatar, setAvatar] = useState(acc.avatar);
  const [mods, setMods] = useState<ModalityId[]>(acc.modalities);
  const [level, setLevel] = useState<Level>(acc.level);
  const [goal, setGoal] = useState(acc.goal);
  const [err, setErr] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || name.trim().length > 24) { setErr('O apelido deve ter entre 2 e 24 caracteres.'); return; }
    if (!mods.length) { setErr('Escolha ao menos uma modalidade.'); return; }
    update({ name: name.trim(), bio: bio.trim(), avatar, modalities: mods, level, goal: goal.trim() });
    toast('Perfil atualizado!', 'success');
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Editar Fight ID" wide>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="ep-name" className="label">Apelido</label><input id="ep-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label htmlFor="ep-level" className="label">Nível de experiência</label><select id="ep-level" className="input" value={level} onChange={(e) => setLevel(e.target.value as Level)}>{levelsList.map((l) => <option key={l}>{l}</option>)}</select></div>
        </div>
        <div><label htmlFor="ep-bio" className="label">Biografia</label><textarea id="ep-bio" rows={3} maxLength={200} className="input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre sua jornada" /></div>
        <div><label htmlFor="ep-goal" className="label">Objetivo na plataforma</label><input id="ep-goal" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} /></div>
        <fieldset><legend className="label">Avatar</legend><div className="flex flex-wrap gap-2">{AVATAR_PRESETS.map((_, i) => <button type="button" key={i} onClick={() => setAvatar(i)} aria-pressed={avatar === i} aria-label={`Avatar ${i + 1}`} className={cn('rounded-full p-0.5', avatar === i ? 'ring-2 ring-primary' : 'opacity-70')}><Avatar name={name || 'FF'} preset={i} size={42} /></button>)}</div></fieldset>
        <fieldset><legend className="label">Modalidades favoritas</legend><div className="flex flex-wrap gap-2">{MODALITIES.map((m) => <button type="button" key={m.id} aria-pressed={mods.includes(m.id)} onClick={() => setMods((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))} className={cn('chip', mods.includes(m.id) && 'chip-on')}>{m.name}</button>)}</div></fieldset>
        {err && <p className="text-sm text-red-500" role="alert">{err}</p>}
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button><button className="btn-primary">Salvar alterações</button></div>
      </form>
    </Modal>
  );
}

export default function Profile() {
  const { id } = useParams();
  const acc = useAccount()!;
  const accounts = useStore((s) => s.accounts);
  const posts = useStore((s) => s.posts);
  const courses = useStore((s) => s.courses);
  const u = useUserData();
  const [edit, setEdit] = useState(false);
  const isMe = !id || id === acc.id;

  if (!isMe) {
    const p = PROFILES.find((x) => x.id === id);
    const other = accounts.find((a) => a.id === id);
    if (!p && !other) return <EmptyState title="Perfil não encontrado" action={<Link to="/comunidade" className="btn-primary">Voltar</Link>} />;
    const name = p?.name ?? other!.name;
    const theirPosts = posts.filter((x) => x.authorId === id).sort((a, b) => b.ts - a.ts);
    const following = u.follows.includes(id!);
    const xp = p?.xp ?? 0;
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="card overflow-hidden">
          <Cover seed={id + 'cover'} modality={p?.modality ?? other?.modalities[0]} className="h-36" variant={0} />
          <div className="px-5 pb-5">
            <div className="-mt-12 flex items-end gap-4">
              <Avatar name={name} hue={p?.hue} preset={other?.avatar} size={96} className="ring-4" />
              <div className="ml-auto"><FollowButton id={id!} label={name} /></div>
            </div>
            <h1 className="h-display mt-3 text-4xl">{name}</h1>
            <p className="text-sm text-muted">@{p?.handle ?? other!.handle} · {p?.role ?? 'Membro'} {p?.isAthlete && <span className="badge ml-1 bg-primary/15 text-accent">Atleta fictício</span>}</p>
            <p className="mt-2">{p?.bio ?? other?.bio}</p>
            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <span><strong>{compact((p?.followers ?? 0) + (following ? 1 : 0))}</strong> <span className="text-muted">seguidores</span></span>
              <span><strong>{compact(p?.following ?? 0)}</strong> <span className="text-muted">seguindo</span></span>
              <span><strong>{theirPosts.length}</strong> <span className="text-muted">publicações</span></span>
              {p && <span><strong>{levelFor(xp).name}</strong> <span className="text-muted">· {compact(xp)} XP</span></span>}
            </div>
            <p className="mt-2 text-sm text-accent">Modalidade: {modalityName(p?.modality ?? other?.modalities[0] ?? 'mma')}</p>
          </div>
        </section>
        <h2 className="section-title">Publicações</h2>
        {theirPosts.length ? theirPosts.map((x) => <PostCard key={x.id} post={x} />) : <EmptyState title="Sem publicações" />}
        <p className="text-center text-xs text-muted">Perfil fictício de demonstração.</p>
      </div>
    );
  }

  const stats = computeStats(u, courses);
  const lvl = levelFor(u.xp);
  const started = courses.filter((c) => courseLessonIds(c).some((l) => u.completedLessons.includes(l)));
  const done = completedCourses(u, courses);
  const myPosts = posts.filter((x) => x.authorId === acc.id).sort((a, b) => b.ts - a.ts);
  const days = Math.max(1, Math.floor((Date.now() - acc.joined) / DAY));
  const followers = 24 + myPosts.length * 3 + Math.floor(u.xp / 100);

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-primary via-vivid to-bg2 md:h-48">
          <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true"><defs><pattern id="pp" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="8" /></pattern></defs><rect width="100%" height="100%" fill="url(#pp)" /></svg>
          <p className="absolute right-5 top-4 font-display text-4xl tracking-widest text-white/80">FIGHT ID</p>
        </div>
        <div className="px-5 pb-6 md:px-8">
          <div className="-mt-14 flex flex-wrap items-end gap-4">
            <Avatar name={acc.name} preset={acc.avatar} size={112} className="ring-4" />
            <div className="flex-1">
              <h1 className="h-display text-4xl md:text-5xl">{acc.name}</h1>
              <p className="text-sm text-muted">@{acc.handle} · {acc.level} {acc.role === 'admin' && <span className="badge ml-1 bg-primary/15 text-accent">Admin demo</span>}</p>
            </div>
            <button className="btn-ghost" onClick={() => setEdit(true)}><Pencil size={16} />Editar perfil</button>
          </div>
          <p className="mt-4 max-w-2xl">{acc.bio || <span className="text-muted">Sem biografia. Clique em “Editar perfil” para adicionar.</span>}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1"><CalendarDays size={15} />Membro há {days} dia(s) · desde {fmtDate(acc.joined)}</span>
            <span className="flex items-center gap-1"><Target size={15} />{acc.goal}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">{acc.modalities.map((m) => <Link key={m} to={`/modalidades/${m}`} className="chip chip-on">{modalityName(m)}</Link>)}</div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <span><strong>{followers}</strong> <span className="text-muted">seguidores (simulado)</span></span>
            <span><strong>{u.follows.length}</strong> <span className="text-muted">seguindo</span></span>
            <span><strong>{myPosts.length}</strong> <span className="text-muted">publicações</span></span>
            <Link to="/favoritos" className="flex items-center gap-1"><Bookmark size={14} /><strong>{u.saved.length}</strong> <span className="text-muted">salvos</span></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="card p-5">
          <h2 className="mb-3 font-bold">Estatísticas de aprendizado</h2>
          <div className="mb-2 flex justify-between text-sm"><span>Nível {lvl.level} · {lvl.name}</span><span className="text-muted">{u.xp} XP</span></div>
          <ProgressBar value={lvl.pct} label="Progresso de nível" />
          <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
            {[['Cursos iniciados', started.length], ['Cursos concluídos', done.length], ['Aulas concluídas', stats.lessons], ['Análises lidas', stats.analyses], ['Comentários', stats.comments], ['Sequência', `${stats.streak}d`]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-bg2 p-3"><dd className="font-display text-3xl">{v}</dd><dt className="text-xs text-muted">{k}</dt></div>
            ))}
          </dl>
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Trophy size={18} className="text-accent" />Conquistas</h2><Link to="/ranking" className="text-sm text-accent">Ver todas</Link></div>
          <div className="grid grid-cols-5 gap-3">
            {ACHIEVEMENTS.map((a) => { const I = ICONS[a.icon]; const on = !!u.unlocked[a.id]; return (
              <div key={a.id} className="flex flex-col items-center text-center" title={`${a.name}: ${a.description}`}>
                <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl', on ? 'bg-gradient-to-br from-primary to-vivid text-white' : 'bg-bg2 text-muted')}>{on ? <I size={22} /> : <Lock size={18} />}</span>
                <span className="mt-1 line-clamp-2 text-[10px] font-semibold leading-tight">{a.name}</span>
              </div>
            ); })}
          </div>
          <h3 className="mb-2 mt-5 text-sm font-bold">Cursos em andamento</h3>
          <ul className="space-y-2">{started.slice(0, 4).map((c) => { const ids = courseLessonIds(c); const n = ids.filter((l) => u.completedLessons.includes(l)).length; return <li key={c.id}><Link to={`/aprender/${c.id}`} className="block text-sm hover:text-accent">{c.title} <span className="text-muted">· {Math.round((n / ids.length) * 100)}%</span></Link></li>; })}{!started.length && <li className="text-sm text-muted">Nenhum curso iniciado.</li>}</ul>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">Minhas publicações</h2>
        {myPosts.length ? <div className="grid gap-4 lg:grid-cols-2">{myPosts.map((p) => <PostCard key={p.id} post={p} />)}</div> : <EmptyState title="Você ainda não publicou" text="Compartilhe sua evolução com a comunidade." action={<Link to="/comunidade" className="btn-primary">Criar publicação</Link>} />}
      </section>
      {edit && <EditProfile open={edit} onClose={() => setEdit(false)} />}
    </div>
  );
}

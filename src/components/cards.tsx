import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Clock, Users, BookOpen, MapPin, CheckCircle2, PlayCircle } from 'lucide-react';
import type { Analysis, Course, Expert, FightEvent, Post } from '../types';
import { useStore, useUserData, courseLessonIds } from '../store/useStore';
import { useAuthorLookup, useCourseProgress, courseMinutes, eventDate, eventStatus } from '../hooks/useContent';
import { modalityName } from '../data/modalities';
import { Cover } from './Cover';
import { Avatar, LevelPill, ProgressBar, SaveButton, Stars, FollowButton, DemoBadge } from './ui';
import { cn, compact, fmtDate, timeAgo, youtubeId } from '../utils';
import { fighterById } from '../data/events';

export function CourseCard({ course, className }: { course: Course; className?: string }) {
  const lessons = useStore((s) => s.lessons);
  const experts = useStore((s) => s.experts);
  const prog = useCourseProgress()(course);
  const expert = experts.find((e) => e.id === course.expertId);
  const mins = courseMinutes(course, lessons);
  return (
    <Link to={`/aprender/${course.id}`} className={cn('card card-hover group flex flex-col overflow-hidden', className)}>
      <div className="relative">
        <Cover seed={course.id} modality={course.modality} className="aspect-video" alt={`Capa do curso ${course.title}`} />
        <div className="absolute left-3 top-3 flex gap-1.5"><span className="badge bg-black/55 text-white backdrop-blur">{course.type}</span></div>
        <div className="absolute right-3 top-3"><SaveButton type="course" id={course.id} compact /></div>
        <PlayCircle className="absolute bottom-3 right-3 text-white/90 opacity-0 transition-opacity group-hover:opacity-100" size={34} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-accent">{modalityName(course.modality)} <LevelPill level={course.level} /></div>
        <h3 className="font-bold leading-snug">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{course.description}</p>
        <p className="text-xs text-muted">com <span className="font-semibold text-fg">{expert?.name ?? '—'}</span></p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><BookOpen size={13} />{courseLessonIds(course).length} aulas</span>
          <span className="inline-flex items-center gap-1"><Clock size={13} />{Math.round(mins / 6) / 10}h</span>
          <span className="inline-flex items-center gap-1"><Users size={13} />{compact(course.students)}</span>
          <Stars value={course.rating} />
        </div>
        {prog.done > 0 && (
          <div className="pt-1">
            <div className="mb-1 flex justify-between text-[11px] font-semibold"><span>{prog.pct === 100 ? 'Concluído ✓' : 'Seu progresso'}</span><span>{prog.pct}%</span></div>
            <ProgressBar value={prog.pct} label={`Progresso no curso ${course.title}`} />
          </div>
        )}
      </div>
    </Link>
  );
}

export function PostCard({ post, onOpen }: { post: Post; onOpen?: () => void }) {
  const author = useAuthorLookup()(post.authorId);
  const liked = useUserData().likedPosts.includes(post.id);
  const toggleLike = useStore((s) => s.toggleLike);
  const share = useStore((s) => s.sharePost);
  const nav = useNavigate();
  const open = onOpen ?? (() => nav(`/comunidade/post/${post.id}`));
  const yt = post.videoUrl ? youtubeId(post.videoUrl) : null;
  return (
    <article className="card overflow-hidden" aria-label={`Publicação de ${author.name}`}>
      <div className="flex items-center gap-3 p-4 pb-3">
        <Link to={author.link}><Avatar name={author.name} hue={author.hue} preset={author.preset} size={42} /></Link>
        <div className="min-w-0 flex-1">
          <Link to={author.link} className="block truncate font-semibold hover:underline">{author.name}</Link>
          <p className="text-xs text-muted">@{author.handle} · {timeAgo(post.ts)}</p>
        </div>
        <span className="badge bg-primary/15 text-accent">{modalityName(post.modality)}</span>
      </div>
      <button onClick={open} className="block w-full px-4 text-left">
        <p className="whitespace-pre-line text-[15px] leading-relaxed">{post.text}</p>
        {post.hashtags.length > 0 && <p className="mt-2 text-sm font-semibold text-accent">{post.hashtags.map((h) => `#${h}`).join(' ')}</p>}
      </button>
      {post.image && <button onClick={open} className="mt-3 block w-full"><img src={post.image} alt="Imagem enviada na publicação" className="max-h-[480px] w-full object-cover" /></button>}
      {!post.image && post.art !== undefined && <button onClick={open} className="mt-3 block w-full" aria-label="Abrir publicação"><Cover seed={`post-${post.art}`} modality={post.modality} className="aspect-[16/8]" variant={post.art % 4} alt="Arte ilustrativa da publicação" /></button>}
      {yt && (
        <div className="mt-3 aspect-video w-full bg-black">
          <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title="Vídeo anexado à publicação" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
        </div>
      )}
      <div className="flex items-center gap-1 border-t border-line px-2 py-1.5 mt-3">
        <button onClick={() => toggleLike(post.id)} aria-pressed={liked} aria-label={liked ? 'Remover curtida' : 'Curtir'}
          className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-bg2', liked ? 'text-rose-500' : 'text-muted')}>
          <Heart size={18} className={liked ? 'animate-pop fill-current' : ''} />{compact(post.likes)}
        </button>
        <button onClick={open} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-bg2" aria-label="Ver comentários">
          <MessageCircle size={18} />{post.comments.length}
        </button>
        <button onClick={() => share(post.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-bg2" aria-label="Compartilhar (simulado)">
          <Share2 size={18} />{post.shares}
        </button>
        <div className="ml-auto"><SaveButton type="post" id={post.id} compact /></div>
      </div>
    </article>
  );
}

export function AnalysisCard({ a, horizontal }: { a: Analysis; horizontal?: boolean }) {
  const author = useAuthorLookup()(a.authorId);
  const read = useUserData().readAnalyses.includes(a.id);
  return (
    <Link to={`/analises/${a.id}`} className={cn('card card-hover group flex overflow-hidden', horizontal ? 'flex-row' : 'flex-col')}>
      <div className={cn('relative', horizontal ? 'w-36 shrink-0' : '')}>
        <Cover seed={a.id} modality={a.modality} className={horizontal ? 'h-full min-h-28' : 'aspect-[16/9]'} alt={`Capa da análise ${a.title}`} />
        {read && <span className="badge absolute left-2 top-2 bg-emerald-600 text-white"><CheckCircle2 size={12} />Lido</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{a.category}</p>
        <h3 className="font-bold leading-snug">{a.title}</h3>
        {!horizontal && <p className="line-clamp-2 text-sm text-muted">{a.summary}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs text-muted">
          <span>{author.name}</span>·<span className="inline-flex items-center gap-1"><Clock size={12} />{a.readMinutes} min</span><LevelPill level={a.level} />
        </div>
      </div>
    </Link>
  );
}

export function StatusPill({ e }: { e: FightEvent }) {
  const s = eventStatus(e);
  return (
    <span className={cn('badge', s === 'Acontecendo' ? 'bg-red-600 text-white' : s === 'Encerrado' ? 'bg-zinc-500/25 text-fg' : 'bg-emerald-600 text-white')}>
      {s === 'Acontecendo' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}{s}
    </span>
  );
}

export function EventCard({ e, className }: { e: FightEvent; className?: string }) {
  const main = e.fights.find((f) => f.main) ?? e.fights[0];
  const a = main && fighterById(main.a), b = main && fighterById(main.b);
  return (
    <Link to={`/eventos/${e.id}`} className={cn('card card-hover group flex flex-col overflow-hidden', className)}>
      <div className="relative">
        <Cover seed={e.id} modality={e.modality} className="aspect-[16/8]" variant={1} alt={`Banner do evento ${e.name}`} />
        <div className="absolute left-3 top-3 flex gap-1.5"><StatusPill e={e} /><DemoBadge /></div>
        <div className="absolute right-3 top-3"><SaveButton type="event" id={e.id} compact /></div>
        {a && b && <p className="absolute bottom-3 left-3 right-3 font-display text-2xl leading-none tracking-wide text-white drop-shadow">{a.name.split(' ').slice(-1)} <span className="text-white/70">vs</span> {b.name.split(' ').slice(-1)}</p>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{modalityName(e.modality)} · {fmtDate(eventDate(e), { day: '2-digit', month: 'short' })}</p>
        <h3 className="font-bold">{e.name}</h3>
        <p className="mt-auto inline-flex items-center gap-1 pt-1 text-xs text-muted"><MapPin size={12} />{e.venue} · {e.city}</p>
      </div>
    </Link>
  );
}

export function ExpertCard({ e }: { e: Expert }) {
  const courses = useStore((s) => s.courses).filter((c) => c.expertId === e.id);
  return (
    <Link to={`/especialistas/${e.id}`} className="card card-hover flex flex-col items-center gap-2 p-5 text-center">
      <Avatar name={e.name} hue={e.hue} size={76} />
      <h3 className="mt-1 font-bold leading-tight">{e.name}</h3>
      <p className="text-xs font-semibold text-accent">{modalityName(e.modality)}</p>
      <p className="text-xs text-muted">{e.specialties.slice(0, 2).join(' · ')}</p>
      <div className="flex items-center gap-3 text-xs text-muted"><Stars value={e.rating} /><span>{compact(e.students)} alunos</span><span>{courses.length} cursos</span></div>
      <div className="mt-2"><FollowButton id={e.id} label={e.name} small /></div>
    </Link>
  );
}

import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, CheckCircle2, Info, X, XCircle, UserPlus, UserCheck, Inbox,
  Swords, Flame, ScanSearch, GraduationCap, MessageSquareHeart, Compass, Medal, Target, HeartHandshake, Trophy,
  type LucideIcon,
} from 'lucide-react';
import { cn, hashHue, initials } from '../utils';
import { useToasts } from '../store/toast';
import { useStore, useUserData } from '../store/useStore';
import type { SavedType } from '../types';

export const ICONS: Record<string, LucideIcon> = { Swords, Flame, ScanSearch, GraduationCap, MessageSquareHeart, Compass, Medal, Target, HeartHandshake, Trophy };

/* ---------- Avatares ---------- */
export const AVATAR_PRESETS = [
  ['#8B5CF6', '#EC4899'], ['#F97316', '#EF4444'], ['#06B6D4', '#3B82F6'], ['#10B981', '#84CC16'],
  ['#F59E0B', '#F97316'], ['#6366F1', '#0EA5E9'], ['#E11D48', '#7C3AED'], ['#14B8A6', '#6366F1'],
  ['#64748B', '#0F172A'], ['#A855F7', '#F97316'], ['#22C55E', '#0EA5E9'], ['#F43F5E', '#FB923C'],
];

export function Avatar({ name, hue, preset, size = 40, className }: { name: string; hue?: number; preset?: number; size?: number; className?: string }) {
  const bg = preset !== undefined
    ? `linear-gradient(135deg, ${AVATAR_PRESETS[preset % AVATAR_PRESETS.length][0]}, ${AVATAR_PRESETS[preset % AVATAR_PRESETS.length][1]})`
    : `linear-gradient(135deg, hsl(${hue ?? hashHue(name)} 70% 50%), hsl(${((hue ?? hashHue(name)) + 40) % 360} 70% 30%))`;
  return (
    <span
      className={cn('inline-flex shrink-0 select-none items-center justify-center rounded-full font-bold text-white ring-2 ring-bg', className)}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
      role="img"
      aria-label={`Avatar de ${name}`}
    >
      {initials(name) || '?'}
    </span>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => ref.current?.querySelector<HTMLElement>('input, textarea, select, button:not([data-close])')?.focus(), 30);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cn('card animate-rise max-h-[92vh] w-full overflow-y-auto rounded-b-none p-5 sm:rounded-2xl sm:p-6', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl tracking-wide">{title}</h2>
          <button data-close className="icon-btn h-9 w-9" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', danger = true, onConfirm, onClose }: {
  open: boolean; title: string; message: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Cancelar</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

/* ---------- Toasts ---------- */
export function Toaster() {
  const { items, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed bottom-20 right-3 z-[80] flex w-[min(92vw,360px)] flex-col gap-2 lg:bottom-5 lg:right-5" aria-live="polite" role="status">
      {items.map((t) => {
        const Icon = t.kind === 'success' ? CheckCircle2 : t.kind === 'error' ? XCircle : Info;
        return (
          <div key={t.id} className="card animate-slidein pointer-events-auto flex items-start gap-3 p-3.5 shadow-2xl">
            <Icon size={20} className={cn('mt-0.5 shrink-0', t.kind === 'success' ? 'text-emerald-500' : t.kind === 'error' ? 'text-red-500' : 'text-accent')} />
            <p className="flex-1 text-sm">{t.text}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Fechar aviso" className="text-muted hover:text-fg"><X size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Diversos ---------- */
export function EmptyState({ title, text, action, icon: Icon = Inbox }: { title: string; text?: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 border-dashed px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-accent"><Icon size={26} /></span>
      <h3 className="font-display text-2xl tracking-wide">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}

export function ProgressBar({ value, className, label }: { value: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-line', className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? 'Progresso'}>
      <div className="h-full rounded-full bg-gradient-to-r from-primary to-vivid transition-[width] duration-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export function SectionHeader({ title, subtitle, to, linkLabel = 'Ver tudo' }: { title: string; subtitle?: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {to && <Link to={to} className="shrink-0 text-sm font-semibold text-accent hover:underline">{linkLabel} →</Link>}
    </div>
  );
}

export function SaveButton({ type, id, compact }: { type: SavedType; id: string; compact?: boolean }) {
  const saved = useUserData().saved.some((s) => s.type === type && s.id === id);
  const toggle = useStore((s) => s.toggleSave);
  const Icon = saved ? BookmarkCheck : Bookmark;
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(type, id); }}
      className={compact ? cn('icon-btn h-9 w-9', saved && 'border-primary text-accent') : cn('btn-ghost', saved && 'border-primary text-accent')}
      aria-pressed={saved}
      aria-label={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
    >
      <Icon size={18} className={saved ? 'animate-pop' : ''} />{!compact && (saved ? 'Salvo' : 'Salvar')}
    </button>
  );
}

export function FollowButton({ id, label, small }: { id: string; label: string; small?: boolean }) {
  const following = useUserData().follows.includes(id);
  const toggle = useStore((s) => s.toggleFollow);
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id, label); }}
      className={cn(following ? 'btn-ghost' : 'btn-primary', small && 'px-3 py-1.5 text-xs')}
      aria-pressed={following}
    >
      {following ? <UserCheck size={16} /> : <UserPlus size={16} />}{following ? 'Seguindo' : 'Seguir'}
    </button>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" aria-label={`Avaliação demonstrativa ${value} de 5`}>
      <span className="text-amber-400">★</span>{value.toFixed(1)}
    </span>
  );
}

export function LevelPill({ level }: { level: string }) {
  const c = level === 'Iniciante' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : level === 'Intermediário' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-red-500/15 text-red-700 dark:text-red-300';
  return <span className={cn('badge', c)}>{level}</span>;
}

export function DemoBadge({ text = 'Demonstrativo' }: { text?: string }) {
  return <span className="badge bg-amber-400/15 text-amber-700 dark:text-amber-300">{text}</span>;
}

export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-bg2 p-1">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cn('whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors', value === o.value ? 'bg-primary text-onprimary' : 'text-muted hover:text-fg')}>
          {o.label}{o.count !== undefined && <span className="ml-1.5 opacity-70">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
        <h1 className="h-display text-5xl md:text-6xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-muted">{text}</p>}
      </div>
      {children}
    </header>
  );
}

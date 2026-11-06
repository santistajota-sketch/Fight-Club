import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, UserPlus, PlayCircle, GraduationCap, Trophy, CalendarDays, Reply, Info, CheckCheck, Trash2 } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { ConfirmDialog, EmptyState, PageHeader, Tabs } from '../components/ui';
import { cn, timeAgo } from '../utils';
import type { Notification } from '../types';

const ICON: Record<Notification['kind'], typeof Bell> = { comment: MessageCircle, follow: UserPlus, lesson: PlayCircle, course: GraduationCap, achievement: Trophy, event: CalendarDays, reply: Reply, system: Info };

export default function Notifications() {
  const list = useUserData().notifications;
  const { markRead, markAllRead, clearNotifications } = useStore();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [confirm, setConfirm] = useState(false);
  const nav = useNavigate();
  const shown = list.filter((n) => tab === 'all' || !n.read);
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Central" title="Notificações" text="Geradas pelas suas interações locais e por atividades simuladas da comunidade.">
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={markAllRead} disabled={!unread}><CheckCheck size={16} />Marcar todas como lidas</button>
          <button className="btn-ghost" onClick={() => setConfirm(true)} disabled={!list.length}><Trash2 size={16} />Limpar</button>
        </div>
      </PageHeader>
      <div className="mb-4"><Tabs label="Filtro" value={tab} onChange={setTab} options={[{ value: 'all', label: 'Todas', count: list.length }, { value: 'unread', label: 'Não lidas', count: unread }]} /></div>
      {shown.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {shown.map((n) => {
            const Icon = ICON[n.kind] ?? Bell;
            return (
              <li key={n.id} className={cn('flex items-start gap-3 p-4', !n.read && 'bg-primary/5')}>
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', n.read ? 'bg-bg2 text-muted' : 'bg-primary/15 text-accent')}><Icon size={18} /></span>
                <button className="flex-1 text-left" onClick={() => { markRead(n.id); if (n.link) nav(n.link); }}>
                  <p className={cn('text-sm', !n.read && 'font-semibold')}>{n.text}</p>
                  <p className="text-xs text-muted">{timeAgo(n.ts)}</p>
                </button>
                {!n.read && <button onClick={() => markRead(n.id)} className="text-xs font-semibold text-accent hover:underline">Marcar como lida</button>}
              </li>
            );
          })}
        </ul>
      ) : <EmptyState icon={Bell} title={tab === 'unread' ? 'Tudo em dia!' : 'Sem notificações'} text="Interaja com a plataforma — curtir, comentar, concluir aulas — para gerar novas notificações." />}
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} title="Limpar notificações?" message="Todas as notificações serão removidas." confirmLabel="Limpar" onConfirm={clearNotifications} />
    </div>
  );
}

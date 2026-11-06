import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, Users, GraduationCap, Award, ScanSearch, CalendarDays, Layers, TrendingUp, Trophy, Bookmark, HeartHandshake,
  UserCircle2, Bell, Settings, ShieldCheck, Search, Sun, Moon, Menu, X, LogOut,
} from 'lucide-react';
import { useStore, useAccount, useUserData } from '../store/useStore';
import { Avatar, ICONS, Toaster } from '../components/ui';
import { ACHIEVEMENTS } from '../data/gamification';
import { cn } from '../utils';
import { Logo } from '../components/Logo';

const MAIN = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/comunidade', label: 'Comunidade', icon: Users },
  { to: '/aprender', label: 'Fight Academy', icon: GraduationCap },
  { to: '/especialistas', label: 'Especialistas', icon: Award },
  { to: '/analises', label: 'Fight Breakdown', icon: ScanSearch },
  { to: '/eventos', label: 'Eventos', icon: CalendarDays },
  { to: '/modalidades', label: 'Modalidades', icon: Layers },
];
const YOU = [
  { to: '/progresso', label: 'Meu Progresso', icon: TrendingUp },
  { to: '/ranking', label: 'Ranking e Desafios', icon: Trophy },
  { to: '/favoritos', label: 'Favoritos', icon: Bookmark },
  { to: '/perfil', label: 'Fight ID', icon: UserCircle2, end: true },
];
const MORE = [
  { to: '/apoie', label: 'Apoie a Fight Flow', icon: HeartHandshake },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

function NavGroup({ title, items, onNavigate }: { title?: string; items: typeof MAIN; onNavigate?: () => void }) {
  return (
    <div className="space-y-1">
      {title && <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{title}</p>}
      {items.map((i) => (
        <NavLink key={i.to} to={i.to} end={i.end} onClick={onNavigate}
          className={({ isActive }) => cn('group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
            isActive ? 'bg-primary/15 text-accent' : 'text-muted hover:bg-bg2 hover:text-fg')}>
          {({ isActive }) => (<><i.icon size={19} className={cn(isActive && 'text-accent')} />{i.label}{isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}</>)}
        </NavLink>
      ))}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const acc = useAccount();
  return (
    <>
      <NavGroup items={MAIN} onNavigate={onNavigate} />
      <NavGroup title="Você" items={YOU} onNavigate={onNavigate} />
      <NavGroup title="Plataforma" items={acc?.role === 'admin' ? [...MORE, { to: '/admin', label: 'Painel Admin', icon: ShieldCheck }] : MORE} onNavigate={onNavigate} />
    </>
  );
}

function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggle = useStore((s) => s.toggleTheme);
  return (
    <button onClick={toggle} className="icon-btn" aria-label={theme === 'dark' ? 'Mudar para o tema Light Fight (branco e laranja)' : 'Mudar para o tema Dark Fight (preto e roxo)'} title="Alternar tema">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function SearchBox({ className }: { className?: string }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(loc.pathname === '/busca' ? params.get('q') ?? '' : '');
  useEffect(() => { if (loc.pathname !== '/busca') setQ(''); }, [loc.pathname]);
  const submit = (e: FormEvent) => { e.preventDefault(); nav(`/busca?q=${encodeURIComponent(q.trim())}`); };
  return (
    <form onSubmit={submit} role="search" className={cn('relative', className)}>
      <label htmlFor="global-search" className="sr-only">Buscar na Fight Flow</label>
      <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input id="global-search" value={q}
        onChange={(e) => { setQ(e.target.value); if (loc.pathname === '/busca') nav(`/busca?q=${encodeURIComponent(e.target.value)}`, { replace: true }); }}
        placeholder="Buscar cursos, atletas, análises, eventos…" className="input pl-10" />
    </form>
  );
}

function UserMenu() {
  const acc = useAccount();
  const logout = useStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  if (!acc) return null;
  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-bg2" aria-label="Menu da conta">
        <Avatar name={acc.name} preset={acc.avatar} size={34} />
        <span className="hidden text-sm font-semibold xl:inline">{acc.name.split(' ')[0]}</span>
      </button>
      {open && (
        <div role="menu" className="card animate-rise absolute right-0 top-12 z-50 w-56 p-2 shadow-2xl">
          <div className="px-3 py-2"><p className="text-sm font-bold">{acc.name}</p><p className="text-xs text-muted">@{acc.handle}</p></div>
          <Link role="menuitem" to="/perfil" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-bg2"><UserCircle2 size={16} />Meu Fight ID</Link>
          <Link role="menuitem" to="/configuracoes" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-bg2"><Settings size={16} />Configurações</Link>
          {acc.role === 'admin' && <Link role="menuitem" to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-bg2"><ShieldCheck size={16} />Painel Admin</Link>}
          <button role="menuitem" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-bg2"><LogOut size={16} />Sair</button>
        </div>
      )}
    </div>
  );
}

function AchievementFlash() {
  const id = useStore((s) => s.newAchievement);
  const clear = useStore((s) => s.clearAchievementFlash);
  useEffect(() => { if (id) { const t = setTimeout(clear, 3200); return () => clearTimeout(t); } }, [id, clear]);
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return null;
  const Icon = ICONS[a.icon];
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[75] flex justify-center px-4" aria-live="assertive">
      <div className="card animate-trophy pointer-events-auto flex items-center gap-4 border-primary p-4 pr-6 shadow-[0_20px_60px_-15px_rgb(var(--glow)/0.8)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-vivid text-white"><Icon size={28} /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Conquista desbloqueada</p>
          <p className="font-display text-2xl tracking-wide">{a.name}</p>
          <p className="text-xs text-muted">{a.description}</p>
        </div>
        <button className="ml-2 text-muted" onClick={clear} aria-label="Fechar"><X size={16} /></button>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const [drawer, setDrawer] = useState(false);
  const unread = useUserData().notifications.filter((n) => !n.read).length;
  const loc = useLocation();
  useEffect(() => { window.scrollTo(0, 0); setDrawer(false); }, [loc.pathname]);

  return (
    <div className="min-h-screen">
      <a href="#conteudo" className="sr-only z-[90] rounded-lg bg-primary px-4 py-2 text-onprimary focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Pular para o conteúdo</a>

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-bg lg:flex" aria-label="Navegação principal">
        <div className="px-5 py-5"><Logo /></div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4"><SidebarContent /></nav>
        <div className="m-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
          <strong>Ambiente demonstrativo.</strong> Dados fictícios salvos apenas no seu navegador.
        </div>
      </aside>

      {/* Drawer mobile */}
      {drawer && (
        <div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" onClick={() => setDrawer(false)}>
          <nav className="animate-slidein absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-bg p-4" onClick={(e) => e.stopPropagation()} aria-label="Menu">
            <div className="mb-4 flex items-center justify-between"><Logo /><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Fechar menu"><X size={18} /></button></div>
            <SidebarContent onNavigate={() => setDrawer(false)} />
          </nav>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
            <button className="icon-btn lg:hidden" onClick={() => setDrawer(true)} aria-label="Abrir menu"><Menu size={18} /></button>
            <div className="lg:hidden"><Logo compact /></div>
            <SearchBox className="hidden max-w-xl flex-1 md:block" />
            <div className="ml-auto flex items-center gap-2">
              <Link to="/busca" className="icon-btn md:hidden" aria-label="Buscar"><Search size={18} /></Link>
              <ThemeToggle />
              <Link to="/notificacoes" className="icon-btn relative" aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}>
                <Bell size={18} />
                {unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-onprimary">{unread > 9 ? '9+' : unread}</span>}
              </Link>
              <UserMenu />
            </div>
          </div>
        </header>

        <main id="conteudo" className="mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-6 lg:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Navegação inferior mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Navegação rápida">
        {[MAIN[0], MAIN[1], MAIN[2], MAIN[5]].map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold', isActive ? 'text-accent' : 'text-muted')}>
            <i.icon size={21} />{i.label.replace('Fight ', '')}
          </NavLink>
        ))}
        <NavLink to="/perfil" end className={({ isActive }) => cn('flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold', isActive ? 'text-accent' : 'text-muted')}>
          <UserCircle2 size={21} />Fight ID
        </NavLink>
      </nav>

      <Toaster />
      <AchievementFlash />
    </div>
  );
}

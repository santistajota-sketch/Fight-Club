import { useState, type FormEvent } from 'react';
import { ShieldCheck, Zap, UserPlus, Sun, Moon } from 'lucide-react';
import { useStore, levelsList } from '../store/useStore';
import { MODALITIES } from '../data/modalities';
import { Logo } from '../components/Logo';
import { HeroArt } from '../components/HeroArt';
import { AVATAR_PRESETS, Avatar } from '../components/ui';
import { cn } from '../utils';
import type { Level, ModalityId } from '../types';

const GOALS = ['Aprender os fundamentos', 'Evoluir na minha modalidade', 'Acompanhar eventos e análises', 'Participar da comunidade', 'Ensinar e compartilhar'];

export default function Login() {
  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const accounts = useStore((s) => s.accounts).filter((a) => a.id !== 'demo' && a.id !== 'admin');
  const [mode, setMode] = useState<'enter' | 'register'>('enter');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(0);
  const [mods, setMods] = useState<ModalityId[]>([]);
  const [level, setLevel] = useState<Level>('Iniciante');
  const [goal, setGoal] = useState(GOALS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = 'Informe um apelido com pelo menos 2 caracteres.';
    if (name.trim().length > 24) err.name = 'Use no máximo 24 caracteres.';
    if (!mods.length) err.mods = 'Escolha pelo menos uma modalidade favorita.';
    setErrors(err);
    if (Object.keys(err).length) return;
    const handle = name.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '') || 'lutador';
    register({ name: name.trim(), handle, bio: '', avatar, modalities: mods, level, goal });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-bg2 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Logo />
        <div>
          <HeroArt className="mx-auto w-full max-w-lg" />
          <h1 className="h-display mt-6 text-6xl">CONHECIMENTO.<br />COMUNIDADE.<br /><span className="text-accent">EVOLUÇÃO.</span></h1>
          <p className="mt-4 max-w-md text-muted">O universo das lutas em um só lugar. Aprenda com especialistas, acompanhe o esporte e evolua dentro e fora do tatame.</p>
        </div>
        <p className="text-xs text-muted">Ambiente demonstrativo · todos os dados são fictícios e ficam salvos apenas neste navegador.</p>
      </section>

      <section className="flex flex-col p-5 sm:p-10">
        <div className="flex items-center justify-between"><div className="lg:hidden"><Logo /></div><div className="ml-auto">
          <button onClick={toggleTheme} className="icon-btn" aria-label="Alternar tema">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div></div>
        <div className="mx-auto my-auto w-full max-w-md py-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Fight ID</p>
          <h2 className="h-display mt-1 text-5xl">{mode === 'enter' ? 'Entre no ringue' : 'Crie seu Fight ID'}</h2>
          <p className="mt-2 text-sm text-muted">Sem e-mail, senha, CPF ou telefone. Login e cadastro são locais e demonstrativos.</p>

          {mode === 'enter' ? (
            <div className="mt-8 space-y-3">
              <button onClick={() => login('demo')} className="btn-primary w-full py-3.5 text-base"><Zap size={18} />Entrar com a conta demonstrativa</button>
              <button onClick={() => login('admin')} className="btn-ghost w-full py-3.5"><ShieldCheck size={18} />Entrar como administrador (demo)</button>
              {accounts.length > 0 && (
                <div className="pt-4">
                  <p className="mb-2 text-sm font-semibold">Contas criadas neste navegador</p>
                  <div className="space-y-2">
                    {accounts.map((a) => (
                      <button key={a.id} onClick={() => login(a.id)} className="card flex w-full items-center gap-3 p-3 text-left hover:border-primary/60">
                        <Avatar name={a.name} preset={a.avatar} size={36} /><span className="font-semibold">{a.name}</span><span className="text-xs text-muted">@{a.handle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="relative py-4 text-center text-xs text-muted"><span className="bg-bg px-2">ou</span><div className="absolute inset-x-0 top-1/2 -z-10 border-t border-line" /></div>
              <button onClick={() => setMode('register')} className="btn-soft w-full py-3"><UserPlus size={18} />Criar cadastro local</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <div>
                <label htmlFor="nick" className="label">Apelido</label>
                <input id="nick" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Tigre do Tatame" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'nick-err' : undefined} maxLength={30} />
                {errors.name && <p id="nick-err" className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <fieldset>
                <legend className="label">Avatar</legend>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_PRESETS.map((_, i) => (
                    <button type="button" key={i} onClick={() => setAvatar(i)} aria-pressed={avatar === i} aria-label={`Estilo de avatar ${i + 1}`}
                      className={cn('rounded-full p-0.5', avatar === i ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100')}>
                      <Avatar name={name || 'FF'} preset={i} size={40} />
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="label">Modalidades favoritas</legend>
                <div className="flex flex-wrap gap-2">
                  {MODALITIES.map((m) => (
                    <button type="button" key={m.id} aria-pressed={mods.includes(m.id)} onClick={() => setMods((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))}
                      className={cn('chip', mods.includes(m.id) && 'chip-on')}>{m.name}</button>
                  ))}
                </div>
                {errors.mods && <p className="mt-1 text-sm text-red-500">{errors.mods}</p>}
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lvl" className="label">Nível de experiência</label>
                  <select id="lvl" className="input" value={level} onChange={(e) => setLevel(e.target.value as Level)}>{levelsList.map((l) => <option key={l}>{l}</option>)}</select>
                </div>
                <div>
                  <label htmlFor="goal" className="label">Objetivo</label>
                  <select id="goal" className="input" value={goal} onChange={(e) => setGoal(e.target.value)}>{GOALS.map((g) => <option key={g}>{g}</option>)}</select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn-ghost" onClick={() => setMode('enter')}>Voltar</button>
                <button type="submit" className="btn-primary flex-1">Criar Fight ID</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

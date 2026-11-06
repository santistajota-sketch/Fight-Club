import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Gift, CheckCircle2, Lock } from 'lucide-react';
import { useStore, useAccount, useUserData, computeStats, challengeProgress } from '../store/useStore';
import { useFavorites } from '../hooks/useContent';
import { Avatar, PageHeader, ProgressBar, Tabs, ICONS } from '../components/ui';
import { PROFILES } from '../data/profiles';
import { ACHIEVEMENTS, CHALLENGES, LEVELS, levelFor } from '../data/gamification';
import { modalityName } from '../data/modalities';
import { cn, compact, fmtDate, timeAgo, weekKey, startOfWeek, DAY } from '../utils';

type Tab = 'ranking' | 'challenges' | 'medals' | 'history';
const ACT_LABEL: Record<string, string> = { lesson: 'Aula concluída', course: 'Curso concluído', analysis: 'Análise lida', post: 'Publicação', comment: 'Comentário', like: 'Curtida', challenge: 'Desafio concluído', prediction: 'Palpite registrado', donation: 'Apoio simulado', modality: 'Modalidade' };

export default function Ranking() {
  const [tab, setTab] = useState<Tab>('ranking');
  const acc = useAccount()!;
  const u = useUserData();
  const courses = useStore((s) => s.courses);
  const claim = useStore((s) => s.claimChallenge);
  const favs = useFavorites();
  const stats = computeStats(u, courses);
  const claimed = u.claimed[weekKey()] ?? [];
  const rows = [...PROFILES.map((p) => ({ id: p.id, name: p.name, hue: p.hue, preset: undefined as number | undefined, xp: p.xp, mod: p.modality as string, me: false, link: `/perfil/${p.id}` })),
    { id: acc.id, name: acc.name, hue: undefined, preset: acc.avatar, xp: u.xp, mod: acc.modalities[0] ?? 'mma', me: true, link: '/perfil' }].sort((a, b) => b.xp - a.xp);
  const daysLeft = Math.ceil((startOfWeek() + 7 * DAY - Date.now()) / DAY);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Fight Challenges" title="Ranking e desafios" text="Ganhe Fight XP fictícios estudando, lendo análises e participando da comunidade. Sem prêmios financeiros." />
      <Tabs<Tab> label="Seções" value={tab} onChange={setTab} options={[{ value: 'ranking', label: 'Ranking' }, { value: 'challenges', label: 'Desafios semanais' }, { value: 'medals', label: 'Medalhas' }, { value: 'history', label: 'Histórico' }]} />

      {tab === 'ranking' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-3 items-end gap-3 bg-bg2 p-5">
              {[rows[1], rows[0], rows[2]].map((r, i) => r && (
                <Link to={r.link} key={r.id} className={cn('flex flex-col items-center gap-2 text-center', i === 1 && '-mt-4')}>
                  <div className="relative"><Avatar name={r.name} hue={r.hue} preset={r.preset} size={i === 1 ? 76 : 60} /><span className={cn('absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full font-display text-lg text-black', i === 1 ? 'bg-amber-400' : i === 0 ? 'bg-zinc-300' : 'bg-orange-300')}>{i === 1 ? 1 : i === 0 ? 2 : 3}</span></div>
                  <p className="mt-2 line-clamp-1 text-sm font-semibold">{r.name}</p><p className="text-xs font-bold text-accent">{compact(r.xp)} XP</p>
                </Link>
              ))}
            </div>
            <table className="w-full text-sm">
              <caption className="sr-only">Ranking de Fight XP</caption>
              <thead className="text-left text-xs uppercase tracking-wider text-muted"><tr><th className="p-3 pl-5">#</th><th className="p-3">Membro</th><th className="hidden p-3 sm:table-cell">Nível</th><th className="p-3 pr-5 text-right">XP</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} className={cn('border-t border-line', r.me && 'bg-primary/10')}>
                    <td className="p-3 pl-5 font-display text-xl text-muted">{i + 1}</td>
                    <td className="p-3"><Link to={r.link} className="flex items-center gap-3"><Avatar name={r.name} hue={r.hue} preset={r.preset} size={32} /><div><p className="font-semibold">{r.name}{r.me && ' (você)'}</p><p className="text-xs text-muted">{modalityName(r.mod)}</p></div></Link></td>
                    <td className="hidden p-3 sm:table-cell"><span className="badge bg-bg2 text-fg">{levelFor(r.xp).level} · {levelFor(r.xp).name}</span></td>
                    <td className="p-3 pr-5 text-right font-bold">{r.xp.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="card h-fit p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><Medal size={18} className="text-accent" />Níveis</h2>
            <ol className="space-y-2">
              {LEVELS.map((l, i) => (
                <li key={l.name} className={cn('flex items-center justify-between rounded-lg px-3 py-2 text-sm', levelFor(u.xp).level === i + 1 ? 'bg-primary/15 font-bold text-accent' : 'text-muted')}>
                  <span>{i + 1}. {l.name}</span><span>{l.min}+ XP</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">Usuários do ranking são fictícios. Pontos não têm valor monetário.</p>
          </aside>
        </div>
      )}

      {tab === 'challenges' && (
        <div>
          <p className="mb-4 text-sm text-muted">Semana atual · renova em {daysLeft} dia(s). Desafios educativos — nenhum envolve treino físico arriscado.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {CHALLENGES.map((ch) => {
              const p = Math.min(challengeProgress(u, ch.metric, favs), ch.target);
              const complete = p >= ch.target; const isClaimed = claimed.includes(ch.id);
              return (
                <div key={ch.id} className={cn('card flex flex-col p-5', isClaimed && 'border-emerald-500/50')}>
                  <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{ch.title}</h3><span className="badge bg-primary/15 text-accent">+{ch.xp} XP</span></div>
                  <p className="mt-1 flex-1 text-sm text-muted">{ch.description}</p>
                  <div className="mt-4 mb-1 flex justify-between text-xs font-semibold"><span>Progresso</span><span>{p}/{ch.target}</span></div>
                  <ProgressBar value={(p / ch.target) * 100} label={ch.title} />
                  <button disabled={!complete || isClaimed} onClick={() => claim(ch.id)} className={cn('mt-4', isClaimed ? 'btn-ghost' : 'btn-primary')}>
                    {isClaimed ? <><CheckCircle2 size={16} className="text-emerald-500" />Resgatado</> : complete ? <><Gift size={16} />Resgatar recompensa</> : <><Lock size={16} />Em andamento</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'medals' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {ACHIEVEMENTS.map((a) => {
            const Icon = ICONS[a.icon]; const at = u.unlocked[a.id]; const [p, t] = a.progress(stats);
            return (
              <div key={a.id} className={cn('card flex flex-col items-center p-5 text-center', !at && 'opacity-60')}>
                <span className={cn('flex h-16 w-16 items-center justify-center rounded-2xl', at ? 'bg-gradient-to-br from-primary to-vivid text-white shadow-[0_10px_30px_-10px_rgb(var(--glow)/0.8)]' : 'bg-bg2 text-muted')}>{at ? <Icon size={30} /> : <Lock size={26} />}</span>
                <p className="mt-3 font-bold">{a.name}</p><p className="text-xs text-muted">{a.description}</p>
                <p className="mt-2 text-xs font-semibold text-accent">{at ? `Desbloqueada em ${fmtDate(at)}` : `${p}/${t}`}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'history' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><Trophy size={18} className="text-accent" />Conquistas desbloqueadas</h2>
            <ul className="space-y-3">
              {Object.entries(u.unlocked).sort((a, b) => b[1] - a[1]).map(([id, ts]) => { const a = ACHIEVEMENTS.find((x) => x.id === id); return a && <li key={id} className="flex justify-between text-sm"><span className="font-semibold">{a.name}</span><span className="text-muted">{fmtDate(ts)}</span></li>; })}
              {!Object.keys(u.unlocked).length && <li className="text-sm text-muted">Nenhuma conquista ainda.</li>}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-bold">Últimos Fight XP</h2>
            <ul className="max-h-96 space-y-2 overflow-y-auto">
              {[...u.activity].reverse().slice(0, 40).map((a, i) => <li key={i} className="flex justify-between text-sm"><span>{ACT_LABEL[a.type] ?? a.type} <span className="text-xs text-muted">· {timeAgo(a.ts)}</span></span><span className="font-semibold text-accent">+{a.xp ?? 0}</span></li>)}
              {!u.activity.length && <li className="text-sm text-muted">Sem atividades registradas.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

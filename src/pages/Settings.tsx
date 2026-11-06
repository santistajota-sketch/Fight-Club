import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, RotateCcw, LogOut, Download, Accessibility, Info } from 'lucide-react';
import { useStore, useAccount } from '../store/useStore';
import { ConfirmDialog, PageHeader } from '../components/ui';
import { cn, downloadText } from '../utils';

export default function Settings() {
  const { theme, setTheme, reducedMotion, setReducedMotion, resetDemo, logout } = useStore();
  const acc = useAccount()!;
  const [reset, setReset] = useState(false);
  const exportData = () => {
    const s = useStore.getState();
    downloadText('fight-flow-meus-dados.json', JSON.stringify({ conta: acc, dados: s.users[acc.id] }, null, 2));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader eyebrow="Conta" title="Configurações" />
      <section className="card p-5">
        <h2 className="mb-1 font-bold">Tema</h2>
        <p className="mb-4 text-sm text-muted">A preferência fica salva neste navegador e vale para toda a plataforma.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {([['dark', 'Dark Fight', 'Preto + roxo', Moon, '#09090F', '#8B5CF6'], ['light', 'Light Fight', 'Branco + laranja', Sun, '#FFFFFF', '#F97316']] as const).map(([v, name, d, Icon, bg, pr]) => (
            <button key={v} onClick={() => setTheme(v)} aria-pressed={theme === v} className={cn('flex items-center gap-4 rounded-2xl border-2 p-4 text-left', theme === v ? 'border-primary' : 'border-line')}>
              <span className="flex h-14 w-20 items-end gap-1 rounded-xl border border-line p-2" style={{ background: bg }}><span className="h-3 w-8 rounded" style={{ background: pr }} /><span className="h-3 w-4 rounded opacity-40" style={{ background: pr }} /></span>
              <div><p className="flex items-center gap-2 font-bold"><Icon size={16} />{name}</p><p className="text-sm text-muted">{d}</p></div>
            </button>
          ))}
        </div>
      </section>
      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Accessibility size={18} />Acessibilidade</h2>
        <label className="flex items-center justify-between gap-4">
          <span><span className="block text-sm font-semibold">Reduzir movimento</span><span className="text-xs text-muted">Desativa animações e transições. A preferência do sistema operacional também é respeitada.</span></span>
          <input type="checkbox" className="h-5 w-5 accent-[rgb(var(--primary))]" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
        </label>
      </section>
      <section className="card p-5">
        <h2 className="mb-3 font-bold">Dados da demonstração</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={exportData}><Download size={16} />Exportar meus dados (JSON)</button>
          <button className="btn-danger" onClick={() => setReset(true)}><RotateCcw size={16} />Restaurar dados da demonstração</button>
        </div>
        <p className="mt-3 text-xs text-muted">Restaurar apaga contas criadas, publicações, progresso, favoritos e alterações do painel admin, voltando ao estado inicial (o tema é mantido).</p>
      </section>
      <section className="card p-5">
        <h2 className="mb-3 font-bold">Sessão</h2>
        <p className="mb-3 text-sm text-muted">Conectado como <strong className="text-fg">{acc.name}</strong> ({acc.role === 'admin' ? 'administrador demo' : 'usuário demo'}).</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/perfil" className="btn-ghost">Editar perfil</Link>
          <button className="btn-ghost" onClick={logout}><LogOut size={16} />Sair</button>
        </div>
      </section>
      <p className="flex items-start gap-2 text-xs text-muted"><Info size={14} className="mt-0.5 shrink-0" />Fight Flow é uma plataforma demonstrativa: sem servidores, sem pagamentos, sem coleta de dados pessoais. Tudo fica no localStorage do seu navegador.</p>
      <ConfirmDialog open={reset} onClose={() => setReset(false)} title="Restaurar demonstração?" message="Todos os dados locais serão substituídos pelos dados fictícios iniciais. Esta ação não pode ser desfeita." confirmLabel="Restaurar" onConfirm={resetDemo} />
    </div>
  );
}

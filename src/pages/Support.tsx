import { useState } from 'react';
import { HeartHandshake, ShieldAlert, Code2, Video, Users2, Server, Sparkles, CheckCircle2, Receipt, Printer } from 'lucide-react';
import { useStore, useUserData } from '../store/useStore';
import { Modal, PageHeader, ProgressBar } from '../components/ui';
import { brl, cn, fmtDate } from '../utils';
import type { Donation } from '../types';

const TIERS = [
  { amount: 5, name: 'Apoio Inicial' }, { amount: 10, name: 'Parceiro Fight' },
  { amount: 25, name: 'Apoiador Pro' }, { amount: 50, name: 'Campeão da Comunidade' },
];
const FICTIONAL_BASE = 7340; // valor fictício já "arrecadado" pela comunidade de demonstração
const GOAL = 15000;

function Disclaimer() {
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
      <ShieldAlert className="mt-0.5 shrink-0" size={20} />
      <p><strong>Ambiente demonstrativo. Nenhuma cobrança ou transferência financeira será realizada.</strong> Não pedimos cartão, Pix, dados bancários ou qualquer informação financeira.</p>
    </div>
  );
}

export default function Support() {
  const donate = useStore((s) => s.donate);
  const u = useUserData();
  const [tier, setTier] = useState<number | 'custom'>(10);
  const [custom, setCustom] = useState('');
  const [freq, setFreq] = useState<'única' | 'mensal'>('única');
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<Donation | null>(null);
  const [err, setErr] = useState('');

  const amount = tier === 'custom' ? Number(custom.replace(',', '.')) : tier;
  const tierName = tier === 'custom' ? 'Valor personalizado' : TIERS.find((t) => t.amount === tier)!.name;
  const mine = u.donations.reduce((s, d) => s + d.amount, 0);
  const raised = FICTIONAL_BASE + mine;

  const review = () => {
    if (!amount || isNaN(amount) || amount < 1) { setErr('Informe um valor a partir de R$ 1,00.'); return; }
    if (amount > 10000) { setErr('Para a simulação, use um valor de até R$ 10.000,00.'); return; }
    setErr(''); setOpen(true);
  };
  const confirm = () => { const d = donate({ amount, frequency: freq, tier: tierName }); setOpen(false); setReceipt(d); };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Fight Support" title="Apoie a Fight Flow" />
      <Disclaimer />

      <section className="relative overflow-hidden rounded-3xl border border-line bg-bg2 p-6 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(var(--primary)/0.22),transparent_60%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2">
          <div>
            <HeartHandshake size={40} className="text-accent" />
            <p className="mt-4 text-xl leading-relaxed">A Fight Flow nasceu para conectar pessoas apaixonadas pelo universo das lutas. Com o apoio da comunidade, podemos desenvolver novos recursos, trazer especialistas e ampliar o acesso ao conhecimento.</p>
            <div className="mt-6">
              <div className="mb-2 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-muted">Meta coletiva (fictícia)</p><p className="font-display text-4xl">{brl(raised)}</p></div><p className="text-sm text-muted">de {brl(GOAL)}</p></div>
              <ProgressBar value={(raised / GOAL) * 100} className="h-3" label="Progresso da meta coletiva fictícia" />
              <p className="mt-2 text-xs text-muted">Inclui {brl(FICTIONAL_BASE)} de valores fictícios de demonstração + {brl(mine)} das suas contribuições simuladas.</p>
            </div>
          </div>
          <div className="card p-5">
            <fieldset>
              <legend className="label">Escolha um valor</legend>
              <div className="grid grid-cols-2 gap-2">
                {TIERS.map((t) => (
                  <button key={t.amount} onClick={() => setTier(t.amount)} aria-pressed={tier === t.amount}
                    className={cn('rounded-xl border p-3 text-left transition-colors', tier === t.amount ? 'border-primary bg-primary/15' : 'border-line hover:border-primary/50')}>
                    <p className="font-display text-2xl">{brl(t.amount)}</p><p className="text-xs text-muted">{t.name}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setTier('custom')} aria-pressed={tier === 'custom'} className={cn('mt-2 w-full rounded-xl border p-3 text-left', tier === 'custom' ? 'border-primary bg-primary/15' : 'border-line hover:border-primary/50')}>
                <p className="font-semibold">Outro valor personalizado</p>
              </button>
              {tier === 'custom' && (
                <div className="mt-2"><label htmlFor="custom" className="sr-only">Valor personalizado em reais</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">R$</span><input id="custom" inputMode="decimal" className="input pl-10" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d,.]/g, ''))} placeholder="0,00" aria-invalid={!!err} /></div>
                </div>
              )}
            </fieldset>
            <fieldset className="mt-4">
              <legend className="label">Frequência</legend>
              <div className="grid grid-cols-2 gap-2">
                {(['única', 'mensal'] as const).map((f) => (
                  <button key={f} onClick={() => setFreq(f)} aria-pressed={freq === f} className={cn('rounded-xl border px-3 py-2.5 text-sm font-semibold', freq === f ? 'border-primary bg-primary/15 text-accent' : 'border-line')}>
                    {f === 'única' ? 'Contribuição única' : 'Apoio mensal demonstrativo'}
                  </button>
                ))}
              </div>
            </fieldset>
            {err && <p className="mt-3 text-sm text-red-500" role="alert">{err}</p>}
            <button onClick={review} className="btn-primary mt-5 w-full py-3 text-base"><HeartHandshake size={18} />Continuar</button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">Como as contribuições poderiam ajudar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[[Code2, 'Desenvolvimento da plataforma', 'Novos recursos, acessibilidade e app mobile.'], [Video, 'Produção de novas aulas', 'Gravação e edição de cursos com especialistas.'], [Sparkles, 'Apoio aos criadores', 'Remuneração de treinadores e analistas.'], [Users2, 'Expansão da comunidade', 'Eventos online, moderação e projetos sociais.'], [Server, 'Melhorias de infraestrutura', 'Servidores, streaming e segurança.']].map(([Icon, t, d]) => {
            const I = Icon as typeof Code2;
            return <div key={t as string} className="card p-5"><I className="text-accent" /><h3 className="mt-3 font-bold">{t as string}</h3><p className="mt-1 text-sm text-muted">{d as string}</p></div>;
          })}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Receipt size={18} />Histórico de contribuições simuladas</h2>
        {u.donations.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted"><tr><th className="py-2">Comprovante</th><th>Data</th><th>Tipo</th><th>Plano</th><th className="text-right">Valor</th></tr></thead>
              <tbody>{u.donations.map((d) => <tr key={d.id} className="border-t border-line"><td className="py-2.5 font-mono text-xs">{d.id}</td><td>{fmtDate(d.ts)}</td><td className="capitalize">{d.frequency}</td><td>{d.tier}</td><td className="text-right font-semibold">{brl(d.amount)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <p className="text-sm text-muted">Nenhuma contribuição simulada ainda.</p>}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Resumo da contribuição">
        <dl className="space-y-2 rounded-xl bg-bg2 p-4 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Valor escolhido</dt><dd className="font-display text-2xl">{brl(amount || 0)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Tipo de contribuição</dt><dd className="font-semibold">{freq === 'única' ? 'Contribuição única' : 'Apoio mensal demonstrativo'}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Plano</dt><dd className="font-semibold">{tierName}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-muted">Resumo: você está simulando um apoio de {brl(amount || 0)} {freq === 'mensal' ? 'por mês (sem assinatura real)' : 'uma única vez'}. Nenhum dado de pagamento será solicitado.</p>
        <div className="mt-4"><Disclaimer /></div>
        <div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setOpen(false)}>Cancelar</button><button className="btn-primary" onClick={confirm}>Simular contribuição</button></div>
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Comprovante demonstrativo">
        {receipt && (
          <div className="text-center">
            <CheckCircle2 size={56} className="mx-auto text-emerald-500 animate-trophy" />
            <p className="mt-3 text-lg font-bold">Obrigado por apoiar a Fight Flow! Sua contribuição foi simulada com sucesso.</p>
            <dl className="mt-5 space-y-2 rounded-xl border border-dashed border-line p-4 text-left text-sm">
              <div className="flex justify-between"><dt className="text-muted">Comprovante</dt><dd className="font-mono">{receipt.id}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Data</dt><dd>{new Date(receipt.ts).toLocaleString('pt-BR')}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Valor</dt><dd className="font-semibold">{brl(receipt.amount)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Frequência</dt><dd className="capitalize">{receipt.frequency}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Status</dt><dd className="font-semibold text-amber-600 dark:text-amber-300">SIMULADO — sem cobrança</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted">Documento sem valor fiscal ou financeiro. +50 Fight XP pela participação.</p>
            <div className="mt-5 flex justify-center gap-2"><button className="btn-ghost" onClick={() => window.print()}><Printer size={16} />Imprimir</button><button className="btn-primary" onClick={() => setReceipt(null)}>Fechar</button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

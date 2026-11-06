import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore, useAccount } from '../store/useStore';
import { Cover } from '../components/Cover';
import { PageHeader } from '../components/ui';
import { MODALITIES } from '../data/modalities';
import { cn } from '../utils';

export function FavModalityButton({ id, name, light }: { id: (typeof MODALITIES)[number]['id']; name: string; light?: boolean }) {
  const acc = useAccount();
  const toggle = useStore((s) => s.toggleFavoriteModality);
  const on = acc?.modalities.includes(id);
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }} aria-pressed={on} aria-label={on ? `Remover ${name} das favoritas` : `Adicionar ${name} às favoritas`}
      className={cn('btn px-3 py-1.5 text-xs', on ? 'bg-rose-500 text-white' : light ? 'bg-white/20 text-white backdrop-blur hover:bg-white/30' : 'btn-ghost')}>
      <Heart size={14} className={on ? 'fill-current animate-pop' : ''} />{on ? 'Favorita' : 'Favoritar'}
    </button>
  );
}

export default function Modalities() {
  const courses = useStore((s) => s.courses);
  const acc = useAccount();
  return (
    <div>
      <PageHeader eyebrow="Explorar" title="Modalidades" text="Conheça as artes marciais e escolha suas favoritas — elas personalizam o Fight Hub na página inicial.">
        <p className="text-sm text-muted">{acc?.modalities.length ?? 0} favorita(s)</p>
      </PageHeader>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {MODALITIES.map((m) => (
          <Link key={m.id} to={`/modalidades/${m.id}`} className="card card-hover group overflow-hidden">
            <div className="relative h-44">
              <Cover seed={m.id} modality={m.id} className="absolute inset-0" big />
              <div className="absolute right-3 top-3"><FavModalityButton id={m.id} name={m.name} light /></div>
              <div className="absolute bottom-3 left-4 text-white"><p className="font-display text-4xl tracking-wide">{m.name}</p><p className="text-xs text-white/80">{m.short} · {m.origin}</p></div>
            </div>
            <div className="p-4">
              <p className="line-clamp-2 text-sm text-muted">{m.description}</p>
              <p className="mt-3 text-xs font-semibold text-accent">{courses.filter((c) => c.modality === m.id).length} curso(s) · {m.popularity}% de interesse</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

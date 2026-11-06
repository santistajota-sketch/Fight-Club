import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="h-display bg-gradient-to-r from-primary to-vivid bg-clip-text text-[9rem] text-transparent">404</p>
      <h1 className="h-display text-4xl">Nocaute! Página não encontrada</h1>
      <p className="mt-2 max-w-md text-muted">O endereço que você tentou acessar não existe ou foi removido.</p>
      <div className="mt-6 flex gap-2"><Link to="/" className="btn-primary">Voltar ao início</Link><Link to="/busca" className="btn-ghost">Buscar</Link></div>
    </div>
  );
}

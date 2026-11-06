import { useEffect, useState } from 'react';

/** Skeleton loading simulado (curto) para dar sensação de carregamento de dados. */
export const useFakeLoading = (ms = 450) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), ms); return () => clearTimeout(t); }, [ms]);
  return loading;
};

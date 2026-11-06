import { useStore } from '../store/useStore';

/** Cores dos gráficos (Recharts não lê variáveis CSS em atributos SVG de forma confiável) */
export const useChartColors = () => {
  const theme = useStore((s) => s.theme);
  return theme === 'dark'
    ? { primary: '#8B5CF6', vivid: '#A855F7', grid: '#2A2A3E', text: '#A1A1AA', bg: '#151522', series: ['#8B5CF6', '#A855F7', '#22D3EE', '#F472B6', '#FBBF24', '#34D399'] }
    : { primary: '#F97316', vivid: '#EA580C', grid: '#E5E5E5', text: '#666666', bg: '#FFFFFF', series: ['#F97316', '#EA580C', '#0EA5E9', '#DB2777', '#CA8A04', '#059669'] };
};

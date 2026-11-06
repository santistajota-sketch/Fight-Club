import { create } from 'zustand';

export type ToastKind = 'success' | 'error' | 'info';
export interface ToastItem { id: number; text: string; kind: ToastKind }

interface ToastState { items: ToastItem[]; dismiss: (id: number) => void }

let n = 0;
export const useToasts = create<ToastState>((set) => ({
  items: [],
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

export const toast = (text: string, kind: ToastKind = 'info') => {
  const id = ++n;
  useToasts.setState((s) => ({ items: [...s.items.slice(-3), { id, text, kind }] }));
  setTimeout(() => useToasts.getState().dismiss(id), 3800);
};

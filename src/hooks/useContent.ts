import { useMemo } from 'react';
import { useStore, useAccount, useUserData, courseLessonIds } from '../store/useStore';
import { PROFILES } from '../data/profiles';
import { DAY } from '../utils';
import type { Course, EventStatus, FightEvent, ModalityId } from '../types';

export interface AuthorInfo { id: string; name: string; handle: string; hue?: number; preset?: number; link: string; role: string; isMe: boolean }

export const useAuthorLookup = () => {
  const accounts = useStore((s) => s.accounts);
  const experts = useStore((s) => s.experts);
  const sessionId = useStore((s) => s.sessionId);
  return useMemo(() => (id: string): AuthorInfo => {
    const acc = accounts.find((a) => a.id === id);
    if (acc) return { id, name: acc.name, handle: acc.handle, preset: acc.avatar, link: acc.id === sessionId ? '/perfil' : `/perfil/${acc.id}`, role: acc.role === 'admin' ? 'Administrador' : 'Membro', isMe: acc.id === sessionId };
    const p = PROFILES.find((x) => x.id === id);
    if (p) return { id, name: p.name, handle: p.handle, hue: p.hue, link: `/perfil/${p.id}`, role: p.role, isMe: false };
    const e = experts.find((x) => x.id === id);
    if (e) return { id, name: e.name, handle: e.name.toLowerCase().replace(/[^a-z]/g, ''), hue: e.hue, link: `/especialistas/${e.id}`, role: 'Especialista', isMe: false };
    return { id, name: 'Membro removido', handle: 'removido', link: '/comunidade', role: '', isMe: false };
  }, [accounts, experts, sessionId]);
};

export const useCourseProgress = () => {
  const done = useUserData().completedLessons;
  return useMemo(() => (c: Course) => {
    const ids = courseLessonIds(c);
    const n = ids.filter((id) => done.includes(id)).length;
    return { done: n, total: ids.length, pct: ids.length ? Math.round((n / ids.length) * 100) : 0 };
  }, [done]);
};

export const courseMinutes = (c: Course, lessons: { id: string; minutes: number }[]) =>
  courseLessonIds(c).reduce((s, id) => s + (lessons.find((l) => l.id === id)?.minutes ?? 0), 0);

export const eventDate = (e: FightEvent) => {
  const d = new Date(); d.setHours(20, 0, 0, 0);
  return d.getTime() + e.dayOffset * DAY;
};

export const eventStatus = (e: FightEvent): EventStatus => {
  if (e.dayOffset + e.durationDays <= 0) return 'Encerrado';
  if (e.dayOffset <= 0) return 'Acontecendo';
  return 'Programado';
};

/** Modalidades favoritas da conta (ou padrão), usadas pelo Fight Hub */
export const useFavorites = (): ModalityId[] => {
  const acc = useAccount();
  return acc?.modalities?.length ? acc.modalities : ['mma', 'boxe', 'bjj'];
};

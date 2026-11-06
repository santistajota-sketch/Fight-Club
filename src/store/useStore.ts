import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Account, Activity, ActivityType, Analysis, Course, Donation, Expert, FightEvent, Goal, Lesson,
  ModalityId, Notification, Post, Question, SavedItem, SavedType, ThemeName, Level,
} from '../types';
import { SEED_COURSES, SEED_LESSONS } from '../data/courses';
import { EXPERTS } from '../data/experts';
import { makeSeedPosts } from '../data/posts';
import { SEED_ANALYSES } from '../data/analyses';
import { SEED_EVENTS } from '../data/events';
import { PROFILES } from '../data/profiles';
import { ACHIEVEMENTS, CHALLENGES, XP, type Stats } from '../data/gamification';
import { DAY, dayKey, startOfDay, startOfWeek, uid, weekKey } from '../utils';
import { toast } from './toast';

export interface UserData {
  xp: number;
  activity: Activity[];
  completedLessons: string[];
  notes: Record<string, string>;
  likedPosts: string[];
  saved: SavedItem[];
  follows: string[];
  readAnalyses: string[];
  notifications: Notification[];
  donations: Donation[];
  goals: Goal[];
  predictions: Record<string, string>;
  claimed: Record<string, string[]>; // semana -> desafios resgatados
  unlocked: Record<string, number>;
  lastLesson?: { courseId: string; lessonId: string };
}

interface ContentState {
  posts: Post[];
  courses: Course[];
  lessons: Lesson[];
  experts: Expert[];
  analyses: Analysis[];
  events: FightEvent[];
  questions: Question[];
}

interface State extends ContentState {
  theme: ThemeName;
  reducedMotion: boolean;
  accounts: Account[];
  sessionId: string | null;
  users: Record<string, UserData>;
  newAchievement: string | null;

  // sessão
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  setReducedMotion: (v: boolean) => void;
  login: (id: string) => void;
  logout: () => void;
  register: (a: Omit<Account, 'id' | 'joined' | 'role'>) => void;
  updateAccount: (patch: Partial<Account>) => void;
  resetDemo: () => void;
  clearAchievementFlash: () => void;

  // comunidade
  createPost: (p: Pick<Post, 'text' | 'modality' | 'hashtags' | 'image' | 'videoUrl'>) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  sharePost: (postId: string) => void;
  toggleFollow: (id: string, label: string) => void;
  toggleSave: (type: SavedType, id: string) => void;

  // aprendizado
  completeLesson: (lessonId: string) => void;
  uncompleteLesson: (lessonId: string) => void;
  setNote: (lessonId: string, text: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  askQuestion: (courseId: string, text: string) => void;
  markAnalysisRead: (id: string) => void;
  toggleFavoriteModality: (id: ModalityId) => void;

  // eventos / gamificação
  predict: (fightId: string, fighterId: string) => void;
  claimChallenge: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;

  // notificações
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;

  // apoio
  donate: (d: Omit<Donation, 'id' | 'ts'>) => Donation;

  // admin
  upsert: <K extends keyof ContentState>(key: K, item: ContentState[K][number]) => void;
  remove: <K extends keyof ContentState>(key: K, id: string) => void;
}

const emptyUser = (): UserData => ({
  xp: 0, activity: [], completedLessons: [], notes: {}, likedPosts: [], saved: [], follows: [], readAnalyses: [],
  notifications: [], donations: [], goals: [], predictions: {}, claimed: {}, unlocked: {},
});

const DEMO_ID = 'demo';
const ADMIN_ID = 'admin';

const seedAccounts = (): Account[] => {
  const now = Date.now();
  return [
    { id: DEMO_ID, name: 'Lutador Demo', handle: 'lutadordemo', bio: 'Conta demonstrativa da Fight Flow. Treino boxe e estou começando no Jiu-Jitsu.', avatar: 0, modalities: ['boxe', 'bjj'], level: 'Iniciante', goal: 'Aprender os fundamentos e acompanhar eventos', joined: now - 74 * DAY, role: 'user' },
    { id: ADMIN_ID, name: 'Admin Demo', handle: 'admin', bio: 'Conta administrativa de demonstração.', avatar: 5, modalities: ['mma'], level: 'Avançado', goal: 'Gerenciar o conteúdo da plataforma', joined: now - 200 * DAY, role: 'admin' },
  ];
};

const seedUsers = (): Record<string, UserData> => {
  const now = Date.now();
  const at = (days: number, h = 19) => startOfDay(now - days * DAY) + h * 3600_000;
  const demo = emptyUser();
  const lessonsDone: [string, number, ModalityId][] = [
    ['c1-l11', 6, 'boxe'], ['c1-l12', 5, 'boxe'], ['c1-l13', 3, 'boxe'], ['c2-l11', 2, 'bjj'], ['c2-l12', 1, 'bjj'],
  ];
  lessonsDone.forEach(([id, d, m]) => {
    demo.completedLessons.push(id);
    demo.activity.push({ type: 'lesson', ts: at(d), ref: id, modality: m, xp: XP.lesson });
  });
  demo.readAnalyses = ['a1'];
  demo.activity.push({ type: 'analysis', ts: at(2, 21), ref: 'a1', modality: 'boxe', xp: XP.analysis });
  demo.activity.push({ type: 'comment', ts: at(4), ref: 'p3', xp: XP.comment });
  demo.xp = 640;
  demo.follows = ['e1', 'e2', 'u3', 'u13'];
  demo.saved = [{ type: 'course', id: 'c11', ts: at(5) }, { type: 'analysis', id: 'a3', ts: at(3) }, { type: 'post', id: 'p2', ts: at(1) }];
  demo.unlocked = { 'first-round': at(6), 'iron-discipline': at(1) };
  demo.goals = [
    { id: 'g1', kind: 'lessons_week', label: 'Estudar 3 aulas por semana', target: 3, createdAt: at(10) },
    { id: 'g2', kind: 'finish_course', label: 'Concluir um curso', target: 1, createdAt: at(10) },
    { id: 'g3', kind: 'read_analyses', label: 'Ler 5 análises técnicas', target: 5, createdAt: at(8) },
  ];
  demo.lastLesson = { courseId: 'c2', lessonId: 'c2-l13' };
  demo.notifications = [
    { id: 'n1', kind: 'comment', text: 'Lívia Tavares comentou no post que você salvou: “Vou testar amanhã!”', ts: now - 2 * 3600_000, read: false, link: '/comunidade/post/p3' },
    { id: 'n2', kind: 'follow', text: 'Pedro Azevedo começou a seguir você.', ts: now - 5 * 3600_000, read: false, link: '/perfil/u13' },
    { id: 'n3', kind: 'lesson', text: 'Nova aula disponível em “Jiu-Jitsu — Do Zero à Primeira Finalização”.', ts: now - 20 * 3600_000, read: false, link: '/aprender/c2' },
    { id: 'n4', kind: 'event', text: 'Fight Flow Grand Prix (demo) está acontecendo agora.', ts: now - 26 * 3600_000, read: true, link: '/eventos/ev5' },
    { id: 'n5', kind: 'achievement', text: 'Conquista desbloqueada: Disciplina de Ferro 🔥', ts: at(1), read: true, link: '/ranking' },
  ];
  const admin = emptyUser();
  admin.xp = 1200;
  return { [DEMO_ID]: demo, [ADMIN_ID]: admin };
};

const seedQuestions = (): Question[] => {
  const now = Date.now();
  return [
    { id: 'q1', courseId: 'c1', author: 'Caio Martins', text: 'Devo girar o punho também no direto?', answer: 'Sim. No direto, o punho gira no final do golpe, assim como no jab, alinhando os nós dos dedos.', ts: now - 3 * DAY },
    { id: 'q2', courseId: 'c2', author: 'Bruna Kaiser', text: 'Quanto tempo leva para começar a rolar?', answer: 'Depende da academia. O ideal é rolar após dominar fugas e regras de segurança, com supervisão.', ts: now - 5 * DAY },
    { id: 'q3', courseId: 'c3', author: 'Ana Paula Reis', text: 'Posso treinar chute sem caneleira?', answer: 'No saco, sim, com progressão. Em dupla, use sempre caneleira.', ts: now - 2 * DAY },
    { id: 'q4', courseId: 'c4', author: 'Thiago Rocha', text: 'Qual base devo priorizar primeiro: striking ou grappling?', answer: 'Comece pelo que sua academia oferece de melhor, mas inclua defesa de quedas desde cedo.', ts: now - 4 * DAY },
  ];
};

const seedContent = (): ContentState => ({
  posts: makeSeedPosts(),
  courses: SEED_COURSES.map((c) => ({ ...c, modules: c.modules.map((m) => ({ ...m, lessonIds: [...m.lessonIds] })) })),
  lessons: SEED_LESSONS.map((l) => ({ ...l })),
  experts: EXPERTS.map((e) => ({ ...e })),
  analyses: SEED_ANALYSES.map((a) => ({ ...a })),
  events: SEED_EVENTS.map((e) => ({ ...e })),
  questions: seedQuestions(),
});

// ----- helpers de estatísticas -----
export const courseLessonIds = (c: Course) => c.modules.flatMap((m) => m.lessonIds);

export const computeStreak = (activity: Activity[]) => {
  const days = new Set(activity.filter((a) => ['lesson', 'analysis', 'course'].includes(a.type)).map((a) => dayKey(a.ts)));
  let cursor = startOfDay(Date.now());
  if (!days.has(dayKey(cursor))) cursor -= DAY; // a sequência continua viva até o fim de hoje
  let n = 0;
  while (days.has(dayKey(cursor))) { n++; cursor -= DAY; }
  return n;
};

export const completedCourses = (u: UserData, courses: Course[]) =>
  courses.filter((c) => { const ids = courseLessonIds(c); return ids.length > 0 && ids.every((id) => u.completedLessons.includes(id)); });

export const computeStats = (u: UserData, courses: Course[]): Stats => ({
  lessons: u.completedLessons.length,
  courses: completedCourses(u, courses).length,
  analyses: u.readAnalyses.length,
  posts: u.activity.filter((a) => a.type === 'post').length,
  comments: u.activity.filter((a) => a.type === 'comment').length,
  streak: computeStreak(u.activity),
  modalities: new Set(u.activity.filter((a) => a.type === 'lesson' && a.modality).map((a) => a.modality)).size,
  donations: u.donations.length,
  predictions: Object.keys(u.predictions).length,
  challenges: Object.values(u.claimed).reduce((s, l) => s + l.length, 0),
});

export const challengeProgress = (u: UserData, metric: string, favorites: ModalityId[]) => {
  const ws = startOfWeek();
  const week = u.activity.filter((a) => a.ts >= ws);
  if (metric === 'modality') return week.filter((a) => a.type === 'lesson' && a.modality && !favorites.includes(a.modality)).length;
  return week.filter((a) => a.type === metric).length;
};

const safeStorage = createJSONStorage(() => ({
  getItem: (k: string) => localStorage.getItem(k),
  setItem: (k: string, v: string) => {
    try { localStorage.setItem(k, v); } catch {
      toast('Armazenamento local cheio. Remova imagens grandes ou restaure a demonstração.', 'error');
    }
  },
  removeItem: (k: string) => localStorage.removeItem(k),
}));

const PROFILE_NAMES = PROFILES.map((p) => p.id);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const me = () => get().sessionId!;
      const ud = () => get().users[me()] ?? emptyUser();
      const patchUser = (fn: (u: UserData) => UserData) =>
        set((s) => ({ users: { ...s.users, [s.sessionId!]: fn(s.users[s.sessionId!] ?? emptyUser()) } }));
      const notify = (n: Omit<Notification, 'id' | 'ts' | 'read'>, forUser?: string) => {
        const target = forUser ?? get().sessionId;
        if (!target) return;
        set((s) => {
          const u = s.users[target] ?? emptyUser();
          return { users: { ...s.users, [target]: { ...u, notifications: [{ ...n, id: uid('n'), ts: Date.now(), read: false }, ...u.notifications].slice(0, 60) } } };
        });
      };
      const checkAchievements = () => {
        const u = ud();
        const stats = computeStats(u, get().courses);
        ACHIEVEMENTS.forEach((a) => {
          if (!u.unlocked[a.id] && a.check(stats)) {
            patchUser((x) => ({ ...x, unlocked: { ...x.unlocked, [a.id]: Date.now() } }));
            notify({ kind: 'achievement', text: `Conquista desbloqueada: ${a.name} 🏆`, link: '/ranking' });
            set({ newAchievement: a.id });
            toast(`Conquista desbloqueada: ${a.name}`, 'success');
          }
        });
      };
      const award = (type: ActivityType, xp: number, ref?: string, modality?: ModalityId) => {
        patchUser((u) => ({ ...u, xp: u.xp + xp, activity: [...u.activity, { type, ts: Date.now(), ref, modality, xp }] }));
        checkAchievements();
      };

      return {
        ...seedContent(),
        theme: 'dark',
        reducedMotion: false,
        accounts: seedAccounts(),
        sessionId: null,
        users: seedUsers(),
        newAchievement: null,

        setTheme: (theme) => set({ theme }),
        toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
        setReducedMotion: (reducedMotion) => set({ reducedMotion }),
        login: (id) => { set({ sessionId: id }); const a = get().accounts.find((x) => x.id === id); toast(`Bem-vindo(a), ${a?.name ?? ''}!`, 'success'); },
        logout: () => { set({ sessionId: null }); toast('Você saiu da conta demonstrativa.'); },
        register: (a) => {
          const id = uid('acc');
          set((s) => ({ accounts: [...s.accounts, { ...a, id, joined: Date.now(), role: 'user' }], users: { ...s.users, [id]: emptyUser() }, sessionId: id }));
          notify({ kind: 'system', text: 'Seu Fight ID foi criado. Explore a Fight Academy para ganhar seus primeiros Fight XP!', link: '/aprender' }, id);
          toast('Conta demonstrativa criada!', 'success');
        },
        updateAccount: (patch) => set((s) => ({ accounts: s.accounts.map((a) => (a.id === s.sessionId ? { ...a, ...patch } : a)) })),
        resetDemo: () => {
          const { theme } = get();
          set({ ...seedContent(), accounts: seedAccounts(), users: seedUsers(), sessionId: DEMO_ID, theme, newAchievement: null });
          toast('Dados da demonstração restaurados.', 'success');
        },
        clearAchievementFlash: () => set({ newAchievement: null }),

        createPost: (p) => {
          const id = uid('p');
          const post: Post = { ...p, id, authorId: me(), ts: Date.now(), likes: 0, shares: 0, comments: [] };
          set((s) => ({ posts: [post, ...s.posts] }));
          award('post', XP.post, id, p.modality);
          toast('Publicação criada! +30 Fight XP', 'success');
          const owner = me();
          // Interação simulada de outros membros da comunidade
          setTimeout(() => {
            const author = PROFILES.find((x) => x.id === pick(PROFILE_NAMES))!;
            const replies = ['Muito bom! Obrigado por compartilhar.', 'Isso faz muito sentido, vou aplicar no treino.', 'Concordo! Detalhe importante.', 'Que evolução 👊', 'Salvei para ler de novo depois.'];
            set((s) => ({ posts: s.posts.map((x) => x.id === id ? { ...x, likes: x.likes + 3 + Math.floor(Math.random() * 8), comments: [...x.comments, { id: uid('c'), authorId: author.id, text: pick(replies), ts: Date.now() }] } : x) }));
            notify({ kind: 'comment', text: `${author.name} comentou na sua publicação (interação simulada).`, link: `/comunidade/post/${id}` }, owner);
          }, 6000);
        },
        toggleLike: (postId) => {
          const liked = ud().likedPosts.includes(postId);
          patchUser((u) => ({ ...u, likedPosts: liked ? u.likedPosts.filter((x) => x !== postId) : [...u.likedPosts, postId] }));
          set((s) => ({ posts: s.posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p)) }));
          if (!liked) award('like', XP.like, postId);
        },
        addComment: (postId, text) => {
          set((s) => ({ posts: s.posts.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { id: uid('c'), authorId: me(), text, ts: Date.now() }] } : p)) }));
          award('comment', XP.comment, postId);
          toast('Comentário publicado. +10 Fight XP', 'success');
        },
        deleteComment: (postId, commentId) => {
          set((s) => ({ posts: s.posts.map((p) => (p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p)) }));
          toast('Comentário excluído.');
        },
        sharePost: (postId) => {
          set((s) => ({ posts: s.posts.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)) }));
          const url = `${location.origin}${location.pathname}#/comunidade/post/${postId}`;
          navigator.clipboard?.writeText(url).catch(() => {});
          toast('Link copiado! (compartilhamento simulado)', 'success');
        },
        toggleFollow: (id, label) => {
          const following = ud().follows.includes(id);
          patchUser((u) => ({ ...u, follows: following ? u.follows.filter((x) => x !== id) : [...u.follows, id] }));
          toast(following ? `Você deixou de seguir ${label}.` : `Agora você segue ${label}.`, following ? 'info' : 'success');
        },
        toggleSave: (type, id) => {
          const exists = ud().saved.some((s) => s.type === type && s.id === id);
          patchUser((u) => ({ ...u, saved: exists ? u.saved.filter((s) => !(s.type === type && s.id === id)) : [{ type, id, ts: Date.now() }, ...u.saved] }));
          toast(exists ? 'Removido dos favoritos.' : 'Salvo nos favoritos.', exists ? 'info' : 'success');
        },

        completeLesson: (lessonId) => {
          const u = ud();
          if (u.completedLessons.includes(lessonId)) return;
          const lesson = get().lessons.find((l) => l.id === lessonId);
          const course = get().courses.find((c) => c.id === lesson?.courseId);
          const before = completedCourses(u, get().courses).map((c) => c.id);
          patchUser((x) => ({ ...x, completedLessons: [...x.completedLessons, lessonId] }));
          award('lesson', XP.lesson, lessonId, course?.modality);
          toast('Aula concluída! +25 Fight XP', 'success');
          if (course && !before.includes(course.id) && completedCourses(ud(), get().courses).some((c) => c.id === course.id)) {
            award('course', XP.course, course.id, course.modality);
            notify({ kind: 'course', text: `Curso concluído: ${course.title} 🎓 (+150 Fight XP)`, link: `/aprender/${course.id}` });
            toast(`Curso concluído: ${course.title}! +150 Fight XP`, 'success');
          }
        },
        uncompleteLesson: (lessonId) => {
          patchUser((u) => ({ ...u, completedLessons: u.completedLessons.filter((x) => x !== lessonId) }));
          toast('Aula marcada como não concluída.');
        },
        setNote: (lessonId, text) => patchUser((u) => ({ ...u, notes: { ...u.notes, [lessonId]: text } })),
        setLastLesson: (courseId, lessonId) => patchUser((u) => ({ ...u, lastLesson: { courseId, lessonId } })),
        askQuestion: (courseId, text) => {
          const account = get().accounts.find((a) => a.id === me());
          const id = uid('q');
          set((s) => ({ questions: [{ id, courseId, author: account?.name ?? 'Você', text, ts: Date.now() }, ...s.questions] }));
          toast('Pergunta enviada ao instrutor.', 'success');
          const owner = me();
          setTimeout(() => {
            const course = get().courses.find((c) => c.id === courseId);
            const expert = get().experts.find((e) => e.id === course?.expertId);
            set((s) => ({ questions: s.questions.map((q) => q.id === id ? { ...q, answer: 'Ótima pergunta! Revise os pontos-chave da aula e pratique devagar, priorizando a técnica. Se puder, peça para seu professor observar a execução presencialmente. (Resposta simulada)' } : q) }));
            notify({ kind: 'reply', text: `${expert?.name ?? 'O instrutor'} respondeu sua pergunta (resposta simulada).`, link: `/aprender/${courseId}?tab=qa` }, owner);
          }, 5000);
        },
        markAnalysisRead: (id) => {
          if (ud().readAnalyses.includes(id)) {
            patchUser((u) => ({ ...u, readAnalyses: u.readAnalyses.filter((x) => x !== id) }));
            toast('Marcado como não lido.');
            return;
          }
          const a = get().analyses.find((x) => x.id === id);
          patchUser((u) => ({ ...u, readAnalyses: [...u.readAnalyses, id] }));
          award('analysis', XP.analysis, id, a?.modality);
          toast('Análise marcada como lida. +20 Fight XP', 'success');
        },
        toggleFavoriteModality: (id) => {
          const acc = get().accounts.find((a) => a.id === me());
          if (!acc) return;
          const has = acc.modalities.includes(id);
          get().updateAccount({ modalities: has ? acc.modalities.filter((m) => m !== id) : [...acc.modalities, id] });
          toast(has ? 'Modalidade removida das favoritas.' : 'Modalidade adicionada! Suas recomendações foram atualizadas.', has ? 'info' : 'success');
        },

        predict: (fightId, fighterId) => {
          const isNew = !ud().predictions[fightId];
          patchUser((u) => ({ ...u, predictions: { ...u.predictions, [fightId]: fighterId } }));
          if (isNew) award('prediction', XP.prediction, fightId);
          toast('Palpite recreativo registrado.', 'success');
        },
        claimChallenge: (id) => {
          const ch = CHALLENGES.find((c) => c.id === id);
          if (!ch) return;
          const wk = weekKey();
          patchUser((u) => ({ ...u, claimed: { ...u.claimed, [wk]: [...(u.claimed[wk] ?? []), id] } }));
          award('challenge', ch.xp, id);
          toast(`Desafio concluído! +${ch.xp} Fight XP`, 'success');
        },
        addGoal: (g) => { patchUser((u) => ({ ...u, goals: [...u.goals, { ...g, id: uid('g'), createdAt: Date.now() }] })); toast('Meta adicionada.', 'success'); },
        toggleGoal: (id) => patchUser((u) => ({ ...u, goals: u.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) })),
        removeGoal: (id) => { patchUser((u) => ({ ...u, goals: u.goals.filter((g) => g.id !== id) })); toast('Meta removida.'); },

        markRead: (id) => patchUser((u) => ({ ...u, notifications: u.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
        markAllRead: () => { patchUser((u) => ({ ...u, notifications: u.notifications.map((n) => ({ ...n, read: true })) })); toast('Todas as notificações foram marcadas como lidas.'); },
        clearNotifications: () => { patchUser((u) => ({ ...u, notifications: [] })); toast('Notificações limpas.'); },

        donate: (d) => {
          const donation: Donation = { ...d, id: `FF-SIM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, ts: Date.now() };
          patchUser((u) => ({ ...u, donations: [donation, ...u.donations] }));
          award('donation', XP.donation, donation.id);
          return donation;
        },

        upsert: (key, item) => set((s) => {
          const list = s[key] as { id: string }[];
          const exists = list.some((x) => x.id === (item as { id: string }).id);
          return { [key]: exists ? list.map((x) => (x.id === (item as { id: string }).id ? item : x)) : [item, ...list] } as Partial<State>;
        }),
        remove: (key, id) => set((s) => {
          const patch: Partial<State> = { [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id) } as Partial<State>;
          if (key === 'lessons') patch.courses = s.courses.map((c) => ({ ...c, modules: c.modules.map((m) => ({ ...m, lessonIds: m.lessonIds.filter((l) => l !== id) })) }));
          if (key === 'courses') patch.lessons = s.lessons.filter((l) => l.courseId !== id);
          return patch;
        }),
      };
    },
    {
      name: 'fightflow-store',
      version: 1,
      storage: safeStorage,
      partialize: (s) => { const { newAchievement, ...rest } = s; return rest as unknown as State; },
    },
  ),
);

// ----- hooks de conveniência -----
export const useAccount = () => useStore((s) => s.accounts.find((a) => a.id === s.sessionId));
export const useUserData = () => useStore((s) => (s.sessionId ? s.users[s.sessionId] : undefined)) ?? EMPTY;
const EMPTY = emptyUser();

export const levelsList: Level[] = ['Iniciante', 'Intermediário', 'Avançado'];

export interface Stats {
  lessons: number;
  courses: number;
  analyses: number;
  posts: number;
  comments: number;
  streak: number;
  modalities: number;
  donations: number;
  predictions: number;
  challenges: number;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string; // nome de ícone lucide
  check: (s: Stats) => boolean;
  progress: (s: Stats) => [number, number];
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-round', name: 'Primeiro Round', description: 'Concluir a primeira aula.', icon: 'Swords', check: (s) => s.lessons >= 1, progress: (s) => [Math.min(s.lessons, 1), 1] },
  { id: 'iron-discipline', name: 'Disciplina de Ferro', description: 'Estudar 3 dias seguidos.', icon: 'Flame', check: (s) => s.streak >= 3, progress: (s) => [Math.min(s.streak, 3), 3] },
  { id: 'combat-analyst', name: 'Analista de Combate', description: 'Ler 3 análises técnicas.', icon: 'ScanSearch', check: (s) => s.analyses >= 3, progress: (s) => [Math.min(s.analyses, 3), 3] },
  { id: 'learning-master', name: 'Mestre do Aprendizado', description: 'Concluir 1 curso completo.', icon: 'GraduationCap', check: (s) => s.courses >= 1, progress: (s) => [Math.min(s.courses, 1), 1] },
  { id: 'community-voice', name: 'Voz da Comunidade', description: 'Publicar 1 post e fazer 3 comentários.', icon: 'MessageSquareHeart', check: (s) => s.posts >= 1 && s.comments >= 3, progress: (s) => [Math.min(s.posts, 1) + Math.min(s.comments, 3), 4] },
  { id: 'explorer', name: 'Explorador do Tatame', description: 'Estudar aulas de 3 modalidades diferentes.', icon: 'Compass', check: (s) => s.modalities >= 3, progress: (s) => [Math.min(s.modalities, 3), 3] },
  { id: 'dedicated', name: 'Faixa Dedicada', description: 'Concluir 15 aulas.', icon: 'Medal', check: (s) => s.lessons >= 15, progress: (s) => [Math.min(s.lessons, 15), 15] },
  { id: 'oracle', name: 'Oráculo do Octógono', description: 'Registrar 5 palpites recreativos.', icon: 'Target', check: (s) => s.predictions >= 5, progress: (s) => [Math.min(s.predictions, 5), 5] },
  { id: 'supporter', name: 'Apoiador Fight Flow', description: 'Simular uma contribuição.', icon: 'HeartHandshake', check: (s) => s.donations >= 1, progress: (s) => [Math.min(s.donations, 1), 1] },
  { id: 'challenger', name: 'Desafiante', description: 'Concluir 3 desafios semanais.', icon: 'Trophy', check: (s) => s.challenges >= 3, progress: (s) => [Math.min(s.challenges, 3), 3] },
];

export interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  metric: 'lesson' | 'analysis' | 'comment' | 'post' | 'like' | 'prediction' | 'modality';
  target: number;
  xp: number;
}

// Desafios semanais educativos (sem treino físico arriscado)
export const CHALLENGES: ChallengeDef[] = [
  { id: 'ch-lessons', title: 'Semana de estudo', description: 'Conclua 3 aulas na Fight Academy esta semana.', metric: 'lesson', target: 3, xp: 120 },
  { id: 'ch-analysis', title: 'Olho técnico', description: 'Leia 2 análises do Fight Breakdown.', metric: 'analysis', target: 2, xp: 80 },
  { id: 'ch-comment', title: 'Comunidade ativa', description: 'Deixe 3 comentários construtivos.', metric: 'comment', target: 3, xp: 60 },
  { id: 'ch-post', title: 'Compartilhe sua jornada', description: 'Publique 1 post sobre seu aprendizado.', metric: 'post', target: 1, xp: 50 },
  { id: 'ch-prediction', title: 'Palpiteiro', description: 'Registre 2 palpites recreativos em eventos.', metric: 'prediction', target: 2, xp: 40 },
  { id: 'ch-modality', title: 'Novos horizontes', description: 'Estude uma aula de uma modalidade que não é sua favorita.', metric: 'modality', target: 1, xp: 70 },
];

export const XP = { lesson: 25, course: 150, analysis: 20, post: 30, comment: 10, like: 1, prediction: 5, donation: 50 };

export const LEVELS = [
  { min: 0, name: 'Faixa Branca' },
  { min: 300, name: 'Novato do Tatame' },
  { min: 800, name: 'Competidor' },
  { min: 1600, name: 'Atleta Dedicado' },
  { min: 2800, name: 'Veterano' },
  { min: 4200, name: 'Mestre Técnico' },
  { min: 6000, name: 'Lenda Fight Flow' },
];

export const levelFor = (xp: number) => {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.min) idx = i; });
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  return {
    level: idx + 1,
    name: cur.name,
    min: cur.min,
    next: next?.min ?? cur.min,
    pct: next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100,
  };
};

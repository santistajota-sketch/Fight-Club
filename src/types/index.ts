export type ThemeName = 'dark' | 'light';
export type Level = 'Iniciante' | 'Intermediário' | 'Avançado';

export type ModalityId =
  | 'mma' | 'boxe' | 'muaythai' | 'bjj' | 'judo'
  | 'wrestling' | 'karate' | 'taekwondo' | 'kickboxing' | 'defesa';

export interface Modality {
  id: ModalityId;
  name: string;
  short: string;
  origin: string;
  description: string;
  history: string;
  characteristics: string[];
  techniques: string[];
  equipment: string[];
  hue: number; // usado nas capas geradas
  popularity: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  minutes: number;
  keyPoints: string[];
}

export interface CourseModule {
  title: string;
  lessonIds: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modality: ModalityId;
  level: Level;
  expertId: string;
  rating: number;
  students: number;
  type: 'Curso' | 'Trilha' | 'Workshop';
  modules: CourseModule[];
  materials: string[];
}

export interface Review {
  author: string;
  rating: number;
  text: string;
}

export interface Expert {
  id: string;
  name: string;
  modality: ModalityId;
  specialties: string[];
  rank: string;
  experience: string;
  bio: string;
  level: Level; // nível de público que atende
  students: number;
  rating: number;
  reviews: Review[];
  hue: number;
}

export interface Profile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  modality: ModalityId;
  role: string;
  followers: number;
  following: number;
  xp: number;
  hue: number;
  isAthlete?: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  ts: number;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  modality: ModalityId;
  hashtags: string[];
  image?: string; // dataURL enviado pelo usuário
  art?: number; // arte gerada (seed) para posts de demonstração
  videoUrl?: string; // link do YouTube incorporado
  ts: number;
  likes: number;
  shares: number;
  comments: Comment[];
}

export interface AnalysisSection {
  heading: string;
  body: string;
  bullets?: string[];
  diagram?: 'distance' | 'gravity' | 'sprawl' | 'footwork' | 'energy' | 'guard';
}

export type AnalysisCategory =
  | 'Análise de lutas' | 'Striking' | 'Grappling' | 'Estratégia'
  | 'Preparação física' | 'Preparação mental' | 'Biomecânica'
  | 'Defesa' | 'Movimentação' | 'Erros comuns';

export interface Analysis {
  id: string;
  title: string;
  summary: string;
  category: AnalysisCategory;
  modality: ModalityId;
  authorId: string; // expert id
  level: Level;
  readMinutes: number;
  sections: AnalysisSection[];
}

export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  country: string;
  record: string;
  team: string;
  hue: number;
}

export interface Fight {
  id: string;
  a: string; // fighter id
  b: string;
  weight: string;
  rounds: number;
  main?: boolean;
  result?: { winner: string; method: string; round: number };
}

export interface FightEvent {
  id: string;
  name: string;
  modality: ModalityId;
  dayOffset: number; // dias a partir de hoje (mantém o calendário demonstrativo coerente)
  durationDays: number;
  venue: string;
  city: string;
  featured?: boolean;
  description: string;
  fights: Fight[];
}

export type EventStatus = 'Programado' | 'Acontecendo' | 'Encerrado';

export type ActivityType =
  | 'lesson' | 'course' | 'analysis' | 'post' | 'comment' | 'like'
  | 'challenge' | 'modality' | 'donation' | 'prediction';

export interface Activity {
  type: ActivityType;
  ts: number;
  ref?: string;
  modality?: ModalityId;
  xp?: number;
}

export interface Account {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: number; // índice do estilo de avatar
  modalities: ModalityId[];
  level: Level;
  goal: string;
  joined: number;
  role: 'user' | 'admin';
}

export interface Notification {
  id: string;
  text: string;
  ts: number;
  read: boolean;
  kind: 'comment' | 'follow' | 'lesson' | 'course' | 'achievement' | 'event' | 'reply' | 'system';
  link?: string;
}

export type SavedType = 'course' | 'lesson' | 'post' | 'analysis' | 'event';
export interface SavedItem { type: SavedType; id: string; ts: number }

export interface Donation {
  id: string;
  amount: number;
  frequency: 'única' | 'mensal';
  ts: number;
  tier: string;
}

export interface Goal {
  id: string;
  kind: 'lessons_week' | 'finish_course' | 'new_modality' | 'read_analyses' | 'custom';
  label: string;
  target: number;
  done?: boolean; // apenas para metas personalizadas
  createdAt: number;
}

export interface Question {
  id: string;
  courseId: string;
  author: string;
  text: string;
  answer?: string;
  ts: number;
}

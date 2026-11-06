import type { Profile } from '../types';

// Perfis fictícios da comunidade (não representam pessoas reais)
export const PROFILES: Profile[] = [
  { id: 'u1', name: 'Bruna Kaiser', handle: 'brunakaiser', bio: 'Faixa azul, apaixonada por guarda-aranha.', modality: 'bjj', role: 'Praticante', followers: 1840, following: 312, xp: 4820, hue: 200 },
  { id: 'u2', name: 'Thiago Rocha', handle: 'thiagorocha', bio: 'Assisto lutas com caderno na mão.', modality: 'mma', role: 'Fã e analista amador', followers: 2310, following: 401, xp: 5130, hue: 270 },
  { id: 'u3', name: 'Lívia Tavares', handle: 'liviatavares', bio: 'Boxe 4x por semana. Jab é vida.', modality: 'boxe', role: 'Praticante', followers: 980, following: 220, xp: 3960, hue: 340 },
  { id: 'u4', name: 'Rodrigo Falcão', handle: 'rodfalcao', bio: 'Muay Thai e café forte.', modality: 'muaythai', role: 'Praticante', followers: 1420, following: 180, xp: 4410, hue: 25 },
  { id: 'u5', name: 'Gustavo Lemos', handle: 'gustavolemos', bio: 'Judoca desde os 8 anos.', modality: 'judo', role: 'Praticante', followers: 760, following: 150, xp: 2870, hue: 185 },
  { id: 'u6', name: 'Felipe Nunes', handle: 'felipenunes', bio: 'Wrestling universitário (fictício).', modality: 'wrestling', role: 'Atleta amador', followers: 1110, following: 260, xp: 3380, hue: 140, isAthlete: true },
  { id: 'u7', name: 'Mariana Duarte', handle: 'maduarte', bio: 'Kata é meditação em movimento.', modality: 'karate', role: 'Praticante', followers: 640, following: 210, xp: 2510, hue: 355 },
  { id: 'u8', name: 'Isabela Costa', handle: 'isacosta', bio: 'Chutes altos e paciência.', modality: 'taekwondo', role: 'Atleta amadora', followers: 890, following: 175, xp: 2990, hue: 230, isAthlete: true },
  { id: 'u9', name: 'Vitor Hugo Alves', handle: 'vitorhugo', bio: 'Kickboxing para a cabeça e o corpo.', modality: 'kickboxing', role: 'Praticante', followers: 530, following: 190, xp: 2240, hue: 45 },
  { id: 'u10', name: 'Sofia Ribeiro', handle: 'sofiaribeiro', bio: 'Defesa pessoal salva confiança.', modality: 'defesa', role: 'Praticante', followers: 1270, following: 300, xp: 3610, hue: 160 },
  { id: 'u11', name: 'Caio Martins', handle: 'caiomartins', bio: 'Começando no boxe aos 35.', modality: 'boxe', role: 'Iniciante', followers: 210, following: 140, xp: 1320, hue: 10 },
  { id: 'u12', name: 'Ana Paula Reis', handle: 'anapaula', bio: 'Muay Thai feminino ❤️', modality: 'muaythai', role: 'Praticante', followers: 1530, following: 420, xp: 4060, hue: 15 },
  { id: 'u13', name: 'Pedro Azevedo', handle: 'pedroazevedo', bio: 'Faixa roxa, eterno aluno.', modality: 'bjj', role: 'Praticante', followers: 990, following: 260, xp: 3740, hue: 215 },
  { id: 'u14', name: 'Juliana Souza', handle: 'jusouza', bio: 'MMA amador (fictício) e nutrição esportiva.', modality: 'mma', role: 'Atleta amadora', followers: 2050, following: 330, xp: 4690, hue: 280, isAthlete: true },
  { id: 'u15', name: 'Leandro Prates', handle: 'leoprates', bio: 'Treinador de base em formação.', modality: 'kickboxing', role: 'Instrutor', followers: 720, following: 120, xp: 2760, hue: 50 },
  { id: 'u16', name: 'Camila Freitas', handle: 'camifreitas', bio: 'Sparring leve e técnica limpa.', modality: 'boxe', role: 'Praticante', followers: 860, following: 230, xp: 3150, hue: 330 },
  { id: 'u17', name: 'Henrique Bastos', handle: 'hbastos', bio: 'Grappling no-gi e estatísticas.', modality: 'wrestling', role: 'Praticante', followers: 450, following: 160, xp: 1980, hue: 130 },
  { id: 'u18', name: 'Yuri Matsuda', handle: 'yurimatsuda', bio: 'Judô, shogi e paciência.', modality: 'judo', role: 'Praticante', followers: 380, following: 110, xp: 1760, hue: 195 },
  { id: 'u19', name: 'Renata Lopes', handle: 'renatalopes', bio: 'Corro, treino e escrevo sobre preparação física.', modality: 'mma', role: 'Preparadora física (fictícia)', followers: 1690, following: 280, xp: 4230, hue: 290 },
  { id: 'u20', name: 'Otávio Guerra', handle: 'otavioguerra', bio: 'Assisto todos os eventos. Todos.', modality: 'mma', role: 'Fã', followers: 300, following: 510, xp: 1540, hue: 260 },
];

export const profileById = (id: string) => PROFILES.find((p) => p.id === id);

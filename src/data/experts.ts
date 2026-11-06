import type { Expert } from '../types';

// Todos os especialistas são personagens fictícios criados para a demonstração.
export const EXPERTS: Expert[] = [
  {
    id: 'e1', name: 'Rafael “Jab” Moreira', modality: 'boxe', hue: 0, level: 'Iniciante',
    specialties: ['Fundamentos', 'Footwork', 'Defesa'], rank: 'Técnico nível 3 (fictício)', experience: '14 anos de ringue',
    bio: 'Ex-atleta amador que migrou para a formação de iniciantes. Acredita que base e postura resolvem metade dos problemas do boxe e que o jab é a ferramenta mais subestimada do esporte.',
    students: 4820, rating: 4.9,
    reviews: [
      { author: 'Lívia T.', rating: 5, text: 'Explica a mecânica do jab de um jeito que finalmente fez sentido.' },
      { author: 'Caio M.', rating: 5, text: 'Os drills de movimentação mudaram meu treino de sombra.' },
    ],
  },
  {
    id: 'e2', name: 'Helena Prado', modality: 'bjj', hue: 210, level: 'Iniciante',
    specialties: ['Guarda', 'Finalizações', 'Jiu-Jitsu feminino'], rank: 'Faixa preta 3º grau (fictício)', experience: '18 anos de tatame',
    bio: 'Professora focada em ensinar Jiu-Jitsu para quem nunca pisou no tatame. Organiza o conteúdo em princípios — posição, controle, finalização — antes de qualquer técnica isolada.',
    students: 6150, rating: 4.9,
    reviews: [
      { author: 'Bruna K.', rating: 5, text: 'Didática impecável, cada aula se conecta com a anterior.' },
      { author: 'Pedro A.', rating: 4, text: 'Gostaria de mais variações de passagem, mas a base é excelente.' },
    ],
  },
  {
    id: 'e3', name: 'Kruu Danilo Sato', modality: 'muaythai', hue: 24, level: 'Intermediário',
    specialties: ['Clinch', 'Chutes', 'Tradição tailandesa'], rank: 'Kruu certificado (fictício)', experience: '12 anos, 6 deles treinando na Tailândia',
    bio: 'Combina a escola tailandesa tradicional com metodologia de treino moderna. É conhecido pelos detalhes de quadril no chute circular e pelo trabalho de clinch.',
    students: 3970, rating: 4.8,
    reviews: [
      { author: 'Rodrigo F.', rating: 5, text: 'O módulo de clinch vale o curso inteiro.' },
      { author: 'Ana P.', rating: 5, text: 'Detalhista e paciente. Meu chute ficou outro.' },
    ],
  },
  {
    id: 'e4', name: 'Marcos “Octógono” Vidal', modality: 'mma', hue: 268, level: 'Intermediário',
    specialties: ['Transições', 'Estratégia de luta', 'Defesa de quedas'], rank: 'Head coach (fictício)', experience: '20 anos entre atleta e treinador',
    bio: 'Treinador de MMA que pensa a luta como um jogo de transições. Seus conteúdos conectam striking e grappling e ensinam a tomar decisões sob pressão.',
    students: 5210, rating: 4.8,
    reviews: [
      { author: 'Thiago R.', rating: 5, text: 'A parte de estratégia abriu minha cabeça para assistir lutas.' },
      { author: 'Juliana S.', rating: 4, text: 'Conteúdo denso, ideal para quem já treina.' },
    ],
  },
  {
    id: 'e5', name: 'Akemi Tanaka', modality: 'judo', hue: 190, level: 'Iniciante',
    specialties: ['Projeções', 'Ukemi', 'Kuzushi'], rank: 'Faixa preta 4º dan (fictício)', experience: '22 anos de judô',
    bio: 'Ensina judô com ênfase em segurança: quedas bem amortecidas primeiro, projeções depois. Valoriza a etiqueta e o princípio do benefício mútuo.',
    students: 2890, rating: 4.9,
    reviews: [{ author: 'Gustavo L.', rating: 5, text: 'Perdi o medo de cair. Isso muda tudo.' }],
  },
  {
    id: 'e6', name: 'Diego Ramalho', modality: 'wrestling', hue: 145, level: 'Avançado',
    specialties: ['Quedas', 'Sprawl', 'Controle de quadril'], rank: 'Técnico de wrestling (fictício)', experience: '15 anos de luta olímpica',
    bio: 'Especialista em quedas e defesa de quedas, com experiência preparando atletas de wrestling para o MMA. Fala muito sobre nível, ângulo e penetração.',
    students: 2310, rating: 4.7,
    reviews: [{ author: 'Felipe N.', rating: 5, text: 'Finalmente entendi o que é “mudar de nível”.' }],
  },
  {
    id: 'e7', name: 'Sensei Carla Nogueira', modality: 'karate', hue: 350, level: 'Iniciante',
    specialties: ['Kata', 'Kumite', 'Distância'], rank: 'Faixa preta 5º dan (fictício)', experience: '25 anos de karatê',
    bio: 'Mestra de karatê que equilibra tradição e competição. Ensina kata como laboratório de mecânica corporal e kumite como estudo de timing.',
    students: 1980, rating: 4.8,
    reviews: [{ author: 'Mariana D.', rating: 5, text: 'Os katas passaram a ter sentido prático.' }],
  },
  {
    id: 'e8', name: 'Lucas Han', modality: 'taekwondo', hue: 228, level: 'Intermediário',
    specialties: ['Chutes giratórios', 'Flexibilidade', 'Competição'], rank: 'Faixa preta 4º dan (fictício)', experience: '16 anos de competição',
    bio: 'Ex-competidor de taekwondo que se dedica a ensinar chutes com técnica segura, progressão de flexibilidade e leitura de pontuação.',
    students: 2140, rating: 4.7,
    reviews: [{ author: 'Isabela C.', rating: 4, text: 'A progressão de mobilidade é ótima.' }],
  },
  {
    id: 'e9', name: 'Bianca Ferraz', modality: 'kickboxing', hue: 40, level: 'Iniciante',
    specialties: ['Combinações', 'Condicionamento', 'Ritmo'], rank: 'Treinadora certificada (fictício)', experience: '11 anos de kickboxing',
    bio: 'Treinadora de kickboxing com foco em técnica limpa e condicionamento inteligente. Seus cursos misturam fundamentos e rounds guiados.',
    students: 3350, rating: 4.8,
    reviews: [{ author: 'Vitor H.', rating: 5, text: 'Aulas dinâmicas e bem explicadas.' }],
  },
  {
    id: 'e10', name: 'Prof. André Lima', modality: 'defesa', hue: 160, level: 'Iniciante',
    specialties: ['Defesa pessoal', 'Preparação física', 'Preparação mental'], rank: 'Educador físico (fictício)', experience: '13 anos com treinamento funcional e defesa pessoal',
    bio: 'Educador físico que une preparação física, prevenção de lesões e defesa pessoal. Reforça sempre que a melhor defesa é evitar o confronto.',
    students: 4100, rating: 4.9,
    reviews: [{ author: 'Sofia R.', rating: 5, text: 'Prático, realista e sem exageros.' }],
  },
];

export const expertById = (id: string) => EXPERTS.find((e) => e.id === id);

import type { Course, Lesson, Level, ModalityId } from '../types';

type L = [title: string, description: string, minutes: number, keyPoints: string[]];

interface CourseSeed {
  id: string; title: string; description: string; modality: ModalityId; level: Level; expertId: string;
  rating: number; students: number; type: Course['type']; materials: string[];
  modules: { title: string; lessons: L[] }[];
}

const SEEDS: CourseSeed[] = [
  {
    id: 'c1', title: 'Boxe — Fundamentos do Ringue', modality: 'boxe', level: 'Iniciante', expertId: 'e1', rating: 4.9, students: 3120, type: 'Curso',
    description: 'Construa a base do boxe do jeito certo: postura, golpes retos, cruzado, esquivas e movimentação, até as primeiras combinações.',
    materials: ['Checklist de postura', 'Plano de treino de sombra (4 semanas)', 'Glossário do boxe'],
    modules: [
      { title: 'Módulo 1 — Base', lessons: [
        ['Base e postura', 'Distribuição de peso, posição dos pés e guarda alta para começar seguro.', 9, ['Pés na largura dos ombros, em diagonal', 'Queixo protegido atrás do ombro', 'Peso distribuído, joelhos levemente flexionados']],
        ['Jab', 'O golpe que mede distância, abre defesas e controla o ritmo.', 11, ['Gire o punho no final do golpe', 'Retorne pela mesma linha', 'Mão de trás sempre no rosto']],
        ['Direto', 'Rotação de quadril e transferência de peso para o golpe de potência.', 10, ['Gire o pé de trás', 'Quadril e ombro giram juntos', 'Não incline o tronco para frente']],
      ] },
      { title: 'Módulo 2 — Golpes curtos e defesa', lessons: [
        ['Cruzado', 'Golpe curto em arco com o cotovelo alinhado ao punho.', 10, ['Cotovelo na altura do punho', 'Giro do pé da frente', 'Curto e compacto']],
        ['Esquivas', 'Pêndulo e rolamento para sair da linha do golpe sem perder a posição.', 12, ['Dobre os joelhos, não a cintura', 'Olhos sempre no adversário', 'Saia da linha e volte pronto para contra-atacar']],
      ] },
      { title: 'Módulo 3 — Movimento e combinação', lessons: [
        ['Movimentação', 'Passos curtos, mudança de ângulo e controle do centro do ringue.', 11, ['Pé mais próximo da direção se move primeiro', 'Nunca cruze os pés', 'Pivô para criar ângulos']],
        ['Combinações básicas', 'Jab-direto, jab-direto-cruzado e saídas seguras após combinar.', 13, ['Comece e termine com guarda', 'Saia em ângulo após a sequência', 'Velocidade antes de força']],
      ] },
    ],
  },
  {
    id: 'c2', title: 'Jiu-Jitsu — Do Zero à Primeira Finalização', modality: 'bjj', level: 'Iniciante', expertId: 'e2', rating: 4.9, students: 4280, type: 'Trilha',
    description: 'Um caminho organizado para iniciantes: fundamentos, posições, controle, passagem, defesa e as finalizações mais seguras para começar.',
    materials: ['Mapa de posições do Jiu-Jitsu', 'Regras de segurança no rola', 'Ficha de autoavaliação'],
    modules: [
      { title: 'Módulo 1 — Princípios', lessons: [
        ['Fundamentos', 'Movimentos básicos: fuga de quadril, rolamentos e postura na guarda.', 12, ['Fuga de quadril é a base de tudo', 'Mantenha cotovelos próximos ao corpo', 'Respire e não force posições ruins']],
        ['Posições', 'Guarda, meia-guarda, cem quilos, montada e costas: a hierarquia posicional.', 14, ['Posição antes de finalização', 'Conheça a pontuação de cada posição', 'Identifique por onde o adversário escapa']],
        ['Controle', 'Pressão, pesos e ganchos para estabilizar posições dominantes.', 11, ['Peso no lugar certo, não em todo lugar', 'Controle o quadril adversário', 'Paciência para estabilizar']],
      ] },
      { title: 'Módulo 2 — Jogo', lessons: [
        ['Passagem de guarda', 'Postura, controle das pernas e passagem toreando.', 13, ['Postura ereta dentro da guarda', 'Controle as calças/joelhos', 'Feche o ângulo após passar']],
        ['Defesa', 'Fugas da montada e do cem quilos com ponte e fuga de quadril.', 12, ['Ponte explosiva + rolamento', 'Crie espaço antes de girar', 'Proteja o pescoço sempre']],
        ['Finalizações básicas', 'Armlock da montada e triângulo da guarda com segurança.', 14, ['Isole o braço antes de atacar', 'Aplique pressão de forma progressiva', 'Solte imediatamente ao sinal de desistência']],
      ] },
    ],
  },
  {
    id: 'c3', title: 'Muay Thai — Técnicas Essenciais', modality: 'muaythai', level: 'Iniciante', expertId: 'e3', rating: 4.8, students: 2760, type: 'Curso',
    description: 'As oito armas do Muay Thai explicadas com calma: guarda, chutes, joelhadas, cotoveladas, clinch e combinações.',
    materials: ['Roteiro de aquecimento tailandês', 'Guia de bandagem', 'Combos para treino no saco'],
    modules: [
      { title: 'Módulo 1 — Armas longas', lessons: [
        ['Guarda', 'Guarda alta tailandesa, ritmo e leitura de distância.', 9, ['Mãos altas e abertas', 'Peso levemente no pé de trás', 'Ritmo constante']],
        ['Chutes', 'Chute circular com giro de quadril e canela como superfície de impacto.', 13, ['Gire o pé de apoio', 'Bata com a canela', 'Braço do mesmo lado desce para equilíbrio']],
        ['Joelhadas', 'Joelhada reta e em diagonal, a distância e no clinch.', 10, ['Empurre o quadril para frente', 'Ponta do pé estendida', 'Puxe o adversário para o joelho']],
      ] },
      { title: 'Módulo 2 — Curta distância', lessons: [
        ['Cotoveladas', 'Cotovelada horizontal, descendente e ascendente com controle.', 10, ['Use apenas em treino técnico com parceiro', 'Distância curtíssima', 'Mão de trás protegendo o rosto']],
        ['Clinch', 'Pegada na nuca, controle da postura e desequilíbrios.', 14, ['Antebraços por dentro', 'Cotovelos juntos', 'Desequilibre antes de joelhar']],
        ['Combinações', 'Soco-chute, teep de entrada e saídas em ângulo.', 12, ['Termine combinações com chute', 'Use o teep para resetar a distância', 'Mantenha a guarda ao recuar']],
      ] },
    ],
  },
  {
    id: 'c4', title: 'MMA — Introdução ao Combate', modality: 'mma', level: 'Iniciante', expertId: 'e4', rating: 4.8, students: 3540, type: 'Trilha',
    description: 'Entenda como as peças se conectam: striking, grappling, transições, defesa de quedas e estratégias básicas.',
    materials: ['Mapa das fases de uma luta de MMA', 'Glossário MMA', 'Plano semanal de treino misto'],
    modules: [
      { title: 'Módulo 1 — Fases da luta', lessons: [
        ['Fundamentos do striking', 'Guarda de MMA, golpes que não comprometem a base e chute baixo.', 12, ['Guarda mais baixa que no boxe', 'Cuidado com quedas ao chutar', 'Base preparada para sprawl']],
        ['Fundamentos do grappling', 'Controle contra a grade e posições no solo.', 13, ['Grade como ferramenta', 'Controle de pulsos', 'Postura no top game']],
        ['Transições', 'Entrar e sair das trocas sem ficar exposto.', 11, ['Golpe para entrar na queda', 'Saia em ângulo', 'Volte à guarda sempre']],
      ] },
      { title: 'Módulo 2 — Decisão', lessons: [
        ['Defesa de quedas', 'Sprawl, underhooks e uso da grade para voltar ao centro.', 12, ['Quadril para trás e para baixo', 'Busque o underhook', 'Levante-se pela grade com segurança']],
        ['Estratégias básicas', 'Plano de jogo simples: onde você é melhor e onde o adversário é perigoso.', 10, ['Leve a luta para seu terreno', 'Evite o ponto forte do outro', 'Ajuste entre rounds']],
      ] },
    ],
  },
  {
    id: 'c5', title: 'Judô — Quedas e Primeiras Projeções', modality: 'judo', level: 'Iniciante', expertId: 'e5', rating: 4.9, students: 1640, type: 'Curso',
    description: 'Aprenda a cair com segurança e execute as primeiras projeções com base no princípio do desequilíbrio.',
    materials: ['Sequência de ukemi diária', 'Vocabulário em japonês', 'Etiqueta no dojo'],
    modules: [
      { title: 'Módulo 1 — Segurança', lessons: [
        ['Ukemi — a arte de cair', 'Quedas para trás, lateral e rolamento para frente.', 12, ['Queixo no peito', 'Bata o braço no tatame', 'Expire ao cair']],
        ['Kumikata — pegada', 'Pegada básica na gola e na manga e controle de postura.', 9, ['Mão na gola controla a distância', 'Mão na manga controla o braço', 'Postura ereta (shizentai)']],
      ] },
      { title: 'Módulo 2 — Projeções', lessons: [
        ['Kuzushi — desequilíbrio', 'As oito direções de desequilíbrio e como provocá-las.', 10, ['Puxe e empurre em conjunto', 'Use o movimento do outro', 'Sem kuzushi não há projeção']],
        ['O-soto-gari', 'A grande ceifada externa, passo a passo.', 11, ['Entre ao lado do parceiro', 'Ceife com a perna estendida', 'Controle a queda do parceiro']],
        ['Seoi-nage', 'Projeção de ombro com entrada de giro.', 13, ['Joelhos flexionados na entrada', 'Quadril abaixo do quadril do outro', 'Puxe a manga até o fim']],
      ] },
    ],
  },
  {
    id: 'c6', title: 'Wrestling — Quedas para Todos', modality: 'wrestling', level: 'Intermediário', expertId: 'e6', rating: 4.7, students: 1290, type: 'Curso',
    description: 'Mudança de nível, penetração e finalização das quedas mais usadas no wrestling e no MMA.',
    materials: ['Drills de mudança de nível', 'Rotina de mobilidade de quadril'],
    modules: [
      { title: 'Módulo 1 — Mecânica', lessons: [
        ['Base e postura', 'Postura de wrestling e movimentação em quadrado.', 9, ['Cabeça acima dos joelhos', 'Cotovelos para dentro', 'Passos curtos']],
        ['Mudança de nível', 'Abaixar o centro de gravidade antes da entrada.', 10, ['Desça pelos joelhos, não pela coluna', 'Olhos para frente', 'Mudança rápida e curta']],
      ] },
      { title: 'Módulo 2 — Quedas', lessons: [
        ['Double leg', 'Penetração, conexão e finalização com giro.', 13, ['Joelho de penetração vai ao chão', 'Cabeça ao lado do corpo', 'Gire para o lado da cabeça']],
        ['Single leg', 'Captura de uma perna e finalizações em pé.', 12, ['Prenda a perna entre as suas', 'Postura alta após capturar', 'Corra o canto para derrubar']],
        ['Sprawl', 'A defesa de queda essencial e o retorno ao ataque.', 10, ['Quadril ao chão', 'Pernas para trás e abertas', 'Use a cabeça para circular']],
      ] },
    ],
  },
  {
    id: 'c7', title: 'Karatê — Kihon e Kumite', modality: 'karate', level: 'Iniciante', expertId: 'e7', rating: 4.8, students: 980, type: 'Curso',
    description: 'Fundamentos do karatê, primeiro kata e princípios de distância para o kumite.',
    materials: ['Diagrama do kata Heian Shodan (demonstrativo)', 'Rotina de kihon'],
    modules: [
      { title: 'Módulo 1 — Kihon', lessons: [
        ['Bases e posturas', 'Zenkutsu-dachi, kokutsu-dachi e transições.', 10, ['Joelho alinhado ao pé', 'Quadril estável', 'Transições sem subir o corpo']],
        ['Socos e chutes básicos', 'Gyaku-zuki, mae-geri e mawashi-geri.', 12, ['Hikite: mão que volta ao quadril', 'Kime no impacto', 'Recolha a perna após chutar']],
      ] },
      { title: 'Módulo 2 — Aplicação', lessons: [
        ['Primeiro kata', 'Estrutura, direções e ritmo de um kata básico.', 14, ['Comece e termine no mesmo ponto', 'Olhar antes de virar', 'Ritmo com pausas']],
        ['Distância no kumite', 'Ma-ai: entrar, pontuar e sair.', 11, ['Fique fora do alcance até atacar', 'Entrada explosiva', 'Saia em linha ou ângulo']],
      ] },
    ],
  },
  {
    id: 'c8', title: 'Taekwondo — Chutes com Técnica', modality: 'taekwondo', level: 'Intermediário', expertId: 'e8', rating: 4.7, students: 1110, type: 'Workshop',
    description: 'Progressão segura para chutes circulares, laterais e giratórios, com mobilidade e equilíbrio.',
    materials: ['Rotina de mobilidade de quadril', 'Tabela de pontuação (demonstrativa)'],
    modules: [
      { title: 'Módulo único — Chutes', lessons: [
        ['Mobilidade e aquecimento', 'Preparação de quadril e posteriores antes de chutar alto.', 10, ['Mobilidade dinâmica antes, alongamento estático depois', 'Respeite seu limite', 'Aqueça progressivamente']],
        ['Dollyo chagi', 'O chute circular do taekwondo, rápido e pontual.', 11, ['Pivô no pé de apoio', 'Joelho aponta para o alvo', 'Recolha rápido']],
        ['Yop chagi', 'Chute lateral com o calcanhar e alinhamento do corpo.', 10, ['Calcanhar como ponta de impacto', 'Corpo alinhado', 'Olhe por cima do ombro']],
        ['Chutes giratórios', 'Dwi chagi e princípios de rotação com segurança.', 13, ['Olhar chega antes do chute', 'Rotação completa', 'Pratique devagar primeiro']],
      ] },
    ],
  },
  {
    id: 'c9', title: 'Kickboxing — Rounds de Fundamentos', modality: 'kickboxing', level: 'Iniciante', expertId: 'e9', rating: 4.8, students: 2040, type: 'Curso',
    description: 'Fundamentos de kickboxing em formato de rounds guiados: técnica, combinações e condicionamento.',
    materials: ['Planilha de rounds (demonstrativa)', 'Guia de hidratação e descanso'],
    modules: [
      { title: 'Módulo 1 — Ferramentas', lessons: [
        ['Guarda e jab', 'Base do kickboxing e golpe de entrada.', 9, ['Guarda alta', 'Jab para medir', 'Respire em cada golpe']],
        ['Low kick', 'Chute baixo na coxa com técnica e proteção.', 11, ['Gire o quadril', 'Canela na coxa', 'Mão volta à guarda']],
        ['Chute alto', 'Quando e como chutar alto sem se expor.', 10, ['Prepare com golpes baixos', 'Equilíbrio no apoio', 'Volte à base rapidamente']],
      ] },
      { title: 'Módulo 2 — Rounds', lessons: [
        ['Combinações mão-perna', 'Jab-direto-low kick e variações.', 12, ['Termine com o chute do lado oposto', 'Mantenha o ritmo', 'Variedade confunde']],
        ['Round guiado de condicionamento', 'Round técnico de intensidade moderada com pausas.', 15, ['Intensidade moderada, técnica primeiro', 'Pare se sentir tontura ou dor', 'Hidrate-se']],
      ] },
    ],
  },
  {
    id: 'c10', title: 'Defesa Pessoal — Prevenção e Escapes', modality: 'defesa', level: 'Iniciante', expertId: 'e10', rating: 4.9, students: 3880, type: 'Trilha',
    description: 'Consciência situacional, desescalada e escapes simples para criar espaço e se afastar com segurança.',
    materials: ['Guia de consciência situacional', 'Contatos úteis de emergência (modelo)'],
    modules: [
      { title: 'Módulo 1 — Prevenção', lessons: [
        ['Consciência situacional', 'Perceber riscos antes que eles aconteçam.', 10, ['Atenção ao ambiente', 'Rotas de saída', 'Confie na sua percepção']],
        ['Desescalada verbal', 'Voz, postura e distância para reduzir conflitos.', 9, ['Mãos abertas à frente (postura de cerca)', 'Tom calmo e firme', 'Mantenha distância']],
      ] },
      { title: 'Módulo 2 — Escapes', lessons: [
        ['Escape de agarrão no pulso', 'Sair pela abertura do polegar e se afastar.', 8, ['Gire em direção ao polegar', 'Use o corpo, não só o braço', 'Afaste-se imediatamente']],
        ['Escape de abraço por trás', 'Baixar o centro e criar espaço para sair.', 10, ['Abaixe o quadril', 'Proteja a cabeça', 'Crie espaço e saia']],
        ['Plano de saída', 'Depois do escape: buscar locais seguros e ajuda.', 7, ['Vá para locais movimentados', 'Peça ajuda', 'Registre o ocorrido quando seguro']],
      ] },
    ],
  },
  {
    id: 'c11', title: 'Boxe — Defesa e Contra-ataque', modality: 'boxe', level: 'Intermediário', expertId: 'e1', rating: 4.8, students: 1730, type: 'Workshop',
    description: 'Bloqueios, aparadas e contra-ataques imediatos para quem já domina os fundamentos.',
    materials: ['Drills de defesa em dupla'],
    modules: [
      { title: 'Módulo único — Defesa ativa', lessons: [
        ['Bloqueios e aparadas', 'Absorver e desviar golpes sem abrir a guarda.', 10, ['Movimentos curtos', 'Aparar, não abanar', 'Olhos abertos']],
        ['Contra no jab', 'Aparar o jab e responder com direto.', 11, ['Aparada com a mão de trás', 'Resposta imediata', 'Volte à guarda']],
        ['Rolamento e cruzado', 'Rolar sob o cruzado e responder no mesmo ritmo.', 12, ['Role em U', 'Carregue o peso na volta', 'Cruzado curto']],
        ['Trabalho de corda', 'Sair das cordas com pivô e ângulos.', 10, ['Não fique parado nas cordas', 'Pivô para fora', 'Proteja o queixo']],
      ] },
    ],
  },
  {
    id: 'c12', title: 'MMA — Estratégia e Leitura de Luta', modality: 'mma', level: 'Avançado', expertId: 'e4', rating: 4.7, students: 1460, type: 'Curso',
    description: 'Aprenda a ler padrões, ajustar entre rounds e montar planos de jogo coerentes.',
    materials: ['Ficha de scouting (demonstrativa)', 'Modelo de plano de jogo'],
    modules: [
      { title: 'Módulo único — Leitura', lessons: [
        ['Scouting', 'Como estudar um adversário: tendências, ritmo e hábitos.', 12, ['Observe o primeiro minuto', 'Note reações repetidas', 'Separe tendência de exceção']],
        ['Padrões de movimentação', 'Identificar para onde o adversário se desloca sob pressão.', 11, ['Lado preferido de saída', 'Reação à pressão', 'Uso da grade']],
        ['Gestão de energia', 'Distribuir esforço ao longo dos rounds.', 10, ['Explosão com propósito', 'Respiração entre trocas', 'Controle posicional para recuperar']],
        ['Ajustes entre rounds', 'O que mudar (e o que manter) no intervalo.', 9, ['Uma ou duas instruções claras', 'Corrija o que está custando caro', 'Mantenha o que funciona']],
      ] },
    ],
  },
];

export const SEED_LESSONS: Lesson[] = [];
export const SEED_COURSES: Course[] = SEEDS.map((s) => {
  const modules = s.modules.map((m, mi) => ({
    title: m.title,
    lessonIds: m.lessons.map((l, li) => {
      const id = `${s.id}-l${mi + 1}${li + 1}`;
      SEED_LESSONS.push({ id, courseId: s.id, title: l[0], description: l[1], minutes: l[2], keyPoints: l[3] });
      return id;
    }),
  }));
  const { modules: _m, ...rest } = s;
  return { ...rest, modules };
});

import type { Analysis } from '../types';

// Conteúdo educativo fictício. Não descreve lutas reais nem atletas reais.
export const SEED_ANALYSES: Analysis[] = [
  {
    id: 'a1', title: 'Como funciona o controle de distância no boxe', category: 'Striking', modality: 'boxe', authorId: 'e1', level: 'Iniciante', readMinutes: 7,
    summary: 'Distância é a primeira defesa e o primeiro ataque. Entenda as três zonas e como transitar entre elas.',
    sections: [
      { heading: 'As três zonas', body: 'No boxe, falamos em três distâncias: longa (onde só o jab alcança), média (golpes retos completos e cruzados largos) e curta (cruzados curtos, uppercuts e trabalho de corpo). Cada zona favorece um tipo de lutador.', diagram: 'distance' },
      { heading: 'Quem controla, comanda', body: 'Lutadores de envergadura maior tentam manter a luta na zona longa, usando o jab e a movimentação lateral. Lutadores mais baixos buscam atravessar rapidamente a zona média — onde são mais vulneráveis — e trabalhar na curta.', bullets: ['Jab constante mantém o adversário na ponta', 'Passo lateral evita entrar em linha reta', 'Ao entrar, entre já golpeando'] },
      { heading: 'Como treinar', body: 'Treinos de sombra com marcações no chão, sparring técnico com regras (“só jab”, “só entrada”) e drills de espelho ajudam a criar a sensação de distância sem depender apenas da visão.' },
    ],
  },
  {
    id: 'a2', title: 'A importância do centro de gravidade no wrestling', category: 'Biomecânica', modality: 'wrestling', authorId: 'e6', level: 'Intermediário', readMinutes: 8,
    summary: 'Por que quem fica mais baixo geralmente vence a troca — e como abaixar o centro sem perder postura.',
    sections: [
      { heading: 'Base e estabilidade', body: 'Estabilidade depende de onde está o centro de gravidade em relação à base de apoio. Quanto mais baixo e centralizado, mais difícil é ser desequilibrado. Por isso a postura de wrestling tem joelhos flexionados e quadril baixo.', diagram: 'gravity' },
      { heading: 'Mudar de nível sem dobrar a coluna', body: 'O erro comum é abaixar a cabeça e curvar as costas. Isso entrega a nuca e deixa a queda fraca. O certo é descer flexionando os joelhos, com coluna neutra e olhos para frente.', bullets: ['Cabeça acima dos joelhos', 'Coluna neutra', 'Quadril sob o tronco'] },
      { heading: 'Na prática', body: 'Drills de mudança de nível sem penetração, caminhada em postura baixa e exercícios de reação ajudam a automatizar a posição até ela aparecer naturalmente sob cansaço.' },
    ],
  },
  {
    id: 'a3', title: 'Estratégias de defesa contra quedas', category: 'Defesa', modality: 'mma', authorId: 'e4', level: 'Intermediário', readMinutes: 9,
    summary: 'Sprawl, underhook e grade: as camadas de defesa e quando usar cada uma.',
    sections: [
      { heading: 'Primeira camada: distância e mãos', body: 'A melhor defesa de queda acontece antes do contato. Mãos à frente para frear a cabeça do atacante e distância bem gerenciada reduzem as entradas limpas.' },
      { heading: 'Segunda camada: sprawl', body: 'Quando o adversário penetra, o quadril vai para trás e para baixo, as pernas se abrem e o peso cai sobre os ombros dele. O objetivo é afastar as pernas das mãos do atacante.', diagram: 'sprawl', bullets: ['Quadril ao chão', 'Pernas para trás', 'Circule para o lado'] },
      { heading: 'Terceira camada: grade e underhook', body: 'Contra a grade, o sprawl perde espaço. Ali, o underhook e o controle de cabeça impedem o atacante de se posicionar, e a grade vira apoio para se levantar.' },
    ],
  },
  {
    id: 'a4', title: 'Como identificar padrões de movimentação', category: 'Movimentação', modality: 'mma', authorId: 'e4', level: 'Avançado', readMinutes: 8,
    summary: 'Todo lutador tem hábitos. Aprenda a observar o lado de saída, a reação à pressão e o ritmo.',
    sections: [
      { heading: 'O lado preferido', body: 'Sob pressão, a maioria dos lutadores circula sempre para o mesmo lado. Anotar as saídas nos primeiros minutos revela um padrão que pode ser explorado com cortes de ringue.', diagram: 'footwork' },
      { heading: 'Reação a fintas', body: 'Algumas pessoas recuam em linha reta, outras levantam a guarda, outras contra-atacam. Fintas servem para coletar essa informação com baixo risco.', bullets: ['Recua reto → pressione até a grade', 'Levanta a guarda → ataque o corpo', 'Contra-ataca → use fintas para provocar e punir'] },
      { heading: 'Cuidado com conclusões apressadas', body: 'Um padrão precisa aparecer várias vezes. Tendências mudam com o cansaço e com ajustes do córner, então a leitura deve ser contínua.' },
    ],
  },
  {
    id: 'a5', title: 'O papel da resistência cardiovascular em esportes de combate', category: 'Preparação física', modality: 'mma', authorId: 'e10', level: 'Iniciante', readMinutes: 7,
    summary: 'Por que o fôlego decide lutas e como estruturar o condicionamento sem exageros.',
    sections: [
      { heading: 'Sistemas de energia', body: 'Lutas combinam explosões curtas (sistema anaeróbio) com recuperação entre elas (sistema aeróbio). Uma boa base aeróbia acelera a recuperação entre as trocas intensas.', diagram: 'energy' },
      { heading: 'Treino intervalado', body: 'Intervalos que imitam o ritmo do esporte transferem bem para a luta. A progressão deve ser gradual e orientada por um profissional de educação física.', bullets: ['Aumente o volume aos poucos', 'Respeite dias de descanso', 'Sono e alimentação fazem parte do treino'] },
      { heading: 'Sinais de alerta', body: 'Tontura, dor no peito, falta de ar desproporcional ou dor persistente são sinais para parar e procurar avaliação médica. Condicionamento não deve ser construído à custa da saúde.' },
    ],
  },
  {
    id: 'a6', title: 'Guarda fechada: o primeiro sistema do Jiu-Jitsu', category: 'Grappling', modality: 'bjj', authorId: 'e2', level: 'Iniciante', readMinutes: 6,
    summary: 'Como a guarda fechada controla a postura do adversário e abre caminhos para raspagens e finalizações.',
    sections: [
      { heading: 'Controle de postura', body: 'Com as pernas cruzadas nas costas do adversário, quem está por baixo puxa com as pernas e as mãos para quebrar a postura. Sem postura, quem está por cima não consegue passar nem golpear com eficiência.', diagram: 'guard' },
      { heading: 'Ataques principais', body: 'Da guarda fechada nascem o armlock, o triângulo e a raspagem de tesoura. A lógica é atacar em sequência: a defesa de um ataque abre o próximo.', bullets: ['Quebre a postura', 'Controle um braço', 'Ataque em sequência'] },
      { heading: 'Erros frequentes', body: 'Deixar o quadril parado e segurar a guarda sem objetivo. A guarda é uma posição ativa, não um lugar de descanso.' },
    ],
  },
  {
    id: 'a7', title: 'Clinch no Muay Thai: controle antes do golpe', category: 'Striking', modality: 'muaythai', authorId: 'e3', level: 'Intermediário', readMinutes: 7,
    summary: 'O clinch é uma luta dentro da luta. Pegadas, desequilíbrios e joelhadas com propósito.',
    sections: [
      { heading: 'Pegada e posição', body: 'Antebraços por dentro dos braços do adversário, cotovelos juntos e mãos sobrepostas na nuca. Essa estrutura dá controle da cabeça e da postura.' },
      { heading: 'Desequilibrar primeiro', body: 'Girar e puxar o adversário tira a base dele e abre espaço para joelhadas. Joelhar sem desequilibrar costuma gastar energia sem efeito.', bullets: ['Gire para o lado', 'Puxe a cabeça para baixo', 'Joelhe quando o peso dele estiver no pé da frente'] },
      { heading: 'Saída segura', body: 'Sair do clinch é tão importante quanto entrar: empurre com os antebraços, crie distância e saia com um teep ou com a guarda alta.' },
    ],
  },
  {
    id: 'a8', title: 'Preparação mental: lidar com a ansiedade antes da luta', category: 'Preparação mental', modality: 'mma', authorId: 'e10', level: 'Iniciante', readMinutes: 6,
    summary: 'Ansiedade é normal. Rotinas simples ajudam a transformá-la em foco.',
    sections: [
      { heading: 'Ansiedade é ativação', body: 'Coração acelerado e mãos frias são respostas naturais do corpo se preparando para esforço. Reconhecer isso reduz a sensação de perda de controle.' },
      { heading: 'Rotinas pré-luta', body: 'Rotinas fixas (aquecimento, respiração, música, revisão de 2 ou 3 instruções) criam previsibilidade.', bullets: ['Respiração 4-4-4-4 (caixa)', 'Poucas instruções claras', 'Foco no processo, não no resultado'] },
      { heading: 'Quando buscar ajuda', body: 'Se a ansiedade atrapalha o sono, a alimentação ou o dia a dia, conversar com um psicólogo do esporte é uma decisão inteligente.' },
    ],
  },
  {
    id: 'a9', title: 'Biomecânica do chute circular', category: 'Biomecânica', modality: 'muaythai', authorId: 'e3', level: 'Intermediário', readMinutes: 8,
    summary: 'Quadril, pé de apoio e canela: como a energia viaja do chão até o alvo.',
    sections: [
      { heading: 'Cadeia cinética', body: 'A força nasce no chão, passa pelo pivô do pé de apoio, é amplificada pelo giro do quadril e chega ao alvo pela canela. Se um elo falha, o chute perde potência e equilíbrio.' },
      { heading: 'O pé de apoio', body: 'Girar o pé de apoio libera o quadril. Sem esse giro, o joelho sofre torção e o chute fica curto.', bullets: ['Suba na ponta do pé', 'Gire o calcanhar em direção ao alvo', 'Mantenha o joelho levemente flexionado'] },
      { heading: 'Braço e equilíbrio', body: 'O braço do mesmo lado do chute desce para contrabalançar o giro, enquanto a outra mão protege o rosto.' },
    ],
  },
  {
    id: 'a10', title: 'Erros comuns de iniciantes no boxe', category: 'Erros comuns', modality: 'boxe', authorId: 'e1', level: 'Iniciante', readMinutes: 5,
    summary: 'Cinco hábitos que atrasam a evolução — e como corrigi-los cedo.',
    sections: [
      { heading: 'Os cinco erros', body: 'Os mesmos erros aparecem em quase toda turma de iniciantes. Corrigi-los no começo evita meses de vícios técnicos.', bullets: ['Baixar a mão de trás ao jabear', 'Cruzar os pés ao se mover', 'Prender a respiração', 'Olhar para baixo na esquiva', 'Golpear com o braço, não com o corpo'] },
      { heading: 'Como corrigir', body: 'Grave seu treino de sombra, peça feedback do treinador e escolha um único foco por semana. Corrigir tudo ao mesmo tempo não funciona.' },
    ],
  },
  {
    id: 'a11', title: 'Kuzushi: o princípio do desequilíbrio no judô', category: 'Grappling', modality: 'judo', authorId: 'e5', level: 'Iniciante', readMinutes: 6,
    summary: 'Sem desequilíbrio não há projeção. Conheça as direções e como provocá-las.',
    sections: [
      { heading: 'As oito direções', body: 'O judô descreve oito direções de desequilíbrio: frente, trás, laterais e diagonais. Cada projeção explora uma delas.', diagram: 'gravity' },
      { heading: 'Ação e reação', body: 'Empurrar provoca uma reação de empurrar de volta. É nesse momento que a projeção para frente fica fácil. Usar a reação do outro é mais eficiente do que força.', bullets: ['Provoque uma reação', 'Aproveite o movimento', 'Entre no tempo certo'] },
    ],
  },
  {
    id: 'a12', title: 'Leitura de uma luta demonstrativa: round a round', category: 'Análise de lutas', modality: 'mma', authorId: 'e4', level: 'Avançado', readMinutes: 10,
    summary: 'Uma luta fictícia usada como estudo de caso: ajustes, gestão de energia e decisão.',
    sections: [
      { heading: 'Contexto (fictício)', body: 'Neste estudo de caso, um lutador de wrestling enfrenta um striker de longa distância em uma luta de três rounds. Os nomes e o confronto são inventados para fins didáticos.' },
      { heading: 'Round 1', body: 'O striker controla a distância com jab e chute baixo. O wrestler tenta quedas em linha reta e é defendido com sprawl. Leitura: entradas sem preparação são previsíveis.' },
      { heading: 'Round 2 e 3', body: 'Após o ajuste do córner, o wrestler passa a usar o soco para disfarçar a mudança de nível e encurrala o striker na grade. O controle posicional vence os rounds finais.', bullets: ['Ajuste simples e claro', 'Golpe para entrar na queda', 'Grade como aliada'] },
    ],
  },
  {
    id: 'a13', title: 'Movimentação lateral no kickboxing', category: 'Movimentação', modality: 'kickboxing', authorId: 'e9', level: 'Intermediário', readMinutes: 6,
    summary: 'Sair da linha do adversário cria ângulos de ataque e reduz o dano recebido.',
    sections: [
      { heading: 'Por que sair da linha', body: 'Ataques em linha reta são os mais fáceis de prever. Um passo lateral seguido de golpe coloca você em posição de atacar enquanto o adversário precisa se reorganizar.', diagram: 'footwork' },
      { heading: 'Drills', body: 'Treine passos laterais com saída de combinação e pivôs no saco de pancada.', bullets: ['Combinação + passo lateral', 'Pivô no pé da frente', 'Volte à guarda após o ângulo'] },
    ],
  },
  {
    id: 'a14', title: 'Defesa pessoal realista: o que realmente funciona', category: 'Defesa', modality: 'defesa', authorId: 'e10', level: 'Iniciante', readMinutes: 7,
    summary: 'Prevenção, desescalada e escape: a ordem de prioridade que salva.',
    sections: [
      { heading: 'Prioridade número 1: evitar', body: 'Consciência situacional e escolhas de rota evitam a maior parte dos riscos. Defesa pessoal começa muito antes de qualquer técnica física.' },
      { heading: 'Desescalada', body: 'Voz calma, mãos abertas à frente e distância. Muitas situações se resolvem sem contato.', bullets: ['Não discuta', 'Mantenha distância', 'Procure uma saída'] },
      { heading: 'Escape, não vitória', body: 'Se houver contato, o objetivo é criar espaço e sair para um local seguro. Técnicas simples e treinadas funcionam melhor sob estresse.' },
    ],
  },
  {
    id: 'a15', title: 'Timing de chutes no taekwondo', category: 'Estratégia', modality: 'taekwondo', authorId: 'e8', level: 'Avançado', readMinutes: 6,
    summary: 'Chutar no momento da entrada do adversário é mais eficiente do que chutar primeiro.',
    sections: [
      { heading: 'Contra-ataque no tempo', body: 'Quando o adversário avança, ele se compromete. Um chute circular rápido nesse momento encontra o alvo enquanto ele ainda está entrando.' },
      { heading: 'Fintas e ritmo', body: 'Mudar o ritmo do saltitar e usar fintas de joelho provoca entradas previsíveis.', bullets: ['Varie o ritmo', 'Finta com o joelho', 'Recolha rápido para não ser contra-atacado'] },
    ],
  },
];

export const ANALYSIS_CATEGORIES = [
  'Análise de lutas', 'Striking', 'Grappling', 'Estratégia', 'Preparação física',
  'Preparação mental', 'Biomecânica', 'Defesa', 'Movimentação', 'Erros comuns',
] as const;

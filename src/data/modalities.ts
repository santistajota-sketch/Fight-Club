import type { Modality } from '../types';

export const MODALITIES: Modality[] = [
  {
    id: 'mma', name: 'MMA', short: 'Artes Marciais Mistas', origin: 'Global', hue: 268, popularity: 98,
    description: 'Esporte de combate completo que integra golpes em pé, quedas e luta no solo dentro de um mesmo confronto.',
    history: 'O MMA moderno ganhou forma nos anos 1990, a partir de confrontos entre estilos. Com o tempo, regras unificadas, categorias de peso e exigências médicas transformaram a disputa em um esporte estruturado, em que atletas precisam dominar várias áreas ao mesmo tempo.',
    characteristics: ['Combina striking e grappling', 'Rounds de 5 minutos', 'Exige transições rápidas', 'Preparação física multidisciplinar'],
    techniques: ['Ground and pound', 'Sprawl', 'Double leg', 'Mata-leão', 'Jab-direto-chute baixo'],
    equipment: ['Luvas de 4 oz (treino com 6–7 oz)', 'Protetor bucal', 'Coquilha', 'Caneleiras para sparring'],
  },
  {
    id: 'boxe', name: 'Boxe', short: 'A nobre arte', origin: 'Inglaterra', hue: 0, popularity: 92,
    description: 'Luta em pé exclusivamente com os punhos, centrada em movimentação, tempo, distância e defesa.',
    history: 'Praticado de formas variadas desde a Antiguidade, o boxe moderno foi organizado no século XIX com regras que introduziram luvas e rounds cronometrados. É modalidade olímpica e referência técnica para todos os esportes de striking.',
    characteristics: ['Apenas socos acima da cintura', 'Ênfase em footwork', 'Defesa com esquivas e bloqueios', 'Ritmo e cardio elevados'],
    techniques: ['Jab', 'Direto', 'Cruzado', 'Uppercut', 'Pêndulo', 'Rolamento'],
    equipment: ['Luvas de 12–16 oz', 'Bandagens', 'Protetor bucal', 'Corda de pular'],
  },
  {
    id: 'muaythai', name: 'Muay Thai', short: 'A arte das oito armas', origin: 'Tailândia', hue: 24, popularity: 88,
    description: 'Arte marcial tailandesa que usa punhos, cotovelos, joelhos e canelas, com clinch como fase central da luta.',
    history: 'Com raízes em antigas técnicas de combate do Sião, o Muay Thai tornou-se esporte nacional da Tailândia e se espalhou pelo mundo no século XX. A cerimônia Wai Kru Ram Muay preserva a tradição antes de cada combate.',
    characteristics: ['Oito pontos de contato', 'Clinch dominante', 'Chutes com a canela', 'Tradição cerimonial'],
    techniques: ['Chute circular', 'Teep', 'Joelhada no clinch', 'Cotovelada horizontal', 'Sweep'],
    equipment: ['Luvas de 10–16 oz', 'Caneleiras', 'Bandagens', 'Shorts tradicionais'],
  },
  {
    id: 'bjj', name: 'Jiu-Jitsu', short: 'Jiu-Jitsu brasileiro', origin: 'Brasil', hue: 210, popularity: 90,
    description: 'Arte de luta no solo baseada em alavancas, controle de posição e finalizações como chaves e estrangulamentos.',
    history: 'Desenvolvido no Brasil a partir de técnicas japonesas trazidas no início do século XX, o Jiu-Jitsu brasileiro adaptou o combate para priorizar posição e alavanca, permitindo que praticantes menores controlem adversários maiores.',
    characteristics: ['Luta predominantemente no solo', 'Sistema de faixas', 'Pratica com e sem kimono', 'Foco em posição antes da finalização'],
    techniques: ['Raspagem', 'Passagem de guarda', 'Armlock', 'Triângulo', 'Montada'],
    equipment: ['Kimono (gi)', 'Faixa', 'Rash guard (no-gi)', 'Protetor bucal'],
  },
  {
    id: 'judo', name: 'Judô', short: 'O caminho suave', origin: 'Japão', hue: 190, popularity: 72,
    description: 'Arte marcial olímpica de projeções, imobilizações e controle, baseada em desequilíbrio e uso eficiente da força.',
    history: 'Criado no Japão em 1882 a partir do jujutsu clássico, o judô enfatiza princípios de máxima eficiência e benefício mútuo. Tornou-se esporte olímpico em 1964 e é praticado em escolas e clubes no mundo todo.',
    characteristics: ['Projeções com pegada no judogi', 'Kuzushi (desequilíbrio)', 'Ukemi (amortecimento)', 'Disciplina e etiqueta'],
    techniques: ['O-soto-gari', 'Seoi-nage', 'Uchi-mata', 'Kesa-gatame', 'Harai-goshi'],
    equipment: ['Judogi', 'Faixa', 'Tatame'],
  },
  {
    id: 'wrestling', name: 'Wrestling', short: 'Luta olímpica', origin: 'Antiguidade', hue: 145, popularity: 70,
    description: 'Luta agarrada focada em quedas, controle e domínio posicional, com estilos livre e greco-romano.',
    history: 'Uma das formas de combate mais antigas registradas, presente nos Jogos Olímpicos da Antiguidade. O wrestling moderno se divide em estilo livre e greco-romano e é base técnica para muitos atletas de MMA.',
    characteristics: ['Quedas explosivas', 'Controle de quadril', 'Ritmo intenso', 'Base e postura sólidas'],
    techniques: ['Double leg', 'Single leg', 'Sprawl', 'Arm drag', 'Suplex'],
    equipment: ['Singlet', 'Sapatilhas de wrestling', 'Protetor de orelha'],
  },
  {
    id: 'karate', name: 'Karatê', short: 'Mãos vazias', origin: 'Okinawa', hue: 350, popularity: 66,
    description: 'Arte marcial de golpes precisos, kata e kumite, que valoriza distância, explosão e controle.',
    history: 'Originado em Okinawa a partir de influências locais e chinesas, o karatê se difundiu pelo Japão no século XX e depois pelo mundo. Diferentes estilos convivem, e a modalidade esteve no programa olímpico de 2020.',
    characteristics: ['Kata (formas)', 'Kumite (combate)', 'Golpes de entrada rápida', 'Postura e kime'],
    techniques: ['Gyaku-zuki', 'Mae-geri', 'Mawashi-geri', 'Kizami-zuki', 'Ura-mawashi'],
    equipment: ['Karategi', 'Faixa', 'Luvas de kumite', 'Protetor de pé'],
  },
  {
    id: 'taekwondo', name: 'Taekwondo', short: 'O caminho dos pés e mãos', origin: 'Coreia', hue: 228, popularity: 64,
    description: 'Arte marcial coreana conhecida pelos chutes altos, giratórios e pela velocidade de pernas.',
    history: 'Consolidado na Coreia em meados do século XX, o taekwondo combina tradições marciais locais e se tornou esporte olímpico em 2000, com sistema eletrônico de pontuação.',
    characteristics: ['Chutes altos e giratórios', 'Pontuação eletrônica', 'Poomsae', 'Grande mobilidade'],
    techniques: ['Dollyo chagi', 'Dwi chagi', 'Naeryo chagi', 'Yop chagi', 'Tuit chagi'],
    equipment: ['Dobok', 'Colete (hogu)', 'Capacete', 'Protetores de antebraço e canela'],
  },
  {
    id: 'kickboxing', name: 'Kickboxing', short: 'Socos e chutes', origin: 'Japão / EUA', hue: 40, popularity: 74,
    description: 'Esporte de striking que combina técnicas de boxe com chutes, em regras que variam conforme a organização.',
    history: 'Surgiu nos anos 1960–70 da troca entre karatê, Muay Thai e boxe. Diferentes regras (full contact, low kick, K-1) moldaram estilos distintos ao redor do mundo.',
    characteristics: ['Combinações de mãos e pernas', 'Ritmo alto', 'Diferentes regras', 'Ótimo condicionamento'],
    techniques: ['Jab-direto-low kick', 'Chute alto', 'Joelhada (regra K-1)', 'Esquiva com contra-ataque'],
    equipment: ['Luvas de 10–16 oz', 'Caneleiras', 'Bandagens', 'Protetor bucal'],
  },
  {
    id: 'defesa', name: 'Defesa Pessoal', short: 'Prevenção e reação', origin: 'Multidisciplinar', hue: 160, popularity: 80,
    description: 'Conjunto de estratégias de prevenção, percepção de risco e técnicas simples para escapar de situações de perigo.',
    history: 'Programas modernos de defesa pessoal reúnem elementos de várias artes marciais com foco em situações cotidianas, priorizando consciência situacional, desescalada verbal e fuga segura.',
    characteristics: ['Prevenção em primeiro lugar', 'Técnicas simples e diretas', 'Foco em fugir com segurança', 'Treino de consciência situacional'],
    techniques: ['Postura de cerca', 'Escape de agarrão no pulso', 'Escape de abraço por trás', 'Desescalada verbal'],
    equipment: ['Roupas confortáveis', 'Luvas leves', 'Aparadores (escudos)'],
  },
];

export const modalityById = (id: string) => MODALITIES.find((m) => m.id === id);
export const modalityName = (id: string) => modalityById(id)?.name ?? id;

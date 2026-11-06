import type { FightEvent, Fighter, ModalityId } from '../types';

// Atletas e eventos 100% fictícios, criados para a demonstração.
const F: [string, string, string, string, string][] = [
  ['Caio Brandão', 'Trovão', 'Brasil', '14-3-0', 'Equipe Vértice'],
  ['Nikolai Petrenko', 'Urso Gelado', 'Ucrânia', '12-4-0', 'Kyiv Fight Lab'],
  ['Mateus Albuquerque', 'Pitbull', 'Brasil', '18-5-0', 'Nação Grappling'],
  ['Jordan Avery', 'Lince', 'EUA', '11-2-0', 'Desert Combat'],
  ['Kenji Morimoto', 'Lâmina', 'Japão', '9-1-0', 'Osaka Kakuto'],
  ['Rafael Siqueira', 'Furacão', 'Brasil', '16-6-0', 'Equipe Vértice'],
  ['Tomás Echeverría', 'Cóndor', 'Chile', '10-3-1', 'Andes MMA'],
  ['Samuel Okafor', 'Rocha', 'Nigéria', '13-2-0', 'Lagos Striking'],
  ['Larissa Monteiro', 'Fênix', 'Brasil', '8-1-0', 'Nação Grappling'],
  ['Elena Vasquez', 'La Reina', 'México', '9-2-0', 'Guadalajara Gym'],
  ['Aiko Shimizu', 'Sakura', 'Japão', '7-2-0', 'Tokyo Bushido'],
  ['Hannah Kowalski', 'Valquíria', 'Polônia', '10-3-0', 'Krakow Combat'],
  ['Saenchai Wongsakul', 'Martelo', 'Tailândia', '45-8-2', 'Bangkok Nak Muay'],
  ['Diego Fontes', 'Muralha', 'Brasil', '22-6-0', 'CT Kru Sul'],
  ['Pornthep Kaewmanee', 'Cobra', 'Tailândia', '51-12-1', 'Chiang Mai Camp'],
  ['Lucas Ventura', 'Faísca', 'Brasil', '19-4-0', 'CT Kru Sul'],
  ['Miguel Herrera', 'El Toro', 'Espanha', '21-3-0', 'Madrid Boxing'],
  ['Wesley Carvalho', 'Relâmpago', 'Brasil', '17-2-0', 'Ringue de Ouro'],
  ['Andre Lukic', 'Lobo', 'Sérvia', '15-1-0', 'Belgrade Box'],
  ['Kofi Mensah', 'Pantera', 'Gana', '18-3-0', 'Accra Boxing'],
  ['Beatriz Lacerda', 'Gaivota', 'Brasil', 'Faixa preta', 'Gracie Norte (fictícia)'],
  ['Clara Nakamura', 'Âncora', 'Brasil', 'Faixa preta', 'Alliance Sul (fictícia)'],
  ['Felipe Dornelles', 'Polvo', 'Brasil', 'Faixa preta', 'Nação Grappling'],
  ['Hugo Mattos', 'Serpente', 'Portugal', 'Faixa preta', 'Lisboa BJJ'],
  ['Takeshi Hara', 'Montanha', 'Japão', '3º dan', 'Kodokai'],
  ['Igor Mendes', 'Pilar', 'Brasil', '3º dan', 'Sociedade Judô Leste'],
  ['Yerlan Abenov', 'Estepe', 'Cazaquistão', '24-5', 'Almaty Wrestling'],
  ['Rodrigo Pacheco', 'Trator', 'Brasil', '20-7', 'Luta Olímpica BR'],
  ['Min-jun Park', 'Vento', 'Coreia do Sul', '31-6', 'Seoul TKD'],
  ['Gabriel Torres', 'Hélice', 'Brasil', '27-8', 'TKD Paulista'],
  ['Laura Bianchi', 'Tempesta', 'Itália', '23-4-0', 'Milano Kick'],
  ['Renata Castilho', 'Vespa', 'Brasil', '20-5-0', 'Kick Factory'],
];
export const FIGHTERS: Fighter[] = F.map((f, i) => ({
  id: `f${i + 1}`, name: f[0], nickname: f[1], country: f[2], record: f[3], team: f[4], hue: (i * 37) % 360,
}));
export const fighterById = (id: string) => FIGHTERS.find((f) => f.id === id);

let fid = 0;
const fight = (a: number, b: number, weight: string, rounds: number, main = false, result?: [number, string, number]) => ({
  id: `fx${++fid}`, a: `f${a}`, b: `f${b}`, weight, rounds, main,
  result: result ? { winner: `f${result[0]}`, method: result[1], round: result[2] } : undefined,
});

const ev = (id: string, name: string, modality: ModalityId, dayOffset: number, durationDays: number, venue: string, city: string, description: string, fights: ReturnType<typeof fight>[], featured = false): FightEvent =>
  ({ id, name, modality, dayOffset, durationDays, venue, city, description, fights, featured });

export const SEED_EVENTS: FightEvent[] = [
  ev('ev1', 'Fight Flow Night 07 (demo)', 'mma', -26, 1, 'Arena Horizonte (fictícia)', 'Belo Horizonte, MG', 'Noite de MMA demonstrativa com disputa de cinturão dos meio-médios.', [
    fight(1, 2, 'Meio-médio', 5, true, [1, 'Decisão unânime', 5]), fight(3, 4, 'Peso-leve', 3, false, [4, 'Nocaute técnico', 2]), fight(9, 10, 'Peso-palha feminino', 3, false, [9, 'Finalização (mata-leão)', 1]),
  ]),
  ev('ev2', 'Copa Tatame Aberto (demo)', 'bjj', -19, 2, 'Ginásio Litoral (fictício)', 'Florianópolis, SC', 'Campeonato demonstrativo de Jiu-Jitsu com superlutas de faixa preta.', [
    fight(21, 22, 'Peso-pena', 1, true, [22, 'Vantagem', 1]), fight(23, 24, 'Peso-médio', 1, false, [23, 'Finalização (triângulo)', 1]),
  ]),
  ev('ev3', 'Ringue de Ouro 12 (demo)', 'boxe', -11, 1, 'Ginásio Central (fictício)', 'São Paulo, SP', 'Noite de boxe demonstrativa com disputa de título regional.', [
    fight(17, 18, 'Superleve', 10, true, [18, 'Decisão dividida', 10]), fight(19, 20, 'Médio', 8, false, [19, 'Nocaute', 6]),
  ], true),
  ev('ev4', 'Thai Fight Brasil (demo)', 'muaythai', -4, 1, 'Arena Sul (fictícia)', 'Curitiba, PR', 'Evento demonstrativo de Muay Thai com regras tradicionais.', [
    fight(13, 14, 'Peso-leve', 5, true, [13, 'Decisão unânime', 5]), fight(15, 16, 'Meio-médio', 5, false, [16, 'Nocaute (cotovelada)', 3]),
  ]),
  ev('ev5', 'Fight Flow Grand Prix (demo)', 'mma', 0, 2, 'Arena Fight Flow (fictícia)', 'Rio de Janeiro, RJ', 'Grand Prix demonstrativo de dois dias. Acontecendo agora no calendário da plataforma.', [
    fight(5, 6, 'Peso-pena', 5, true), fight(7, 8, 'Meio-pesado', 3), fight(11, 12, 'Peso-mosca feminino', 3),
  ], true),
  ev('ev6', 'Kick Masters Cup (demo)', 'kickboxing', 3, 1, 'Ginásio Aurora (fictício)', 'Porto Alegre, RS', 'Torneio demonstrativo de kickboxing com regras K-1.', [
    fight(31, 32, 'Peso-galo feminino', 3, true), fight(16, 14, 'Meio-médio', 3),
  ]),
  ev('ev7', 'Fight Flow Night 08 (demo)', 'mma', 8, 1, 'Arena Horizonte (fictícia)', 'Belo Horizonte, MG', 'Próxima noite de MMA da série demonstrativa, com revanche no evento principal.', [
    fight(2, 3, 'Meio-médio', 5, true), fight(4, 7, 'Peso-leve', 3), fight(10, 12, 'Peso-palha feminino', 3), fight(1, 8, 'Médio', 3),
  ], true),
  ev('ev8', 'Grand Slam de Judô (demo)', 'judo', 13, 2, 'Centro Olímpico (fictício)', 'Salvador, BA', 'Competição demonstrativa de judô com chave por categorias.', [
    fight(25, 26, '-90 kg', 1, true),
  ]),
  ev('ev9', 'Open de Wrestling (demo)', 'wrestling', 19, 1, 'Ginásio Norte (fictício)', 'Manaus, AM', 'Torneio demonstrativo de luta olímpica estilo livre.', [
    fight(27, 28, '-86 kg', 2, true),
  ]),
  ev('ev10', 'Copa Dobok (demo)', 'taekwondo', 26, 1, 'Arena Leste (fictícia)', 'Recife, PE', 'Campeonato demonstrativo de taekwondo com pontuação eletrônica.', [
    fight(29, 30, '-68 kg', 3, true),
  ]),
  ev('ev11', 'Ringue de Ouro 13 (demo)', 'boxe', 34, 1, 'Ginásio Central (fictício)', 'São Paulo, SP', 'Revanche demonstrativa do título regional dos superleves.', [
    fight(18, 17, 'Superleve', 10, true), fight(20, 19, 'Médio', 8),
  ]),
  ev('ev12', 'Fight Flow Finale (demo)', 'mma', 46, 1, 'Arena Fight Flow (fictícia)', 'Rio de Janeiro, RJ', 'Encerramento demonstrativo da temporada com três disputas de cinturão.', [
    fight(1, 6, 'Meio-médio', 5, true), fight(9, 11, 'Peso-palha feminino', 5), fight(3, 5, 'Peso-leve', 5),
  ], true),
];

import type { ModalityId, Post } from '../types';

const H = 3600_000;
type C = [authorId: string, text: string, hoursAgo: number];
type P = [authorId: string, modality: ModalityId, text: string, tags: string[], hoursAgo: number, likes: number, shares: number, comments: C[], art?: boolean];

const RAW: P[] = [
  ['u2', 'mma', 'Os melhores nocautes da semana (eventos demonstrativos da plataforma): o que todos têm em comum? Golpe que o adversário não viu. Montei uma lista e o padrão é claro — a maioria veio de contra-ataques, não de iniciativa.', ['nocautes', 'analise'], 2, 312, 41, [['u14', 'Contra-ataque é subestimado demais no MMA.', 1.5], ['u20', 'Faz um post só sobre timing!', 1]], true],
  ['u13', 'bjj', '5 erros comuns de iniciantes no Jiu-Jitsu:\n1. Força em vez de alavanca\n2. Prender a respiração\n3. Esquecer a fuga de quadril\n4. Buscar finalização antes da posição\n5. Não pedir ajuda ao professor\nQual vocês cometeram mais?', ['bjj', 'iniciantes'], 5, 486, 77, [['u1', 'O 2 até hoje 😅', 4], ['u11', 'Todos ao mesmo tempo na primeira aula.', 3.5], ['u5', 'Vale para judô também.', 2]]],
  ['u3', 'boxe', 'Como melhorar a movimentação no boxe: comecei a fazer 3 rounds de sombra só com footwork, sem soltar golpe nenhum. Em duas semanas meu equilíbrio no sparring mudou.', ['boxe', 'footwork'], 8, 221, 18, [['u16', 'Vou testar amanhã!', 7]], true],
  ['u12', 'muaythai', 'Minha evolução depois de 6 meses de Muay Thai: perdi o medo do clinch, ganhei fôlego e aprendi que chute circular é quadril, não perna. Ainda tenho muito a melhorar no teep.', ['evolucao', 'muaythai'], 12, 534, 22, [['u4', 'Teep é o mais difícil de acertar no tempo certo.', 11], ['u9', 'Que evolução! Parabéns.', 10]], true],
  ['u14', 'mma', 'Análise técnica: defesa contra quedas no MMA. Sprawl resolve o double leg, mas o single leg contra a grade pede outra coisa: controle de cabeça e underhook. Sem isso você só atrasa a queda.', ['wrestling', 'mma', 'tecnica'], 20, 398, 54, [['u6', 'Perfeito. Underhook é tudo contra a grade.', 18], ['u17', 'E o whizzer como plano B.', 17]]],
  ['u6', 'wrestling', 'Treino de hoje: 50 mudanças de nível sem penetrar. Parece chato, mas é o que deixa a queda rápida de verdade.', ['wrestling', 'drill'], 26, 176, 9, [['u17', 'Drill chato = luta fácil.', 25]]],
  ['u7', 'karate', 'Kata não é dança. Cada movimento tem uma aplicação. Hoje o sensei mostrou a aplicação de um bloqueio baixo como defesa de chute e foi um choque para a turma.', ['karate', 'kata'], 30, 143, 12, [['u18', 'Bunkai é a parte mais legal.', 28]], true],
  ['u8', 'taekwondo', 'Dica de mobilidade: alongamento estático depois do treino, mobilidade dinâmica antes. Inverter isso me custou uma lesão leve no posterior ano passado.', ['taekwondo', 'mobilidade'], 34, 207, 31, [['u19', 'Exatamente o que a literatura de preparação recomenda.', 33]]],
  ['u10', 'defesa', 'Defesa pessoal começa antes do contato: atenção ao redor, rotas de saída e confiança na intuição. A melhor técnica é não precisar dela.', ['defesapessoal', 'prevencao'], 40, 611, 120, [['u3', 'Deveria ser ensinado nas escolas.', 38], ['u12', 'Concordo 100%.', 37]], true],
  ['u9', 'kickboxing', 'Low kick bem feito: gire o quadril e acerte com a canela. Errei isso por meses chutando com o pé. Doeu mais em mim do que no saco.', ['kickboxing', 'lowkick'], 46, 189, 14, [['u15', 'Clássico! Todo mundo passa por isso.', 44]]],
  ['u1', 'bjj', 'Primeira competição (demonstrativa) amanhã. Plano: puxar guarda, buscar raspagem, respirar. Desejem sorte!', ['bjj', 'competicao'], 52, 402, 6, [['u13', 'Boa sorte! Respira e confia no treino.', 51], ['u2', 'Vai com tudo!', 50]]],
  ['u19', 'mma', 'O papel do cardio em lutas: não é só correr. Rounds intervalados que imitam o ritmo da luta transferem muito melhor para o tatame.', ['preparacaofisica', 'cardio'], 58, 265, 47, [['u14', 'Trabalho com intervalados de 30/30 e mudou meu terceiro round.', 56]], true],
  ['u4', 'muaythai', 'Clinch tailandês: antebraços por dentro, cotovelos juntos, e desequilibre ANTES de joelhar. Quem joelha sem desequilibrar só cansa.', ['clinch', 'muaythai'], 64, 233, 19, [['u12', 'Esse detalhe do desequilíbrio é ouro.', 62]]],
  ['u5', 'judo', 'Ukemi bem treinado é o que permite treinar judô por décadas. Antes de projetar, aprenda a cair. Sem atalhos.', ['judo', 'ukemi'], 70, 158, 11, [['u18', 'Meu sensei repete isso toda aula.', 68]]],
  ['u11', 'boxe', 'Comecei boxe aos 35 e queria dizer pra quem está em dúvida: vai. A turma de iniciantes é acolhedora e ninguém te joga no sparring no primeiro dia.', ['iniciantes', 'boxe'], 76, 702, 88, [['u3', 'Bem-vindo! 🥊', 75], ['u16', 'Melhor decisão.', 74], ['u10', 'Que inspirador!', 72]]],
  ['u16', 'boxe', 'Sparring leve não é luta. Combine intensidade com o parceiro antes de começar. Treino bom é aquele em que os dois voltam na próxima semana.', ['sparring', 'seguranca'], 82, 344, 52, [['u15', 'Deveria estar na parede de toda academia.', 80]]],
  ['u20', 'mma', 'Palpites do evento demonstrativo desta semana já estão abertos na aba Eventos. Fiz os meus — quem acerta mais?', ['palpites', 'eventos'], 88, 97, 5, [['u2', 'Fui de zebra no co-main.', 86]]],
  ['u17', 'wrestling', 'Estatística curiosa da minha planilha de lutas demonstrativas: atletas que vencem o controle de grade no 1º round tendem a vencer o round. Correlação, não causalidade, mas interessante.', ['dados', 'wrestling'], 96, 121, 15, [['u2', 'Me passa essa planilha!', 94]], true],
  ['u15', 'kickboxing', 'Para instrutores: aquecimento com jogos de reação deixa a turma mais atenta do que 10 minutos de polichinelo.', ['instrutores', 'didatica'], 104, 166, 23, [['u9', 'Testei e funciona demais.', 100]]],
  ['u18', 'judo', 'O-soto-gari parece simples até você perceber que o kuzushi é 80% da técnica.', ['judo', 'tecnica'], 112, 98, 4, [['u5', 'Kuzushi é tudo.', 110]]],
  ['u12', 'muaythai', 'Bandagem bem feita protege o punho e os nós dos dedos. Levei 2 meses pra aprender direito. Tem guia no curso de Muay Thai da Academy.', ['equipamento', 'muaythai'], 120, 140, 17, [['u4', 'Tutorial salvo!', 118]]],
  ['u3', 'boxe', 'Jab duplo para entrar, direto para pontuar e sair em ângulo. Simples e eficiente. Treinei isso a semana toda.', ['boxe', 'combinacoes'], 130, 187, 8, [['u11', 'Vou copiar no meu treino de saco.', 128]], true],
  ['u14', 'mma', 'Transição striking → grappling: o golpe disfarça a mudança de nível. Se ele está protegendo o rosto, não está pensando na perna.', ['mma', 'transicoes'], 140, 276, 33, [['u6', 'Exatamente. Soco para entrar na queda.', 138]]],
  ['u1', 'bjj', 'Resultado da competição demonstrativa: duas vitórias por pontos e uma derrota por vantagem. Aprendi mais nessa derrota do que em um mês de treino.', ['bjj', 'aprendizado'], 150, 529, 12, [['u13', 'Isso é Jiu-Jitsu!', 148], ['u5', 'Parabéns pela coragem.', 146]]],
  ['u8', 'taekwondo', 'Chutes giratórios: o olhar chega antes do chute. Se você gira sem olhar, você não sabe onde vai acertar.', ['taekwondo', 'chutes'], 160, 133, 9, [['u7', 'Vale para o ura-mawashi também.', 158]], true],
  ['u10', 'defesa', 'Escape de agarrão no pulso: gire em direção ao polegar. É o ponto mais fraco da pegada. E depois do escape, saia dali.', ['defesapessoal', 'escape'], 172, 380, 64, [['u12', 'Simples e eficaz.', 170]]],
  ['u19', 'mma', 'Sono é treino. Quem dorme mal recupera mal. Antes de aumentar volume, olhe para as suas noites.', ['recuperacao', 'saude'], 184, 455, 71, [['u14', 'Assino embaixo.', 180]]],
  ['u2', 'mma', 'Como identificar padrões de movimentação: observe para qual lado o lutador sai quando é pressionado. A maioria tem um lado preferido — e isso vira armadilha.', ['analise', 'movimentacao'], 196, 301, 39, [['u20', 'Comecei a reparar nisso e não consigo mais desver.', 190]], true],
  ['u9', 'kickboxing', 'Hidratação no treino: pequenos goles ao longo da aula funcionam melhor para mim do que muita água de uma vez no intervalo.', ['saude', 'kickboxing'], 210, 92, 3, [['u15', 'Boa dica.', 205]]],
  ['u13', 'bjj', 'Passagem de guarda começa pela postura. Sem postura, você vai passar o treino inteiro desfazendo triângulo.', ['bjj', 'passagem'], 230, 264, 20, [['u1', 'Kkkk verdade dolorosa.', 225]]],
];

let cid = 0;
export const makeSeedPosts = (now = Date.now()): Post[] =>
  RAW.map((r, i) => ({
    id: `p${i + 1}`,
    authorId: r[0],
    modality: r[1],
    text: r[2],
    hashtags: r[3],
    ts: now - r[4] * H,
    likes: r[5],
    shares: r[6],
    comments: r[7].map((c) => ({ id: `sc${++cid}`, authorId: c[0], text: c[1], ts: now - c[2] * H })),
    art: r[8] ? i + 3 : undefined,
  }));

/** The landing's copy, mirrored from src/pages/landing/content.ts. */

export interface LandingFact {
  number: string
  label: string
  note: string
}

export const HERO_TAGLINE = 'Vença a discussão dentro da história. Passe no vestibular fora dela.'

export const HERO_LEAD =
  'Você vive um personagem, encontra um conflito e precisa convencer alguém escrevendo. Um corretor avalia o seu texto na hora, com os critérios do ENEM e da FUVEST, e a história muda conforme o argumento que você fez.'

export const HERO_SCENE = {
  narration:
    'Sexta-feira, 7h20. O aviso no mural ainda tem cheiro de impressora: “FESTIVAL CULTURAL, CANCELADO”. Você é presidente do grêmio há exatamente onze dias.',
  speech:
    'Se veio falar do festival, economize saliva. Ano passado foi reclamação de barulho, pátio imundo e três pais na minha sala. Por que este ano seria diferente?',
  speaker: 'Dona Marta',
  objective:
    'Escreva para Dona Marta: por que o festival merece uma segunda chance, e como o grêmio vai evitar os problemas do ano passado.',
}

export const FACTS: LandingFact[] = [
  { number: '2', label: 'vestibulares', note: 'ENEM e FUVEST. Você escolhe a lente em que a nota aparece.' },
  {
    number: '5',
    label: 'dimensões avaliadas',
    note: 'Norma culta, coesão, coerência, repertório e persuasão.',
  },
  {
    number: '3',
    label: 'correções grátis por dia',
    note: 'Qualquer envio mantém a sua sequência, aprovado ou não.',
  },
  {
    number: '15 a 25 min',
    label: 'por capítulo',
    note: 'Histórias curtas, de 3 a 5 capítulos, com uma redação completa no fim.',
  },
]

export interface ChapterCard {
  story: string
  tag: string
  boss: boolean
  title: string
  objective: string
}

export const CHAPTER_ROWS: [ChapterCard[], ChapterCard[]] = [
  [
    {
      story: 'O Grêmio',
      tag: 'Tutorial',
      boss: false,
      title: 'A porta da diretoria',
      objective: 'Convença Dona Marta a reabrir a discussão do festival cancelado.',
    },
    {
      story: 'Cuidado Invisível',
      tag: 'ENEM 2023',
      boss: false,
      title: 'O almoço de domingo',
      objective: 'Convença a tia Bete a assumir um dia fixo de cuidado com a vó.',
    },
    {
      story: 'Sinal Fechado',
      tag: 'FUVEST 2021',
      boss: false,
      title: 'A pressa no trânsito',
      objective:
        'Convença Luciana de que a hipervelocidade e a produtividade a qualquer custo geram desordem.',
    },
    {
      story: 'O Grêmio',
      tag: 'Tutorial',
      boss: false,
      title: 'O pátio do Tenório',
      objective: 'Convença Seu Tenório a liberar o pátio, assumindo compromissos com o espaço.',
    },
  ],
  [
    {
      story: 'Sinal Fechado',
      tag: 'FUVEST 2021',
      boss: false,
      title: 'A ordem do guarda',
      objective: 'Mostre ao sargento que crises complexas não se resolvem com repressão.',
    },
    {
      story: 'O Grêmio',
      tag: 'Redação-chefe',
      boss: true,
      title: 'A assembleia',
      objective:
        'Defenda o festival para os pais, respondendo às objeções sobre provas, custo e segurança.',
    },
    {
      story: 'Cuidado Invisível',
      tag: 'Redação-chefe',
      boss: true,
      title: 'A sala do CRAS',
      objective:
        'Redação completa sobre a invisibilidade do trabalho de cuidado, com proposta de intervenção.',
    },
    {
      story: 'Sinal Fechado',
      tag: 'Redação-chefe',
      boss: true,
      title: 'A banca da FUVEST',
      objective: 'Redação completa: o mundo contemporâneo está fora de ordem?',
    },
  ],
]

export interface StepCopy {
  number: string
  title: string
  text: string
}

export const STEPS: StepCopy[] = [
  {
    number: '01',
    title: 'Entre na cena',
    text: 'Cada capítulo abre com uma situação e um personagem que discorda de você. Ele tem motivos, memória do que deu errado e uma pergunta que você precisa responder por escrito.',
  },
  {
    number: '02',
    title: 'Escreva o argumento',
    text: 'De 120 a 250 palavras, dirigidas a essa pessoa: tese, justificativa e repertório explicado. O rascunho salva sozinho, e o contador mostra quanto falta.',
  },
  {
    number: '03',
    title: 'Receba a correção na hora',
    text: 'O placar sai na lente do seu vestibular, com o piso de cada critério à vista. O seu texto volta anotado no lugar do erro, e você vê o que precisa mudar para passar.',
  },
  {
    number: '04',
    title: 'A história responde',
    text: 'Convenceu? O personagem cede e o próximo capítulo abre. Não convenceu? A história segue pelo caminho ruim e você ganha uma cena de recuperação, com nova chance. Erro de português não gera consequência: o texto volta anotado para você revisar.',
  },
]

export const STEP_SCENE = {
  narration:
    'Dona Marta cedeu, com uma condição: “Se o Tenório topar cuidar da estrutura, eu autorizo.” O zelador está consertando um portão e nem levanta os olhos quando você chega.',
  speech:
    'Festival? Tô fora. Ano passado sumiu cadeira, pichação no banheiro e adivinha quem varreu tudo sozinho no sábado? Escreve aí no seu papelzinho: o pátio é meu.',
  speaker: 'Seu Tenório',
  objective:
    'Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza.',
}

export const VERDICT_OK = {
  title: 'Você convenceu.',
  line: 'Seu Tenório libera o pátio. Capítulo 3 desbloqueado: A assembleia, a redação-chefe da história.',
}

export const VERDICT_WARN = {
  title: 'Ele ainda não se move.',
  line: '“Promessa de estudante dura até a primeira prova. Sem garantia, sem pátio.” A história segue pelo caminho ruim, e uma cena de recuperação te dá nova chance.',
}

export interface DimensionCopy {
  number: string
  title: string
  text: string
  argumentaOnly: boolean
}

export const DIMENSIONS: DimensionCopy[] = [
  {
    number: '01',
    title: 'Norma culta',
    text: 'Ortografia, acentuação, pontuação e morfossintaxe. Um corretor ortográfico determinístico ancora os erros objetivos.',
    argumentaOnly: false,
  },
  {
    number: '02',
    title: 'Coesão',
    text: 'Conectivos, referenciação e paragrafação: se o texto se segura de uma frase para a outra.',
    argumentaOnly: false,
  },
  {
    number: '03',
    title: 'Coerência',
    text: 'Lógica do argumento, ausência de contradição e progressão do tema.',
    argumentaOnly: false,
  },
  {
    number: '04',
    title: 'Repertório sociocultural',
    text: 'Presença, explicação e ligação com a tese. Fato inventado derruba a nota; caso duvidoso vira um alerta para verificar.',
    argumentaOnly: false,
  },
  {
    number: '05',
    title: 'Persuasão situada',
    text: 'Adequação ao interlocutor, viabilidade no contexto da história e verossimilhança.',
    argumentaOnly: true,
  },
]

export interface PlanCopy {
  name: string
  price: string | null
  priceNote: string
  description: string
  features: string[]
  startable: boolean
}

export const PLANS: PlanCopy[] = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    priceNote: 'para sempre',
    description: 'Para conhecer o jogo e criar o hábito de escrever todo dia.',
    features: [
      '3 correções por dia',
      'As três histórias, incluindo as redações-chefe',
      'Placar, texto anotado e “Para passar”',
      'Sequência diária',
    ],
    startable: true,
  },
  {
    name: 'Vestibulando',
    price: null,
    priceNote: 'por mês',
    description: 'Para quem treina de verdade e quer ver a nota subir dimensão por dimensão.',
    features: [
      '10 correções por dia',
      'Tudo do Grátis',
      'Gráfico de evolução por dimensão',
      'Histórico de todas as tentativas',
      'Marcos por história concluída',
    ],
    startable: false,
  },
  {
    name: 'PRO',
    price: null,
    priceNote: 'por mês',
    description: 'Para a reta final: sem limite, nas duas lentes, com tudo o que sair primeiro.',
    features: [
      'Correções sem limite diário',
      'Tudo do Vestibulando',
      'Nota nas duas lentes, ENEM e FUVEST',
      'Novas histórias assim que saem',
    ],
    startable: false,
  },
]

export interface FaqEntry {
  number: string
  question: string
  answer: string
}

export const FAQ: FaqEntry[] = [
  {
    number: '01',
    question: 'A nota é a mesma que eu tiraria na prova?',
    answer:
      'Não. É uma estimativa do Argumenta na escala do seu vestibular, calibrada com redações reais já avaliadas. Serve para treinar e comparar as suas tentativas, não para prever a banca.',
  },
  {
    number: '02',
    question: 'Quanto custa?',
    answer:
      'Nada durante o beta. O plano Grátis dá 3 correções por dia, e qualquer envio mantém a sua sequência, aprovado ou não. Os planos Vestibulando e PRO vão ampliar o limite diário e abrir a evolução por dimensão.',
  },
  {
    number: '03',
    question: 'E se eu não convencer o personagem?',
    answer:
      'A história segue pelo ramo ruim e você recebe uma cena de recuperação, com nova chance. Se o problema for de português, não há consequência: o texto volta anotado para você revisar e reenviar.',
  },
]

export const CLOSING_FACTS: LandingFact[] = [
  { number: 'R$ 0', label: 'no beta', note: 'Sem cartão e sem assinatura.' },
  { number: '3', label: 'correções por dia', note: 'O limite que faz do treino um hábito.' },
  { number: '13', label: 'capítulos para vencer', note: 'Em três histórias, com três redações completas.' },
  { number: '15 a 25 min', label: 'por capítulo', note: 'Cabe entre uma aula e outra.' },
]

export const NAV_LINKS = ['Como funciona', 'Histórias', 'Planos', 'Perguntas']

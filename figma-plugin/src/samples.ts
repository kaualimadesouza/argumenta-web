/** Fixture content for the frames, copied from the app's own seeded copy in
 *  src/pages/landing/content.ts and the legal documents. Every pt-BR string a
 *  student reads is the one the code ships. */
import type { ChipTone } from './ui'
import type { StoryState } from './chrome'

export interface SceneSample {
  narration: string
  speech: string
  speaker: string
  objective: string
  hint: string
}

export const SCENE: SceneSample = {
  narration:
    'Dona Marta cedeu, com uma condição: “Se o Tenório topar cuidar da estrutura, eu autorizo.” O zelador está consertando um portão e nem levanta os olhos quando você chega.',
  speech:
    'Festival? Tô fora. Ano passado sumiu cadeira, pichação no banheiro e adivinha quem varreu tudo sozinho no sábado? Escreve aí no seu papelzinho: o pátio é meu.',
  speaker: 'Seu Tenório',
  objective:
    'Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza.',
  hint: 'Um compromisso que dá para verificar convence mais que uma promessa de boa vontade. Pense em quem assina, quando, e o que acontece se falhar.',
}

export interface StorySample {
  title: string
  badge: string
  badgeTone: ChipTone
  line: string
  position: number
  state: StoryState
  percent: number
  cta: string | null
}

export const TRACK: StorySample[] = [
  {
    title: 'O Grêmio',
    badge: 'Concluída',
    badgeTone: 'ok',
    line: 'Tutorial · 3 capítulos',
    position: 1,
    state: 'completed',
    percent: 100,
    cta: null,
  },
  {
    title: 'Cuidado Invisível',
    badge: 'Cap. 2/5',
    badgeTone: 'caneta',
    line: 'Uma família decide, no almoço de domingo, quem cuida da avó. Ninguém quer dizer em voz alta que já decidiram.',
    position: 2,
    state: 'in_progress',
    percent: 40,
    cta: 'Continuar capítulo 2',
  },
  {
    title: 'Sinal Fechado',
    badge: 'Bloqueada',
    badgeTone: 'warn',
    line: 'Conclua Cuidado Invisível para abrir esta história.',
    position: 3,
    state: 'locked',
    percent: 0,
    cta: null,
  },
]

export interface ScoreRow {
  code: string
  label: string
  score: number
  belowFloor: boolean
  extra?: string
}

export const SCORE_MAX = 200
export const SCORE_FLOOR = 100

export const SCORE_ROWS: ScoreRow[] = [
  { code: 'C1', label: 'Norma culta', score: 160, belowFloor: false },
  { code: 'C2', label: 'Repertório', score: 80, belowFloor: true },
  { code: 'C3', label: 'Coerência', score: 160, belowFloor: false },
  { code: 'C4', label: 'Coesão', score: 140, belowFloor: false },
  { code: 'C5', label: 'Persuasão situada', score: 150, belowFloor: false, extra: 'critério Argumenta' },
]

export const DRAFT =
  'Seu Tenório, o senhor tem razão sobre o ano passado, mais este ano o grêmio começa pelo que falhou: uma escala de limpeza assinada por turma e um termo de responsabilidade pelas cadeiras. Como lembra Paulo Freire, a escola também educa fora da sala.'

/** The one slip and the one praised repertoire inside DRAFT. */
export const SLIP = 'mais'
export const PRAISE = 'Paulo Freire'

export interface MarkSample {
  number: number
  kind: string
  message: string
  tone: 'slip' | 'praise'
}

export const MARKS: MarkSample[] = [
  {
    number: 1,
    kind: 'Ortografia.',
    message: 'Troque “mais” por “mas”: aqui a conjunção é adversativa.',
    tone: 'slip',
  },
  {
    number: 2,
    kind: 'Repertório bem usado.',
    message: 'Freire sustenta a sua tese e está explicado no próprio parágrafo.',
    tone: 'praise',
  },
]

export const TO_PASS = [
  'Troque “mais” por “mas”: aqui a conjunção é adversativa.',
  'Explique o repertório: o que Freire diz e por que isso deve convencer o zelador.',
]

export interface TrendSample {
  code: string
  label: string
  latest: number
  delta: number
  points: number[]
}

export const TRENDS: TrendSample[] = [
  { code: 'C1', label: 'Norma culta', latest: 80, delta: 10, points: [55, 60, 70, 65, 80] },
  { code: 'C2', label: 'Repertório', latest: 40, delta: -10, points: [60, 55, 50, 45, 40] },
  { code: 'C3', label: 'Coerência', latest: 80, delta: 0, points: [75, 80, 78, 80, 80] },
  { code: 'C4', label: 'Coesão', latest: 70, delta: 20, points: [50, 55, 60, 65, 70] },
  { code: 'C5', label: 'Persuasão situada', latest: 75, delta: 5, points: [65, 70, 68, 72, 75] },
]

export const MILESTONES: { label: string; done: boolean }[] = [
  { label: '1 de 3 histórias concluídas', done: false },
  { label: 'Tutorial concluído', done: true },
  { label: 'Primeiro repertório elogiado', done: true },
  { label: 'Uma semana sem faltar', done: false },
  { label: 'Primeira redação-chefe', done: false },
]

export const WEEK: { label: string; done: boolean; today: boolean }[] = [
  { label: 'Seg', done: true, today: false },
  { label: 'Ter', done: true, today: false },
  { label: 'Qua', done: true, today: false },
  { label: 'Qui', done: false, today: false },
  { label: 'Sex', done: true, today: false },
  { label: 'Sáb', done: true, today: false },
  { label: 'Dom', done: true, today: true },
]

/** The bad branch: what the student sees when the argument did not move anyone. */
export const CONSEQUENCE = {
  narration:
    'Segunda-feira, 7h05. O pátio está trancado com um cadeado novo e um aviso escrito à mão: “USO SUSPENSO ATÉ NOVA ORDEM”. O grêmio perdeu o espaço antes de ter o festival.',
  speech:
    'Promessa de estudante dura até a primeira prova. Sem garantia, sem pátio. Volte quando tiver algo escrito que eu possa cobrar.',
  speaker: 'Seu Tenório',
  score: 72,
  evidence:
    'Você defendeu o festival, mas não respondeu ao que Seu Tenório mede: quem assina o compromisso, e o que acontece se o pátio amanhecer sujo de novo.',
}

export interface AttemptSample {
  attempt: string
  verdict: string
  score: string
  body: string
}

export const ATTEMPTS: AttemptSample[] = [
  {
    attempt: 'Tentativa 2',
    verdict: 'Desvios de escrita',
    score: '138/200',
    body: 'Seu Tenório, o senhor tem razão sobre o ano passado, mais este ano o grêmio começa pelo que falhou: uma escala de limpeza assinada por turma.',
  },
  {
    attempt: 'Tentativa 1',
    verdict: 'Falha de persuasão',
    score: '96/200',
    body: 'O festival é importante para a escola e todos os alunos querem que aconteça de novo neste ano.',
  },
]

export interface LegalSectionSample {
  heading: string
  paragraph: string
  items?: string[]
}

export const LEGAL = {
  title: 'Política de privacidade',
  summary:
    'Pedimos o mínimo para o treino funcionar: e-mail, apelido, os vestibulares que você quer prestar e os textos que você escreve. Nada é vendido e nada vai para anunciante.',
  updatedAt: 'Atualizado em 22 de agosto de 2026',
  sections: [
    {
      heading: 'Dados que coletamos',
      paragraph: 'Só o que a prática de redação precisa:',
      items: [
        'seu e-mail, para você entrar na conta e nós conseguirmos falar com você',
        'seu apelido, que é o nome que aparece no app',
        'seus vestibulares alvo (por exemplo ENEM 2027), que definem em qual escala a correção é mostrada',
        'os textos que você envia para correção, e a correção que o motor devolveu',
      ],
    },
    {
      heading: 'Para que usamos e com que base legal',
      paragraph:
        'Usamos os seus dados para executar o contrato do serviço: corrigir os seus textos, mostrar a sua evolução e manter a sua conta de pé.',
    },
    {
      heading: 'Telemetria de escrita',
      paragraph:
        'Registramos sinais de como o texto foi escrito, como colagens e ritmo de digitação, para distinguir treino de cópia. Nada disso aparece para você como acusação.',
    },
  ] as LegalSectionSample[],
}

import { controllerSection } from './controller'
import type { LegalDocument } from './document'

export const TERMS_OF_USE: LegalDocument = {
  title: 'Termos de uso',
  summary:
    'O Argumenta é treino de redação argumentativa dentro de histórias. Ao criar a conta, você concorda com o que está escrito aqui.',
  updatedAt: '22 de agosto de 2026',
  sections: [
    {
      heading: 'O que o Argumenta faz',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Você joga histórias em que precisa convencer um personagem escrevendo um argumento. O texto é corrigido por um motor de inteligência artificial na escala do vestibular que você escolheu, e a história avança conforme você convence ou não.',
        },
        {
          kind: 'paragraph',
          text: 'Há um limite de 3 correções por dia. É de propósito: escrever menos e revisar mais ensina mais do que despejar texto.',
        },
      ],
    },
    {
      heading: 'A nota que você recebe',
      blocks: [
        {
          kind: 'paragraph',
          text: 'A correção é um treino e não é nota oficial de nenhuma banca. Nós mostramos o seu resultado na escala do ENEM ou da FUVEST para você se localizar, mas quem corrige a sua prova de verdade é a banca, e o resultado lá pode ser diferente.',
        },
        {
          kind: 'paragraph',
          text: 'Quando o total exibido é uma conta nossa, e não a escala oficial da banca, a tela diz isso na hora.',
        },
      ],
    },
    {
      heading: 'Sua conta',
      blocks: [
        {
          kind: 'paragraph',
          text: 'A conta é sua e pessoal. Guarde a sua senha, não empreste o acesso e não crie conta com o e-mail de outra pessoa. Você pode excluir a conta quando quiser, pela tela de Conta.',
        },
      ],
    },
    {
      heading: 'O que você escreve',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Os textos que você envia continuam seus. Nós os usamos para corrigir, para montar o seu histórico de evolução e, de forma agregada, para melhorar a qualidade da correção. Não publicamos o seu texto nem o mostramos para outros alunos.',
        },
      ],
    },
    {
      heading: 'Uso aceitável',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Não use o Argumenta para enviar texto que não é seu, para atacar pessoas, nem para tentar burlar o motor de correção ou o limite diário. Conta usada assim pode ser suspensa.',
        },
      ],
    },
    {
      heading: 'Limites do serviço',
      blocks: [
        {
          kind: 'paragraph',
          text: 'O Argumenta está em fase inicial. Pode sair do ar, pode ter erro de correção e pode mudar de comportamento entre uma semana e outra. Avisaremos o que for relevante, mas não prometemos disponibilidade nem exatidão.',
        },
      ],
    },
    {
      heading: 'Mudanças nestes termos',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Se mudarmos algo que afete você, atualizamos a data no topo desta página e avisamos no app antes de valer.',
        },
      ],
    },
    controllerSection(),
  ],
}

import { controllerSection } from './controller'
import type { LegalDocument } from './document'

export const PRIVACY_POLICY: LegalDocument = {
  title: 'Política de privacidade',
  summary:
    'Pedimos o mínimo para o treino funcionar: e-mail, apelido, os vestibulares que você quer prestar e os textos que você escreve. Nada é vendido e nada vai para anunciante.',
  updatedAt: '22 de agosto de 2026',
  sections: [
    {
      heading: 'Dados que coletamos',
      blocks: [
        { kind: 'paragraph', text: 'Só o que a prática de redação precisa:' },
        {
          kind: 'list',
          items: [
            'seu e-mail, para você entrar na conta e nós conseguirmos falar com você',
            'seu apelido, que é o nome que aparece no app',
            'seus vestibulares alvo (por exemplo ENEM 2027), que definem em qual escala a correção é mostrada',
            'os textos que você envia para correção, e a correção que o motor devolveu',
            'sinais de como o texto foi escrito: tempo de digitação e colagens de texto',
          ],
        },
        {
          kind: 'paragraph',
          text: 'Se você entra com o Google, recebemos do Google apenas o seu e-mail e um identificador da conta. Não temos acesso à sua senha do Google, nem aos seus contatos, nem a nada além disso.',
        },
      ],
    },
    {
      heading: 'Para que usamos e com que base legal',
      blocks: [
        {
          kind: 'list',
          items: [
            'manter sua conta e a sua trilha de histórias: execução do contrato (LGPD, art. 7º, V)',
            'corrigir os seus textos e mostrar a sua evolução: execução do contrato',
            'medir como o texto foi escrito, para que a correção premie quem escreve de verdade: legítimo interesse (art. 7º, IX)',
            'guardar a data em que você aceitou os termos: cumprimento de obrigação legal',
          ],
        },
      ],
    },
    {
      heading: 'Telemetria de escrita',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Enquanto você escreve, registramos quanto tempo levou, quantas teclas foram usadas e se houve colagem de texto de fora. Serve para uma coisa só: entender se o texto foi escrito por você.',
        },
        {
          kind: 'paragraph',
          text: 'Isso é guardado e nunca altera a sua nota. Nenhum desses sinais entra no cálculo do placar nem no veredito do capítulo. Se algum dia isso mudar, avisaremos aqui antes.',
        },
      ],
    },
    {
      heading: 'Quanto tempo guardamos',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Enquanto a sua conta existir. Os seus textos e correções ficam guardados porque são o histórico da sua evolução, que é o que a tela de progresso mostra.',
        },
      ],
    },
    {
      heading: 'Exclusão da sua conta',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Você exclui a conta sozinho, pela tela de Conta, sem pedir para ninguém e sem enviar e-mail. No momento em que você confirma, a conta é desativada e a sessão encerra.',
        },
        {
          kind: 'paragraph',
          text: 'Depois disso existe uma carência de 7 dias, para o caso de arrependimento ou de exclusão feita por engano. Passado esse prazo, tudo é apagado de verdade do banco: conta, identidades de login, textos, correções, progresso e telemetria.',
        },
      ],
    },
    {
      heading: 'Com quem compartilhamos',
      blocks: [
        {
          kind: 'paragraph',
          text: 'A correção é feita por um modelo de linguagem da Anthropic, então o texto que você envia é processado por eles para gerar a correção. Fora isso, e o Google quando você escolhe entrar com o Google, não compartilhamos os seus dados com ninguém.',
        },
      ],
    },
    {
      heading: 'Se você tem menos de 18 anos',
      blocks: [
        {
          kind: 'paragraph',
          text: 'Boa parte de quem treina para o vestibular tem menos de 18, e este texto foi escrito para ser lido por você mesmo, sem advogado no meio.',
        },
        {
          kind: 'paragraph',
          text: 'Se você tem menos de 18 anos, mostre esta página para quem responde por você (mãe, pai ou responsável) antes de criar a conta. Se você tem menos de 13, precisamos do consentimento dessa pessoa, e por enquanto o Argumenta não é para a sua idade.',
        },
      ],
    },
    {
      heading: 'Seus direitos',
      blocks: [
        {
          kind: 'paragraph',
          text: 'A LGPD garante que você possa saber quais dados temos, corrigir o que está errado, pedir uma cópia e apagar tudo. O apelido e os vestibulares você edita na tela de Conta, e a exclusão está lá também. Para o resto, fale com quem responde pelo Argumenta.',
        },
      ],
    },
    controllerSection(),
  ],
}

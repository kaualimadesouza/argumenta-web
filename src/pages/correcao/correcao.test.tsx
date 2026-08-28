import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { SubmissionResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import {
  aChapter,
  aLens,
  aMe,
  aReaction,
  aSubmission,
  anAnnotation,
} from '../../test/fixtures'
import { renderApp } from '../../test/render'

const BODY =
  'Tio, a minha mãe acorda às cinco e cuida da vó todos os dias. Concerteza o senhor já percebeu que ela esta cansada.'

function correcao(submission: SubmissionResponse = aSubmission(), body = BODY) {
  return renderApp({
    api: createFakeApi({ me: aMe(), chapter: aChapter(), submission }),
    path: '/capitulos/chapter-1/correcao',
    state: { submission, body },
  })
}

function markedFor(submission: SubmissionResponse, body: string) {
  return { submission, body }
}

describe('Correção em camadas (mockup tela 05)', () => {
  test('sem o envio no estado da rota, devolve o aluno para a cena', async () => {
    const view = renderApp({
      api: createFakeApi({ me: aMe(), chapter: aChapter() }),
      path: '/capitulos/chapter-1/correcao',
    })

    await screen.findByText(/a pia cheia/i)
    expect(view.path()).toBe('/capitulos/chapter-1')
  })

  test('o placar lista os critérios da lente com nota e escala do vestibular', async () => {
    correcao()

    const placar = await screen.findByRole('region', { name: /placar/i })
    expect(within(placar).getByText(/domínio da norma culta/i)).toBeVisible()
    expect(within(placar).getByText('160/200')).toBeVisible()
    expect(within(placar).getByText('120/200')).toBeVisible()
  })

  test('o critério abaixo do piso é anunciado como reprovado', async () => {
    correcao(
      aSubmission({
        verdict: 'failed_technical',
        floor_value: 40,
        lens: aLens({
          criteria: [
            { code: 'C1', label: 'Domínio da norma culta', score: 60, scale_max: 200, is_argumenta_extra: false },
            { code: 'C4', label: 'Coesão textual', score: 160, scale_max: 200, is_argumenta_extra: false },
          ],
        }),
      }),
    )

    const failed = await screen.findByRole('progressbar', { name: /domínio da norma culta/i })
    expect(failed).toHaveAccessibleName(/abaixo do piso/i)
    expect(screen.getByRole('progressbar', { name: /coesão textual/i })).not.toHaveAccessibleName(
      /abaixo do piso/i,
    )
  })

  test('o total da Argumenta vem com o aviso de que não é nota oficial', async () => {
    correcao(aSubmission({ lens: aLens({ total: 550, total_max: 800, scale_source: 'argumenta' }) }))

    expect(await screen.findByText('550/800')).toBeVisible()
    expect(screen.getByText(/não é nota oficial/i)).toBeVisible()
  })

  test('o total oficial do vestibular não leva o aviso', async () => {
    correcao(aSubmission({ lens: aLens({ total: 720, total_max: 1000, scale_source: 'board' }) }))

    expect(await screen.findByText('720/1000')).toBeVisible()
    expect(screen.queryByText(/não é nota oficial/i)).not.toBeInTheDocument()
  })

  test('o texto do aluno aparece com a palavra marcada e a explicação numerada', async () => {
    const start = BODY.indexOf('esta')
    correcao(
      aSubmission({
        annotations: [
          anAnnotation({
            span_start: start,
            span_end: start + 4,
            type: 'accentuation',
            message: '“está” leva acento.',
          }),
        ],
      }),
    )

    const text = await screen.findByRole('region', { name: /seu texto, corrigido/i })
    const marked = within(text).getByText('esta')
    expect(marked).toHaveAccessibleName(/está” leva acento/i)

    const legend = screen.getByRole('region', { name: /as marcações/i })
    expect(within(legend).getByText(/está” leva acento/i)).toBeVisible()
  })

  test('o acento antes do span não desloca a marcação no texto renderizado', async () => {
    const start = BODY.indexOf('Concerteza')
    correcao(
      aSubmission({
        annotations: [
          anAnnotation({ span_start: start, span_end: start + 10, message: 'Escreva “com certeza”.' }),
        ],
      }),
    )

    const text = await screen.findByRole('region', { name: /seu texto, corrigido/i })
    expect(within(text).getByText('Concerteza')).toBeVisible()
  })

  test('o repertório elogiado é destacado sem virar erro', async () => {
    const start = BODY.indexOf('cuida da vó')
    correcao(
      aSubmission({
        annotations: [
          anAnnotation({
            span_start: start,
            span_end: start + 11,
            type: 'repertoire_praise',
            severity: 'praise',
            message: 'Dado citado, explicado e ligado à tese.',
          }),
        ],
      }),
    )

    const text = await screen.findByRole('region', { name: /seu texto, corrigido/i })
    expect(within(text).getByText('cuida da vó')).toHaveAccessibleName(/ligado à tese/i)
  })

  test('para passar lista as prioridades da correção', async () => {
    correcao(
      aSubmission({
        para_passar: [
          anAnnotation({ message: 'Corrija os quatro desvios marcados.', priority: 1 }),
          anAnnotation({ message: 'Feche com o que você quer dele: dois dias.', priority: 2 }),
        ],
      }),
    )

    const list = await screen.findByRole('region', { name: /para passar/i })
    expect(within(list).getByText(/quatro desvios marcados/i)).toBeVisible()
    expect(within(list).getByText(/dois dias/i)).toBeVisible()
  })
})

describe('os CTAs seguem o veredito', () => {
  test('falha técnica volta ao editor, com as anotações à vista', async () => {
    correcao(aSubmission({ verdict: 'failed_technical', chapter_status: 'drafting' }))

    expect(await screen.findByRole('link', { name: /revisar meu texto/i })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1/escrever',
    )
    expect(screen.getByRole('region', { name: /as marcações/i })).toBeVisible()
  })

  test('falha técnica não inventa reação do personagem', async () => {
    correcao(aSubmission({ verdict: 'failed_technical', chapter_status: 'drafting' }))

    await screen.findByRole('link', { name: /revisar meu texto/i })
    expect(screen.queryByRole('figure')).not.toBeInTheDocument()
  })

  test('falha de persuasão leva à consequência', async () => {
    correcao(aSubmission({ verdict: 'failed_persuasion', chapter_status: 'in_consequence' }))

    expect(await screen.findByRole('link', { name: /ver o que aconteceu/i })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1/consequencia',
    )
  })

  test('aprovação mostra a reação do personagem e devolve à trilha', async () => {
    renderApp({
      api: createFakeApi({
        me: aMe(),
        chapter: aChapter(),
        reaction: aReaction({ beat: 'convinced', body: 'Tá. Me manda os dias que você pode.' }),
      }),
      path: '/capitulos/chapter-1/correcao',
      state: markedFor(aSubmission({ verdict: 'approved', chapter_status: 'passed' }), BODY),
    })

    const reaction = await screen.findByRole('figure', { name: 'Tio Marcos' })
    expect(within(reaction).getByText(/me manda os dias/i)).toBeVisible()
    expect(screen.getByRole('link', { name: /continuar a história/i })).toHaveAttribute(
      'href',
      '/trilha',
    )
  })
})

describe('a lente é a do vestibular do aluno', () => {
  test('FUVEST mostra os eixos da FUVEST, não as competências do ENEM', async () => {
    correcao(
      aSubmission({
        lens: aLens({
          exam: 'fuvest',
          criteria: [
            { code: 'E1', label: 'Desenvolvimento do tema', score: 4, scale_max: 5, is_argumenta_extra: false },
            { code: 'E2', label: 'Coesão e coerência', score: 3, scale_max: 5, is_argumenta_extra: false },
          ],
          total: 7,
          total_max: 10,
          scale_source: 'board',
        }),
      }),
    )

    const placar = await screen.findByRole('region', { name: /placar/i })
    expect(within(placar).getByText(/desenvolvimento do tema/i)).toBeVisible()
    expect(within(placar).getByText('4/5')).toBeVisible()
    expect(within(placar).queryByText(/norma culta/i)).not.toBeInTheDocument()
  })

  test('o critério extra da Argumenta é marcado como nosso', async () => {
    correcao(
      aSubmission({
        lens: aLens({
          criteria: [
            { code: 'C1', label: 'Domínio da norma culta', score: 160, scale_max: 200, is_argumenta_extra: false },
            { code: 'persuasao', label: 'Persuasão', score: 78, scale_max: 100, is_argumenta_extra: true },
          ],
        }),
      }),
    )

    const placar = await screen.findByRole('region', { name: /placar/i })
    expect(within(placar).getByText(/critério argumenta/i)).toBeVisible()
  })
})

import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ChapterResponse, SubmissionResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import { aChapter, aLens, aMe, aSubmission, aTarget } from '../../test/fixtures'
import { renderApp } from '../../test/render'

const BOSS = aChapter({
  kind: 'chefe',
  title: 'A sala do CRAS',
  objective:
    'Escreva um texto dissertativo-argumentativo sobre os desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil, com proposta de intervenção.',
  antagonist_name: 'Dra. Neusa',
  min_words: 250,
  max_words: 450,
})

function editor(chapter: ChapterResponse = BOSS, exam: 'enem' | 'fuvest' = 'enem') {
  return renderApp({
    api: createFakeApi({ me: aMe({ targets: [aTarget({ exam })] }), chapter }),
    path: `/capitulos/${chapter.id}/escrever`,
  })
}

describe('Redação-chefe: o editor dissertativo', () => {
  test('abre com a proposta completa do tema, e não com um recado para alguém', async () => {
    editor()

    const proposal = await screen.findByRole('region', { name: /a proposta/i })
    expect(within(proposal).getByText(/invisibilidade do trabalho de cuidado/i)).toBeVisible()
    expect(screen.getByRole('heading', { name: /redação-chefe/i })).toBeVisible()
    expect(screen.queryByRole('heading', { name: /convença/i })).not.toBeInTheDocument()
  })

  test('a entrega é de uma redação, não de uma mensagem', async () => {
    editor()

    expect(await screen.findByRole('button', { name: /entregar a redação/i })).toBeVisible()
  })

  test('os limites de palavras são os do capítulo chefe', async () => {
    editor()

    expect(await screen.findByText('0 / 450 palavras')).toBeVisible()
  })

  test('no ENEM, a proposta de intervenção entra na lista do que o texto precisa ter', async () => {
    editor(BOSS, 'enem')

    const proposal = await screen.findByRole('region', { name: /a proposta/i })
    // o texto da proposta já cita a intervenção: a asserção é sobre o item da lista
    expect(within(proposal).getByText('Proposta de intervenção')).toBeVisible()
  })

  test('na FUVEST, que não cobra intervenção, ela não é pedida', async () => {
    editor(BOSS, 'fuvest')

    const proposal = await screen.findByRole('region', { name: /a proposta/i })
    expect(within(proposal).queryByText('Proposta de intervenção')).not.toBeInTheDocument()
  })

  test('um capítulo de confronto continua sendo um recado para o antagonista', async () => {
    editor(aChapter({ kind: 'confronto', antagonist_name: 'Tio Marcos' }))

    expect(await screen.findByRole('heading', { name: /convença tio marcos/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /enviar para tio marcos/i })).toBeVisible()
    expect(screen.queryByRole('region', { name: /a proposta/i })).not.toBeInTheDocument()
  })
})

const FULL_ENEM = aLens({
  criteria: [
    { code: 'C1', label: 'Domínio da norma culta', score: 160, scale_max: 200, is_argumenta_extra: false },
    { code: 'C2', label: 'Compreensão da proposta e repertório', score: 180, scale_max: 200, is_argumenta_extra: false },
    { code: 'C3', label: 'Seleção e organização dos argumentos', score: 160, scale_max: 200, is_argumenta_extra: false },
    { code: 'C4', label: 'Mecanismos linguísticos de coesão', score: 140, scale_max: 200, is_argumenta_extra: false },
    { code: 'C5', label: 'Proposta de intervenção', score: 120, scale_max: 200, is_argumenta_extra: false },
  ],
  total: 760,
  total_max: 1000,
  scale_source: 'board',
})

function correcao(submission: SubmissionResponse) {
  return renderApp({
    api: createFakeApi({ me: aMe(), chapter: BOSS, submission }),
    path: `/capitulos/${BOSS.id}/correcao`,
    state: { submission, body: 'a redação entregue' },
  })
}

describe('Redação-chefe: o placar da lente cheia', () => {
  test('o chefe do ENEM mostra as cinco competências e a escala de 0 a 1000', async () => {
    correcao(aSubmission({ lens: FULL_ENEM }))

    const placar = await screen.findByRole('region', { name: /placar/i })
    expect(within(placar).getByText('Proposta de intervenção')).toBeVisible()
    expect(within(placar).getByText('C5')).toBeVisible()
    expect(within(placar).getByText('760/1000')).toBeVisible()
    expect(screen.queryByText(/não é nota oficial/i)).not.toBeInTheDocument()
  })

  test('um confronto não inventa a C5 que a lente não mandou', async () => {
    correcao(aSubmission({ lens: aLens() }))

    const placar = await screen.findByRole('region', { name: /placar/i })
    expect(within(placar).queryByText('C5')).not.toBeInTheDocument()
    expect(within(placar).queryByText(/proposta de intervenção/i)).not.toBeInTheDocument()
  })
})

import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ApiError } from '../../api/ApiError'
import type { ArgumentaApi } from '../../api/client'
import type { ChapterResponse, SubmissionResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import { aBeat, aChapter, aMe, aScore, aSubmission, aTrack } from '../../test/fixtures'
import { renderApp } from '../../test/render'

const CONSEQUENCE = aChapter({
  status: 'in_consequence',
  branch: 'consequence',
  beats: [
    aBeat({ body: 'Segunda-feira, 6h. O tio Marcos saiu sem falar com ninguém.' }),
    aBeat({
      beat_type: 'dialogue',
      body: 'Se cuidar é trabalho, me diz quanto custa e quem paga.',
      character_name: 'Tio Marcos',
    }),
    aBeat({ beat_type: 'hint', body: 'Ele aceita critério, não indignação.' }),
  ],
})

const FAILED = aSubmission({
  verdict: 'failed_persuasion',
  chapter_status: 'in_consequence',
  floor_value: 60,
  scores: [
    aScore({ dimension: 'persuasao', score: 58, passed_floor: false, evidence: 'Sem a conta, a tese fica no sentimento.' }),
  ],
})

function consequencia(chapter: ChapterResponse = CONSEQUENCE, submission?: SubmissionResponse) {
  return renderApp({
    api: createFakeApi({ me: aMe(), chapter }),
    path: '/capitulos/chapter-1/consequencia',
    state: submission === undefined ? undefined : { submission },
  })
}

describe('Consequência (mockup tela 06)', () => {
  test('mostra a cena do ramo de consequência, na ordem do roteiro', async () => {
    consequencia()

    const narration = await screen.findByText(/saiu sem falar com ninguém/i)
    const speech = screen.getByText(/quanto custa e quem paga/i)
    expect(narration).toBeVisible()
    expect(narration.compareDocumentPosition(speech)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('a dica de repertório do ramo aparece como dica', async () => {
    consequencia()

    const hint = await screen.findByRole('region', { name: /dica de repertório/i })
    expect(within(hint).getByText(/critério, não indignação/i)).toBeVisible()
  })

  test('quando o fluxo entrega o envio, diz onde o argumento parou', async () => {
    consequencia(CONSEQUENCE, FAILED)

    const card = await screen.findByRole('region', { name: /onde o argumento parou/i })
    expect(within(card).getByText('58/100')).toBeVisible()
    expect(within(card).getByText(/fica no sentimento/i)).toBeVisible()
    expect(within(card).getByRole('progressbar', { name: /persuasão/i })).toBeVisible()
  })

  test('sem o envio, a cena ainda abre e nada é inventado', async () => {
    consequencia()

    await screen.findByText(/saiu sem falar com ninguém/i)
    expect(screen.queryByRole('region', { name: /onde o argumento parou/i })).not.toBeInTheDocument()
  })

  test('o cabeçalho volta para a trilha', async () => {
    consequencia()

    expect(await screen.findByRole('link', { name: /trilha/i })).toHaveAttribute('href', '/trilha')
  })
})

describe('a recuperação', () => {
  test('o CTA move o capítulo e abre a cena que aceita texto de novo', async () => {
    const view = consequencia()

    await view.user.click(
      await screen.findByRole('button', { name: /encarar tio marcos de novo/i }),
    )

    expect(await screen.findByRole('link', { name: 'Argumentar' })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1/escrever',
    )
    expect(view.path()).toBe('/capitulos/chapter-1')
  })

  test('se a recuperação falhar, explica e deixa tentar de novo', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe(), chapter: CONSEQUENCE }),
      startRecovery: () => Promise.reject(new ApiError(429, 'DailyLimitReachedError')),
    }
    const view = renderApp({ api, path: '/capitulos/chapter-1/consequencia' })

    await view.user.click(
      await screen.findByRole('button', { name: /encarar tio marcos de novo/i }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(/envios de hoje/i)
    expect(view.path()).toBe('/capitulos/chapter-1/consequencia')
  })

  test('capítulo que não está em consequência não finge que está', async () => {
    const view = consequencia(aChapter({ status: 'available', branch: 'main' }))

    await screen.findByRole('link', { name: 'Argumentar' })
    expect(view.path()).toBe('/capitulos/chapter-1')
  })
})

describe('o ciclo completo', () => {
  test('falha de persuasão, consequência, recuperação e aprovação retomam a trilha', async () => {
    const view = renderApp({
      api: createFakeApi({
        me: aMe(),
        chapter: aChapter({ status: 'available' }),
        // dois envios no mesmo dia: a cota tem de caber no ciclo
        track: aTrack({ submissions_today: 0 }),
        submissions: [
          FAILED,
          aSubmission({ verdict: 'approved', chapter_status: 'passed' }),
        ],
      }),
      path: '/capitulos/chapter-1/escrever',
    })

    const argument = Array.from({ length: 130 }, (_, index) => `palavra${index}`).join(' ')
    async function write() {
      // o rascunho anterior volta preenchido: limpar antes de reescrever
      const desk = await screen.findByLabelText(/seu argumento/i)
      await view.user.clear(desk)
      await view.user.type(desk, argument)
      await view.user.click(screen.getByRole('button', { name: /enviar para tio marcos/i }))
    }

    await write()

    // correção: a falha de persuasão manda ver a consequência
    await view.user.click(await screen.findByRole('link', { name: /ver o que aconteceu/i }))

    // consequência: a recuperação devolve a cena que aceita texto
    await view.user.click(
      await screen.findByRole('button', { name: /encarar tio marcos de novo/i }),
    )
    await view.user.click(await screen.findByRole('link', { name: 'Argumentar' }))

    await write()

    // aprovação: a trilha volta a ser o caminho
    await view.user.click(await screen.findByRole('link', { name: /continuar a história/i }))
    expect(view.path()).toBe('/trilha')
  }, 20000)
})

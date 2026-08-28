import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ApiError } from '../../api/ApiError'
import type { ArgumentaApi } from '../../api/client'
import type { ProgressResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import { aMe, aProgress, aTrend } from '../../test/fixtures'
import { renderApp } from '../../test/render'

function progresso(progress: ProgressResponse = aProgress()) {
  return renderApp({ api: createFakeApi({ me: aMe(), progress }), path: '/progresso' })
}

describe('Progresso (mockup tela 07)', () => {
  test('a sequência atual vem com o recorde', async () => {
    progresso()

    expect(await screen.findByText('7 dias seguidos')).toBeVisible()
    expect(screen.getByText(/recorde é 12 dias/i)).toBeVisible()
  })

  test('a sequência no singular não fala em dias', async () => {
    progresso(aProgress({ streak_days: 1 }))

    expect(await screen.findByText('1 dia seguido')).toBeVisible()
  })

  test('a semana marca os dias cumpridos e deixa hoje em aberto quando falta escrever', async () => {
    progresso(aProgress({ streak_days: 3, submissions_today: 0 }))

    const week = await screen.findByRole('list', { name: /seus últimos 7 dias/i })
    const days = within(week).getAllByRole('listitem')
    expect(days).toHaveLength(7)
    // ", escreveu" e não ", não escreveu": o sufixo sozinho casaria com os dois
    const wrote = days.filter((day) => /, escreveu$/.test(day.getAttribute('aria-label') ?? ''))
    expect(wrote).toHaveLength(3)
    expect(days[6]).toHaveAttribute('aria-label', expect.stringMatching(/não escreveu/i))
  })

  test('quem já escreveu hoje é lembrado de voltar amanhã', async () => {
    progresso(aProgress({ submissions_today: 2 }))

    expect(await screen.findByText(/volte amanhã/i)).toBeVisible()
  })

  test('quem ainda não escreveu hoje é avisado', async () => {
    progresso(aProgress({ submissions_today: 0 }))

    expect(await screen.findByText(/ainda não escreveu hoje/i)).toBeVisible()
  })
})

describe('a evolução por dimensão', () => {
  test('cada dimensão aparece com o código e o rótulo da lente do aluno', async () => {
    progresso()

    const card = await screen.findByRole('region', { name: /como cada competência anda/i })
    expect(within(card).getByText('C1')).toBeVisible()
    expect(within(card).getByText('Domínio da norma culta')).toBeVisible()
    expect(within(card).getByText('C2')).toBeVisible()
  })

  test('a dimensão que a lente não nomeia usa o nome traduzido, sem código', async () => {
    progresso(
      aProgress({
        dimensions: [
          aTrend({ dimension: 'coesao', criterion_code: null, criterion_label: null }),
        ],
      }),
    )

    const card = await screen.findByRole('region', { name: /como cada competência anda/i })
    expect(within(card).getByText('Coesão')).toBeVisible()
    expect(within(card).queryByText('C1')).not.toBeInTheDocument()
  })

  test('a última nota vem com a variação da série', async () => {
    progresso()

    const card = await screen.findByRole('region', { name: /como cada competência anda/i })
    expect(within(card).getByText('50')).toBeVisible()
    expect(within(card).getByText('−12')).toBeVisible()
    expect(within(card).getByText('80')).toBeVisible()
    expect(within(card).getByText('+12')).toBeVisible()
  })

  test('dimensão sem envio ainda não inventa uma linha', async () => {
    progresso(aProgress({ dimensions: [aTrend({ points: [] })] }))

    const card = await screen.findByRole('region', { name: /como cada competência anda/i })
    expect(within(card).getByText(/sem envio ainda/i)).toBeVisible()
    expect(within(card).queryByText('50')).not.toBeInTheDocument()
  })
})

describe('os marcos', () => {
  test('os feitos e os que faltam aparecem, com o estado dito em texto', async () => {
    progresso()

    const card = await screen.findByRole('region', { name: /marcos/i })
    expect(within(card).getByText('Tutorial concluído')).toBeVisible()
    const pending = within(card).getByText('Primeira redação-chefe')
    expect(pending.closest('li')).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/ainda não/i),
    )
  })

  test('as histórias concluídas contam entre os marcos', async () => {
    progresso(aProgress({ stories_completed: 1, stories_total: 3 }))

    const card = await screen.findByRole('region', { name: /marcos/i })
    expect(within(card).getByText('1 de 3 histórias concluídas')).toBeVisible()
  })
})

describe('a lente e as falhas', () => {
  test('o cabeçalho diz em qual lente o progresso está medido', async () => {
    progresso(aProgress({ exam: 'fuvest' }))

    expect(await screen.findByText('Lente FUVEST')).toBeVisible()
  })

  test('quando o progresso não carrega, explica e deixa tentar de novo', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe() }),
      progress: () => Promise.reject(new ApiError(500, 'Boom')),
    }
    renderApp({ api, path: '/progresso' })

    expect(await screen.findByRole('alert')).toBeVisible()
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeVisible()
  })
})

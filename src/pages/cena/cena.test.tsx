import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ArgumentaApi } from '../../api/client'
import { ApiError } from '../../api/ApiError'
import type { ChapterResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import { aBeat, aChapter, aMe } from '../../test/fixtures'
import { renderApp } from '../../test/render'

function cena(chapter: ChapterResponse = aChapter()) {
  return renderApp({
    api: createFakeApi({ me: aMe(), chapter }),
    path: `/capitulos/${chapter.id}`,
  })
}

describe('Cena (mockup tela 03)', () => {
  test('renderiza os beats por tipo, na ordem do roteiro', async () => {
    cena()

    const narration = await screen.findByText(/domingo à noite/i)
    const speech = screen.getByText(/cuidar da vó nem é trabalho de verdade/i)
    expect(narration).toBeVisible()
    expect(speech).toBeVisible()
    // a fala vem depois da narração, como o roteiro manda
    expect(narration.compareDocumentPosition(speech)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  test('a fala mostra o nome de quem fala', async () => {
    cena()

    const speech = await screen.findByRole('figure', { name: 'Tio Marcos' })
    expect(within(speech).getByText('Tio Marcos')).toBeVisible()
  })

  test('o objetivo do confronto aparece como objetivo, não como narração', async () => {
    cena()

    const objective = await screen.findByRole('region', { name: /seu objetivo/i })
    expect(within(objective).getByText(/trabalho de verdade/i)).toBeVisible()
  })

  test('a dica de repertório aparece quando o roteiro tem uma', async () => {
    cena(
      aChapter({
        beats: [aBeat({ beat_type: 'hint', body: 'Existe um nome para isso: economia do cuidado.' })],
      }),
    )

    const hint = await screen.findByRole('region', { name: /dica de repertório/i })
    expect(within(hint).getByText(/economia do cuidado/i)).toBeVisible()
  })

  test('o cabeçalho situa o capítulo e volta para a trilha', async () => {
    cena()

    expect(await screen.findByText('Cap. 2')).toBeVisible()
    expect(screen.getByRole('link', { name: /trilha/i })).toHaveAttribute('href', '/trilha')
  })

  test('o CTA leva ao editor do mesmo capítulo', async () => {
    cena()

    expect(await screen.findByRole('link', { name: 'Argumentar' })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1/escrever',
    )
  })
})

describe('os outros ramos reusam a tela', () => {
  test('o ramo de consequência mostra o conteúdo do ramo', async () => {
    cena(
      aChapter({
        status: 'in_consequence',
        branch: 'consequence',
        beats: [aBeat({ body: 'Segunda-feira, 6h. O tio Marcos saiu sem falar com ninguém.' })],
      }),
    )

    expect(await screen.findByText(/saiu sem falar com ninguém/i)).toBeVisible()
  })

  test('capítulo já vencido não convida a argumentar de novo', async () => {
    cena(aChapter({ status: 'passed' }))

    expect(await screen.findByText(/você já venceu este capítulo/i)).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Argumentar' })).not.toBeInTheDocument()
  })
})

describe('quando o capítulo não abre', () => {
  test('capítulo trancado explica em vez de mostrar tela branca', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe() }),
      chapter: () => Promise.reject(new ApiError(403, 'ChapterLockedError')),
    }
    renderApp({ api, path: '/capitulos/chapter-1' })

    expect(await screen.findByRole('alert')).toHaveTextContent(/ainda está trancado/i)
  })
})

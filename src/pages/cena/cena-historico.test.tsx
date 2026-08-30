import { screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createFakeApi } from '../../test/fakeApi'
import { aChapter, aMe, aSubmission } from '../../test/fixtures'
import { renderApp } from '../../test/render'
import type { PastSubmissionResponse } from '../../api/types'

function cenaWithSubmissions(submissions: PastSubmissionResponse[]) {
  return renderApp({
    api: {
      ...createFakeApi({ me: aMe(), chapter: aChapter() }),
      chapterSubmissions: () => Promise.resolve(submissions),
    },
    path: '/capitulos/chapter-1',
  })
}

describe('Link para histórico de tentativas na cena', () => {
  test('não mostra o link se não houver envios', async () => {
    cenaWithSubmissions([])
    expect(await screen.findByRole('heading', { name: 'A pia cheia' })).toBeVisible()
    expect(screen.queryByRole('link', { name: /ver minhas tentativas anteriores/i })).not.toBeInTheDocument()
  })

  test('não mostra o link se houver só um envio (a atual)', async () => {
    cenaWithSubmissions([
      { ...aSubmission(), body: 'Tentativa 1', created_at: '2026-08-30T00:00:00Z' }
    ])
    expect(await screen.findByRole('heading', { name: 'A pia cheia' })).toBeVisible()
    expect(screen.queryByRole('link', { name: /ver minhas tentativas anteriores/i })).not.toBeInTheDocument()
  })

  test('mostra o link se houver mais de um envio', async () => {
    cenaWithSubmissions([
      { ...aSubmission({ attempt_number: 2, submission_id: 'sub-2' }), body: 'Tentativa 2', created_at: '2026-08-30T01:00:00Z' },
      { ...aSubmission({ attempt_number: 1 }), body: 'Tentativa 1', created_at: '2026-08-30T00:00:00Z' }
    ])
    const link = await screen.findByRole('link', { name: /ver minhas tentativas anteriores/i })
    expect(link).toHaveAttribute('href', '/capitulos/chapter-1/historico')
  })
})

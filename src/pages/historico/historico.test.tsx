import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createFakeApi } from '../../test/fakeApi'
import { aChapter, aMe, aSubmission } from '../../test/fixtures'
import { renderApp } from '../../test/render'
import type { PastSubmissionResponse } from '../../api/types'

const PAST_SUBMISSIONS: PastSubmissionResponse[] = [
  { ...aSubmission({ attempt_number: 2, submission_id: 'sub-2', average_score: 80, verdict: 'failed_persuasion' }), body: 'Faltou persuadir.', created_at: '2026-08-30T01:00:00Z' },
  { ...aSubmission({ attempt_number: 1, average_score: 20, verdict: 'failed_technical' }), body: 'Muitos erros.', created_at: '2026-08-30T00:00:00Z' }
]

function historico(submissions = PAST_SUBMISSIONS) {
  return renderApp({
    api: {
      ...createFakeApi({ me: aMe(), chapter: aChapter() }),
      chapterSubmissions: () => Promise.resolve(submissions),
    },
    path: '/capitulos/chapter-1/historico',
  })
}

describe('Histórico de tentativas', () => {
  test('exibe o texto, nota e veredito de cada tentativa', async () => {
    historico()
    
    expect(await screen.findByRole('heading', { name: /tentativas anteriores/i })).toBeVisible()
    
    const attempts = screen.getAllByRole('article')
    expect(attempts).toHaveLength(2)
    
    // Attempt 2 (most recent first)
    expect(within(attempts[0]).getByText(/tentativa 2/i)).toBeVisible()
    expect(within(attempts[0]).getByText('80/400')).toBeVisible()
    expect(within(attempts[0]).getByText(/faltou persuadir/i)).toBeVisible()
    
    // Attempt 1
    expect(within(attempts[1]).getByText(/tentativa 1/i)).toBeVisible()
    expect(within(attempts[1]).getByText('20/400')).toBeVisible()
    expect(within(attempts[1]).getByText(/muitos erros/i)).toBeVisible()
  })
  
  test('o cabeçalho permite voltar para a cena', async () => {
    historico()
    const back = await screen.findByRole('link', { name: /voltar/i })
    expect(back).toHaveAttribute('href', '/capitulos/chapter-1')
  })
})

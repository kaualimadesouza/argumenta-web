import { describe, expect, test, vi } from 'vitest'

import type { PendingSubmissionResponse, SubmissionStateResponse } from './types'
import { awaitVerdict } from './verdict'
import { aSubmission } from '../test/fixtures'

const PENDING: PendingSubmissionResponse = {
  submission_id: 'submission-1',
  attempt_number: 1,
  status: 'evaluating',
}

/** The GET answer for a given fixture, in each stage of the lifecycle. */
function stateOf(status: SubmissionStateResponse['status']): SubmissionStateResponse {
  const { submission_id, attempt_number, ...result } = aSubmission()
  return {
    submission_id,
    attempt_number,
    chapter_id: 'chapter-1',
    status,
    result: status === 'evaluated' ? result : null,
  }
}

function pollingApi(answers: SubmissionStateResponse[]) {
  const submission = vi.fn(() => {
    const head = answers.length > 1 ? answers.shift() : answers[0]
    if (head === undefined) throw new Error('no scripted answer left')
    return Promise.resolve(head)
  })
  return { api: { submission }, calls: submission }
}

describe('awaitVerdict', () => {
  test('devolve a correção composta como as telas consomem', async () => {
    const { api } = pollingApi([stateOf('evaluated')])

    const outcome = await awaitVerdict(api, PENDING, { intervalMs: 0 })

    expect(outcome).toEqual({ status: 'evaluated', submission: aSubmission() })
  })

  test('insiste enquanto a API responde evaluating', async () => {
    const { api, calls } = pollingApi([stateOf('evaluating'), stateOf('evaluating'), stateOf('evaluated')])

    const outcome = await awaitVerdict(api, PENDING, { intervalMs: 0 })

    expect(outcome.status).toBe('evaluated')
    expect(calls).toHaveBeenCalledTimes(3)
  })

  test('falha da avaliação é um desfecho, não uma exceção', async () => {
    const { api } = pollingApi([stateOf('failed')])

    const outcome = await awaitVerdict(api, PENDING, { intervalMs: 0 })

    expect(outcome).toEqual({ status: 'failed' })
  })

  test('desiste no teto de espera em vez de ficar preso', async () => {
    const { api, calls } = pollingApi([stateOf('evaluating')])

    const outcome = await awaitVerdict(api, PENDING, { intervalMs: 0, timeoutMs: 0 })

    expect(outcome).toEqual({ status: 'failed' })
    expect(calls).toHaveBeenCalledTimes(1)
  })
})

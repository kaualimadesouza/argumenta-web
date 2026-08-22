import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { ApiError } from '../../api/ApiError'
import type { ChapterResponse, TrackResponse } from '../../api/types'
import { AUTOSAVE_DELAY_MS } from './useAutosave'
import type { FakeApi } from '../../test/fakeApi'
import { createFakeApi } from '../../test/fakeApi'
import { aChapter, aMe, aSubmission, aTrack } from '../../test/fixtures'
import { renderApp } from '../../test/render'

interface EditorOptions {
  chapter?: ChapterResponse
  track?: TrackResponse
}

function editor({ chapter = aChapter(), track = aTrack() }: EditorOptions = {}) {
  const api = createFakeApi({ me: aMe(), chapter, track })
  const view = renderApp({ api, path: `/capitulos/${chapter.id}/escrever` })
  return { ...view, api }
}

/** The debounce is real time, so an autosave assertion has to outwait it. */
const SAVED = { timeout: AUTOSAVE_DELAY_MS + 2000 }

/** The chapter fixture asks for 120 to 250 words. */
function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `palavra${index}`).join(' ')
}

async function draftBox(): Promise<HTMLTextAreaElement> {
  return (await screen.findByRole('textbox', { name: /seu argumento/i })) as HTMLTextAreaElement
}

function sendButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: /enviar para/i })
}

describe('Editor (mockup tela 04)', () => {
  test('situa o aluno: objetivo, quem vai ler e quantos envios sobraram', async () => {
    editor()

    expect(await screen.findByText(/convença tio marcos/i)).toBeVisible()
    expect(screen.getByText('2/3 envios hoje')).toBeVisible()
    expect(screen.getByRole('link', { name: /cena/i })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1',
    )
    expect(sendButton()).toHaveTextContent('Enviar para Tio Marcos')
  })

  test('conta as palavras contra o limite do capítulo', async () => {
    const { user } = editor()

    await user.type(await draftBox(), 'uma frase de cinco palavras')

    expect(screen.getByText('5 / 250 palavras')).toBeVisible()
  })

  test('restaura o rascunho quando o aluno volta para a tela', async () => {
    editor({ chapter: aChapter({ draft_body: words(130), status: 'drafting' }) })

    expect(await draftBox()).toHaveValue(words(130))
    expect(screen.getByText('130 / 250 palavras')).toBeVisible()
  })
})

describe('quando o capítulo não aceita texto', () => {
  test('capítulo já vencido não abre o editor pela URL', async () => {
    editor({ chapter: aChapter({ status: 'passed', draft_body: words(130) }) })

    expect(await screen.findByText(/não está esperando texto/i)).toBeVisible()
    expect(screen.queryByRole('textbox', { name: /seu argumento/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar para a cena/i })).toHaveAttribute(
      'href',
      '/capitulos/chapter-1',
    )
  })
})

describe('o autosave', () => {
  test('salva sozinho depois da pausa e diz que salvou', async () => {
    const { user, api } = editor()
    const saveDraft = vi.spyOn(api, 'saveDraft')

    await user.type(await draftBox(), 'primeiro parágrafo')
    expect(screen.getByText(/rascunho não salvo/i)).toBeVisible()

    await waitFor(
      () => expect(saveDraft).toHaveBeenCalledWith('chapter-1', { body: 'primeiro parágrafo' }),
      SAVED,
    )
    expect(await screen.findByText('rascunho salvo')).toBeVisible()
  })

  test('não perde o texto quando o salvamento falha', async () => {
    const { user, api } = editor()
    vi.spyOn(api, 'saveDraft').mockRejectedValue(new ApiError(503, 'ServiceUnavailable'))

    await user.type(await draftBox(), 'texto que a rede engoliu')

    await waitFor(() => expect(screen.getByText(/não conseguimos salvar/i)).toBeVisible(), SAVED)
    expect(await draftBox()).toHaveValue('texto que a rede engoliu')
  })
})

describe('o botão de enviar', () => {
  test('fica bloqueado abaixo do mínimo, dizendo quanto falta', async () => {
    const { user } = editor()

    await user.type(await draftBox(), words(10))

    expect(sendButton()).toBeDisabled()
    expect(screen.getByText(/faltam 110 palavras/i)).toBeVisible()
  })

  test('fica bloqueado acima do máximo, dizendo quanto sobra', async () => {
    editor({ chapter: aChapter({ draft_body: words(251) }) })

    await waitFor(() => expect(sendButton()).toBeDisabled())
    expect(screen.getByText(/1 palavra acima do limite/i)).toBeVisible()
  })

  test('libera dentro da faixa', async () => {
    editor({ chapter: aChapter({ draft_body: words(130) }) })

    await waitFor(() => expect(sendButton()).toBeEnabled())
  })

  test('some quando os envios do dia acabaram, e explica', async () => {
    editor({
      chapter: aChapter({ draft_body: words(130) }),
      track: aTrack({ submissions_today: 3, daily_limit: 3 }),
    })

    await waitFor(() => expect(sendButton()).toBeDisabled())
    expect(screen.getByText(/você já usou os seus envios de hoje/i)).toBeVisible()
    expect(screen.getByText('3/3 envios hoje')).toBeVisible()
  })
})

describe('o envio', () => {
  test('leva o aluno para a correção com o veredito já em mãos', async () => {
    const submission = aSubmission()
    const api = createFakeApi({ me: aMe(), chapter: aChapter({ draft_body: words(130) }), submission })
    const submit = vi.spyOn(api, 'submit')
    const { user, path } = renderApp({ api, path: '/capitulos/chapter-1/escrever' })

    await user.click(await screen.findByRole('button', { name: /enviar para/i }))

    await waitFor(() => expect(path()).toBe('/capitulos/chapter-1/correcao'))
    expect(submit).toHaveBeenCalledWith(
      'chapter-1',
      expect.objectContaining({ body: words(130) }),
    )
  })

  test('a recusa da API vira recado, e o texto continua ali', async () => {
    const api = createFakeApi({ me: aMe(), chapter: aChapter({ draft_body: words(130) }) })
    vi.spyOn(api, 'submit').mockRejectedValue(new ApiError(503, 'LlmBudgetExceededError'))
    const { user } = renderApp({ api, path: '/capitulos/chapter-1/escrever' })

    await user.click(await screen.findByRole('button', { name: /enviar para/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/correção está indisponível/i)
    expect(await draftBox()).toHaveValue(words(130))
  })
})

describe('a telemetria de anticola', () => {
  test('reporta a colagem e o ritmo de digitação junto do envio', async () => {
    const api: FakeApi = createFakeApi({
      me: aMe(),
      chapter: aChapter({ draft_body: words(130) }),
    })
    const { user } = renderApp({ api, path: '/capitulos/chapter-1/escrever' })

    const box = await draftBox()
    await user.click(box)
    await user.paste('um trecho colado de fora')
    await user.type(box, ' e mais um pouco')
    await user.click(sendButton())

    await waitFor(() => expect(api.telemetry.length).toBeGreaterThan(0))
    const paste = api.telemetry.find((event) => event.event_type === 'paste')
    const typing = api.telemetry.find((event) => event.event_type === 'typing_stats')
    expect(paste).toMatchObject({ chars: 'um trecho colado de fora'.length, words: 5 })
    expect(typing).toMatchObject({ submission_id: 'submission-1' })
    expect(typing?.event_type === 'typing_stats' && typing.keystrokes).toBeGreaterThan(0)
  })

  test('telemetria quebrada nunca aparece para o aluno', async () => {
    const api = createFakeApi({ me: aMe(), chapter: aChapter({ draft_body: words(130) }) })
    vi.spyOn(api, 'recordTelemetry').mockRejectedValue(new ApiError(429, 'TooManyAttemptsError'))
    const { user, path } = renderApp({ api, path: '/capitulos/chapter-1/escrever' })

    await user.click(await screen.findByRole('button', { name: /enviar para/i }))

    await waitFor(() => expect(path()).toBe('/capitulos/chapter-1/correcao'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

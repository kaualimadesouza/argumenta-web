import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ArgumentaApi } from '../../api/client'
import { createFakeApi } from '../../test/fakeApi'
import { aMe, aTrack, aTrackStory } from '../../test/fixtures'
import { renderApp } from '../../test/render'

function trilha(track = aTrack()) {
  return renderApp({ api: createFakeApi({ me: aMe(), track }), path: '/trilha' })
}

async function cardFor(title: string): Promise<HTMLElement> {
  const heading = await screen.findByRole('heading', { name: title })
  return heading.closest('article') as HTMLElement
}

describe('chips do topo', () => {
  test('streak e envios do dia vêm da API', async () => {
    trilha(aTrack({ streak_days: 7, submissions_today: 2, daily_limit: 3 }))

    expect(await screen.findByText('7 dias')).toBeVisible()
    expect(screen.getByText('2/3 envios hoje')).toBeVisible()
  })

  test('streak de um dia fala no singular', async () => {
    trilha(aTrack({ streak_days: 1 }))

    expect(await screen.findByText('1 dia')).toBeVisible()
  })

  test('sem streak nenhum não inventa chip de dias', async () => {
    trilha(aTrack({ streak_days: 0 }))

    expect(await screen.findByText('2/3 envios hoje')).toBeVisible()
    expect(screen.queryByText(/dias?$/)).not.toBeInTheDocument()
  })
})

describe('os três estados de card do mockup', () => {
  test('concluída mostra o selo e não oferece capítulo', async () => {
    trilha(
      aTrack({
        stories: [
          aTrackStory({ state: 'completed', chapters_passed: 3, current_chapter: null }),
        ],
      }),
    )

    const card = await cardFor('O Grêmio')
    expect(within(card).getByText('Concluída')).toBeVisible()
    expect(within(card).queryByRole('link')).not.toBeInTheDocument()
    expect(within(card).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  test('em andamento continua do capítulo atual e leva para a cena', async () => {
    trilha(
      aTrack({
        stories: [
          aTrackStory({
            title: 'Cuidado Invisível',
            slug: 'cuidado-invisivel',
            is_tutorial: false,
            state: 'in_progress',
            chapters_passed: 1,
            chapters_total: 5,
            current_chapter: { id: 'chapter-42', order: 2, status: 'available' },
          }),
        ],
      }),
    )

    const card = await cardFor('Cuidado Invisível')
    const cta = within(card).getByRole('link', { name: 'Continuar capítulo 2' })
    expect(cta).toHaveAttribute('href', '/capitulos/chapter-42')
    expect(within(card).getByText('Cap. 2/5')).toBeVisible()
    expect(within(card).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20')
  })

  test('disponível e ainda intocada convida a começar', async () => {
    trilha(aTrack({ stories: [aTrackStory({ state: 'available' })] }))

    const card = await cardFor('O Grêmio')
    expect(within(card).getByRole('link', { name: 'Começar capítulo 1' })).toBeVisible()
  })

  test('bloqueada não navega e diz o que falta', async () => {
    trilha(
      aTrack({
        stories: [
          aTrackStory({ state: 'completed', chapters_passed: 3, current_chapter: null }),
          aTrackStory({
            id: 'story-2',
            slug: 'sinal-fechado',
            title: 'Sinal Fechado',
            is_tutorial: false,
            position: 2,
            state: 'locked',
            chapters_total: 5,
            current_chapter: null,
          }),
        ],
      }),
    )

    const card = await cardFor('Sinal Fechado')
    expect(within(card).getByText('Bloqueada')).toBeVisible()
    expect(within(card).queryByRole('link')).not.toBeInTheDocument()
    expect(within(card).getByText(/conclua O Grêmio/i)).toBeVisible()
  })
})

describe('a trilha vazia e a trilha que não carrega', () => {
  test('sem história publicada explica em vez de mostrar nada', async () => {
    trilha(aTrack({ stories: [] }))

    expect(await screen.findByText(/nenhuma história publicada ainda/i)).toBeVisible()
  })

  test('falha da API oferece tentar de novo', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe() }),
      track: () => Promise.reject(new TypeError('fetch failed')),
    }
    renderApp({ api, path: '/trilha' })

    expect(await screen.findByRole('alert')).toHaveTextContent(/sem conexão/i)
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeVisible()
  })
})

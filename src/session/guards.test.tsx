import { screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import type { ArgumentaApi } from '../api/client'
import { createFakeApi } from '../test/fakeApi'
import { aMe } from '../test/fixtures'
import { renderApp } from '../test/render'

describe('rotas do jogo', () => {
  test('sem sessão caem na Entrada', async () => {
    renderApp({ api: createFakeApi(), path: '/trilha' })

    expect(await screen.findByRole('heading', { level: 1, name: 'Argumenta' })).toBeVisible()
  })

  test('com sessão mas sem vestibular caem no onboarding', async () => {
    const api = createFakeApi({ me: aMe({ targets: [] }) })
    renderApp({ api, path: '/trilha' })

    expect(await screen.findByRole('heading', { name: /seus vestibulares/i })).toBeVisible()
  })

  test('com sessão e vestibular abrem a trilha', async () => {
    renderApp({ api: createFakeApi({ me: aMe() }), path: '/trilha' })

    expect(await screen.findByRole('heading', { name: /sua trilha/i })).toBeVisible()
  })

  test('a raiz leva para a trilha de quem já está pronto', async () => {
    renderApp({ api: createFakeApi({ me: aMe() }), path: '/' })

    expect(await screen.findByRole('heading', { name: /sua trilha/i })).toBeVisible()
  })

  test('API fora do ar não desloga ninguém: oferece tentar de novo', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe() }),
      me: () => Promise.reject(new TypeError('fetch failed')),
    }
    renderApp({ api, path: '/trilha' })

    expect(await screen.findByRole('alert')).toHaveTextContent(/não conseguimos falar/i)
    expect(screen.getByRole('button', { name: /tentar de novo/i })).toBeVisible()
  })
})

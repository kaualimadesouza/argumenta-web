import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createFakeApi } from '../test/fakeApi'
import { aChapter, aMe, aSubmission } from '../test/fixtures'
import { renderApp } from '../test/render'

function at(path: string, state?: unknown) {
  return renderApp({
    api: createFakeApi({ me: aMe(), chapter: aChapter({ status: 'in_consequence', branch: 'consequence' }) }),
    path,
    state,
  })
}

describe('a navegação principal', () => {
  test('acompanha as três telas de casa', async () => {
    at('/trilha')

    const nav = await screen.findByRole('navigation', { name: /navegação principal/i })
    expect(within(nav).getByRole('link', { name: 'Trilha' })).toHaveAttribute('href', '/trilha')
    expect(within(nav).getByRole('link', { name: 'Progresso' })).toHaveAttribute(
      'href',
      '/progresso',
    )
    expect(within(nav).getByRole('link', { name: 'Conta' })).toHaveAttribute('href', '/conta')
  })

  test('marca a aba em que o aluno está', async () => {
    at('/progresso')

    const nav = await screen.findByRole('navigation', { name: /navegação principal/i })
    expect(within(nav).getByRole('link', { name: 'Progresso' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Trilha' })).not.toHaveAttribute('aria-current')
  })

  test('está na conta também', async () => {
    at('/conta')

    expect(
      await screen.findByRole('navigation', { name: /navegação principal/i }),
    ).toBeInTheDocument()
  })
})

describe('as telas de escrever ficam sem navegação', () => {
  test('a cena é modo focado', async () => {
    at('/capitulos/chapter-1')

    await screen.findByRole('link', { name: /trilha/i })
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument()
  })

  test('o editor é modo focado', async () => {
    renderApp({
      api: createFakeApi({ me: aMe(), chapter: aChapter({ status: 'available' }) }),
      path: '/capitulos/chapter-1/escrever',
    })

    await screen.findByLabelText(/seu argumento/i)
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument()
  })

  test('a correção é modo focado', async () => {
    const submission = aSubmission({ verdict: 'failed_technical', chapter_status: 'drafting' })
    renderApp({
      api: createFakeApi({ me: aMe(), chapter: aChapter(), submission }),
      path: '/capitulos/chapter-1/correcao',
      state: { submission, body: 'um texto qualquer' },
    })

    await screen.findByRole('region', { name: /placar/i })
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument()
  })

  test('a consequência é modo focado', async () => {
    at('/capitulos/chapter-1/consequencia')

    await screen.findByRole('button', { name: /encarar tio marcos de novo/i })
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument()
  })

  test('o onboarding também, porque ainda não há trilha para navegar', async () => {
    renderApp({ api: createFakeApi({ me: aMe({ targets: [] }) }), path: '/onboarding' })

    await screen.findByRole('heading', { name: /quase lá/i })
    expect(
      screen.queryByRole('navigation', { name: /navegação principal/i }),
    ).not.toBeInTheDocument()
  })
})

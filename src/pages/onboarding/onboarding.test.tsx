import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createFakeApi } from '../../test/fakeApi'
import { aMe, aTarget } from '../../test/fixtures'
import { renderApp } from '../../test/render'

function onboarding(targets = aMe({ targets: [] })) {
  return renderApp({ api: createFakeApi({ me: targets }), path: '/onboarding' })
}

async function addTarget(user: ReturnType<typeof onboarding>['user'], exam: string, year: string) {
  await user.selectOptions(await screen.findByLabelText(/^vestibular$/i), exam)
  await user.selectOptions(screen.getByLabelText(/ano/i), year)
  await user.click(screen.getByRole('button', { name: /adicionar/i }))
}

describe('onboarding', () => {
  test('salva o apelido', async () => {
    const { user } = onboarding()

    const field = await screen.findByLabelText(/apelido/i)
    await user.clear(field)
    await user.type(field, 'Kauã')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/apelido salvo/i)
  })

  test('o primeiro vestibular vira a lente ativa', async () => {
    const { user } = onboarding()

    await addTarget(user, 'enem', '2027')

    const item = await screen.findByRole('listitem')
    expect(item).toHaveTextContent(/enem 2027/i)
    expect(within(item).getByText(/lente ativa/i)).toBeVisible()
  })

  test('dá para trocar a lente ativa entre os vestibulares', async () => {
    const { user } = onboarding()
    await addTarget(user, 'enem', '2027')
    await addTarget(user, 'fuvest', '2027')

    await user.click(screen.getByRole('button', { name: /usar a lente fuvest/i }))

    const items = await screen.findAllByRole('listitem')
    const fuvest = items.find((item) => item.textContent?.includes('FUVEST'))
    expect(within(fuvest as HTMLElement).getByText(/lente ativa/i)).toBeVisible()
  })

  test('dá para remover um vestibular da lista', async () => {
    const { user } = onboarding(aMe({ targets: [aTarget()] }))

    await user.click(await screen.findByRole('button', { name: /remover enem 2027/i }))

    expect(await screen.findByText(/nenhum vestibular escolhido ainda/i)).toBeVisible()
  })

  test('vestibular repetido mostra o recado da API', async () => {
    const { user } = onboarding(aMe({ targets: [aTarget()] }))

    await addTarget(user, 'enem', '2027')

    expect(await screen.findByRole('alert')).toHaveTextContent(/já está na sua lista/i)
  })

  test('só libera a trilha depois de escolher pelo menos um vestibular', async () => {
    const { user } = onboarding()

    expect(await screen.findByRole('button', { name: /começar a treinar/i })).toBeDisabled()

    await addTarget(user, 'enem', '2027')

    expect(screen.getByRole('button', { name: /começar a treinar/i })).toBeEnabled()
  })

  test('começar a treinar abre a trilha', async () => {
    const { user } = onboarding(aMe({ targets: [aTarget()] }))

    await user.click(await screen.findByRole('button', { name: /começar a treinar/i }))

    expect(await screen.findByRole('heading', { name: /sua trilha/i })).toBeVisible()
  })
})

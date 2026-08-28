import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { ApiError } from '../../api/ApiError'
import type { ArgumentaApi } from '../../api/client'
import type { MeResponse } from '../../api/types'
import { createFakeApi } from '../../test/fakeApi'
import { aMe, aTarget, aUser } from '../../test/fixtures'
import { renderApp } from '../../test/render'

function conta(me: MeResponse = aMe()) {
  return renderApp({ api: createFakeApi({ me }), path: '/conta' })
}

describe('Conta (a terceira aba)', () => {
  test('o apelido é editável e diz que salvou', async () => {
    const view = conta(aMe({ user: aUser({ nickname: 'Aluno' }) }))

    const field = await screen.findByLabelText('Apelido')
    await view.user.clear(field)
    await view.user.type(field, 'Kauã')
    await view.user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Apelido salvo.')).toBeVisible()
  })

  test('os vestibulares aparecem com a lente ativa marcada', async () => {
    conta(
      aMe({
        targets: [
          aTarget({ id: 'target-1', exam: 'enem', year: 2027, is_active: true }),
          aTarget({ id: 'target-2', exam: 'fuvest', year: 2027, is_active: false }),
        ],
      }),
    )

    const list = await screen.findByRole('list', { name: /seus vestibulares/i })
    const [first, second] = within(list).getAllByRole('listitem')
    expect(within(first).getByText('Lente ativa')).toBeVisible()
    expect(within(second).getByRole('button', { name: /usar a lente fuvest 2027/i })).toBeVisible()
  })

  test('trocar a lente ativa move a marca para o outro vestibular', async () => {
    const view = conta(
      aMe({
        targets: [
          aTarget({ id: 'target-1', exam: 'enem', year: 2027, is_active: true }),
          aTarget({ id: 'target-2', exam: 'fuvest', year: 2027, is_active: false }),
        ],
      }),
    )

    await view.user.click(
      await screen.findByRole('button', { name: /usar a lente fuvest 2027/i }),
    )

    const list = await screen.findByRole('list', { name: /seus vestibulares/i })
    const [first, second] = within(list).getAllByRole('listitem')
    expect(within(second).getByText('Lente ativa')).toBeVisible()
    expect(within(first).getByRole('button', { name: /usar a lente enem 2027/i })).toBeVisible()
  })
})

describe('remover vestibulares', () => {
  test('remover o último avisa o efeito antes de remover', async () => {
    const view = conta(aMe({ targets: [aTarget({ id: 'target-1' })] }))

    await view.user.click(await screen.findByRole('button', { name: /remover enem 2027/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/lente padrão/i)
    expect(screen.getByRole('list', { name: /seus vestibulares/i })).toBeVisible()
  })

  test('confirmado o aviso, o último vestibular sai', async () => {
    const view = conta(aMe({ targets: [aTarget({ id: 'target-1' })] }))

    await view.user.click(await screen.findByRole('button', { name: /remover enem 2027/i }))
    await view.user.click(screen.getByRole('button', { name: /remover mesmo assim/i }))

    expect(await screen.findByText(/nenhum vestibular escolhido ainda/i)).toBeVisible()
  })

  test('com mais de um, remover não pede confirmação', async () => {
    const view = conta(
      aMe({
        targets: [
          aTarget({ id: 'target-1', exam: 'enem', year: 2027, is_active: true }),
          aTarget({ id: 'target-2', exam: 'fuvest', year: 2027, is_active: false }),
        ],
      }),
    )

    await view.user.click(await screen.findByRole('button', { name: /remover fuvest 2027/i }))

    const list = await screen.findByRole('list', { name: /seus vestibulares/i })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
  })

  test('quem fica sem vestibular continua na conta, para escolher outro', async () => {
    const view = conta(aMe({ targets: [aTarget({ id: 'target-1' })] }))

    await view.user.click(await screen.findByRole('button', { name: /remover enem 2027/i }))
    await view.user.click(screen.getByRole('button', { name: /remover mesmo assim/i }))

    await screen.findByText(/nenhum vestibular escolhido ainda/i)
    expect(view.path()).toBe('/conta')
  })
})

describe('sair e excluir', () => {
  test('sair da conta limpa a sessão e volta para a Entrada', async () => {
    const view = conta()

    await view.user.click(await screen.findByRole('button', { name: /sair da conta/i }))

    expect(await screen.findByRole('heading', { name: /argumenta/i })).toBeVisible()
    expect(view.path()).toBe('/entrar')
  })

  test('excluir pede confirmação explícita e diz o que acontece na carência', async () => {
    const view = conta()

    await view.user.click(await screen.findByRole('button', { name: /excluir minha conta/i }))

    const warning = await screen.findByRole('alert')
    expect(warning).toHaveTextContent(/7 dias/i)
    expect(screen.getByRole('link', { name: /privacidade/i })).toHaveAttribute(
      'href',
      '/privacidade',
    )
    expect(screen.getByRole('button', { name: /excluir para sempre/i })).toBeVisible()
  })

  test('desistir da exclusão não apaga nada', async () => {
    const view = conta()

    await view.user.click(await screen.findByRole('button', { name: /excluir minha conta/i }))
    await view.user.click(screen.getByRole('button', { name: /manter minha conta/i }))

    expect(screen.queryByRole('button', { name: /excluir para sempre/i })).not.toBeInTheDocument()
    expect(view.path()).toBe('/conta')
  })

  test('confirmada, a exclusão encerra a sessão', async () => {
    const view = conta()

    await view.user.click(await screen.findByRole('button', { name: /excluir minha conta/i }))
    await view.user.click(screen.getByRole('button', { name: /excluir para sempre/i }))

    expect(await screen.findByRole('heading', { name: /argumenta/i })).toBeVisible()
    expect(view.path()).toBe('/entrar')
  })

  test('se a exclusão falhar, a conta continua de pé e o erro aparece', async () => {
    const api: ArgumentaApi = {
      ...createFakeApi({ me: aMe() }),
      deleteAccount: () => Promise.reject(new ApiError(500, 'Boom')),
    }
    const view = renderApp({ api, path: '/conta' })

    await view.user.click(await screen.findByRole('button', { name: /excluir minha conta/i }))
    await view.user.click(screen.getByRole('button', { name: /excluir para sempre/i }))

    // o aviso da carência continua de pé ao lado do erro, então mira no texto
    expect(await screen.findByText(/algo deu errado/i)).toBeVisible()
    expect(screen.getByRole('button', { name: /excluir para sempre/i })).toBeVisible()
    expect(view.path()).toBe('/conta')
  })
})

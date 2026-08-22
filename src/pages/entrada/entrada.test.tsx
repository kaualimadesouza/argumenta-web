import { screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { createFakeApi } from '../../test/fakeApi'
import { A_PASSWORD, aMe, aUser } from '../../test/fixtures'
import { renderApp } from '../../test/render'

afterEach(() => {
  vi.unstubAllEnvs()
  sessionStorage.clear()
})

describe('Entrada (mockup tela 01)', () => {
  test('mostra a marca, a promessa e os dois caminhos de entrada', async () => {
    renderApp({ api: createFakeApi(), path: '/entrar' })

    expect(await screen.findByRole('heading', { level: 1, name: 'Argumenta' })).toBeVisible()
    expect(
      screen.getByText('Vença a discussão dentro da história. Passe no vestibular fora dela.'),
    ).toBeVisible()
    expect(screen.getByRole('link', { name: /criar conta com e-mail/i })).toBeVisible()
    expect(screen.getByText(/só pedimos e-mail, apelido e o ano do seu vestibular/i)).toBeVisible()
  })

  test('o botão do Google leva ao consentimento com client id, redirect e state', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'client-123')
    renderApp({ api: createFakeApi(), path: '/entrar' })

    const link = await screen.findByRole('link', { name: /entrar com google/i })
    const url = new URL(link.getAttribute('href') ?? '')

    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth')
    expect(url.searchParams.get('client_id')).toBe('client-123')
    expect(url.searchParams.get('redirect_uri')).toMatch(/\/entrar\/google$/)
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('state')).toBeTruthy()
  })

  test('sem client id configurado o Google fica desabilitado e explica', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '')
    renderApp({ api: createFakeApi(), path: '/entrar' })

    expect(await screen.findByRole('button', { name: /entrar com google/i })).toBeDisabled()
    expect(screen.getByText(/ainda não está configurado/i)).toBeVisible()
  })
})

describe('cadastro por e-mail', () => {
  test('cria a conta e cai no onboarding, que é o que falta preencher', async () => {
    const { user } = renderApp({ api: createFakeApi(), path: '/criar-conta' })

    await user.type(await screen.findByLabelText(/apelido/i), 'Bete')
    await user.type(screen.getByLabelText(/e-mail/i), 'bete@example.com')
    await user.type(screen.getByLabelText(/senha/i), A_PASSWORD)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    expect(await screen.findByRole('heading', { name: /seus vestibulares/i })).toBeVisible()
  })

  test('sem aceitar os termos não dá para enviar', async () => {
    const { user } = renderApp({ api: createFakeApi(), path: '/criar-conta' })

    await user.type(await screen.findByLabelText(/apelido/i), 'Bete')
    await user.type(screen.getByLabelText(/e-mail/i), 'bete@example.com')
    await user.type(screen.getByLabelText(/senha/i), A_PASSWORD)

    expect(screen.getByRole('button', { name: /criar conta/i })).toBeDisabled()
  })

  test('linka a política e os termos ao lado do aceite', async () => {
    renderApp({ api: createFakeApi(), path: '/criar-conta' })

    expect(await screen.findByRole('link', { name: /política de privacidade/i })).toHaveAttribute(
      'href',
      '/privacidade',
    )
    expect(screen.getByRole('link', { name: /termos de uso/i })).toHaveAttribute('href', '/termos')
  })

  test('e-mail já cadastrado mostra o recado da API', async () => {
    const api = createFakeApi({ account: aMe({ user: aUser({ email: 'bete@example.com' }) }) })
    const { user } = renderApp({ api, path: '/criar-conta' })

    await user.type(await screen.findByLabelText(/apelido/i), 'Bete')
    await user.type(screen.getByLabelText(/e-mail/i), 'bete@example.com')
    await user.type(screen.getByLabelText(/senha/i), A_PASSWORD)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /criar conta/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/esse e-mail já tem uma conta/i)
  })
})

describe('login por e-mail', () => {
  test('entra e vai para a trilha', async () => {
    const api = createFakeApi({ account: aMe() })
    const { user } = renderApp({ api, path: '/entrar/email' })

    await user.type(await screen.findByLabelText(/e-mail/i), 'aluno@example.com')
    await user.type(screen.getByLabelText(/senha/i), A_PASSWORD)
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByRole('heading', { name: /sua trilha/i })).toBeVisible()
  })

  test('senha errada não entra e diz o porquê', async () => {
    const api = createFakeApi({ account: aMe() })
    const { user } = renderApp({ api, path: '/entrar/email' })

    await user.type(await screen.findByLabelText(/e-mail/i), 'aluno@example.com')
    await user.type(screen.getByLabelText(/senha/i), 'chute-errado')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/não conferem/i)
  })
})

describe('volta do Google', () => {
  test('troca o código pela sessão quando o state confere', async () => {
    sessionStorage.setItem('argumenta.google.state', 'st-1')
    renderApp({ api: createFakeApi(), path: '/entrar/google?code=abc&state=st-1' })

    expect(await screen.findByRole('heading', { name: /seus vestibulares/i })).toBeVisible()
  })

  test('state divergente é recusado sem chamar a API', async () => {
    sessionStorage.setItem('argumenta.google.state', 'st-1')
    const api = createFakeApi()
    const spy = vi.spyOn(api, 'loginWithGoogle')
    renderApp({ api, path: '/entrar/google?code=abc&state=outro' })

    expect(await screen.findByRole('alert')).toHaveTextContent(/não conseguimos confirmar/i)
    expect(spy).not.toHaveBeenCalled()
  })

  test('falha do Google explica e oferece voltar para a Entrada', async () => {
    sessionStorage.setItem('argumenta.google.state', 'st-1')
    renderApp({ api: createFakeApi(), path: '/entrar/google?code=&state=st-1' })

    expect(await screen.findByRole('alert')).toHaveTextContent(/login com o google não completou/i)
    expect(screen.getByRole('link', { name: /voltar para a entrada/i })).toBeVisible()
  })
})

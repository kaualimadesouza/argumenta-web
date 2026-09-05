import { screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { createFakeApi } from '../../test/fakeApi'
import { renderApp } from '../../test/render'

describe('Landing (raiz sem sessão)', () => {
  test('mostra a promessa, a ação primária e o caminho de quem já tem conta', async () => {
    renderApp({ api: createFakeApi(), path: '/' })

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Vença a discussão dentro da história. Passe no vestibular fora dela.',
      }),
    ).toBeVisible()
    const start = screen.getAllByRole('link', { name: 'Começar grátis' })
    expect(start.length).toBeGreaterThan(0)
    for (const link of start) expect(link).toHaveAttribute('href', '/entrar')
    expect(screen.getByRole('link', { name: 'Já tenho conta' })).toHaveAttribute('href', '/entrar/email')
    expect(screen.getByText(/só pedimos e-mail, apelido e o ano do seu vestibular/i)).toBeVisible()
  })

  test('apresenta os capítulos reais das três histórias e o loop em quatro passos', async () => {
    renderApp({ api: createFakeApi(), path: '/' })

    const stories = await screen.findByRole('region', { name: /cada capítulo é uma discussão/i })
    expect(stories).toHaveAttribute('id', 'historias')
    for (const title of ['A porta da diretoria', 'O almoço de domingo', 'A banca da FUVEST']) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    }

    const how = screen.getByRole('region', { name: /como funciona/i })
    expect(how).toHaveAttribute('id', 'como-funciona')
    for (const step of ['Entre na cena', 'Escreva o argumento', 'Receba a correção na hora', 'A história responde']) {
      expect(screen.getByRole('heading', { level: 3, name: step })).toBeVisible()
    }
    const nav = screen.getByRole('navigation', { name: /navegação da página/i })
    expect(within(nav).getByRole('link', { name: 'Histórias' })).toHaveAttribute('href', '#historias')
  })

  test('explica os cinco critérios e os planos, com os pagos ainda por vir', async () => {
    renderApp({ api: createFakeApi(), path: '/' })

    const grading = await screen.findByRole('region', { name: /corrigido com a régua da banca/i })
    for (const dimension of ['Norma culta', 'Coesão', 'Coerência', 'Repertório sociocultural', 'Persuasão situada']) {
      expect(within(grading).getByRole('heading', { level: 3, name: dimension })).toBeVisible()
    }

    const plans = screen.getByRole('region', { name: /comece de graça/i })
    expect(plans).toHaveAttribute('id', 'planos')
    for (const plan of ['Grátis', 'Vestibulando', 'PRO']) {
      expect(within(plans).getByRole('heading', { level: 3, name: plan })).toBeVisible()
    }
    expect(within(plans).getByText('R$ 0')).toBeVisible()
    expect(within(plans).getAllByText('Em breve')).toHaveLength(2)
    expect(within(plans).getByRole('link', { name: 'Começar grátis' })).toHaveAttribute('href', '/entrar')
    expect(within(plans).queryByRole('link', { name: /assinar/i })).not.toBeInTheDocument()
  })

  test('responde as três perguntas e fecha com a chamada e o rodapé legal', async () => {
    renderApp({ api: createFakeApi(), path: '/' })

    const faq = await screen.findByRole('region', { name: /as três perguntas que todo mundo faz/i })
    expect(faq).toHaveAttribute('id', 'perguntas')
    expect(within(faq).getAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(within(faq).getByText(/não para prever a banca/i)).toBeVisible()

    expect(screen.getByRole('heading', { level: 2, name: /pare de treinar no vazio/i })).toBeVisible()

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute('href', '/privacidade')
    expect(within(footer).getByRole('link', { name: 'Termos de uso' })).toHaveAttribute('href', '/termos')
    expect(within(footer).getByRole('link', { name: 'Planos' })).toHaveAttribute('href', '#planos')
    expect(within(footer).getByText(/© 2026 Argumenta/)).toBeVisible()
  })
})

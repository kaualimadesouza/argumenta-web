import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'

import App from '../../App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('política de privacidade', () => {
  test('abre sem sessão e nomeia o que é coletado', () => {
    renderAt('/privacidade')

    expect(screen.getByRole('heading', { level: 1, name: /política de privacidade/i })).toBeVisible()
    expect(screen.getByRole('heading', { name: /dados que coletamos/i })).toBeVisible()
    expect(screen.getByText(/apelido/i, { selector: 'li' })).toBeVisible()
    expect(screen.getByText(/vestibulares alvo/i, { selector: 'li' })).toBeVisible()
  })

  test('explica a telemetria de escrita e que ela não muda a nota', () => {
    renderAt('/privacidade')

    const section = screen.getByRole('heading', { name: /telemetria de escrita/i })
    expect(section).toBeVisible()
    expect(screen.getByText(/nunca altera a sua nota/i, { selector: 'p' })).toBeVisible()
  })

  test('explica a exclusão da conta e a carência antes do expurgo', () => {
    renderAt('/privacidade')

    expect(screen.getByRole('heading', { name: /exclusão/i })).toBeVisible()
    expect(screen.getByText(/7 dias/, { selector: 'p' })).toBeVisible()
  })

  test('fala com quem tem menos de 18 anos em linguagem direta', () => {
    renderAt('/privacidade')

    expect(screen.getByRole('heading', { name: /menos de 18/i })).toBeVisible()
  })

  test('avisa em voz alta enquanto o controlador não está definido', () => {
    renderAt('/privacidade')

    expect(screen.getByRole('heading', { name: /quem responde/i })).toBeVisible()
    expect(screen.getByText(/pendente de revisão jurídica/i, { selector: 'p' })).toBeVisible()
  })
})

describe('termos de uso', () => {
  test('abre sem sessão e diz para que serve o produto', () => {
    renderAt('/termos')

    expect(screen.getByRole('heading', { level: 1, name: /termos de uso/i })).toBeVisible()
    expect(screen.getByRole('heading', { name: /o que o argumenta faz/i })).toBeVisible()
  })

  test('deixa claro que a nota é treino e não vale como nota oficial', () => {
    renderAt('/termos')

    expect(screen.getByText(/não é nota oficial/i, { selector: 'p' })).toBeVisible()
  })
})

describe('navegação entre os dois documentos', () => {
  test('a privacidade aponta para os termos', () => {
    renderAt('/privacidade')

    expect(screen.getByRole('link', { name: /termos de uso/i })).toHaveAttribute('href', '/termos')
  })

  test('os termos apontam para a privacidade', () => {
    renderAt('/termos')

    expect(screen.getByRole('link', { name: /política de privacidade/i })).toHaveAttribute(
      'href',
      '/privacidade',
    )
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'

import App from './App'

test('home renders the brand and the call to action', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: 'Argumenta' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Começar a treinar' })).toBeInTheDocument()
})

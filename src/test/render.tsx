import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, parsePath } from 'react-router-dom'

import type { ArgumentaApi } from '../api/client'
import App from '../App'
import { AppProviders } from '../app/AppProviders'
import { LocationProbe } from './LocationProbe'

interface RenderAppOptions {
  api: ArgumentaApi
  path?: string
  /** Router state the screen was pushed with, for screens the flow hands data to. */
  state?: unknown
}

export function renderApp({ api, path = '/', state }: RenderAppOptions) {
  const user = userEvent.setup()
  const here = { path }
  // parsePath keeps the query string: an object entry would take `path` whole
  const view = render(
    <MemoryRouter initialEntries={[{ ...parsePath(path), state }]}>
      <LocationProbe into={here} />
      <AppProviders api={api}>
        <App />
      </AppProviders>
    </MemoryRouter>,
  )
  return { ...view, user, path: () => here.path }
}

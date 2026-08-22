import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import type { ArgumentaApi } from '../api/client'
import App from '../App'
import { AppProviders } from '../app/AppProviders'
import { LocationProbe } from './LocationProbe'

interface RenderAppOptions {
  api: ArgumentaApi
  path?: string
}

export function renderApp({ api, path = '/' }: RenderAppOptions) {
  const user = userEvent.setup()
  const here = { path }
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe into={here} />
      <AppProviders api={api}>
        <App />
      </AppProviders>
    </MemoryRouter>,
  )
  return { ...view, user, path: () => here.path }
}

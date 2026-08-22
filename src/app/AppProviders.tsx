import type { ReactNode } from 'react'

import type { ArgumentaApi } from '../api/client'
import { ApiContext } from '../api/context'
import { SessionProvider } from '../session/SessionProvider'

interface AppProvidersProps {
  api: ArgumentaApi
  children: ReactNode
}

export function AppProviders({ api, children }: AppProvidersProps) {
  return (
    <ApiContext.Provider value={api}>
      <SessionProvider>{children}</SessionProvider>
    </ApiContext.Provider>
  )
}

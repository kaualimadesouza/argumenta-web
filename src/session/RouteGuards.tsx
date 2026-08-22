import { Navigate, Outlet } from 'react-router-dom'

import { LoadingPanel, UnavailablePanel } from './StatusPanels'
import { useSession } from './context'

/** Everything under this route needs a live session. */
export function RequireSession() {
  const { session, reload } = useSession()
  if (session.status === 'loading') return <LoadingPanel />
  if (session.status === 'unavailable') return <UnavailablePanel onRetry={() => void reload()} />
  if (session.status === 'anonymous') return <Navigate to="/entrar" replace />
  return <Outlet />
}

/** The game needs a lens: no exam target means the onboarding is unfinished. */
export function RequireTargets() {
  const { session } = useSession()
  if (session.status === 'authenticated' && session.targets.length === 0) {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}

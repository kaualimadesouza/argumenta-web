import { Navigate, Outlet } from 'react-router-dom'

import { LoadingPanel, RetryPanel } from '../components/StatusPanels'
import { useSession } from './context'

const SESSION_UNREACHABLE =
  'Não conseguimos falar com o Argumenta. Sua sessão continua de pé: verifique a internet e tente de novo.'

/** Everything under this route needs a live session. */
export function RequireSession() {
  const { session, reload } = useSession()
  if (session.status === 'loading') return <LoadingPanel />
  if (session.status === 'unavailable') {
    return <RetryPanel message={SESSION_UNREACHABLE} onRetry={() => void reload()} />
  }
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

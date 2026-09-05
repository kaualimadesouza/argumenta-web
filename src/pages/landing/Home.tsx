import { Navigate } from 'react-router-dom'

import { useSession } from '../../session/context'
import { Landing } from './Landing'

/** The root: a visitor reads the landing, a student is sent on to the game.
 *  The landing renders while the session is still loading, so a first visit
 *  never waits on a 401 to see the page. */
export function Home() {
  const { session } = useSession()
  if (session.status === 'authenticated') return <Navigate to="/trilha" replace />
  return <Landing />
}

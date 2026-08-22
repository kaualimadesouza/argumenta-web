import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { messageFor } from '../api/messages'
import { useSession } from './context'

interface SignIn {
  signIn: (perform: () => Promise<unknown>) => Promise<void>
  error: string | null
  busy: boolean
}

/** Every way into the app is the same three steps: call the endpoint that sets
 *  the cookies, read /me, then let the route guards decide where the student
 *  belongs (trilha, or onboarding when there is no lens yet). */
export function useSignIn(): SignIn {
  const { reload } = useSession()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const signIn = useCallback(
    async (perform: () => Promise<unknown>) => {
      setBusy(true)
      setError(null)
      try {
        await perform()
        await reload()
        navigate('/', { replace: true })
      } catch (failure) {
        setError(messageFor(failure))
        setBusy(false)
      }
    },
    [navigate, reload],
  )

  return { signIn, error, busy }
}

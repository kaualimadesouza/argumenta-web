import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { ApiError } from '../api/ApiError'
import { useApi } from '../api/context'
import { type Session, SessionContext } from './context'

export function SessionProvider({ children }: { children: ReactNode }) {
  const api = useApi()
  const [session, setSession] = useState<Session>({ status: 'loading' })

  const reload = useCallback(async () => {
    try {
      const me = await api.me()
      setSession({ status: 'authenticated', user: me.user, targets: me.targets })
    } catch (error) {
      const expired = error instanceof ApiError && error.status === 401
      setSession({ status: expired ? 'anonymous' : 'unavailable' })
    }
  }, [api])

  const signOut = useCallback(async () => {
    await api.logout()
    setSession({ status: 'anonymous' })
  }, [api])

  useEffect(() => {
    void reload()
  }, [reload])

  const store = useMemo(() => ({ session, reload, signOut }), [session, reload, signOut])
  return <SessionContext.Provider value={store}>{children}</SessionContext.Provider>
}

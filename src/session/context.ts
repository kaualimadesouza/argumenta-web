import { createContext, useContext } from 'react'

import type { Exam, TargetResponse, UserResponse } from '../api/types'

/** `unavailable` is not `anonymous`: a network glitch must never log a student
 *  out, and the two need different screens. */
export type Session =
  | { status: 'loading' }
  | { status: 'anonymous' }
  | { status: 'unavailable' }
  | { status: 'authenticated'; user: UserResponse; targets: TargetResponse[] }

export interface SessionStore {
  session: Session
  reload: () => Promise<void>
  signOut: () => Promise<void>
}

export const SessionContext = createContext<SessionStore | null>(null)

export function useSession(): SessionStore {
  const store = useContext(SessionContext)
  if (store === null) throw new Error('useSession used outside of AppProviders')
  return store
}

export interface AuthenticatedSession {
  user: UserResponse
  targets: TargetResponse[]
}

/** For screens behind RequireSession: the guard already proved there is a
 *  student, so an unauthenticated read here is a routing bug, not a state. */
export function useStudent(): AuthenticatedSession {
  const { session } = useSession()
  if (session.status !== 'authenticated') {
    throw new Error('useStudent used outside of RequireSession')
  }
  return session
}

/** The lens the student's correction is measured in. Mirrors the API, which
 *  falls back to the same default when no target is active. */
export function useLens(): Exam {
  const { targets } = useStudent()
  return targets.find((target) => target.is_active)?.exam ?? 'enem'
}

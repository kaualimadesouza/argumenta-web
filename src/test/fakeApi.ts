import { ApiError } from '../api/ApiError'
import type { ArgumentaApi } from '../api/client'
import type { MeResponse, TargetResponse, TrackResponse, UserResponse } from '../api/types'
import { A_PASSWORD, aTrack, aUser } from './fixtures'

interface Account {
  user: UserResponse
  password: string
  targets: TargetResponse[]
}

interface FakeApiSeed {
  /** Already signed in, as if the cookie were there. */
  me?: MeResponse
  /** What GET /track answers; defaults to the fixture track. */
  track?: TrackResponse
  /** Registered but signed out, so a login test has someone to log in as. */
  account?: MeResponse
  password?: string
}

/** In-memory stand-in for argumenta-api: it enforces the rules the screens
 *  actually depend on (first target becomes the active lens, a duplicate target
 *  conflicts, /me is 401 without a session), so page tests never assert against
 *  a contract the backend does not have. */
export function createFakeApi(seed: FakeApiSeed = {}): ArgumentaApi {
  const start = seed.me ?? seed.account
  const accounts = new Map<string, Account>()
  if (start) {
    accounts.set(start.user.email, {
      user: start.user,
      password: seed.password ?? A_PASSWORD,
      targets: [...start.targets],
    })
  }
  let signedIn: string | null = seed.me ? seed.me.user.email : null
  let sequence = 0

  function nextId(prefix: string): string {
    sequence += 1
    return `${prefix}-${sequence}`
  }

  function session(): Account {
    const account = signedIn === null ? undefined : accounts.get(signedIn)
    if (!account) throw new ApiError(401, 'not authenticated')
    return account
  }

  function targetOf(account: Account, targetId: string): TargetResponse {
    const target = account.targets.find((candidate) => candidate.id === targetId)
    if (!target) throw new ApiError(404, 'ExamTargetNotFoundError')
    return target
  }

  return {
    register: (body) => {
      if (accounts.has(body.email)) {
        return Promise.reject(new ApiError(409, 'EmailAlreadyRegisteredError'))
      }
      if (!body.accepted_terms) return Promise.reject(new ApiError(422, 'TermsNotAcceptedError'))
      const user = aUser({ id: nextId('user'), email: body.email, nickname: body.nickname })
      accounts.set(body.email, { user, password: body.password, targets: [] })
      signedIn = body.email
      return Promise.resolve(user)
    },

    login: (body) => {
      const account = accounts.get(body.email)
      if (!account || account.password !== body.password) {
        return Promise.reject(new ApiError(401, 'InvalidCredentialsError'))
      }
      signedIn = body.email
      return Promise.resolve(account.user)
    },

    loginWithGoogle: (body) => {
      if (body.code === '') return Promise.reject(new ApiError(502, 'GoogleSignInFailedError'))
      const email = 'google@example.com'
      let account = accounts.get(email)
      if (!account) {
        account = { user: aUser({ id: nextId('user'), email, nickname: 'google' }), password: '', targets: [] }
        accounts.set(email, account)
      }
      signedIn = email
      return Promise.resolve(account.user)
    },

    logout: () => {
      signedIn = null
      return Promise.resolve()
    },

    me: () => {
      const account = session()
      return Promise.resolve({ user: account.user, targets: [...account.targets] })
    },

    updateNickname: (body) => {
      const account = session()
      account.user = { ...account.user, nickname: body.nickname }
      return Promise.resolve(account.user)
    },

    addTarget: (body) => {
      const account = session()
      const clash = account.targets.some(
        (target) => target.exam === body.exam && target.year === body.year,
      )
      if (clash) return Promise.reject(new ApiError(409, 'ExamTargetAlreadyExistsError'))
      const target: TargetResponse = {
        id: nextId('target'),
        exam: body.exam,
        year: body.year,
        is_active: account.targets.length === 0,
      }
      account.targets.push(target)
      return Promise.resolve(target)
    },

    removeTarget: (targetId) => {
      const account = session()
      targetOf(account, targetId)
      account.targets = account.targets.filter((target) => target.id !== targetId)
      return Promise.resolve()
    },

    track: () => {
      session()
      return Promise.resolve(seed.track ?? aTrack())
    },

    activateTarget: (targetId) => {
      const account = session()
      targetOf(account, targetId)
      account.targets = account.targets.map((target) => ({
        ...target,
        is_active: target.id === targetId,
      }))
      return Promise.resolve()
    },
  }
}

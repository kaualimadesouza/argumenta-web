import { ApiError } from '../api/ApiError'
import type { ArgumentaApi } from '../api/client'
import type {
  ChapterResponse,
  MeResponse,
  SubmissionResponse,
  TargetResponse,
  TelemetryEvent,
  TrackResponse,
  UserResponse,
} from '../api/types'
import { countWords } from '../api/words'
import { A_PASSWORD, aChapter, aSubmission, aTrack, aUser } from './fixtures'

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
  /** What GET /chapters/{id} answers; defaults to the fixture chapter. */
  chapter?: ChapterResponse
  /** What POST /chapters/{id}/submissions answers; defaults to an approval. */
  submission?: SubmissionResponse
  /** Registered but signed out, so a login test has someone to log in as. */
  account?: MeResponse
  password?: string
}

export interface FakeApi extends ArgumentaApi {
  /** What the client actually reported, so a test can assert the collection
   *  without reaching into fetch. */
  readonly telemetry: TelemetryEvent[]
}


/** In-memory stand-in for argumenta-api: it enforces the rules the screens
 *  actually depend on (first target becomes the active lens, a duplicate target
 *  conflicts, /me is 401 without a session), so page tests never assert against
 *  a contract the backend does not have. */
export function createFakeApi(seed: FakeApiSeed = {}): FakeApi {
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
  let track = seed.track ?? aTrack()
  let chapter = seed.chapter ?? aChapter()
  const telemetry: TelemetryEvent[] = []

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

  function openChapter(chapterId: string): ChapterResponse {
    session()
    if (chapter.id !== chapterId) throw new ApiError(404, 'ChapterNotFoundError')
    return chapter
  }

  return {
    telemetry,

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
      return Promise.resolve({ ...track })
    },

    chapter: (chapterId) => {
      try {
        return Promise.resolve({ ...openChapter(chapterId) })
      } catch (error) {
        return Promise.reject(error)
      }
    },

    saveDraft: (chapterId, body) => {
      try {
        chapter = { ...openChapter(chapterId), draft_body: body.body, status: 'drafting' }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },

    submit: (chapterId, body) => {
      let open: ChapterResponse
      try {
        open = openChapter(chapterId)
      } catch (error) {
        return Promise.reject(error)
      }
      const words = countWords(body.body)
      if (words < open.min_words || words > open.max_words) {
        return Promise.reject(new ApiError(422, 'WordCountOutOfRangeError'))
      }
      if (track.submissions_today >= track.daily_limit) {
        return Promise.reject(new ApiError(429, 'DailyLimitReachedError'))
      }
      track = { ...track, submissions_today: track.submissions_today + 1 }
      const answer = seed.submission ?? aSubmission()
      chapter = { ...open, draft_body: body.body, status: answer.chapter_status }
      return Promise.resolve(answer)
    },

    recordTelemetry: (batch) => {
      session()
      telemetry.push(...batch.events)
      return Promise.resolve({ recorded: batch.events.length, dropped: 0 })
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

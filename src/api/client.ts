import { apiErrorFrom } from './ApiError'
import type {
  AccountDeletionResponse,
  AddTargetRequest,
  ChapterResponse,
  DraftRequest,
  GoogleLoginRequest,
  LoginRequest,
  MeResponse,
  PendingSubmissionResponse,
  ProgressResponse,
  ReactionResponse,
  RegisterRequest,
  SubmissionRequest,
  SubmissionStateResponse,
  TargetResponse,
  TelemetryBatchRequest,
  TelemetryBatchResponse,
  TrackResponse,
  UpdateMeRequest,
  UserResponse,
} from './types'

/** Same-origin only, and that is a constraint, not a default: the API scopes the
 *  refresh cookie to /auth, so the browser only sends it when the API answers
 *  under this origin (vite proxy in dev, nginx in prod). */
const CREDENTIALS: RequestCredentials = 'same-origin'
const REFRESH_PATH = '/auth/refresh'
const NO_CONTENT = 204

/** Auth endpoints answer 401 as a verdict, not as an expired token. */
const OWNS_ITS_401 = /^\/auth\//

export interface ArgumentaApi {
  register(body: RegisterRequest): Promise<UserResponse>
  login(body: LoginRequest): Promise<UserResponse>
  loginWithGoogle(body: GoogleLoginRequest): Promise<UserResponse>
  logout(): Promise<void>
  me(): Promise<MeResponse>
  deleteAccount(): Promise<AccountDeletionResponse>
  updateNickname(body: UpdateMeRequest): Promise<UserResponse>
  addTarget(body: AddTargetRequest): Promise<TargetResponse>
  removeTarget(targetId: string): Promise<void>
  activateTarget(targetId: string): Promise<void>
  track(): Promise<TrackResponse>
  progress(): Promise<ProgressResponse>
  chapter(chapterId: string): Promise<ChapterResponse>
  /** in_consequence -> in_recovery, idempotent, answering with the recovery script. */
  startRecovery(chapterId: string): Promise<ChapterResponse>
  /** null when the verdict earns corrections instead of drama (204). */
  reaction(submissionId: string): Promise<ReactionResponse | null>
  saveDraft(chapterId: string, body: DraftRequest): Promise<void>
  /** 202: the correction runs out of band, poll `submission` for the verdict. */
  submit(chapterId: string, body: SubmissionRequest): Promise<PendingSubmissionResponse>
  submission(submissionId: string): Promise<SubmissionStateResponse>
  recordTelemetry(batch: TelemetryBatchRequest): Promise<TelemetryBatchResponse>
}

async function send(path: string, init: RequestInit): Promise<Response> {
  const response = await fetch(path, { ...init, credentials: CREDENTIALS })
  if (response.status !== 401 || OWNS_ITS_401.test(path)) return response

  const renewed = await fetch(REFRESH_PATH, { method: 'POST', credentials: CREDENTIALS })
  if (!renewed.ok) return response
  return fetch(path, { ...init, credentials: CREDENTIALS })
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await send(path, {
    method,
    ...(body === undefined
      ? {}
      : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  })
  if (response.status === NO_CONTENT) return undefined as T
  const payload: unknown = await response.json()
  if (!response.ok) throw apiErrorFrom(response.status, payload)
  return payload as T
}

export function createHttpApi(): ArgumentaApi {
  return {
    register: (body) => request('/auth/register', 'POST', body),
    login: (body) => request('/auth/login', 'POST', body),
    loginWithGoogle: (body) => request('/auth/google', 'POST', body),
    logout: () => request('/auth/logout', 'POST'),
    me: () => request('/me', 'GET'),
    deleteAccount: () => request('/me', 'DELETE'),
    updateNickname: (body) => request('/me', 'PATCH', body),
    addTarget: (body) => request('/me/targets', 'POST', body),
    removeTarget: (targetId) => request(`/me/targets/${targetId}`, 'DELETE'),
    activateTarget: (targetId) => request(`/me/targets/${targetId}/activate`, 'PUT'),
    track: () => request('/track', 'GET'),
    progress: () => request('/progress', 'GET'),
    chapter: (chapterId) => request(`/chapters/${chapterId}`, 'GET'),
    startRecovery: (chapterId) => request(`/chapters/${chapterId}/recovery`, 'POST'),
    reaction: async (submissionId) =>
      (await request<ReactionResponse | null>(
        `/submissions/${submissionId}/reaction`,
        'POST',
      )) ?? null,
    saveDraft: (chapterId, body) => request(`/chapters/${chapterId}/draft`, 'PUT', body),
    submit: (chapterId, body) => request(`/chapters/${chapterId}/submissions`, 'POST', body),
    submission: (submissionId) => request(`/submissions/${submissionId}`, 'GET'),
    recordTelemetry: (batch) => request('/telemetry/events', 'POST', batch),
  }
}

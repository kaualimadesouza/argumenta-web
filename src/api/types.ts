/** Mirrors of the argumenta-api pydantic responses, field for field: the wire
 *  shape is the type, so there is no mapping layer to drift. */

export type Exam = 'enem' | 'fuvest'

export interface UserResponse {
  id: string
  email: string
  nickname: string
  terms_accepted_at: string | null
}

export interface TargetResponse {
  id: string
  exam: Exam
  year: number
  is_active: boolean
}

export interface MeResponse {
  user: UserResponse
  targets: TargetResponse[]
}

export interface RegisterRequest {
  email: string
  nickname: string
  password: string
  accepted_terms: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleLoginRequest {
  code: string
  redirect_uri: string
}

export interface UpdateMeRequest {
  nickname: string
}

export interface AddTargetRequest {
  exam: Exam
  year: number
}

export type StoryState = 'locked' | 'available' | 'in_progress' | 'completed'

export type ChapterStatus =
  | 'locked'
  | 'available'
  | 'drafting'
  | 'in_consequence'
  | 'in_recovery'
  | 'passed'

export interface ChapterCursorResponse {
  id: string
  /** 1-based place in the story, which is what the screen counts. */
  order: number
  status: ChapterStatus
}

export interface TrackStoryResponse {
  id: string
  slug: string
  title: string
  synopsis: string
  position: number
  is_tutorial: boolean
  cover_asset: string | null
  state: StoryState
  chapters_passed: number
  chapters_total: number
  current_chapter: ChapterCursorResponse | null
}

/** The three habit numbers both /track and /progress carry. */
export interface HabitSummary {
  streak_days: number
  submissions_today: number
  daily_limit: number
}

export interface TrackResponse extends HabitSummary {
  stories: TrackStoryResponse[]
}

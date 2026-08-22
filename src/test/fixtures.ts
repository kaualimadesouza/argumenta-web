import type {
  Exam,
  MeResponse,
  TargetResponse,
  TrackResponse,
  TrackStoryResponse,
  UserResponse,
} from '../api/types'

export const A_PASSWORD = 'correct-horse-9'

export function aUser(overrides: Partial<UserResponse> = {}): UserResponse {
  return {
    id: 'user-1',
    email: 'aluno@example.com',
    nickname: 'Aluno',
    terms_accepted_at: '2026-08-01T12:00:00Z',
    ...overrides,
  }
}

export function aTarget(overrides: Partial<TargetResponse> = {}): TargetResponse {
  return { id: 'target-1', exam: 'enem' as Exam, year: 2027, is_active: true, ...overrides }
}

export function aMe(overrides: Partial<MeResponse> = {}): MeResponse {
  return { user: aUser(), targets: [aTarget()], ...overrides }
}

export function aTrackStory(overrides: Partial<TrackStoryResponse> = {}): TrackStoryResponse {
  return {
    id: 'story-1',
    slug: 'o-gremio',
    title: 'O Grêmio',
    synopsis: 'A primeira discussão que você precisa ganhar.',
    position: 1,
    is_tutorial: true,
    cover_asset: null,
    state: 'available',
    chapters_passed: 0,
    chapters_total: 3,
    current_chapter: { id: 'chapter-1', order: 1, status: 'available' },
    ...overrides,
  }
}

export function aTrack(overrides: Partial<TrackResponse> = {}): TrackResponse {
  return {
    stories: [aTrackStory()],
    streak_days: 7,
    submissions_today: 2,
    daily_limit: 3,
    ...overrides,
  }
}

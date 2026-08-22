import type {
  BeatResponse,
  ChapterResponse,
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

export function aBeat(overrides: Partial<BeatResponse> = {}): BeatResponse {
  return {
    beat_type: 'narration',
    body: 'Domingo à noite. A pia ainda cheia, a vó já dormindo.',
    character_name: null,
    character_portrait: null,
    illustration_asset: null,
    ...overrides,
  }
}

export function aChapter(overrides: Partial<ChapterResponse> = {}): ChapterResponse {
  return {
    id: 'chapter-1',
    story_id: 'story-1',
    position: 2,
    kind: 'confronto',
    title: 'A pia cheia',
    objective: 'Convencer o tio Marcos de que o cuidado com a vó é trabalho de verdade.',
    min_words: 120,
    max_words: 250,
    antagonist_name: 'Tio Marcos',
    antagonist_portrait: null,
    status: 'available',
    branch: 'main',
    draft_body: null,
    beats: [
      aBeat(),
      aBeat({
        beat_type: 'dialogue',
        body: 'Cuidar da vó nem é trabalho de verdade.',
        character_name: 'Tio Marcos',
      }),
      aBeat({
        beat_type: 'objective',
        body: 'Convencer o tio Marcos de que o cuidado com a vó é trabalho de verdade.',
      }),
    ],
    ...overrides,
  }
}

import type {
  AnnotationResponse,
  BeatResponse,
  ChapterResponse,
  DimensionTrendResponse,
  Exam,
  LensResponse,
  MeResponse,
  ProgressResponse,
  ReactionResponse,
  ScoreResponse,
  SubmissionResponse,
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

export function aScore(overrides: Partial<ScoreResponse> = {}): ScoreResponse {
  return {
    dimension: 'norma_culta',
    score: 72,
    evidence: 'Dois desvios de acentuação em quinze linhas.',
    passed_floor: true,
    ...overrides,
  }
}

export function anAnnotation(overrides: Partial<AnnotationResponse> = {}): AnnotationResponse {
  return {
    span_start: 0,
    span_end: 4,
    type: 'accentuation',
    severity: 'error',
    message: 'Falta o acento: "vô" é o avô, "vó" é a avó.',
    suggestion: 'vó',
    priority: 1,
    ...overrides,
  }
}

export function aLens(overrides: Partial<LensResponse> = {}): LensResponse {
  return {
    exam: 'enem' as Exam,
    version: 'enem-2026.1',
    criteria: [
      { code: 'c1', label: 'Domínio da norma culta', score: 160, scale_max: 200, is_argumenta_extra: false },
      { code: 'c4', label: 'Coesão textual', score: 120, scale_max: 200, is_argumenta_extra: false },
    ],
    total: 280,
    total_max: 400,
    scale_source: 'board',
    ...overrides,
  }
}

export function aSubmission(overrides: Partial<SubmissionResponse> = {}): SubmissionResponse {
  return {
    submission_id: 'submission-1',
    attempt_number: 1,
    verdict: 'approved',
    average_score: 68.5,
    floor_value: 40,
    min_average: 50,
    chapter_status: 'in_consequence',
    scores: [aScore(), aScore({ dimension: 'persuasao', score: 65 })],
    annotations: [anAnnotation()],
    para_passar: [anAnnotation()],
    lens: aLens(),
    ...overrides,
  }
}

export function aTrend(overrides: Partial<DimensionTrendResponse> = {}): DimensionTrendResponse {
  return {
    dimension: 'norma_culta',
    criterion_code: 'C1',
    criterion_label: 'Domínio da norma culta',
    points: [
      { day: '2026-08-20', score: 62 },
      { day: '2026-08-22', score: 58 },
      { day: '2026-08-25', score: 50 },
    ],
    ...overrides,
  }
}

export function aProgress(overrides: Partial<ProgressResponse> = {}): ProgressResponse {
  return {
    exam: 'enem' as Exam,
    lens_version: 'lens-v1.0',
    streak_days: 7,
    longest_streak_days: 12,
    submissions_today: 2,
    daily_limit: 3,
    stories_completed: 1,
    stories_total: 3,
    dimensions: [
      aTrend(),
      aTrend({
        dimension: 'repertorio',
        criterion_code: 'C2',
        criterion_label: 'Compreensão da proposta e repertório',
        points: [
          { day: '2026-08-20', score: 68 },
          { day: '2026-08-22', score: 74 },
          { day: '2026-08-25', score: 80 },
        ],
      }),
    ],
    milestones: [
      { code: 'tutorial_completed', done: true },
      { code: 'first_repertoire_praise', done: true },
      { code: 'week_without_missing', done: true },
      { code: 'first_boss_essay', done: false },
    ],
    ...overrides,
  }
}

export function aReaction(overrides: Partial<ReactionResponse> = {}): ReactionResponse {
  return {
    beat: 'consequence_intro',
    character_name: 'Tio Marcos',
    body: 'Recebi o seu texto. Se cuidar é trabalho, me diz quanto custa e quem paga.',
    provisional: false,
    ...overrides,
  }
}

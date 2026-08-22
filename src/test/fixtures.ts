import type { Exam, MeResponse, TargetResponse, UserResponse } from '../api/types'

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

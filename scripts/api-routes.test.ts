import { describe, expect, it } from 'vitest'

import { API_ROUTES, viteProxyPatterns } from './api-routes'

describe('viteProxyPatterns', () => {
  it('produces the exact proxy patterns the dev server relied on before the extraction', () => {
    expect(viteProxyPatterns(API_ROUTES)).toEqual([
      '^/auth/',
      '^/me(/|$)',
      '^/track$',
      '^/chapters/',
      '^/submissions/',
      '^/progress$',
      '^/telemetry/',
      '^/health(/|$)',
    ])
  })
})

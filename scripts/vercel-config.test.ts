import { describe, expect, it } from 'vitest'

import { vercelConfig } from './vercel-config'

const ORIGIN = 'https://api.example.com'

describe('vercelConfig', () => {
  it('proxies every API route to the origin and leaves the SPA fallback last', () => {
    const { rewrites } = vercelConfig(ORIGIN)
    const fallback = rewrites[rewrites.length - 1]

    expect(fallback).toEqual({ source: '/(.*)', destination: '/index.html' })
    const proxies = rewrites.slice(0, -1)
    expect(proxies.length).toBeGreaterThan(0)
    for (const rewrite of proxies) {
      expect(rewrite.destination).toMatch(new RegExp(`^${ORIGIN}/`))
    }
  })

  it('maps match kinds so bare /me hits the API but bare /auth stays with the SPA', () => {
    const { rewrites } = vercelConfig(ORIGIN)
    const sources = rewrites.map((rewrite) => rewrite.source)

    expect(sources).toContain('/me')
    expect(sources).toContain('/me/:path+')
    expect(sources).toContain('/auth/:path+')
    expect(sources).not.toContain('/auth')
    expect(sources).toContain('/track')
  })

  it('never emits :path* sources: Vercel answers 307 instead of proxying on their bare match', () => {
    const { rewrites } = vercelConfig(ORIGIN)
    expect(rewrites.filter((rewrite) => rewrite.source.includes(':path*'))).toEqual([])
  })

  it('disables git-triggered deploys so the CLI is the only deploy path', () => {
    expect(vercelConfig(ORIGIN).git).toEqual({ deploymentEnabled: false })
  })

  it('normalizes a trailing slash on the origin and rejects an empty one', () => {
    const { rewrites } = vercelConfig(`${ORIGIN}/`)
    expect(rewrites[0].destination).toMatch(new RegExp(`^${ORIGIN}/[^/]`))
    expect(() => vercelConfig('')).toThrow(/API_ORIGIN/)
  })
})

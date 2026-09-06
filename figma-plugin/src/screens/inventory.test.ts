import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { SCREENS } from './index'

const APP = join(dirname(fileURLToPath(import.meta.url)), '../../../src/App.tsx')

/** Every `path="…"` the router declares. */
function routesOf(source: string): string[] {
  return [...source.matchAll(/path="([^"]+)"/g)].map((hit) => hit[1])
}

const ROUTES = routesOf(readFileSync(APP, 'utf8'))

describe('the screen inventory against src/App.tsx', () => {
  it('finds the router it is checked against', () => {
    expect(ROUTES.length).toBeGreaterThan(10)
  })

  it('draws every route the app can land on', () => {
    const drawn = new Set(SCREENS.flatMap((screen) => screen.routes))
    expect([...ROUTES].sort()).toEqual([...drawn].sort())
  })

  it('claims no route the router does not have', () => {
    for (const screen of SCREENS) {
      for (const route of screen.routes) expect(ROUTES, screen.label).toContain(route)
    }
  })

  it('labels each frame once', () => {
    const labels = SCREENS.map((screen) => screen.label)
    expect(new Set(labels).size).toBe(labels.length)
  })
})

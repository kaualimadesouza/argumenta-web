import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { COLORS } from './tokens'

const ROOT = dirname(fileURLToPath(import.meta.url))

/** Google's own four-colour G: their branding rules fix these, and they are not
 *  Argumenta tokens. Nothing else may spell a colour by hand. */
const FOREIGN = ['#4285F4', '#34A853', '#FBBC05', '#EA4335']

function sourcesOf(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return sourcesOf(path)
    if (!path.endsWith('.ts') || path.endsWith('.test.ts')) return []
    if (path === join(ROOT, 'tokens.ts')) return []
    return [path]
  })
}

interface Literal {
  file: string
  value: string
}

function hexLiterals(): Literal[] {
  return sourcesOf(ROOT).flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/#[0-9A-Fa-f]{6}\b/g)]
      .map((hit) => ({ file: file.slice(ROOT.length + 1), value: hit[0].toUpperCase() }))
      .filter((literal) => !FOREIGN.includes(literal.value)),
  )
}

describe('the plugin sources', () => {
  it('spell no colour by hand, so the token parity check covers every pixel', () => {
    expect(hexLiterals()).toEqual([])
  })

  it('would still catch a token value pasted in as a literal', () => {
    expect(Object.values(COLORS)).toContain('#2649E5')
  })

  it('never names a font weight directly, so the resolver stays the only source', () => {
    // nodes.ts owns the resolver; the fake stands in for Figma's own defaults
    const named = sourcesOf(ROOT)
      .filter((file) => !file.endsWith('nodes.ts') && !file.includes('testing'))
      .filter((file) => /family:\s*'Inter'/.test(readFileSync(file, 'utf8')))
      .map((file) => file.slice(ROOT.length + 1))
    expect(named).toEqual([])
  })
})

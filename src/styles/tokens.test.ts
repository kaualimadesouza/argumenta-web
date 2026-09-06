import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..')
const SHEET = join(SRC, 'styles/tokens.css')

function stylesheetsOf(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) return stylesheetsOf(path)
    return path.endsWith('.css') ? [path] : []
  })
}

interface Stylesheet {
  path: string
  source: string
}

const STYLESHEETS: Stylesheet[] = stylesheetsOf(SRC).map((path) => ({
  path: relative(SRC, path),
  source: readFileSync(path, 'utf8'),
}))

const DEFINED = new Set(
  [...readFileSync(SHEET, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((hit) => hit[1]),
)

interface Use {
  file: string
  property: string
}

/** A property a sheet reads but nobody defines renders as nothing at all: the
 *  declaration is dropped and the element silently inherits. */
function undefinedUses(): Use[] {
  return STYLESHEETS.flatMap((sheet) => {
    const own = new Set([...sheet.source.matchAll(/(--[\w-]+)\s*:/g)].map((hit) => hit[1]))
    return [...sheet.source.matchAll(/var\((--[\w-]+)/g)]
      .map((hit) => ({ file: sheet.path, property: hit[1] }))
      .filter((use) => !DEFINED.has(use.property) && !own.has(use.property))
  })
}

interface Shadow {
  file: string
  value: string
}

function shadows(): Shadow[] {
  return STYLESHEETS.flatMap((sheet) =>
    [...sheet.source.matchAll(/box-shadow:\s*([^;]+);/g)].map((hit) => ({
      file: sheet.path,
      value: hit[1].trim(),
    })),
  )
}

/** A shadow that lifts the element off the page, as opposed to a focus ring,
 *  which sits at zero offset. */
function isElevation(value: string): boolean {
  if (value === 'none') return false
  const offsets = value.match(/^(-?[\d.]+)(?:px|rem)?\s+(-?[\d.]+)(?:px|rem)?/)
  return offsets === null ? true : Number(offsets[2]) !== 0
}

describe('the design tokens', () => {
  it('define every custom property the stylesheets read', () => {
    expect(undefinedUses()).toEqual([])
  })
})

/** The press step, or the same 3px step spelled out for a button variant that
 *  needs its own colour. Nothing else may lift an element off the page. */
const PRESS_STEP = /^0 3px 0 var\(--color-[\w-]+\)$/

function isTheOneShadow(value: string): boolean {
  return value === 'var(--press)' || PRESS_STEP.test(value)
}

describe('elevation', () => {
  /** The rule from the design system: elevation is a border, never a shadow,
   *  and the one shadow is the press step under a primary action. */
  it('is the press step wherever a shadow lifts something off the page', () => {
    const offenders = shadows()
      .filter((shadow) => isElevation(shadow.value))
      .filter((shadow) => !isTheOneShadow(shadow.value))
    expect(offenders).toEqual([])
  })

  it('leaves the focus rings alone, since a ring is not elevation', () => {
    const rings = shadows().filter((shadow) => !isElevation(shadow.value) && shadow.value !== 'none')
    expect(rings.length).toBeGreaterThan(0)
    for (const ring of rings) expect(ring.value, ring.file).toContain('var(--color-')
  })
})

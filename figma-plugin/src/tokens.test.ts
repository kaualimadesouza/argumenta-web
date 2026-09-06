import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { type RootBlock, rootBlocks, tokenAt } from './testing/tokenSheet'
import {
  COLORS,
  LANDING_SCALE,
  LAYOUT,
  REM,
  SHAPE,
  TRACKING,
  TYPE,
  type ColorName,
} from './tokens'

const SHEET = join(dirname(fileURLToPath(import.meta.url)), '../../src/styles/tokens.css')
const BLOCKS: RootBlock[] = rootBlocks(readFileSync(SHEET, 'utf8'))

function base(name: string): string {
  const value = tokenAt(BLOCKS, name, 0)
  if (value === null) throw new Error(`tokens.css has no ${name}`)
  return value
}

function px(value: string): number {
  const rem = /^([\d.]+)rem$/.exec(value)
  if (rem) return Number(rem[1]) * REM
  const raw = /^([\d.]+)px$/.exec(value)
  if (raw) return Number(raw[1])
  throw new Error(`not a length: ${value}`)
}

/** `--color-line-strong` is `lineStrong`, `--color-ink-2` is `ink2`. */
function camel(kebab: string): string {
  return kebab.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

const CSS_COLORS = new Map(
  [...BLOCKS[0].declarations]
    .filter(([name]) => name.startsWith('--color-'))
    .map(([name, value]) => [camel(name.slice('--color-'.length)), value.toUpperCase()]),
)

describe('the plugin palette against src/styles/tokens.css', () => {
  it('carries every colour the sheet defines, and no invented one', () => {
    expect([...Object.keys(COLORS)].sort()).toEqual([...CSS_COLORS.keys()].sort())
  })

  it('spells each colour exactly as the sheet does', () => {
    for (const [name, hex] of CSS_COLORS) {
      expect(COLORS[name as ColorName].toUpperCase(), name).toBe(hex)
    }
  })
})

describe('the plugin scales against src/styles/tokens.css', () => {
  it('reads the type ramp in pixels', () => {
    expect(TYPE.display).toBe(px(base('--text-display')))
    expect(TYPE.title).toBe(px(base('--text-title')))
    expect(TYPE.lead).toBe(px(base('--text-lead')))
    expect(TYPE.body).toBe(px(base('--text-body')))
    expect(TYPE.meta).toBe(px(base('--text-meta')))
    expect(TYPE.micro).toBe(px(base('--text-micro')))
  })

  it('reads tracking as the percentage Figma wants', () => {
    const em = (value: string): number => Number(/^(-?[\d.]+)em$/.exec(value)?.[1]) * 100
    expect(TRACKING.title).toBeCloseTo(em(base('--tracking-title')), 5)
    expect(TRACKING.lead).toBeCloseTo(em(base('--tracking-lead')), 5)
    expect(TRACKING.body).toBeCloseTo(em(base('--tracking-body')), 5)
  })

  it('reads the radii', () => {
    expect(SHAPE.card).toBe(px(base('--radius-card')))
    expect(SHAPE.button).toBe(px(base('--radius-button')))
    expect(SHAPE.tile).toBe(px(base('--radius-tile')))
    expect(SHAPE.chip).toBe(px(base('--radius-chip')))
  })

  it('reads the reading columns and rails', () => {
    expect(LAYOUT.contentMax).toBe(px(base('--content-max')))
    expect(LAYOUT.contentMaxWide).toBe(px(base('--content-max-wide')))
    expect(LAYOUT.pageMax).toBe(px(base('--page-max')))
    expect(LAYOUT.rail).toBe(px(base('--rail')))
    expect(LAYOUT.landingMax).toBe(px(base('--landing-max')))
  })

  it('steps the landing ramp at the same breakpoints the sheet does', () => {
    const steps = [
      { key: 'phone', rem: 0 },
      { key: 'tablet', rem: 48 },
      { key: 'desktop', rem: 75 },
    ] as const
    for (const { key, rem } of steps) {
      const at = (name: string): number => px(tokenAt(BLOCKS, name, rem) ?? '')
      expect(LANDING_SCALE[key].hero, key).toBe(at('--text-hero'))
      expect(LANDING_SCALE[key].headline, key).toBe(at('--text-headline'))
      expect(LANDING_SCALE[key].stat, key).toBe(at('--text-stat'))
      expect(LANDING_SCALE[key].quote, key).toBe(at('--text-quote'))
    }
  })
})

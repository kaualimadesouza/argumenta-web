import { beforeAll, describe, expect, it } from 'vitest'

import { DEVICES, deviceOf } from '../devices'
import { loadFonts, stack } from '../nodes'
import { createStyles } from '../styles'
import { installFakeFigma, type FakeFigma } from '../testing/fakeFigma'
import { COLORS } from '../tokens'
import { trilha } from './app'
import { DEVICE_SCREENS, LANDING, SCREENS } from './index'
import { cena, consequencia, correcao, editor, historico } from './writing'
import { systemBoard } from './system'

let fake: FakeFigma

beforeAll(async () => {
  fake = installFakeFigma()
  await loadFonts()
})

describe('every screen draws', () => {
  for (const device of DEVICES) {
    for (const screen of SCREENS) {
      it(`${screen.label} at ${device.width}`, () => {
        const frame = screen.build(device)
        expect(frame.width).toBe(device.width)
        expect(frame.height).toBeGreaterThan(0)
        expect(frame.children.length).toBeGreaterThan(0)
      })
    }
  }
})

describe('the device frames', () => {
  it('never leaves an app screen shorter than the device', () => {
    for (const device of DEVICES) {
      for (const screen of DEVICE_SCREENS) {
        const frame = screen.build(device)
        expect(frame.height, `${screen.label} at ${device.width}`).toBeGreaterThanOrEqual(
          device.height,
        )
      }
    }
  })

  it('gives the landing the full scroll, taller than any viewport', () => {
    for (const device of DEVICES) {
      expect(LANDING.build(device).height).toBeGreaterThan(device.height * 2)
    }
  })
})

describe('the design system board', () => {
  it('draws the spec sheet', () => {
    const board = systemBoard()
    expect(board.width).toBeGreaterThan(1000)
    expect(board.children.length).toBeGreaterThan(4)
  })
})

describe('createStyles', () => {
  it('publishes one paint style per colour token and the six text steps', () => {
    createStyles()
    expect(fake.paintStyles.filter((style) => !style.removed).length).toBe(
      Object.keys(COLORS).length,
    )
    expect(fake.textStyles.filter((style) => !style.removed).length).toBe(6)
  })

  it('replaces its own styles instead of piling duplicates on a re-run', () => {
    createStyles()
    createStyles()
    expect(fake.paintStyles.filter((style) => !style.removed).length).toBe(
      Object.keys(COLORS).length,
    )
  })

  it('names the paint styles after the stylesheet tokens', () => {
    createStyles()
    const names = fake.paintStyles.filter((style) => !style.removed).map((style) => style.name)
    expect(names).toContain('Argumenta/caneta-soft')
    expect(names).toContain('Argumenta/ink-2')
    expect(names).toContain('Argumenta/marca-texto')
  })
})

/** The shell's three shapes, which is the whole point of drawing three widths. */
describe('the nav changes shape with the width', () => {
  const names = (frame: { children: readonly { name: string }[] }): string[] =>
    frame.children.map((child) => child.name)

  it('puts the tab bar under the thumb on a phone', () => {
    const frame = trilha(deviceOf('phone'))
    expect(names(frame)).toEqual(['body', 'nav/tabbar'])
  })

  it('turns it into a top bar on a tablet', () => {
    const frame = trilha(deviceOf('tablet'))
    expect(names(frame)).toEqual(['nav/topbar', 'body'])
  })

  it('turns it into a left rail on a desktop', () => {
    const frame = trilha(deviceOf('desktop'))
    expect(frame.layoutMode).toBe('HORIZONTAL')
    expect(names(frame)).toEqual(['nav/rail', 'body'])
    expect(frame.children[0].width).toBe(248)
  })

  it('leaves the writing flow and the auth screens outside the shell', () => {
    for (const build of [cena, editor, correcao, consequencia, historico]) {
      for (const device of DEVICES) {
        expect(names(build(device)).some((name) => name.startsWith('nav/'))).toBe(false)
      }
    }
  })
})

describe('the fake API', () => {
  /** The negative padding that reached Figma once: art the real API refuses
   *  must not build here either. */
  it('refuses a negative padding, as Figma does', () => {
    expect(() => stack({ padding: [0, 0, 0, -120] })).toThrow(/greater than or equal to 0/)
  })
})

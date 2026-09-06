import { beforeAll, describe, expect, it } from 'vitest'

import { columnFor, DEVICES, deviceOf } from '../devices'
import { loadFonts, stack, text } from '../nodes'
import { createStyles } from '../styles'
import { installFakeFigma, type FakeFigma } from '../testing/fakeFigma'
import { overflows, unfilled } from '../testing/invariants'
import { COLORS } from '../tokens'
import { trilha } from './app'
import { entrada } from './auth'
import { columns } from './layout'
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

describe('no block sits on top of the next one', () => {
  for (const device of DEVICES) {
    for (const screen of SCREENS) {
      it(`${screen.label} at ${device.width} holds every child inside its height`, () => {
        expect(overflows(screen.build(device))).toEqual([])
      })
    }
  }
})

describe('every frame that fills its parent measures it', () => {
  for (const device of DEVICES) {
    for (const screen of SCREENS) {
      it(`${screen.label} at ${device.width}`, () => {
        expect(unfilled(screen.build(device))).toEqual([])
      })
    }
  }
})

describe('a stack with a width', () => {
  it('hugs its height when it lies sideways', () => {
    const row = stack({ direction: 'HORIZONTAL', width: 300 })
    row.appendChild(text('uma linha qualquer', { size: 15 }))
    expect(row.width).toBe(300)
    expect(row.height).toBeGreaterThan(1)
  })
})

/** The stylesheet's `.wrap` is `max-width` plus `margin: 0 auto`, so a block is
 *  either the centred column or the full-bleed marquee, never the viewport with
 *  padding: that one draws the whole page flush against the left edge. */
describe('the landing centres its column', () => {
  for (const device of DEVICES) {
    it(`gives every block the column width at ${device.width}`, () => {
      const frame = LANDING.build(device)
      expect(frame.counterAxisAlignItems).toBe('CENTER')
      const column = columnFor(device, 'landing').width
      for (const block of frame.children) {
        expect(block.width, block.name).toBe(block.name === 'marquee' ? device.width : column)
      }
    })
  }
})

describe('a grid of columns', () => {
  it('builds every cell at the width it is going to occupy', () => {
    const widths: number[] = []
    const rows = columns({
      items: [1, 2, 3, 4],
      perRow: 3,
      width: 900,
      gap: 20,
      build: (_item, cell) => {
        widths.push(cell)
        return stack({ width: cell })
      },
    })
    expect(widths).toEqual([286, 286, 286, 286])
    expect(rows.map((row) => row.children.length)).toEqual([3, 1])
  })
})

/** `fill` and `grow` are this file's `display: block` and `flex: 1`. Figma keeps
 *  the hug when a child stretches an axis it also hugs, and then a button
 *  shrinks to its label and a panel stops at its text. */
describe('a child that fills its parent', () => {
  const child = (frame: FrameNode, name: string): SceneNode => {
    const found = frame.findAll(() => true).find((node) => node.name === name)
    if (found === undefined) throw new Error(`no ${name} in ${frame.name}`)
    return found
  }

  it('spans the column, instead of hugging its label', () => {
    const frame = entrada(deviceOf('desktop'))
    const list = child(frame, 'list') as FrameNode
    expect(child(frame, 'button/Entrar com Google').width).toBe(list.width)
  })

  it('gives the night panel the whole viewport height', () => {
    const frame = entrada(deviceOf('desktop'))
    expect(child(frame, 'brand').height).toBe(frame.height)
  })

  it('runs the rail down the full height of a desktop screen', () => {
    const frame = trilha(deviceOf('desktop'))
    expect(child(frame, 'nav/rail').height).toBe(frame.height)
  })
})

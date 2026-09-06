import { describe, expect, it } from 'vitest'

import { DEVICES, columnFor, deviceOf } from './devices'
import { LAYOUT } from './tokens'

describe('the three device frames', () => {
  it('names one frame per breakpoint of the stylesheet', () => {
    expect(DEVICES.map((device) => device.id)).toEqual(['phone', 'tablet', 'desktop'])
  })

  it('carries the nav shape the shell switches to at that width', () => {
    expect(deviceOf('phone').nav).toBe('tabbar')
    expect(deviceOf('tablet').nav).toBe('topbar')
    expect(deviceOf('desktop').nav).toBe('rail')
  })

  it('sits each frame on the right side of the 48rem and 75rem steps', () => {
    expect(deviceOf('phone').width).toBeLessThan(48 * 16)
    expect(deviceOf('tablet').width).toBeGreaterThanOrEqual(48 * 16)
    expect(deviceOf('tablet').width).toBeLessThan(75 * 16)
    expect(deviceOf('desktop').width).toBeGreaterThanOrEqual(75 * 16)
  })
})

describe('columnFor', () => {
  /** global.css sets `box-sizing: border-box` on everything, so a page's
   *  max-width already contains its horizontal padding: the reading column is
   *  the capped box minus that padding, never the cap itself. */
  it('takes the padding out of the capped box, not off the viewport', () => {
    const tablet = deviceOf('tablet')
    const column = columnFor(tablet, 'reading')
    expect(column.width).toBe(LAYOUT.contentMaxWide - 2 * column.padX)
  })

  it('falls back to the viewport when the viewport is narrower than the cap', () => {
    const phone = deviceOf('phone')
    const column = columnFor(phone, 'reading')
    expect(column.width).toBe(phone.width - 2 * column.padX)
  })

  it('gives the two-column screens the page width on a desktop', () => {
    const column = columnFor(deviceOf('desktop'), 'wide')
    expect(column.width).toBe(LAYOUT.pageMax - 2 * column.padX)
  })

  it('keeps a reading screen at the reading column even on a desktop', () => {
    const column = columnFor(deviceOf('desktop'), 'reading')
    expect(column.width).toBe(LAYOUT.contentMaxWide - 2 * column.padX)
  })

  it('holds the auth forms at their own narrow column', () => {
    const column = columnFor(deviceOf('desktop'), 'narrow')
    expect(column.width).toBe(400 - 2 * column.padX)
  })

  it('never widens a screen whose stylesheet has no breakpoint', () => {
    for (const device of DEVICES) {
      const column = columnFor(device, 'document')
      expect(column.width, device.id).toBe(
        Math.min(LAYOUT.contentMax, device.width) - 2 * column.padX,
      )
    }
  })

  it('lets the landing run to its own max width', () => {
    const column = columnFor(deviceOf('desktop'), 'landing')
    expect(column.width).toBe(LAYOUT.landingMax - 2 * column.padX)
  })
})

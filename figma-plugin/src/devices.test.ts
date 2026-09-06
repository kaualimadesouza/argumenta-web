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
  it('never lets a reading column outgrow the viewport it sits in', () => {
    const phone = columnFor(deviceOf('phone'), 'reading')
    expect(phone.width).toBe(deviceOf('phone').width - 2 * phone.padX)
  })

  it('opens up to the wide reading column on a tablet', () => {
    expect(columnFor(deviceOf('tablet'), 'reading').width).toBe(LAYOUT.contentMaxWide)
  })

  it('gives the two-column screens the page width on a desktop', () => {
    expect(columnFor(deviceOf('desktop'), 'wide').width).toBe(LAYOUT.pageMax)
  })

  it('keeps a reading screen at the reading column even on a desktop', () => {
    expect(columnFor(deviceOf('desktop'), 'reading').width).toBe(LAYOUT.contentMaxWide)
  })

  it('holds the auth forms at their own narrow column', () => {
    expect(columnFor(deviceOf('desktop'), 'narrow').width).toBe(400)
  })

  it('lets the landing run to its own max width', () => {
    expect(columnFor(deviceOf('desktop'), 'landing').width).toBe(LAYOUT.landingMax)
  })
})

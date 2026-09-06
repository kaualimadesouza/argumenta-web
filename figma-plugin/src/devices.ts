import { LAYOUT, type Breakpoint } from './tokens'

export type DeviceId = Breakpoint
export type NavShape = 'tabbar' | 'topbar' | 'rail'

export interface Device {
  id: DeviceId
  /** What the band label on the canvas says. */
  label: string
  width: number
  height: number
  nav: NavShape
}

/** One frame per side of the stylesheet's two breakpoints, 48rem and 75rem. */
export const DEVICES: Device[] = [
  { id: 'phone', label: 'Celular · 390 × 844', width: 390, height: 844, nav: 'tabbar' },
  { id: 'tablet', label: 'Tablet · 834 × 1112', width: 834, height: 1112, nav: 'topbar' },
  { id: 'desktop', label: 'Desktop · 1440 × 900', width: 1440, height: 900, nav: 'rail' },
]

export function deviceOf(id: DeviceId): Device {
  const found = DEVICES.find((device) => device.id === id)
  if (found === undefined) throw new Error(`no device ${id}`)
  return found
}

/** The width a screen's content column is allowed to reach, one per shape the
 *  stylesheets actually use: `document` never widens (its sheet has no
 *  breakpoint), `reading` opens once at 48rem, `wide` opens again at 75rem for
 *  the two-column screens, `narrow` is the auth form and `landing` is the
 *  marketing page. */
export type ColumnShape = 'document' | 'reading' | 'wide' | 'narrow' | 'landing'

export interface ColumnSpec {
  width: number
  padX: number
  padTop: number
  padBottom: number
  gap: number
}

interface ColumnRule {
  max: number
  padX: number
  padTop: number
  padBottom: number
  gap: number
}

const RULES: Record<ColumnShape, Record<DeviceId, ColumnRule>> = {
  document: {
    phone: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 48, gap: 16 },
    tablet: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 56, gap: 16 },
    desktop: { max: LAYOUT.contentMax, padX: 20, padTop: 24, padBottom: 64, gap: 16 },
  },
  reading: {
    phone: { max: LAYOUT.contentMax, padX: 20, padTop: 18, padBottom: 40, gap: 14 },
    tablet: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 32, padBottom: 48, gap: 16 },
    desktop: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 40, padBottom: 56, gap: 16 },
  },
  wide: {
    phone: { max: LAYOUT.contentMax, padX: 20, padTop: 18, padBottom: 40, gap: 14 },
    tablet: { max: LAYOUT.contentMaxWide, padX: 24, padTop: 28, padBottom: 48, gap: 16 },
    desktop: { max: LAYOUT.pageMax, padX: 32, padTop: 36, padBottom: 48, gap: 20 },
  },
  narrow: {
    phone: { max: 400, padX: 20, padTop: 24, padBottom: 48, gap: 16 },
    tablet: { max: 400, padX: 20, padTop: 32, padBottom: 48, gap: 16 },
    desktop: { max: 400, padX: 20, padTop: 40, padBottom: 48, gap: 16 },
  },
  landing: {
    phone: { max: LAYOUT.landingMax, padX: 20, padTop: 0, padBottom: 0, gap: 0 },
    tablet: { max: LAYOUT.landingMax, padX: 40, padTop: 0, padBottom: 0, gap: 0 },
    desktop: { max: LAYOUT.landingMax, padX: 40, padTop: 0, padBottom: 0, gap: 0 },
  },
}

/** `box-sizing: border-box` in global.css means a page's max-width already
 *  contains its horizontal padding, so the column is the capped box minus that
 *  padding, and the cap gives way to the viewport only when the viewport is
 *  narrower than it. */
export function columnFor(device: Device, shape: ColumnShape): ColumnSpec {
  const rule = RULES[shape][device.id]
  return {
    width: Math.min(rule.max, device.width) - 2 * rule.padX,
    padX: rule.padX,
    padTop: rule.padTop,
    padBottom: rule.padBottom,
    gap: rule.gap,
  }
}

/** The v3 design tokens, mirrored from src/styles/tokens.css in the units Figma
 *  works in: pixels for lengths, percent for tracking. tokens.test.ts fails if
 *  this file and the sheet ever disagree. */
export const REM = 16

export const COLORS = {
  paper: '#F4F5F7',
  card: '#FFFFFF',
  line: '#E4E7EB',
  lineStrong: '#D3D8DE',
  track: '#ECEEF1',

  ink: '#101418',
  ink2: '#54606C',
  muted: '#6B7683',
  disabled: '#C9CFD6',

  caneta: '#2649E5',
  canetaPress: '#1932A8',
  canetaSoft: '#EDF0FE',

  aprovado: '#0E9F6E',
  aprovadoInk: '#07784F',
  aprovadoSoft: '#E7F6F0',

  corretor: '#D92D20',
  corretorInk: '#A81C1C',
  corretorSoft: '#FDECEA',

  streak: '#E8891A',
  streakInk: '#A35C08',
  streakSoft: '#FBF0E2',

  marcaTexto: '#FFE9A8',

  noite: '#111722',
  noiteInner: '#1B2432',
  luz: '#E6EAF0',
  luzMuted: '#9AA6B6',
} as const

export type ColorName = keyof typeof COLORS

export interface TypeScale {
  display: number
  title: number
  lead: number
  body: number
  meta: number
  micro: number
}

export const TYPE: TypeScale = {
  display: 30,
  title: 24,
  lead: 19,
  body: 15,
  meta: 13,
  micro: 11,
}

export interface Tracking {
  title: number
  lead: number
  body: number
}

export const TRACKING: Tracking = { title: -3, lead: -2, body: -1.1 }

export interface Shape {
  card: number
  button: number
  tile: number
  chip: number
  /** The phone nav, which floats instead of running edge to edge. */
  dock: number
}

export const SHAPE: Shape = { card: 14, button: 12, tile: 10, chip: 999, dock: 22 }

export interface Layout {
  contentMax: number
  contentMaxWide: number
  pageMax: number
  rail: number
  landingMax: number
}

export const LAYOUT: Layout = {
  contentMax: 544,
  contentMaxWide: 672,
  pageMax: 1056,
  rail: 352,
  landingMax: 1200,
}

/** The marketing ramp, which is the only one that steps with the viewport. */
export interface LandingScale {
  hero: number
  headline: number
  stat: number
  quote: number
}

export type Breakpoint = 'phone' | 'tablet' | 'desktop'

export const LANDING_SCALE: Record<Breakpoint, LandingScale> = {
  phone: { hero: 40, headline: 32, stat: 36, quote: 30 },
  tablet: { hero: 54, headline: 32, stat: 36, quote: 30 },
  desktop: { hero: 66, headline: 46, stat: 44, quote: 48 },
}

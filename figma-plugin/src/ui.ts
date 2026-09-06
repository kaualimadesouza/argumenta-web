import {
  applyBorder,
  fill,
  paint,
  pressShadow,
  rect,
  stack,
  text,
  type Border,
  type Padding,
} from './nodes'
import { SHAPE, TRACKING, TYPE, type ColorName } from './tokens'

/* -------------------------------- card -------------------------------- */

export interface CardOptions {
  /** The card the student is meant to act on carries the heavier caneta border. */
  active?: boolean
  gap?: number
  padding?: Padding
  width?: number
  name?: string
}

export function card(options: CardOptions = {}): FrameNode {
  const border: Border = options.active === true
    ? { color: 'caneta', weight: 1.5 }
    : { color: 'line', weight: 1 }
  return stack({
    name: options.name ?? 'card',
    gap: options.gap ?? 12,
    padding: options.padding ?? 18,
    fill: 'card',
    radius: SHAPE.card,
    border,
    width: options.width,
  })
}

/** The functional label naming what a block is. Never uppercase, never mono. */
export function kicker(label: string, tone: 'caneta' | 'streak' = 'caneta'): TextNode {
  return text(label, {
    size: TYPE.meta,
    weight: 700,
    color: tone === 'caneta' ? 'caneta' : 'streakInk',
    name: 'kicker',
  })
}

/* -------------------------------- chip -------------------------------- */

export type ChipTone = 'caneta' | 'ok' | 'warn' | 'streak' | 'neutral'

interface ChipStyle {
  background: ColorName
  ink: ColorName
  weight: 600 | 700
}

const CHIP: Record<ChipTone, ChipStyle> = {
  caneta: { background: 'canetaSoft', ink: 'caneta', weight: 600 },
  ok: { background: 'aprovadoSoft', ink: 'aprovadoInk', weight: 700 },
  warn: { background: 'streakSoft', ink: 'streakInk', weight: 700 },
  streak: { background: 'streakSoft', ink: 'streakInk', weight: 700 },
  neutral: { background: 'track', ink: 'ink2', weight: 600 },
}

export function chip(label: string, tone: ChipTone = 'caneta'): FrameNode {
  const style = CHIP[tone]
  const frame = stack({
    name: `chip/${label}`,
    direction: 'HORIZONTAL',
    padding: [5, 11],
    fill: style.background,
    radius: SHAPE.chip,
    align: 'CENTER',
  })
  frame.appendChild(text(label, { size: TYPE.meta, weight: style.weight, color: style.ink }))
  return frame
}

/* ------------------------------- button ------------------------------- */

export type ButtonVariant = 'primary' | 'ghost' | 'quiet' | 'danger' | 'disabled'

export function button(label: string, variant: ButtonVariant = 'primary'): FrameNode {
  const quiet = variant === 'quiet'
  const ghost = variant === 'ghost'
  const height = quiet ? 32 : ghost ? 44 : 50
  const frame = stack({
    name: `button/${label}`,
    direction: 'HORIZONTAL',
    gap: 8,
    padding: quiet ? [6, 8] : [8, 20],
    fill: variant === 'primary' ? 'caneta' : variant === 'danger' ? 'corretor' : variant === 'disabled' ? 'disabled' : quiet ? null : 'card',
    radius: quiet ? 0 : SHAPE.button,
    align: 'CENTER',
    justify: 'CENTER',
  })
  frame.primaryAxisSizingMode = 'FIXED'
  frame.resize(frame.width, height)
  if (ghost) applyBorder(frame, { color: 'lineStrong', weight: 1 })
  if (variant === 'primary') frame.effects = pressShadow('canetaPress')
  if (variant === 'danger') frame.effects = pressShadow('corretorInk')
  const ink: ColorName = variant === 'primary' || variant === 'danger' || variant === 'disabled'
    ? 'card'
    : quiet
      ? 'caneta'
      : 'ink2'
  frame.appendChild(
    text(label, {
      size: quiet ? TYPE.meta : TYPE.body,
      weight: ghost || quiet ? 600 : 700,
      color: ink,
      tracking: quiet ? 0 : TRACKING.body,
    }),
  )
  return frame
}

/* ----------------------------- progress bar ---------------------------- */

export type BarTone = 'caneta' | 'alert' | 'streak' | 'done'

const BAR_FILL: Record<BarTone, ColorName> = {
  caneta: 'caneta',
  alert: 'corretor',
  streak: 'streak',
  done: 'aprovado',
}

export interface BarOptions {
  percent: number
  width: number
  tone?: BarTone
  /** Where the pass floor sits, 0 to 100, drawn as an ink tick on the track. */
  floor?: number
}

export function progressBar(options: BarOptions): FrameNode {
  const height = 6
  const frame = figma.createFrame()
  frame.name = 'progress'
  frame.resize(options.width, height)
  frame.cornerRadius = SHAPE.chip
  frame.fills = paint('track')
  frame.clipsContent = true
  const width = Math.max(0, Math.min(100, options.percent)) / 100 * options.width
  if (width > 0) {
    const bar = rect(width, height, BAR_FILL[options.tone ?? 'caneta'], SHAPE.chip)
    frame.appendChild(bar)
    bar.x = 0
    bar.y = 0
  }
  if (options.floor !== undefined) {
    const tick = rect(2, height, 'ink')
    tick.opacity = 0.35
    frame.appendChild(tick)
    tick.x = (options.floor / 100) * options.width
    tick.y = 0
  }
  return frame
}

/* ------------------------------- inputs ------------------------------- */

export interface FieldOptions {
  label: string
  value: string
  hint?: string
  width: number
  /** A select shows the closed control with its chevron. */
  select?: boolean
}

export function field(options: FieldOptions): FrameNode {
  const frame = stack({ name: `field/${options.label}`, gap: 6, width: options.width })
  frame.appendChild(text(options.label, { size: TYPE.meta, weight: 600, color: 'ink2' }))
  const control = stack({
    direction: 'HORIZONTAL',
    padding: [12, 14],
    fill: 'card',
    radius: SHAPE.button,
    border: { color: 'lineStrong', weight: 1 },
    align: 'CENTER',
    justify: options.select === true ? 'SPACE_BETWEEN' : 'MIN',
    width: options.width,
  })
  control.primaryAxisSizingMode = 'FIXED'
  control.resize(options.width, 46)
  control.appendChild(
    text(options.value, {
      size: TYPE.body,
      color: options.value === '' ? 'muted' : 'ink',
      tracking: TRACKING.body,
    }),
  )
  if (options.select === true) control.appendChild(chevron())
  frame.appendChild(fill(control))
  if (options.hint !== undefined) {
    frame.appendChild(
      fill(text(options.hint, { size: TYPE.meta, color: 'muted', width: options.width })),
    )
  }
  return frame
}

function chevron(): FrameNode {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m6 9.5 6 5.5 6-5.5" stroke="#54606C" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'chevron'
  node.resize(16, 16)
  return node
}

/** The editor sheet: the one control that carries the caneta border. */
export function textarea(body: string, width: number, height: number): FrameNode {
  const frame = stack({
    name: 'editor',
    padding: [16, 18],
    fill: 'card',
    radius: SHAPE.card,
    border: { color: 'caneta', weight: 1.5 },
    width,
  })
  frame.primaryAxisSizingMode = 'FIXED'
  frame.resize(width, height)
  frame.appendChild(
    text(body, {
      size: TYPE.body,
      color: body === '' ? 'muted' : 'ink',
      lineHeight: 1.72,
      tracking: -0.8,
      width: width - 36,
    }),
  )
  return frame
}

/* ------------------------------- notice ------------------------------- */

export type NoticeTone = 'error' | 'ok' | 'warn'

const NOTICE: Record<NoticeTone, { background: ColorName; border: ColorName; ink: ColorName }> = {
  error: { background: 'corretorSoft', border: 'corretor', ink: 'corretorInk' },
  ok: { background: 'aprovadoSoft', border: 'aprovado', ink: 'aprovadoInk' },
  warn: { background: 'streakSoft', border: 'streak', ink: 'streakInk' },
}

export function notice(body: string, tone: NoticeTone, width: number): FrameNode {
  const style = NOTICE[tone]
  const frame = stack({
    name: `notice/${tone}`,
    padding: [12, 15],
    fill: style.background,
    radius: SHAPE.button,
    border: { color: style.border, weight: 1 },
    width,
  })
  frame.appendChild(
    text(body, { size: TYPE.body, color: style.ink, lineHeight: 1.55, width: width - 30 }),
  )
  return frame
}

/* ------------------------------- marks -------------------------------- */

/** The numbered mark of an annotation, 15px as in the correction screen. */
export function markBadge(number: number, tone: 'slip' | 'praise'): FrameNode {
  const frame = stack({
    name: `mark/${number}`,
    direction: 'HORIZONTAL',
    fill: tone === 'slip' ? 'corretor' : 'caneta',
    radius: SHAPE.chip,
    align: 'CENTER',
    justify: 'CENTER',
    width: 15,
  })
  frame.primaryAxisSizingMode = 'FIXED'
  frame.resize(15, 15)
  frame.appendChild(text(String(number), { size: 9.5, weight: 700, color: 'card' }))
  return frame
}

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`

/** A milestone's state: the filled check, or the dashed circle still waiting. */
export function tick(done: boolean): FrameNode {
  const frame = stack({
    name: done ? 'tick/done' : 'tick/pending',
    direction: 'HORIZONTAL',
    fill: done ? 'aprovado' : null,
    radius: SHAPE.chip,
    align: 'CENTER',
    justify: 'CENTER',
    width: 20,
  })
  frame.primaryAxisSizingMode = 'FIXED'
  frame.resize(20, 20)
  if (!done) applyBorder(frame, { color: 'lineStrong', weight: 1.75, dashed: true })
  if (done) {
    const glyph = figma.createNodeFromSvg(CHECK_SVG)
    glyph.resize(13, 13)
    frame.appendChild(glyph)
  }
  return frame
}

/** The drawn arrow of a "Para passar" step. */
export function arrowBullet(): FrameNode {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 8" fill="none"><path d="M0 4h12M8.5 1 12 4l-3.5 3" stroke="#2649E5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'arrow'
  node.resize(13, 8)
  return node
}

export function checkGlyph(size = 20): FrameNode {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="#2649E5" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'check'
  node.resize(size, size)
  return node
}

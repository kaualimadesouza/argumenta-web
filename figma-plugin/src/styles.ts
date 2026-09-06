import { fontOf, paint, type Weight } from './nodes'
import { COLORS, TRACKING, TYPE, type ColorName } from './tokens'

/** Figma styles named after the stylesheet's own tokens, so a designer picking
 *  "caneta-soft" and a developer writing `var(--color-caneta-soft)` mean the
 *  same thing. */
function styleName(token: ColorName): string {
  return `Argumenta/${token.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`)}`
}

interface TextStyleSpec {
  name: string
  size: number
  weight: Weight
  /** CSS line-height, unitless. */
  lineHeight: number
  tracking: number
}

const TEXT_STYLES: TextStyleSpec[] = [
  { name: 'display', size: TYPE.display, weight: 800, lineHeight: 1.15, tracking: TRACKING.title },
  { name: 'title', size: TYPE.title, weight: 800, lineHeight: 1.18, tracking: TRACKING.title },
  { name: 'lead', size: TYPE.lead, weight: 600, lineHeight: 1.48, tracking: TRACKING.lead },
  { name: 'body', size: TYPE.body, weight: 400, lineHeight: 1.55, tracking: TRACKING.body },
  { name: 'meta', size: TYPE.meta, weight: 600, lineHeight: 1.45, tracking: 0 },
  { name: 'micro', size: TYPE.micro, weight: 500, lineHeight: 1.3, tracking: 0 },
]

/** Replaces the Argumenta styles instead of piling duplicates on a re-run. */
export function createStyles(): void {
  for (const style of figma.getLocalPaintStyles()) {
    if (style.name.startsWith('Argumenta/')) style.remove()
  }
  for (const style of figma.getLocalTextStyles()) {
    if (style.name.startsWith('Argumenta/')) style.remove()
  }
  for (const token of Object.keys(COLORS) as ColorName[]) {
    const style = figma.createPaintStyle()
    style.name = styleName(token)
    style.paints = paint(token)
  }
  for (const spec of TEXT_STYLES) {
    const style = figma.createTextStyle()
    style.name = `Argumenta/${spec.name}`
    style.fontName = fontOf(spec.weight)
    style.fontSize = spec.size
    style.lineHeight = { value: spec.lineHeight * 100, unit: 'PERCENT' }
    style.letterSpacing = { value: spec.tracking, unit: 'PERCENT' }
  }
}

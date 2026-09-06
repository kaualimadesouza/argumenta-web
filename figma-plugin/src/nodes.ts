import { COLORS, type ColorName } from './tokens'

/** Inter is the only family: five weights, the ones index.html loads. */
export type Weight = 400 | 500 | 600 | 700 | 800

const STYLE: Record<Weight, string> = {
  400: 'Regular',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
}

const RESOLVED = new Map<Weight, FontName>()

/** Figma installs vary, so each weight falls back to the closest one present
 *  and, in the worst case, to Inter Regular. */
export async function loadFonts(): Promise<void> {
  const available = await figma.listAvailableFontsAsync()
  const inter = available.filter((font) => font.fontName.family === 'Inter')
  const styles = new Set(inter.map((font) => font.fontName.style))
  const order: Weight[] = [400, 500, 600, 700, 800]
  for (const weight of order) {
    const wanted = [STYLE[weight], ...order.map((other) => STYLE[other])]
    const style = wanted.find((candidate) => styles.has(candidate)) ?? 'Regular'
    RESOLVED.set(weight, { family: 'Inter', style })
  }
  for (const font of new Set(RESOLVED.values())) await figma.loadFontAsync(font)
}

export function fontOf(weight: Weight): FontName {
  return RESOLVED.get(weight) ?? { family: 'Inter', style: 'Regular' }
}

export function rgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

export function paint(color: ColorName, opacity?: number): SolidPaint[] {
  const solid: SolidPaint = { type: 'SOLID', color: rgb(COLORS[color]) }
  return [opacity === undefined ? solid : { ...solid, opacity }]
}

export interface Border {
  color: ColorName
  weight: number
  /** Only these edges carry the line, as CSS border-top / border-right do. */
  sides?: ('top' | 'right' | 'bottom' | 'left')[]
  dashed?: boolean
}

export type Padding = number | [number, number] | [number, number, number, number]

function edges(padding: Padding): [number, number, number, number] {
  if (typeof padding === 'number') return [padding, padding, padding, padding]
  if (padding.length === 2) return [padding[0], padding[1], padding[0], padding[1]]
  return padding
}

export interface StackOptions {
  name?: string
  direction?: 'VERTICAL' | 'HORIZONTAL'
  gap?: number
  padding?: Padding
  fill?: ColorName | null
  radius?: number
  border?: Border
  /** Cross-axis alignment of the children. */
  align?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE'
  justify?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
  width?: number
  wrap?: boolean
}

export function stack(options: StackOptions = {}): FrameNode {
  const frame = figma.createFrame()
  const [top, right, bottom, left] = edges(options.padding ?? 0)
  frame.name = options.name ?? 'stack'
  frame.layoutMode = options.direction ?? 'VERTICAL'
  frame.itemSpacing = options.gap ?? 0
  frame.paddingTop = top
  frame.paddingRight = right
  frame.paddingBottom = bottom
  frame.paddingLeft = left
  frame.counterAxisAlignItems = options.align === 'BASELINE' ? 'BASELINE' : (options.align ?? 'MIN')
  frame.primaryAxisAlignItems = options.justify ?? 'MIN'
  frame.clipsContent = false
  frame.fills = options.fill === undefined || options.fill === null ? [] : paint(options.fill)
  if (options.radius !== undefined) frame.cornerRadius = options.radius
  if (options.wrap === true) frame.layoutWrap = 'WRAP'
  setSize(frame, { width: options.width })
  if (options.border) applyBorder(frame, options.border)
  return frame
}

export interface Size {
  width?: number
  height?: number
}

/** Figma's sizing modes are axis-relative, so their meaning flips with the
 *  direction of the stack: on a row, the "primary" axis is the width. This
 *  states the frame's sizing in the two words the caller is thinking in, and a
 *  dimension left out hugs its content. */
export function setSize(frame: FrameNode, size: Size): void {
  const sideways = frame.layoutMode === 'HORIZONTAL'
  frame.resize(size.width ?? frame.width, size.height ?? frame.height)
  const primary = sideways ? size.width : size.height
  const counter = sideways ? size.height : size.width
  frame.primaryAxisSizingMode = primary === undefined ? 'AUTO' : 'FIXED'
  frame.counterAxisSizingMode = counter === undefined ? 'AUTO' : 'FIXED'
}

export function applyBorder(node: FrameNode | RectangleNode, border: Border): void {
  node.strokes = paint(border.color)
  node.strokeAlign = 'INSIDE'
  if (border.dashed === true) node.dashPattern = [3, 3]
  const sides = border.sides
  if (sides === undefined) {
    node.strokeWeight = border.weight
    return
  }
  node.strokeTopWeight = sides.includes('top') ? border.weight : 0
  node.strokeRightWeight = sides.includes('right') ? border.weight : 0
  node.strokeBottomWeight = sides.includes('bottom') ? border.weight : 0
  node.strokeLeftWeight = sides.includes('left') ? border.weight : 0
}

export interface TextOptions {
  size: number
  weight?: Weight
  color?: ColorName
  /** CSS line-height, unitless: 1.55 becomes 155%. */
  lineHeight?: number
  /** Tracking in percent, as the token table already stores it. */
  tracking?: number
  align?: 'LEFT' | 'CENTER' | 'RIGHT'
  width?: number
  name?: string
}

export function text(content: string, options: TextOptions): TextNode {
  const node = figma.createText()
  node.name = options.name ?? content.slice(0, 40)
  node.fontName = fontOf(options.weight ?? 400)
  node.fontSize = options.size
  node.characters = content
  node.fills = paint(options.color ?? 'ink')
  node.textAlignHorizontal = options.align ?? 'LEFT'
  if (options.lineHeight !== undefined) {
    node.lineHeight = { value: options.lineHeight * 100, unit: 'PERCENT' }
  }
  if (options.tracking !== undefined) {
    node.letterSpacing = { value: options.tracking, unit: 'PERCENT' }
  }
  if (options.width === undefined) {
    node.textAutoResize = 'WIDTH_AND_HEIGHT'
  } else {
    node.textAutoResize = 'HEIGHT'
    node.resize(options.width, node.height)
  }
  return node
}

/** The child fills its parent's cross axis, as a block element does. */
export function fill<T extends SceneNode & AutoLayoutChildrenMixin>(node: T): T {
  node.layoutAlign = 'STRETCH'
  return node
}

/** The child takes the slack on its parent's main axis. */
export function grow<T extends SceneNode & AutoLayoutChildrenMixin>(node: T): T {
  node.layoutGrow = 1
  return node
}

export function rect(width: number, height: number, color: ColorName, radius = 0): RectangleNode {
  const node = figma.createRectangle()
  node.resize(width, height)
  node.fills = paint(color)
  if (radius > 0) node.cornerRadius = radius
  node.name = 'rect'
  return node
}

/** The one shadow in the system: the 3px press step under a primary action. */
export function pressShadow(color: ColorName = 'canetaPress'): Effect[] {
  return [
    {
      type: 'DROP_SHADOW',
      color: { ...rgb(COLORS[color]), a: 1 },
      offset: { x: 0, y: 3 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ]
}

/** Icons come from the app's own SVG, recoloured to a token. */
export function icon(svg: string, size: number, color: ColorName): FrameNode {
  const node = figma.createNodeFromSvg(svg)
  node.name = 'icon'
  node.resize(size, size)
  for (const child of node.findAll(() => true)) {
    if ('strokes' in child && child.strokes.length > 0) child.strokes = paint(color)
    if ('fills' in child && Array.isArray(child.fills) && child.fills.length > 0) {
      child.fills = paint(color)
    }
  }
  return node
}

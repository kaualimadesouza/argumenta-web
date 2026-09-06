/** A stand-in for the Figma plugin API, enough of it to run every screen
 *  builder in a test: nodes, auto-layout sizing and the calls the plugin makes.
 *  It is deliberately strict where Figma is strict, so a bad size fails here. */

type Axis = 'VERTICAL' | 'HORIZONTAL'
type Sizing = 'AUTO' | 'FIXED'

/** Figma never reports a zero dimension: an empty auto-layout frame is 0.01. */
const FLOOR = 0.01

function atLeastFloor(value: number): number {
  return Math.max(FLOOR, value)
}

function assertSize(value: number, what: string): void {
  if (!Number.isFinite(value) || value < 0.01) {
    throw new Error(`Cannot set ${what} to ${value}: Figma requires at least 0.01`)
  }
}

type Side = 'Top' | 'Right' | 'Bottom' | 'Left'

/** Figma refuses a negative padding, so the fake has to refuse it too: art that
 *  cannot exist must not pass the tests. */
function assertPadding(value: number, side: Side): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `in set_padding${side}: Property "padding${side}" failed: Number must be greater than or equal to 0`,
    )
  }
}

class FakeNode {
  name = 'node'
  x = 0
  y = 0
  opacity = 1
  visible = true
  parent: FakeFrame | null = null
  fills: unknown = []
  strokes: unknown[] = []
  strokeAlign = 'INSIDE'
  strokeWeight = 0
  strokeTopWeight = 0
  strokeRightWeight = 0
  strokeBottomWeight = 0
  strokeLeftWeight = 0
  dashPattern: number[] = []
  effects: unknown[] = []
  cornerRadius = 0
  layoutAlign = 'INHERIT'
  layoutGrow = 0
  layoutPositioning = 'AUTO'
  layoutSizingHorizontal = 'FIXED'
  layoutSizingVertical = 'FIXED'
  protected fixedWidth = 100
  protected fixedHeight = 20

  get width(): number {
    return this.fixedWidth
  }

  get height(): number {
    return this.fixedHeight
  }

  resize(width: number, height: number): void {
    assertSize(width, 'width')
    assertSize(height, 'height')
    this.fixedWidth = width
    this.fixedHeight = height
  }

  remove(): void {
    if (this.parent !== null) {
      this.parent.children = this.parent.children.filter((child) => child !== this)
    }
  }

  findAll(): FakeNode[] {
    return []
  }
}

class FakeFrame extends FakeNode {
  type = 'FRAME'
  children: FakeNode[] = []
  layoutMode: Axis | 'NONE' = 'NONE'
  layoutWrap = 'NO_WRAP'
  itemSpacing = 0
  counterAxisSpacing = 0
  private pad: Record<Side, number> = { Top: 0, Right: 0, Bottom: 0, Left: 0 }
  primaryAxisSizingMode: Sizing = 'AUTO'
  counterAxisSizingMode: Sizing = 'AUTO'
  primaryAxisAlignItems = 'MIN'
  counterAxisAlignItems = 'MIN'
  clipsContent = true

  get paddingTop(): number {
    return this.pad.Top
  }

  set paddingTop(value: number) {
    assertPadding(value, 'Top')
    this.pad.Top = value
  }

  get paddingRight(): number {
    return this.pad.Right
  }

  set paddingRight(value: number) {
    assertPadding(value, 'Right')
    this.pad.Right = value
  }

  get paddingBottom(): number {
    return this.pad.Bottom
  }

  set paddingBottom(value: number) {
    assertPadding(value, 'Bottom')
    this.pad.Bottom = value
  }

  get paddingLeft(): number {
    return this.pad.Left
  }

  set paddingLeft(value: number) {
    assertPadding(value, 'Left')
    this.pad.Left = value
  }

  appendChild(child: FakeNode): void {
    child.parent = this
    this.children.push(child)
  }

  insertChild(index: number, child: FakeNode): void {
    child.parent = this
    this.children.splice(index, 0, child)
  }

  findAll(): FakeNode[] {
    return this.children.flatMap((child) => [child, ...child.findAll()])
  }

  private mainAxisExtent(): number {
    const gaps = Math.max(0, this.children.length - 1) * this.itemSpacing
    const sizes = this.children.map((child) =>
      this.layoutMode === 'HORIZONTAL' ? child.width : child.height,
    )
    return sizes.reduce((carried, size) => carried + size, 0) + gaps
  }

  private crossAxisExtent(): number {
    const sizes = this.children.map((child) =>
      this.layoutMode === 'HORIZONTAL' ? child.height : child.width,
    )
    return sizes.length === 0 ? 0 : Math.max(...sizes)
  }

  /** Which sizing mode owns a dimension flips with the direction: on a row the
   *  primary axis is the width, on a column it is the height. */
  private isFixed(dimension: 'width' | 'height'): boolean {
    if (this.layoutMode === 'NONE') return true
    const primary = dimension === (this.layoutMode === 'HORIZONTAL' ? 'width' : 'height')
    return primary
      ? this.primaryAxisSizingMode === 'FIXED'
      : this.counterAxisSizingMode === 'FIXED'
  }

  get width(): number {
    if (this.isFixed('width')) return this.fixedWidth
    const extent = this.layoutMode === 'HORIZONTAL' ? this.mainAxisExtent() : this.crossAxisExtent()
    return atLeastFloor(extent + this.paddingLeft + this.paddingRight)
  }

  get height(): number {
    if (this.isFixed('height')) return this.fixedHeight
    const extent = this.layoutMode === 'VERTICAL' ? this.mainAxisExtent() : this.crossAxisExtent()
    return atLeastFloor(extent + this.paddingTop + this.paddingBottom)
  }
}

/** Rough metrics, but deterministic: enough for a layout to have a size. */
const GLYPH = 0.52

class FakeText extends FakeNode {
  type = 'TEXT'
  characters = ''
  fontName: unknown = { family: 'Inter', style: 'Regular' }
  fontSize = 16
  textAlignHorizontal = 'LEFT'
  textAutoResize: 'NONE' | 'HEIGHT' | 'WIDTH_AND_HEIGHT' = 'WIDTH_AND_HEIGHT'
  textDecoration = 'NONE'
  lineHeight: unknown = { unit: 'AUTO' }
  letterSpacing: unknown = { value: 0, unit: 'PERCENT' }

  private get factor(): number {
    const height = this.lineHeight as { unit: string; value?: number }
    return height.unit === 'PERCENT' && height.value !== undefined ? height.value / 100 : 1.35
  }

  get width(): number {
    if (this.textAutoResize === 'WIDTH_AND_HEIGHT') {
      return Math.max(1, this.characters.length * this.fontSize * GLYPH)
    }
    return this.fixedWidth
  }

  get height(): number {
    // the slack keeps a line that fits exactly from rounding down to a
    // character less and reporting two lines: 109.2 / 7.8 is 13.999…
    const perLine = Math.max(1, Math.floor(this.width / (this.fontSize * GLYPH) + 1e-6))
    const lines = Math.max(1, Math.ceil(this.characters.length / perLine))
    return Math.round(lines * this.fontSize * this.factor)
  }

  private checkRange(start: number, end: number): void {
    if (start < 0 || end > this.characters.length || start >= end) {
      throw new Error(`range ${start}..${end} is outside "${this.characters.slice(0, 24)}…"`)
    }
  }

  setRangeFills(start: number, end: number): void {
    this.checkRange(start, end)
  }

  setRangeTextDecoration(start: number, end: number): void {
    this.checkRange(start, end)
  }

  setRangeFontName(start: number, end: number): void {
    this.checkRange(start, end)
  }
}

class FakeRect extends FakeNode {
  type = 'RECTANGLE'
}

class FakeStyle {
  name = ''
  paints: unknown = []
  fontName: unknown = { family: 'Inter', style: 'Regular' }
  fontSize = 16
  lineHeight: unknown = { unit: 'AUTO' }
  letterSpacing: unknown = { value: 0, unit: 'PERCENT' }
  removed = false

  remove(): void {
    this.removed = true
  }
}

class FakePage extends FakeFrame {
  constructor() {
    super()
    this.type = 'PAGE'
  }
}

export interface FakeFigmaLog {
  notices: string[]
  closed: string[]
  zoomed: number
}

export interface FakeFigma {
  log: FakeFigmaLog
  root: { children: FakePage[] }
  currentPage: FakePage
  paintStyles: FakeStyle[]
  textStyles: FakeStyle[]
}

/** Installs the fake on `globalThis.figma` and hands back what it recorded. */
export function installFakeFigma(): FakeFigma {
  const log: FakeFigmaLog = { notices: [], closed: [], zoomed: 0 }
  const first = new FakePage()
  first.name = 'Page 1'
  const root = { children: [first] }
  const paintStyles: FakeStyle[] = []
  const textStyles: FakeStyle[] = []
  const state: FakeFigma = { log, root, currentPage: first, paintStyles, textStyles }

  const api = {
    root,
    get currentPage() {
      return state.currentPage
    },
    set currentPage(page: FakePage) {
      state.currentPage = page
    },
    createFrame: () => new FakeFrame(),
    createText: () => new FakeText(),
    createRectangle: () => new FakeRect(),
    createPage: () => {
      const page = new FakePage()
      root.children.push(page)
      return page
    },
    createNodeFromSvg: (svg: string) => {
      if (!svg.startsWith('<svg')) throw new Error(`not an svg: ${svg.slice(0, 24)}`)
      const frame = new FakeFrame()
      frame.resize(24, 24)
      const child = new FakeRect()
      child.strokes = [{}]
      child.fills = [{}]
      frame.appendChild(child)
      frame.counterAxisSizingMode = 'FIXED'
      frame.primaryAxisSizingMode = 'FIXED'
      return frame
    },
    createPaintStyle: () => {
      const style = new FakeStyle()
      paintStyles.push(style)
      return style
    },
    createTextStyle: () => {
      const style = new FakeStyle()
      textStyles.push(style)
      return style
    },
    getLocalPaintStyles: () => paintStyles.filter((style) => !style.removed),
    getLocalTextStyles: () => textStyles.filter((style) => !style.removed),
    listAvailableFontsAsync: () =>
      Promise.resolve(
        ['Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold'].map((style) => ({
          fontName: { family: 'Inter', style },
        })),
      ),
    loadFontAsync: () => Promise.resolve(),
    notify: (message: string) => {
      log.notices.push(message)
    },
    closePlugin: (message: string) => {
      log.closed.push(message)
    },
    viewport: {
      scrollAndZoomIntoView: (nodes: unknown[]) => {
        log.zoomed = nodes.length
      },
    },
  }

  ;(globalThis as unknown as { figma: unknown }).figma = api
  return state
}

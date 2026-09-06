import { columnFor, type ColumnShape, type Device } from './devices'
import { fill, grow, icon, paint, rect, room, setSize, settleSizing, stack, text } from './nodes'
import { COLORS, SHAPE, TRACKING, TYPE, type ColorName } from './tokens'

/* ------------------------------ wordmark ------------------------------ */

/** The app nav's plain lowercase wordmark. */
export function navWordmark(size: number, onNight = false): TextNode {
  return text('argumenta', {
    size,
    weight: 800,
    color: onNight ? 'luz' : 'ink',
    tracking: TRACKING.title,
    name: 'wordmark',
  })
}

/** "Argu" under the highlighter, as the brand mark is drawn everywhere else.
 *  The stripe sits behind the glyphs, from 44% to 92% of the line. */
export function brandWordmark(size: number, onNight = false): FrameNode {
  const ink: ColorName = onNight ? 'luz' : 'ink'
  const frame = figma.createFrame()
  frame.name = 'brand/Argumenta'
  frame.fills = []
  frame.clipsContent = false
  const argu = text('Argu', { size, weight: 800, color: ink, tracking: TRACKING.title })
  const menta = text('menta', { size, weight: 800, color: ink, tracking: TRACKING.title })
  const pad = size * 0.08
  const stripe = rect(argu.width + pad * 2, size * 0.48, 'marcaTexto')
  frame.resize(argu.width + menta.width, argu.height)
  frame.appendChild(stripe)
  frame.appendChild(argu)
  frame.appendChild(menta)
  stripe.x = -pad
  stripe.y = argu.height * 0.42
  argu.x = 0
  argu.y = 0
  menta.x = argu.width
  menta.y = 0
  return frame
}

/** The BIC pen drawing a highlighter stroke, the brand illustration of the
 *  entry screen and the landing's closing call. */
export function penMark(width: number): FrameNode {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 110"><path d="M18 86 q70 -20 152 -8" fill="none" stroke="${COLORS.marcaTexto}" stroke-width="16" stroke-linecap="round"/><g transform="rotate(38 172 74)"><rect x="166" y="28" width="13" height="40" rx="4" fill="${COLORS.caneta}"/><path d="M166 68 h13 l-6.5 14 z" fill="${COLORS.ink}"/><circle cx="172.5" cy="79" r="1.6" fill="${COLORS.paper}"/></g></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'PenMark'
  node.resize(width, width * (110 / 220))
  return node
}

/* --------------------------------- nav -------------------------------- */

export type TabId = 'trilha' | 'progresso' | 'conta'

interface Tab {
  id: TabId
  label: string
  svg: string
}

const STROKE = `stroke="${COLORS.ink2}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`

const TABS: Tab[] = [
  {
    id: 'trilha',
    label: 'Trilha',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M6 20.5V4.5m0 .8h10.2l-1.6 3.4 1.6 3.4H6" ${STROKE}/></svg>`,
  },
  {
    id: 'progresso',
    label: 'Progresso',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M4 16.4 9.2 10l4 3.6L20 5.4" ${STROKE}/><path d="M4 20h16" ${STROKE}/></svg>`,
  },
  {
    id: 'conta',
    label: 'Conta',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.4" r="3.5" ${STROKE}/><path d="M5.4 19.4c1.1-3.3 3.5-5 6.6-5s5.5 1.7 6.6 5" ${STROKE}/></svg>`,
  },
]

function tabPill(tab: Tab, active: boolean, size: number, height: number, gap: number): FrameNode {
  const ink: ColorName = active ? 'caneta' : 'ink2'
  const pill = stack({
    name: `tab/${tab.id}`,
    direction: 'HORIZONTAL',
    gap,
    padding: [0, height >= 46 ? 12 : 14],
    fill: active ? 'canetaSoft' : null,
    radius: height >= 46 ? SHAPE.button : SHAPE.tile,
    align: 'CENTER',
  })
  setSize(pill, { height })
  pill.appendChild(icon(tab.svg, size, ink))
  pill.appendChild(text(tab.label, { size: TYPE.body, weight: 600, color: ink, tracking: TRACKING.body }))
  return pill
}

/** The phone nav is a dock: it leaves the edges, carries its own border and
 *  marks the live tab with a step of caneta on its top edge, which is where the
 *  eye lands before it reads the label. */
function tabBar(device: Device, active: TabId | null): FrameNode {
  const holder = stack({
    name: 'nav/tabbar',
    direction: 'HORIZONTAL',
    padding: [0, DOCK.side, DOCK.below, DOCK.side],
    width: device.width,
  })
  const dock = stack({
    name: 'dock',
    direction: 'HORIZONTAL',
    padding: [0, 6, DOCK.pad, 6],
    fill: 'card',
    radius: SHAPE.dock,
    border: { color: 'line', weight: 1 },
    width: device.width - DOCK.side * 2,
  })
  for (const tab of TABS) {
    const isActive = tab.id === active
    const ink: ColorName = isActive ? 'caneta' : 'ink2'
    // MIN, so the step stays on the dock's top edge and the slack falls under
    // the label, where the thumb wants it
    const cell = stack({ name: `tab/${tab.id}`, gap: DOCK.gap, align: 'CENTER', justify: 'MIN' })
    cell.appendChild(step(isActive))
    cell.appendChild(icon(tab.svg, 23, ink))
    cell.appendChild(text(tab.label, { size: TYPE.micro, weight: isActive ? 700 : 500, color: ink }))
    // the 44px floor for a thumb, with the step's own row over it
    setSize(cell, { height: Math.max(DOCK.step + DOCK.gap + DOCK.thumb, cell.height) })
    dock.appendChild(grow(cell))
  }
  holder.appendChild(fill(dock))
  return holder
}

const DOCK = { side: 14, below: 12, pad: 12, gap: 5, step: 3, stepWidth: 30, thumb: 44 }

/** The caneta step over the live tab. The other tabs keep the same empty slot,
 *  so every icon sits on one row instead of centring itself in its own cell. */
function step(live: boolean): FrameNode {
  const frame = stack({ name: 'step', fill: live ? 'caneta' : null, radius: DOCK.step })
  setSize(frame, { width: DOCK.stepWidth, height: DOCK.step })
  return frame
}

function topBar(device: Device, active: TabId | null): FrameNode {
  const bar = stack({
    name: 'nav/topbar',
    direction: 'HORIZONTAL',
    gap: 30,
    padding: [0, 28],
    fill: 'card',
    border: { color: 'line', weight: 1, sides: ['bottom'] },
    align: 'CENTER',
    width: device.width,
  })
  setSize(bar, { width: device.width, height: 66 })
  bar.appendChild(navWordmark(TYPE.lead))
  const tabs = stack({ name: 'tabs', direction: 'HORIZONTAL', gap: 4, align: 'CENTER' })
  for (const tab of TABS) tabs.appendChild(tabPill(tab, tab.id === active, 20, 40, 9))
  bar.appendChild(tabs)
  return bar
}

function rail(active: TabId | null): FrameNode {
  const nav = stack({
    name: 'nav/rail',
    gap: 28,
    padding: [26, 16, 22, 16],
    fill: 'card',
    border: { color: 'line', weight: 1, sides: ['right'] },
    width: 248,
  })
  const mark = navWordmark(TYPE.lead)
  const markRow = stack({ name: 'wordmark', padding: [0, 12] })
  markRow.appendChild(mark)
  nav.appendChild(markRow)
  const tabs = stack({ name: 'tabs', gap: 4, width: 216 })
  for (const tab of TABS) tabs.appendChild(fill(tabPill(tab, tab.id === active, 22, 46, 12)))
  nav.appendChild(fill(tabs))
  return nav
}

/* ------------------------------ screen frame --------------------------- */

export interface ScreenSpec {
  /** The route's own name, used for the frame's label. */
  name: string
  /** Screens inside AppShell get the nav; the writing flow and auth do not. */
  shell: boolean
  tab?: TabId
  shape: ColumnShape
  /** A screen that centres its content in the viewport instead of stacking. */
  centred?: boolean
}

export interface Screen {
  frame: FrameNode
  /** Where the screen's blocks go. */
  content: FrameNode
  width: number
}

export interface FrameSpec {
  name: string
  axis: 'VERTICAL' | 'HORIZONTAL'
  align?: 'MIN' | 'CENTER'
  /** Where the blocks sit along the frame's own direction. */
  justify?: 'MIN' | 'CENTER'
}

/** The paper the viewport is drawn on. Every frame on the canvas starts here,
 *  so the sizing rules live in one place. The height hugs while the screen is
 *  being written: a frame that states it before its content exists pins the
 *  children that fill it, and then the page ends at the fold. `fitToDevice`
 *  states it once, at the end, when there is something to measure. */
export function deviceFrame(device: Device, spec: FrameSpec): FrameNode {
  const frame = figma.createFrame()
  frame.name = `${spec.name} · ${device.width}`
  frame.fills = paint('paper')
  frame.clipsContent = false
  frame.layoutMode = spec.axis
  frame.counterAxisAlignItems = spec.align ?? 'MIN'
  frame.primaryAxisAlignItems = spec.justify ?? 'MIN'
  setSize(frame, { width: device.width })
  return frame
}

/** The device frame with its paper, its nav in the shape that width uses, and
 *  the content column the screen writes into. */
export function screenFrame(device: Device, spec: ScreenSpec): Screen {
  const column = columnFor(device, spec.shape)
  const frame = deviceFrame(device, {
    name: spec.name,
    axis: device.nav === 'rail' && spec.shell ? 'HORIZONTAL' : 'VERTICAL',
  })

  const body = stack({
    name: 'body',
    padding: [column.padTop, column.padX, column.padBottom, column.padX],
    align: 'CENTER',
    justify: spec.centred === true ? 'CENTER' : 'MIN',
  })
  const content = stack({ name: 'content', gap: column.gap, width: column.width })

  const sideways = frame.layoutMode === 'HORIZONTAL'
  if (spec.shell && device.nav === 'topbar') frame.appendChild(fill(topBar(device, spec.tab ?? null)))
  if (spec.shell && sideways) frame.appendChild(fill(rail(spec.tab ?? null)))

  body.appendChild(content)
  // beside the rail the body only takes the slack; stretching it too would make
  // the frame's own height circular when it hugs the content
  frame.appendChild(sideways ? grow(body) : grow(fill(body)))

  if (spec.shell && device.nav === 'tabbar') frame.appendChild(fill(tabBar(device, spec.tab ?? null)))
  return { frame, content, width: column.width }
}

/** Grows the frame when the screen is taller than the device, so nothing is
 *  cut, and keeps the tab bar at the bottom of a short one. */
export function fitToDevice(frame: FrameNode, device: Device): FrameNode {
  setSize(frame, { width: device.width })
  if (frame.height < device.height) setSize(frame, { width: device.width, height: device.height })
  return settleSizing(frame)
}

/** What a column screen ends with: the frame, sized to its own content. */
export function settle(screen: Screen, device: Device): FrameNode {
  return fitToDevice(screen.frame, device)
}

/* -------------------------------- blocks ------------------------------- */

/** The `.bar` row every screen opens with: a back link and a chip or two. */
export function screenBar(width: number, back: string | null, right: SceneNode[]): FrameNode {
  const bar = stack({
    name: 'bar',
    direction: 'HORIZONTAL',
    gap: 12,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width,
  })
  if (back !== null) {
    bar.appendChild(text(back, { size: TYPE.meta, weight: 600, color: 'ink2' }))
  } else {
    bar.appendChild(stack({ name: 'spacer' }))
  }
  const chips = stack({ name: 'chips', direction: 'HORIZONTAL', gap: 6, align: 'CENTER' })
  for (const node of right) chips.appendChild(node)
  bar.appendChild(chips)
  return bar
}

export interface NightOptions {
  width: number
  size: number
  padding?: number
}

/** The night panel: what the student is looking at before anyone speaks. */
export function nightPanel(body: string, options: NightOptions): FrameNode {
  const pad = options.padding ?? 20
  const frame = stack({
    name: 'narration',
    padding: pad,
    fill: 'noite',
    radius: SHAPE.card,
    width: options.width,
  })
  frame.appendChild(
    text(body, {
      size: options.size,
      color: 'luz',
      lineHeight: 1.62,
      tracking: TRACKING.body,
      width: room(frame),
    }),
  )
  return frame
}

export interface SpeechOptions {
  speech: string
  who: string
  width: number
  size: number
}

/** A character's line: typographic attribution, no avatar. */
export function speechRow(options: SpeechOptions): FrameNode {
  const frame = stack({
    name: `speech/${options.who}`,
    gap: 13,
    padding: [18, 18, 15, 18],
    fill: 'card',
    radius: SHAPE.card,
    border: { color: 'line', weight: 1 },
    width: options.width,
  })
  const quoted = text(`“${options.speech}”`, {
    size: options.size,
    weight: 600,
    lineHeight: 1.48,
    tracking: TRACKING.lead,
    width: room(frame),
  })
  quoted.setRangeFills(0, 1, paint('lineStrong'))
  quoted.setRangeFills(quoted.characters.length - 1, quoted.characters.length, paint('lineStrong'))
  frame.appendChild(quoted)
  const whoRow = stack({ name: 'who', direction: 'HORIZONTAL', gap: 9, align: 'CENTER' })
  whoRow.appendChild(rect(18, 1, 'lineStrong'))
  whoRow.appendChild(text(options.who, { size: TYPE.meta, weight: 700, color: 'ink2' }))
  frame.appendChild(whoRow)
  return frame
}

const COVER_DONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="m5.5 12.4 4.2 4.1L18.5 7.6" stroke="${COLORS.aprovado}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const COVER_LOCKED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="4.8" y="10.6" width="14.4" height="9.4" rx="2.6" stroke="${COLORS.muted}" stroke-width="1.75"/><path d="M8.6 10.6V7.9a3.4 3.4 0 0 1 6.8 0v2.7" stroke="${COLORS.muted}" stroke-width="1.75"/></svg>`

export type StoryState = 'available' | 'in_progress' | 'completed' | 'locked'

/** The cover slot: the story's place in the track, or its state. Never a
 *  drawing pretending to be cover art. */
export function storyCover(position: number, state: StoryState): FrameNode {
  const done = state === 'completed'
  const locked = state === 'locked'
  const frame = stack({
    name: 'cover',
    direction: 'HORIZONTAL',
    fill: done ? 'aprovadoSoft' : locked ? 'paper' : 'noite',
    radius: SHAPE.tile,
    align: 'CENTER',
    justify: 'CENTER',
    width: 52,
  })
  setSize(frame, { width: 52, height: 52 })
  if (done) frame.appendChild(icon(COVER_DONE, 22, 'aprovado'))
  else if (locked) frame.appendChild(icon(COVER_LOCKED, 22, 'muted'))
  else frame.appendChild(text(String(position), { size: TYPE.lead, weight: 800, color: 'luz', tracking: TRACKING.title }))
  return frame
}

/** The label above a band of frames on the canvas. */
export function bandLabel(label: string): TextNode {
  return text(label, { size: 28, weight: 700, color: 'muted', tracking: TRACKING.title, name: `band/${label}` })
}

export function frameLabel(label: string): TextNode {
  return text(label, { size: 16, weight: 600, color: 'muted', name: `label/${label}` })
}


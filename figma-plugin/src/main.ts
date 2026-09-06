import { bandLabel, frameLabel } from './chrome'
import { DEVICES } from './devices'
import { loadFonts } from './nodes'
import { DEVICE_SCREENS, LANDING } from './screens/index'
import { createStyles } from './styles'
import { systemBoard } from './screens/system'

const PAGE_NAME = 'Argumenta · v3'
const FRAME_GAP = 96
const LABEL_GAP = 44
const BAND_GAP = 200

/** One page, replaced on every run, so the file never collects stale copies. */
function freshPage(): PageNode {
  const page = figma.createPage()
  page.name = PAGE_NAME
  figma.currentPage = page
  for (const existing of [...figma.root.children]) {
    if (existing !== page && existing.name === PAGE_NAME) existing.remove()
  }
  return page
}

interface Cursor {
  page: PageNode
  y: number
  placed: SceneNode[]
}

function band(cursor: Cursor, label: string): void {
  const heading = bandLabel(label)
  cursor.page.appendChild(heading)
  heading.x = 0
  heading.y = cursor.y
  cursor.placed.push(heading)
  cursor.y += 56
}

/** A row of frames, each under its own label, left to right. */
function row(cursor: Cursor, frames: { label: string; frame: FrameNode }[]): void {
  let x = 0
  let tallest = 0
  for (const entry of frames) {
    const label = frameLabel(entry.label)
    cursor.page.appendChild(label)
    label.x = x
    label.y = cursor.y
    cursor.page.appendChild(entry.frame)
    entry.frame.x = x
    entry.frame.y = cursor.y + LABEL_GAP
    cursor.placed.push(label, entry.frame)
    x += entry.frame.width + FRAME_GAP
    tallest = Math.max(tallest, entry.frame.height)
  }
  cursor.y += LABEL_GAP + tallest + BAND_GAP
}

async function main(): Promise<void> {
  await loadFonts()
  const page = freshPage()
  createStyles()
  const cursor: Cursor = { page, y: 0, placed: [] }

  band(cursor, 'Sistema visual')
  row(cursor, [{ label: 'Tokens, tipografia e componentes', frame: systemBoard() }])

  band(cursor, 'Landing · a página de marca')
  row(
    cursor,
    DEVICES.map((device) => ({ label: device.label, frame: LANDING.build(device) })),
  )

  for (const device of DEVICES) {
    band(cursor, device.label)
    row(
      cursor,
      DEVICE_SCREENS.map((screen) => ({ label: screen.label, frame: screen.build(device) })),
    )
  }

  figma.viewport.scrollAndZoomIntoView(cursor.placed)
  const count = 3 + DEVICES.length * DEVICE_SCREENS.length
  figma.closePlugin(`Argumenta v3: ${count} telas em uma página, mais o sistema visual.`)
}

main().catch((failure: unknown) => {
  const message = failure instanceof Error ? failure.message : String(failure)
  figma.closePlugin(`Erro ao desenhar: ${message}`)
})

/** Sizing helpers shared by every screen: the reading step, the screen title
 *  and the row-of-equal-columns stand-in for a CSS grid. */
import type { Device } from '../devices'
import { fill, setSize, stack, text } from '../nodes'
import { TRACKING, TYPE } from '../tokens'

/** The reading step goes up once on a desktop, as the stylesheet does. */
export function readingSize(device: Device): number {
  return device.id === 'desktop' ? TYPE.title : TYPE.lead
}

export function screenTitle(label: string, device: Device): TextNode {
  return text(label, {
    size: device.id === 'desktop' ? TYPE.display : TYPE.title,
    weight: 800,
    tracking: TRACKING.title,
    lineHeight: 1.15,
  })
}

/** The width one cell of a `columns` grid gets. */
function cellWidth(width: number, perRow: number, gap: number): number {
  return Math.floor((width - gap * (perRow - 1)) / perRow)
}

export interface Grid<T> {
  items: T[]
  perRow: number
  /** The row's width, which its cells divide between them. */
  width: number
  gap: number
  /** Builds one cell, at the width it is going to occupy. */
  build: (item: T, cell: number) => FrameNode
}

/** Rows of equal columns, since Figma auto-layout has no grid. The cell width
 *  goes to the builder because resizing a card afterwards moves only its shell:
 *  everything inside was sized against the width it was built at. */
export function columns<T>(grid: Grid<T>): FrameNode[] {
  const cell = cellWidth(grid.width, grid.perRow, grid.gap)
  const rows: FrameNode[] = []
  for (let index = 0; index < grid.items.length; index += grid.perRow) {
    const row = stack({
      name: 'row',
      direction: 'HORIZONTAL',
      gap: grid.gap,
      align: 'MIN',
      width: grid.width,
    })
    for (const item of grid.items.slice(index, index + grid.perRow)) {
      row.appendChild(fill(grid.build(item, cell)))
    }
    rows.push(evenHeights(row, grid.width))
  }
  return rows
}

/** A row of cards is a flex row in the stylesheet: they share the height of the
 *  tallest one, so their bottom edges line up. The row has to state that height
 *  for the cards to be able to fill it. */
export function evenHeights(row: FrameNode, width: number): FrameNode {
  const tallest = Math.max(...row.children.map((child) => child.height))
  setSize(row, { width, height: tallest })
  return row
}

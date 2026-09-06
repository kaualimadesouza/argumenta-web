/** Sizing helpers shared by every screen: the reading step, the screen title
 *  and the row-of-equal-columns stand-in for a CSS grid. */
import type { Device } from '../devices'
import { stack, text } from '../nodes'
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

/** The width one cell of a `columns` grid gets. Callers need it up front,
 *  because a card sizes its own text against it. */
export function cellWidth(width: number, perRow: number, gap: number): number {
  return Math.floor((width - gap * (perRow - 1)) / perRow)
}

/** Rows of equal columns, since Figma auto-layout has no grid. Resizing a card
 *  here would only move its shell: what it holds was sized against the width it
 *  was built at, so a card of the wrong width is a caller's mistake. */
export function columns(cards: FrameNode[], perRow: number, width: number, gap: number): FrameNode[] {
  const cell = cellWidth(width, perRow, gap)
  const rows: FrameNode[] = []
  for (const card of cards) {
    if (Math.round(card.width) !== cell) {
      throw new Error(`${card.name} is ${card.width}px wide in a ${cell}px cell: build it at cellWidth`)
    }
  }
  for (let index = 0; index < cards.length; index += perRow) {
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap, align: 'MIN', width })
    for (const node of cards.slice(index, index + perRow)) row.appendChild(node)
    rows.push(row)
  }
  return rows
}

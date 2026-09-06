import { laidOut, room, states, type Dimension } from '../nodes'

/** What has to be true of any tree the plugin builds, measured from the nodes
 *  themselves rather than read off their sizing modes, so that a wrong hug in
 *  the fake cannot make an invariant vacuous. */

export interface Overflow {
  frame: string
  height: number
  content: number
}

/** Half a pixel of slack: the fake's text metrics are rough on purpose. */
const SLACK = 0.5

function contentHeight(frame: FrameNode): number {
  const children = frame.children
  if (children.length === 0) return 0
  const outside = frame.height - room(frame, 'height')
  if (frame.layoutMode === 'HORIZONTAL') {
    return Math.max(...children.map((child) => child.height)) + outside
  }
  const gaps = (children.length - 1) * frame.itemSpacing
  return children.reduce((carried, child) => carried + child.height, 0) + gaps + outside
}

export function overflows(node: SceneNode): Overflow[] {
  if (node.type !== 'FRAME') return []
  const content = contentHeight(node)
  const spills = node.layoutMode !== 'NONE' && node.layoutWrap !== 'WRAP' && node.height + SLACK < content
  const own: Overflow[] = spills ? [{ frame: node.name, height: node.height, content }] : []
  return [...own, ...node.children.flatMap(overflows)]
}

export interface Unfilled {
  parent: string
  child: string
  got: number
  room: number
}

/** A frame told to span its parent's cross axis has to measure it: Figma keeps
 *  the hug when a frame stretches an axis it also hugs, and then the button
 *  shrinks to its label and the night panel stops at its text. Only frames can
 *  hit that contradiction, since only they hug their own content. */
export function unfilled(node: SceneNode): Unfilled[] {
  if (node.type !== 'FRAME') return []
  const sideways = node.layoutMode === 'HORIZONTAL'
  const inside = room(node, sideways ? 'height' : 'width')
  const own = node.children
    .filter((child) => child.type === 'FRAME' && child.layoutAlign === 'STRETCH')
    .map((child) => ({
      parent: node.name,
      child: child.name,
      got: sideways ? child.height : child.width,
      room: inside,
    }))
    .filter((entry) => Math.abs(entry.got - entry.room) > SLACK)
  return [...own, ...node.children.flatMap(unfilled)]
}

export interface Pinned {
  parent: string
  child: string
  dimension: Dimension
}

/** A child sized against a parent that hugs it back. Figma obeys the sizing
 *  anyway, pinning the child to a parent that is still measuring it, and the
 *  content spills below the frame: that is the page that ends at the fold. */
export function pinned(node: SceneNode): Pinned[] {
  if (node.type !== 'FRAME') return []
  const cross: Dimension = node.layoutMode === 'HORIZONTAL' ? 'height' : 'width'
  const main: Dimension = node.layoutMode === 'HORIZONTAL' ? 'width' : 'height'
  const own: Pinned[] = []
  for (const child of node.children) {
    if (!laidOut(child)) continue
    if (child.layoutAlign === 'STRETCH' && !states(node, cross)) {
      own.push({ parent: node.name, child: child.name, dimension: cross })
    }
    if (child.layoutGrow === 1 && !states(node, main)) {
      own.push({ parent: node.name, child: child.name, dimension: main })
    }
  }
  return [...own, ...node.children.flatMap(pinned)]
}

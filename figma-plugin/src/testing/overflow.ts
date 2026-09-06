/** Figma's sizing modes are axis-relative, so a frame can end up with a fixed
 *  height of 0.01 and its children spilling over the block below it. This walks
 *  a built tree and reports every auto-layout frame shorter than what it holds. */

interface LayoutFrame {
  name: string
  width: number
  height: number
  layoutMode: 'VERTICAL' | 'HORIZONTAL' | 'NONE'
  layoutWrap: string
  itemSpacing: number
  paddingTop: number
  paddingBottom: number
  children: unknown[]
}

export interface Overflow {
  frame: string
  height: number
  content: number
}

/** Half a pixel of slack: the fake's text metrics are rough on purpose. */
const SLACK = 0.5

function isLayoutFrame(node: unknown): node is LayoutFrame {
  return typeof node === 'object' && node !== null && 'layoutMode' in node && 'children' in node
}

function contentHeight(frame: LayoutFrame): number {
  const children = frame.children.filter(hasHeight)
  if (children.length === 0) return 0
  const padding = frame.paddingTop + frame.paddingBottom
  if (frame.layoutMode === 'HORIZONTAL') {
    return Math.max(...children.map((child) => child.height)) + padding
  }
  const gaps = (children.length - 1) * frame.itemSpacing
  return children.reduce((carried, child) => carried + child.height, 0) + gaps + padding
}

function hasHeight(node: unknown): node is { height: number } {
  return typeof node === 'object' && node !== null && 'height' in node
}

export function overflows(node: unknown): Overflow[] {
  if (!isLayoutFrame(node)) return []
  const own: Overflow[] =
    node.layoutMode !== 'NONE' && node.layoutWrap !== 'WRAP' && node.height + SLACK < contentHeight(node)
      ? [{ frame: node.name, height: node.height, content: contentHeight(node) }]
      : []
  return [...own, ...node.children.flatMap(overflows)]
}

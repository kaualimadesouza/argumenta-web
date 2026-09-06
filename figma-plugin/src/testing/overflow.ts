/** Figma's sizing modes are axis-relative, so a frame can end up with a fixed
 *  height of 0.01 and its children spilling over the block below it. The
 *  content is measured here rather than read off the node, so a wrong hug in
 *  the fake cannot make the invariant vacuous. */

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
  const padding = frame.paddingTop + frame.paddingBottom
  if (frame.layoutMode === 'HORIZONTAL') {
    return Math.max(...children.map((child) => child.height)) + padding
  }
  const gaps = (children.length - 1) * frame.itemSpacing
  return children.reduce((carried, child) => carried + child.height, 0) + gaps + padding
}

export function overflows(node: SceneNode): Overflow[] {
  if (node.type !== 'FRAME') return []
  const content = contentHeight(node)
  const spills = node.layoutMode !== 'NONE' && node.layoutWrap !== 'WRAP' && node.height + SLACK < content
  const own: Overflow[] = spills ? [{ frame: node.name, height: node.height, content }] : []
  return [...own, ...node.children.flatMap(overflows)]
}

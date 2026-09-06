/** Reads the app's own token sheet, so the plugin's palette can be checked
 *  against it instead of being trusted. */
export interface RootBlock {
  /** 0 for the bare `:root`, the media query's min-width in rem otherwise. */
  minWidthRem: number
  declarations: Map<string, string>
}

const MEDIA = /@media\s*\(min-width:\s*([\d.]+)rem\s*\)\s*\{/g
const ROOT = /:root\s*\{/g

function closingBrace(css: string, open: number): number {
  let depth = 0
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return css.length
}

function declarationsOf(body: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const line of body.split(';')) {
    const match = /^\s*(--[\w-]+)\s*:\s*([^;]*)$/.exec(line)
    if (match) found.set(match[1], match[2].trim())
  }
  return found
}

interface MediaRange {
  minWidthRem: number
  start: number
  end: number
}

function mediaRanges(css: string): MediaRange[] {
  const ranges: MediaRange[] = []
  MEDIA.lastIndex = 0
  for (let hit = MEDIA.exec(css); hit !== null; hit = MEDIA.exec(css)) {
    const open = css.indexOf('{', hit.index)
    ranges.push({
      minWidthRem: Number(hit[1]),
      start: hit.index,
      end: closingBrace(css, open),
    })
  }
  return ranges
}

/** Every `:root` block in the sheet, tagged with the breakpoint it sits under.
 *  Comments go first: the sheet annotates most groups, and a comment ahead of a
 *  declaration would otherwise hide it. */
export function rootBlocks(source: string): RootBlock[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const ranges = mediaRanges(css)
  const blocks: RootBlock[] = []
  ROOT.lastIndex = 0
  for (let hit = ROOT.exec(css); hit !== null; hit = ROOT.exec(css)) {
    const open = css.indexOf('{', hit.index)
    const enclosing = ranges.find((range) => hit.index > range.start && hit.index < range.end)
    blocks.push({
      minWidthRem: enclosing?.minWidthRem ?? 0,
      declarations: declarationsOf(css.slice(open + 1, closingBrace(css, open))),
    })
  }
  return blocks
}

/** The value in force at a given viewport: the widest matching block wins. */
export function tokenAt(blocks: RootBlock[], name: string, minWidthRem: number): string | null {
  let value: string | null = null
  for (const block of blocks) {
    if (block.minWidthRem <= minWidthRem && block.declarations.has(name)) {
      value = block.declarations.get(name) ?? null
    }
  }
  return value
}

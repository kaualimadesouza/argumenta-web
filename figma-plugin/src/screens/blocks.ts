import { nightPanel, screenBar, speechRow, storyCover } from '../chrome'
import type { Device } from '../devices'
import { fill, grow, rect, stack, text } from '../nodes'
import { SCENE, type StorySample } from '../samples'
import { SHAPE, TRACKING, TYPE } from '../tokens'
import { arrowBullet, button, card, chip, field, kicker, markBadge, progressBar, tick } from '../ui'

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

/** Rows of equal columns, since Figma auto-layout has no grid. */
export function columns(cards: FrameNode[], perRow: number, width: number, gap: number): FrameNode[] {
  const cell = cellWidth(width, perRow, gap)
  const rows: FrameNode[] = []
  for (let index = 0; index < cards.length; index += perRow) {
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap, align: 'MIN', width })
    for (const node of cards.slice(index, index + perRow)) {
      node.resize(cell, node.height)
      row.appendChild(node)
    }
    rows.push(row)
  }
  return rows
}

/* -------------------------------- trilha ------------------------------- */

export interface StoryCardOptions {
  story: StorySample
  width: number
  /** The story in progress lies down across the full width on a wide screen. */
  featured: boolean
  device: Device
}

export function storyCard(options: StoryCardOptions): FrameNode {
  const { story, width, featured, device } = options
  const shell = card({
    active: story.state === 'in_progress',
    gap: 14,
    width,
    name: `story/${story.title}`,
  })
  const lying = featured && device.id !== 'phone'
  const inner = stack({
    name: 'story',
    direction: lying ? 'HORIZONTAL' : 'VERTICAL',
    gap: 14,
    align: lying ? 'CENTER' : 'MIN',
    width: width - 36,
  })
  const top = stack({ name: 'top', direction: 'HORIZONTAL', gap: 14, align: 'MIN' })
  top.appendChild(storyCover(story.position, story.state))
  const bodyWidth = (lying ? width - 36 - 220 : width - 36) - 66
  const body = stack({ name: 'body', gap: 8, width: bodyWidth })
  const titleRow = stack({
    name: 'titleRow',
    direction: 'HORIZONTAL',
    gap: 8,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width: bodyWidth,
  })
  titleRow.appendChild(
    text(story.title, {
      size: featured && device.id === 'desktop' ? TYPE.lead : TYPE.body,
      weight: 700,
      tracking: -1.8,
    }),
  )
  titleRow.appendChild(chip(story.badge, story.badgeTone))
  body.appendChild(fill(titleRow))
  body.appendChild(
    fill(
      text(story.line, {
        size: TYPE.meta,
        weight: 500,
        color: 'muted',
        lineHeight: 1.45,
        width: bodyWidth,
      }),
    ),
  )
  body.appendChild(progressBar({ percent: story.percent, width: bodyWidth, tone: story.state === 'completed' ? 'done' : 'caneta' }))
  top.appendChild(grow(body))
  inner.appendChild(lying ? grow(top) : fill(top))
  if (story.cta !== null) {
    const cta = button(story.cta)
    if (lying) {
      cta.layoutSizingHorizontal = 'HUG'
      inner.appendChild(cta)
    } else {
      inner.appendChild(fill(cta))
    }
  }
  shell.appendChild(fill(inner))
  return shell
}

/* ------------------------------- progresso ----------------------------- */

const SPARK = { width: 120, height: 26, inset: 2, max: 100 }

/** The same polyline the app draws, so the shape a designer sees is the real one. */
export function sparkline(points: number[], down: boolean): FrameNode {
  const step = (SPARK.width - SPARK.inset * 2) / (points.length - 1)
  const usable = SPARK.height - SPARK.inset * 2
  const drawn = points
    .map((score, index) => {
      const y = SPARK.inset + usable * (1 - Math.min(Math.max(score, 0), SPARK.max) / SPARK.max)
      return `${SPARK.inset + step * index},${y}`
    })
    .join(' ')
  const stroke = down ? '#D92D20' : '#2649E5'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SPARK.width} ${SPARK.height}"><polyline points="${drawn}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'sparkline'
  node.resize(SPARK.width, SPARK.height)
  return node
}

/* -------------------------------- profile ------------------------------ */

export function nicknameCard(width: number): FrameNode {
  const shell = card({ gap: 12, width, name: 'card/apelido' })
  shell.appendChild(kicker('Como quer ser chamado'))
  const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 8, align: 'MAX', width: width - 36 })
  const input = field({ label: 'Apelido', value: 'Kauã', width: width - 36 - 8 - 92 })
  row.appendChild(grow(input))
  const save = button('Salvar', 'ghost')
  save.layoutSizingHorizontal = 'HUG'
  row.appendChild(save)
  shell.appendChild(fill(row))
  return shell
}

export function targetsCard(width: number): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 12, width, name: 'card/vestibulares' })
  shell.appendChild(kicker('A lente da sua correção'))
  shell.appendChild(text('Seus vestibulares', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 8, align: 'MAX', width: inner })
  const half = Math.floor((inner - 16 - 108) / 2)
  row.appendChild(grow(field({ label: 'Vestibular', value: 'ENEM', width: half, select: true })))
  row.appendChild(grow(field({ label: 'Ano', value: '2026', width: half, select: true })))
  const add = button('Adicionar', 'ghost')
  add.layoutSizingHorizontal = 'HUG'
  row.appendChild(add)
  shell.appendChild(fill(row))
  const list = stack({ name: 'list', gap: 8, width: inner })
  list.appendChild(fill(targetItem('ENEM 2026', true, inner, false)))
  list.appendChild(fill(targetItem('FUVEST 2027', false, inner, true)))
  shell.appendChild(fill(list))
  return shell
}

function targetItem(name: string, active: boolean, width: number, ruled: boolean): FrameNode {
  const item = stack({
    name: `target/${name}`,
    direction: 'HORIZONTAL',
    gap: 8,
    padding: ruled ? [8, 0, 0, 0] : 0,
    align: 'CENTER',
    width,
    border: ruled ? { color: 'line', weight: 1, sides: ['top'] } : undefined,
  })
  item.appendChild(grow(text(name, { size: TYPE.body, weight: 600 })))
  item.appendChild(active ? chip('Lente ativa') : button(`Usar a lente ${name}`, 'quiet'))
  item.appendChild(button('Remover', 'quiet'))
  return item
}

export function dangerCard(width: number): FrameNode {
  const shell = card({ gap: 12, width, name: 'card/conta' })
  shell.appendChild(text('Sessão e conta', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  shell.appendChild(fill(button('Sair da conta', 'ghost')))
  const quiet = button('Excluir minha conta', 'quiet')
  quiet.layoutSizingHorizontal = 'HUG'
  shell.appendChild(quiet)
  return shell
}

/* --------------------------------- scene ------------------------------- */

export function sceneBeats(width: number, device: Device): FrameNode[] {
  const size = readingSize(device)
  const pad = device.id === 'desktop' ? 28 : 20
  const objective = card({ active: true, gap: 8, padding: 17, width, name: 'beat/objetivo' })
  objective.appendChild(kicker('Seu objetivo'))
  objective.appendChild(
    fill(text(SCENE.objective, { size: TYPE.body, weight: 600, lineHeight: 1.5, width: width - 34 })),
  )
  const hint = card({ gap: 8, padding: 17, width, name: 'beat/dica' })
  hint.appendChild(kicker('Dica de repertório', 'streak'))
  hint.appendChild(
    fill(text(SCENE.hint, { size: TYPE.body, color: 'ink2', lineHeight: 1.58, width: width - 34 })),
  )
  return [
    nightPanel(SCENE.narration, { width, size, padding: pad }),
    speechRow({ speech: SCENE.speech, who: SCENE.speaker, width, size }),
    objective,
    hint,
  ]
}

/* ------------------------------- correction ---------------------------- */

export function verdictHeadline(width: number, device: Device): FrameNode {
  const frame = stack({
    name: 'headline',
    gap: 9,
    padding: 18,
    fill: 'corretorSoft',
    radius: SHAPE.card,
    border: { color: 'corretor', weight: 1.5 },
    width,
  })
  frame.appendChild(
    text('Quase. A norma culta segurou você.', {
      size: device.id === 'desktop' ? TYPE.display : TYPE.title,
      weight: 800,
      color: 'corretorInk',
      tracking: TRACKING.title,
      lineHeight: 1.18,
      width: width - 36,
    }),
  )
  frame.appendChild(
    fill(
      text(
        'O argumento convence Seu Tenório, mas 1 desvio de escrita derrubou a nota abaixo do piso. Corrija e reenvie: a história continua esperando.',
        { size: TYPE.body, lineHeight: 1.55, width: width - 36 },
      ),
    ),
  )
  return frame
}

export function legendCard(width: number, marks: { number: number; kind: string; message: string; tone: 'slip' | 'praise' }[]): FrameNode {
  const shell = card({ gap: 16, width, name: 'card/marcacoes' })
  shell.appendChild(text('As marcações', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const list = stack({ name: 'legend', gap: 14, width: width - 36 })
  for (const mark of marks) {
    const row = stack({ name: `mark/${mark.number}`, direction: 'HORIZONTAL', gap: 11, align: 'MIN', width: width - 36 })
    row.appendChild(markBadge(mark.number, mark.tone))
    const line = text(`${mark.kind} ${mark.message}`, {
      size: TYPE.meta,
      color: 'ink2',
      lineHeight: 1.55,
      width: width - 36 - 26,
    })
    line.setRangeFills(0, mark.kind.length, [{ type: 'SOLID', color: { r: 16 / 255, g: 20 / 255, b: 24 / 255 } }])
    row.appendChild(fill(line))
    list.appendChild(fill(row))
  }
  shell.appendChild(fill(list))
  return shell
}

export function paraPassarCard(width: number, steps: string[]): FrameNode {
  const shell = card({ gap: 16, width, name: 'card/para-passar' })
  shell.appendChild(text('Para passar', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const list = stack({ name: 'steps', gap: 14, width: width - 36 })
  for (const step of steps) {
    const row = stack({ name: 'step', direction: 'HORIZONTAL', gap: 11, align: 'MIN', width: width - 36 })
    const bullet = arrowBullet()
    row.appendChild(bullet)
    row.appendChild(
      fill(text(step, { size: TYPE.body, lineHeight: 1.55, width: width - 36 - 24 })),
    )
    list.appendChild(fill(row))
  }
  shell.appendChild(fill(list))
  return shell
}

/* --------------------------------- misc -------------------------------- */

export function milestoneRow(label: string, done: boolean, width: number): FrameNode {
  const row = stack({ name: 'milestone', direction: 'HORIZONTAL', gap: 12, align: 'CENTER', width })
  row.appendChild(tick(done))
  row.appendChild(
    fill(
      text(label, {
        size: TYPE.body,
        weight: done ? 600 : 500,
        color: done ? 'ink' : 'muted',
        width: width - 32,
      }),
    ),
  )
  return row
}

export function dayBox(day: { label: string; done: boolean; today: boolean }, width: number, height: number): FrameNode {
  const cell = stack({ name: `day/${day.label}`, gap: 7, align: 'CENTER', width })
  cell.appendChild(text(day.label, { size: TYPE.micro, weight: 600, color: 'muted' }))
  const box = rect(width, height, day.today && day.done ? 'caneta' : day.done ? 'canetaSoft' : 'track', SHAPE.tile)
  cell.appendChild(box)
  if (day.today) {
    box.strokes = [{ type: 'SOLID', color: { r: 38 / 255, g: 73 / 255, b: 229 / 255 } }]
    box.strokeWeight = 1.5
    box.strokeAlign = 'INSIDE'
  }
  return cell
}

export { screenBar }

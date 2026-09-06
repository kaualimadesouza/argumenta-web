import { screenFrame, settle, storyCover } from '../chrome'
import type { Device } from '../devices'
import { applyBorder, fill, grow, rect, stack, text } from '../nodes'
import { MILESTONES, TRACK, TRENDS, WEEK, type StorySample } from '../samples'
import { COLORS, LAYOUT, SHAPE, TRACKING, TYPE } from '../tokens'
import { button, card, chip, progressBar, tick } from '../ui'
import { cellWidth, columns, screenTitle } from './layout'
import { dangerCard, nicknameCard, targetsCard } from './profile'

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
  const stroke = down ? COLORS.corretor : COLORS.caneta
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SPARK.width} ${SPARK.height}"><polyline points="${drawn}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const node = figma.createNodeFromSvg(svg)
  node.name = 'sparkline'
  node.resize(SPARK.width, SPARK.height)
  return node
}

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
  if (day.today) applyBorder(box, { color: 'caneta', weight: 1.5 })
  return cell
}

export function trilha(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Trilha', shell: true, tab: 'trilha', shape: 'wide' })
  const width = screen.width
  const bar = stack({
    name: 'bar',
    direction: 'HORIZONTAL',
    gap: 12,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width,
    wrap: true,
  })
  bar.appendChild(
    text('Sua trilha', {
      size: device.id === 'desktop' ? TYPE.display : TYPE.lead,
      weight: 800,
      tracking: device.id === 'desktop' ? TRACKING.title : TRACKING.lead,
    }),
  )
  const chips = stack({ name: 'chips', direction: 'HORIZONTAL', gap: 6, align: 'CENTER' })
  chips.appendChild(chip('3 dias', 'streak'))
  chips.appendChild(chip('1/3 envios hoje'))
  bar.appendChild(chips)
  screen.content.appendChild(fill(bar))

  const perRow = device.id === 'desktop' ? 3 : device.id === 'tablet' ? 2 : 1
  const gap = device.id === 'phone' ? 12 : device.id === 'tablet' ? 16 : 20
  const featured = TRACK.find((story) => story.state === 'in_progress')
  const rest = TRACK.filter((story) => story.state !== 'in_progress')

  if (featured !== undefined) {
    screen.content.appendChild(
      fill(storyCard({ story: featured, width, featured: true, device })),
    )
  }
  const cell = cellWidth(width, perRow, gap)
  const cards = rest.map((story) => storyCard({ story, width: cell, featured: false, device }))
  for (const row of columns(cards, perRow, width, gap)) screen.content.appendChild(fill(row))
  return settle(screen, device)
}

/* ------------------------------- progresso ----------------------------- */

function streakCard(width: number, device: Device): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 16, width, name: 'card/sequencia' })
  const head = stack({ name: 'head', gap: 4, width: inner })
  head.appendChild(text('7 dias seguidos', { size: TYPE.title, weight: 800, tracking: TRACKING.title }))
  head.appendChild(text('Seu recorde é 9 dias', { size: TYPE.meta, weight: 500, color: 'muted' }))
  shell.appendChild(fill(head))
  const week = stack({ name: 'week', direction: 'HORIZONTAL', gap: 7, width: inner })
  const boxWidth = Math.floor((inner - 7 * 6) / 7)
  const height = device.id === 'desktop' ? 48 : 34
  for (const day of WEEK) week.appendChild(dayBox(day, boxWidth, height))
  shell.appendChild(fill(week))
  shell.appendChild(
    fill(
      text('Escreveu hoje. Volte amanhã para não zerar a sequência.', {
        size: TYPE.meta,
        weight: 500,
        color: 'muted',
        width: inner,
      }),
    ),
  )
  return shell
}

function trendsCard(width: number): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 16, width, name: 'card/competencias' })
  const head = stack({ name: 'head', gap: 3, width: inner })
  head.appendChild(
    text('Como cada competência anda', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }),
  )
  head.appendChild(
    text('Últimos 5 dias com envio · escala 0 a 100', { size: TYPE.meta, weight: 500, color: 'muted' }),
  )
  shell.appendChild(fill(head))
  const list = stack({ name: 'trends', gap: 14, width: inner })
  for (const trend of TRENDS) {
    const row = stack({ name: `trend/${trend.code}`, direction: 'HORIZONTAL', gap: 10, align: 'CENTER', width: inner })
    row.appendChild(text(trend.code, { size: TYPE.meta, weight: 700, color: 'muted' }))
    row.appendChild(
      fill(text(trend.label, { size: TYPE.meta, weight: 600, width: inner - 120 - 28 - 36 - 40 })),
    )
    row.appendChild(sparkline(trend.points, trend.delta < 0))
    row.appendChild(text(String(trend.latest), { size: TYPE.meta, weight: 700, align: 'RIGHT', width: 28 }))
    const delta = trend.delta === 0 ? '' : trend.delta > 0 ? `+${trend.delta}` : `−${Math.abs(trend.delta)}`
    row.appendChild(
      text(delta, {
        size: TYPE.meta,
        weight: 600,
        color: trend.delta < 0 ? 'corretorInk' : 'aprovadoInk',
        align: 'RIGHT',
        width: 36,
      }),
    )
    list.appendChild(fill(row))
  }
  shell.appendChild(fill(list))
  return shell
}

function milestonesCard(width: number): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 16, width, name: 'card/marcos' })
  shell.appendChild(text('Marcos', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const list = stack({ name: 'milestones', gap: 14, width: inner })
  for (const milestone of MILESTONES) {
    list.appendChild(fill(milestoneRow(milestone.label, milestone.done, inner)))
  }
  shell.appendChild(fill(list))
  return shell
}

export function progresso(device: Device): FrameNode {
  const screen = screenFrame(device, {
    name: 'Progresso',
    shell: true,
    tab: 'progresso',
    shape: 'wide',
  })
  const width = screen.width
  const bar = stack({
    name: 'bar',
    direction: 'HORIZONTAL',
    gap: 12,
    align: 'BASELINE',
    justify: 'SPACE_BETWEEN',
    width,
  })
  bar.appendChild(screenTitle('Progresso', device))
  bar.appendChild(text('Lente ENEM', { size: TYPE.meta, weight: 600, color: 'muted' }))
  screen.content.appendChild(fill(bar))
  screen.content.appendChild(fill(streakCard(width, device)))

  if (device.id === 'desktop') {
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 20, align: 'MIN', width })
    row.appendChild(trendsCard(width - LAYOUT.rail - 20))
    row.appendChild(milestonesCard(LAYOUT.rail))
    screen.content.appendChild(fill(row))
  } else {
    screen.content.appendChild(fill(trendsCard(width)))
    screen.content.appendChild(fill(milestonesCard(width)))
  }
  return settle(screen, device)
}

/* --------------------------- conta and onboarding ---------------------- */

export function conta(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Conta', shell: true, tab: 'conta', shape: 'document' })
  const width = screen.width
  screen.content.appendChild(screenTitle('Sua conta', device))
  screen.content.appendChild(fill(nicknameCard(width)))
  screen.content.appendChild(fill(targetsCard(width)))
  screen.content.appendChild(fill(dangerCard(width)))
  return settle(screen, device)
}

export function onboarding(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Onboarding', shell: false, shape: 'document' })
  const width = screen.width
  screen.content.appendChild(screenTitle('Quase lá', device))
  screen.content.appendChild(
    fill(
      text(
        'Duas coisas e a primeira história abre: como te chamar, e qual vestibular você vai prestar.',
        { size: TYPE.body, color: 'ink2', lineHeight: 1.6, width },
      ),
    ),
  )
  screen.content.appendChild(fill(nicknameCard(width)))
  screen.content.appendChild(fill(targetsCard(width)))
  screen.content.appendChild(fill(button('Começar a treinar')))
  return settle(screen, device)
}

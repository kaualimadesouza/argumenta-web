import { screenFrame, settle } from '../chrome'
import type { Device } from '../devices'
import { fill, stack, text } from '../nodes'
import { MILESTONES, TRACK, TRENDS, WEEK } from '../samples'
import { LAYOUT, TRACKING, TYPE } from '../tokens'
import { button, card, chip } from '../ui'
import {
  columns,
  dangerCard,
  dayBox,
  milestoneRow,
  nicknameCard,
  screenTitle,
  sparkline,
  storyCard,
  targetsCard,
} from './blocks'

/* -------------------------------- trilha ------------------------------- */

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
  const cards = rest.map((story) => storyCard({ story, width, featured: false, device }))
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
  const cellWidth = Math.floor((inner - 7 * 6) / 7)
  const height = device.id === 'desktop' ? 48 : 34
  for (const day of WEEK) week.appendChild(dayBox(day, cellWidth, height))
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
  const screen = screenFrame(device, { name: 'Conta', shell: true, tab: 'conta', shape: 'wide' })
  const width = screen.width
  screen.content.appendChild(screenTitle('Sua conta', device))
  screen.content.appendChild(fill(nicknameCard(width)))
  screen.content.appendChild(fill(targetsCard(width)))
  screen.content.appendChild(fill(dangerCard(width)))
  return settle(screen, device)
}

export function onboarding(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Onboarding', shell: false, shape: 'wide' })
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

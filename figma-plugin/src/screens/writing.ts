import { nightPanel, screenFrame, settle, speechRow } from '../chrome'
import type { Device } from '../devices'
import { fill, grow, paint, stack, text } from '../nodes'
import {
  ATTEMPTS,
  CONSEQUENCE,
  DRAFT,
  MARKS,
  PRAISE,
  SCORE_FLOOR,
  SCORE_MAX,
  SCORE_ROWS,
  SLIP,
  TO_PASS,
} from '../samples'
import { LAYOUT, SHAPE, TRACKING, TYPE } from '../tokens'
import { button, card, chip, kicker, progressBar, textarea } from '../ui'
import {
  legendCard,
  paraPassarCard,
  readingSize,
  sceneBeats,
  screenBar,
  screenTitle,
  verdictHeadline,
} from './blocks'

/* --------------------------------- cena -------------------------------- */

export function cena(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Cena', shell: false, shape: 'reading' })
  const width = screen.width
  screen.content.appendChild(fill(screenBar(width, '← Trilha', [chip('Cap. 2')])))
  for (const beat of sceneBeats(width, device)) screen.content.appendChild(fill(beat))
  const history = stack({ name: 'history', padding: [18, 0, 0, 0], align: 'CENTER', width })
  const link = text('Ver minhas tentativas anteriores', { size: 16, color: 'muted' })
  link.textDecoration = 'UNDERLINE'
  history.appendChild(link)
  screen.content.appendChild(fill(history))
  screen.content.appendChild(fill(button('Argumentar')))
  return settle(screen, device)
}

/* -------------------------------- editor ------------------------------- */

const REQUIREMENTS = ['Tese', 'Justificativa', 'Repertório explicado']

function briefCard(width: number): FrameNode {
  const shell = card({ gap: 12, width, name: 'card/objetivo' })
  shell.appendChild(
    fill(
      text(
        'Escreva para Seu Tenório: por que ele pode confiar o pátio ao grêmio este ano, com compromissos concretos de cuidado e limpeza.',
        { size: TYPE.body, weight: 500, lineHeight: 1.5, width: width - 36 },
      ),
    ),
  )
  const chips = stack({
    name: 'requisitos',
    direction: 'HORIZONTAL',
    gap: 6,
    width: width - 36,
    wrap: true,
  })
  for (const requirement of REQUIREMENTS) chips.appendChild(chip(requirement))
  shell.appendChild(fill(chips))
  return shell
}

function editorFoot(width: number): FrameNode {
  const foot = stack({
    name: 'foot',
    direction: 'HORIZONTAL',
    justify: 'SPACE_BETWEEN',
    gap: 8,
    width,
  })
  foot.appendChild(text('47 / 250 palavras', { size: TYPE.meta, weight: 600, color: 'muted' }))
  foot.appendChild(text('Rascunho salvo', { size: TYPE.meta, weight: 600, color: 'muted' }))
  return foot
}

const SHEET_HEIGHT: Record<Device['id'], number> = { phone: 256, tablet: 352, desktop: 416 }

export function editor(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Editor', shell: false, shape: 'wide' })
  const width = screen.width
  screen.content.appendChild(fill(screenBar(width, '← Cena', [chip('1/3 envios hoje')])))
  screen.content.appendChild(fill(screenTitle('Convença Seu Tenório', device)))

  const deskWidth = device.id === 'desktop' ? width - LAYOUT.rail - 24 : width
  const desk = stack({ name: 'desk', gap: 14, width: deskWidth })
  desk.appendChild(fill(textarea(DRAFT, deskWidth, SHEET_HEIGHT[device.id])))
  desk.appendChild(fill(editorFoot(deskWidth)))
  desk.appendChild(fill(button('Enviar para Seu Tenório')))

  if (device.id === 'desktop') {
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 24, align: 'MIN', width })
    row.appendChild(briefCard(LAYOUT.rail))
    row.appendChild(desk)
    screen.content.appendChild(fill(row))
  } else {
    screen.content.appendChild(fill(briefCard(width)))
    screen.content.appendChild(fill(desk))
  }
  return settle(screen, device)
}

/* ------------------------------- correção ------------------------------ */

function scoreboardCard(width: number): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 16, width, name: 'card/placar' })
  shell.appendChild(text('Placar', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const rows = stack({ name: 'rows', gap: 16, width: inner })
  for (const row of SCORE_ROWS) {
    const line = stack({ name: `criterio/${row.code}`, gap: 7, width: inner })
    const head = stack({ name: 'head', direction: 'HORIZONTAL', gap: 8, align: 'BASELINE', width: inner })
    head.appendChild(text(row.code, { size: TYPE.meta, weight: 700, color: 'muted' }))
    head.appendChild(
      text(row.label, { size: TYPE.meta, weight: 600, color: row.belowFloor ? 'corretorInk' : 'ink' }),
    )
    if (row.extra !== undefined) {
      head.appendChild(text(row.extra, { size: TYPE.meta, weight: 500, color: 'muted' }))
    }
    head.appendChild(grow(stack({ name: 'gap' })))
    head.appendChild(
      text(`${row.score}/${SCORE_MAX}`, {
        size: TYPE.meta,
        weight: 700,
        color: row.belowFloor ? 'corretorInk' : 'ink',
      }),
    )
    line.appendChild(fill(head))
    line.appendChild(
      progressBar({
        percent: (row.score / SCORE_MAX) * 100,
        floor: (SCORE_FLOOR / SCORE_MAX) * 100,
        width: inner,
        tone: row.belowFloor ? 'alert' : 'caneta',
      }),
    )
    rows.appendChild(fill(line))
  }
  shell.appendChild(fill(rows))

  const total = stack({
    name: 'total',
    direction: 'HORIZONTAL',
    gap: 10,
    padding: [14, 0, 0, 0],
    align: 'BASELINE',
    justify: 'SPACE_BETWEEN',
    width: inner,
    border: { color: 'track', weight: 1, sides: ['top'] },
  })
  const label = stack({ name: 'label', gap: 2 })
  label.appendChild(text('Soma dos critérios', { size: TYPE.meta, weight: 700 }))
  label.appendChild(
    text('Estimativa Argumenta, não é nota oficial do vestibular', {
      size: TYPE.micro,
      weight: 500,
      color: 'muted',
    }),
  )
  total.appendChild(label)
  const sum = SCORE_ROWS.reduce((carried, row) => carried + row.score, 0)
  total.appendChild(
    text(`${sum}/${SCORE_MAX * SCORE_ROWS.length}`, {
      size: TYPE.lead,
      weight: 800,
      tracking: TRACKING.lead,
    }),
  )
  shell.appendChild(fill(total))
  return shell
}

/** The student's text with the marks in place. Figma has no wavy underline and
 *  no background on a text range, so a slip is a straight corretor underline
 *  and a praised repertoire is caneta and semibold. */
function markedTextCard(width: number, device: Device): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 16, width, name: 'card/texto-corrigido' })
  shell.appendChild(
    text('Seu texto, corrigido', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }),
  )
  const body = text(DRAFT, {
    size: device.id === 'desktop' ? TYPE.lead : TYPE.body,
    lineHeight: device.id === 'desktop' ? 1.9 : 1.85,
    tracking: -0.8,
    width: inner,
  })
  const slip = DRAFT.indexOf(SLIP)
  body.setRangeFills(slip, slip + SLIP.length, paint('corretor'))
  body.setRangeTextDecoration(slip, slip + SLIP.length, 'UNDERLINE')
  const praise = DRAFT.indexOf(PRAISE)
  body.setRangeFills(praise, praise + PRAISE.length, paint('caneta'))
  body.setRangeFontName(praise, praise + PRAISE.length, { family: 'Inter', style: 'Semi Bold' })
  shell.appendChild(fill(body))
  const explanation = stack({
    name: 'explicacao',
    padding: [10, 12],
    fill: 'track',
    radius: SHAPE.tile,
    width: inner,
  })
  explanation.appendChild(
    fill(
      text(MARKS[0].message, {
        size: TYPE.meta,
        color: 'ink2',
        lineHeight: 1.55,
        width: inner - 24,
      }),
    ),
  )
  shell.appendChild(fill(explanation))
  return shell
}

export function correcao(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Correção', shell: false, shape: 'wide' })
  const width = screen.width
  const bar = stack({
    name: 'bar',
    direction: 'HORIZONTAL',
    gap: 12,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width,
  })
  bar.appendChild(text('O pátio do Tenório', { size: TYPE.body, weight: 700, tracking: TRACKING.lead }))
  bar.appendChild(text('Tentativa 2', { size: TYPE.meta, weight: 600, color: 'muted' }))
  screen.content.appendChild(fill(bar))
  screen.content.appendChild(fill(verdictHeadline(width, device)))

  const desktop = device.id === 'desktop'
  const mainWidth = desktop ? width - LAYOUT.rail - 20 : width
  const main = stack({ name: 'main', gap: desktop ? 20 : 16, width: mainWidth })
  main.appendChild(fill(markedTextCard(mainWidth, device)))
  main.appendChild(fill(legendCard(mainWidth, MARKS)))
  main.appendChild(fill(paraPassarCard(mainWidth, TO_PASS)))
  const actions = stack({
    name: 'actions',
    direction: desktop ? 'HORIZONTAL' : 'VERTICAL',
    gap: 10,
    width: mainWidth,
  })
  const revise = button('Revisar meu texto')
  const back = button('Rever a cena', 'ghost')
  if (desktop) {
    actions.appendChild(grow(revise))
    actions.appendChild(grow(back))
  } else {
    actions.appendChild(fill(revise))
    actions.appendChild(fill(back))
  }
  main.appendChild(fill(actions))

  if (desktop) {
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 20, align: 'MIN', width })
    row.appendChild(main)
    row.appendChild(scoreboardCard(LAYOUT.rail))
    screen.content.appendChild(fill(row))
  } else {
    screen.content.appendChild(fill(scoreboardCard(width)))
    screen.content.appendChild(fill(main))
  }
  return settle(screen, device)
}

/* ----------------------------- consequência ---------------------------- */

export function consequencia(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Consequência', shell: false, shape: 'reading' })
  const width = screen.width
  const size = readingSize(device)
  screen.content.appendChild(
    fill(screenBar(width, '← Trilha', [chip('Não convenceu', 'warn')])),
  )
  screen.content.appendChild(
    fill(nightPanel(CONSEQUENCE.narration, { width, size, padding: device.id === 'desktop' ? 28 : 20 })),
  )
  screen.content.appendChild(
    fill(speechRow({ speech: CONSEQUENCE.speech, who: CONSEQUENCE.speaker, width, size })),
  )

  const inner = width - 36
  const stalled = card({ gap: 12, width, name: 'card/onde-parou' })
  stalled.appendChild(
    text('Onde o argumento parou', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }),
  )
  const row = stack({ name: 'row', gap: 7, width: inner })
  const head = stack({
    name: 'head',
    direction: 'HORIZONTAL',
    gap: 10,
    align: 'BASELINE',
    justify: 'SPACE_BETWEEN',
    width: inner,
  })
  head.appendChild(text('Persuasão', { size: TYPE.meta, weight: 600 }))
  head.appendChild(
    text(`${CONSEQUENCE.score}/100`, { size: TYPE.meta, weight: 700, color: 'streakInk' }),
  )
  row.appendChild(fill(head))
  row.appendChild(progressBar({ percent: CONSEQUENCE.score, floor: 50, width: inner, tone: 'streak' }))
  stalled.appendChild(fill(row))
  stalled.appendChild(
    fill(
      text(CONSEQUENCE.evidence, {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.58,
        width: inner,
      }),
    ),
  )
  screen.content.appendChild(fill(stalled))
  screen.content.appendChild(fill(button('Encarar Seu Tenório de novo')))
  return settle(screen, device)
}

/* ------------------------------- histórico ----------------------------- */

export function historico(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Histórico', shell: false, shape: 'reading' })
  const width = screen.width
  screen.content.appendChild(fill(screenBar(width, '← Voltar', [])))
  screen.content.appendChild(fill(screenTitle('Tentativas anteriores', device)))
  for (const attempt of ATTEMPTS) {
    const inner = width - 36
    const shell = card({ gap: 16, width, padding: 18, name: `tentativa/${attempt.attempt}` })
    const head = stack({
      name: 'head',
      direction: 'HORIZONTAL',
      gap: 10,
      align: 'CENTER',
      justify: 'SPACE_BETWEEN',
      width: inner,
    })
    const left = stack({ name: 'left', gap: 2 })
    left.appendChild(text(attempt.attempt, { size: TYPE.body, weight: 600 }))
    left.appendChild(text(attempt.verdict, { size: TYPE.meta, color: 'muted' }))
    head.appendChild(left)
    head.appendChild(chip(attempt.score))
    shell.appendChild(fill(head))
    shell.appendChild(
      fill(
        text(attempt.body, {
          size: TYPE.body,
          color: 'ink2',
          lineHeight: 1.6,
          width: inner,
        }),
      ),
    )
    screen.content.appendChild(fill(shell))
  }
  return settle(screen, device)
}

export { kicker }

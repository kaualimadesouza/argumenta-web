/** The anatomy of the correction screen. It is drawn twice, full size on the
 *  screen itself and as a thumbnail on the landing, so the pieces live here
 *  instead of once in each place. */
import { fill, fontOf, grow, paint, stack, text } from '../nodes'
import { DRAFT, MARKS, PRAISE, SCORE_FLOOR, SCORE_MAX, SLIP, type ScoreRow } from '../samples'
import { SHAPE, TRACKING, TYPE } from '../tokens'
import { arrowBullet, card, cardInner, markBadge, progressBar } from '../ui'

/** The student's own text with the marks in place. Figma has no wavy underline
 *  and no background on a text range, so a slip is a straight corretor
 *  underline and a praised repertoire is caneta and semibold. */
export function annotatedDraft(width: number, size: number, lineHeight: number): TextNode {
  const body = text(DRAFT, { size, lineHeight, tracking: -0.8, width })
  const slip = DRAFT.indexOf(SLIP)
  body.setRangeFills(slip, slip + SLIP.length, paint('corretor'))
  body.setRangeTextDecoration(slip, slip + SLIP.length, 'UNDERLINE')
  const praise = DRAFT.indexOf(PRAISE)
  body.setRangeFills(praise, praise + PRAISE.length, paint('caneta'))
  body.setRangeFontName(praise, praise + PRAISE.length, fontOf(600))
  return body
}

export interface ScoreStyle {
  /** The screen prints `160/200`; the thumbnail has room only for `160`. */
  showMax: boolean
  /** The screen names the Argumenta criterion; the thumbnail names the floor. */
  aside: 'criterion' | 'floor'
}

export function scoreRow(row: ScoreRow, width: number, style: ScoreStyle): FrameNode {
  const line = stack({ name: `criterio/${row.code}`, gap: 7, width })
  const head = stack({ name: 'head', direction: 'HORIZONTAL', gap: 8, align: 'BASELINE', width })
  head.appendChild(text(row.code, { size: TYPE.meta, weight: 700, color: 'muted' }))
  head.appendChild(
    text(row.label, { size: TYPE.meta, weight: 600, color: row.belowFloor ? 'corretorInk' : 'ink' }),
  )
  const aside = style.aside === 'criterion' ? row.extra : row.belowFloor ? 'abaixo do piso' : undefined
  if (aside !== undefined) {
    head.appendChild(text(aside, { size: TYPE.meta, weight: 500, color: 'muted' }))
  }
  head.appendChild(grow(stack({ name: 'gap' })))
  head.appendChild(
    text(style.showMax ? `${row.score}/${SCORE_MAX}` : String(row.score), {
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
      width,
      tone: row.belowFloor ? 'alert' : 'caneta',
    }),
  )
  return line
}

/** The sum, with the disclaimer that it is an estimate and not a board's grade. */
export function scoreTotal(rows: ScoreRow[], width: number, disclaimer: string): FrameNode {
  const total = stack({
    name: 'total',
    direction: 'HORIZONTAL',
    gap: 10,
    padding: [14, 0, 0, 0],
    align: 'BASELINE',
    justify: 'SPACE_BETWEEN',
    width,
    border: { color: 'track', weight: 1, sides: ['top'] },
  })
  const sum = rows.reduce((carried, row) => carried + row.score, 0)
  const figure = text(`${sum}/${SCORE_MAX * rows.length}`, {
    size: TYPE.lead,
    weight: 800,
    tracking: TRACKING.lead,
  })
  // the disclaimer wraps in what the figure leaves, as it does in the browser
  const rest = width - figure.width - 10
  const label = stack({ name: 'label', gap: 2, width: rest })
  label.appendChild(fill(text('Soma dos critérios', { size: TYPE.meta, weight: 700, width: rest })))
  label.appendChild(
    fill(text(disclaimer, { size: TYPE.micro, weight: 500, color: 'muted', width: rest })),
  )
  total.appendChild(label)
  total.appendChild(figure)
  return total
}

/** The word count and the autosave state under the sheet. */
export function editorFoot(width: number): FrameNode {
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

/** The verdict banner of a submission the norm-culta floor stopped: the one
 *  case with marks to show, which is why it is the case drawn. */
export function technicalVerdict(width: number, titleSize: number): FrameNode {
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
      size: titleSize,
      weight: 800,
      color: 'corretorInk',
      tracking: TRACKING.title,
      lineHeight: 1.18,
      width: cardInner(width),
    }),
  )
  frame.appendChild(
    fill(
      text(
        'O argumento convence Seu Tenório, mas 1 desvio de escrita derrubou a nota abaixo do piso. Corrija e reenvie: a história continua esperando.',
        { size: TYPE.body, lineHeight: 1.55, width: cardInner(width) },
      ),
    ),
  )
  return frame
}

export function legendCard(width: number): FrameNode {
  const inner = cardInner(width)
  const shell = card({ gap: 16, width, name: 'card/marcacoes' })
  shell.appendChild(text('As marcações', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const list = stack({ name: 'legend', gap: 14, width: inner })
  for (const mark of MARKS) {
    const row = stack({
      name: `mark/${mark.number}`,
      direction: 'HORIZONTAL',
      gap: 11,
      align: 'MIN',
      width: inner,
    })
    row.appendChild(markBadge(mark.number, mark.tone))
    const line = text(`${mark.kind} ${mark.message}`, {
      size: TYPE.meta,
      color: 'ink2',
      lineHeight: 1.55,
      width: inner - 26,
    })
    line.setRangeFills(0, mark.kind.length, paint('ink'))
    row.appendChild(fill(line))
    list.appendChild(fill(row))
  }
  shell.appendChild(fill(list))
  return shell
}

export function paraPassarCard(width: number, steps: string[]): FrameNode {
  const inner = cardInner(width)
  const shell = card({ gap: 16, width, name: 'card/para-passar' })
  shell.appendChild(text('Para passar', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  const list = stack({ name: 'steps', gap: 14, width: inner })
  for (const step of steps) {
    const row = stack({ name: 'step', direction: 'HORIZONTAL', gap: 11, align: 'MIN', width: inner })
    row.appendChild(arrowBullet())
    row.appendChild(fill(text(step, { size: TYPE.body, lineHeight: 1.55, width: inner - 24 })))
    list.appendChild(fill(row))
  }
  shell.appendChild(fill(list))
  return shell
}

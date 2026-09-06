/** The four thumbnails beside the landing's "Como funciona" steps: the real
 *  screens one step down the ramp, built from the same pieces they are. */
import { nightPanel, speechRow } from '../chrome'
import { fill, stack, text } from '../nodes'
import { STEP_SCENE, VERDICT_OK, VERDICT_WARN } from '../landingContent'
import { DRAFT, SCORE_ROWS, TO_PASS } from '../samples'
import { SHAPE, TRACKING, TYPE } from '../tokens'
import { card, chip, kicker } from '../ui'
import { annotatedDraft, editorFoot, scoreRow, scoreTotal } from './correction'

const REQUIREMENTS = ['Tese', 'Justificativa', 'Repertório explicado']

/** Step 01: the scene, in the compact shape the landing's own CSS gives it. */
function scene(width: number): FrameNode {
  const frame = stack({ name: 'scene', gap: 10, width })
  frame.appendChild(
    fill(nightPanel(STEP_SCENE.narration, { width, size: TYPE.body, padding: 15 })),
  )
  frame.appendChild(
    fill(speechRow({ speech: STEP_SCENE.speech, who: STEP_SCENE.speaker, width, size: TYPE.body })),
  )
  return frame
}

/** Step 02: the desk. */
function editor(width: number): FrameNode {
  const frame = stack({ name: 'editor', gap: 10, width })
  const objective = card({ gap: 8, width, name: 'objetivo' })
  objective.appendChild(kicker('Seu objetivo'))
  objective.appendChild(
    fill(
      text(STEP_SCENE.objective, {
        size: TYPE.body,
        weight: 500,
        lineHeight: 1.5,
        width: width - 36,
      }),
    ),
  )
  frame.appendChild(fill(objective))
  const chips = stack({ name: 'requisitos', direction: 'HORIZONTAL', gap: 6, wrap: true, width })
  for (const requirement of REQUIREMENTS) chips.appendChild(chip(requirement, 'neutral'))
  frame.appendChild(fill(chips))
  const sheet = stack({
    name: 'sheet',
    padding: [14, 16],
    fill: 'card',
    radius: SHAPE.card,
    border: { color: 'caneta', weight: 1.5 },
    width,
  })
  sheet.appendChild(
    fill(text(DRAFT, { size: TYPE.body, lineHeight: 1.72, tracking: -0.8, width: width - 32 })),
  )
  frame.appendChild(fill(sheet))
  frame.appendChild(fill(editorFoot(width)))
  return frame
}

/** The four criteria the thumbnail has room for. */
const SHOWN = SCORE_ROWS.slice(0, 4)

function board(width: number): FrameNode {
  const inner = width - 36
  const shell = card({ gap: 14, width, name: 'placar' })
  const bar = stack({
    name: 'bar',
    direction: 'HORIZONTAL',
    gap: 8,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width: inner,
  })
  bar.appendChild(
    text('Capítulo 2 · O pátio do Tenório', {
      size: TYPE.body,
      weight: 700,
      tracking: TRACKING.lead,
    }),
  )
  bar.appendChild(text('2ª tentativa', { size: TYPE.meta, weight: 600, color: 'muted' }))
  shell.appendChild(fill(bar))
  const rows = stack({ name: 'rows', gap: 12, width: inner })
  for (const row of SHOWN) {
    rows.appendChild(fill(scoreRow(row, inner, { showMax: false, aside: 'floor' })))
  }
  shell.appendChild(fill(rows))
  shell.appendChild(
    fill(scoreTotal(SHOWN, inner, 'Estimativa do Argumenta, não nota de banca')),
  )
  return shell
}

/** Step 03: the correction. */
function correction(width: number): FrameNode {
  const frame = stack({ name: 'correcao', gap: 10, width })
  frame.appendChild(fill(board(width)))
  const marked = card({ gap: 8, width, name: 'texto' })
  marked.appendChild(fill(annotatedDraft(width - 36, TYPE.body, 1.85)))
  frame.appendChild(fill(marked))
  const pass = card({ gap: 10, width, name: 'para-passar' })
  pass.appendChild(kicker('Para passar'))
  for (const step of TO_PASS) {
    pass.appendChild(fill(text(`→ ${step}`, { size: TYPE.body, lineHeight: 1.5, width: width - 36 })))
  }
  frame.appendChild(fill(pass))
  return frame
}

function verdictBlock(
  verdict: { title: string; line: string },
  tone: 'ok' | 'warn',
  width: number,
): FrameNode {
  const frame = stack({
    name: `verdict/${tone}`,
    gap: 9,
    padding: 18,
    fill: tone === 'ok' ? 'aprovadoSoft' : 'streakSoft',
    radius: SHAPE.card,
    border: { color: tone === 'ok' ? 'aprovado' : 'streak', weight: 1.5 },
    width,
  })
  frame.appendChild(
    text(verdict.title, {
      size: TYPE.lead,
      weight: 800,
      color: tone === 'ok' ? 'aprovadoInk' : 'streakInk',
      tracking: TRACKING.lead,
      lineHeight: 1.2,
    }),
  )
  frame.appendChild(
    fill(text(verdict.line, { size: TYPE.meta, color: 'ink2', lineHeight: 1.5, width: width - 36 })),
  )
  return frame
}

/** Step 04: what the history answers, both ways. */
function verdicts(width: number): FrameNode {
  const frame = stack({ name: 'verdicts', gap: 10, width })
  frame.appendChild(fill(verdictBlock(VERDICT_OK, 'ok', width)))
  frame.appendChild(fill(verdictBlock(VERDICT_WARN, 'warn', width)))
  return frame
}

/** One thumbnail per step, in the order STEPS declares them. */
export const THUMBNAILS: ((width: number) => FrameNode)[] = [scene, editor, correction, verdicts]

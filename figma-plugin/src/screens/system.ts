import { brandWordmark, nightPanel, speechRow, storyCover } from '../chrome'
import { applyBorder, fill, grow, paint, rect, stack, text } from '../nodes'
import { COLORS, SHAPE, TRACKING, TYPE, type ColorName } from '../tokens'
import { button, card, cardInner, chip, field, kicker, markBadge, notice, progressBar, tick, type ChipTone } from '../ui'

const BOARD = 1240
const INNER = BOARD - 96

/** `canetaSoft` is `--color-caneta-soft`, the name the stylesheet uses. */
function cssName(token: ColorName): string {
  return `--color-${token.replace(/[A-Z0-9]/g, (char) => `-${char.toLowerCase()}`)}`
}

interface Group {
  title: string
  tokens: ColorName[]
}

const GROUPS: Group[] = [
  { title: 'Superfícies', tokens: ['paper', 'card', 'line', 'lineStrong', 'track'] },
  { title: 'Tinta', tokens: ['ink', 'ink2', 'muted', 'disabled'] },
  { title: 'Caneta, a única cor de ação', tokens: ['caneta', 'canetaPress', 'canetaSoft'] },
  {
    title: 'Vereditos',
    tokens: ['aprovado', 'aprovadoInk', 'aprovadoSoft', 'corretor', 'corretorInk', 'corretorSoft'],
  },
  { title: 'Hábito e repertório', tokens: ['streak', 'streakInk', 'streakSoft', 'marcaTexto'] },
  { title: 'Noite', tokens: ['noite', 'noiteInner', 'luz', 'luzMuted'] },
]

function swatch(token: ColorName): FrameNode {
  const frame = stack({ name: `cor/${token}`, gap: 8, width: 168 })
  const chipRect = rect(168, 64, token, SHAPE.tile)
  applyBorder(chipRect, { color: 'line', weight: 1 })
  frame.appendChild(chipRect)
  const label = stack({ name: 'label', gap: 2, width: 168 })
  label.appendChild(text(token, { size: TYPE.meta, weight: 700 }))
  label.appendChild(text(cssName(token), { size: TYPE.micro, color: 'muted' }))
  label.appendChild(text(COLORS[token], { size: TYPE.micro, color: 'muted' }))
  frame.appendChild(fill(label))
  return frame
}

function sectionTitle(label: string): TextNode {
  return text(label, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead })
}

function colours(): FrameNode {
  const frame = stack({ name: 'cores', gap: 24, width: INNER })
  frame.appendChild(sectionTitle('Cores, semânticas e não decorativas'))
  for (const group of GROUPS) {
    const block = stack({ name: group.title, gap: 12, width: INNER })
    block.appendChild(text(group.title, { size: TYPE.meta, weight: 700, color: 'muted' }))
    const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 16, wrap: true, width: INNER })
    for (const token of group.tokens) row.appendChild(swatch(token))
    block.appendChild(fill(row))
    frame.appendChild(fill(block))
  }
  frame.appendChild(
    fill(
      text(
        'As variantes -ink existem porque a cor base é para preenchimento, não para texto: texto sempre usa a variante -ink.',
        { size: TYPE.meta, color: 'muted', lineHeight: 1.5, width: INNER },
      ),
    ),
  )
  return frame
}

interface Step {
  token: string
  label: string
  size: number
  weight: 400 | 700 | 800
  sample: string
}

const STEPS: Step[] = [
  { token: '--text-display', label: 'Display · 30 / 800', size: TYPE.display, weight: 800, sample: 'Sua trilha' },
  { token: '--text-title', label: 'Título · 24 / 800', size: TYPE.title, weight: 800, sample: 'Convença Seu Tenório' },
  { token: '--text-lead', label: 'Lead · 19 / 600', size: TYPE.lead, weight: 700, sample: 'O que o estudante lê devagar' },
  { token: '--text-body', label: 'Corpo · 15 / 400', size: TYPE.body, weight: 400, sample: 'Texto corrido, campos e botões' },
  { token: '--text-meta', label: 'Meta · 13 / 600', size: TYPE.meta, weight: 700, sample: 'Rótulos, critérios e contadores' },
  { token: '--text-micro', label: 'Micro · 11 / 500', size: TYPE.micro, weight: 400, sample: 'Só os rótulos da tab bar' },
]

function typography(): FrameNode {
  const frame = stack({ name: 'tipografia', gap: 18, width: INNER })
  frame.appendChild(sectionTitle('Tipografia: uma família, Inter, e quatro passos'))
  for (const step of STEPS) {
    const row = stack({
      name: step.token,
      direction: 'HORIZONTAL',
      gap: 24,
      align: 'BASELINE',
      width: INNER,
    })
    row.appendChild(text(step.label, { size: TYPE.meta, weight: 600, color: 'muted', width: 200 }))
    row.appendChild(text(step.token, { size: TYPE.micro, color: 'muted', width: 130 }))
    row.appendChild(
      grow(
        text(step.sample, {
          size: step.size,
          weight: step.weight,
          tracking: step.size >= TYPE.title ? TRACKING.title : TRACKING.body,
        }),
      ),
    )
    frame.appendChild(fill(row))
  }
  return frame
}

function shapes(): FrameNode {
  const frame = stack({ name: 'forma', gap: 16, width: INNER })
  frame.appendChild(sectionTitle('Forma'))
  const row = stack({ name: 'row', direction: 'HORIZONTAL', gap: 16, width: INNER })
  const tiles: [string, number][] = [
    ['--radius-card 14', SHAPE.card],
    ['--radius-button 12', SHAPE.button],
    ['--radius-tile 10', SHAPE.tile],
    ['--radius-chip 999', SHAPE.chip],
  ]
  for (const [label, radius] of tiles) {
    const cell = stack({ name: label, gap: 8, width: 168 })
    const tile = rect(168, 64, 'card', radius)
    applyBorder(tile, { color: 'lineStrong', weight: 1 })
    cell.appendChild(tile)
    cell.appendChild(text(label, { size: TYPE.micro, color: 'muted' }))
    row.appendChild(cell)
  }
  frame.appendChild(fill(row))
  return frame
}

function controls(): FrameNode {
  const frame = stack({ name: 'componentes', gap: 24, width: INNER })
  frame.appendChild(sectionTitle('Componentes'))

  const buttons = stack({ name: 'botoes', direction: 'HORIZONTAL', gap: 12, align: 'CENTER', wrap: true, width: INNER })
  for (const variant of ['primary', 'ghost', 'danger', 'disabled', 'quiet'] as const) {
    const node = button(
      variant === 'primary'
        ? 'Enviar argumento'
        : variant === 'ghost'
          ? 'Rever a cena'
          : variant === 'danger'
            ? 'Excluir para sempre'
            : variant === 'disabled'
              ? 'Enviar argumento'
              : 'Já tenho conta',
      variant,
    )
    node.layoutSizingHorizontal = 'HUG'
    buttons.appendChild(node)
  }
  frame.appendChild(fill(buttons))

  const chips = stack({ name: 'chips', direction: 'HORIZONTAL', gap: 8, align: 'CENTER', wrap: true, width: INNER })
  const tones: [string, ChipTone][] = [
    ['1/3 envios hoje', 'caneta'],
    ['Concluída', 'ok'],
    ['Não convenceu', 'warn'],
    ['7 dias', 'streak'],
    ['ENEM 2026', 'neutral'],
  ]
  for (const [label, tone] of tones) chips.appendChild(chip(label, tone))
  frame.appendChild(fill(chips))

  const row = stack({ name: 'cartoes', direction: 'HORIZONTAL', gap: 16, align: 'MIN', width: INNER })
  const plain = card({ gap: 8, width: 360 })
  plain.appendChild(text('Cartão', { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }))
  plain.appendChild(
    fill(
      text('Borda de 1px em --color-line. Nenhum cartão recebe sombra.', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.5,
        width: cardInner(360),
      }),
    ),
  )
  row.appendChild(plain)
  const active = card({ active: true, gap: 8, width: 360 })
  active.appendChild(kicker('Seu objetivo'))
  active.appendChild(
    fill(
      text('O cartão em que o estudante deve agir troca a borda por 1,5px de caneta.', {
        size: TYPE.body,
        weight: 600,
        lineHeight: 1.5,
        width: cardInner(360, true),
      }),
    ),
  )
  row.appendChild(active)
  const covers = stack({ name: 'capas', gap: 12, width: 320 })
  const coverRow = stack({ name: 'row', direction: 'HORIZONTAL', gap: 12, align: 'CENTER' })
  coverRow.appendChild(storyCover(2, 'in_progress'))
  coverRow.appendChild(storyCover(1, 'completed'))
  coverRow.appendChild(storyCover(3, 'locked'))
  covers.appendChild(coverRow)
  covers.appendChild(
    fill(
      text('A capa carrega a posição na trilha ou o estado, nunca um desenho fingindo ser arte de capa.', {
        size: TYPE.meta,
        color: 'muted',
        lineHeight: 1.5,
        width: 320,
      }),
    ),
  )
  row.appendChild(covers)
  frame.appendChild(fill(row))

  const inputs = stack({ name: 'campos', direction: 'HORIZONTAL', gap: 16, align: 'MIN', width: INNER })
  inputs.appendChild(field({ label: 'Apelido', value: 'Kauã', hint: 'É como o Argumenta vai te chamar.', width: 300 }))
  inputs.appendChild(field({ label: 'Vestibular', value: 'ENEM', width: 220, select: true }))
  const bars = stack({ name: 'barras', gap: 14, width: 400 })
  bars.appendChild(text('Placar, com o piso do critério', { size: TYPE.meta, weight: 600, color: 'muted' }))
  bars.appendChild(progressBar({ percent: 80, floor: 50, width: 400 }))
  bars.appendChild(progressBar({ percent: 40, floor: 50, width: 400, tone: 'alert' }))
  bars.appendChild(progressBar({ percent: 72, floor: 50, width: 400, tone: 'streak' }))
  bars.appendChild(progressBar({ percent: 100, width: 400, tone: 'done' }))
  inputs.appendChild(bars)
  frame.appendChild(fill(inputs))

  const notices = stack({ name: 'avisos', gap: 10, width: INNER })
  notices.appendChild(fill(notice('Não conseguimos salvar agora. Tente de novo.', 'error', INNER)))
  notices.appendChild(fill(notice('Apelido salvo.', 'ok', INNER)))
  notices.appendChild(
    fill(
      notice(
        'Sem nenhum vestibular, a sua correção volta para a lente padrão (ENEM) e o Argumenta vai pedir um alvo de novo.',
        'warn',
        INNER,
      ),
    ),
  )
  frame.appendChild(fill(notices))

  const marks = stack({ name: 'marcacoes', direction: 'HORIZONTAL', gap: 16, align: 'CENTER', width: INNER })
  marks.appendChild(markBadge(1, 'slip'))
  marks.appendChild(markBadge(2, 'praise'))
  marks.appendChild(tick(true))
  marks.appendChild(tick(false))
  const highlight = stack({
    name: 'marca-texto',
    direction: 'HORIZONTAL',
    padding: [1, 3],
    fill: 'marcaTexto',
    align: 'CENTER',
  })
  highlight.appendChild(text('Paulo Freire', { size: TYPE.body }))
  marks.appendChild(highlight)
  const slip = text('mais', { size: TYPE.body, color: 'corretor' })
  slip.textDecoration = 'UNDERLINE'
  marks.appendChild(slip)
  marks.appendChild(
    grow(
      text('Erro sublinhado em corretor, repertório elogiado sobre marca-texto, marcas numeradas em círculo de 15px.', {
        size: TYPE.meta,
        color: 'muted',
        lineHeight: 1.5,
      }),
    ),
  )
  frame.appendChild(fill(marks))

  const narrative = stack({ name: 'narrativa', direction: 'HORIZONTAL', gap: 16, align: 'MIN', width: INNER })
  narrative.appendChild(
    nightPanel(
      'Sexta-feira, 7h20. O aviso no mural ainda tem cheiro de impressora: “FESTIVAL CULTURAL, CANCELADO”.',
      { width: 540, size: TYPE.lead },
    ),
  )
  narrative.appendChild(
    speechRow({
      speech: 'Se veio falar do festival, economize saliva. Por que este ano seria diferente?',
      who: 'Dona Marta',
      width: INNER - 540 - 16,
      size: TYPE.lead,
    }),
  )
  frame.appendChild(fill(narrative))
  return frame
}

/** The spec sheet: what the tokens are, and the two rules that settle most
 *  arguments about them. */
export function systemBoard(): FrameNode {
  const board = stack({
    name: 'Sistema visual',
    gap: 48,
    padding: 48,
    fill: 'paper',
    radius: 0,
    width: BOARD,
  })
  const head = stack({ name: 'head', gap: 14, width: INNER })
  head.appendChild(brandWordmark(40))
  head.appendChild(
    text('Sistema visual · design system v3', {
      size: TYPE.title,
      weight: 800,
      tracking: TRACKING.title,
    }),
  )
  head.appendChild(
    fill(
      text(
        'Gerado a partir de src/styles/tokens.css. Elevação é uma borda OU uma sombra, nunca as duas: cartões usam borda de 1px, e a única sombra do sistema é o degrau de 3px sob uma ação primária.',
        { size: TYPE.body, color: 'ink2', lineHeight: 1.6, width: Math.min(INNER, 780) },
      ),
    ),
  )
  board.appendChild(fill(head))
  board.appendChild(fill(colours()))
  board.appendChild(fill(typography()))
  board.appendChild(fill(shapes()))
  board.appendChild(fill(controls()))
  board.fills = paint('card')
  return board
}

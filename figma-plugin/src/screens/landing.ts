import { brandWordmark, deviceFrame, nightPanel, penMark, speechRow } from '../chrome'
import { columnFor, type Device } from '../devices'
import { fill, pressShadow, rect, stack, text } from '../nodes'
import {
  CHAPTER_ROWS,
  CLOSING_FACTS,
  DIMENSIONS,
  FACTS,
  FAQ,
  HERO_LEAD,
  HERO_SCENE,
  HERO_TAGLINE,
  NAV_LINKS,
  PLANS,
  STEPS,
  type LandingFact,
} from '../landingContent'
import { LANDING_SCALE, SHAPE, TRACKING, TYPE } from '../tokens'
import { button, card, checkGlyph, chip, kicker } from '../ui'
import { cellWidth, columns } from './layout'
import { THUMBNAILS } from './thumbnails'

interface Sizes {
  hero: number
  headline: number
  stat: number
  quote: number
}

function sizesOf(device: Device): Sizes {
  return LANDING_SCALE[device.id]
}

/* ---------------------------------- nav -------------------------------- */

function navBar(width: number, device: Device): FrameNode {
  const bar = stack({
    name: 'nav',
    direction: 'HORIZONTAL',
    gap: 16,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width,
  })
  bar.primaryAxisSizingMode = 'FIXED'
  bar.resize(width, 72)
  bar.appendChild(brandWordmark(22))
  if (device.id === 'desktop') {
    const links = stack({ name: 'links', direction: 'HORIZONTAL', gap: 28, align: 'CENTER' })
    for (const link of NAV_LINKS) {
      links.appendChild(text(link, { size: TYPE.body, weight: 600, color: 'ink2' }))
    }
    bar.appendChild(links)
  }
  const actions = stack({ name: 'actions', direction: 'HORIZONTAL', gap: 8, align: 'CENTER' })
  if (device.id !== 'phone') {
    const quiet = button('Já tenho conta', 'quiet')
    quiet.layoutSizingHorizontal = 'HUG'
    actions.appendChild(quiet)
  }
  const cta = button('Começar grátis')
  cta.layoutSizingHorizontal = 'HUG'
  cta.resize(cta.width, 44)
  actions.appendChild(cta)
  bar.appendChild(actions)
  return bar
}

/* --------------------------------- hero -------------------------------- */

/** An anchor drawn as the ghost button: it scrolls, it does not navigate. */
function ghostLink(label: string): FrameNode {
  const frame = stack({
    name: `link/${label}`,
    direction: 'HORIZONTAL',
    padding: [8, 20],
    fill: 'card',
    radius: SHAPE.button,
    border: { color: 'lineStrong', weight: 1 },
    align: 'CENTER',
    justify: 'CENTER',
  })
  frame.primaryAxisSizingMode = 'FIXED'
  frame.resize(frame.width, 44)
  frame.appendChild(
    text(label, { size: TYPE.body, weight: 600, color: 'ink2', tracking: TRACKING.body }),
  )
  return frame
}

/** The product is the picture: the scene screen inside a plain frame. */
function heroShot(width: number): FrameNode {
  const shot = stack({
    name: 'shot',
    padding: 10,
    fill: 'card',
    radius: SHAPE.card,
    border: { color: 'line', weight: 1 },
    width,
  })
  const inner = width - 20
  const screen = stack({
    name: 'screen',
    gap: 14,
    padding: 18,
    fill: 'paper',
    radius: SHAPE.tile,
    width: inner,
  })
  const column = inner - 36
  const bar = stack({
    name: 'screenBar',
    direction: 'HORIZONTAL',
    gap: 8,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width: column,
  })
  bar.appendChild(text('Trilha', { size: TYPE.meta, weight: 600, color: 'ink2' }))
  const chips = stack({ name: 'chips', direction: 'HORIZONTAL', gap: 6, align: 'CENTER' })
  chips.appendChild(chip('3 dias', 'streak'))
  chips.appendChild(chip('1/3 envios hoje'))
  bar.appendChild(chips)
  screen.appendChild(fill(bar))
  screen.appendChild(fill(nightPanel(HERO_SCENE.narration, { width: column, size: TYPE.lead })))
  screen.appendChild(
    fill(speechRow({ speech: HERO_SCENE.speech, who: HERO_SCENE.speaker, width: column, size: TYPE.lead })),
  )
  const objective = card({ active: true, gap: 8, width: column, name: 'objetivo' })
  objective.appendChild(kicker('Seu objetivo'))
  objective.appendChild(
    fill(
      text(HERO_SCENE.objective, {
        size: TYPE.body,
        weight: 600,
        lineHeight: 1.5,
        width: column - 36,
      }),
    ),
  )
  screen.appendChild(fill(objective))
  const fake = stack({
    name: 'fakeButton',
    direction: 'HORIZONTAL',
    fill: 'caneta',
    radius: SHAPE.button,
    align: 'CENTER',
    justify: 'CENTER',
    width: column,
  })
  fake.primaryAxisSizingMode = 'FIXED'
  fake.resize(column, 50)
  fake.effects = pressShadow('canetaPress')
  fake.appendChild(text('Argumentar', { size: TYPE.body, weight: 700, color: 'card' }))
  screen.appendChild(fill(fake))
  shot.appendChild(fill(screen))
  return shot
}

function hero(width: number, device: Device): FrameNode {
  const sizes = sizesOf(device)
  const wide = device.id === 'desktop'
  const copyWidth = wide ? Math.round((width - 72) * (7 / 13)) : width
  const shotWidth = wide ? width - 72 - copyWidth : width

  const copy = stack({ name: 'heroCopy', gap: 22, width: copyWidth })
  copy.appendChild(chip('Beta gratuito · 3 correções por dia'))
  copy.appendChild(
    fill(
      text(HERO_TAGLINE, {
        size: sizes.hero,
        weight: 800,
        lineHeight: 1.04,
        tracking: -3.5,
        width: copyWidth,
      }),
    ),
  )
  copy.appendChild(
    fill(
      text(HERO_LEAD, {
        size: TYPE.lead,
        color: 'ink2',
        lineHeight: 1.55,
        tracking: TRACKING.lead,
        width: Math.min(544, copyWidth),
      }),
    ),
  )
  const ctaRow = stack({ name: 'ctaRow', direction: 'HORIZONTAL', gap: 12, align: 'CENTER', wrap: true, width: copyWidth })
  const cta = button('Começar grátis')
  cta.layoutSizingHorizontal = 'HUG'
  ctaRow.appendChild(cta)
  ctaRow.appendChild(ghostLink('Ver como funciona'))
  copy.appendChild(fill(ctaRow))
  copy.appendChild(
    fill(
      text('Sem cartão. Só pedimos e-mail, apelido e o ano do seu vestibular.', {
        size: TYPE.meta,
        color: 'muted',
        lineHeight: 1.5,
        width: copyWidth,
      }),
    ),
  )

  const frame = stack({
    name: 'hero',
    direction: wide ? 'HORIZONTAL' : 'VERTICAL',
    gap: wide ? 72 : 40,
    padding: wide ? [72, 0, 96, 0] : [32, 0, 56, 0],
    align: wide ? 'CENTER' : 'MIN',
    width,
  })
  frame.appendChild(copy)
  frame.appendChild(heroShot(shotWidth))
  return frame
}

/* --------------------------------- facts ------------------------------- */

function factBlock(fact: LandingFact, width: number, size: number): FrameNode {
  const block = stack({ name: `fact/${fact.label}`, gap: 8, width })
  block.appendChild(
    text(fact.number, { size, weight: 800, tracking: TRACKING.title, lineHeight: 1 }),
  )
  block.appendChild(text(fact.label, { size: TYPE.body, weight: 700 }))
  block.appendChild(
    fill(text(fact.note, { size: TYPE.meta, color: 'muted', lineHeight: 1.45, width })),
  )
  return block
}

function factsStrip(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const strip = stack({
    name: 'facts',
    gap: 28,
    padding: desktop ? [44, 0] : [32, 0],
    width,
    border: { color: 'line', weight: 1, sides: ['top', 'bottom'] },
  })
  const perRow = desktop ? 4 : 2
  const gap = desktop ? 40 : 20
  const cell = cellWidth(width, perRow, gap)
  const blocks = FACTS.map((fact) => factBlock(fact, cell, sizesOf(device).stat))
  for (const row of columns(blocks, perRow, width, gap)) strip.appendChild(fill(row))
  return strip
}

/* ------------------------------- sections ------------------------------ */

function sectionHead(title: string, sub: string | null, width: number, device: Device): FrameNode {
  const head = stack({
    name: 'sectionHead',
    gap: 14,
    padding: [0, 0, device.id === 'desktop' ? 56 : 40, 0],
    width,
  })
  const inner = Math.min(736, width)
  head.appendChild(
    text(title, {
      size: sizesOf(device).headline,
      weight: 800,
      lineHeight: 1.08,
      tracking: TRACKING.title,
      width: inner,
    }),
  )
  if (sub !== null) {
    head.appendChild(
      text(sub, {
        size: TYPE.lead,
        color: 'ink2',
        lineHeight: 1.55,
        tracking: TRACKING.lead,
        width: inner,
      }),
    )
  }
  return head
}

function section(width: number, device: Device, tight = false): FrameNode {
  const pad = device.id === 'desktop' ? 112 : 72
  return stack({
    name: 'section',
    gap: 0,
    padding: [tight ? 0 : pad, 0, pad, 0],
    width,
  })
}

/* ------------------------------- histórias ----------------------------- */

function chapterCard(entry: ChapterRow, width: number): FrameNode {
  const shell = card({ gap: 10, width, name: `capitulo/${entry.title}` })
  const tag = stack({ name: 'tag', direction: 'HORIZONTAL', gap: 8, align: 'CENTER', wrap: true })
  tag.appendChild(text(entry.story, { size: TYPE.meta, weight: 700, color: 'muted' }))
  tag.appendChild(chip(entry.tag, entry.boss ? 'caneta' : 'neutral'))
  shell.appendChild(tag)
  shell.appendChild(
    text(entry.title, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead, lineHeight: 1.3 }),
  )
  shell.appendChild(
    fill(
      text(entry.objective, {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.5,
        width: width - 36,
      }),
    ),
  )
  return shell
}

interface ChapterRow {
  story: string
  tag: string
  boss: boolean
  title: string
  objective: string
}

/** The marquee rolls in the browser; here it is the same rows of cards, clipped
 *  by the viewport exactly as the animation shows them. Both rows sit flush
 *  against the left edge, as the stylesheet has them: the offset a reader sees
 *  comes from the two animations running in opposite directions, and a static
 *  frame cannot carry that. */
function marquee(device: Device): FrameNode {
  const cardWidth = device.id === 'phone' ? 300 : 340
  const frame = stack({ name: 'marquee', gap: 16, width: device.width })
  frame.clipsContent = true
  for (const [index, row] of CHAPTER_ROWS.entries()) {
    const line = stack({
      name: `row/${index + 1}`,
      direction: 'HORIZONTAL',
      gap: 16,
      align: 'MIN',
    })
    for (const entry of row) line.appendChild(chapterCard(entry, cardWidth))
    frame.appendChild(line)
  }
  return frame
}

/* ----------------------------- como funciona --------------------------- */

function howItWorks(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const steps = stack({ name: 'steps', gap: desktop ? 24 : 20, width })
  for (const [index, step] of STEPS.entries()) {
    const pad = desktop ? 40 : 24
    const shell = stack({
      name: `step/${step.number}`,
      direction: desktop ? 'HORIZONTAL' : 'VERTICAL',
      gap: desktop ? 56 : 22,
      padding: pad,
      fill: 'card',
      radius: SHAPE.card,
      border: { color: 'line', weight: 1 },
      align: desktop ? 'CENTER' : 'MIN',
      width,
    })
    const inner = width - pad * 2
    const headWidth = desktop ? Math.round((inner - 56) * (5 / 12)) : inner
    const miniWidth = desktop ? inner - 56 - headWidth : inner
    const head = stack({ name: 'head', gap: 10, width: headWidth })
    head.appendChild(text(step.number, { size: TYPE.meta, weight: 700, color: 'caneta' }))
    head.appendChild(
      fill(
        text(step.title, {
          size: TYPE.title,
          weight: 800,
          tracking: TRACKING.title,
          lineHeight: 1.15,
          width: headWidth,
        }),
      ),
    )
    head.appendChild(
      fill(
        text(step.text, {
          size: TYPE.body,
          color: 'ink2',
          lineHeight: 1.58,
          width: headWidth,
        }),
      ),
    )
    shell.appendChild(head)
    const mini = stack({
      name: 'mini',
      gap: 10,
      padding: 14,
      fill: 'paper',
      radius: SHAPE.tile,
      border: { color: 'line', weight: 1 },
      width: miniWidth,
    })
    mini.appendChild(fill(THUMBNAILS[index](miniWidth - 28)))
    shell.appendChild(mini)
    steps.appendChild(fill(shell))
  }
  return steps
}

/* -------------------------------- thesis ------------------------------- */

function thesis(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const sizes = sizesOf(device)
  const frame = stack({
    name: 'thesis',
    gap: desktop ? 28 : 24,
    padding: desktop ? [88, 96] : [40, 24],
    fill: 'noite',
    radius: SHAPE.card,
    width,
  })
  const inner = width - (desktop ? 192 : 48)
  frame.appendChild(
    text('Treinar redação hoje é solitário e abstrato: um tema, uma folha em branco e uma nota dias depois.', {
      size: sizes.quote,
      weight: 800,
      color: 'luz',
      lineHeight: 1.2,
      tracking: TRACKING.title,
      width: Math.min(inner, desktop ? 620 : inner),
    }),
  )
  frame.appendChild(
    text('Com um interlocutor que responde, consequência imediata e correção na hora, treino vira hábito. É para isso que o Argumenta existe.', {
      size: TYPE.lead,
      color: 'luzMuted',
      lineHeight: 1.55,
      tracking: TRACKING.lead,
      width: Math.min(inner, 608),
    }),
  )
  const who = stack({ name: 'who', direction: 'HORIZONTAL', gap: 9, align: 'CENTER' })
  who.appendChild(rect(18, 1, 'luzMuted'))
  who.appendChild(text('A tese do Argumenta', { size: TYPE.meta, weight: 700, color: 'luzMuted' }))
  frame.appendChild(who)
  return frame
}

/* ------------------------------- dimensions ---------------------------- */

function dimensionCard(width: number, entry: (typeof DIMENSIONS)[number]): FrameNode {
  const shell = stack({
    name: `dimensao/${entry.number}`,
    gap: 10,
    padding: 20,
    fill: 'card',
    radius: SHAPE.card,
    border: { color: 'line', weight: 1 },
    width,
  })
  const top = stack({
    name: 'top',
    direction: 'HORIZONTAL',
    gap: 8,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    wrap: true,
    width: width - 40,
  })
  top.appendChild(text(entry.number, { size: TYPE.meta, weight: 700, color: 'muted' }))
  if (entry.argumentaOnly) top.appendChild(chip('critério Argumenta'))
  shell.appendChild(fill(top))
  shell.appendChild(
    fill(
      text(entry.title, {
        size: TYPE.lead,
        weight: 700,
        tracking: TRACKING.lead,
        lineHeight: 1.25,
        width: width - 40,
      }),
    ),
  )
  shell.appendChild(
    fill(
      text(entry.text, {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.5,
        width: width - 40,
      }),
    ),
  )
  return shell
}

/* --------------------------------- plans ------------------------------- */

function planCard(width: number, plan: (typeof PLANS)[number]): FrameNode {
  const shell = stack({
    name: `plano/${plan.name}`,
    gap: 22,
    padding: 28,
    fill: 'card',
    radius: SHAPE.card,
    border: { color: plan.startable ? 'caneta' : 'line', weight: plan.startable ? 1.5 : 1 },
    width,
  })
  const inner = width - 56
  const head = stack({ name: 'head', gap: 10, width: inner })
  const top = stack({
    name: 'top',
    direction: 'HORIZONTAL',
    gap: 8,
    align: 'CENTER',
    justify: 'SPACE_BETWEEN',
    width: inner,
  })
  top.appendChild(
    text(plan.name, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead, lineHeight: 1.2 }),
  )
  top.appendChild(chip(plan.startable ? 'Beta' : 'Em breve', plan.startable ? 'neutral' : 'caneta'))
  head.appendChild(fill(top))
  const price = stack({ name: 'price', direction: 'HORIZONTAL', gap: 8, align: 'BASELINE', wrap: true })
  if (plan.price === null) {
    price.appendChild(
      text('Preço a definir', {
        size: TYPE.lead,
        weight: 700,
        color: 'ink2',
        tracking: TRACKING.lead,
      }),
    )
  } else {
    price.appendChild(
      text(plan.price, { size: 36, weight: 800, tracking: TRACKING.title, lineHeight: 1 }),
    )
  }
  price.appendChild(text(plan.priceNote, { size: TYPE.meta, weight: 600, color: 'muted' }))
  head.appendChild(price)
  head.appendChild(
    fill(
      text(plan.description, {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.5,
        width: inner,
      }),
    ),
  )
  shell.appendChild(fill(head))
  const features = stack({ name: 'features', gap: 10, width: inner })
  for (const feature of plan.features) {
    const row = stack({ name: 'feature', direction: 'HORIZONTAL', gap: 10, align: 'MIN', width: inner })
    row.appendChild(checkGlyph(20))
    row.appendChild(
      fill(text(feature, { size: TYPE.body, lineHeight: 1.5, width: inner - 30 })),
    )
    features.appendChild(fill(row))
  }
  shell.appendChild(fill(features))
  if (plan.startable) {
    shell.appendChild(fill(button('Começar grátis')))
  } else {
    const waiting = stack({ name: 'waiting', align: 'CENTER', justify: 'CENTER', width: inner })
    waiting.primaryAxisSizingMode = 'FIXED'
    waiting.resize(inner, 50)
    waiting.appendChild(
      text('Disponível depois do beta.', { size: TYPE.meta, weight: 600, color: 'muted' }),
    )
    shell.appendChild(fill(waiting))
  }
  return shell
}

/* ---------------------------------- faq -------------------------------- */

function faqList(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const list = stack({
    name: 'faq',
    width,
    border: { color: 'line', weight: 1, sides: ['top'] },
  })
  for (const entry of FAQ) {
    const row = stack({
      name: `pergunta/${entry.number}`,
      direction: desktop ? 'HORIZONTAL' : 'VERTICAL',
      gap: desktop ? 32 : 10,
      padding: desktop ? [40, 0] : [28, 0],
      align: 'MIN',
      width,
      border: { color: 'line', weight: 1, sides: ['bottom'] },
    })
    row.appendChild(
      text(entry.number, {
        size: TYPE.meta,
        weight: 700,
        color: 'caneta',
        width: desktop ? 96 : undefined,
      }),
    )
    const rest = desktop ? width - 96 - 64 : width
    const questionWidth = desktop ? Math.round(rest * (5 / 12)) : rest
    const answerWidth = desktop ? rest - questionWidth : rest
    row.appendChild(
      text(entry.question, {
        size: TYPE.title,
        weight: 800,
        tracking: TRACKING.title,
        lineHeight: 1.2,
        width: questionWidth,
      }),
    )
    row.appendChild(
      text(entry.answer, {
        size: desktop ? TYPE.lead : TYPE.body,
        color: 'ink2',
        lineHeight: desktop ? 1.55 : 1.6,
        tracking: desktop ? TRACKING.lead : undefined,
        width: answerWidth,
      }),
    )
    list.appendChild(fill(row))
  }
  return list
}

/* -------------------------------- closing ------------------------------ */

function closing(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const frame = stack({
    name: 'closing',
    gap: 20,
    padding: desktop ? [120, 0, 80, 0] : [80, 0, 64, 0],
    align: 'CENTER',
    width,
  })
  frame.appendChild(penMark(160))
  frame.appendChild(
    text('Pare de treinar no vazio. Comece a convencer alguém.', {
      size: sizesOf(device).hero,
      weight: 800,
      align: 'CENTER',
      lineHeight: 1.08,
      tracking: TRACKING.title,
      width: Math.min(width, desktop ? 800 : width),
    }),
  )
  frame.appendChild(
    text('Pronto quando você estiver.', {
      size: TYPE.lead,
      color: 'ink2',
      align: 'CENTER',
      lineHeight: 1.55,
    }),
  )
  const cta = button('Começar grátis')
  cta.layoutSizingHorizontal = 'HUG'
  frame.appendChild(cta)
  frame.appendChild(
    text('Entre com Google ou crie uma conta com e-mail.', {
      size: TYPE.meta,
      color: 'muted',
      align: 'CENTER',
    }),
  )
  const factsWidth = Math.min(width, 960)
  const strip = stack({
    name: 'closingFacts',
    gap: 28,
    padding: [desktop ? 40 : 32, 0, 0, 0],
    width: factsWidth,
    border: { color: 'line', weight: 1, sides: ['top'] },
  })
  const closingPerRow = desktop ? 4 : 2
  const closingGap = desktop ? 40 : 20
  const closingCell = cellWidth(factsWidth, closingPerRow, closingGap)
  const blocks = CLOSING_FACTS.map((fact) => factBlock(fact, closingCell, 36))
  for (const row of columns(blocks, closingPerRow, factsWidth, closingGap)) {
    strip.appendChild(fill(row))
  }
  frame.appendChild(strip)
  return frame
}

/* --------------------------------- footer ------------------------------ */

function footerColumn(title: string, links: string[]): FrameNode {
  const column = stack({ name: `footer/${title}`, gap: 12 })
  column.appendChild(text(title, { size: TYPE.meta, weight: 700 }))
  for (const link of links) {
    column.appendChild(text(link, { size: TYPE.body, color: 'ink2' }))
  }
  return column
}

function footer(width: number, device: Device): FrameNode {
  const desktop = device.id === 'desktop'
  const frame = stack({
    name: 'footer',
    direction: device.id === 'phone' ? 'VERTICAL' : 'HORIZONTAL',
    gap: desktop ? 40 : 32,
    padding: [40, 0, 48, 0],
    align: 'MIN',
    wrap: device.id === 'tablet',
    width,
    border: { color: 'line', weight: 1, sides: ['top'] },
  })
  const brandWidth = desktop ? Math.round((width - 80) * 0.5) : Math.min(416, width)
  const brand = stack({ name: 'brand', gap: 14, width: brandWidth })
  brand.appendChild(brandWordmark(22))
  brand.appendChild(
    fill(
      text('Treino de argumentação escrita para o ENEM e a FUVEST, dentro de histórias.', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.5,
        width: brandWidth,
      }),
    ),
  )
  brand.appendChild(text('© 2026 Argumenta', { size: TYPE.meta, color: 'muted' }))
  frame.appendChild(brand)
  frame.appendChild(footerColumn('Produto', [...NAV_LINKS, 'Entrar']))
  frame.appendChild(footerColumn('Legal', ['Política de privacidade', 'Termos de uso']))
  return frame
}

/* --------------------------------- page -------------------------------- */

/** The promotional page a visitor reads before signing up: one frame per width,
 *  the full scroll, since a landing is judged by its whole length. */
export function landing(device: Device): FrameNode {
  const column = columnFor(device, 'landing')
  const width = column.width
  const frame = deviceFrame(device, {
    name: 'Landing',
    axis: 'VERTICAL',
    height: 'content',
    align: 'CENTER',
  })

  const wrap = (child: FrameNode): FrameNode => {
    const holder = stack({ name: 'wrap', padding: [0, column.padX], align: 'MIN', width: device.width })
    holder.appendChild(child)
    return holder
  }

  frame.appendChild(fill(wrap(navBar(width, device))));
  frame.appendChild(fill(wrap(hero(width, device))))
  frame.appendChild(fill(wrap(factsStrip(width, device))))

  const stories = section(width, device)
  stories.appendChild(
    fill(
      sectionHead(
        'Cada capítulo é uma discussão que você precisa vencer.',
        'Três histórias no beta. Cada uma embrulha um tema que já caiu de verdade no ENEM ou na FUVEST, e termina com a redação completa no formato da prova.',
        width,
        device,
      ),
    ),
  )
  frame.appendChild(fill(wrap(stories)))
  frame.appendChild(fill(marquee(device)))

  const how = section(width, device, true)
  how.appendChild(fill(sectionHead('Como funciona', 'Você escreve. O personagem responde. A história segue, ou não.', width, device)))
  how.appendChild(fill(howItWorks(width, device)))
  frame.appendChild(fill(wrap(how)))

  frame.appendChild(fill(wrap(thesis(width, device))))

  const criteria = section(width, device)
  criteria.appendChild(
    fill(
      sectionHead(
        'Corrigido com a régua da banca, explicado como um professor explicaria.',
        'Um motor único avalia cinco dimensões. ENEM e FUVEST são lentes: mudam como a nota aparece, nunca o veredito.',
        width,
        device,
      ),
    ),
  )
  const perRow = device.id === 'desktop' ? 5 : device.id === 'tablet' ? 2 : 1
  const dimensionWidth = cellWidth(width, perRow, 16)
  const cards = DIMENSIONS.map((entry) => dimensionCard(dimensionWidth, entry))
  for (const row of columns(cards, perRow, width, 16)) criteria.appendChild(fill(row))
  criteria.appendChild(
    fill(
      text('Toda nota vem com o trecho do seu texto que a justifica. Sem evidência, sem desconto.', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.55,
        width: Math.min(736, width),
      }),
    ),
  )
  frame.appendChild(fill(wrap(criteria)))

  const plans = section(width, device, true)
  plans.appendChild(
    fill(
      sectionHead(
        'Comece de graça. Pague só quando o hábito pegar.',
        'O beta é gratuito, com limite diário de correções. Os planos pagos vão ampliar o limite e abrir a sua evolução por dimensão.',
        width,
        device,
      ),
    ),
  )
  const planPerRow = device.id === 'phone' ? 1 : 3
  const planWidth = cellWidth(width, planPerRow, 20)
  const planCards = PLANS.map((plan) => planCard(planWidth, plan))
  for (const row of columns(planCards, planPerRow, width, 20)) {
    plans.appendChild(fill(row))
  }
  plans.appendChild(
    fill(
      text('Qualquer envio mantém a sua sequência, em qualquer plano.', {
        size: TYPE.meta,
        color: 'muted',
        lineHeight: 1.55,
        width: Math.min(736, width),
      }),
    ),
  )
  frame.appendChild(fill(wrap(plans)))

  const questions = section(width, device, true)
  questions.appendChild(fill(sectionHead('As três perguntas que todo mundo faz', null, width, device)))
  questions.appendChild(fill(faqList(width, device)))
  frame.appendChild(fill(wrap(questions)))

  frame.appendChild(fill(wrap(closing(width, device))))
  frame.appendChild(fill(wrap(footer(width, device))))
  return frame
}

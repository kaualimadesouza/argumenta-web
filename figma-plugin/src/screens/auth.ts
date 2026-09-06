import {
  brandWordmark,
  deviceFrame,
  fitToDevice,
  penMark,
  screenBar,
  screenFrame,
  settle,
} from '../chrome'
import { columnFor, type Device } from '../devices'
import { applyBorder, fill, grow, paint, stack, text } from '../nodes'
import { LEGAL } from '../samples'
import { TRACKING, TYPE } from '../tokens'
import { button, field } from '../ui'

/* ------------------------------ brand art ------------------------------ */


const GOOGLE_G = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>`

/** Google's own four-colour G on the white tile their branding rules require. */
function googleButton(): FrameNode {
  const frame = button('Entrar com Google')
  const tile = stack({
    name: 'googleTile',
    direction: 'HORIZONTAL',
    fill: 'card',
    radius: 5,
    align: 'CENTER',
    justify: 'CENTER',
    width: 22,
  })
  tile.primaryAxisSizingMode = 'FIXED'
  tile.resize(22, 22)
  const glyph = figma.createNodeFromSvg(GOOGLE_G)
  glyph.resize(13, 13)
  tile.appendChild(glyph)
  frame.insertChild(0, tile)
  return frame
}

/* ------------------------------- entrada ------------------------------- */

export function entrada(device: Device): FrameNode {
  const wide = device.id === 'desktop'
  const frame = deviceFrame(device, {
    name: 'Entrada',
    axis: wide ? 'HORIZONTAL' : 'VERTICAL',
    height: 'device',
  })

  const brandWidth = wide ? Math.round(device.width * 0.52) : device.width
  const brand = stack({
    name: 'brand',
    gap: wide ? 22 : 18,
    padding: [32, 20, 16, 20],
    fill: wide ? 'noite' : null,
    align: 'CENTER',
    justify: 'CENTER',
    width: brandWidth,
  })
  brand.appendChild(penMark(200))
  brand.appendChild(brandWordmark(wide ? 56 : 44, wide))
  brand.appendChild(
    text('Vença a discussão dentro da história. Passe no vestibular fora dela.', {
      size: wide ? 22 : TYPE.lead,
      color: wide ? 'luzMuted' : 'ink2',
      lineHeight: 1.55,
      align: 'CENTER',
      width: wide ? 380 : Math.min(300, device.width - 80),
    }),
  )

  // the actions pane carries its own box on a wide screen, 25rem with 3rem of
  // padding, so border-box leaves a 304px column inside it
  const listWidth = wide ? 400 - 96 : columnFor(device, 'narrow').width
  const actions = stack({
    name: 'actions',
    gap: 10,
    padding: wide ? 48 : [0, 20, 24, 20],
    align: 'CENTER',
    justify: 'CENTER',
    width: wide ? device.width - brandWidth : device.width,
  })
  const list = stack({ name: 'list', gap: 10, width: listWidth })
  list.appendChild(fill(googleButton()))
  list.appendChild(fill(button('Criar conta com e-mail', 'ghost')))
  list.appendChild(
    fill(
      text('Só pedimos e-mail, apelido e o ano do seu vestibular. Nada mais.', {
        size: TYPE.meta,
        color: 'muted',
        lineHeight: 1.5,
        align: 'CENTER',
        width: listWidth,
      }),
    ),
  )
  const quiet = button('Já tenho conta', 'quiet')
  quiet.layoutSizingHorizontal = 'HUG'
  const quietRow = stack({ name: 'quietRow', align: 'CENTER', width: listWidth })
  quietRow.appendChild(quiet)
  list.appendChild(fill(quietRow))
  actions.appendChild(list)

  frame.appendChild(wide ? fill(brand) : grow(fill(brand)))
  frame.appendChild(wide ? grow(fill(actions)) : fill(actions))
  return fitToDevice(frame, device)
}

/* -------------------------------- forms -------------------------------- */

export function entrarEmail(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Entrar com e-mail', shell: false, shape: 'narrow' })
  const width = screen.width
  screen.content.appendChild(text('← Voltar', { size: TYPE.meta, weight: 600, color: 'ink2' }))
  screen.content.appendChild(
    text('Entrar', { size: TYPE.title, weight: 800, tracking: TRACKING.title, lineHeight: 1.15 }),
  )
  const form = stack({ name: 'form', gap: 14, width })
  form.appendChild(fill(field({ label: 'E-mail', value: 'kaua@exemplo.com', width })))
  form.appendChild(fill(field({ label: 'Senha', value: '••••••••', width })))
  form.appendChild(fill(button('Entrar')))
  screen.content.appendChild(fill(form))
  return settle(screen, device)
}

function consentRow(width: number): FrameNode {
  const row = stack({ name: 'consent', direction: 'HORIZONTAL', gap: 10, align: 'MIN', width })
  const box = stack({ name: 'checkbox', radius: 4, fill: 'card', width: 18 })
  box.primaryAxisSizingMode = 'FIXED'
  box.resize(18, 18)
  applyBorder(box, { color: 'lineStrong', weight: 1 })
  row.appendChild(box)
  const body =
    'Li e aceito os termos de uso e a política de privacidade. Se você tem menos de 18 anos, mostre as duas páginas para quem responde por você.'
  const copy = text(body, { size: TYPE.meta, lineHeight: 1.5, width: width - 28 })
  for (const link of ['termos de uso', 'política de privacidade']) {
    const at = body.indexOf(link)
    copy.setRangeFills(at, at + link.length, paint('caneta'))
    copy.setRangeTextDecoration(at, at + link.length, 'UNDERLINE')
  }
  row.appendChild(fill(copy))
  return row
}

export function criarConta(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Criar conta', shell: false, shape: 'narrow' })
  const width = screen.width
  screen.content.appendChild(text('← Voltar', { size: TYPE.meta, weight: 600, color: 'ink2' }))
  screen.content.appendChild(
    text('Criar conta', { size: TYPE.title, weight: 800, tracking: TRACKING.title, lineHeight: 1.15 }),
  )
  screen.content.appendChild(
    fill(
      text('Três campos e você já está dentro da primeira história.', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.6,
        width,
      }),
    ),
  )
  const form = stack({ name: 'form', gap: 14, width })
  form.appendChild(
    fill(field({ label: 'Apelido', value: 'Kauã', hint: 'É como o Argumenta vai te chamar.', width })),
  )
  form.appendChild(fill(field({ label: 'E-mail', value: 'kaua@exemplo.com', width })))
  form.appendChild(
    fill(field({ label: 'Senha', value: '••••••••', hint: 'Pelo menos 8 caracteres.', width })),
  )
  form.appendChild(fill(consentRow(width)))
  form.appendChild(fill(button('Criar conta')))
  screen.content.appendChild(fill(form))
  return settle(screen, device)
}

export function googleCallback(device: Device): FrameNode {
  const screen = screenFrame(device, {
    name: 'Entrando com Google',
    shell: false,
    shape: 'narrow',
    centred: true,
  })
  screen.content.appendChild(
    fill(
      text('Entrando com o Google…', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.6,
        align: 'CENTER',
        width: screen.width,
      }),
    ),
  )
  return settle(screen, device)
}

/* --------------------------------- legal ------------------------------- */

export function legal(device: Device): FrameNode {
  const screen = screenFrame(device, { name: 'Privacidade', shell: false, shape: 'document' })
  const width = screen.width
  screen.content.appendChild(screenBar(width, '← Argumenta', []))
  screen.content.appendChild(
    fill(
      text(LEGAL.title, {
        size: device.id === 'phone' ? TYPE.title : 36,
        weight: 800,
        tracking: TRACKING.title,
        lineHeight: 1.12,
        width,
      }),
    ),
  )
  screen.content.appendChild(
    fill(text(LEGAL.summary, { size: TYPE.lead, color: 'ink2', lineHeight: 1.6, width })),
  )
  screen.content.appendChild(
    text(LEGAL.updatedAt, { size: TYPE.meta, weight: 600, color: 'muted' }),
  )
  for (const section of LEGAL.sections) {
    const block = stack({ name: `secao/${section.heading}`, gap: 10, padding: [16, 0, 0, 0], width })
    block.appendChild(
      text(section.heading, { size: TYPE.lead, weight: 700, tracking: TRACKING.lead }),
    )
    block.appendChild(
      fill(text(section.paragraph, { size: TYPE.body, lineHeight: 1.6, color: 'ink2', width })),
    )
    for (const item of section.items ?? []) {
      const bullet = stack({ name: 'item', direction: 'HORIZONTAL', gap: 8, align: 'MIN', width })
      bullet.appendChild(text('•', { size: TYPE.body, color: 'muted' }))
      bullet.appendChild(
        fill(text(item, { size: TYPE.body, lineHeight: 1.6, color: 'ink2', width: width - 20 })),
      )
      block.appendChild(fill(bullet))
    }
    screen.content.appendChild(fill(block))
  }
  return settle(screen, device)
}

/* -------------------------------- 404 ---------------------------------- */

export function notFound(device: Device): FrameNode {
  const screen = screenFrame(device, {
    name: '404',
    shell: false,
    shape: 'document',
    centred: true,
  })
  const inner = Math.min(416, screen.width)
  const block = stack({ name: 'block', gap: 16, align: 'CENTER', width: inner })
  block.appendChild(
    fill(
      text('Essa página não existe. Talvez o link esteja velho, ou a tela ainda esteja por vir.', {
        size: TYPE.body,
        color: 'ink2',
        lineHeight: 1.6,
        align: 'CENTER',
        width: inner,
      }),
    ),
  )
  const cta = button('Voltar para a trilha', 'ghost')
  cta.layoutSizingHorizontal = 'HUG'
  block.appendChild(cta)
  screen.content.appendChild(block)
  return settle(screen, device)
}

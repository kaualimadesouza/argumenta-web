/** The cards of src/profile, shared by the account screen and the onboarding. */
import { fill, grow, stack, text } from '../nodes'
import { TRACKING, TYPE } from '../tokens'
import { button, card, chip, field, kicker } from '../ui'

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

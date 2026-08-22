import type { LegalBlock, LegalSection } from './document'

interface Controller {
  name: string
  document: string
  email: string
  pending: boolean
}

/** Placeholder until the owner registers the entity: `pending` keeps the page
 *  saying so out loud, so nobody ships a policy with no one responsible. */
const CONTROLLER: Controller = {
  name: 'Argumenta',
  document: 'CNPJ a definir',
  email: 'privacidade a definir',
  pending: true,
}

/** Same closing section in both documents: one controller, stated once. */
export function controllerSection(): LegalSection {
  const blocks: LegalBlock[] = [
    {
      kind: 'paragraph',
      text: `Controlador dos dados e responsável pelo serviço: ${CONTROLLER.name}. Documento: ${CONTROLLER.document}. Contato: ${CONTROLLER.email}.`,
    },
  ]
  if (CONTROLLER.pending) {
    blocks.push({
      kind: 'paragraph',
      text: 'Aviso: este texto é um rascunho pendente de revisão jurídica e os dados do controlador ainda não estão definidos. Nada disso vale antes do beta abrir.',
    })
  }
  return { heading: 'Quem responde por isso', blocks }
}

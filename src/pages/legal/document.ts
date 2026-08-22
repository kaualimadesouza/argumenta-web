export type LegalBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }

export interface LegalSection {
  heading: string
  blocks: LegalBlock[]
}

export interface LegalDocument {
  title: string
  summary: string
  updatedAt: string
  sections: LegalSection[]
}

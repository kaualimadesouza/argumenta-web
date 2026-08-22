import { Link } from 'react-router-dom'

import type { LegalBlock, LegalDocument } from './document'
import styles from './LegalPage.module.css'

interface RelatedDocument {
  label: string
  to: string
}

interface LegalPageProps {
  content: LegalDocument
  related: RelatedDocument
}

function Block({ block }: { block: LegalBlock }) {
  if (block.kind === 'list') {
    return (
      <ul className={styles.list}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p className={styles.paragraph}>{block.text}</p>
}

export function LegalPage({ content, related }: LegalPageProps) {
  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Argumenta
      </Link>
      <h1 className={styles.title}>{content.title}</h1>
      <p className={styles.summary}>{content.summary}</p>
      <p className={styles.updated}>Atualizado em {content.updatedAt}</p>
      {content.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}
      <footer className={styles.footer}>
        <Link to={related.to}>{related.label}</Link>
      </footer>
    </main>
  )
}

import styles from './Wordmark.module.css'

interface WordmarkProps {
  as?: 'h1' | 'span'
  className?: string
}

/** "Argu" under the highlighter, as in the mockups and the Figma topbar.
 *  aria-label because the split word must not be announced as two words. */
export function Wordmark({ as: Tag = 'span', className }: WordmarkProps) {
  return (
    <Tag aria-label="Argumenta" className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <mark className={styles.highlight}>Argu</mark>menta
    </Tag>
  )
}

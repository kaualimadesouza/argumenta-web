import { Chip } from '../../components/Chip'
import { type ChapterCard, CHAPTER_ROWS } from './content'
import styles from './ChapterMarquee.module.css'

function Row({ cards, reverse }: { cards: ChapterCard[]; reverse: boolean }) {
  // the row is laid twice so the loop closes without a seam; the copy is decoration
  return (
    <div className={[styles.row, reverse ? styles.reverse : undefined].filter(Boolean).join(' ')}>
      {[false, true].map((copy) => (
        <div key={String(copy)} className={styles.half} aria-hidden={copy ? 'true' : undefined}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <div className={styles.tag}>
                <span>{card.story}</span>
                <Chip tone={card.boss ? 'caneta' : 'neutral'}>{card.tag}</Chip>
              </div>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.objective}>{card.objective}</p>
            </article>
          ))}
        </div>
      ))}
    </div>
  )
}

/** The seeded chapters rolling past in two rows, paused under the pointer so a
 *  card can be read. */
export function ChapterMarquee() {
  return (
    <div className={styles.marquee}>
      <Row cards={CHAPTER_ROWS[0]} reverse={false} />
      <Row cards={CHAPTER_ROWS[1]} reverse />
    </div>
  )
}

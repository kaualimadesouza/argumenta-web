import type { BeatResponse, BeatType } from '../../api/types'
import styles from './Cena.module.css'

/** The two beat types the scene draws as a labelled card. */
const CARD_LABEL: Partial<Record<BeatType, string>> = {
  objective: 'Seu objetivo',
  hint: 'Dica de repertório',
}

function Dialogue({ beat }: { beat: BeatResponse }) {
  const who = beat.character_name ?? ''
  return (
    <figure className={styles.speechRow} aria-label={who}>
      <blockquote className={styles.speech}>{beat.body}</blockquote>
      <figcaption className={styles.whoRow}>
        <span className={styles.rule} />
        <span className={styles.who}>{who}</span>
      </figcaption>
    </figure>
  )
}

/** Narration rides the night panel: it is the establishing shot of the scene,
 *  and the product has no illustration to put there yet. */
export function Beat({ beat }: { beat: BeatResponse }) {
  const label = CARD_LABEL[beat.beat_type]
  if (label !== undefined) {
    const hint = beat.beat_type === 'hint'
    return (
      <section
        className={[styles.beatCard, hint ? undefined : styles.beatCardObjective]
          .filter(Boolean)
          .join(' ')}
        aria-label={label}
      >
        <span className={[styles.kicker, hint ? styles.kickerHint : undefined].filter(Boolean).join(' ')}>
          {label}
        </span>
        {beat.body}
      </section>
    )
  }
  if (beat.beat_type === 'dialogue') return <Dialogue beat={beat} />
  return <p className={styles.narration}>{beat.body}</p>
}

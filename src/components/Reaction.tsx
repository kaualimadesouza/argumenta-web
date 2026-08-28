import type { ReactionResponse } from '../api/types'
import styles from './Reaction.module.css'

/** The character answering a judged submission, in the same shape a scene line
 *  gets: typographic attribution, no avatar. */
export function Reaction({ reaction }: { reaction: ReactionResponse }) {
  return (
    <figure className={styles.row} aria-label={reaction.character_name}>
      <blockquote className={styles.speech}>{reaction.body}</blockquote>
      <figcaption className={styles.whoRow}>
        <span className={styles.rule} />
        <span className={styles.who}>{reaction.character_name}</span>
      </figcaption>
    </figure>
  )
}

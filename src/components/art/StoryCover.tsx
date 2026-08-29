import type { StoryState } from '../../api/types'
import styles from './StoryCover.module.css'

interface StoryCoverProps {
  /** The story's place in the track, which is what the slot shows today. */
  position: number
  state: StoryState
}

const DONE = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="m5.5 12.4 4.2 4.1L18.5 7.6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LOCKED = (
  <svg viewBox="0 0 24 24" fill="none">
    <rect
      x="4.8"
      y="10.6"
      width="14.4"
      height="9.4"
      rx="2.6"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path d="M8.6 10.6V7.9a3.4 3.4 0 0 1 6.8 0v2.7" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

/** The cover slot. Real cover art drops in here once it exists; until then it
 *  carries the story's place in the track and its state, and never a drawing
 *  pretending to be one. Decorative: the title and the badge beside it already
 *  say everything a screen reader needs. */
export function StoryCover({ position, state }: StoryCoverProps) {
  if (state === 'completed') {
    return (
      <div className={[styles.cover, styles.done].join(' ')} aria-hidden="true">
        {DONE}
      </div>
    )
  }
  if (state === 'locked') {
    return (
      <div className={[styles.cover, styles.locked].join(' ')} aria-hidden="true">
        {LOCKED}
      </div>
    )
  }
  return (
    <div className={styles.cover} aria-hidden="true">
      <span className={styles.position}>{position}</span>
    </div>
  )
}

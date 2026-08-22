import type { BeatResponse, BeatType } from '../../api/types'
import { CharacterPortrait } from '../../components/art/CharacterPortrait'
import { ScenePanel } from '../../components/art/ScenePanel'
import styles from './Cena.module.css'

/** The two beat types the mockup draws as a labelled card. */
const CARD_LABEL: Partial<Record<BeatType, string>> = {
  objective: 'Seu objetivo',
  hint: 'Dica de repertório',
}

function Dialogue({ beat }: { beat: BeatResponse }) {
  const who = beat.character_name ?? ''
  return (
    <figure className={styles.speechRow} aria-label={who}>
      <CharacterPortrait name={who} asset={beat.character_portrait} />
      <div className={styles.speech}>
        <span className={styles.who}>{who}</span>
        {beat.body}
      </div>
    </figure>
  )
}

function BeatBody({ beat }: { beat: BeatResponse }) {
  const label = CARD_LABEL[beat.beat_type]
  if (label !== undefined) {
    return (
      <section className={styles.beatCard} aria-label={label}>
        <span className={styles.kicker}>{label}</span>
        {beat.body}
      </section>
    )
  }
  if (beat.beat_type === 'dialogue') return <Dialogue beat={beat} />
  return <p className={styles.narration}>{beat.body}</p>
}

/** A beat can carry both an illustration and a line: the panel comes first, the
 *  way the page reads in the mockup. */
export function Beat({ beat }: { beat: BeatResponse }) {
  return (
    <>
      {beat.illustration_asset === null ? null : <ScenePanel asset={beat.illustration_asset} />}
      <BeatBody beat={beat} />
    </>
  )
}

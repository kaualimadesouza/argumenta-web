import { Card, Kicker } from '../../components/Card'
import type { SceneSample } from './content'
import styles from './Scene.module.css'

/** A chapter opening, in the anatomy of the real scene screen: night narration,
 *  the character's line with typographic attribution, the objective card. */
export function Scene({ scene, compact = false }: { scene: SceneSample; compact?: boolean }) {
  return (
    <div className={[styles.scene, compact ? styles.compact : undefined].filter(Boolean).join(' ')}>
      <p className={styles.narration}>{scene.narration}</p>
      <figure className={styles.speechRow}>
        <blockquote className={styles.speech}>{scene.speech}</blockquote>
        <figcaption className={styles.whoRow}>
          <span className={styles.rule} />
          <span className={styles.who}>{scene.speaker}</span>
        </figcaption>
      </figure>
      {compact ? null : (
        <Card active className={styles.objective}>
          <Kicker>Seu objetivo</Kicker>
          {scene.objective}
        </Card>
      )}
    </div>
  )
}

import { useId } from 'react'

import type { LensCriterionResponse, LensResponse } from '../../api/types'
import { ProgressBar } from '../../components/ProgressBar'
import styles from './Correcao.module.css'

export function Scoreboard({ lens, floor }: { lens: LensResponse; floor: number }) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Placar
      </h2>
      <div className={styles.rows}>
        {lens.criteria.map((criterion) => (
          <Criterion key={criterion.code} criterion={criterion} floor={floor} />
        ))}
      </div>
      {lens.total === null || lens.total_max === null ? null : (
        <div className={styles.total}>
          <div className={styles.totalText}>
            <span className={styles.totalLabel}>Soma dos critérios</span>
            {lens.scale_source === 'argumenta' ? (
              <span className={styles.disclaimer}>
                Estimativa Argumenta, não é nota oficial do vestibular
              </span>
            ) : null}
          </div>
          <span className={styles.totalScore}>{`${lens.total}/${lens.total_max}`}</span>
        </div>
      )}
    </section>
  )
}

/** The criterion's own aggregate on the internal 0-100 scale, which is what the
 *  floor is measured on: the wire never maps a criterion back to its dimensions. */
function percentOf(criterion: LensCriterionResponse): number {
  return Math.round((criterion.score / criterion.scale_max) * 100)
}

function Criterion({
  criterion,
  floor,
}: {
  criterion: LensCriterionResponse
  floor: number
}) {
  const percent = percentOf(criterion)
  const below = percent < floor
  return (
    <div className={styles.row}>
      <div className={styles.rowHead}>
        <span className={styles.code}>{criterion.code}</span>
        <span className={below ? styles.labelBelow : styles.label}>{criterion.label}</span>
        {criterion.is_argumenta_extra ? (
          <span className={styles.extra}>critério Argumenta</span>
        ) : null}
        <span className={below ? styles.scoreBelow : styles.score}>
          {`${criterion.score}/${criterion.scale_max}`}
        </span>
      </div>
      <ProgressBar
        percent={percent}
        floor={floor}
        tone={below ? 'alert' : 'caneta'}
        label={below ? `${criterion.label}, abaixo do piso` : criterion.label}
      />
    </div>
  )
}

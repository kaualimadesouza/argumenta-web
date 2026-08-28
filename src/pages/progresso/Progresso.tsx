import { useCallback, useId } from 'react'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type { DimensionTrendResponse, ProgressResponse } from '../../api/types'
import { useResource } from '../../api/useResource'
import { DIMENSION_LABEL, EXAM_LABEL, MILESTONE_LABEL } from '../../copy/labels'
import styles from './Progresso.module.css'
import { sparklineOf, streakWeek } from './series'

const SPARK = { width: 120, height: 26 }

export function Progresso() {
  const api = useApi()
  const { state, reload } = useResource(useCallback(() => api.progress(), [api]))

  return (
    <Loaded resource={state} onRetry={reload}>
      {(progress) => (
        <main className={styles.page}>
          <header className={styles.bar}>
            <h1 className={styles.title}>Progresso</h1>
            <span className={styles.lens}>{`Lente ${EXAM_LABEL[progress.exam]}`}</span>
          </header>
          <Streak progress={progress} />
          <Trends dimensions={progress.dimensions} />
          <Milestones progress={progress} />
        </main>
      )}
    </Loaded>
  )
}

function Streak({ progress }: { progress: ProgressResponse }) {
  const wroteToday = progress.submissions_today > 0
  const week = streakWeek(progress.streak_days, wroteToday, new Date())
  const days = progress.streak_days === 1 ? '1 dia seguido' : `${progress.streak_days} dias seguidos`

  return (
    <section className={styles.card}>
      <div className={styles.streakHead}>
        <h2 className={styles.streakDays}>{days}</h2>
        <span className={styles.record}>{`Seu recorde é ${progress.longest_streak_days} dias`}</span>
      </div>
      <ul className={styles.week} aria-label="Seus últimos 7 dias">
        {week.map((day, index) => (
          <li
            key={index}
            className={styles.day}
            aria-label={`${day.label}, ${day.done ? 'escreveu' : 'não escreveu'}`}
          >
            <span className={styles.dayLabel} aria-hidden="true">
              {day.label}
            </span>
            <span
              className={[
                styles.box,
                day.done ? styles.boxDone : undefined,
                day.today ? styles.boxToday : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        {wroteToday
          ? 'Escreveu hoje. Volte amanhã para não zerar a sequência.'
          : 'Você ainda não escreveu hoje. Um envio mantém a sequência de pé.'}
      </p>
    </section>
  )
}

/** Signed, and with a real minus sign: the number is read, not computed. */
function deltaLabel(delta: number): string | null {
  if (delta === 0) return null
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`
}

function Trends({ dimensions }: { dimensions: DimensionTrendResponse[] }) {
  const heading = useId()
  const window = Math.max(0, ...dimensions.map((trend) => trend.points.length))

  return (
    <section aria-labelledby={heading} className={styles.card}>
      <div className={styles.cardHead}>
        <h2 id={heading} className={styles.cardTitle}>
          Como cada competência anda
        </h2>
        <span className={styles.cardNote}>
          {window === 0
            ? 'Nenhum envio corrigido ainda'
            : `Últimos ${window} dias com envio · escala 0 a 100`}
        </span>
      </div>
      <ul className={styles.trends}>
        {dimensions.map((trend) => (
          <Trend key={trend.dimension} trend={trend} />
        ))}
      </ul>
    </section>
  )
}

function Trend({ trend }: { trend: DimensionTrendResponse }) {
  const line = sparklineOf(trend.points, SPARK)
  const label = trend.criterion_label ?? DIMENSION_LABEL[trend.dimension]
  const delta = line === null ? null : deltaLabel(line.delta)

  return (
    <li className={styles.trend}>
      {trend.criterion_code === null ? null : (
        <span className={styles.code}>{trend.criterion_code}</span>
      )}
      <span className={styles.dimension}>{label}</span>
      {line === null ? (
        <span className={styles.pending}>sem envio ainda</span>
      ) : (
        <>
          <svg
            className={styles.spark}
            viewBox={`0 0 ${SPARK.width} ${SPARK.height}`}
            width={SPARK.width}
            height={SPARK.height}
            aria-hidden="true"
          >
            <polyline
              points={line.points}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={line.delta < 0 ? styles.strokeDown : styles.strokeUp}
            />
          </svg>
          <span className={styles.latest}>{line.latest}</span>
          {delta === null ? null : (
            <span className={line.delta < 0 ? styles.deltaDown : styles.deltaUp}>{delta}</span>
          )}
        </>
      )}
    </li>
  )
}

function Milestones({ progress }: { progress: ProgressResponse }) {
  const heading = useId()
  const stories = `${progress.stories_completed} de ${progress.stories_total} histórias concluídas`
  const storiesDone = progress.stories_completed === progress.stories_total

  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Marcos
      </h2>
      <ul className={styles.milestones}>
        <Milestone label={stories} done={storiesDone} />
        {progress.milestones.map((milestone) => (
          <Milestone
            key={milestone.code}
            label={MILESTONE_LABEL[milestone.code]}
            done={milestone.done}
          />
        ))}
      </ul>
    </section>
  )
}

function Milestone({ label, done }: { label: string; done: boolean }) {
  return (
    <li
      className={done ? styles.milestone : styles.milestonePending}
      aria-label={`${label}, ${done ? 'concluído' : 'ainda não'}`}
    >
      <span className={done ? styles.tickDone : styles.tickPending} aria-hidden="true" />
      <span>{label}</span>
    </li>
  )
}

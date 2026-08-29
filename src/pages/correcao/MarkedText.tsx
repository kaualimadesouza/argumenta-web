import { useId, useState } from 'react'

import { ANNOTATION_LABEL } from '../../copy/labels'
import styles from './Correcao.module.css'
import type { AnnotatedSegment, Mark } from './spans'

export function MarkedText({ segments }: { segments: AnnotatedSegment[] }) {
  const heading = useId()
  const explanation = useId()
  const [open, setOpen] = useState<number | null>(null)
  const openMark = segments.find((segment) => segment.mark === open && segment.annotation !== null)

  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Seu texto, corrigido
      </h2>
      <p className={styles.text}>
        {segments.map((segment, index) =>
          segment.annotation === null ? (
            <span key={index}>{segment.text}</span>
          ) : (
            <button
              key={index}
              type="button"
              data-mark={segment.mark}
              className={
                segment.annotation.severity === 'praise' ? styles.praise : styles.slip
              }
              aria-label={`${segment.text}: ${segment.annotation.message}`}
              aria-expanded={open === segment.mark}
              aria-controls={explanation}
              onClick={() => setOpen(open === segment.mark ? null : segment.mark)}
            >
              {segment.text}
            </button>
          ),
        )}
      </p>
      <p id={explanation} className={styles.explanation} aria-live="polite">
        {openMark?.annotation?.message ?? ''}
      </p>
    </section>
  )
}

export function Legend({ marks }: { marks: Mark[] }) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        As marcações
      </h2>
      <ol className={styles.legend}>
        {marks.map(({ number, annotation }) => (
          <li key={number} className={styles.legendItem}>
            <span
              className={
                annotation.severity === 'praise' ? styles.badgePraise : styles.badgeSlip
              }
              aria-hidden="true"
            >
              {number}
            </span>
            <p className={styles.legendText}>
              <strong className={styles.legendKind}>{`${ANNOTATION_LABEL[annotation.type]}.`}</strong>{' '}
              <span>{annotation.message}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

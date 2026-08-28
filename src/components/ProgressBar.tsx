import styles from './ProgressBar.module.css'

export type BarTone = 'caneta' | 'alert' | 'streak'

interface ProgressBarProps {
  /** 0 to 100. */
  percent: number
  label: string
  done?: boolean
  /** 0 to 100: where the pass floor sits, drawn as a tick on the track. */
  floor?: number
  tone?: BarTone
}

export function ProgressBar({
  percent,
  label,
  done = false,
  floor,
  tone = 'caneta',
}: ProgressBarProps) {
  const fill = [styles.fill, done ? styles.done : undefined, tone === 'caneta' ? undefined : styles[tone]]
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={fill.filter(Boolean).join(' ')} style={{ width: `${percent}%` }} />
      {floor === undefined ? null : (
        <div className={styles.floor} style={{ left: `${floor}%` }} />
      )}
    </div>
  )
}

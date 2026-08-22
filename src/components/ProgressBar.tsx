import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  /** 0 to 100. */
  percent: number
  label: string
  done?: boolean
}

export function ProgressBar({ percent, label, done = false }: ProgressBarProps) {
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={[styles.fill, done ? styles.done : undefined].filter(Boolean).join(' ')}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

import { Button } from './Button'
import styles from './StatusPanels.module.css'

/** Whole-screen states of anything that has to ask the API first. */
export function LoadingPanel() {
  return (
    <div className={styles.panel}>
      <p className={styles.text} role="status">
        Carregando…
      </p>
    </div>
  )
}

interface RetryPanelProps {
  message: string
  onRetry: () => void
}

export function RetryPanel({ message, onRetry }: RetryPanelProps) {
  return (
    <div className={styles.panel}>
      <p className={styles.text} role="alert">
        {message}
      </p>
      <Button variant="ghost" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  )
}

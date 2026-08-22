import { Button } from '../components/Button'
import styles from './StatusPanels.module.css'

/** Whole-screen states of the route guard: still asking the API, or unable to. */
export function LoadingPanel() {
  return (
    <div className={styles.panel}>
      <p className={styles.text} role="status">
        Carregando…
      </p>
    </div>
  )
}

export function UnavailablePanel({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.panel}>
      <p className={styles.text} role="alert">
        Não conseguimos falar com o Argumenta. Sua sessão continua de pé: verifique a internet e
        tente de novo.
      </p>
      <Button variant="ghost" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  )
}

import { RouteButton } from '../../components/Button'
import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.text}>
        Essa página não existe. Talvez o link esteja velho, ou a tela ainda esteja por vir.
      </p>
      <RouteButton to="/" variant="ghost" className={styles.cta}>
        Voltar para a trilha
      </RouteButton>
    </main>
  )
}

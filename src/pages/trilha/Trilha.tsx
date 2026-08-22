import { Chip } from '../../components/Chip'
import { Button } from '../../components/Button'
import { EXAM_LABEL } from '../../copy/labels'
import { useSession, useStudent } from '../../session/context'
import styles from './Trilha.module.css'

export function Trilha() {
  const { user, targets } = useStudent()
  const { signOut } = useSession()
  const active = targets.find((target) => target.is_active)

  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <h1 className={styles.title}>Sua trilha</h1>
        {active ? <Chip>{`Lente ${EXAM_LABEL[active.exam]}`}</Chip> : null}
      </header>
      <p className={styles.greeting}>Bom te ver, {user.nickname}.</p>
      <Button variant="ghost" onClick={() => void signOut()}>
        Sair da conta
      </Button>
    </main>
  )
}

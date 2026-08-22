import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button'
import { NicknameCard } from '../../profile/NicknameCard'
import { TargetsCard } from '../../profile/TargetsCard'
import { useStudent } from '../../session/context'
import styles from './Onboarding.module.css'

export function Onboarding() {
  const { targets } = useStudent()
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Quase lá</h1>
      <p className={styles.subtitle}>
        Duas coisas e a primeira história abre: como te chamar, e qual vestibular você vai prestar.
      </p>
      <NicknameCard />
      <TargetsCard />
      <Button disabled={targets.length === 0} onClick={() => navigate('/', { replace: true })}>
        Começar a treinar
      </Button>
    </main>
  )
}

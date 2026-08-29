import { DangerCard } from '../../profile/DangerCard'
import { NicknameCard } from '../../profile/NicknameCard'
import { TargetsCard } from '../../profile/TargetsCard'
import styles from './Conta.module.css'

/** Deliberately outside RequireTargets: this is where a student without a lens
 *  picks one, so it must not bounce them to the onboarding. */
export function Conta() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Sua conta</h1>
      <NicknameCard />
      <TargetsCard warnOnLastRemoval />
      <DangerCard />
    </main>
  )
}

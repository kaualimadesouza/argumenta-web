import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useApi } from '../api/context'
import { messageFor } from '../api/messages'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Notice } from '../components/Notice'
import { useSession } from '../session/context'
import styles from './profile.module.css'

/** The grace window is the API's setting; the privacy policy states the same 7
 *  days, so the number the student reads here is the one they can go check. */
const GRACE =
  'A conta fica inutilizável agora. Os seus textos e as suas notas são apagados 7 dias depois, e nesse prazo dá para desistir falando com o suporte.'

export function DangerCard() {
  const api = useApi()
  const { signOut, reload } = useSession()
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function erase() {
    setBusy(true)
    setError(null)
    try {
      await api.deleteAccount()
      // the API already dropped the cookies: reloading lands on anonymous
      await reload()
    } catch (failure) {
      setError(messageFor(failure))
      setBusy(false)
    }
  }

  return (
    <Card>
      <div className={styles.card}>
        <h2 className={styles.heading}>Sessão e conta</h2>
        <Button variant="ghost" onClick={() => void signOut()}>
          Sair da conta
        </Button>
        {error === null ? null : <Notice tone="error">{error}</Notice>}
        {asking ? (
          <div className={styles.confirm}>
            <Notice tone="warn">
              {GRACE} Veja a <Link to="/privacidade">política de privacidade</Link>.
            </Notice>
            <div className={styles.confirmRow}>
              <Button variant="danger" disabled={busy} onClick={() => void erase()}>
                {busy ? 'Excluindo…' : 'Excluir para sempre'}
              </Button>
              <Button variant="ghost" onClick={() => setAsking(false)}>
                Manter minha conta
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="quiet" onClick={() => setAsking(true)}>
            Excluir minha conta
          </Button>
        )}
      </div>
    </Card>
  )
}

import { type FormEvent, useState } from 'react'

import { useApi } from '../api/context'
import { messageFor } from '../api/messages'
import { Button } from '../components/Button'
import { Card, Kicker } from '../components/Card'
import { Field } from '../components/Field'
import { Notice } from '../components/Notice'
import { useSession, useStudent } from '../session/context'
import styles from './profile.module.css'

export function NicknameCard() {
  const api = useApi()
  const { reload } = useSession()
  const { user } = useStudent()
  const [nickname, setNickname] = useState(user.nickname)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function save(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setSaved(false)
    try {
      await api.updateNickname({ nickname })
      await reload()
      setSaved(true)
    } catch (failure) {
      setError(messageFor(failure))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <form className={styles.card} onSubmit={save}>
        <Kicker>Como quer ser chamado</Kicker>
        <div className={styles.row}>
          <Field
            label="Apelido"
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value)
              setSaved(false)
            }}
            autoComplete="nickname"
          />
          <Button
            type="submit"
            variant="ghost"
            className={styles.inline}
            disabled={busy || nickname.trim() === '' || nickname === user.nickname}
          >
            Salvar
          </Button>
        </div>
        {error ? <Notice tone="error">{error}</Notice> : null}
        {saved ? <Notice tone="ok">Apelido salvo.</Notice> : null}
      </form>
    </Card>
  )
}

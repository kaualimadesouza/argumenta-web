import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useApi } from '../../api/context'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Notice } from '../../components/Notice'
import { useSignIn } from '../../session/useSignIn'
import styles from './auth.module.css'

export function EntrarEmail() {
  const api = useApi()
  const { signIn, error, busy } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    void signIn(() => api.login({ email, password }))
  }

  return (
    <main className={styles.page}>
      <Link to="/entrar" className={styles.back}>
        ← Voltar
      </Link>
      <h1 className={styles.title}>Entrar</h1>
      <form className={styles.form} onSubmit={submit}>
        <Field
          label="E-mail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
        <Field
          label="Senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Button type="submit" disabled={email === '' || password === '' || busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </main>
  )
}

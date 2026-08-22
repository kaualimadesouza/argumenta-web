import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useApi } from '../../api/context'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Notice } from '../../components/Notice'
import { useSignIn } from '../../session/useSignIn'
import styles from './auth.module.css'

const MIN_PASSWORD = 8

export function CriarConta() {
  const api = useApi()
  const { signIn, error, busy } = useSignIn()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    void signIn(() =>
      api.register({ email, nickname, password, accepted_terms: accepted }),
    )
  }

  const ready = nickname.trim() !== '' && email !== '' && password.length >= MIN_PASSWORD && accepted

  return (
    <main className={styles.page}>
      <Link to="/entrar" className={styles.back}>
        ← Voltar
      </Link>
      <h1 className={styles.title}>Criar conta</h1>
      <p className={styles.subtitle}>
        Três campos e você já está dentro da primeira história.
      </p>
      <form className={styles.form} onSubmit={submit}>
        <Field
          label="Apelido"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          autoComplete="nickname"
          hint="É como o Argumenta vai te chamar."
        />
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
          autoComplete="new-password"
          hint="Pelo menos 8 caracteres."
        />
        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>
            Li e aceito os <Link to="/termos">termos de uso</Link> e a{' '}
            <Link to="/privacidade">política de privacidade</Link>. Se você tem menos de 18 anos,
            mostre as duas páginas para quem responde por você.
          </span>
        </label>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Button type="submit" disabled={!ready || busy}>
          {busy ? 'Criando…' : 'Criar conta'}
        </Button>
      </form>
    </main>
  )
}

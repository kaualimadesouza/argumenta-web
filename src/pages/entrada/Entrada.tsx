import { useMemo } from 'react'

import { googleAuthorizeUrl, googleClientId, rememberState } from '../../auth/google'
import { Button, LinkButton, RouteButton } from '../../components/Button'
import { GoogleMark } from '../../components/art/GoogleMark'
import { PenMark } from '../../components/art/PenMark'
import { Wordmark } from '../../components/art/Wordmark'
import styles from './Entrada.module.css'

function GoogleAction() {
  const clientId = googleClientId()
  const state = useMemo(() => crypto.randomUUID(), [])

  if (clientId === '') {
    return (
      <>
        <Button disabled>
          <GoogleMark /> Entrar com Google
        </Button>
        <p className={styles.note}>
          O login com Google ainda não está configurado neste ambiente. Use e-mail por enquanto.
        </p>
      </>
    )
  }
  return (
    <LinkButton
      href={googleAuthorizeUrl(clientId, state)}
      onClick={() => rememberState(state)}
    >
      <GoogleMark /> Entrar com Google
    </LinkButton>
  )
}

export function Entrada() {
  return (
    <main className={styles.page}>
      <section className={styles.brand}>
        <PenMark />
        <Wordmark as="h1" className={styles.wordmark} />
        <p className={styles.tagline}>
          Vença a discussão dentro da história. Passe no vestibular fora dela.
        </p>
      </section>
      <section className={styles.actions}>
        <GoogleAction />
        <RouteButton to="/criar-conta" variant="ghost">
          Criar conta com e-mail
        </RouteButton>
        <p className={styles.note}>
          Só pedimos e-mail, apelido e o ano do seu vestibular. Nada mais.
        </p>
        <RouteButton to="/entrar/email" variant="quiet" className={styles.quiet}>
          Já tenho conta
        </RouteButton>
      </section>
    </main>
  )
}

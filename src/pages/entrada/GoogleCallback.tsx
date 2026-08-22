import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useApi } from '../../api/context'
import { googleRedirectUri, takeState } from '../../auth/google'
import { RouteButton } from '../../components/Button'
import { Notice } from '../../components/Notice'
import { useSignIn } from '../../session/useSignIn'
import styles from './auth.module.css'

const FORGED =
  'Não conseguimos confirmar que esse login começou aqui. Volte e entre de novo pelo botão do Google.'

export function GoogleCallback() {
  const api = useApi()
  const { signIn, error } = useSignIn()
  const [params] = useSearchParams()
  const [forged, setForged] = useState(false)
  const exchanged = useRef(false)

  useEffect(() => {
    if (exchanged.current) return
    exchanged.current = true
    const expected = takeState()
    if (expected === null || params.get('state') !== expected) {
      setForged(true)
      return
    }
    void signIn(() =>
      api.loginWithGoogle({
        code: params.get('code') ?? '',
        redirect_uri: googleRedirectUri(),
      }),
    )
  }, [api, params, signIn])

  const problem = forged ? FORGED : error
  return (
    <main className={[styles.page, styles.centered].join(' ')}>
      {problem === null || problem === undefined ? (
        <p className={styles.subtitle} role="status">
          Entrando com o Google…
        </p>
      ) : (
        <>
          <Notice tone="error">{problem}</Notice>
          <RouteButton to="/entrar" variant="ghost">
            Voltar para a Entrada
          </RouteButton>
        </>
      )}
    </main>
  )
}

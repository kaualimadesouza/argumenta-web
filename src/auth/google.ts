const AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const STATE_KEY = 'argumenta.google.state'

export const GOOGLE_CALLBACK_PATH = '/entrar/google'

export function googleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''
}

export function googleRedirectUri(): string {
  return `${window.location.origin}${GOOGLE_CALLBACK_PATH}`
}

export function googleAuthorizeUrl(clientId: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email',
    state,
    prompt: 'select_account',
  })
  return `${AUTHORIZE_URL}?${params}`
}

/** The state is single use: read it and burn it, so a replayed callback URL
 *  cannot sign anybody in twice. */
export function rememberState(state: string): void {
  sessionStorage.setItem(STATE_KEY, state)
}

export function takeState(): string | null {
  const state = sessionStorage.getItem(STATE_KEY)
  sessionStorage.removeItem(STATE_KEY)
  return state
}

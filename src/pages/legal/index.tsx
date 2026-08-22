import { LegalPage } from './LegalPage'
import { PRIVACY_POLICY } from './privacy'
import { TERMS_OF_USE } from './terms'

export function Privacidade() {
  return (
    <LegalPage
      content={PRIVACY_POLICY}
      related={{ label: 'Termos de uso', to: '/termos' }}
    />
  )
}

export function Termos() {
  return (
    <LegalPage
      content={TERMS_OF_USE}
      related={{ label: 'Política de privacidade', to: '/privacidade' }}
    />
  )
}

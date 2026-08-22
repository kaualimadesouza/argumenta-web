import { Navigate, Route, Routes } from 'react-router-dom'

import { CriarConta } from './pages/entrada/CriarConta'
import { Entrada } from './pages/entrada/Entrada'
import { EntrarEmail } from './pages/entrada/EntrarEmail'
import { GoogleCallback } from './pages/entrada/GoogleCallback'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Trilha } from './pages/trilha/Trilha'
import { Privacidade, Termos } from './pages/legal'
import { RequireSession, RequireTargets } from './session/RouteGuards'

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Entrada />} />
      <Route path="/entrar/email" element={<EntrarEmail />} />
      <Route path="/entrar/google" element={<GoogleCallback />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<Termos />} />
      <Route element={<RequireSession />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<RequireTargets />}>
          <Route index element={<Navigate to="/trilha" replace />} />
          <Route path="/trilha" element={<Trilha />} />
        </Route>
      </Route>
    </Routes>
  )
}

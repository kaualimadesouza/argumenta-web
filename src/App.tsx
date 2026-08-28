import { Navigate, Route, Routes } from 'react-router-dom'

import { Cena } from './pages/cena/Cena'
import { Consequencia } from './pages/consequencia/Consequencia'
import { Correcao } from './pages/correcao/Correcao'
import { Editor } from './pages/editor/Editor'
import { CriarConta } from './pages/entrada/CriarConta'
import { Entrada } from './pages/entrada/Entrada'
import { EntrarEmail } from './pages/entrada/EntrarEmail'
import { GoogleCallback } from './pages/entrada/GoogleCallback'
import { NotFound } from './pages/notfound/NotFound'
import { Onboarding } from './pages/onboarding/Onboarding'
import { Progresso } from './pages/progresso/Progresso'
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
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/capitulos/:chapterId" element={<Cena />} />
          <Route path="/capitulos/:chapterId/escrever" element={<Editor />} />
          <Route path="/capitulos/:chapterId/correcao" element={<Correcao />} />
          <Route path="/capitulos/:chapterId/consequencia" element={<Consequencia />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

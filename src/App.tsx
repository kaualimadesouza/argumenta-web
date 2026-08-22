import { Route, Routes } from 'react-router-dom'

import { Home } from './pages/Home'
import { Privacidade, Termos } from './pages/legal'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<Termos />} />
    </Routes>
  )
}

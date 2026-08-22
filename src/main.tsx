import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { createHttpApi } from './api/client'
import { AppProviders } from './app/AppProviders'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders api={createHttpApi()}>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)

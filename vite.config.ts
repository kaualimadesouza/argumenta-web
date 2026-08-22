/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const API_TARGET = 'http://localhost:8000'

/** The API must answer under the app's own origin: it scopes the refresh cookie
 *  to /auth, so a cross-origin API silently loses session renewal. Dev proxies
 *  these prefixes; nginx does the same in production (argumenta-web #2).
 *  Regex keys, not plain prefixes: '/me' as a prefix would also swallow '/menu'. */
const API_ROUTES = [
  '^/auth/',
  '^/me(/|$)',
  '^/track$',
  '^/chapters/',
  '^/progress$',
  '^/telemetry/',
  '^/health$',
]

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(API_ROUTES.map((route) => [route, { target: API_TARGET }])),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
})

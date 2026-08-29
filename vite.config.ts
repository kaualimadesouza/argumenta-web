/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { API_ROUTES, viteProxyPatterns } from './scripts/api-routes'

const API_TARGET = 'http://localhost:8000'

/** The API must answer under the app's own origin: it scopes the refresh cookie
 *  to /auth, so a cross-origin API silently loses session renewal. Dev proxies
 *  these prefixes; Vercel rewrites do the same in production (argumenta-web #30),
 *  both generated from scripts/api-routes.ts. */

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: Object.fromEntries(
      viteProxyPatterns(API_ROUTES).map((route) => [route, { target: API_TARGET }]),
    ),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
})

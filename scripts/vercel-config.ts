/** Generates vercel.json at deploy time: same-origin proxy rewrites for the
 *  API (the nginx role in the retired web#2 design) plus the SPA fallback.
 *  Run via `npm run vercel:config` with API_ORIGIN set. */

import { writeFileSync } from 'node:fs'
import { argv, env, exit } from 'node:process'
import { pathToFileURL } from 'node:url'

import { API_ROUTES, type ApiRoute } from './api-routes'

export interface VercelRewrite {
  source: string
  destination: string
}

export interface VercelGitConfig {
  deploymentEnabled: boolean
}

export interface VercelConfig {
  $schema: string
  git: VercelGitConfig
  rewrites: VercelRewrite[]
}

/** path-to-regexp sources, never `:path*`: on its bare match (empty path)
 *  Vercel answers 307 to the external destination instead of proxying, which
 *  breaks same-origin calls (verified live on /me and /health, issue #32).
 *  `prefix` therefore splits into an exact rewrite plus a `:path+` one. */
function proxyRewrites(route: ApiRoute, origin: string): VercelRewrite[] {
  const exact = { source: `/${route.segment}`, destination: `${origin}/${route.segment}` }
  const children = {
    source: `/${route.segment}/:path+`,
    destination: `${origin}/${route.segment}/:path+`,
  }
  switch (route.match) {
    case 'exact':
      return [exact]
    case 'prefix':
      return [exact, children]
    case 'children':
      return [children]
  }
}

export function vercelConfig(apiOrigin: string): VercelConfig {
  const origin = apiOrigin.replace(/\/+$/, '')
  if (origin === '') throw new Error('API_ORIGIN must be a non-empty URL')
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    git: { deploymentEnabled: false },
    rewrites: [
      ...API_ROUTES.flatMap((route) => proxyRewrites(route, origin)),
      { source: '/(.*)', destination: '/index.html' },
    ],
  }
}

if (import.meta.url === pathToFileURL(argv[1] ?? '').href) {
  const apiOrigin = env.API_ORIGIN
  if (!apiOrigin) {
    console.error('API_ORIGIN is not set; refusing to write vercel.json')
    exit(1)
  }
  writeFileSync('vercel.json', `${JSON.stringify(vercelConfig(apiOrigin), null, 2)}\n`)
  console.log(`vercel.json written for ${apiOrigin}`)
}

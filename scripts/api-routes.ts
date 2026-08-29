/** Single source of truth for the API routes the app calls same-origin.
 *  Consumed by the Vite dev proxy and by the Vercel rewrite generator, so the
 *  two proxies cannot drift (the refresh cookie is Path=/auth, SameSite=Lax). */

export type ApiRouteMatch = 'exact' | 'prefix' | 'children'

export interface ApiRoute {
  segment: string
  match: ApiRouteMatch
}

export const API_ROUTES: readonly ApiRoute[] = [
  { segment: 'auth', match: 'children' },
  { segment: 'me', match: 'prefix' },
  { segment: 'track', match: 'exact' },
  { segment: 'chapters', match: 'children' },
  { segment: 'submissions', match: 'children' },
  { segment: 'progress', match: 'exact' },
  { segment: 'telemetry', match: 'children' },
  { segment: 'health', match: 'prefix' },
]

/** Regex keys, not plain prefixes: '/me' as a prefix would also swallow '/menu'. */
export function viteProxyPatterns(routes: readonly ApiRoute[]): string[] {
  return routes.map((route) => {
    switch (route.match) {
      case 'exact':
        return `^/${route.segment}$`
      case 'prefix':
        return `^/${route.segment}(/|$)`
      case 'children':
        return `^/${route.segment}/`
    }
  })
}

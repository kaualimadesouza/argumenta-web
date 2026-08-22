import { useLocation } from 'react-router-dom'

/** Records where the router is, so a test can assert a navigation without the
 *  destination screen existing yet. */
export function LocationProbe({ into }: { into: { path: string } }) {
  into.path = useLocation().pathname
  return null
}

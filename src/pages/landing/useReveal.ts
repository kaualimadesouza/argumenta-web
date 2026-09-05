import { type RefObject, useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Reveal<T extends HTMLElement> {
  ref: RefObject<T | null>
  revealed: boolean
}

/** True once the element has scrolled into view, and immediately where there is
 *  no observer or the reader asked for less motion: nothing may stay hidden. */
export function useReveal<T extends HTMLElement>(): Reveal<T> {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === 'undefined' || prefersReducedMotion(),
  )

  useEffect(() => {
    const element = ref.current
    if (revealed || element === null) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed])

  return { ref, revealed }
}

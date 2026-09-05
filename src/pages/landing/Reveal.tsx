import type { ReactNode } from 'react'

import styles from './Reveal.module.css'
import { useReveal } from './useReveal'

/** A block that rises into place the first time it scrolls into view. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>()
  const classes = [styles.reveal, revealed ? styles.revealed : undefined, className]
  return (
    <div ref={ref} className={classes.filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'

import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  active?: boolean
  className?: string
}

export function Card({ children, active = false, className }: CardProps) {
  return (
    <div className={[styles.card, active ? styles.active : undefined, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

/** The mono uppercase label above a card's content, all over the mockups. */
export function Kicker({ children }: { children: ReactNode }) {
  return <span className={styles.kicker}>{children}</span>
}

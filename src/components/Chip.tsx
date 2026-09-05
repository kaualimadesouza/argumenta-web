import type { ReactNode } from 'react'

import styles from './Chip.module.css'

export type ChipTone = 'caneta' | 'ok' | 'warn' | 'streak' | 'neutral'

export function Chip({ tone = 'caneta', children }: { tone?: ChipTone; children: ReactNode }) {
  const toneClass = tone === 'caneta' ? undefined : styles[tone]
  return <span className={[styles.chip, toneClass].filter(Boolean).join(' ')}>{children}</span>
}

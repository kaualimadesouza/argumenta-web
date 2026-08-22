import type { ReactNode } from 'react'

import styles from './Notice.module.css'

export type NoticeTone = 'error' | 'ok'

/** Inline result of an action: an error announces itself, a success reports. */
export function Notice({ tone, children }: { tone: NoticeTone; children: ReactNode }) {
  return (
    <p
      className={[styles.notice, styles[tone]].join(' ')}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}

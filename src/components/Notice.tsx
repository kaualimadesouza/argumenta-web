import type { ReactNode } from 'react'

import styles from './Notice.module.css'

export type NoticeTone = 'error' | 'ok' | 'warn'

/** Inline result of an action: an error announces itself, a success reports, and
 *  a warning announces itself too, because it is asking before something breaks. */
export function Notice({ tone, children }: { tone: NoticeTone; children: ReactNode }) {
  return (
    <p
      className={[styles.notice, styles[tone]].join(' ')}
      role={tone === 'ok' ? 'status' : 'alert'}
    >
      {children}
    </p>
  )
}

import type { ReactElement } from 'react'

import styles from './CharacterPortrait.module.css'

/** Drawn portraits, by the asset name the content gives them. Nothing in the
 *  seed names one yet, so today every character falls back to their initial. */
const PORTRAITS: Record<string, ReactElement> = {
  'tio-marcos': (
    <svg viewBox="0 0 64 64" role="presentation">
      <rect width="64" height="64" fill="var(--color-caneta-soft)" />
      <circle cx="32" cy="27" r="13" fill="#D9A47E" />
      <path d="M19 25 a13 13 0 0 1 26 0 l-5 -5 h-16 z" fill="#2A2118" />
      <path d="M12 60 a20 17 0 0 1 40 0 z" fill="var(--color-caneta)" />
      <circle cx="27" cy="27" r="1.7" fill="var(--color-ink)" />
      <circle cx="37" cy="27" r="1.7" fill="var(--color-ink)" />
      <path
        d="M27 36 q5 3 10 0"
        fill="none"
        stroke="#2A2118"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  ),
}

interface CharacterPortraitProps {
  name: string
  asset: string | null
  small?: boolean
}

export function CharacterPortrait({ name, asset, small = false }: CharacterPortraitProps) {
  const drawn = asset === null ? undefined : PORTRAITS[asset]
  return (
    <div
      className={[styles.portrait, small ? styles.small : undefined].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {drawn ?? <span className={styles.initial}>{name.slice(0, 1).toUpperCase()}</span>}
    </div>
  )
}

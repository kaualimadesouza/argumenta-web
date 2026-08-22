import type { ReactElement } from 'react'

import styles from './StoryCover.module.css'

/** Art direction of the mockups, keyed by the content's asset name and falling
 *  back to the story slug: the seeded stories carry no cover_asset yet. */
const COVERS: Record<string, ReactElement> = {
  'o-gremio': (
    <svg viewBox="0 0 74 74" role="img" aria-label="capa: megafone do grêmio">
      <rect width="74" height="74" fill="var(--color-caneta-soft)" />
      <path d="M14 30 h9 l20 -13 v40 l-20 -13 h-9 z" fill="var(--color-caneta)" />
      <rect x="17" y="44" width="7" height="12" rx="2.5" fill="var(--color-ink)" />
      <path
        d="M50 28 q9 9 0 18"
        fill="none"
        stroke="var(--color-marca-texto)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M57 22 q15 15 0 30"
        fill="none"
        stroke="var(--color-marca-texto)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  ),
  'cuidado-invisivel': (
    <svg viewBox="0 0 74 74" role="img" aria-label="capa: a poltrona da vó com a manta">
      <rect width="74" height="74" fill="var(--color-noite)" />
      <rect x="16" y="18" width="34" height="30" rx="9" fill="var(--color-ink)" />
      <rect x="10" y="34" width="12" height="22" rx="5" fill="var(--color-ink)" />
      <rect x="44" y="34" width="12" height="22" rx="5" fill="var(--color-ink)" />
      <rect x="16" y="48" width="40" height="9" rx="4" fill="#141B24" />
      <path d="M20 32 h22 l-4 16 h-18 z" fill="var(--color-marca-texto)" />
      <circle cx="62" cy="26" r="5" fill="var(--color-paper)" />
    </svg>
  ),
  'sinal-fechado': (
    <svg viewBox="0 0 74 74" role="img" aria-label="capa: semáforo no vermelho">
      <rect width="74" height="74" fill="var(--color-track)" />
      <rect x="34" y="46" width="6" height="22" fill="var(--color-muted)" />
      <rect x="24" y="8" width="26" height="42" rx="8" fill="var(--color-ink)" />
      <circle cx="37" cy="19" r="6" fill="var(--color-corretor)" />
      <circle cx="37" cy="33" r="6" fill="#3A4552" />
      <circle cx="37" cy="44" r="4.5" fill="#3A4552" />
    </svg>
  ),
}

const FALLBACK = (
  <svg viewBox="0 0 74 74" role="img" aria-label="capa da história">
    <rect width="74" height="74" fill="var(--color-caneta-soft)" />
    <rect x="18" y="16" width="38" height="42" rx="4" fill="var(--color-card)" />
    <rect x="24" y="26" width="26" height="3.5" rx="1.75" fill="var(--color-muted)" />
    <rect x="24" y="35" width="22" height="3.5" rx="1.75" fill="var(--color-muted)" />
    <rect x="24" y="44" width="18" height="3.5" rx="1.75" fill="var(--color-caneta)" />
  </svg>
)

interface StoryCoverProps {
  slug: string
  asset: string | null
}

export function StoryCover({ slug, asset }: StoryCoverProps) {
  return <div className={styles.cover}>{COVERS[asset ?? slug] ?? FALLBACK}</div>
}

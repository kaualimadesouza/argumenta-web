import type { ReactElement } from 'react'

import styles from './ScenePanel.module.css'

/** The illustrated panel of the visual novel, by the asset name the beat gives.
 *  An unknown asset gets the neutral night room instead of a hole in the page. */
const PANELS: Record<string, ReactElement> = {
  'cozinha-a-noite': (
    <svg viewBox="0 0 390 210" role="img" aria-label="cozinha à noite, a pia ainda cheia">
      <rect width="390" height="210" fill="var(--color-noite)" />
      <rect x="28" y="24" width="118" height="86" rx="8" fill="#2E3D52" />
      <circle cx="116" cy="50" r="13" fill="var(--color-paper)" />
      <circle cx="58" cy="42" r="2" fill="var(--color-paper)" opacity="0.7" />
      <circle cx="84" cy="68" r="1.6" fill="var(--color-paper)" opacity="0.5" />
      <rect x="266" y="0" width="3" height="36" fill="#141B24" />
      <path d="M248 36 h39 l8 18 h-55 z" fill="var(--color-marca-texto)" />
      <path d="M242 54 h51 l34 156 h-119 z" fill="var(--color-marca-texto)" opacity="0.12" />
      <rect x="0" y="146" width="390" height="64" fill="#1A222E" />
      <rect x="186" y="138" width="150" height="10" rx="4" fill="#2E3D52" />
      <ellipse cx="332" cy="134" rx="24" ry="5" fill="#8FA3B8" />
      <ellipse cx="332" cy="127" rx="20" ry="5" fill="#77899D" />
      <circle cx="252" cy="84" r="14" fill="#10151C" />
      <path
        d="M252 98 c-16 0 -23 14 -23 32 v16 h46 v-16 c0 -18 -7 -32 -23 -32 z"
        fill="#10151C"
      />
    </svg>
  ),
}

const FALLBACK = (
  <svg viewBox="0 0 390 210" role="img" aria-label="ilustração da cena">
    <rect width="390" height="210" fill="var(--color-noite)" />
    <rect x="0" y="150" width="390" height="60" fill="#1A222E" />
    <rect x="40" y="34" width="120" height="88" rx="8" fill="#2E3D52" />
    <circle cx="130" cy="62" r="12" fill="var(--color-paper)" opacity="0.85" />
    <path d="M250 40 h40 l9 20 h-58 z" fill="var(--color-marca-texto)" opacity="0.85" />
    <path d="M244 60 h52 l30 90 h-112 z" fill="var(--color-marca-texto)" opacity="0.1" />
  </svg>
)

export function ScenePanel({ asset }: { asset: string }) {
  return <div className={styles.panel}>{PANELS[asset] ?? FALLBACK}</div>
}

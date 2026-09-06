import type { CSSProperties, ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import styles from './Nav.module.css'

interface Tab {
  to: string
  label: string
  icon: ReactNode
}

/** Stroke-based, one 24-grid, drawn here so they scale and recolour with the
 *  active state instead of shipping three image files. */
const TABS: Tab[] = [
  {
    to: '/trilha',
    label: 'Trilha',
    icon: (
      <path
        d="M6 20.5V4.5m0 .8h10.2l-1.6 3.4 1.6 3.4H6"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    to: '/progresso',
    label: 'Progresso',
    icon: (
      <>
        <path d="M4 16.4 9.2 10l4 3.6L20 5.4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h16" strokeWidth="1.75" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: '/conta',
    label: 'Conta',
    icon: (
      <>
        <circle cx="12" cy="8.4" r="3.5" strokeWidth="1.75" />
        <path d="M5.4 19.4c1.1-3.3 3.5-5 6.6-5s5.5 1.7 6.6 5" strokeWidth="1.75" strokeLinecap="round" />
      </>
    ),
  },
]

export function Nav() {
  const { pathname } = useLocation()
  // the step slides to the live tab, so the two indices ride on the element
  // instead of on a class: CSS can move a single mark, not swap one for another
  const live = TABS.findIndex((tab) => pathname.startsWith(tab.to))
  const rail = { '--live': String(Math.max(live, 0)), '--tabs': String(TABS.length) }

  return (
    <nav
      className={styles.nav}
      aria-label="Navegação principal"
      style={rail as CSSProperties}
    >
      <span className={styles.wordmark} aria-hidden="true">
        argumenta
      </span>
      <div className={styles.rail}>
        {live >= 0 ? <span className={styles.step} aria-hidden="true" /> : null}
        <ul className={styles.tabs}>
          {TABS.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  [styles.tab, isActive ? styles.active : undefined].filter(Boolean).join(' ')
                }
              >
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {tab.icon}
                </svg>
                <span className={styles.label}>{tab.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

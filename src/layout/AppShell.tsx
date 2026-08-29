import { Outlet } from 'react-router-dom'

import { Nav } from './Nav'
import styles from './AppShell.module.css'

/** The chrome the home screens share. The writing flow (scene, editor,
 *  correction, consequence) stays outside it on purpose: writing is focused
 *  mode, and that is already true on the phone, where those screens have no
 *  tab bar either. */
export function AppShell() {
  return (
    <div className={styles.shell}>
      <Nav />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

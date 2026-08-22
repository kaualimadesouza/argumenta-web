import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type { ChapterStatus } from '../../api/types'
import { useResource } from '../../api/useResource'
import { RouteButton } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { Beat } from './Beat'
import styles from './Cena.module.css'

/** Statuses that are waiting for text; the rest are watching, not writing. */
const WRITABLE: ChapterStatus[] = ['available', 'drafting', 'in_recovery']

export function Cena() {
  const api = useApi()
  const { chapterId = '' } = useParams()
  const { state, reload } = useResource(useCallback(() => api.chapter(chapterId), [api, chapterId]))

  return (
    <Loaded resource={state} onRetry={reload}>
      {(chapter) => (
        <main className={styles.page}>
          <h1 className="sr-only">{chapter.title}</h1>
          <header className={styles.bar}>
            <Link to="/trilha" className={styles.back}>
              ← Trilha
            </Link>
            <Chip>{`Cap. ${chapter.position}`}</Chip>
          </header>
          {chapter.beats.map((beat, index) => (
            <Beat key={index} beat={beat} />
          ))}
          {chapter.status === 'passed' ? (
            <p className={styles.done}>Você já venceu este capítulo.</p>
          ) : null}
          {WRITABLE.includes(chapter.status) ? (
            <RouteButton to={`/capitulos/${chapter.id}/escrever`} className={styles.cta}>
              Argumentar
            </RouteButton>
          ) : null}
        </main>
      )}
    </Loaded>
  )
}

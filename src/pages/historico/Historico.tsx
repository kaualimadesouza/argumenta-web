import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type { Verdict } from '../../api/types'
import { useResource } from '../../api/useResource'
import styles from './Historico.module.css'

function formatVerdict(verdict: Verdict): string {
  if (verdict === 'approved') return 'Aprovado'
  if (verdict === 'failed_technical') return 'Desvios de escrita'
  return 'Falha de persuasão'
}

export function Historico() {
  const api = useApi()
  const { chapterId = '' } = useParams()
  const load = useCallback(() => api.chapterSubmissions(chapterId), [api, chapterId])
  const { state, reload } = useResource(load)

  return (
    <Loaded resource={state} onRetry={reload}>
      {(submissions) => {
        // Ordena pela mais recente primeiro
        const sorted = [...submissions].sort((a, b) => b.attempt_number - a.attempt_number)
        
        return (
          <main className={styles.page}>
            <header className={styles.bar}>
              <Link to={`/capitulos/${chapterId}`} className={styles.back}>
                ← Voltar
              </Link>
            </header>

            <h1 className={styles.title}>Tentativas anteriores</h1>

            <div className={styles.list}>
              {sorted.map((sub) => (
                <article key={sub.submission_id} className={styles.card}>
                  <header className={styles.header}>
                    <div>
                      <div className={styles.attempt}>Tentativa {sub.attempt_number}</div>
                      <div className={styles.verdict}>{formatVerdict(sub.verdict)}</div>
                    </div>
                    <div className={styles.score}>
                      {sub.average_score}/{sub.lens.total_max ?? 100}
                    </div>
                  </header>
                  <div className={styles.body}>{sub.body}</div>
                </article>
              ))}
            </div>
          </main>
        )
      }}
    </Loaded>
  )
}

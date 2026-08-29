import { useCallback, useId, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import { messageFor } from '../../api/messages'
import type { ChapterResponse, ScoreResponse, SubmissionResponse } from '../../api/types'
import { useResource } from '../../api/useResource'
import { Button } from '../../components/Button'
import { Chip } from '../../components/Chip'
import { Notice } from '../../components/Notice'
import { ProgressBar } from '../../components/ProgressBar'
import { Beat } from '../cena/Beat'
import styles from './Consequencia.module.css'

/** Optional: the correction screen hands the judged submission over so the
 *  student sees what stopped the argument. A cold load just plays the scene. */
interface ConsequenciaHandoff {
  submission: SubmissionResponse
}

function submissionOf(state: unknown): SubmissionResponse | null {
  if (state === null || typeof state !== 'object') return null
  const candidate = state as Partial<ConsequenciaHandoff>
  return typeof candidate.submission?.verdict === 'string' ? candidate.submission : null
}

export function Consequencia() {
  const api = useApi()
  const { chapterId = '' } = useParams()
  const { state } = useLocation()
  const submission = submissionOf(state)
  const { state: resource, reload } = useResource(
    useCallback(() => api.chapter(chapterId), [api, chapterId]),
  )

  return (
    <Loaded resource={resource} onRetry={reload}>
      {(chapter) =>
        chapter.status === 'in_consequence' ? (
          <Scene chapter={chapter} submission={submission} />
        ) : (
          // the consequence is over (or never happened): the scene is the truth
          <Navigate to={`/capitulos/${chapter.id}`} replace />
        )
      }
    </Loaded>
  )
}

function Scene({
  chapter,
  submission,
}: {
  chapter: ChapterResponse
  submission: SubmissionResponse | null
}) {
  const persuasion = submission?.scores.find((score) => score.dimension === 'persuasao') ?? null

  return (
    <main className={styles.page}>
      <h1 className="sr-only">{chapter.title}</h1>
      <header className={styles.bar}>
        <Link to="/trilha" className={styles.back}>
          ← Trilha
        </Link>
        <Chip tone="warn">Não convenceu</Chip>
      </header>

      {chapter.beats.map((beat, index) => (
        <Beat key={index} beat={beat} />
      ))}

      {persuasion === null || submission === null ? null : (
        <Stalled score={persuasion} floor={submission.floor_value} />
      )}

      <Recovery chapter={chapter} />
    </main>
  )
}

function Stalled({ score, floor }: { score: ScoreResponse; floor: number }) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Onde o argumento parou
      </h2>
      <div className={styles.row}>
        <div className={styles.rowHead}>
          <span className={styles.label}>Persuasão</span>
          <span className={styles.score}>{`${score.score}/100`}</span>
        </div>
        <ProgressBar percent={score.score} floor={floor} tone="streak" label="Persuasão" />
      </div>
      <p className={styles.evidence}>{score.evidence}</p>
    </section>
  )
}

function Recovery({ chapter }: { chapter: ChapterResponse }) {
  const api = useApi()
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  async function start() {
    setStarting(true)
    setFailure(null)
    try {
      await api.startRecovery(chapter.id)
      // `starting` stays set: the screen is leaving, so there is nothing to reset
      navigate(`/capitulos/${chapter.id}`)
    } catch (error) {
      setFailure(messageFor(error))
      setStarting(false)
    }
  }

  return (
    <>
      {failure === null ? null : <Notice tone="error">{failure}</Notice>}
      <Button className={styles.cta} onClick={() => void start()} disabled={starting}>
        {starting ? 'Abrindo…' : `Encarar ${chapter.antagonist_name} de novo`}
      </Button>
    </>
  )
}

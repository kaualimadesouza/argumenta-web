import { useCallback, useId } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type {
  AnnotationResponse,
  ChapterResponse,
  ReactionResponse,
  SubmissionResponse,
  Verdict,
} from '../../api/types'
import { useResource } from '../../api/useResource'
import { RouteButton } from '../../components/Button'
import { Reaction } from '../../components/Reaction'
import styles from './Correcao.module.css'
import { Legend, MarkedText } from './MarkedText'
import { Scoreboard } from './Scoreboard'
import { annotate } from './spans'

/** What the editor hands over: the judged submission and the exact text that was
 *  judged, because the annotation offsets belong to that text and no other. */
export interface CorrecaoHandoff {
  submission: SubmissionResponse
  body: string
}

function isHandoff(state: unknown): state is CorrecaoHandoff {
  if (state === null || typeof state !== 'object') return false
  const candidate = state as Partial<CorrecaoHandoff>
  return typeof candidate.body === 'string' && typeof candidate.submission?.verdict === 'string'
}

interface Judged {
  chapter: ChapterResponse
  /** null when the verdict earns corrections instead of drama, or when the
   *  character line failed on its own: the correction is still the point. */
  reaction: ReactionResponse | null
}

export function Correcao() {
  const { chapterId = '' } = useParams()
  const { state } = useLocation()

  if (!isHandoff(state)) return <Navigate to={`/capitulos/${chapterId}`} replace />
  return <Loading chapterId={chapterId} handoff={state} />
}

function Loading({ chapterId, handoff }: { chapterId: string; handoff: CorrecaoHandoff }) {
  const api = useApi()
  const { submission } = handoff
  const load = useCallback(async (): Promise<Judged> => {
    const line =
      submission.verdict === 'failed_technical'
        ? null
        : await api.reaction(submission.submission_id).catch(() => null)
    return { chapter: await api.chapter(chapterId), reaction: line }
  }, [api, chapterId, submission])
  const { state, reload } = useResource(load)

  return (
    <Loaded resource={state} onRetry={reload}>
      {(judged) => <Sheet handoff={handoff} judged={judged} />}
    </Loaded>
  )
}

interface Headline {
  title: string
  line: string
  tone: 'ok' | 'alert' | 'warn'
}

function errorCount(annotations: AnnotationResponse[]): number {
  return annotations.filter((annotation) => annotation.severity === 'error').length
}

function headlineFor(submission: SubmissionResponse, antagonist: string): Headline {
  if (submission.verdict === 'approved') {
    return {
      title: 'Você convenceu.',
      line: `${antagonist} aceitou o seu argumento. Este capítulo está vencido.`,
      tone: 'ok',
    }
  }
  if (submission.verdict === 'failed_persuasion') {
    return {
      title: 'Ele ainda não se move.',
      line: `Você sustentou a sua tese, mas ela não respondeu ao que ${antagonist} mede. Veja o que aconteceu e prepare a próxima tentativa.`,
      tone: 'warn',
    }
  }
  const errors = errorCount(submission.annotations)
  const many = errors !== 1
  return {
    title: 'Quase. A norma culta segurou você.',
    line: `O argumento convence ${antagonist}, mas ${errors} ${many ? 'desvios' : 'desvio'} de escrita ${many ? 'derrubaram' : 'derrubou'} a nota abaixo do piso. Corrija e reenvie: a história continua esperando.`,
    tone: 'alert',
  }
}

function Sheet({ handoff, judged }: { handoff: CorrecaoHandoff; judged: Judged }) {
  const { submission, body } = handoff
  const { chapter, reaction } = judged
  const headline = headlineFor(submission, chapter.antagonist_name)
  const { segments, marks } = annotate(body, submission.annotations)

  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <span className={styles.chapter}>{chapter.title}</span>
        <span className={styles.attempt}>{`Tentativa ${submission.attempt_number}`}</span>
      </header>

      <div className={[styles.headline, styles[headline.tone]].join(' ')}>
        <h1 className={styles.headlineTitle}>{headline.title}</h1>
        <p className={styles.headlineLine}>{headline.line}</p>
      </div>

      {reaction === null ? null : <Reaction reaction={reaction} />}

      {/* two wrappers that are `display: contents` until the desktop grid needs
          them, so the phone keeps the order it has: placar, then the text, then
          the legend that explains the marks in it */}
      <div className={styles.side}>
        <Scoreboard lens={submission.lens} floor={submission.floor_value} />
      </div>

      <div className={styles.main}>
        <MarkedText segments={segments} />

          {marks.length === 0 ? null : <Legend marks={marks} />}

        {submission.para_passar.length === 0 ? null : (
          <ParaPassar priorities={submission.para_passar} />
        )}

        <Actions verdict={submission.verdict} chapterId={chapter.id} />
      </div>
    </main>
  )
}

function ParaPassar({ priorities }: { priorities: AnnotationResponse[] }) {
  const heading = useId()
  const ordered = [...priorities].sort((a, b) => a.priority - b.priority)
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Para passar
      </h2>
      <ul className={styles.steps}>
        {ordered.map((priority, index) => (
          <li key={index} className={styles.step}>
            <span className={styles.arrow} aria-hidden="true" />
            <span>{priority.message}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Actions({ verdict, chapterId }: { verdict: Verdict; chapterId: string }) {
  if (verdict === 'approved') {
    return (
      <div className={styles.actions}>
        <RouteButton to="/trilha">Continuar a história</RouteButton>
      </div>
    )
  }
  if (verdict === 'failed_persuasion') {
    return (
      <div className={styles.actions}>
        <RouteButton to={`/capitulos/${chapterId}/consequencia`}>Ver o que aconteceu</RouteButton>
      </div>
    )
  }
  return (
    <div className={styles.actions}>
      <RouteButton to={`/capitulos/${chapterId}/escrever`}>Revisar meu texto</RouteButton>
      <RouteButton variant="ghost" to={`/capitulos/${chapterId}`}>
        Rever a cena
      </RouteButton>
    </div>
  )
}

import { useCallback, useId, useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type {
  AnnotationResponse,
  ChapterResponse,
  LensCriterionResponse,
  LensResponse,
  ReactionResponse,
  SubmissionResponse,
  Verdict,
} from '../../api/types'
import { useResource } from '../../api/useResource'
import { RouteButton } from '../../components/Button'
import { ProgressBar } from '../../components/ProgressBar'
import { ANNOTATION_LABEL } from '../../copy/labels'
import { Reaction } from '../../components/Reaction'
import styles from './Correcao.module.css'
import { annotate, type Mark } from './spans'

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

      <Scoreboard lens={submission.lens} floor={submission.floor_value} />

      <Text segments={segments} />

      {marks.length === 0 ? null : <Legend marks={marks} />}

      {submission.para_passar.length === 0 ? null : (
        <ParaPassar priorities={submission.para_passar} />
      )}

      <Actions verdict={submission.verdict} chapterId={chapter.id} />
    </main>
  )
}

function Scoreboard({ lens, floor }: { lens: LensResponse; floor: number }) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Placar
      </h2>
      <div className={styles.rows}>
        {lens.criteria.map((criterion) => (
          <Criterion key={criterion.code} criterion={criterion} floor={floor} />
        ))}
      </div>
      {lens.total === null || lens.total_max === null ? null : (
        <div className={styles.total}>
          <div className={styles.totalText}>
            <span className={styles.totalLabel}>Soma dos critérios</span>
            {lens.scale_source === 'argumenta' ? (
              <span className={styles.disclaimer}>
                Estimativa Argumenta, não é nota oficial do vestibular
              </span>
            ) : null}
          </div>
          <span className={styles.totalScore}>{`${lens.total}/${lens.total_max}`}</span>
        </div>
      )}
    </section>
  )
}

/** The criterion's own aggregate on the internal 0-100 scale, which is what the
 *  floor is measured on: the wire never maps a criterion back to its dimensions. */
function percentOf(criterion: LensCriterionResponse): number {
  return Math.round((criterion.score / criterion.scale_max) * 100)
}

function Criterion({
  criterion,
  floor,
}: {
  criterion: LensCriterionResponse
  floor: number
}) {
  const percent = percentOf(criterion)
  const below = percent < floor
  return (
    <div className={styles.row}>
      <div className={styles.rowHead}>
        <span className={below ? styles.labelBelow : styles.label}>{criterion.label}</span>
        {criterion.is_argumenta_extra ? (
          <span className={styles.extra}>critério Argumenta</span>
        ) : null}
        <span className={below ? styles.scoreBelow : styles.score}>
          {`${criterion.score}/${criterion.scale_max}`}
        </span>
      </div>
      <ProgressBar
        percent={percent}
        floor={floor}
        tone={below ? 'alert' : 'caneta'}
        label={below ? `${criterion.label}, abaixo do piso` : criterion.label}
      />
    </div>
  )
}

function Text({ segments }: { segments: ReturnType<typeof annotate>['segments'] }) {
  const heading = useId()
  const explanation = useId()
  const [open, setOpen] = useState<number | null>(null)
  const openMark = segments.find((segment) => segment.mark === open && segment.annotation !== null)

  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        Seu texto, corrigido
      </h2>
      <p className={styles.text}>
        {segments.map((segment, index) =>
          segment.annotation === null ? (
            <span key={index}>{segment.text}</span>
          ) : (
            <button
              key={index}
              type="button"
              data-mark={segment.mark}
              className={
                segment.annotation.severity === 'praise' ? styles.praise : styles.slip
              }
              aria-label={`${segment.text}: ${segment.annotation.message}`}
              aria-expanded={open === segment.mark}
              aria-controls={explanation}
              onClick={() => setOpen(open === segment.mark ? null : segment.mark)}
            >
              {segment.text}
            </button>
          ),
        )}
      </p>
      <p id={explanation} className={styles.explanation} aria-live="polite">
        {openMark?.annotation?.message ?? ''}
      </p>
    </section>
  )
}

function Legend({ marks }: { marks: Mark[] }) {
  const heading = useId()
  return (
    <section aria-labelledby={heading} className={styles.card}>
      <h2 id={heading} className={styles.cardTitle}>
        As marcações
      </h2>
      <ol className={styles.legend}>
        {marks.map(({ number, annotation }) => (
          <li key={number} className={styles.legendItem}>
            <span
              className={
                annotation.severity === 'praise' ? styles.badgePraise : styles.badgeSlip
              }
              aria-hidden="true"
            >
              {number}
            </span>
            <p className={styles.legendText}>
              <strong className={styles.legendKind}>{`${ANNOTATION_LABEL[annotation.type]}.`}</strong>{' '}
              <span>{annotation.message}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
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

import { useCallback, useId, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import { useLens } from '../../session/context'
import { messageFor } from '../../api/messages'
import type { ChapterResponse, ChapterStatus, TelemetryEvent, TrackResponse } from '../../api/types'
import { useResource } from '../../api/useResource'
import { awaitVerdict } from '../../api/verdict'
import { countWords } from '../../api/words'
import { Button, RouteButton } from '../../components/Button'
import { Card } from '../../components/Card'
import { Chip } from '../../components/Chip'
import { Notice } from '../../components/Notice'
import styles from './Editor.module.css'
import { blockerOf } from './limits'
import { AUTOSAVE_LABEL, useAutosave } from './useAutosave'
import { useWritingSignals } from './useWritingSignals'

/** What a confronto asks for; the evaluator looks for these three. */
const REQUIREMENTS = ['Tese', 'Justificativa', 'Repertório explicado']

/** A boss chapter is a full essay, so the parts are the essay's. The
 *  intervention proposal mirrors the API's lens: only ENEM grades it. */
const ESSAY_PARTS = ['Tese', 'Argumentos com repertório', 'Fechamento']
const INTERVENTION = 'Proposta de intervenção'

/** The same statuses the scene offers the CTA for: the URL is not a shortcut. */
const WRITABLE: ChapterStatus[] = ['available', 'drafting', 'in_recovery']

/** The API refunded the daily tick on failure, so "tente de novo" is honest. */
const EVALUATION_FAILED =
  'A correção falhou aqui do nosso lado. Seu envio de hoje foi devolvido, tente de novo.'

interface Desk {
  chapter: ChapterResponse
  track: TrackResponse
}

export function Editor() {
  const api = useApi()
  const { chapterId = '' } = useParams()
  const load = useCallback(async (): Promise<Desk> => {
    const [chapter, track] = await Promise.all([api.chapter(chapterId), api.track()])
    return { chapter, track }
  }, [api, chapterId])
  const { state, reload } = useResource(load)

  return (
    <Loaded resource={state} onRetry={reload}>
      {(desk) =>
        WRITABLE.includes(desk.chapter.status) ? (
          <Writing chapter={desk.chapter} track={desk.track} />
        ) : (
          <Closed chapter={desk.chapter} />
        )
      }
    </Loaded>
  )
}

function Closed({ chapter }: { chapter: ChapterResponse }) {
  return (
    <main className={styles.page}>
      <h1 className={styles.closedTitle}>{chapter.title}</h1>
      <p className={styles.objective}>Este capítulo não está esperando texto agora.</p>
      <RouteButton to={`/capitulos/${chapter.id}`}>Voltar para a cena</RouteButton>
    </main>
  )
}

function Writing({ chapter, track }: Desk) {
  const api = useApi()
  const lens = useLens()
  const navigate = useNavigate()
  const proposal = useId()
  const signals = useWritingSignals()
  const [body, setBody] = useState(chapter.draft_body ?? '')
  const [sending, setSending] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  // fire and forget: nothing the anti-cheat reports may reach the student
  const report = useCallback(
    (events: TelemetryEvent[]) => void api.recordTelemetry({ events }).catch(() => undefined),
    [api],
  )
  const save = useCallback(
    (text: string) => api.saveDraft(chapter.id, { body: text }),
    [api, chapter.id],
  )
  const autosave = useAutosave({ body, stored: chapter.draft_body ?? '', save })

  const words = countWords(body)
  const blocker = blockerOf(words, chapter, track)
  const boss = chapter.kind === 'chefe'
  const parts = boss ? [...ESSAY_PARTS, ...(lens === 'enem' ? [INTERVENTION] : [])] : REQUIREMENTS

  async function send() {
    setSending(true)
    setFailure(null)
    try {
      const pending = await api.submit(chapter.id, { body, ...signals.summary() })
      const typing = signals.typingEvent(pending.submission_id)
      if (typing !== null) report([typing])
      const outcome = await awaitVerdict(api, pending)
      if (outcome.status === 'failed') {
        setFailure(EVALUATION_FAILED)
        setSending(false)
        return
      }
      // `sending` stays set: the screen is leaving, so there is nothing to reset
      // the annotation offsets belong to the text that was judged, so it travels
      navigate(`/capitulos/${chapter.id}/correcao`, {
        state: { submission: outcome.submission, body },
      })
    } catch (error) {
      setFailure(messageFor(error))
      setSending(false)
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.bar}>
        <Link to={`/capitulos/${chapter.id}`} className={styles.back}>
          ← Cena
        </Link>
        <Chip>{`${track.submissions_today}/${track.daily_limit} envios hoje`}</Chip>
      </header>

      <h1 className={styles.title}>
        {boss ? 'Redação-chefe' : `Convença ${chapter.antagonist_name}`}
      </h1>

      {/* two wrappers that are `display: contents` until the desktop grid needs
          them, so the phone layout is byte for byte the same order */}
      <div className={styles.side}>
        <Card className={styles.brief}>
          {boss ? (
            <section aria-labelledby={proposal} className={styles.proposal}>
              <h2 id={proposal} className={styles.proposalTitle}>
                A proposta
              </h2>
              <p className={styles.objective}>{chapter.objective}</p>
              <div className={styles.requirements}>
                {parts.map((part) => (
                  <Chip key={part}>{part}</Chip>
                ))}
              </div>
            </section>
          ) : (
            <>
              <p className={styles.objective}>{chapter.objective}</p>
              <div className={styles.requirements}>
                {parts.map((part) => (
                  <Chip key={part}>{part}</Chip>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className={styles.desk}>
      <label className="sr-only" htmlFor="argumento">
        Seu argumento
      </label>
      <textarea
        id="argumento"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        onKeyDown={signals.onKeyDown}
        onPaste={(event) => {
          const pasted = signals.onPaste(event)
          if (pasted !== null) report([pasted])
        }}
        className={[styles.editor, boss ? styles.essay : undefined].filter(Boolean).join(' ')}
        placeholder={
          boss
            ? 'Escreva o seu texto dissertativo-argumentativo.'
            : `Escreva para ${chapter.antagonist_name}.`
        }
      />
      <p className={styles.foot}>
        <span>{`${words} / ${chapter.max_words} palavras`}</span>
        <span>{AUTOSAVE_LABEL[autosave]}</span>
      </p>

      {sending ? (
        <Notice tone="ok">
          {`${chapter.antagonist_name} está lendo o seu texto. Isso pode levar um minuto.`}
        </Notice>
      ) : null}
      {failure === null ? null : <Notice tone="error">{failure}</Notice>}
      {blocker === null ? null : <p className={styles.blocker}>{blocker}</p>}
      <Button onClick={() => void send()} disabled={blocker !== null || sending}>
        {sending
          ? 'Corrigindo…'
          : boss
            ? 'Entregar a redação'
            : `Enviar para ${chapter.antagonist_name}`}
      </Button>
      </div>
    </main>
  )
}

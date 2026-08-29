import { useId, useState } from 'react'

import { useApi } from '../api/context'
import { messageFor } from '../api/messages'
import type { Exam } from '../api/types'
import { Button } from '../components/Button'
import { Card, Kicker } from '../components/Card'
import { Chip } from '../components/Chip'
import { Notice } from '../components/Notice'
import { Select } from '../components/Select'
import { EXAMS, EXAM_LABEL, targetLabel } from '../copy/labels'
import { useSession, useStudent } from '../session/context'
import styles from './profile.module.css'

const YEARS_AHEAD = 4

function upcomingYears(): number[] {
  const current = new Date().getFullYear()
  return Array.from({ length: YEARS_AHEAD }, (_, offset) => current + offset)
}

/** Without a target the API falls back to its default lens, and the app asks for
 *  one again: worth saying before the student loses the last one. */
const LAST_TARGET_WARNING =
  'Sem nenhum vestibular, a sua correção volta para a lente padrão (ENEM) e o Argumenta vai pedir um alvo de novo.'

interface TargetsCardProps {
  /** The account screen asks before the student loses the last lens; the
   *  onboarding does not, because it is the screen already asking for one. */
  warnOnLastRemoval?: boolean
}

export function TargetsCard({ warnOnLastRemoval = false }: TargetsCardProps = {}) {
  const api = useApi()
  const heading = useId()
  const { reload } = useSession()
  const { targets } = useStudent()
  const years = upcomingYears()
  const [exam, setExam] = useState<Exam>('enem')
  const [year, setYear] = useState(years[0])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await action()
      await reload()
    } catch (failure) {
      setError(messageFor(failure))
    } finally {
      setBusy(false)
    }
  }

  function remove(targetId: string) {
    if (warnOnLastRemoval && targets.length === 1 && confirming !== targetId) {
      setConfirming(targetId)
      return
    }
    setConfirming(null)
    void run(() => api.removeTarget(targetId))
  }

  return (
    <Card>
      <div className={styles.card}>
        <Kicker>A lente da sua correção</Kicker>
        <h2 id={heading} className={styles.heading}>
          Seus vestibulares
        </h2>
        <div className={styles.row}>
          <Select
            label="Vestibular"
            value={exam}
            onChange={(event) => setExam(event.target.value as Exam)}
            options={EXAMS.map((option) => ({ value: option, label: EXAM_LABEL[option] }))}
          />
          <Select
            label="Ano"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            options={years.map((option) => ({ value: String(option), label: String(option) }))}
          />
          <Button
            variant="ghost"
            className={styles.inline}
            disabled={busy}
            onClick={() => void run(() => api.addTarget({ exam, year }))}
          >
            Adicionar
          </Button>
        </div>
        {error ? <Notice tone="error">{error}</Notice> : null}
        {targets.length === 0 ? (
          <p className={styles.empty}>
            Nenhum vestibular escolhido ainda. Escolha pelo menos um: é ele que define em qual
            escala a sua correção aparece.
          </p>
        ) : (
          <ul className={styles.list} aria-labelledby={heading}>
            {targets.map((target) => {
              const name = targetLabel(target.exam, target.year)
              return (
                <li key={target.id} className={styles.item}>
                  <span className={styles.name}>{name}</span>
                  {target.is_active ? (
                    <Chip>Lente ativa</Chip>
                  ) : (
                    <Button
                      variant="quiet"
                      disabled={busy}
                      onClick={() => void run(() => api.activateTarget(target.id))}
                    >
                      {`Usar a lente ${name}`}
                    </Button>
                  )}
                  <Button
                    variant="quiet"
                    aria-label={`Remover ${name}`}
                    disabled={busy}
                    onClick={() => remove(target.id)}
                  >
                    Remover
                  </Button>
                  {confirming === target.id ? (
                    <div className={styles.confirm}>
                      <Notice tone="warn">{LAST_TARGET_WARNING}</Notice>
                      <div className={styles.confirmRow}>
                        <Button variant="danger" disabled={busy} onClick={() => remove(target.id)}>
                          Remover mesmo assim
                        </Button>
                        <Button variant="ghost" onClick={() => setConfirming(null)}>
                          Manter
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}

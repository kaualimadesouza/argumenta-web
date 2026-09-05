import { Card, Kicker } from '../../components/Card'
import { Chip } from '../../components/Chip'
import { ProgressBar } from '../../components/ProgressBar'
import {
  DRAFT_AFTER,
  DRAFT_BEFORE_SLIP,
  DRAFT_MIDDLE,
  DRAFT_PRAISE,
  DRAFT_SLIP,
  REQUIREMENTS,
  SCORE_FLOOR,
  SCORE_MAX,
  SCORE_ROWS,
  STEP_SCENE,
  STEPS,
  TO_PASS,
  VERDICT_OK,
  VERDICT_WARN,
  type VerdictSample,
} from './content'
import { Scene } from './Scene'
import { useReveal } from './useReveal'
import styles from './HowItWorks.module.css'

function EditorMini() {
  return (
    <>
      <Card>
        <Kicker>Seu objetivo</Kicker>
        <p className={styles.objective}>{STEP_SCENE.objective}</p>
      </Card>
      <div className={styles.requirements}>
        {REQUIREMENTS.map((requirement) => (
          <Chip key={requirement} tone="neutral">
            {requirement}
          </Chip>
        ))}
      </div>
      <p className={styles.editor}>
        {DRAFT_BEFORE_SLIP}
        {DRAFT_SLIP}
        {DRAFT_MIDDLE}
        {DRAFT_PRAISE}
        {DRAFT_AFTER}
        <span className={styles.caret} />
      </p>
      <p className={styles.foot}>
        <span>47 / 250 palavras</span>
        <span>Rascunho salvo</span>
      </p>
    </>
  )
}

function Scoreboard({ revealed }: { revealed: boolean }) {
  const total = SCORE_ROWS.reduce((sum, row) => sum + row.score, 0)
  return (
    <Card>
      <div className={styles.boardBar}>
        <span className={styles.chapter}>Capítulo 2 · O pátio do Tenório</span>
        <span className={styles.attempt}>2ª tentativa</span>
      </div>
      <div className={styles.rows}>
        {SCORE_ROWS.map((row) => (
          <div key={row.code} className={styles.row}>
            <div className={styles.rowHead}>
              <span className={styles.code}>{row.code}</span>
              <span className={row.belowFloor ? styles.labelBelow : styles.label}>{row.label}</span>
              {row.belowFloor ? <span className={styles.extra}>abaixo do piso</span> : null}
              <span className={row.belowFloor ? styles.scoreBelow : styles.score}>{row.score}</span>
            </div>
            <ProgressBar
              percent={revealed ? (row.score / SCORE_MAX) * 100 : 0}
              floor={(SCORE_FLOOR / SCORE_MAX) * 100}
              tone={row.belowFloor ? 'alert' : 'caneta'}
              label={row.label}
            />
          </div>
        ))}
      </div>
      <div className={styles.total}>
        <div className={styles.totalText}>
          <span className={styles.totalLabel}>Soma dos critérios</span>
          <span className={styles.disclaimer}>Estimativa do Argumenta, não nota de banca</span>
        </div>
        <span className={styles.totalScore}>
          {total} / {SCORE_MAX * SCORE_ROWS.length}
        </span>
      </div>
    </Card>
  )
}

function CorrectionMini() {
  const { ref, revealed } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={styles.stack}>
      <Scoreboard revealed={revealed} />
      <Card>
        <p className={styles.studentText}>
          {DRAFT_BEFORE_SLIP}
          <span className={styles.slip}>{DRAFT_SLIP}</span>
          <span className={[styles.mark, styles.markSlip].join(' ')}>1</span>
          {DRAFT_MIDDLE}
          <span className={styles.praise}>{DRAFT_PRAISE}</span>
          <span className={[styles.mark, styles.markPraise].join(' ')}>2</span>
          {DRAFT_AFTER}.
        </p>
      </Card>
      <Card>
        <Kicker>Para passar</Kicker>
        <ul className={styles.toPass}>
          {TO_PASS.map((item) => (
            <li key={item}>
              <span className={styles.arrow} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Verdict({ verdict, tone }: { verdict: VerdictSample; tone: 'ok' | 'warn' }) {
  return (
    <div className={[styles.verdict, tone === 'ok' ? styles.verdictOk : styles.verdictWarn].join(' ')}>
      <p className={styles.verdictTitle}>{verdict.title}</p>
      <p className={styles.verdictLine}>{verdict.line}</p>
    </div>
  )
}

const MINIS = [
  () => <Scene scene={STEP_SCENE} compact />,
  EditorMini,
  CorrectionMini,
  () => (
    <>
      <Verdict verdict={VERDICT_OK} tone="ok" />
      <Verdict verdict={VERDICT_WARN} tone="warn" />
    </>
  ),
]

/** The loop in four steps, each beside a thumbnail of the real screen, all
 *  following one chapter of the tutorial. */
export function HowItWorks() {
  return (
    <div className={styles.steps}>
      {STEPS.map((step, index) => {
        const Mini = MINIS[index]
        return (
          <article key={step.number} className={styles.step}>
            <div className={styles.stepHead}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </div>
            <div className={styles.mini} aria-hidden="true">
              <Mini />
            </div>
          </article>
        )
      })}
    </div>
  )
}

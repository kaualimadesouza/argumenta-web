import { useCallback, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

import type { PasteEvent, TypingStatsEvent } from '../../api/types'
import { countWords } from '../../api/words'

/** A gap longer than this is the student living their life, not writing. */
const IDLE_GAP_MS = 60_000

interface Tally {
  keystrokes: number
  backspaces: number
  typingMs: number
  lastKeyAt: number | null
  pastes: number
}

export interface WritingSignals {
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  /** The event to report, right away: a paste in an abandoned draft still
   *  happened, so it does not wait for a submission that may never come. */
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => PasteEvent | null
  /** What the submission itself carries, next to the text. */
  summary: () => { typing_ms: number; paste_count: number }
  /** null when the student typed nothing, so no pointless request. */
  typingEvent: (submissionId: string) => TypingStatsEvent | null
}

/** How the argument was written, for the anti-cheat signals: never shown to the
 *  student and never part of the grade (PRD decision 12). */
export function useWritingSignals(): WritingSignals {
  const tally = useRef<Tally>({
    keystrokes: 0,
    backspaces: 0,
    typingMs: 0,
    lastKeyAt: null,
    pastes: 0,
  })

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    const current = tally.current
    const now = Date.now()
    const gap = current.lastKeyAt === null ? null : now - current.lastKeyAt
    if (gap !== null && gap <= IDLE_GAP_MS) current.typingMs += gap
    current.lastKeyAt = now
    current.keystrokes += 1
    if (event.key === 'Backspace') current.backspaces += 1
  }, [])

  const onPaste = useCallback((event: ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = event.clipboardData.getData('text')
    if (pasted === '') return null
    tally.current.pastes += 1
    return {
      event_type: 'paste' as const,
      occurred_at: new Date().toISOString(),
      chars: pasted.length,
      words: countWords(pasted),
    }
  }, [])

  const summary = useCallback(
    () => ({ typing_ms: tally.current.typingMs, paste_count: tally.current.pastes }),
    [],
  )

  const typingEvent = useCallback((submissionId: string) => {
    const current = tally.current
    if (current.keystrokes === 0) return null
    return {
      event_type: 'typing_stats' as const,
      occurred_at: new Date().toISOString(),
      submission_id: submissionId,
      ms: current.typingMs,
      keystrokes: current.keystrokes,
      backspaces: current.backspaces,
    }
  }, [])

  return { onKeyDown, onPaste, summary, typingEvent }
}

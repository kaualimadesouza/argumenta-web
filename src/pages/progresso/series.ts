import type { TrendPointResponse } from '../../api/types'

const WEEKDAY = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const WEEK = 7
const DAY_MS = 24 * 60 * 60 * 1000

export interface StreakDay {
  label: string
  done: boolean
  today: boolean
}

/** The API reports the streak, not the calendar, and that is enough: a streak of
 *  N means the last N days in a row had a submission. Today only counts as one
 *  of them once something was sent today, so an open day stays open. */
export function streakWeek(streakDays: number, wroteToday: boolean, today: Date): StreakDay[] {
  const last = wroteToday ? WEEK - 1 : WEEK - 2
  const filled = Math.min(streakDays, last + 1)

  return Array.from({ length: WEEK }, (_, index) => {
    const day = new Date(today.getTime() - (WEEK - 1 - index) * DAY_MS)
    return {
      label: WEEKDAY[day.getDay()],
      done: index <= last && index > last - filled,
      today: index === WEEK - 1,
    }
  })
}

interface Box {
  width: number
  height: number
}

export interface Sparkline {
  /** SVG polyline coordinates inside the box. */
  points: string
  latest: number
  /** From the first point of the window to the last. */
  delta: number
}

const SCALE_MAX = 100
/** Room for the stroke, so a 0 or a 100 is not clipped by the viewBox. */
const INSET = 2

function y(score: number, height: number): number {
  const usable = height - INSET * 2
  return INSET + usable * (1 - Math.min(Math.max(score, 0), SCALE_MAX) / SCALE_MAX)
}

export function sparklineOf(points: TrendPointResponse[], box: Box): Sparkline | null {
  if (points.length === 0) return null

  const first = points[0].score
  const latest = points[points.length - 1].score
  // one measurement is a flat line across the box, not a dot nobody can see
  if (points.length === 1) {
    const flat = y(latest, box.height)
    return { points: `${INSET},${flat} ${box.width - INSET},${flat}`, latest, delta: 0 }
  }

  const step = (box.width - INSET * 2) / (points.length - 1)
  const drawn = points
    .map((point, index) => `${INSET + step * index},${y(point.score, box.height)}`)
    .join(' ')
  return { points: drawn, latest, delta: latest - first }
}

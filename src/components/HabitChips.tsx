import type { HabitSummary } from '../api/types'
import { Chip } from './Chip'

/** Streak and remaining submissions, the two chips of the mockup's appbar. */
export function HabitChips({ habit }: { habit: HabitSummary }) {
  return (
    <>
      {habit.streak_days > 0 ? (
        <Chip tone="streak">{`${habit.streak_days} ${habit.streak_days === 1 ? 'dia' : 'dias'}`}</Chip>
      ) : null}
      <Chip>{`${habit.submissions_today}/${habit.daily_limit} envios hoje`}</Chip>
    </>
  )
}

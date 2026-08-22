import { useCallback } from 'react'

import { Loaded } from '../../api/Loaded'
import { useApi } from '../../api/context'
import type { TrackStoryResponse } from '../../api/types'
import { useResource } from '../../api/useResource'
import { Button } from '../../components/Button'
import { HabitChips } from '../../components/HabitChips'
import { useSession } from '../../session/context'
import { StoryCard } from './StoryCard'
import styles from './Trilha.module.css'

/** Only a completed story unlocks the next one, so the blocker is the story
 *  right before it in track order. */
function blockerOf(stories: TrackStoryResponse[], index: number): string | null {
  return index === 0 ? null : stories[index - 1].title
}

export function Trilha() {
  const api = useApi()
  const { signOut } = useSession()
  const { state, reload } = useResource(useCallback(() => api.track(), [api]))

  return (
    <Loaded resource={state} onRetry={reload}>
      {(track) => (
        <main className={styles.page}>
          <header className={styles.bar}>
            <h1 className={styles.title}>Sua trilha</h1>
            <div className={styles.chips}>
              <HabitChips habit={track} />
              {/* leaves with the account screen (#18), which owns this action */}
              <Button variant="quiet" onClick={() => void signOut()}>
                Sair
              </Button>
            </div>
          </header>
          {track.stories.length === 0 ? (
            <p className={styles.empty}>
              Nenhuma história publicada ainda. Assim que a primeira entrar no ar, ela aparece aqui.
            </p>
          ) : (
            <div className={styles.stories}>
              {track.stories.map((story, index) => (
                <StoryCard key={story.id} story={story} blockedBy={blockerOf(track.stories, index)} />
              ))}
            </div>
          )}
        </main>
      )}
    </Loaded>
  )
}

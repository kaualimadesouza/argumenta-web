import type { StoryState, TrackStoryResponse } from '../../api/types'
import { RouteButton } from '../../components/Button'
import { Card } from '../../components/Card'
import { Chip, type ChipTone } from '../../components/Chip'
import { ProgressBar } from '../../components/ProgressBar'
import { StoryCover } from '../../components/art/StoryCover'
import styles from './Trilha.module.css'

interface Badge {
  tone: ChipTone
  label: string
}

function badgeFor(story: TrackStoryResponse): Badge {
  switch (story.state) {
    case 'completed':
      return { tone: 'ok', label: 'Concluída' }
    case 'locked':
      return { tone: 'warn', label: 'Bloqueada' }
    default:
      return {
        tone: 'caneta',
        label: `Cap. ${story.current_chapter?.order ?? story.chapters_total}/${story.chapters_total}`,
      }
  }
}

/** "Começar" only for a story nobody has touched; everything else continues. */
function ctaLabel(state: StoryState, order: number): string {
  return `${state === 'available' ? 'Começar' : 'Continuar'} capítulo ${order}`
}

function lineFor(story: TrackStoryResponse, blockedBy: string | null): string {
  if (story.state === 'locked') {
    return blockedBy === null
      ? 'Abre quando a história anterior terminar.'
      : `Conclua ${blockedBy} para abrir esta história.`
  }
  return story.is_tutorial ? `Tutorial · ${story.chapters_total} capítulos` : story.synopsis
}

interface StoryCardProps {
  story: TrackStoryResponse
  /** Title of the story that has to be finished first, when this one is locked. */
  blockedBy: string | null
}

export function StoryCard({ story, blockedBy }: StoryCardProps) {
  const badge = badgeFor(story)
  const done = story.state === 'completed'
  const featured = story.state === 'in_progress'
  const percent = Math.round((story.chapters_passed / story.chapters_total) * 100)
  // a locked story never offers a chapter, whatever the cursor says
  const chapter = story.state === 'locked' ? null : story.current_chapter

  return (
    <Card active={featured} className={featured ? styles.featured : undefined}>
      <article
        className={[styles.story, story.state === 'locked' ? styles.locked : undefined]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.top}>
          <StoryCover slug={story.slug} asset={story.cover_asset} />
          <div className={styles.body}>
            <div className={styles.titleRow}>
              <h2 className={styles.storyTitle}>{story.title}</h2>
              <Chip tone={badge.tone}>{badge.label}</Chip>
            </div>
            <p className={styles.line}>{lineFor(story, blockedBy)}</p>
            <ProgressBar
              percent={percent}
              done={done}
              label={`${story.chapters_passed} de ${story.chapters_total} capítulos`}
            />
          </div>
        </div>
        {chapter ? (
          <RouteButton to={`/capitulos/${chapter.id}`} className={styles.cta}>
            {ctaLabel(story.state, chapter.order)}
          </RouteButton>
        ) : null}
      </article>
    </Card>
  )
}

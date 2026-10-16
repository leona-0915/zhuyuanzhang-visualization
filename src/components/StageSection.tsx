import type { EventItem, StageConfig } from '../types'
import { EventCard } from './EventCard'

interface Props {
  stage: StageConfig
  events: EventItem[]
  activeId: number
  onSelect: (id: number) => void
}

export function StageSection({ stage, events, activeId, onSelect }: Props) {
  return (
    <section className="stage" data-stage={stage.key} id={`stage-${stage.key}`}>
      <header className="stage__head">
        <span className="stage__range">{stage.range}</span>
        <h2 className="stage__name">{stage.name}</h2>
      </header>
      <div className="stage__cards">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            active={event.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

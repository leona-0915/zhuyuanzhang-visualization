import type { EventItem } from '../types'

interface Props {
  event: EventItem
  active: boolean
  onSelect: (id: number) => void
}

export function EventCard({ event, active, onSelect }: Props) {
  return (
    <article
      className={`card${active ? ' card--active' : ''}`}
      data-event-id={event.id}
      onClick={() => onSelect(event.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(event.id)
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="card__year">
        <span className="card__year-num">{event.year ?? '——'}</span>
        <span className="card__year-cn">{event.year_cn}</span>
      </div>
      <div className="card__body">
        <div className="card__meta">
          <span className="chip" data-category={event.category}>
            {event.category}
          </span>
          <span className="card__identity">{event.identity}</span>
        </div>
        <h3 className="card__title">{event.title}</h3>
        <p className="card__summary">{event.summary}</p>
      </div>
    </article>
  )
}

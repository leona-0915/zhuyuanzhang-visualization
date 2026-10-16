import type { EventItem } from '../types'
import { IdentityLadder } from './IdentityLadder'

interface Props {
  event: EventItem
  ladder: string[]
}

export function ThreeLinesPanel({ event, ladder }: Props) {
  const yearMain = event.year != null ? String(event.year) : event.year_cn
  const yearSub = event.year != null ? event.year_cn : ''

  return (
    <aside className="three-lines" aria-label="命运三线">
      <div className="line line--time">
        <span className="line__tag">时间</span>
        <strong className="line__value">{yearMain}</strong>
        {yearSub && <span className="line__sub">{yearSub}</span>}
      </div>

      <div className="line line--space">
        <span className="line__tag">空间</span>
        <strong className="line__value">{event.location}</strong>
        {event.location_now && <span className="line__sub">{event.location_now}</span>}
      </div>

      <div className="line line--identity">
        <span className="line__tag">身份</span>
        <strong className="line__value">{event.identity}</strong>
        <IdentityLadder ladder={ladder} current={event.identity} />
      </div>

      <div className="line line--stage">
        <span className="line__tag">阶段</span>
        <strong className="line__value">{event.stage}</strong>
      </div>
    </aside>
  )
}

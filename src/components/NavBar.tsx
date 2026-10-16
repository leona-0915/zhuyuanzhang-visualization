import type { EventItem } from '../types'

interface Props {
  current: EventItem
  total: number
  activePanel: 'identity' | 'space' | null
  onOpenIdentity: () => void
  onOpenSpace: () => void
  onScrollToTime: () => void
}

export function NavBar({
  current,
  total,
  activePanel,
  onOpenIdentity,
  onOpenSpace,
  onScrollToTime,
}: Props) {
  const progress = (current.id / total) * 100

  return (
    <header className="navbar">
      <button type="button" className="navbar__brand" onClick={onScrollToTime}>
        朱元璋 · 命运轨迹
      </button>
      <nav className="navbar__nav">
        <button
          type="button"
          className={`navbar__link${activePanel === null ? ' is-active' : ''}`}
          onClick={onScrollToTime}
        >
          时间
        </button>
        <button
          type="button"
          className={`navbar__link${activePanel === 'identity' ? ' is-active' : ''}`}
          onClick={onOpenIdentity}
        >
          身份
        </button>
        <button
          type="button"
          className={`navbar__link${activePanel === 'space' ? ' is-active' : ''}`}
          onClick={onOpenSpace}
        >
          空间
        </button>
      </nav>
      <div className="navbar__count">
        <span className="navbar__cur">{current.id}</span>
        <span className="navbar__sep">/</span>
        <span className="navbar__total">{total}</span>
      </div>
      <div className="navbar__progress">
        <div className="navbar__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </header>
  )
}

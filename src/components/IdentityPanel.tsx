import type { EventItem } from '../types'

interface Props {
  ladder: string[]
  events: EventItem[]
  onSelect: (id: number) => void
  onClose: () => void
}

export function IdentityPanel({ ladder, events, onSelect, onClose }: Props) {
  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <header className="panel__head">
          <h2>身份阶梯</h2>
          <button type="button" className="panel__close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>
        <ol className="identity-panel">
          {ladder.map((rung, i) => {
            const list = events.filter((e) => e.identity === rung)
            if (list.length === 0) {
              return (
                <li key={rung} className="identity-panel__item identity-panel__item--empty">
                  <span className="identity-panel__rung">{rung}</span>
                  <span className="identity-panel__hint">无对应事件</span>
                </li>
              )
            }
            const first = list[0]
            return (
              <li key={rung} className="identity-panel__item">
                <button
                  type="button"
                  className="identity-panel__btn"
                  onClick={() => onSelect(first.id)}
                >
                  <span className="identity-panel__idx">{i + 1}</span>
                  <span className="identity-panel__rung">{rung}</span>
                  <span className="identity-panel__meta">
                    {list.length} 件 · {first.year ?? first.year_cn}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

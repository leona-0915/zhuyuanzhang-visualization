import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { EventItem } from '../types'

interface Props {
  event: EventItem
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

export function EventViewer({ event, index, total, onPrev, onNext, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onPrev, onNext, onClose])

  const hasPrev = index > 0
  const hasNext = index < total - 1

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        <div className="modal__count">
          第 {index + 1} / {total} 件
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.18 }}
          >
            <div className="modal__head">
              <span className="modal__year">{event.year ?? event.year_cn}</span>
              <span className="modal__year-cn">{event.year_cn}</span>
            </div>
            <h2 className="modal__title">{event.title}</h2>
            <p className="modal__summary">{event.summary}</p>
            <dl className="modal__facts">
              <div>
                <dt>类别</dt>
                <dd>{event.category}</dd>
              </div>
              <div>
                <dt>地点</dt>
                <dd>
                  {event.location}
                  {event.location_now ? `（${event.location_now}）` : ''}
                </dd>
              </div>
              <div>
                <dt>身份</dt>
                <dd>{event.identity}</dd>
              </div>
              <div>
                <dt>阶段</dt>
                <dd>{event.stage}</dd>
              </div>
            </dl>
            <div className="modal__source">
              <h3>出处</h3>
              <p className="modal__source-name">{event.source}</p>
              <blockquote className="modal__source-text">{event.source_text}</blockquote>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="modal__nav">
          <button className="modal__nav-btn" onClick={onPrev} disabled={!hasPrev}>
            ‹ 上一件
          </button>
          <button className="modal__nav-btn" onClick={onNext} disabled={!hasNext}>
            下一件 ›
          </button>
        </div>
      </div>
    </div>
  )
}

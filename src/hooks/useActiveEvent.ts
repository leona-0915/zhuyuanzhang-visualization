import { useEffect, useState } from 'react'

/**
 * 依据滚动位置推断当前「激活」的事件：
 * 取视口上方 40% 探针线之下、最靠后（最新）的事件卡片。
 */
export function useActiveEvent(total: number): number {
  const [activeId, setActiveId] = useState(1)

  useEffect(() => {
    const probe = () => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-event-id]')
      let current = 1
      const probeY = window.innerHeight * 0.4
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top <= probeY) {
          current = Number(node.dataset.eventId) || current
        }
      })
      setActiveId(current)
    }

    probe()
    window.addEventListener('scroll', probe, { passive: true })
    window.addEventListener('resize', probe)
    return () => {
      window.removeEventListener('scroll', probe)
      window.removeEventListener('resize', probe)
    }
  }, [total])

  return activeId
}

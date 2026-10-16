import { useCallback, useMemo, useState } from 'react'
import { dataset } from './data'
import { useActiveEvent } from './hooks/useActiveEvent'
import { IntroScreen } from './components/IntroScreen'
import { NavBar } from './components/NavBar'
import { ThreeLinesPanel } from './components/ThreeLinesPanel'
import { StageSection } from './components/StageSection'
import { EventViewer } from './components/EventViewer'
import { IdentityPanel } from './components/IdentityPanel'
import { SpacePanel } from './components/SpacePanel'
import type { EventItem } from './types'

function App() {
  const { meta, identity_ladder: ladder, stages, events } = dataset
  const [introDone, setIntroDone] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [activePanel, setActivePanel] = useState<'identity' | 'space' | null>(null)

  const activeId = useActiveEvent(events.length)

  const eventById = useMemo(() => {
    const map = new Map<number, EventItem>()
    events.forEach((e) => map.set(e.id, e))
    return map
  }, [events])

  const activeEvent = eventById.get(activeId) ?? events[0]

  const stageKeyByName = useMemo(() => {
    const map = new Map<string, string>()
    stages.forEach((s) => map.set(s.name, s.key))
    return map
  }, [stages])

  const activeStageKey = stageKeyByName.get(activeEvent.stage) ?? stages[0].key

  const eventsByStage = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        events: events.filter((e) => e.stage === stage.name),
      })),
    [stages, events],
  )

  const finishIntro = useCallback(() => setIntroDone(true), [])
  const openEvent = useCallback((id: number) => setSelectedId(id), [])
  const closeViewer = useCallback(() => setSelectedId(null), [])
  const openIdentity = useCallback(() => setActivePanel('identity'), [])
  const openSpace = useCallback(() => setActivePanel('space'), [])
  const closePanel = useCallback(() => setActivePanel(null), [])

  const goPrev = useCallback(() => {
    setSelectedId((id) => {
      if (id == null) return id
      const idx = events.findIndex((e) => e.id === id)
      return idx > 0 ? events[idx - 1].id : id
    })
  }, [events])

  const goNext = useCallback(() => {
    setSelectedId((id) => {
      if (id == null) return id
      const idx = events.findIndex((e) => e.id === id)
      return idx >= 0 && idx < events.length - 1 ? events[idx + 1].id : id
    })
  }, [events])

  const selectFromPanel = useCallback((id: number) => {
    setSelectedId(id)
    setActivePanel(null)
  }, [])

  const scrollToTime = useCallback(() => {
    setActivePanel(null)
    document
      .querySelector(`[data-event-id="${activeId}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeId])

  const selectedIndex =
    selectedId != null ? events.findIndex((e) => e.id === selectedId) : -1
  const selectedEvent = selectedIndex >= 0 ? events[selectedIndex] : null

  if (!introDone) {
    return <IntroScreen dataset={dataset} onFinish={finishIntro} />
  }

  return (
    <div className="app" data-stage={activeStageKey}>
      <NavBar
        current={activeEvent}
        total={events.length}
        activePanel={activePanel}
        onOpenIdentity={openIdentity}
        onOpenSpace={openSpace}
        onScrollToTime={scrollToTime}
      />

      <header className="hero">
        <p className="hero__eyebrow">明 · 洪武 · 命运轨迹</p>
        <h1 className="hero__title">朱元璋命运轨迹可视化</h1>
        <p className="hero__subtitle">从佃农之子到开国皇帝——命运的三条线，在此交织。</p>
      </header>

      <ThreeLinesPanel event={activeEvent} ladder={ladder} />

      <main className="timeline">
        {eventsByStage.map(({ stage, events: list }) => (
          <StageSection
            key={stage.key}
            stage={stage}
            events={list}
            activeId={activeId}
            onSelect={openEvent}
          />
        ))}
      </main>

      <footer className="footer">
        <p>
          数据版本 {meta.version} · 更新于 {meta.updated} · 共 {meta.total} 件
        </p>
      </footer>

      {selectedEvent && (
        <EventViewer
          event={selectedEvent}
          index={selectedIndex}
          total={events.length}
          onPrev={goPrev}
          onNext={goNext}
          onClose={closeViewer}
        />
      )}

      {activePanel === 'identity' && (
        <IdentityPanel
          ladder={ladder}
          events={events}
          onSelect={selectFromPanel}
          onClose={closePanel}
        />
      )}

      {activePanel === 'space' && (
        <SpacePanel events={events} onSelect={selectFromPanel} onClose={closePanel} />
      )}
    </div>
  )
}

export default App

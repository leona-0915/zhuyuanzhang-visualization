import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { GeoComponent, TooltipComponent } from 'echarts/components'
import { EffectScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { EventItem } from '../types'

echarts.use([GeoComponent, TooltipComponent, EffectScatterChart, CanvasRenderer])

type ChartInstance = ReturnType<typeof echarts.init>

interface Props {
  events: EventItem[]
  onSelect: (id: number) => void
  onClose: () => void
}

interface PlacePoint {
  coords: [number, number]
  name: string
  count: number
  firstId: number
}

export function SpacePanel({ events, onSelect, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ChartInstance | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [mapOpen, setMapOpen] = useState(true)

  // 按坐标聚合（应天/南京、凤阳/濠州/皇觉寺 等同址合并为一点）
  const points = useMemo<PlacePoint[]>(() => {
    const map = new Map<string, PlacePoint>()
    events.forEach((e) => {
      if (!e.coords) return
      const key = `${e.coords[0].toFixed(3)},${e.coords[1].toFixed(3)}`
      const existing = map.get(key)
      if (existing) {
        existing.count += 1
        if (e.id < existing.firstId) existing.firstId = e.id
      } else {
        map.set(key, {
          coords: e.coords,
          name: e.location_now || e.location,
          count: 1,
          firstId: e.id,
        })
      }
    })
    return Array.from(map.values())
  }, [events])

  const groups = useMemo(() => {
    const map = new Map<string, EventItem[]>()
    events.forEach((e) => {
      const arr = map.get(e.location) ?? []
      arr.push(e)
      map.set(e.location, arr)
    })
    return Array.from(map.entries()).map(([loc, list]) => ({ loc, list }))
  }, [events])

  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    let disposed = false
    let chart: ChartInstance | null = null

    fetch(`${import.meta.env.BASE_URL}china.json`)
      .then((r) => r.json())
      .then((geoJson) => {
        if (disposed) return
        geoJson.features.forEach((f: any) => {
          if (!f.properties?.name) f.properties.name = '南海诸岛'
        })
        echarts.registerMap('china', geoJson as any)
        chart = echarts.init(el)
        chartRef.current = chart
        chart.setOption(buildOption(points))
        chart.on('click', (params: any) => {
          const id = params.data?.firstId as number | undefined
          if (id != null) onSelect(id)
        })
      })
      .catch(() => {
        // 地图数据加载失败时静默，仅保留下方列表
      })

    return () => {
      disposed = true
      chart?.dispose()
      chartRef.current = null
    }
  }, [points, onSelect])

  useEffect(() => {
    const onResize = () => chartRef.current?.resize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 地图展开/收起后，等高度过渡完成再 resize
  useEffect(() => {
    if (!mapOpen) return
    const t = setTimeout(() => chartRef.current?.resize(), 340)
    return () => clearTimeout(t)
  }, [mapOpen])

  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const st = el.scrollTop
    if (st > 40) setMapOpen(false)
    else if (st < 20) setMapOpen(true)
  }, [])

  const toggleMap = useCallback(() => setMapOpen((v) => !v), [])

  return (
    <div className="panel-overlay panel-overlay--map" onClick={onClose}>
      <div className="panel panel--map" onClick={(e) => e.stopPropagation()}>
        <header className="panel__head">
          <h2>空间 · 地理轨迹</h2>
          <div className="panel__head-actions">
            <button
              type="button"
              className="panel__fold"
              onClick={toggleMap}
              aria-expanded={mapOpen}
            >
              {mapOpen ? '收起地图' : '展开地图'}
            </button>
            <button type="button" className="panel__close" onClick={onClose} aria-label="关闭">
              ×
            </button>
          </div>
        </header>
        <p className="panel__note">
          古地名标于今中国地图 · {points.length} 处地点 · 点击标注查看事件
        </p>
        <div className={`space-map-wrap${mapOpen ? '' : ' is-collapsed'}`}>
          <div ref={mapRef} className="space-map" />
        </div>
        <div ref={listRef} className="space-panel" onScroll={handleScroll}>
          {groups.map(({ loc, list }) => (
            <div key={loc} className="space-panel__group">
              <h3 className="space-panel__loc">{loc}</h3>
              <ul className="space-panel__list">
                {list.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      className="space-panel__btn"
                      onClick={() => onSelect(e.id)}
                    >
                      <span className="space-panel__year">{e.year ?? e.year_cn}</span>
                      <span className="space-panel__title">{e.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function buildOption(points: PlacePoint[]): any {
  const data = points.map((p) => ({
    name: p.name,
    value: [...p.coords, p.count],
    firstId: p.firstId,
    count: p.count,
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fcfaf6',
      borderColor: 'rgba(60, 55, 45, 0.2)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: '#2a2620', fontSize: 13 },
      formatter: (p: any) => `<b>${p.data.name}</b><br/>${p.data.count} 件事件`,
    },
    geo: {
      map: 'china',
      roam: true,
      center: [113, 32.5],
      zoom: 2.4,
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      itemStyle: {
        areaColor: '#f1ede2',
        borderColor: 'rgba(60, 55, 45, 0.28)',
        borderWidth: 1,
      },
      emphasis: { disabled: true },
      select: { disabled: true },
      label: { show: false },
    },
    series: [
      {
        name: '事件地点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data,
        symbolSize: (val: any) => 11 + Math.min(val[2] ?? 1, 24) * 0.9,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 2.6 },
        itemStyle: {
          color: '#b0402f',
          shadowBlur: 8,
          shadowColor: 'rgba(176, 64, 47, 0.35)',
        },
        label: {
          show: true,
          position: 'top',
          formatter: (p: any) => p.data.name,
          color: '#2a2620',
          fontSize: 11,
          fontFamily: "'Noto Serif SC', 'Songti SC', serif",
        },
        labelLayout: { hideOverlap: true },
        emphasis: { scale: 1.5 },
        zlevel: 2,
      },
    ],
  }
}

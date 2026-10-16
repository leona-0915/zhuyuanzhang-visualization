export interface EventItem {
  id: number
  year: number | string | null
  year_cn: string
  title: string
  summary: string
  category: string
  location: string
  location_now: string
  coords: [number, number] | null
  identity: string
  stage: string
  source: string
  source_text: string
}

export interface StageConfig {
  key: string
  name: string
  range: string
}

export interface DatasetMeta {
  title: string
  version: string
  updated: string
  total: number
  source_files: string[]
  notes: string[]
}

export interface Dataset {
  meta: DatasetMeta
  identity_ladder: string[]
  stages: StageConfig[]
  events: EventItem[]
}

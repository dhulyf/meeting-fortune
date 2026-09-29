export type FortuneLevel =
  | 'daji'
  | 'ji'
  | 'xiaoji'
  | 'ping'
  | 'xiaoxiong'
  | 'xiong'

export type RiskFocus =
  | 'mentor'
  | 'ppt'
  | 'task'
  | 'balanced'

export type SpecialEventType =
  | 'rare'
  | 'hidden'
  | 'error'
  | 'miracle'

export interface SpecialEvent {
  code: string
  type: SpecialEventType

  title: string
  message: string

  note?: string
}

export interface FortuneLevelConfig {
  level: FortuneLevel
  label: string
  weight: number
  bias: number
}

export interface FortuneMetrics {
  mentorAttention: number
  pptSurvival: number
  taskDropRate: number
}

export interface FortuneResult {
  id: string
  timestamp: number

  level: FortuneLevel
  levelLabel: string

  metrics: FortuneMetrics
}

export interface FortuneReport extends FortuneResult {
  riskFocus: RiskFocus
  specialEvent: SpecialEvent | null
  headline: string
  oracleText: string

  goodFor: string
  avoid: string

  actionAdvice: string
  talisman: string
}
export type AnimationLevel =
  | 'full'
  | 'reduced'

export type DarkHumorLevel =
  | 'low'
  | 'normal'
  | 'high'

export interface UserSettings {
  animationLevel: AnimationLevel
  soundEnabled: boolean
  darkHumorLevel: DarkHumorLevel
  elderNicknameEnabled: boolean
}

export interface OfferingState {
  balance: number
  totalOffering: number
  lastOfferingAt: number | null
}

export type OfferingPhase =
  | 'idle'
  | 'processing'
  | 'success'

export interface OfferingPackage {
  id: string
  amount: number
  caption: string
  note?: string
}

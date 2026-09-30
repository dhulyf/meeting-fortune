import type {
  OfferingState,
} from '../types/settings'

const STORAGE_KEY =
  'zhanbu-offering-state'

const INTRO_KEY =
  'zhanbu-offering-intro-seen'

export const EMPTY_OFFERING_STATE: OfferingState =
  {
    balance: 0,
    totalOffering: 0,
    lastOfferingAt: null,
  }

function sanitize(
  value: unknown,
): OfferingState {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return { ...EMPTY_OFFERING_STATE }
  }

  const raw = value as Partial<OfferingState>

  const balance =
    typeof raw.balance === 'number' &&
    Number.isFinite(raw.balance)
      ? raw.balance
      : 0

  const totalOffering =
    typeof raw.totalOffering ===
      'number' &&
    Number.isFinite(raw.totalOffering)
      ? raw.totalOffering
      : 0

  const lastOfferingAt =
    typeof raw.lastOfferingAt ===
      'number' &&
    Number.isFinite(raw.lastOfferingAt)
      ? raw.lastOfferingAt
      : null

  return {
    balance,
    totalOffering,
    lastOfferingAt,
  }
}

export function getOfferingState(): OfferingState {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return { ...EMPTY_OFFERING_STATE }
    }

    return sanitize(JSON.parse(raw))
  } catch {
    return { ...EMPTY_OFFERING_STATE }
  }
}

function writeState(
  state: OfferingState,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    )
  } catch {
    // localStorage 不可用时，
    // 不影响占卜主流程。
  }
}

export function addOffering(
  amount: number,
): OfferingState {
  const current = getOfferingState()

  const next: OfferingState = {
    balance: current.balance + amount,
    totalOffering:
      current.totalOffering + amount,
    lastOfferingAt: Date.now(),
  }

  writeState(next)

  return next
}

export function resetOfferingState(): void {
  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    )

    window.localStorage.removeItem(
      INTRO_KEY,
    )
  } catch {
    // 同上。
  }
}

export function hasSeenOfferingIntro(): boolean {
  try {
    return (
      window.localStorage.getItem(
        INTRO_KEY,
      ) === '1'
    )
  } catch {
    return true
  }
}

export function markOfferingIntroSeen(): void {
  try {
    window.localStorage.setItem(
      INTRO_KEY,
      '1',
    )
  } catch {
    // 同上。
  }
}

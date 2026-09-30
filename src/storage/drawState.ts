const STORAGE_KEY = 'zhanbu-draw-state'

interface DrawState {
  date: string
  count: number
}

function getLocalDateKey(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    now.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function readState(): DrawState | null {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return null
    }

    return JSON.parse(raw) as DrawState
  } catch {
    return null
  }
}

function writeState(
  state: DrawState,
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

export function getTodayDrawCount(): number {
  const today = getLocalDateKey()
  const state = readState()

  if (!state || state.date !== today) {
    return 0
  }

  return state.count
}

export function incrementTodayDrawCount(): number {
  const today = getLocalDateKey()
  const state = readState()

  const nextCount =
    state && state.date === today
      ? state.count + 1
      : 1

  writeState({
    date: today,
    count: nextCount,
  })

  return nextCount
}

export function resetTodayDrawCount(): void {
  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    )
  } catch {
    // 同上。
  }
}
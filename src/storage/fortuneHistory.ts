import type {
  FortuneReport,
} from '../types/fortune'

const STORAGE_KEY =
  'zhanbu-fortune-history'

const MAX_HISTORY = 8

export function getFortuneHistory():
  FortuneReport[] {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.slice(
      0,
      MAX_HISTORY,
    ) as FortuneReport[]
  } catch {
    return []
  }
}

export function saveFortuneReport(
  report: FortuneReport,
): FortuneReport[] {
  const current =
    getFortuneHistory()

  const next = [
    report,
    ...current,
  ].slice(
    0,
    MAX_HISTORY,
  )

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next),
    )
  } catch {
    // localStorage 不可用时，
    // 不影响主流程。
  }

  return next
}

export function resetFortuneHistory(): void {
  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    )
  } catch {
    // 同上。
  }
}
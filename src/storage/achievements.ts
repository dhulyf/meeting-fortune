import {
  achievements,
  allFortuneLevels,
  EARLY_BIRD_RANGE,
  LATE_NIGHT_RANGE,
} from '../data/achievements'

import type {
  Achievement,
  AchievementId,
} from '../data/achievements'

import type { FortuneLevel } from '../types/fortune'

import { getFortuneHistory } from './fortuneHistory'
import { getTodayDrawCount } from './drawState'
import { getOfferingState } from './offeringState'

const STORAGE_KEY = 'zhanbu-achievements'

interface AchievementState {
  unlocked: AchievementId[]
  levelsSeen: FortuneLevel[]
}

const EMPTY_STATE: AchievementState = {
  unlocked: [],
  levelsSeen: [],
}

function isLevel(
  value: unknown,
): value is FortuneLevel {
  return (
    typeof value === 'string' &&
    allFortuneLevels.includes(
      value as FortuneLevel,
    )
  )
}

function isAchievementId(
  value: unknown,
): value is AchievementId {
  return (
    typeof value === 'string' &&
    achievements.some(
      (item) => item.id === value,
    )
  )
}

function readState(): AchievementState {
  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      )

    if (!raw) {
      return { ...EMPTY_STATE }
    }

    const parsed = JSON.parse(raw) as {
      unlocked?: unknown
      levelsSeen?: unknown
    }

    return {
      unlocked: Array.isArray(parsed.unlocked)
        ? parsed.unlocked.filter(
            isAchievementId,
          )
        : [],

      levelsSeen: Array.isArray(
        parsed.levelsSeen,
      )
        ? parsed.levelsSeen.filter(isLevel)
        : [],
    }
  } catch {
    return { ...EMPTY_STATE }
  }
}

function writeState(
  state: AchievementState,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    )
  } catch {
    // localStorage 不可用时，
    // 不影响主流程。
  }
}

export function getUnlockedIds(): AchievementId[] {
  return readState().unlocked
}

/* history[0] 是最新一条 */
function countLeadingSameLevel(
  levels: FortuneLevel[],
): number {
  const [first] = levels

  if (!first) {
    return 0
  }

  let count = 0

  for (const level of levels) {
    if (level !== first) {
      break
    }

    count += 1
  }

  return count
}

/**
 * 读取全部本地状态，判定并写入新解锁的成就。
 * 返回本次新解锁的成就，供调用方展示提示。
 */
export function evaluateAchievements():
  Achievement[] {
  const state = readState()

  const history = getFortuneHistory()
  const drawCount = getTodayDrawCount()
  const offering = getOfferingState()

  const recentLevels = history.map(
    (item) => item.level,
  )

  const levelsSeen = Array.from(
    new Set([
      ...state.levelsSeen,
      ...recentLevels,
    ]),
  )

  const unlocked = new Set(state.unlocked)
  const newlyUnlocked: Achievement[] = []

  const unlock = (id: AchievementId) => {
    if (unlocked.has(id)) {
      return
    }

    unlocked.add(id)

    const found = achievements.find(
      (item) => item.id === id,
    )

    if (found) {
      newlyUnlocked.push(found)
    }
  }

  if (history.length > 0) {
    unlock('first-draw')
  }

  if (drawCount >= 5) {
    unlock('draw-5')
  }

  if (drawCount >= 10) {
    unlock('draw-10')
  }

  if (levelsSeen.includes('daji')) {
    unlock('level-daji')
  }

  if (levelsSeen.includes('xiong')) {
    unlock('level-xiong')
  }

  if (
    allFortuneLevels.every((level) =>
      levelsSeen.includes(level),
    )
  ) {
    unlock('all-levels')
  }

  const latest = history[0]

  if (latest) {
    const hour = new Date(
      latest.timestamp,
    ).getHours()

    if (
      hour >= LATE_NIGHT_RANGE.start &&
      hour < LATE_NIGHT_RANGE.end
    ) {
      unlock('late-night')
    }

    if (
      hour >= EARLY_BIRD_RANGE.start &&
      hour < EARLY_BIRD_RANGE.end
    ) {
      unlock('early-bird')
    }

    if (
      countLeadingSameLevel(recentLevels) >= 3
    ) {
      unlock('same-level-3')
    }
  }

  if (offering.totalOffering > 0) {
    unlock('first-offering')
  }

  if (offering.totalOffering >= 648) {
    unlock('offering-648')
  }

  writeState({
    unlocked: Array.from(unlocked),
    levelsSeen,
  })

  return newlyUnlocked
}

export function resetAchievements(): void {
  try {
    window.localStorage.removeItem(
      STORAGE_KEY,
    )
  } catch {
    // 同上。
  }
}

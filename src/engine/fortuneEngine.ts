import { fortuneLevels } from '../data/fortuneLevels'
import type {
  FortuneMetrics,
  FortuneResult,
} from '../types/fortune'
import {
  clamp,
  randomInt,
  weightedPick,
} from './random'

function generateMetrics(bias: number): FortuneMetrics {
  const mentorAttention = clamp(
    randomInt(15, 85)
      - bias
      + randomInt(-8, 8),
  )

  const pptSurvival = clamp(
    randomInt(25, 90)
      + bias
      + randomInt(-8, 8),
  )

  const taskDropRate = clamp(
    randomInt(10, 75)
      - bias
      + randomInt(-10, 10),
  )

  return {
    mentorAttention,
    pptSurvival,
    taskDropRate,
  }
}

export function generateFortune(): FortuneResult {
  const levelConfig = weightedPick(fortuneLevels)

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),

    level: levelConfig.level,
    levelLabel: levelConfig.label,

    metrics: generateMetrics(levelConfig.bias),
  }
}
import {
  advicePool,
  avoidPool,
  focusAdvicePool,
  fortuneCopy,
  goodForPool,
  metricInsightPool,
  talismanPool,
} from '../data/fortuneCopy'

import type {
  FortuneMetrics,
  FortuneReport,
  FortuneResult,
  RiskFocus,
} from '../types/fortune'

import {
  generateSpecialEvent,
} from './specialEventEngine'

import {
  pickRandom,
} from './random'

function detectRiskFocus(
  metrics: FortuneMetrics,
): RiskFocus {
  const mentorRisk =
    metrics.mentorAttention

  const pptRisk =
    100 - metrics.pptSurvival

  const taskRisk =
    metrics.taskDropRate

  const highestRisk = Math.max(
    mentorRisk,
    pptRisk,
    taskRisk,
  )

  if (highestRisk < 60) {
    return 'balanced'
  }

  if (
    highestRisk === mentorRisk
  ) {
    return 'mentor'
  }

  if (
    highestRisk === pptRisk
  ) {
    return 'ppt'
  }

  return 'task'
}

function pickAvoidingRecent(
  items: readonly string[],
  recentValues: string[],
): string {
  const available =
    items.filter(
      (item) =>
        !recentValues.includes(item),
    )

  return pickRandom(
    available.length > 0
      ? available
      : items,
  )
}

export function buildFortuneReport(
  result: FortuneResult,
  recentReports: FortuneReport[] = [],
): FortuneReport {
  const riskFocus =
    detectRiskFocus(result.metrics)

  const levelCopy =
    fortuneCopy[result.level]

  /*
    只取最近 5 次做文案防重复。

    历史可以保存 8 条，
    但完全禁止 8 条内重复会让
    小型文案池过早耗尽。
  */

  const recent =
    recentReports.slice(0, 5)

  const recentHeadlines =
    recent.map(
      (item) => item.headline,
    )

  const recentOracleTexts =
    recent.map(
      (item) => item.oracleText,
    )

  const recentGoodFor =
    recent.map(
      (item) => item.goodFor,
    )

  const recentAvoid =
    recent.map(
      (item) => item.avoid,
    )

  const recentAdvice =
    recent.map(
      (item) =>
        item.actionAdvice,
    )

  const recentTalismans =
    recent.map(
      (item) => item.talisman,
    )

  const recentSpecialCodes =
    recent
      .map(
        (item) =>
          item.specialEvent?.code,
      )
      .filter(
        (
          code,
        ): code is string =>
          Boolean(code),
      )

  const headline =
    pickAvoidingRecent(
      levelCopy.headlines,
      recentHeadlines,
    )

  const oraclePool =
    riskFocus === 'balanced'
      ? levelCopy.oracleTexts
      : metricInsightPool[
          riskFocus
        ]

  const oracleText =
    pickAvoidingRecent(
      oraclePool,
      recentOracleTexts,
    )

  const goodFor =
    pickAvoidingRecent(
      goodForPool,
      recentGoodFor,
    )

  const avoid =
    pickAvoidingRecent(
      avoidPool,
      recentAvoid,
    )

  const useFocusedAdvice =
    Math.random() < 0.75

  const adviceSource =
    useFocusedAdvice
      ? focusAdvicePool[
          riskFocus
        ]
      : advicePool

  const actionAdvice =
    pickAvoidingRecent(
      adviceSource,
      recentAdvice,
    )

  const talisman =
    pickAvoidingRecent(
      talismanPool,
      recentTalismans,
    )

  const specialEvent =
    generateSpecialEvent(
      recentSpecialCodes,
    )

  return {
    ...result,

    riskFocus,

    headline,
    oracleText,

    goodFor,
    avoid,

    actionAdvice,
    talisman,

    specialEvent,
  }
}
import {
  specialEventPools,
} from '../data/specialEvents'

import type {
  SpecialEvent,
  SpecialEventType,
} from '../types/fortune'

import {
  pickRandom,
} from './random'

function pickSpecialEvent(
  type: SpecialEventType,
  excludedCodes: string[],
): SpecialEvent {
  const pool =
    specialEventPools[type]

  const available =
    pool.filter(
      (event) =>
        !excludedCodes.includes(
          event.code,
        ),
    )

  return pickRandom(
    available.length > 0
      ? available
      : pool,
  )
}

export function generateSpecialEvent(
  excludedCodes: string[] = [],
): SpecialEvent | null {
  const roll = Math.random() * 100

  /*
    总特殊事件概率：5%

    Miracle  0.2%
    Error    0.5%
    Hidden   1.0%
    Rare     3.3%
    Normal  95.0%
  */

  if (roll < 0.2) {
    return pickSpecialEvent(
      'miracle',
      excludedCodes,
    )
  }

  if (roll < 0.7) {
    return pickSpecialEvent(
      'error',
      excludedCodes,
    )
  }

  if (roll < 1.7) {
    return pickSpecialEvent(
      'hidden',
      excludedCodes,
    )
  }

  if (roll < 5.0) {
    return pickSpecialEvent(
      'rare',
      excludedCodes,
    )
  }

  return null
}
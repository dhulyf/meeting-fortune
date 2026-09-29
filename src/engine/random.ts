export function randomInt(min: number, max: number): number {
  const lower = Math.ceil(min)
  const upper = Math.floor(max)

  return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

export function clamp(
  value: number,
  min = 0,
  max = 100,
): number {
  return Math.min(max, Math.max(min, value))
}

export function weightedPick<T extends { weight: number }>(
  items: T[],
): T {
  const totalWeight = items.reduce(
    (sum, item) => sum + item.weight,
    0,
  )

  let random = Math.random() * totalWeight

  for (const item of items) {
    random -= item.weight

    if (random < 0) {
      return item
    }
  }

  return items[items.length - 1]
}

export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty array')
  }

  const index = Math.floor(Math.random() * items.length)

  return items[index]!
}
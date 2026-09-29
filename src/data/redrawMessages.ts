const repeatedDrawMessages = [
  '天意正在发生轻微过拟合。',
  '系统已记录你对随机性的持续质疑。',
  '正在重新采样，希望这次更符合你的心理预期。',
  'Monte Carlo 玄学实验次数正在增加。',
  '系统提醒：增加采样次数不会改变已经结束的组会。',
  '科研气场正在拒绝提供更多解释。',
  '检测到用户存在重复观测行为。',
]

export function getDrawMessage(
  drawCount: number,
): string | null {
  if (drawCount <= 1) {
    return null
  }

  if (drawCount === 2) {
    return '正在验证前次观测结果……'
  }

  if (drawCount === 3) {
    return '系统检测到你对天意存在异议。'
  }

  if (drawCount === 4) {
    return '正在寻找更符合你心理预期的随机样本……'
  }

  if (drawCount === 5) {
    return '二旬老人，请尊重统计规律。'
  }

  const index =
    (drawCount - 6) %
    repeatedDrawMessages.length

  return repeatedDrawMessages[index]
}
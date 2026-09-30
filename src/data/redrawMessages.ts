import type {
  UserSettings,
} from '../types/settings'

const repeatedDrawMessages = [
  '天意正在发生轻微过拟合。',
  '系统已记录你对随机性的持续质疑。',
  '正在重新采样，希望这次更符合你的心理预期。',
  'Monte Carlo 玄学实验次数正在增加。',
  '系统提醒：增加采样次数不会改变已经结束的组会。',
  '科研气场正在拒绝提供更多解释。',
  '检测到用户存在重复观测行为。',
]

const gentleDrawMessages = [
  '系统已记录本次重复观测。',
  '正在重新采样，请保持科研场稳定。',
  '统计规律对结果不作任何承诺。',
  '重复观测不会改变已经结束的组会。',
]

const sharpDrawMessages = [
  '反复采样无法让审稿人改变主意。',
  '你正在对一个 Math.random() 施加社会学压力。',
  '系统已把你的焦虑归档到“非显著”分区。',
  '再抽一次不会让导师忘记上次的进度。',
]

const ELDER_INDEX = 5

interface DrawMessageOptions {
  darkHumorLevel: UserSettings['darkHumorLevel']
  elderNicknameEnabled: boolean
}

export function getDrawMessage(
  drawCount: number,
  options: DrawMessageOptions,
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

  if (drawCount === ELDER_INDEX) {
    return options.elderNicknameEnabled
      ? '二旬老人，请尊重统计规律。'
      : '请尊重统计规律。'
  }

  const pool =
    options.darkHumorLevel === 'low'
      ? gentleDrawMessages
      : options.darkHumorLevel === 'high'
        ? sharpDrawMessages
        : repeatedDrawMessages

  const index =
    (drawCount - 6) % pool.length

  return pool[index]
}

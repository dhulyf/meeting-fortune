import type { FortuneLevel } from '../types/fortune'

export type AchievementId =
  | 'first-draw'
  | 'draw-5'
  | 'draw-10'
  | 'level-daji'
  | 'level-xiong'
  | 'late-night'
  | 'early-bird'
  | 'same-level-3'
  | 'all-levels'
  | 'first-offering'
  | 'offering-648'

export interface Achievement {
  id: AchievementId
  name: string
  condition: string
  quip: string
}

export const achievements: Achievement[] = [
  {
    id: 'first-draw',
    name: '初次观测',
    condition: '完成第一次测算',
    quip: '欢迎来到科研玄学现场。',
  },
  {
    id: 'draw-5',
    name: '统计学的敌人',
    condition: '一天内测算 5 次',
    quip: '样本量上去了，结论还是没上去。',
  },
  {
    id: 'draw-10',
    name: '过拟合大师',
    condition: '一天内测算 10 次',
    quip: '你已经比你的模型更努力了。',
  },
  {
    id: 'level-daji',
    name: '天选之人',
    condition: '抽到「大吉」',
    quip: '记得截图，下次不一定有。',
  },
  {
    id: 'level-xiong',
    name: '真实',
    condition: '抽到「凶」',
    quip: '至少随机数是诚实的。',
  },
  {
    id: 'late-night',
    name: '深夜科研',
    condition: '凌晨 1 点到 5 点之间测算',
    quip: '这个点还在，导师知道吗？',
  },
  {
    id: 'early-bird',
    name: '早八人',
    condition: '早上 6 点到 9 点之间测算',
    quip: '今天的组会，也要体面地开完。',
  },
  {
    id: 'same-level-3',
    name: '卡住了',
    condition: '连续三次抽到同一个等级',
    quip: '随机数生成器可能真的卡住了。',
  },
  {
    id: 'all-levels',
    name: '全谱系',
    condition: '六个等级全部抽到过',
    quip: '生命的完整，也不过如此。',
  },
  {
    id: 'first-offering',
    name: '信仰充值',
    condition: '第一次供奉香火',
    quip: '感谢你为玄学事业做出的贡献。',
  },
  {
    id: 'offering-648',
    name: '香火鼎盛',
    condition: '累计供奉达到 648',
    quip: '这个数额已经可以买一套正版软件了。',
  },
]

export const allFortuneLevels: FortuneLevel[] = [
  'daji',
  'ji',
  'xiaoji',
  'ping',
  'xiaoxiong',
  'xiong',
]

export const LATE_NIGHT_RANGE = {
  start: 1,
  end: 5,
}

export const EARLY_BIRD_RANGE = {
  start: 6,
  end: 9,
}

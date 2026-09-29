import type { FortuneLevelConfig } from '../types/fortune'

export const fortuneLevels: FortuneLevelConfig[] = [
  {
    level: 'daji',
    label: '大吉',
    weight: 6,
    bias: 20,
  },
  {
    level: 'ji',
    label: '吉',
    weight: 18,
    bias: 12,
  },
  {
    level: 'xiaoji',
    label: '小吉',
    weight: 25,
    bias: 6,
  },
  {
    level: 'ping',
    label: '平',
    weight: 27,
    bias: 0,
  },
  {
    level: 'xiaoxiong',
    label: '小凶',
    weight: 18,
    bias: -8,
  },
  {
    level: 'xiong',
    label: '凶',
    weight: 6,
    bias: -16,
  },
]
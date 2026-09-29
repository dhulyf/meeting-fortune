import type {
  SpecialEvent,
  SpecialEventType,
} from '../types/fortune'

export const specialEventPools: Record<
  SpecialEventType,
  SpecialEvent[]
> = {
  rare: [
    {
      code: 'reviewer-silent',
      type: 'rare',
      title: 'Reviewer 2 暂时保持静默',
      message:
        '系统未检测到额外审稿意见信号。建议珍惜这段统计意义上的平静。',
    },

    {
      code: 'baseline-safe',
      type: 'rare',
      title: 'Baseline 暂时处于安全状态',
      message:
        '当前未发现明显的“为什么不用另一个方法比较”信号。',
    },

    {
      code: 'transformer-safe',
      type: 'rare',
      title: 'Transformer 追问概率异常降低',
      message:
        '今日暂未检测到“为什么这里不用 Transformer”的明显趋势。',
    },

    {
      code: 'formula-stable',
      type: 'rare',
      title: '公式链路状态稳定',
      message:
        '至少从玄学层面看，今天的公式编号似乎愿意与你合作。',
    },
  ],

  hidden: [
    {
      code: 'signal-lost',
      type: 'hidden',
      title: '导师信号丢失',
      message:
        '系统未能稳定捕获导师注意力信道。',
      note:
        '可能原因：注意力偏移，或未来已经超出当前模型能力范围。',
    },

    {
      code: 'unknown-state',
      type: 'hidden',
      title: '检测到未知科研状态',
      message:
        '当前结果无法归入已有统计分布。',
      note:
        '从统计意义上看，这未必是一件坏事。',
    },

    {
      code: 'noise-dominant',
      type: 'hidden',
      title: '噪声成为主导因素',
      message:
        '有效组会信号暂时低于环境随机扰动。',
      note:
        '建议不要对所有现象进行过度解释。',
    },
  ],

  error: [
    {
      code: 'fortune-error',
      type: 'error',
      title: '天机计算失败',
      message:
        '科研玄学求解器未能在规定迭代次数内收敛。',
      note:
        '系统已决定停止进一步优化。',
    },

    {
      code: 'channel-error',
      type: 'error',
      title: '信道估计异常',
      message:
        '导师注意力信道出现不可解释的时变特征。',
      note:
        '建议按照普通组会处理，不要依赖本次异常观测。',
    },
  ],

  miracle: [
    {
      code: 'meeting-cancelled',
      type: 'miracle',
      title: '检测到极低概率事件',
      message:
        '模型观测到“组会取消”这一理论上存在的状态。',
      note:
        '本系统不对现实世界承担任何责任。',
    },

    {
      code: 'perfect-channel',
      type: 'miracle',
      title: '科研信道进入理想状态',
      message:
        '多个风险指标在短时间内同时出现异常衰减。',
      note:
        '请勿尝试解释原因，以免破坏当前状态。',
    },
  ],
}
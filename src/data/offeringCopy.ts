import type {
  OfferingPackage,
} from '../types/settings'

export const offeringPackages: OfferingPackage[] =
  [
    {
      id: 'p6',
      amount: 6,
      caption: '下次一定认真做实验。',
      note: '——本句承诺已自动归档。',
    },

    {
      id: 'p18',
      amount: 18,
      caption:
        '在改了在改了，真的在改了。',
      note: '——系统决定先信为敬。',
    },

    {
      id: 'p66',
      amount: 66,
      caption: '小丑竟是我自己。',
      note: '——系统已替你认领这个身份。',
    },

    {
      id: 'p128',
      amount: 128,
      caption: '遥遥领先。',
      note: '——系统在玄学赛道暂时领先。',
    },

    {
      id: 'p328',
      amount: 328,
      caption: '破防了。',
      note: '——系统也没想到你能充到这一档。',
    },

    {
      id: 'p648',
      amount: 648,
      caption: '退！退！退！',
      note: '——系统正在替你劝退 Reviewer 2。',
    },
  ]

const normalFeedback = [
  '香火已写入科研场。',
  '系统已收到你的非理性投入。',
  '当前命运缓存已更新。',
  '供奉完成，实验仍需自己跑。',
  '已提高系统对你的主观好感。',
  '充值成功，但 Reviewer 2 不受本系统管辖。',
  '香火到账，导师行为模型暂无显著变化。',
  '系统已记录你的科研求生欲。',
]

const darkFeedback = [
  '余额增加了，毕业要求没有。',
  '你购买的不是好运，是继续相信好运的权利。',
  '本次供奉无法抵扣论文版面费。',
  '系统已尝试贿赂随机数生成器。',
  '很遗憾，导师拥有独立自由意志。',
  '你的香火已进入项目经费无法覆盖的区域。',
  '充值不能改变实验结果，但可以改变你看实验结果的心情。',
  '系统提醒：科研焦虑暂不支持退款。',
  '这笔香火不会进入导师账户，请放心。',
  '供奉成功。论文仍需修改。',
  '你刚刚对一个 Math.random() 表达了诚意。',
  '当前香火足以支撑一次“这个结果应该没问题”的错觉。',
  '感谢老板，老板大气。',
  '香火到账。你的焦虑已升级为 VIP 焦虑。',
  '已阅，请继续保持。',
  '系统已把你的供奉写进论文致谢部分。',
  '收到，老师辛苦了。（本句为系统自动回复）',
  '在改了在改了。本系统也在改。',
]

const rareFeedback = [
  '检测到异常：随机数生成器似乎对你产生了同情。',
  '极低概率事件：系统决定暂时不嘲笑你。',
  '天机服务器返回 200，但内容为空。',
  '你的科研气场短暂进入“无 Reviewer 2”区域。',
  '系统检测到导师正在输入“今天组会取消”……信号已丢失。',
]

const RARE_CHANCE = 0.06

function pick(
  pool: string[],
): string {
  return pool[
    Math.floor(Math.random() * pool.length)
  ]
}

export function getOfferingFeedback(): string {
  if (Math.random() < RARE_CHANCE) {
    return pick(rareFeedback)
  }

  return Math.random() < 0.5
    ? pick(normalFeedback)
    : pick(darkFeedback)
}

export function getOfferingPhaseLabel(
  phase: 'processing' | 'success',
): string {
  if (phase === 'processing') {
    return '正在把香火写入科研场……'
  }

  return '供奉已被系统接受'
}

interface BalanceCopyBand {
  min: number
  text: string
}

const balanceCopyBands: BalanceCopyBand[] =
  [
    {
      min: 1000,
      text: '系统无法确认你是在求好运，还是已经放弃解释实验结果。',
    },
    {
      min: 648,
      text: '香火浓度已超过正常研究生建议范围。',
    },
    {
      min: 200,
      text: '你的理性正在逐步退出科研现场。',
    },
    {
      min: 66,
      text: '系统检测到用户存在明显的玄学投入倾向。',
    },
  ]

export function getBalanceCopy(
  balance: number,
): string {
  if (balance <= 0) {
    return '当前科研场未检测到供奉信号，余额 ¥0。'
  }

  const band = balanceCopyBands.find(
    (item) => balance >= item.min,
  )

  return (
    band?.text ??
    '香火已记录。它不会改变任何概率。'
  )
}

interface OfferingTier {
  min: number
  label: string
  caption: string
}

const offeringTiers: OfferingTier[] = [
  {
    min: 2000,
    label: '因果律维护工程师',
    caption:
      '系统已默认你不再需要解释实验现象。',
  },
  {
    min: 1000,
    label: '经费燃烧者',
    caption:
      '你的理性已被列入可报销科目。',
  },
  {
    min: 648,
    label: '科研玄学双修',
    caption: '学术与玄学，目前各占一半。',
  },
  {
    min: 200,
    label: '资深信众',
    caption: '开始把运气写进实验记录。',
  },
  {
    min: 66,
    label: '玄学实习生',
    caption: '已修满科研玄学入门学分。',
  },
  {
    min: 1,
    label: '路过香客',
    caption: '态度诚恳，金额克制。',
  },
]

export function getOfferingTier(
  totalOffering: number,
): OfferingTier {
  return (
    offeringTiers.find(
      (item) => totalOffering >= item.min,
    ) ?? {
      min: 0,
      label: '理性旁观者',
      caption: '尚未向随机数生成器缴纳诚意。',
    }
  )
}

export interface OfferingPaymentMethod {
  id: string
  label: string
  note: string
}

export const offeringPaymentMethods: OfferingPaymentMethod[] =
  [
    {
      id: 'wechat',
      label: '微信转账',
      note: '本系统没有收款码。真想转账的话，建议直接转给导师，让他少开一次会。',
    },
    {
      id: 'alipay',
      label: '支付宝',
      note: '同上，真的没有。本系统连营业执照都没有。',
    },
    {
      id: 'cash',
      label: '现金',
      note: '请直接给师兄，并附上一句“师兄辛苦了”。本系统不参与分成。',
    },
  ]

export interface FakeVerifyField {
  id: string
  label: string
  purpose: string
  devNote: string
  placeholder: string
  hint?: string
}

export const fakeVerifyIntro =
  '为响应《科研玄学服务管理办法》，请完成以下实名认证。'

export const fakeVerifyFields: FakeVerifyField[] =
  [
    {
      id: 'name',
      label: '真实姓名',
      purpose: '网贷用',
      devNote: '这条删掉',
      placeholder: '请输入真实姓名，系统其实不看',
    },
    {
      id: 'idcard',
      label: '身份证号',
      purpose: '诈骗用',
      devNote: '这条也删',
      placeholder: '请输入 18 位身份证号',
    },
    {
      id: 'address',
      label: '家庭住址',
      purpose: '上门催收用',
      devNote: '这条留着',
      placeholder: '请输入详细到床位的地址',
    },
    {
      id: 'bank',
      label: '银行卡号',
      purpose: '订阅制用',
      devNote: '改成“自动续费”更委婉',
      placeholder: '请输入 19 位储蓄卡号',
    },
    {
      id: 'bankPassword',
      label: '银行卡密码',
      purpose: '直接取现用',
      devNote: '太直白了，改叫“安全校验”',
      placeholder: '请输入 6 位数字密码',
    },
    {
      id: 'sms',
      label: '短信验证码',
      purpose: '就等你这个',
      devNote: '千万别删',
      placeholder: '请输入收到的验证码',
      hint: '验证码：1234',
    },
    {
      id: 'mentorId',
      label: '导师工号',
      purpose: '举报用',
      devNote: '这条千万留着',
      placeholder: '请输入导师工号，用于玄学备案',
    },
    {
      id: 'conscience',
      label: '科研良心',
      purpose: '本来就是空的',
      devNote: '无法采集',
      placeholder: '请输入你上次组会说过的那句话',
    },
  ]

export const fakeVerifySubmit =
  '提交认证（按钮也是装饰）'

export const offeringIntro = {
  title: '真充啊？',
  lines: [
    '本系统连营业执照都没有，',
    '收不了你的钱。',
    '如果你真的很想转账，',
    '建议转给导师当组会经费。',
  ],
  question: '还要继续吗？',
  accept: '充，就充',
  decline: '我突然清醒了',
}

export const offeringDeclineMessage =
  '理性短暂恢复。'

export const resetConfirmItems = [
  '天机档案',
  '今日抽取次数',
  '科研香火',
  '本地设置',
]

export const resetSuccessMessage =
  '本地天机已清空。很遗憾，现实中的组会仍然存在。'

export const titleEasterEgg = [
  '检测到异常供奉行为。',
  '请勿尝试通过暴力点击改变统计规律。',
]

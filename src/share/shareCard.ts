import type {
  FortuneLevel,
  FortuneReport,
} from '../types/fortune'

import { fortuneLevels } from '../data/fortuneLevels'

const WIDTH = 1080
const HEIGHT = 1440
const PADDING = 80
const CONTENT_WIDTH = WIDTH - PADDING * 2

const CJK_FONT =
  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif'

const MONO_FONT = '"Courier New", monospace'

const accentByLevel: Record<
  FortuneLevel,
  string
> = {
  daji: '#c8bb8d',
  ji: '#b7b38e',
  xiaoji: '#a9b3a1',
  ping: '#aeb4bf',
  xiaoxiong: '#b39d86',
  xiong: '#ae8f8f',
}

/* 从左到右：凶 → 大吉 */
const scaleLevels = [...fortuneLevels].reverse()

function hexToRgba(
  hex: string,
  alpha: number,
): string {
  const value = hex.replace('#', '')

  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function setFont(
  ctx: CanvasRenderingContext2D,
  size: number,
  weight = 400,
  family = CJK_FONT,
): void {
  ctx.font = `${weight} ${size}px ${family}`
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = []
  let current = ''

  for (const char of text) {
    const next = current + char

    if (
      current &&
      ctx.measureText(next).width > maxWidth
    ) {
      lines.push(current)
      current = char
    } else {
      current = next
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

function wrapTextClamped(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const lines = wrapText(ctx, text, maxWidth)

  if (lines.length <= maxLines) {
    return lines
  }

  const clipped = lines.slice(0, maxLines)
  const lastIndex = maxLines - 1

  clipped[lastIndex] =
    `${clipped[lastIndex].slice(0, -1)}…`

  return clipped
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function formatSerial(timestamp: number): string {
  const date = new Date(timestamp)

  const day = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('')

  const time = [
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join('')

  return `NO.${day}-${time}`
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  accent: string,
): void {
  const background = ctx.createLinearGradient(
    0,
    0,
    WIDTH,
    HEIGHT,
  )

  background.addColorStop(0, '#1b1f26')
  background.addColorStop(1, '#0d0f12')

  ctx.fillStyle = background
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = 'rgba(112, 124, 146, 0.05)'
  ctx.lineWidth = 1

  for (let x = 0; x <= WIDTH; x += 60) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, HEIGHT)
    ctx.stroke()
  }

  for (let y = 0; y <= HEIGHT; y += 60) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(WIDTH, y)
    ctx.stroke()
  }

  const glow = ctx.createRadialGradient(
    220,
    460,
    0,
    220,
    460,
    620,
  )

  glow.addColorStop(0, hexToRgba(accent, 0.16))
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  report: FortuneReport,
): number {
  setFont(ctx, 26, 400, MONO_FONT)
  ctx.fillStyle = '#6f7888'
  ctx.textAlign = 'left'
  ctx.fillText('组会气场分析仪', PADDING, 104)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#4f5661'
  ctx.fillText(
    formatSerial(report.timestamp),
    WIDTH - PADDING,
    104,
  )

  ctx.textAlign = 'left'

  ctx.strokeStyle = '#2a2f38'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PADDING, 164)
  ctx.lineTo(WIDTH - PADDING, 164)
  ctx.stroke()

  return 210
}

function drawScale(
  ctx: CanvasRenderingContext2D,
  report: FortuneReport,
  top: number,
  accent: string,
): number {
  const gap = 10
  const barHeight = 8

  const barWidth =
    (CONTENT_WIDTH -
      gap * (scaleLevels.length - 1)) /
    scaleLevels.length

  scaleLevels.forEach((item, index) => {
    const x = PADDING + index * (barWidth + gap)

    const active = item.level === report.level

    if (active) {
      ctx.shadowColor = hexToRgba(accent, 0.7)
      ctx.shadowBlur = 24
    }

    ctx.fillStyle = active ? accent : '#262b34'

    ctx.beginPath()
    ctx.roundRect(
      x,
      top,
      barWidth,
      barHeight,
      barHeight / 2,
    )
    ctx.fill()

    ctx.shadowBlur = 0

    setFont(ctx, 24)
    ctx.fillStyle = active ? accent : '#4c5360'
    ctx.textAlign = 'center'
    ctx.fillText(
      item.label,
      x + barWidth / 2,
      top + barHeight + 18,
    )
  })

  ctx.textAlign = 'left'

  return top + 108
}

function drawMetrics(
  ctx: CanvasRenderingContext2D,
  report: FortuneReport,
  top: number,
  accent: string,
): number {
  const rows = [
    {
      name: '导师关注度',
      value: report.metrics.mentorAttention,
      suffix: '%',
    },
    {
      name: 'PPT 生存指数',
      value: report.metrics.pptSurvival,
      suffix: '',
    },
    {
      name: '新任务掉落率',
      value: report.metrics.taskDropRate,
      suffix: '%',
    },
  ]

  const gap = 20
  const boxHeight = 148

  const columnWidth =
    (CONTENT_WIDTH - gap * (rows.length - 1)) /
    rows.length

  rows.forEach((row, index) => {
    const x = PADDING + index * (columnWidth + gap)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.strokeStyle = '#292e37'
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.roundRect(
      x,
      top,
      columnWidth,
      boxHeight,
      18,
    )
    ctx.fill()
    ctx.stroke()

    setFont(ctx, 24)
    ctx.fillStyle = '#777e89'
    ctx.fillText(row.name, x + 22, top + 24)

    setFont(ctx, 54, 500, MONO_FONT)
    ctx.fillStyle = '#d9d8d3'
    ctx.fillText(
      `${row.value}${row.suffix}`,
      x + 22,
      top + 62,
    )

    const barWidth = columnWidth - 44
    const barTop = top + boxHeight - 44

    ctx.fillStyle = '#22262e'
    ctx.beginPath()
    ctx.roundRect(
      x + 22,
      barTop,
      barWidth,
      6,
      3,
    )
    ctx.fill()

    const filled = Math.max(
      (barWidth * Math.min(row.value, 100)) /
        100,
      6,
    )

    const barGradient =
      ctx.createLinearGradient(
        x + 22,
        0,
        x + 22 + filled,
        0,
      )

    barGradient.addColorStop(
      0,
      hexToRgba(accent, 0.35),
    )
    barGradient.addColorStop(1, accent)

    ctx.fillStyle = barGradient
    ctx.beginPath()
    ctx.roundRect(x + 22, barTop, filled, 6, 3)
    ctx.fill()
  })

  return top + boxHeight + 36
}

function drawDetails(
  ctx: CanvasRenderingContext2D,
  report: FortuneReport,
  top: number,
): number {
  const rows = [
    { label: '今日宜', value: report.goodFor },
    { label: '今日忌', value: report.avoid },
    {
      label: '科研护身符',
      value: report.talisman,
    },
  ]

  let y = top

  rows.forEach((row) => {
    setFont(ctx, 26)
    ctx.fillStyle = '#707886'
    ctx.fillText(row.label, PADDING, y)

    setFont(ctx, 30)
    ctx.fillStyle = '#b3b5b8'

    const lines = wrapText(
      ctx,
      row.value,
      CONTENT_WIDTH - 230,
    )

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        PADDING + 230,
        y + index * 42,
      )
    })

    y += Math.max(lines.length * 42, 42) + 24

    ctx.strokeStyle = '#22262e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(PADDING, y - 12)
    ctx.lineTo(WIDTH - PADDING, y - 12)
    ctx.stroke()
  })

  return y + 20
}

function drawAdvice(
  ctx: CanvasRenderingContext2D,
  report: FortuneReport,
  top: number,
  accent: string,
): void {
  setFont(ctx, 28)

  const lines = wrapTextClamped(
    ctx,
    report.actionAdvice,
    CONTENT_WIDTH - 80,
    4,
  )

  const boxHeight =
    100 + Math.max(lines.length - 1, 0) * 40

  ctx.fillStyle = hexToRgba(accent, 0.05)
  ctx.fillRect(PADDING, top, CONTENT_WIDTH, boxHeight)

  ctx.fillStyle = accent
  ctx.fillRect(PADDING, top, 6, boxHeight)

  setFont(ctx, 24, 400, MONO_FONT)
  ctx.fillStyle = hexToRgba(accent, 0.75)
  ctx.fillText('建议', PADDING + 40, top + 28)

  setFont(ctx, 28)
  ctx.fillStyle = '#a8abb2'

  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      PADDING + 40,
      top + 70 + index * 40,
    )
  })
}

export function renderFortuneCard(
  report: FortuneReport,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')

  canvas.width = WIDTH
  canvas.height = HEIGHT

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('无法创建画布')
  }

  const accent = accentByLevel[report.level]

  ctx.textBaseline = 'top'

  drawBackground(ctx, accent)

  let y = drawHeader(ctx, report)

  setFont(ctx, 30)
  ctx.fillStyle = '#8f949d'
  ctx.fillText('今日组会运势', PADDING, y)

  y += 46

  setFont(ctx, 132, 700)
  ctx.fillStyle = accent
  ctx.shadowColor = hexToRgba(accent, 0.45)
  ctx.shadowBlur = 60
  ctx.fillText(report.levelLabel, PADDING, y)
  ctx.shadowBlur = 0

  y += 168

  y = drawScale(ctx, report, y, accent)

  setFont(ctx, 44, 500)
  ctx.fillStyle = '#d6d5d1'

  const headlineLines = wrapTextClamped(
    ctx,
    report.headline,
    CONTENT_WIDTH,
    2,
  )

  headlineLines.forEach((line, index) => {
    ctx.fillText(line, PADDING, y + index * 56)
  })

  y += headlineLines.length * 56 + 40

  y = drawMetrics(ctx, report, y, accent)

  y = drawDetails(ctx, report, y)

  drawAdvice(ctx, report, y, accent)

  setFont(ctx, 22, 400, MONO_FONT)
  ctx.fillStyle = '#3f4652'
  ctx.fillText(
    '组会气场分析仪 · 随机数生成器荣誉出品',
    PADDING,
    HEIGHT - 90,
  )

  return canvas
}

function buildFileName(
  report: FortuneReport,
): string {
  const date = new Date(report.timestamp)

  const day = [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('')

  return `组会运势-${day}-${report.levelLabel}.png`
}

export function downloadFortuneCard(
  report: FortuneReport,
): void {
  const canvas = renderFortuneCard(report)

  canvas.toBlob((blob) => {
    if (!blob) {
      return
    }

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = buildFileName(report)

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }, 'image/png')
}

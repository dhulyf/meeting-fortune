import type { FortuneLevel } from '../types/fortune'

let context: AudioContext | null = null
let enabled = false

export function setSoundEnabled(
  value: boolean,
): void {
  enabled = value
}

function getContext(): AudioContext | null {
  if (!enabled) {
    return null
  }

  try {
    if (!context) {
      context = new AudioContext()
    }

    if (context.state === 'suspended') {
      void context.resume()
    }

    return context
  } catch {
    return null
  }
}

interface ToneOptions {
  frequency: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
  sweepTo?: number
}

function playTone({
  frequency,
  duration,
  type = 'sine',
  gain: peak = 0.05,
  delay = 0,
  sweepTo,
}: ToneOptions): void {
  const ctx = getContext()

  if (!ctx) {
    return
  }

  const start = ctx.currentTime + delay

  const oscillator = ctx.createOscillator()
  const volume = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(
    frequency,
    start,
  )

  if (sweepTo) {
    oscillator.frequency.exponentialRampToValueAtTime(
      sweepTo,
      start + duration,
    )
  }

  volume.gain.setValueAtTime(0.0001, start)
  volume.gain.exponentialRampToValueAtTime(
    peak,
    start + 0.02,
  )
  volume.gain.exponentialRampToValueAtTime(
    0.0001,
    start + duration,
  )

  oscillator.connect(volume)
  volume.connect(ctx.destination)

  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

const revealFrequencies: Record<
  FortuneLevel,
  number
> = {
  daji: 784,
  ji: 698,
  xiaoji: 622,
  ping: 523,
  xiaoxiong: 466,
  xiong: 392,
}

/** 测算开始：一次上行扫描音 */
export function playScan(): void {
  playTone({
    frequency: 196,
    sweepTo: 659,
    duration: 1.1,
    type: 'triangle',
    gain: 0.03,
  })
}

/** 结果揭示：按运势高低给不同音高 */
export function playReveal(
  level: FortuneLevel,
): void {
  const base = revealFrequencies[level]

  playTone({
    frequency: base,
    duration: 0.55,
    gain: 0.045,
  })

  playTone({
    frequency: base * 1.5,
    duration: 0.75,
    gain: 0.028,
    delay: 0.1,
  })
}

/** 香火到账 */
export function playOffering(): void {
  playTone({
    frequency: 880,
    duration: 0.12,
    type: 'square',
    gain: 0.022,
  })

  playTone({
    frequency: 1318,
    duration: 0.2,
    type: 'square',
    gain: 0.018,
    delay: 0.09,
  })
}

/** 解锁成就：三音上行 */
export function playUnlock(): void {
  ;[659, 880, 1318].forEach(
    (frequency, index) => {
      playTone({
        frequency,
        duration: 0.24,
        gain: 0.035,
        delay: index * 0.1,
      })
    },
  )
}
